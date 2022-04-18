import { Controller, Get, Query, Post, HttpCode, UseGuards, UsePipes, Body, Request, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { NewsService } from './news.service';
import { GetNewsItemRes, PostNewsItemReq } from './data/news-item.dto';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, AdminAuthGuard } from 'src/authentication/authentication.guards';
import { SkipProperties, NormalPipe } from 'src/shared/custom.pipe';
import { PostGameAccountReq } from 'src/users/user/data/game-account.dto';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Get()
    @ApiResponse({ status: 200, description: 'The news items', type: GetNewsItemRes })
    async getNewsItems(@Query('offset') offset: number): Promise<GetNewsItemRes[]> {
        return await this.newsService.retrieveNewsItems(offset);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'The requested news item', type: GetNewsItemRes })
    @ApiResponse({ status: 404, description: 'The requested id could not be found' })
    async getNewsItem(@Param('id') id: string): Promise<GetNewsItemRes> {
        let newsItem = await this.newsService.retrieveNewsItemById(id);
        if(!newsItem){ throw new NotFoundException('error_invalid_id');}
        return newsItem;
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Added a news item for the user'})
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiBearerAuth()
    @UseGuards(AdminAuthGuard)
    @UsePipes(new NormalPipe())
    async addNewsItem(@Request() req, @Body() newsItem: PostNewsItemReq  ){
        let userId: string = req.user.userId;
        let item_id = await this.newsService.addNewsItem(newsItem, userId);
        if(item_id === "-1"){ throw new InternalServerErrorException({success: false});}
        return {success: true, item_id: item_id};
    }

}
