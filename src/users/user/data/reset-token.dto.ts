import { ApiProperty } from "@nestjs/swagger";

export interface ResetTokenDto{
    token: string;
    user_name: string;
    user_email: string;
}