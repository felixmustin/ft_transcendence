import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PongModule } from './pong/pong.module';


@Module({
  imports: [UserModule, DatabaseModule, AuthModule, PongModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
