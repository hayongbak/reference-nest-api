import { Controller, Body, Post, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { UserService } from '../shared/user.service';
import { SignupUserRes, SignupUserReq } from './data/signup-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { NormalPipe } from 'src/shared/custom.pipe';

// When we need to have OAuth with PKCE support, have a look at https://github.com/Belicosus/AppAuth-Ionic/pull/8/files for the IONIC implementation!
// For an OAuth implementation we can use https://github.com/jaredhanson/oauth2orize in combination with passportjs for now we only focus on the latter!

@Controller('signup')
export class SignupController {
    constructor(private userService: UserService) {
        
    }

    @Post()
    @ApiResponse({ status: 201, description: 'The user was created successfully', type: SignupUserRes})
    @ApiResponse({ status: 400, description: 'Data provided for user is invalid'})
    @ApiResponse({ status: 500, description: 'User could not be created because of an internal error'})
    @UsePipes(new NormalPipe())
    public async postUser(@Body() newUser: SignupUserReq){
        var token = await this.userService.registerUser(newUser); 
        if(!token.success){
            throw new HttpException(token, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return token;
    }

}

/* Use Token to  */
