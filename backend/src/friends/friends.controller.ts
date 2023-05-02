import { Body, Request, Controller, Get, Post, UseGuards, Delete, Param} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

  @Get('get/list')
  @UseGuards(JwtAuthGuard)
  async getFriendsList(@Request() req) {
    const friendsIdList = await this.friendsService.getFriendsIdList(req.user.id)
    return friendsIdList
  }

  @Get('get/list/profiles')
  @UseGuards(JwtAuthGuard)
  async getFriendsListUsername(@Request() req) {
    const friendsList = await this.friendsService.getFriendsIdList(req.user.id)
    const friendsListUserProfile = await this.friendsService.getFriendsListUserProfile(req.user.id, friendsList)

    return friendsListUserProfile
  }


  @Get('get/requests')
  @UseGuards(JwtAuthGuard)
  async getFriendsRequest(@Request() req) {
    const friendsRequests = await this.friendsService.getFriendsRequest(req.user.id)
    return (friendsRequests)
  }

  @Post('send/request')
  @UseGuards(JwtAuthGuard)
  async addFriends(@Request() req, @Body() body) {
    console.log(body)
   return  await this.friendsService.addFriendsWithUsername(req.user.id, body.username)
  }

  @Post('accept/request')
  @UseGuards(JwtAuthGuard)
  async acceptFriends(@Request() req, @Body() body) {
    console.log(body)
   return  await this.friendsService.acceptFriends(body.username, req.user.id)
  }

  @Post('decline/request')
  @UseGuards(JwtAuthGuard)
  async declineFriends(@Request() req, @Body() body) {
    console.log(body)
    return await this.friendsService.declineRequest(body.username, req.user.id);
  }

  @Delete('delete/user')
  @UseGuards(JwtAuthGuard)
  async deleteUserfromFriends(@Request() req) {
    return await this.friendsService.removeUserfromFriends(req.user.id);
  }

  @Delete('delete/:username')
  @UseGuards(JwtAuthGuard)
  async deleteFriendship(@Request() req, @Param('username') userUsername: string) {
    return await this.friendsService.removeFriendship(req.user.id, userUsername);
  }

}
