import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend.vercel.app'] 
      : 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  return app.init();
};

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await createNestServer(server);
  const port = process.env.PORT ?? 3000;
  
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

export default server;