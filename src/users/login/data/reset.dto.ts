import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { IsPasswordConfirmed } from "src/users/helpers/password-confirmed.constraint";

export class ResetSuccessResponse{
    @ApiProperty()
    success:boolean;
}

export class PostPasswordResetReq{
    @ApiProperty({description: 'Reset Token'})
    token: string;

    @ApiProperty({description: 'User email'})
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
}