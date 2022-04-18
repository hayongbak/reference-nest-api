import { Controller, Get, HttpException, HttpStatus, Post, Body, HttpCode, UsePipes, Res } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiResponse } from '@nestjs/swagger';
import { PostTestReq, PostTestRes } from './data/post-test.dto';

@Controller('test')
export class TestController {
    constructor(private testService: TestService){}

    @Get()
    @ApiResponse({ status: 200, description: 'The test token was successfully retrieved'})
    @ApiResponse({ status: 500, description: 'Something went wrong, most likely with the database.'})
    public async getTest(){
        var token = await this.testService.retrieveTestToken();
        if(!token.success){
            throw new HttpException(token, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return token;
    }

    @Post()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'The test token was successfully retrieved', type: PostTestRes})
    @ApiResponse({ status: 500, description: 'Token could not be found'})
    public async postTest(@Body() payload: PostTestReq){
        var token = await this.testService.retrieveTestTokenByToken(payload.token);
        if(!token.success){
            throw new HttpException(token, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return token;
    }
}

