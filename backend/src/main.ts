import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.use(cors({ origin: 'http://localhost:3000' }));
  await app.listen(3001);
  console.log(`Running on port 3001.`);
}
bootstrap();
