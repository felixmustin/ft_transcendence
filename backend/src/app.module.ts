import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from './user.entity';
// import { PongModule } from './pong/pong.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([users])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}