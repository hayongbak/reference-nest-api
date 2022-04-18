import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { GAME_REPO, DB_CONNECTION } from 'src/shared/constants';
import { Connection } from 'typeorm';
import { Game } from './game/data/game.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';


export const gameDbProviders = [
  {
    provide: GAME_REPO,
    useFactory: (connection: Connection) => connection.getRepository(Game),
    inject: [DB_CONNECTION],
  }
];

@Module({
  imports: [SharedModule, AuthenticationModule],
  controllers: [GameController],
  providers: [...gameDbProviders, GameService],
  exports:[GameService]
})
export class GamesModule {}
