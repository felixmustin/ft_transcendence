import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private userProfileRepository: Repository<Profile>,
  ) {}

  async allUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: User): Promise<User> {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async createUserProfile(username: string, email: string, firstname: string, lastname: string, age:number, filepath: string): Promise<Profile> {
    const newProfile = new Profile();
    newProfile.username = username;
    newProfile.email = email;
    newProfile.firstname = firstname;
    newProfile.lastname = lastname;
    newProfile.age = age;
    newProfile.avatar = readFileSync(filepath);
    const savedProfile = await this.userProfileRepository.save(newProfile);
    return savedProfile;
  }
  
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.games', 'games')
      .where('user.id = :id', { id })
      .getOne();
  
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const userProfile = await this.findUserProfileByUsername(username)
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.id = :id', { id: userProfile.id })
      .getOne();
    return user;
  }

  async findUserProfileById(id: number): Promise<Profile> {
    const user = await this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("profile.games", "games")
      .where("user.id = :id", { id: id })
      .getOne();
  
    const userProfile = user.profile;
    return userProfile;
  }

  async findUserProfileByProfileId(id: number): Promise<Profile> {
    const profile = await this.userProfileRepository.findOne({ where: { id: id } });
    return profile;
  }

  async getLadder(): Promise<{ username: string; won: number }[]> {
    // Fetch all users with their profiles and games
    const users = await this.userRepository.find({
      relations: ['profile', 'profile.games'],
    });
  
    // Map the users to an array of objects containing username and number of games won
    const ladder = await Promise.all(
      users.map(async (user) => {
        const games = user.profile.games;
        let won = 0;
  
        // Calculate the number of games won
        for (const game of games) {
          if (await this.wonGame(user.id, game)) {
            won++;
          }
        }
  
        return {
          username: user.profile.username,
          won,
        };
      })
    );
  
    // Sort the ladder array based on the number of games won (descending order)
    const sortedLadder = ladder.sort((a, b) => b.won - a.won);
  
    return sortedLadder;
  }

  async blockUser(currentUserId: number, toBlockProfileId: number): Promise<void> {
    const currentUserProfile = await this.findUserProfileById(currentUserId);
    if (!currentUserProfile) {
      throw new NotFoundException('Current user not found');
    }
    if (currentUserProfile.id === toBlockProfileId) {
      throw new BadRequestException('You cannot block yourself');
    }

    if (currentUserProfile.blocked.includes(toBlockProfileId)) {
      throw new BadRequestException('User already blocked');
    }
    currentUserProfile.blocked.push(toBlockProfileId);
    await this.userProfileRepository.save(currentUserProfile)
    await this.updateUserProfile(currentUserId, currentUserProfile);
  }

  
  async getBlockedUsers(currentUserId: number): Promise<Profile[]> {
    const currentUserProfile = await this.findUserProfileById(currentUserId);
    if (!currentUserProfile) {
      throw new NotFoundException('Current user not found');
    }
    console.log(currentUserProfile);
    if (!currentUserProfile.blocked) {
      return [];
    }
    const blockedProfils = [] as Profile[];
    for (const blockedUserId of currentUserProfile.blocked) {
      blockedProfils.push(await this.findUserProfileById(blockedUserId));
    }
    return blockedProfils;
  }

  async getBlockedUsersList(currentUserId: number): Promise<number[]> {
    const currentUserProfile = await this.findUserProfileById(currentUserId);
    return currentUserProfile.blocked;
  }


  async unblockUser(currentUserId: number, toUnblockProfileId: number): Promise<void> {
    const currentUserProfile = await this.findUserProfileById(currentUserId);
    const toUnblockUserProfile = await this.findUserProfileByProfileId(toUnblockProfileId);
    if (!currentUserProfile || !toUnblockUserProfile) {
      throw new NotFoundException('User not found');
    }
    console.log('Blocked list: ', currentUserProfile.blocked);
    if (!currentUserProfile.blocked.includes(toUnblockProfileId)) {
      throw new BadRequestException('User not blocked');
    }
    currentUserProfile.blocked = currentUserProfile.blocked.filter((id) => id !== toUnblockProfileId);
    await this.userProfileRepository.save(currentUserProfile)
    await this.updateUserProfile(currentUserId, currentUserProfile);
  }

  async findUserByloginName(loginName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { loginName: loginName} });
    return user;
  }

  async wonGame(id: number, game: Game): Promise<boolean> {
    return (game.player1_id === id && game.player1_score > game.player2_score) ||
           (game.player2_id === id && game.player2_score > game.player1_score);
  }
  
  async stompGame(id: number, game: Game): Promise<boolean> {
    return (game.player1_id === id && game.player1_score > game.player2_score * 2) ||
           (game.player2_id === id && game.player2_score > game.player1_score * 2);
  }
  
  async findUserFlexProfileById(id: number): Promise<{played: number, won: number, stomp: number, rank: number}> {
    const games = (await this.findUserProfileById(id)).games;
    let played = games.length;
    let won = 0;
    let stomp = 0;
  
    for (const game of games) {
      if (await this.wonGame(id, game)) {
        won++;
      }
      if (await this.stompGame(id, game)) {
        stomp++;
      }
    }
  
    // Fetch all users and their games
    const users = await this.userRepository.find({ relations: ['profile', 'profile.games'] });
  
    // Calculate won games for each user and store them in an array
    const usersWonGames = await Promise.all(users.map(async (user) => {
      const gamesWon = (await Promise.all(user.profile.games.map(game => this.wonGame(user.id, game)))).filter(Boolean).length;
      return { id: user.id, won: gamesWon };
    }));
  
    // Sort users by games won in descending order
    usersWonGames.sort((a, b) => b.won - a.won);
  
    // Find the rank of the user with the given id
    let rank = usersWonGames.findIndex(user => user.id === id) + 1;
  
    return { played, won, stomp, rank };
  }
  

  async findUserFlexProfileByUsername(username: string): Promise<{played: number, won: number, stomp: number, rank: number}> {
    const profile = await this.findUserProfileByUsername(username);
    if (!profile) {
      throw new Error(`No user found with username ${username}`);
    }
    
    let played = 0;
    let won = 0;
    let stomp = 0;
    let rank = 0;

    if (profile.games) {
      const games = profile.games;
      played = games.length;
      for (const game of games) {
        if (await this.wonGame(profile.id, game)) {
          won++;
        }
        if (await this.stompGame(profile.id, game)) {
          stomp++;
        }
      }
    }
    return { played, won, stomp, rank };
}



  async findUserProfileByUsername(username: string): Promise<Profile> {
    const userProfile = await this.userProfileRepository.createQueryBuilder("profile")
      .leftJoinAndSelect("profile.games", "games")
      .where("profile.username = :username", { username: username })
      .getOne();
  
    return userProfile;
  }
  

  async find42UserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { user42id: id } });
    return user;
  }

  async updateUserProfile(id: number, profile: Profile): Promise<User> {
    const user = await this.findUserById(id)
    user.profile = profile
    return await this.userRepository.save(user);
  }

  async updateAvatar(id: number, file: Buffer): Promise<User> {
    const userProfile = await this.findUserProfileById(id)
    userProfile.avatar = file;
    const profile = await this.userProfileRepository.save(userProfile);
    return await this.updateUserProfile(id, profile)
  }

  async turnOn2FA(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.is2faenabled = true;
    await this.userRepository.save(user);
  }

  async turnOff2FA(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.is2faenabled = false;
    await this.userRepository.save(user);
  }

  async set2FASecret(secret: string, userId: number): Promise<User> {
    const user = await this.findUserById(userId)
    user.secret2fa = secret;
    return (await this.userRepository.save(user));
  }

  async remove(id: number) {
    const user = await this.userRepository.createQueryBuilder("user")
    .leftJoinAndSelect("user.profile", "profile")
    .where("user.id = :id", { id: id })
    .getOne();
    const userProfile = user.profile;
    await this.userRepository.remove(user);
    // this.userProfileRepository.remove(user.profile)
    return await this.userProfileRepository.remove(userProfile)//await this.userRepository.remove(user);
  }

  async updateUsername(id: number, newUsername: string): Promise<Profile> {
    const alreadyProfile = await this.findUserProfileByUsername(newUsername);
    if (alreadyProfile)
      throw new BadRequestException('Username already in use');

    const userProfile = await this.findUserProfileById(id)
    userProfile.username = newUsername;
    const user = await this.updateUserProfile(id,userProfile)
    if (!user.user42id)
    {
      user.loginName = newUsername;
      await this.userRepository.save(user);
    }
    return (userProfile)
  }

  async updateEmail(id: number, newEmail: string): Promise<Profile> {
    const userProfile = await this.findUserProfileById(id)
    userProfile.email = newEmail;
    const newProfile = await this.userProfileRepository.save(userProfile)
    await this.updateUserProfile(id,newProfile)
    return (newProfile)
  }

  async updateFirstname(id: number, newFirstname: string): Promise<Profile> {
    const userProfile = await this.findUserProfileById(id)
    userProfile.firstname = newFirstname;
    const newProfile =  await this.userProfileRepository.save(userProfile)
    await this.updateUserProfile(id,newProfile)
    return (newProfile)
  }

  async updateLastname(id: number, newLastname: string): Promise<Profile> {
    const userProfile = await this.findUserProfileById(id)
    userProfile.lastname = newLastname;
    const newProfile =  await this.userProfileRepository.save(userProfile)
    await this.updateUserProfile(id,newProfile)
    return (newProfile)
  }

}
