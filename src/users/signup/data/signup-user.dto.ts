import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import {  IsUniqueProperty } from '../../helpers/unique-property.constraint';
import { IsPasswordConfirmed } from '../../helpers/password-confirmed.constraint';
import { IsCaptchaCorrect } from '../../helpers/captcha-correct.constraint';
import { User } from '../../shared/user.entity';

export class SignupUserReq{
    @ApiProperty({description: 'User name of the new user to be created\r\n- minimum of 3 characters\r\n- should start with a letter\r\n- can contain lowercase, uppercase and digits'})
    @IsNotEmpty({message: 'error_name_invalid'})
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
    @IsNotEmpty({message: 'error_password_invalid'})
    @MinLength(8, {message: 'error_password_invalid'})
    user_password: string;

    @ApiProperty({description: 'Confirmation Password of the new user to be created\r\n- should be the same as original password'})
    @IsString({message: 'error_password_invalid'})
    @IsNotEmpty({message: 'error_password_invalid'})
    @MinLength(8, {message: 'error_password_invalid'})
    @IsPasswordConfirmed('user_password', {message: 'error_password_no_match'})
    user_password_confirm: string;

    @ApiProperty({description: 'Captcha\r\n- This is currently a dummy implementation (still required but can be anything except empty!)'})
    @IsString({message: 'error_captcha_invalid'})
    @IsNotEmpty({message: 'error_captcha_invalid'})
    @IsCaptchaCorrect({message: 'error_captcha_invalid'})
    captcha: string;
}
export class UserNestedObject{
    @ApiProperty({description: "User name of the logged in user"})
    user_name: string;

    @ApiProperty({description: "User id of the logged in user"})
    user_id: string;
}
export class SignupUserRes{
    constructor(user: User, authentication_token: string) {
        this.user = new UserNestedObject();
        this.user.user_id = user.user_id;
        this.user.user_name = user.user_name;
        this.auth_token = authentication_token;
        this.success = true;
    }
    
    @ApiProperty({description: 'Was the call successful?'})
    success :boolean;

    @ApiProperty({type: UserNestedObject})
    user: UserNestedObject;

    @ApiProperty({description: 'The Authentication Token used to login as a user for subsequent calls'})
    auth_token: string;
}

