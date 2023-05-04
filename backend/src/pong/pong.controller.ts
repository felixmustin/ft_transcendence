import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Game } from 'src/entities/game.entity';
import { UserService } from 'src/user/user.service';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService,
    private readonly userService: UserService) {}

  @Post('add_game')
  async addGameToUserId(@Body() body: { game: Game }) {
    const game = await this.pongService.addGameToUserProfile(body.game);
    return game;
  }
}
