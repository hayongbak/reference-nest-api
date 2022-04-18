import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as configuration from 'src/config.json';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwtbearer') {
    handleRequest(err, user, info) { // By overriding the handleRequest method we can return our own error messages
        if (err || !user) {
          throw err || new UnauthorizedException('error_invalid_token');
        }
        return user;
      }
}


@Injectable()
export class AdminAuthGuard extends AuthGuard('jwtbearer') {
    handleRequest(err, user, info) { // By overriding the handleRequest method we can return our own error messages
        if (err || !user) {
          throw err || new UnauthorizedException('error_invalid_token');
        }
        if(configuration.adminIds.indexOf(+user.userId) < 0 && user.role !== 'A'){ // making it future proof if roles are ever a thing
          throw new UnauthorizedException('error_invalid_token');
        }
        return user;
      }
}

@Injectable()
export class JwtUrlAuthGuard extends AuthGuard('jwturl') {
  handleRequest(err, user, info) { // By overriding the handleRequest method we can return our own error messages
    if (err || !user) {
      throw err || new UnauthorizedException('error_invalid_token');
    }
    return user;
  }
}

@Injectable()
export class SteamAuthGuard extends AuthGuard('steam') {
  handleRequest(err, user, info) { // By overriding the handleRequest method we can return our own error messages
    if (err || !user) {
      throw err || new UnauthorizedException('error_invalid_token');
    }
    return user;
  }
}