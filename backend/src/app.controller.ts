import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { users } from './user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllUsers(): Promise<users[]> {
    return this.appService.getAllUsers();
  }
}
