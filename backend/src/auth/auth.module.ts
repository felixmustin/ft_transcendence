import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.startegy';
import { FortyTwoStrategy } from './strategy/fortytwo.startegy';

@Module({
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: process.env.JWT_SECRET
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,FortyTwoStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
