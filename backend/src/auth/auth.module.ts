import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.startegy';
import { HttpModule } from '@nestjs/axios';
import { FortyTwoStrategy } from './fortytwo.startegy';

@Module({
  imports: [UserModule, PassportModule, HttpModule, TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '20m' },
  }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy],
})
export class AuthModule {}
