import { UserApp } from './user-app.entity';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsNumber } from "class-validator";

export class GetLivestreamRes {
    constructor(user_name: string, user_id: string, user_avatar_url: string, twitch_account_name: string, twitch_viewer_count: number, twitch_thumbnail_url: string, twitch_started_at: string, game_id: number, game_name: string) {
        this.user_name = user_name;
        this.user_id = user_id;
        this.user_avatar_url = user_avatar_url;
        this.twitch_account_name = twitch_account_name;
        this.twitch_viewer_count = twitch_viewer_count;
        this.twitch_thumbnail_url = twitch_thumbnail_url;
        this.twitch_started_at = twitch_started_at;
        this.game_id = game_id;
        this.game_name = game_name;
    }

    @ApiProperty({ description: 'User Name in Gaimer' })
    user_name: string;

    @ApiProperty({ description: 'User ID in Gaimer' })
    user_id: string;

    @ApiProperty({ description: 'User Profile Pic Url in Gaimer' })
    user_avatar_url: string;

    @ApiProperty({description: 'Twitch user/stream name'})
    twitch_account_name: string;

    @ApiProperty({description: 'Viewer Count on Twitch.tv'})
    twitch_viewer_count: number;

    @ApiProperty({description: 'Livestream Thumbnail Url'})
    twitch_thumbnail_url: string;

    @ApiProperty({description: 'DateTime when stream started'})
    twitch_started_at: string;

    @ApiProperty({description: 'Game Id in Gaimer'})
    game_id: number;

    @ApiProperty({ description: 'Game Name in Gaimer' })
    game_name: string;
}

export class GetAppAccountRes{
    constructor(userApp: UserApp){
        this.user_id = userApp.user_id;
        this.app_id = userApp.app_id;
        this.app_account_name = userApp.user_app_account_name;
        this.app_account_id = userApp.user_app_account_id;
        this.app_account_logo = userApp.user_app_account_logo;
        // this.access_token = userApp.access_token;
        // this.refresh_token = userApp.refresh_token;
    }

    @ApiProperty({ description: 'User ID of the requested user' })
    user_id: number;

    @ApiProperty({ description: 'App ID of the requested user' })
    app_id: number;
    @ApiProperty({ description: 'App Account Name of the requested user' })
    app_account_name: string;
    @ApiProperty({ description: 'App Account ID of the requested user' })
    app_account_id: string;
    @ApiProperty({ description: 'App Account Logo of the requested user' })
    app_account_logo: string;
    // @ApiProperty({ description: 'acess_token for the requested app ID' })
    // access_token: string;
    // @ApiProperty({ description: 'refresh_token for the requested app ID' })
    // refresh_token: string;
}

export class PostAppAcountReq{
    constructor(userId: number, appId: number, appAccountName: string, appAccountId: string, appAccountLogo: string, accessToken: string, refreshToken: string) {
        this.user_id = userId;
        this.app_id = appId;
        this.app_account_name = appAccountName;
        this.app_account_id = appAccountId;
        this.app_account_logo = appAccountLogo;
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
    }

    @ApiProperty({description: 'User ID for the user'})
    @IsNotEmpty({ message: 'error_invalid_userid' })
    @IsNumber({}, { message: 'error_invalid_userid' })
    user_id: number;

    @ApiProperty({ description: 'App ID for the user' })
    @IsNotEmpty({ message: 'error_invalid_appid' })
    @IsNumber({}, { message: 'error_invalid_appid' })
    app_id: number;

    @ApiProperty({ description: 'App Account Name for the user' })
    @IsNotEmpty({ message: 'error_invalid_appaccountname' })
    @Length(0, 255, { message: 'error_invalid_appaccountname' })
    app_account_name: string;

    @ApiProperty({ description: 'App Account ID for the user' })
    @IsNotEmpty({ message: 'error_invalid_appaccountid' })
    @Length(0, 255, { message: 'error_invalid_appaccountid' })
    app_account_id: string;

    @ApiProperty({ description: 'access_token for the App' })
    @IsNotEmpty({ message: 'error_invalid_accesstoken' })
    @Length(0, 255, { message: 'error_invalid_accesstoken' })
    access_token: string;

    @ApiProperty({ description: 'refresh_token for the App' })
    @IsNotEmpty({ message: 'error_invalid_refreshtoken' })
    @Length(0, 255, { message: 'error_invalid_refreshtoken' })
    refresh_token: string;

    @ApiProperty({ description: 'App Account Logo for the user' })
    @Length(0, 1024, { message: 'error_invalid_appaccountlogo' })
    app_account_logo: string;
}

