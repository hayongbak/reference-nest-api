import { Injectable, Inject } from '@nestjs/common';
import { GetGameRes } from "./data/game.dto";
import { GAME_REPO } from 'src/shared/constants';
import { Game } from './data/game.entity';
import { Repository, Like, FindManyOptions } from 'typeorm';
import * as configuration from 'src/config.json';

const amount = configuration.queryParams.nrOfGames;

@Injectable()
export class GameService {
    

    constructor(@Inject(GAME_REPO) private gameRepo: Repository<Game>) { }

    async getGameById(id: string): Promise<GetGameRes> {
        let game = await this.gameRepo.findOne(id);
        if (!game) { return null; }
        return new GetGameRes(game);
    }

    async getFullGameById(gameId: string): Promise<Game> {
        return await this.gameRepo.findOne(gameId);
    }

    async search(searchTerm: string, offset: number): Promise<GetGameRes[]> {
        let query: FindManyOptions<Game> = {order: { game_name: 'ASC' }, take: amount, skip: offset}; // keep an eye on take and skip: don't work correctly with the querybuilder if on MariaDB => need to use offset and limit methods!
        if(searchTerm && searchTerm.trim()){
            query.where = { game_name: Like(`%${searchTerm}%`) };
        }

        let games = await this.gameRepo.find(query);
        return games.map(g => new GetGameRes(g));
    }



}
