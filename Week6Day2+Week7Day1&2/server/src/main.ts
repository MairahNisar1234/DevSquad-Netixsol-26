import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Keep this enabled
  });

  app.setGlobalPrefix('api');

  // ============================================================
  // 🔥 THE FIX: Custom JSON Parser Configuration
  // ============================================================
  app.use(
    express.json({
      verify: (req: any, res, buf) => {
        // Only attach rawBody if we are hitting the webhook endpoint
        if (req.url && req.url.includes('/api/orders/webhook')) {
          req.rawBody = buf; 
        }
      },
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://ecommerce-alpha-jet-71.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server is running on: http://localhost:${port}/api`);
}

bootstrap();