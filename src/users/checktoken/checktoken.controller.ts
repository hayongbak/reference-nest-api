import { Controller, Get, Request, UseGuards, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/authentication.guards';
import { NormalPipe } from 'src/shared/custom.pipe';

export class TokenResponse{
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    expiration_date_utc: Date;
    @ApiProperty()
    expiration_timestamp_utc: number;
}

@Controller('checktoken')
export class ChecktokenController {
    @Get()
    @ApiResponse({ status: 200, description: 'The user has a valid authentication token', type: TokenResponse})
    @ApiResponse({ status: 401, description: 'The user is unauthorized to call this API endpoint'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    public async checkToken(@Request() req): Promise<TokenResponse>{ // If we got here, then the guard has not stopped the token and it is still valid.
        return { success: true, expiration_date_utc: new Date(req.user.expiration*1000), expiration_timestamp_utc: req.user.expiration*1000 };
        // The expiration time (and other timestamps in jwt) is the amount of seconds from 1970-01-01T00:00:00Z UTC, ignoring leap seconds
        // if we use that as a timestamp for JavaScript dates, you need to multiply it by 1000 to amount for ms
        // https://tools.ietf.org/html/rfc7519#section-2
    }
}

