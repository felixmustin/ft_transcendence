import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [UserModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
