import { Body, Request, Controller, Get, Post, Param,Delete,Patch,HttpStatus, UseGuards, Put, Req, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Request() req) {
    const user = await this.userService.findUserById(req.user.id);
    return user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfileById(@Request() req) {
    const userProfile = await this.userService.findUserProfileById(req.user.id);
    return userProfile;
  }

  @Get('profile/:username')
  @UseGuards(JwtAuthGuard)
  async getUserProfileByUsername(@Request() req, @Param('username') username: string) {
    const userProfile = await this.userService.findUserProfileByUsername(username);
    return userProfile;
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req) {
    return await this.userService.remove(req.user.id);
  }

  @Post('profiles/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async setAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const user = await this.userService.updateAvatar(req.user.id, file.buffer)
    return user.profile;
  }

  @Get('user/:username')
  @UseGuards(JwtAuthGuard)
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    return user;
  }

  @Put('update/username')
  @UseGuards(JwtAuthGuard)
  public async updateUsername(@Req() req, @Body() body) {
    return await this.userService.updateUsername(req.user.id, body.username);
  }

  // @Patch('users/:id/profile')
  // public async updateUserProfile( @Param() param, @Body() body) {
  //     const users = await this.usersServices.update(param.ID, body);
  // }

}