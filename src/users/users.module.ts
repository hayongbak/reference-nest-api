import { Module, HttpModule } from '@nestjs/common';
import { UserService } from '../users/shared/user.service';
import { SignupController } from '../users/signup/signup.controller';
import { USER_REPO, DB_CONNECTION, USER_GAME_REPO, RESET_TOKEN_REPO } from 'src/shared/constants';
import { Connection, Repository } from 'typeorm';
import { User } from '../users/shared/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { IsUniquePropertyConstraint } from '../users/helpers/unique-property.constraint';
import { IsPasswordConfirmedConstraint } from '../users/helpers/password-confirmed.constraint';
import { CaptchaService } from '../users/shared/captcha.service';
import { IsCaptchaCorrectConstraint } from '../users/helpers/captcha-correct.constraint';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { LoginController } from './login/login.controller';
import { ChecktokenController } from './checktoken/checktoken.controller';
import { UserController } from './user/user.controller';
import { AvatarService } from './shared/avatar.service';
import { AvatarCronJob } from './shared/avatar-job.cron';
import { UserGame } from './shared/user-game.entity';
import { SteamBotService } from './shared/steam-bot.service';
import { GamesModule } from 'src/games/games.module';
import { EmailModule } from 'src/email/email.module';
import { ResetToken } from './shared/reset-token.entity';

export const userDbProviders = [
    {
      provide: USER_REPO,
      useFactory: (connection: Connection) => connection.getRepository(User),
      inject: [DB_CONNECTION],
    },
    {
      provide: USER_GAME_REPO,
      useFactory: (connection: Connection) => connection.getRepository(UserGame),
      inject: [DB_CONNECTION],
    },
    {
      provide: RESET_TOKEN_REPO,
      useFactory: (connection: Connection) => connection.getRepository(ResetToken),
      inject: [DB_CONNECTION],
    }
  ];
  
@Module({
    providers: [...userDbProviders, UserService,  CaptchaService, IsCaptchaCorrectConstraint, IsPasswordConfirmedConstraint, IsUniquePropertyConstraint, AvatarService, AvatarCronJob, SteamBotService ], // ,
    imports: [SharedModule, GamesModule, AuthenticationModule, HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }), EmailModule],
    controllers: [SignupController, LoginController, ChecktokenController, UserController]
})
export class UsersModule {}
