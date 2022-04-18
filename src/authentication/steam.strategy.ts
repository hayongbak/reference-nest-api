import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtSecret } from "./shared/jwt.constants";
import * as config from 'src/config.json';

const SteamStrategy = require('passport-steam').Strategy;


@Injectable()
export class MySteamStrategy extends SteamStrategy(Strategy, 'steam') {
    constructor() {
        super({
            returnURL: config.steamApi.returnURL,
            realm: config.steamApi.realm,
            apiKey: config.steamApi.apiKey
        });
    }

    async validate(payload: any) {
        console.log("validate payload:");
        console.log(payload);
        return { userId: +payload.sub, username: payload.username, expiration: payload.exp };
    }
}