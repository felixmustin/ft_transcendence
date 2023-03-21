import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.startegy';
import { FortyTwoStrategy } from './strategy/fortytwo.startegy';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Module({
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '20m' },
  }),],
  controllers: [AuthController, TwoFactorAuthenticationController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy, TwoFactorAuthenticationService],
})
export class AuthModule {}
