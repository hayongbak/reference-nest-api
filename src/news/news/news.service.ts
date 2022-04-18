import { Injectable, Inject } from '@nestjs/common';
import { GetNewsItemRes, PostNewsItemReq } from './data/news-item.dto';
import { NEWS_REPO } from 'src/shared/constants';
import { Repository } from 'typeorm';
import { NewsItem } from './data/news-item.entity';
import * as configuration from 'src/config.json';

@Injectable()
export class NewsService {
    constructor( @Inject(NEWS_REPO) private newsRepo: Repository<NewsItem>){}
    
    async retrieveNewsItems(offset: number): Promise<GetNewsItemRes[]> {
        let newsItems = (await  this.newsRepo.createQueryBuilder('ni')
        .innerJoin('users', 'u', 'ni.user_id=u.user_id')
        .select('ni.item_id', 'item_id')
        .addSelect('ni.item_id', 'item_id')
        .addSelect('ni.user_id', 'user_id')
        .addSelect('ni.created', 'created')
        .addSelect('ni.header_picture_url', 'header_picture_url')
        .addSelect('LEFT(ni.content, 100)', 'content')
        .addSelect('ni.title', 'title')
        .addSelect('u.user_name', 'user_name')
        .orderBy('created', 'DESC')
        .offset(offset)
        .limit(configuration.queryParams.nrOfNewsItems)
        .execute()) as NewsItem[];

        return newsItems.map(ni => new GetNewsItemRes(ni));
    }

    async retrieveNewsItemById(id: string): Promise<GetNewsItemRes> {
        let newsItem = (await  this.newsRepo.createQueryBuilder('ni')
        .innerJoin('users', 'u', 'ni.user_id=u.user_id')
        .select('ni.item_id', 'item_id')
        .addSelect('ni.item_id', 'item_id')
        .addSelect('ni.user_id', 'user_id')
        .addSelect('ni.created', 'created')
        .addSelect('ni.content', 'content')
        .addSelect('ni.title', 'title')
        .addSelect('ni.header_picture_url', 'header_picture_url')
        .addSelect('u.user_name', 'user_name')
        .where('ni.item_id = :item_id', { item_id: id })
        .orderBy('created', 'DESC')
        .execute())[0] as NewsItem;

        if(!newsItem){return null;} // We didn't find it!
        return new GetNewsItemRes(newsItem);
    }

    async addNewsItem(newsItem: PostNewsItemReq, user_id: string): Promise<string> {
        let entity = new NewsItem();
        entity.content = newsItem.content;
        entity.header_picture_url = newsItem.header_picture_url;
        entity.title = newsItem.title;
        entity.user_id = user_id;
        try{
            await this.newsRepo.insert(entity);
            return entity.item_id;
        } catch(err) {
            return "-1";
        }
    }
}
