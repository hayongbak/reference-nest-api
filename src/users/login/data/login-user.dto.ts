import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import { User } from '../../shared/user.entity';

export class LoginUserReq{
    @ApiProperty({description: 'Unique email address of the user'})
    @IsEmail({ }, {message: 'error_email_invalid'})
    @IsString({message: 'error_email_invalid'})
    user_email: string;

    @ApiProperty({description: 'Password of the user to be checked'})
    @IsString({message: 'error_password_invalid'})
    @IsNotEmpty({message: 'error_password_invalid'})
    user_password: string;
}
export class UserNestedObject{
    @ApiProperty({description: "User name of the logged in user"})
    user_name: string;

    @ApiProperty({description: "User id of the logged in user"})
    user_id: string;
}
export class LoginUserRes{
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

