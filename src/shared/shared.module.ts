import { Module } from '@nestjs/common';
import { databaseProviders } from './database';
import { RenderService } from './render.service';


@Module({
  providers: [...databaseProviders, RenderService],
  
  exports:[...databaseProviders, RenderService]
})
export class SharedModule {}
