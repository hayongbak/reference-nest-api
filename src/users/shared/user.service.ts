import { Injectable, Inject } from '@nestjs/common';
import { USER_REPO, USER_GAME_REPO, RESET_TOKEN_REPO } from 'src/shared/constants';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { SignupUserReq, SignupUserRes } from '../signup/data/signup-user.dto';
import { CryptoService } from 'src/authentication/shared/crypto.service';
import { AuthenticationService } from 'src/authentication/shared/authentication.service';
import { LoginUserReq, LoginUserRes } from '../login/data/login-user.dto';
import { GetUserProfileDto, PutUserProfileReq } from '../user/data/user-profile.dto';
import { AvatarService } from './avatar.service';
import { GetGameAccountRes, PostGameAccountReq } from '../user/data/game-account.dto';
import { UserGame } from './user-game.entity';
import * as configuration from 'src/config.json';
import { GameService } from 'src/games/game/game.service';
import { Game } from 'src/games/game/data/game.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SteamBotService } from './steam-bot.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MailService } from 'src/email/mail.service';
import { ResetToken } from './reset-token.entity';
import { ResetTokenDto } from '../user/data/reset-token.dto';
import { PostPasswordResetReq } from '../login/data/reset.dto';

@Injectable()
export class UserService {


    constructor(@Inject(USER_REPO) private userRepo: Repository<User>,
        @Inject(USER_GAME_REPO) private userGameRepo: Repository<UserGame>,
        @Inject(RESET_TOKEN_REPO) private resetTokenRepo: Repository<ResetToken>,
        private crypto: CryptoService,
        private authService: AuthenticationService,
        private avatar: AvatarService,
        private gameService: GameService,
        private schedulerRegistry: SchedulerRegistry,
        private steamBot: SteamBotService,
        private mailService: MailService) { }

    public async registerUser(newUser: SignupUserReq): Promise<SignupUserRes> {
        let entity = this.userRepo.create(newUser);
        entity.password = await this.crypto.hashPassword(newUser.user_password);
        entity.user_avatar_url = await this.avatar.generateRandomAvatarUrl();
        await this.userRepo.insert(entity);
        let jwtToken = await this.authService.createJwtToken({ username: entity.user_name, sub: entity.user_id });
        return new SignupUserRes(entity, jwtToken);
    }
    /**
     * Verifies the user and password information. Will return a "null" reference if the user or the passwords are not correct.
     * Returns an object with jwt token if everything is fine.
     * @param user the useremail and password coming in
     */
    public async verifyUser(user: LoginUserReq): Promise<LoginUserRes> {
        let userindb = await this.userRepo.findOne({ user_email: user.user_email });
        if (!userindb) { return null; }

        let passwordsAreEqual = await this.crypto.verifyHashes(userindb.password, user.user_password);
        if (!passwordsAreEqual) { return null; }

        let jwtToken = await this.authService.createJwtToken({ username: userindb.user_name, sub: userindb.user_id });
        return new LoginUserRes(userindb, jwtToken);
    }

    public async getUserProfileById(id: string): Promise<GetUserProfileDto> {
        let user = await this.userRepo.findOne(id);
        if (!user) { return null; }
        return new GetUserProfileDto(user);
    }

    async getGameAccountsForUser(id: string, offset: number): Promise<GetGameAccountRes[]> {
        let gameAccounts = (await this.userGameRepo.createQueryBuilder('ug')
            .innerJoin('users', 'u', 'ug.user_id=u.user_id')
            .where('u.user_id = :user_id', { user_id: id })
            .offset(offset)
            .limit(configuration.queryParams.nrOfGameAccounts)
            .orderBy('g.game_name', 'ASC')
            .innerJoin('games', 'g', 'ug.game_id=g.game_id')
            .select('ug.game_id', 'game_id')
            .addSelect('g.game_name', 'game_name')
            .addSelect('ug.user_id', 'user_id')
            .addSelect('ug.user_game_accountname', 'user_game_accountname')
            .addSelect('ug.user_game_accountid', 'user_game_accountid')
            .addSelect('ug.created', 'created')
            .execute()) as UserGame[];

        return gameAccounts.map(ug => new GetGameAccountRes(ug));
    }

    async getGameAccountForUserAndGame(userId: string, gameId: string): Promise<GetGameAccountRes> {
        let gameAccount = await this.userGameRepo.findOne({ user_id: userId, game_id: gameId })
        return new GetGameAccountRes(gameAccount);
    }

    async addGameAccountForUser(id: string, gameAccount: PostGameAccountReq): Promise<boolean> {
        try {
            let entity: UserGame = await this.userGameRepo.findOne({ user_id: gameAccount.user_id, game_id: gameAccount.game_id });

            if (!entity) {
                entity = new UserGame();
                entity.game_id = gameAccount.game_id;
                entity.user_id = gameAccount.user_id;
                entity.user_game_accountname = gameAccount.game_account_name;
                await this.userGameRepo.insert(entity);
            } else {
                await this.userGameRepo.update(entity, { user_game_accountname: gameAccount.game_account_name });
            }

            let game = await this.gameService.getFullGameById(entity.game_id);
            this.getAndInsertGameAccountIdForAccountName(gameAccount, game); // Don't wait for the game account id - async calls
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    private async getAndInsertGameAccountIdForAccountName(gameAccount: PostGameAccountReq, game: Game, retryTimeout: number = 2 * 1000 /* ms */) {
        let obs: Observable<string>;
        switch (game.bot_type) {
            case "steam":
                obs = this.steamBot.getSteamIdFromSteamUsername(gameAccount.game_account_name, game.bot_api_endpoint)
                break;
            default:
                break;
        }
        obs.pipe(
            switchMap(async accountId => await this.userGameRepo.update({ user_id: gameAccount.user_id, game_id: gameAccount.game_id }, { user_game_accountid: accountId }))
        ).subscribe(
            () => { },
            error => {
                if (retryTimeout < configuration.steamBot.maxExponentialTimeout * 1000) {
                    const timeout = setTimeout(() => this.getAndInsertGameAccountIdForAccountName(gameAccount, game, retryTimeout * 2), retryTimeout);

                    if (this.schedulerRegistry.getTimeouts().indexOf(`retry-${game.game_id}-${gameAccount.game_account_name}`) >= 0) {
                        this.schedulerRegistry.deleteTimeout(`retry-${game.game_id}-${gameAccount.game_account_name}`);
                    }
                    this.schedulerRegistry.addTimeout(`retry-${game.game_id}-${gameAccount.game_account_name}`, timeout);
                }
                else {
                    this.schedulerRegistry.deleteTimeout(`retry-${game.game_id}-${gameAccount.game_account_name}`);
                }
            }
        );
    }

    async updateUserProfileById(id: string, updatedUser: PutUserProfileReq): Promise<boolean> {
        let entityUser = Object.assign(new User(), updatedUser);
        let updateResult = await this.userRepo.update(id, entityUser);
        return true;
    }

    public async doesUserExistWithProperty(userName: string, propertyName: string): Promise<boolean> {
        let needle = {};
        needle[propertyName] = userName;
        let entity = await this.userRepo.findOne(needle);
        return !!entity;
    }

    public async requestResetPassword(email: string): Promise<ResetTokenDto> {
        let user = await this.userRepo.findOne({user_email: email});
        if(!user){ return null; }

        let numberOfRequests = await this.resetTokenRepo.count({user_id: user.user_id});
        if(numberOfRequests > 5){ return null}; // something is up - someone is spamming the reset token option

        let randomToken = this.crypto.createRandomToken(36);
        let resetToken = this.resetTokenRepo.create();
        resetToken.token = randomToken;
        resetToken.user_email = user.user_email;
        resetToken.user_id = user.user_id;
        await this.resetTokenRepo.insert(resetToken);
        return {token: randomToken, user_email : user.user_email, user_name : user.user_name};
    }

    public async verifyToken(resetToken: string, email: string): Promise<ResetTokenDto> {
        let resetTokenObject = (await this.resetTokenRepo.createQueryBuilder('rt')
        .innerJoin('users', 'u', 'rt.user_id=u.user_id')
        .limit(1)
        .where('rt.token = :resetToken AND rt.user_email = :email', { resetToken: resetToken, email: email })
        .select('rt.token', 'token')
        .addSelect('rt.user_email', 'user_email')
        .addSelect('u.user_name', 'user_name')
        .execute())[0] as ResetTokenDto;

        if(!resetTokenObject){return null;}
        return resetTokenObject;
    }

    public async resetPassword(passwordReset: PostPasswordResetReq): Promise<boolean>{
        
        let user = await this.userRepo.findOne({user_email: passwordReset.user_email});
        let resetToken = await this.resetTokenRepo.findOne({token: passwordReset.token});

        if(resetToken.user_email !== user.user_email){return false;}
        // Here we know the reset was a valid request

        let newPasswordHash =  await this.crypto.hashPassword(passwordReset.user_password);
        await this.userRepo.update({user_id: user.user_id}, {password: newPasswordHash});

        await this.resetTokenRepo.delete({user_email: passwordReset.user_email});
        return true;
    }


}
