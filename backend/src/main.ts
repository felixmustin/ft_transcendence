import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://localhost:3000',  'http://127.0.0.1:3000', 'http://localhost:3000/', 'http://127.0.0.1:3000/', 'ws://127.0.0.1:3000', 'ws://localhost:3000'] });
  app.use(cors({ origin: 'http://localhost:3000' }));
  await app.listen(3001);
  console.log(`Running on port 3001.`);
}
bootstrap();
