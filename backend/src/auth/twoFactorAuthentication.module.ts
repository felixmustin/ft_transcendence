import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFAStrategy } from './strategy/TwoFA.strategy';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';


@Module({
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: process.env.TWOFA_SECRET
  })],
  controllers: [TwoFactorAuthenticationController],
  providers: [TwoFAStrategy, TwoFactorAuthenticationService, AuthService],
  exports: [JwtModule, TwoFactorAuthenticationService],
})
export class TwoFactorAuthModule {}
