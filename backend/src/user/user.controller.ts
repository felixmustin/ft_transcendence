import { Body, Controller, Get, Post, Param,Delete,Patch,HttpStatus } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    return user;
  }

  @Get(':id/profile')
  async getUserProfileById(@Param('id') id: number) {
    const userProfile = await this.userService.findUserProfileById(id);
    return userProfile;
  }
  
  // @Patch('users/:id/profile')
  // public async updateUser( @Param() param, @Body() body) {
  //     const users = await this.userServices.update(param.ID, body);
  // }

  // @Patch('users/:id/profile')
  // public async updateUserProfile( @Param() param, @Body() body) {
  //     const users = await this.usersServices.update(param.ID, body);
  // }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);
    return await this.userService.remove(user);
  }

}