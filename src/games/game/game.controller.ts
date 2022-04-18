import { Controller, Get, Request, UseGuards, Param, NotFoundException, Put, UnauthorizedException, Body, UsePipes, ValidationPipe, SetMetadata, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/authentication.guards';
import {  SkipProperties, NormalPipe } from 'src/shared/custom.pipe';
import { GetGameRes, GamesQuery } from './data/game.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
    
constructor(private gameService: GameService){}

    
    @Get()
    @ApiResponse({ status: 200, description: 'A list of 5 games are returned based on an offset and filter'})
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new NormalPipe())
    public async getGames(@Request() req, @Query() query: GamesQuery): Promise<GetGameRes[]> {
        return await this.gameService.search(query.searchTerm, query.offset)
    }
    
    @Get(':id')
    @ApiResponse({ status: 200, description: 'One game', type: GetGameRes })
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiResponse({ status: 404, description: 'The requested id could not be found' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new NormalPipe())
    public async getGame(@Request() req, @Param('id') id: string): Promise<GetGameRes> {
        // we can use req.user to verify the current user's id - if necessary on a later stage
        let game = await this.gameService.getGameById(id);
        if (!game) { throw new NotFoundException('error_invalid_id'); }
        return game;
    }

    


}
