import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Friends } from '../entities/friends.entity';

@Injectable()
export class FriendsService {

  constructor(
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    private userService: UserService,
  ) {}

    async getFriendsIdList(id: number) {
        const friendList = await this.friendsRepository.createQueryBuilder("friends")
        .select("friends")
        .where("(friends.fromUserId = :id OR friends.toUserId = :id)", { id })
        .andWhere('friends.accepted = true')
        .getMany();
        
        return friendList
      }

     async getFriendsListUserProfile(id: number, friendList: Friends[]) {
        let friendListUserProfile = [];

        let i = friendList.length;
        while(i--) {
          if (friendList[i].fromUserId == id)
            friendListUserProfile.push((await (this.userService.findUserProfileById(friendList[i].toUserId))))
          else if (friendList[i].toUserId == id)
            friendListUserProfile.push((await (this.userService.findUserProfileById(friendList[i].fromUserId))))
          }
        return friendListUserProfile;
      }

      async addFriendsWithUsername(fromUserId: number, toUserUsername: string){
        const toUser = await this.userService.findUserByUsername(toUserUsername)
        if (fromUserId == toUser.id)
          throw new BadRequestException('Cannot add yourself as friends');
        return this.addFriends(fromUserId, toUser.id)
      }

    
      async addFriends(fromUserId: number, toUserId: number) {
        const existingFriend = await this.friendsRepository.findOne({
          where: {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
        });
        const existingFriend2 = await this.friendsRepository.findOne({
          where: {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        });
      
        if (existingFriend || existingFriend2) {
          throw new BadRequestException('Friendship already exists.');
        }
        const friendship = new Friends();
        friendship.fromUserId = fromUserId
        friendship.toUserId = toUserId
        friendship.requestDate = new Date();
        await this.friendsRepository.save(friendship);
      }
    
      async acceptFriends(fromUserUsername: string, toUserId: number) {
        const fromUser = await this.userService.findUserByUsername(fromUserUsername)
        const existingFriend = await this.friendsRepository.findOne({
          where: {
            fromUserId: fromUser.id,
            toUserId: toUserId,
          },
        });  
        if (!existingFriend) {
          throw new BadRequestException('Request does not exists.');
        }
        if (existingFriend.accepted == true)
          throw new BadRequestException('Friendship already exists.');
        existingFriend.accepted = true;
        await this.friendsRepository.save(existingFriend);
      }

      async declineRequest(fromUserUsername: string, toUserId: number) {
        const fromUser = await this.userService.findUserByUsername(fromUserUsername)
        const existingFriend = await this.friendsRepository.findOne({
          where: {
            fromUserId: fromUser.id,
            toUserId: toUserId,
          },
        });  
        if (!existingFriend) {
          throw new BadRequestException('Request does not exists.');
        }
        if (existingFriend.accepted == true)
          throw new BadRequestException('Friendship already exists.');

        return await this.friendsRepository.remove(existingFriend);
      }
    
      async getFriendsRequest(id: number) {
        const friendRequest = await this.friendsRepository.createQueryBuilder("friends")
        .select("friends")
        .where("friends.toUserId = :id", { id })
        .andWhere('friends.accepted = false')
        .getMany();
        const friendRequestInfo = await Promise.all(friendRequest.map(async (request) => {
          const { fromUserId, requestDate } = request;
          const profile = await this.userService.findUserProfileById(fromUserId);
          return {
            username: profile.username,
            avatar: profile.avatar,
            date: requestDate,
          };
        }));
        return friendRequestInfo
      }
    
      async removeUserfromFriends(id: number) {
        const friendships = await this.friendsRepository.createQueryBuilder("friends")
        .select("friends")
        .where("(friends.fromUserId = :id OR friends.toUserId = :id)", { id })
        .getMany();
        
        let i = friendships.length;
        while(i--) {
          await this.friendsRepository.remove(friendships[i]);
        }
      }

      async removeFriendship(userId: number, userUsername:string) {
        const userTo = await this.userService.findUserByUsername(userUsername)
        const id = userTo.id
        const friendship = await this.friendsRepository.createQueryBuilder("friends")
        .select("friends")
        .where("(friends.fromUserId = :id OR friends.toUserId = :id)", { id })
        .andWhere("(friends.fromUserId = :id OR friends.toUserId = :id)", { userId })
        .andWhere('friends.accepted = true')
        .getOne();
        
        if (!friendship)
         throw new BadRequestException('Friendship does not exists.');
        
        return await this.friendsRepository.remove(friendship);
      }
}
