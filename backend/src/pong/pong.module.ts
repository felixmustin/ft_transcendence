import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { PongGateway } from './pong.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '15m' },
  }),],
  providers: [PongService, PongGateway, JwtStrategy],
})
export class PongModule {}
