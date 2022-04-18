import { Controller, Get, Request, UseGuards, Param, NotFoundException, Put, UnauthorizedException, Body, UsePipes, ValidationPipe, SetMetadata, HttpCode, HttpStatus, Query, Post, BadRequestException } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/authentication.guards';
import { GetUserProfileDto, PutUserProfileReq } from './data/user-profile.dto';
import { UserService } from '../shared/user.service';
import {  SkipProperties, NormalPipe } from 'src/shared/custom.pipe';
import { GetGameAccountRes, PostGameAccountReq } from './data/game-account.dto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }


    @Get(':id')
    @ApiResponse({ status: 200, description: 'The user information', type: GetUserProfileDto })
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiResponse({ status: 404, description: 'The requested id could not be found' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new NormalPipe())
    public async getUserProfile(@Request() req, @Param('id') id: string): Promise<GetUserProfileDto> {
        // we can use req.user to verify the current user's id - if necessary on a later stage
        let userProfile = await this.userService.getUserProfileById(id);
        if (!userProfile) { throw new NotFoundException('error_invalid_id'); }
        if (req.user.userId !== id) {
            userProfile.user_email = "";
        }
 
        return userProfile;
    }

    @Get('games/:user_id')
    @ApiResponse({ status: 200, description: 'The game accounts', type: GetGameAccountRes })
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new NormalPipe())
    public async getGameAccountsForUser(@Request() req, @Param('user_id') id: string, @Query('offset') offset: number ): Promise<GetGameAccountRes[]> {
        if(req.user.userId !== id){throw new UnauthorizedException('error_invalid_token');} // only the current user can request the game accounts!

        let gameAccounts = await this.userService.getGameAccountsForUser(id, offset);
        return gameAccounts;
    }

    @Get('account/:game_id')
    @ApiResponse({ status: 200, description: 'The game account information', type: GetGameAccountRes })
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new NormalPipe())
    public async getGameAccountForUser(@Request() req, @Param('game_id') id: string): Promise<GetGameAccountRes> {
        let userId: string = req.user.userId;
        let gameAccount = await this.userService.getGameAccountForUserAndGame(userId, id);
        return gameAccount;
    }

    @Post('games/:id')
    @ApiResponse({ status: 201, description: 'Added a game account for the user'})
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new SkipProperties())
    public async addGameAccount(@Request() req, @Param('id') id: string, @Body() gameAccount: PostGameAccountReq  ): Promise<any> {
        if(req.user.userId !== id){throw new UnauthorizedException('error_invalid_token');}

        let success = (await this.userService.addGameAccountForUser(id, gameAccount));
        if(!success){throw new BadRequestException({success: success});}
        return {success: success};
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204, description: 'Updated the user information successfully'})
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint' })
    @ApiResponse({ status: 404, description: 'The requested id could not be found' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new SkipProperties())
    public async updateUserProfile(@Request() req, @Param('id') id: string, @Body() updatedUser: PutUserProfileReq  ): Promise<any> {
        if(req.user.userId !== id){throw new UnauthorizedException('error_invalid_token');}

        let success = await this.userService.updateUserProfileById(id, updatedUser);
        return {success: success};
    }
}
