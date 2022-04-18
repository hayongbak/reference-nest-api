import { SharedModule } from 'src/shared/shared.module';
import { Module, HttpModule } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { TwitchService } from './twitch/twitch.service';
import { Connection, Repository } from 'typeorm';
import { USER_REPO, DB_CONNECTION, APPS_REPO, USER_APP_REPO } from 'src/shared/constants';
import { User } from 'src/users/shared/user.entity';
import { App } from './data/app.entity';
import { UserApp } from './data/user-app.entity';
import { SteamService } from './steam/steam.service';

export const appDbProviders = [
  {
    provide: USER_REPO,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [DB_CONNECTION],
  },
  {
    provide: APPS_REPO,
    useFactory: (connection: Connection) => connection.getRepository(App),
    inject: [DB_CONNECTION],
  },
  {
    provide: USER_APP_REPO,
    useFactory: (connection: Connection) => connection.getRepository(UserApp),
    inject: [DB_CONNECTION],
  }
];

@Module({
  controllers: [AppsController],
  providers: [...appDbProviders, TwitchService, SteamService],
  imports: [SharedModule, HttpModule]
})
export class AppsModule {}
