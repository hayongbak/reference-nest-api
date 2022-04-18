import { Controller, Get, Body, Post, HttpException, HttpStatus, HttpCode, BadRequestException, UsePipes, Param, Res, Req } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { LoginUserRes, LoginUserReq } from './data/login-user.dto';
import { ApiResponse, ApiProperty } from '@nestjs/swagger';
import { NormalPipe, NormalPipeWithView } from 'src/shared/custom.pipe';
import { Response, Request } from 'express';
import { RenderService } from 'src/shared/render.service';
import { join } from 'path';
import * as config from 'src/config.json';
import { from } from 'rxjs';
import { MailService } from 'src/email/mail.service';
import { ResetSuccessResponse, PostPasswordResetReq } from './data/reset.dto';


@Controller('login')
export class LoginController {

    constructor(private userService: UserService, private renderService: RenderService, private mailService: MailService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'The user was logged in successfully', type: LoginUserRes})
    @ApiResponse({ status: 400, description: 'Data format provided for user is invalid - or credentials are wrong.'})
    @ApiResponse({ status: 500, description: 'User could not be signed in because of an internal error'})
    @UsePipes(new NormalPipe())
    public async postUser(@Body() user: LoginUserReq){
        var token = await this.userService.verifyUser(user); 
        if(!token){
            throw new BadRequestException("error_credentials_invalid");
        }

        if(!token.success){
            throw new HttpException(token, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return token;
    }

    @Post('reset/:email')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Reset password was requested', type: ResetSuccessResponse})
    @ApiResponse({ status: 400, description: 'No email address provided'})
    @ApiResponse({ status: 500, description: 'Oops'})
    @UsePipes(new NormalPipe())
    public async requestResetPassword(@Param('email') email: string, @Req() request: Request){
        
        let resetToken = await this.userService.requestResetPassword(email);
        if(!resetToken){ return {success: true}; } // always return successful. This disallows account enumeration

        let html = await this.renderService.renderViewInternal({username: resetToken.user_name, link: `${config.resetPasswordUrl}/${resetToken.token}/${resetToken.user_email}`}, join("mailing", "reset-password"), request)
        await this.mailService.sendMail({to: resetToken.user_email, from: config.sendgrid.sender, subject: 'Password Reset Request', message: html});
        return {success: true}; // always return successful. This disallows account enumeration
    }

    @Get('reset-password/:resetToken/:email')
    @ApiResponse({ status: 200, description: 'Reset password was requested'})
    @ApiResponse({ status: 400, description: 'Bad Request'})
    @UsePipes(new NormalPipe())
    public async showResetPassword(@Param('resetToken') resetToken: string, @Param('email') email: string, @Res() response: Response){
        let verification = await this.userService.verifyToken(resetToken, email);
        if(!verification){
            response.statusCode = 500;
            return response.render('web/oops');
        }

        return response.render('web/reset-password', verification );
    }

    @Post('reset-password/:resetToken/:email')
    @ApiResponse({ status: 200, description: 'Password was reset'})
    @ApiResponse({ status: 400, description: 'Bad Request'})
    @UsePipes(new NormalPipeWithView('web/reset-password'))
    public async resetPassword(@Param('resetToken') resetToken: string, @Param('email') email: string, @Body() input: PostPasswordResetReq, @Res() response: Response){
        if(resetToken !== input.token || email !== input.user_email){
            throw new BadRequestException({errors: {'token':'token_invalid', 'user_email': 'user_email_invalid'}});
        }
        let success = false;
        try{ success = await this.userService.resetPassword(input);}
        catch{ success = false;}
        if(!success){ 
            response.statusCode = 500;
            return response.render('web/oops'); 
        }

        return response.render('web/reset-password-success');


    }



/* USE RESET TOKEN TO LOOK UP USER AND VALIDATE, AFTER NEW INPUT OF PW REMOVE ENTRY IN RESETTOKEN TABLE AND UPDATE PW */
}
