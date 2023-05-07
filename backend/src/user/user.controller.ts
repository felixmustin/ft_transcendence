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

  @Post('profiles')
  async getUsersUsernameByIds(@Body() body: { users: number[] }) {
    console.log('Received body:', body);
    let profiles = [];
    const userIds = body.users;
    for (let i = 0; i < userIds.length; i++) {
      let profile = (await this.userService.findUserProfileById(userIds[i])).username;
      profiles.push(profile);
    }
    console.log('Returning profiles:', profiles);
    return profiles;
  }

  @Get('profile/flex')
  @UseGuards(JwtAuthGuard)
  async getUserFlexProfileById(@Request() req) {
    const {played, won, stomp, rank} = await this.userService.findUserFlexProfileById(req.user.id);
    return {played, won, stomp, rank};
  }

  @Get('profile/flex/:username')
  @UseGuards(JwtAuthGuard)
  async getUserFlexProfileByUsername(@Request() req, @Param('username') username: string) {
    const {played, won, stomp, rank} = await this.userService.findUserFlexProfileByUsername(req.user.id);
    return {played, won, stomp, rank};
  }

  @Get('profile/:username')
  @UseGuards(JwtAuthGuard)
  async getUserProfileByUsername(@Request() req, @Param('username') username: string) {
    const userProfile = await this.userService.findUserProfileByUsername(username);
    return userProfile;
  }

  @Get('ladder')
  async getLadder() {
    const ladder = await this.userService.getLadder();
    return ladder;
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req) {
    return await this.userService.remove(req.user.id);
  }

  @Put('disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnectUser(@Req() req) {
    // const user = await this.userService.findUserProfileById(req.user.id)
    // return await this.userService.changeStatus(user, 0);
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

  @Get('username/:id')
  async getUsernameById(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);
    return user.profile.username;
  }

  @Get('userid/:username')
  async getUserIdByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    return user.id;
  }

  @Put('update/username')
  @UseGuards(JwtAuthGuard)
  public async updateUsername(@Req() req, @Body() body) {
    return await this.userService.updateUsername(req.user.id, body.username);
  }

  @Put('update/email')
  @UseGuards(JwtAuthGuard)
  public async updateEmail(@Req() req, @Body() body) {
    return await this.userService.updateEmail(req.user.id, body.email);
  }

  @Put('update/firstname')
  @UseGuards(JwtAuthGuard)
  public async updateFirstname(@Req() req, @Body() body) {
    return await this.userService.updateFirstname(req.user.id, body.firstname);
  }

  @Put('update/lastname')
  @UseGuards(JwtAuthGuard)
  public async updateLastname(@Req() req, @Body() body) {
    return await this.userService.updateLastname(req.user.id, body.lastname);
  }

  // @Patch('users/:id/profile')
  // public async updateUserProfile( @Param() param, @Body() body) {
  //     const users = await this.usersServices.update(param.ID, body);
  // }
  @Get('noguard/:id')
  public async getUserByIdNoGuard(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }

}