import { ApiProperty } from '@nestjs/swagger';

export class PostTestReq{
    @ApiProperty({description: 'api token we\'re looking for in the DB', default: 'This Is A Test Token Response'})
    token: string;
}

export class PostTestRes{
    @ApiProperty({description: 'Was the call successful?'})
    success :boolean;
}