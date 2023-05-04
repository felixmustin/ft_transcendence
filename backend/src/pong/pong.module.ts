import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { PongGateway } from './pong.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy/jwt.startegy';
import { UserModule } from 'src/user/user.module';
import { PongController } from './pong.controller';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Game, User, Profile]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    PongService,
    PongGateway,
    JwtStrategy,
  ],
  controllers: [PongController],
})
export class PongModule {}

