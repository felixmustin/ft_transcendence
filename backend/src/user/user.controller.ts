import { Body, Request, Controller, Get, Post, Param,Delete,Patch,HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Request() req) {
    const user = await this.userService.findUserById(req.user.id);
    return user;
  }

  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    return user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfileById(@Request() req) {
    const userProfile = await this.userService.findUserProfileById(req.user.id);
    return userProfile;
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req) {
    return await this.userService.remove(req.user.id);
  }

  // @Patch('users/:id/profile')
  // public async updateUser( @Param() param, @Body() body) {
  //     const users = await this.userServices.update(param.ID, body);
  // }

  // @Patch('users/:id/profile')
  // public async updateUserProfile( @Param() param, @Body() body) {
  //     const users = await this.usersServices.update(param.ID, body);
  // }

}