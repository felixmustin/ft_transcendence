import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
// import { JwtStrategy } from 'src/auth/jwt.startegy';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
