
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtSecret } from './shared/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtbearer') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
}

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, expiration: payload.exp };
  }
}

@Injectable()
export class JwtUrlStrategy extends PassportStrategy(Strategy, 'jwturl') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
  }

  async validate(payload: any) {
    return { userId: +payload.sub, username: payload.username, expiration: payload.exp };
  }
}