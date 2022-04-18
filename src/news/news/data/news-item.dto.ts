import { ApiProperty } from "@nestjs/swagger";
import { NewsItem } from "src/news/news/data/news-item.entity";
import { Length, IsNotEmpty, IsOptional } from "class-validator";

export class GetNewsItemRes{
    
    constructor(newsItem: NewsItem) {
        this.item_id = newsItem.item_id;
        this.title = newsItem.title;
        this.header_picture_url = newsItem.header_picture_url;
        this.content = newsItem.content;
        this.created = newsItem.created;
        this.author_id = newsItem.user_id;
        this.author_name = newsItem.user_name;
        this.success = true;
    }

    @ApiProperty({ description: 'News Item ID' })
    item_id: string;

    @ApiProperty({ description: 'News Item title' })
    title: string;

    @ApiProperty({ description: 'Image Url of the News Item' })
    header_picture_url: string;

    @ApiProperty({ description: 'News Item content' })
    content: string;

    @ApiProperty({ description: 'Creation Date of the News Item' })
    created: Date;

    @ApiProperty({ description: 'User ID of the author of the News Item' })
    author_id: string;

    @ApiProperty({ description: 'User name of the author of the News Item' })
    author_name: string;

    @ApiProperty({ description: 'Was the call successful?' })
    success: boolean;
}


export class PostNewsItemReq{
    @Length(0, 255, {message: 'error_title_invalid'})
    @ApiProperty({ description: 'News Item title' })
    @IsNotEmpty({message: 'error_title_invalid'})
    title: string;

    @ApiProperty({ description: 'Image Url of the News Item' })
    @Length(0,1024, {message: 'error_image_url_invalid'})
    @IsOptional()
    header_picture_url: string;

    @ApiProperty({ description: 'News Item content' })
    @Length(0,10000,{message: 'error_content_invalid'})
    @IsNotEmpty({message: 'error_content_invalid'})
    content: string;
}