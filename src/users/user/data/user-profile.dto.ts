import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MinLength, IsOptional} from 'class-validator';
import {  IsUniqueProperty } from '../../helpers/unique-property.constraint';
import { IsPasswordConfirmed } from '../../helpers/password-confirmed.constraint';
import { IsCaptchaCorrect } from '../../helpers/captcha-correct.constraint';
import { User } from '../../shared/user.entity';

export class PutUserProfileReq{
    @ApiProperty({description: 'User name of the new user to be created\r\n- minimum of 3 characters\r\n- should start with a letter\r\n- can contain lowercase, uppercase and digits'})
    @IsString({message: 'error_name_invalid'})
    @MinLength(3, {message: 'error_name_invalid'})
    @IsUniqueProperty({message: 'error_name_already_registered'})
    user_name: string;

    @ApiProperty({description: 'Unique email address of the new user to be created'})
    @IsEmail({ }, {message: 'error_email_invalid'})
    @IsString({message: 'error_email_invalid'})
    @IsUniqueProperty({message: 'error_email_already_registered'})
    user_email: string;

    @ApiProperty({description: 'Password of the new user to be created\r\n- minimum of 8 characters\r\n- can include any character'})
    @IsString({message: 'error_password_invalid'})
    @MinLength(8, {message: 'error_password_invalid'})
    user_password: string;

    @ApiProperty({description: 'Confirmation Password of the new user to be created\r\n- should be the same as original password'})
    @IsString({message: 'error_password_invalid'})
    @MinLength(8, {message: 'error_password_invalid'})
    @IsPasswordConfirmed('user_password', {message: 'error_password_no_match'})
    user_password_confirm: string;

    @ApiProperty({description: 'Profile picture url'})
    @IsString({message: 'error_picture_url_invalid'})
    user_avatar_url: string;
}


export class GetUserProfileDto {
    constructor(user: User) {
        this.user_id = user.user_id;
        this.user_name = user.user_name;
        this.user_avatar_url = user.user_avatar_url;
        this.user_email = user.user_email;
        this.registered = user.created;
        this.success = true;
    }

    @ApiProperty({ description: 'User ID of the requested user' })
    user_id: string;

    @ApiProperty({ description: 'User name of the requested user' })
    user_name: string;
    @ApiProperty({ description: 'Avatar Image Url of the requested user' })
    user_avatar_url: string;

    @ApiProperty({description: 'User email, only visible if logged in user requests'})
    @IsOptional()
    user_email: string;

    @ApiProperty({ description: 'Date (in UTC) when the requested user has registered' })
    registered: Date;

    @ApiProperty({ description: 'Was the call successful?' })
    success: boolean;
}