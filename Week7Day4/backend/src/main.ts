import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// We separate the creation logic so Vercel can call it as a function
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // 1. Enable CORS (Essential for your Sneaker Frontend)
    app.enableCors();

    // 2. Global Prefix (Optional - if you use this, your URLs become /api/...)
    // app.setGlobalPrefix('api');

    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

// 3. Vercel Handler Export
// This is the "magic" that lets Vercel run NestJS
export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};

// 4. Local Development Logic
// This keeps your 'npm run start' working on localhost:3000
if (process.env.NODE_ENV !== 'production') {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;
  
  NestFactory.create(AppModule).then(async (app) => {
    app.enableCors();
    await app.listen(port);
    logger.log(`🚀 Local Backend running on: http://localhost:${port}`);
  });
}