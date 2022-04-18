import { Module } from '@nestjs/common';
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { TestModule } from './test/test.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { NewsModule } from './news/news.module';
import { EmailModule } from './email/email.module';
import { AppsModule } from './apps/apps.module';

@Module({
  imports: [SharedModule,  ScheduleModule.forRoot(), TestModule, AuthenticationModule, UsersModule, GamesModule, NewsModule, EmailModule, AppsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
} 
