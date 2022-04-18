import { Module } from '@nestjs/common';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { DB_CONNECTION, NEWS_REPO } from 'src/shared/constants';
import { Connection } from 'typeorm';
import { NewsItem } from './news/data/news-item.entity';
import { SharedModule } from 'src/shared/shared.module';


export const newsDbProviders = [
  {
    provide: NEWS_REPO,
    useFactory: (connection: Connection) => connection.getRepository(NewsItem),
    inject: [DB_CONNECTION],
  }
];



@Module({
  controllers: [NewsController],
  providers: [...newsDbProviders, NewsService],
  imports: [SharedModule]
})
export class NewsModule {}
