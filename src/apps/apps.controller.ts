import { json } from 'express';
import { PostAppAcountReq, GetAppAccountRes, GetLivestreamRes } from './data/app-account.dto';
import { TwitchService } from './twitch/twitch.service';
import { Controller, Get, UseGuards, Request, Response, Post, Query, Param, NotFoundException, ClassSerializerInterceptor, UseInterceptors} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard, JwtUrlAuthGuard, SteamAuthGuard } from 'src/authentication/authentication.guards';
import * as config from 'src/config.json';
import { AdvancedConsoleLogger } from 'typeorm';
import { SteamService } from './steam/steam.service';
import passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
import { mergeMap, map } from 'rxjs/operators';

@Controller('apps')
export class AppsController {
    constructor(private twitchService : TwitchService, private steamService : SteamService){
        passport.use(new SteamStrategy({
            returnURL: config.steamApi.returnURL,
            realm: config.steamApi.realm,
            apiKey: config.steamApi.apiKey
        },
            function (identifier, profile, done) {
                console.log(identifier);
                console.log(profile);
                console.log(done);
                return done(null, profile);
            }
        ));
    }

    @Get('twitch/account/:userId')
    @ApiResponse({ status: 200, description: 'The twitch account information', type: GetAppAccountRes })
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiResponse({ status: 404, description: 'The requested id could not be found' })
    async getTwitchAccountForUser(@Request() req, @Param('userId') userId: number): Promise<GetAppAccountRes> {
        let appAccount = await this.twitchService.getAccountForUserAndApp(userId, 1);
        if (!appAccount) {
            throw new NotFoundException('error_invalid_id');
        }
        return appAccount;
    };

    @Get('twitchsubtest/:userId/:channelUserId')
    async getTwitchSubTest(@Request() req, @Response() res, @Param('userId') userId: number, @Param('channelUserId') channelUserId: number, @Query('code') code, @Query('error') error): Promise<any> {
        let resultSubs = await this.twitchService.getTwitchSubscriptionForChannel(userId, channelUserId);
        if(!resultSubs) {
            //TODO check for auth error and refresh tokens
        }
        return resultSubs;
        // .subscribe((result) => {
        //     // console.log(res);
        //     if (result.data && result.data[0]) {
        //         console.log(result.data[0]);
        //         let success = this.twitchService.addAppAccountDetails(userId, 1, result.data[0].display_name, result.data[0].id);
        //         return { success: success };
        //     }

        // })
    }

    @Get('twitch/login')
    @UseGuards(JwtUrlAuthGuard)
    async getTwitchAuthLogin(@Request() req, @Response() res, @Query('token') token): Promise<any> {
        // todo encode gaimer user in state param
        console.log(req.user);
        let twitchUrl = 'https://id.twitch.tv/oauth2/authorize?client_id=' + config.twitchApi.clientId +
            '&redirect_uri=' + config.twitchApi.redirectUri +
            '&response_type=code' +
            '&scope=' + config.twitchApi.scope +
            '&state=' + req.user.userId;
        console.log(twitchUrl);
        res.redirect(twitchUrl);
    }

    @Get('steam/login')
    @UseGuards(JwtUrlAuthGuard)
    // @UseGuards(SteamAuthGuard)
    async getSteamLogin(@Request() req, @Response() res) : Promise<any> {
        console.log(req.user);
        if(req.user && req.user.userId) {
            var cookie = req.cookies.gaimerUserId;
            res.cookie('gaimerUserId', req.user.userId, { maxAge: 900000, httpOnly: true });
            console.log('Cookie created successfully');

            res.redirect('redirect');
        }
    }

    @Get('steam/redirect')
    @UseGuards(SteamAuthGuard)
    async getSteamRedirect(): Promise<any> {
    }

    @Get('steam/account/:userId')
    @ApiResponse({ status: 200, description: 'The twitch account information', type: GetAppAccountRes })
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiResponse({ status: 404, description: 'The requested id could not be found' })
    async getSteamAccountForUser(@Request() req, @Param('userId') userId: number): Promise<GetAppAccountRes> {
        let appAccount = await this.twitchService.getAccountForUserAndApp(userId, 2);
        if (!appAccount) {
            throw new NotFoundException('error_invalid_id');
        }
        return appAccount;
    };

    @Get('steam/return')
    async getSteamReturn(@Request() req, @Response() res): Promise<any> {
        var cookie = req.cookies.gaimerUserId;
        if (cookie === undefined) {
            console.log('no cookie');
            res.send("fail");
            res.end();
        }
        else {
            // yes, cookie was already present 
            console.log('cookie exists', cookie);
        } 

        // todo encode gaimer user in state param
        console.log(req.query);
        console.log(typeof(req.query["openid.identity"]));
        console.log(req.query['openid.identity']);
        let claimed_id = req.query['openid.claimed_id'];
        let identity = req.query['openid.identity'];
        let account_id = identity.substring(identity.lastIndexOf('/') + 1);
        console.log(identity);
        let user_id = cookie;
        let tempApp = new PostAppAcountReq(user_id, 2, identity, account_id, null, null, null);
        console.log(tempApp);
        this.twitchService.addAppAccountForUser(user_id, tempApp).then(() => {
            res.send("ok");
            res.end();
        });
    }

    @Get('twitch/live')
    // @UseInterceptors(ClassSerializerInterceptor)
    async getTwitchLiveStreamsAndFakeUsers(): Promise<GetLivestreamRes[]> {
        let streamsCount = 5;
        let streamList: Array<GetLivestreamRes> = [];
        return this.twitchService.getTwitchLiveStreams(streamsCount);
        // await this.twitchService.getTwitchLiveStreams(streamsCount).then((resPromise) => {
        //     resPromise.subscribe((resTest) => {
        //         for (let i = 0; i < streamsCount; i++) {
        //             let stream = new GetLivestreamRes(resTest.data[i].user_name, resTest.data[i].user_id, resTest.data[i].user_name);
        //             streamList.push(stream);
        //         }
        //         console.log(streamList);
        //         return streamList;
        //     }, (error) => {
        //         console.log(error);
        //         return streamList;
        //     });
        // }).catch((err) => {
        //     console.log(err);
        //     return streamList;
        // });
    }

    @Get('twitch/test')
    async getTwitchTest(): Promise<any> {
        let streamsCount = 5;
        return this.twitchService.getTwitchLiveStreams(streamsCount);
        // .then((test) => {
        //     console.log(test);
        // });
    }

    @Get('twitch')
    async getTwitchAuthFlow(@Request() req, @Response() res, @Query('code') code, @Query('state') state, @Query('error') error) : Promise<any> {
        console.log(req.query);
        if(error){
            console.log('Twitch API error...');
            console.log(error);
            if(error == 'access_denied') {
                return null;
            }
        }
        else if(code){
            console.log("Twitch API received code...");
            console.log(code);
            // todo parse gaimer user from state param
            console.log("state: " + state);
            let user_id = state;
            console.log('trying to exchange token with twitch API');
            try {
                this.twitchService.getTokens(code).then((tokens) => {
                    try {
                        // tokensRes.subscribe((tokens) => {
                            console.log('Twitch API getTokens results:');
                            console.log(tokens);
                            let tempApp = new PostAppAcountReq(user_id, 1, 'tba', null, null, tokens.access_token, tokens.refresh_token);
                            this.twitchService.addAppAccountForUser(user_id, tempApp).then(() => {
                                this.twitchService.getTwitchUserDetails(user_id).then((acc) => {
                                    acc.subscribe((accRes) => {
                                        console.log('accRes:');
                                        console.log(accRes);
                                        let newApp = new PostAppAcountReq(user_id, 1, accRes.name, accRes._id, accRes.logo, tokens.access_token, tokens.refresh_token);
                                        let success = (this.twitchService.addAppAccountForUser(1, newApp));
                                        res.send("");
                                        res.end();
                                    });
                                }).catch((reason) => {
                                    console.log('getTwitchUserDetails error: ' + reason);
                                    res.send("");
                                    res.end();
                                });
                            });
                        // })
                    }
                    catch (reason) {
                        console.log('getTokens error: ' + reason);
                        res.send("");
                        res.end();
                    }
                }).catch((reason) => {
                    console.log('getTokens error: ' + reason);
                    res.send("");
                    res.end();
                });
            }
            catch(error) {
                console.log("getTokens error: " + error);
                res.send("");
                res.end();
            }
            
        }
    }



}
