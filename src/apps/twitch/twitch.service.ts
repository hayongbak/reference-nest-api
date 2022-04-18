import { Injectable, HttpService, Inject, HttpException, InternalServerErrorException } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import * as config from 'src/config.json';
import { Repository } from 'typeorm';
import { USER_REPO, APPS_REPO, USER_APP_REPO } from 'src/shared/constants';
import { User } from 'src/users/shared/user.entity';
import { App } from '../data/app.entity';
import { UserApp } from '../data/user-app.entity';
import { GetAppAccountRes, PostAppAcountReq, GetLivestreamRes } from '../data/app-account.dto';

@Injectable()
export class TwitchService {
    constructor(@Inject(USER_REPO) private userRepo: Repository<User>,
        @Inject(APPS_REPO) private appsRepo: Repository<App>,
        @Inject(USER_APP_REPO) private userAppRepo: Repository<UserApp>,
        private http: HttpService){

    }

    async getTokens(code: string) {
        try {
            let url = 'https://id.twitch.tv/oauth2/token' +
                '?client_id=' + config.twitchApi.clientId +
                '&client_secret=' + config.twitchApi.clientSecret +
                '&code=' + code +
                '&grant_type=authorization_code' +
                '&redirect_uri=' + config.twitchApi.redirectUri;
            console.log(url);
            return this.http.post(url).pipe(
                map(response => response.data)
            ).toPromise().catch(e => {
                console.log(e);
                throw new InternalServerErrorException(e);
            })
                // .pipe(
                //     catchError(e => {
                //         throw new HttpException(e.response.data, e.response.status);
                //     }),
                //     // map(response => response.data)
                // );
        }
        catch (error) {
            console.log('Twitch::getTokens error');
            console.log(error);
        }
    }

    async getTwitchLiveStreams(streamsCount: number): Promise<any> {
        let streamList: Array<GetLivestreamRes> = [];
        let users = await this.userRepo.find();
        try {
            let url = 'https://api.twitch.tv/helix/streams?first=' + streamsCount;
            let options = {
                headers: {
                    'Client-ID': config.twitchApi.clientId
                }
            }
            return this.http.get(url, options)
                .pipe(
                    map(response => {
                        for (let i = 0; i < streamsCount; i++) {
                            console.log(response.data.data[i]);
                            let stream = new GetLivestreamRes(users[i < users.length ? i : users.length - 1].user_name, users[i < users.length ? i : users.length - 1].user_id, users[i < users.length ? i : users.length - 1].user_avatar_url, 
                                response.data.data[i].user_name, response.data.data[i].viewer_count, response.data.data[i].thumbnail_url, response.data.data[i].started_at, 1, 'DOTA 2');
                            streamList.push(stream);
                        }
                        return streamList;
                    })
                );
                //  .pipe(
                //      map(response => response.data)
                //  );
        } catch (error) {
            console.log('Twitch::getTwitchLiveStreams error');
        }
    }

    async refreshTokens(refresh_token: string) {
        try {
            let url = 'https://id.twitch.tv/oauth2/token' +
                '--data-urlencode'
                '?grant_type=refresh_token' +
                '&refresh_token=' + refresh_token +
                '&client_id=' + config.twitchApi.clientId +
                '&client_secret=' + config.twitchApi.clientSecret;
            return this.http.post(url)
                .pipe(
                    map(response => response.data)
                );;
        }
        catch (error) {
            console.log(error);
        }
    }

    public addTokensForUser(access_token: string, refresh_token: string) {

    }

    async getAccountForUserAndApp(userId: number, appId: number) {
        let appAccount = await this.userAppRepo.findOne({ user_id: userId, app_id: appId })
        if(!appAccount) {
            return null
        }
        return new GetAppAccountRes(appAccount);
    }

    async getTwitchUserDetails(userId: number) {
        try {
            let twitchAccount = await this.userAppRepo.findOne({ user_id: userId, app_id: 1 });
            let url = 'https://api.twitch.tv/kraken/user';
            let options = {
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Authorization': 'OAuth ' + twitchAccount.access_token,
                    'Client-ID': config.twitchApi.clientId
                }   
            }
            console.log(url);
            console.log(options);
            return this.http.get(url, options)
                .pipe(
                    map(response => response.data)
                );
        }
        catch (error) {
            console.log('Twitch::getTwitchUserDetails error');
            console.log(error);
        }
    }

    async getTwitchSubscriptionForChannel(userId: number, channelUserId: number) {
        try {
            let twitchAccount = await this.userAppRepo.findOne({ user_id: userId, app_id: 1 });
            let broadcasterAccount = await this.userAppRepo.findOne({ user_id: channelUserId, app_id: 1 });
            console.log(twitchAccount);
            let url = 'https://api.twitch.tv/kraken/users/' + twitchAccount.user_app_account_id + '/subscriptions/' + broadcasterAccount.user_app_account_id; // kazinthemage
            let options = {
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Authorization': 'OAuth ' + twitchAccount.access_token,
                    'Client-ID': config.twitchApi.clientId
                }
            }
            console.log(url);
            console.log(options);
            return this.http.get(url, options)
                .pipe(
                    map(response => response.data)
                );
        }
        catch (error) {
            console.log(error);
        }
    }

    async addAppAccountForUser(userId: number, appAccount: PostAppAcountReq): Promise<boolean> {
        try {
            let entity: UserApp = await this.userAppRepo.findOne({ user_id: appAccount.user_id, app_id: appAccount.app_id });

            if (!entity) {
                console.log("addAppAccountForUser: create new entry");
                entity = new UserApp();
                entity.app_id = appAccount.app_id;
                entity.user_id = appAccount.user_id;
                entity.user_app_account_name = appAccount.app_account_name;
                entity.user_app_account_id = appAccount.app_account_id;
                entity.user_app_account_logo = appAccount.app_account_logo;
                entity.access_token = appAccount.access_token;
                entity.refresh_token = appAccount.refresh_token;
                await this.userAppRepo.insert(entity);
            } else {
                console.log("addAppAccountForUser: update existing entry");
                console.log(appAccount);
                await this.userAppRepo.update(entity, { user_app_account_name: appAccount.app_account_name, user_app_account_id: appAccount.app_account_id, user_app_account_logo: appAccount.app_account_logo, access_token: appAccount.access_token, refresh_token: appAccount.refresh_token });
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async addAppAccountDetails(userId: number, appId: number, appAccountName: string, appAccountId: string): Promise<boolean> {
        try {
            let entity: UserApp = await this.userAppRepo.findOne({ user_id: userId, app_id: appId });
            if(!entity) {
                console.log("addAppAccountDetails: no entity");
                return false;
            } else {
                console.log(entity);
                console.log("appAccountId: " + appAccountId);
                // entity.user_app_account_name = appAccountName;
                // entity.user_app_account_id = appAccountId;
                await this.userAppRepo.update(entity, {user_app_account_name: appAccountName, user_app_account_id: appAccountId});
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
