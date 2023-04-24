import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { PongGateway } from './pong.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [PongService, PongGateway],
})
export class PongModule {}
