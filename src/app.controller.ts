import { Controller, Get, Res, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
    @Get()
    @Render('web/home')
    public getApp(){
        return {};
    }
}
