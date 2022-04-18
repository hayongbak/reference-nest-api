import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetTest{
    @ApiProperty({description: 'Was the call successful?'})
    success :boolean;
    @ApiPropertyOptional({description: 'The token of the test database'})
    token?: string;
    @ApiPropertyOptional({description: 'The error code from the database, if something went wrong'})
    error?: string;
}