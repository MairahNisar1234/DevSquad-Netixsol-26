import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let appInstance: any;

async function createApp() {
  if (!appInstance) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://assignmentbackend-eight.vercel.app',
        'https://aichecker-teal.vercel.app',
      ],
      credentials: false,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    appInstance = app;
  }

  return appInstance;
}

export default async (req: any, res: any) => {
  const app = await createApp();

  // 🔥 CRITICAL FIX: manually handle OPTIONS BEFORE Nest
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    return res.status(200).end();
  }

  return app.getHttpAdapter().getInstance()(req, res);
};