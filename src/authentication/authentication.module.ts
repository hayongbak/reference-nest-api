import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { CryptoService } from './shared/crypto.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationService } from './shared/authentication.service';
import {jwtSecret, expiresIn} from './shared/jwt.constants';
import { JwtStrategy, JwtUrlStrategy } from './jwt.strategy';

@Module({
  providers: [ CryptoService, JwtStrategy, JwtUrlStrategy, AuthenticationService ], 
  imports: [PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: expiresIn },
    })],
  exports: [ CryptoService, AuthenticationService ]
})
export class AuthenticationModule {}
