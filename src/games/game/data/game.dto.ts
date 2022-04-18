import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional} from 'class-validator';
import { Game } from 'src/games/game/data/game.entity';

export class GamesQuery{
    @IsNumber()
    @IsOptional()
    offset: number;

    @IsString()
    @IsOptional()
    searchTerm: string;
}


export class GameTypeAndModeDto{
    @ApiProperty({description: 'Game Type (e.g. 1v1)'})
    type: string;
    @ApiProperty({description: 'All possible game modes (e.g. Solo Mid)'})
    gameModes: string[];
    @ApiProperty({description: 'Number of Players required for this game type - not required in matchmaking'})
    nrOfPlayers: number;
}

export class GetGameRes {
    constructor(game: Game) {
        this.game_id = game.game_id;
        this.game_name = game.game_name;
        this.game_picture_url = game.game_picture_url;
        this.game_types = game.game_modes;
        this.success = true;
    }

    @ApiProperty({ description: 'Game ID of the requested game' })
    game_id: string;

    @ApiProperty({ description: 'Game name of the requested game' })
    game_name: string;
    @ApiProperty({ description: 'Image Url of the requested game' })
    game_picture_url: string;

    @ApiProperty({description: 'Game Types and Modes', type: GameTypeAndModeDto })
    game_types: Array<GameTypeAndModeDto>;

    @ApiProperty({ description: 'Was the call successful?' })
    success: boolean;
}
