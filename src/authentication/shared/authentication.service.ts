import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload';
import * as configuration from 'src/config.json';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthenticationService {
    constructor(private jwtService: JwtService){}

    async createJwtToken(payload: JwtPayload): Promise<string>{
        payload.iss = configuration.passport.jwtissuer;
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string){
        return await this.jwtService.verify(token);
    }

}
