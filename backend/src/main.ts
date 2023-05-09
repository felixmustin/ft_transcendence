import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as session from 'express-session';

// import session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.use(
  //   session({
  //     secret: 'my-secret', // change this to your own secret
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );

  app.enableCors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'ws://127.0.0.1:3000', 'ws://localhost:3000'] });
  app.use(cors({ origin: 'http://localhost:3000' }));
  await app.listen(3001);
}
bootstrap();
