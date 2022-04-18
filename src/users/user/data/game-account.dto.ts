import { UserGame } from "src/users/shared/user-game.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsNumber } from "class-validator";

export class GetGameAccountRes{
    constructor(userGame: UserGame) {
        this.user_id = userGame.user_id;
        this.game_id = userGame.game_id;
        this.game_account_name = userGame.user_game_accountname;
        this.game_account_id = userGame.user_game_accountid;
        this.game_name = userGame.game_name;
    }

    @ApiProperty({ description: 'User ID of the requested user' })
    user_id: string;

    @ApiProperty({ description: 'Game ID of the requested user' })
    game_id: string;
    @ApiProperty({ description: 'Game Account Name of the requested user' })
    game_account_name: string;
    @ApiProperty({ description: 'Game Account ID of the requested user' })
    game_account_id: string;
    @ApiProperty({ description: 'Game Name for the requested game ID' })
    game_name: string;
}

export class PostGameAccountReq{
    @ApiProperty({ description: 'User ID for the user' })
    @IsNotEmpty({message: 'error_invalid_userid'})
    user_id: string;
    @ApiProperty({ description: 'Game ID for the user' })
    @IsNotEmpty({message: 'error_invalid_gameid'})
    game_id: string;
    @ApiProperty({ description: 'Game Account Name for the user' })
    @IsNotEmpty({message: 'error_invalid_gameaccountname'})
    @Length(0,255,{message: 'error_invalid_gameaccountname'})
    game_account_name: string;
}