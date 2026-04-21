import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

let app: any;

const initializeApp = async () => {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.init();
  }
  return app;
};

export default async (req: any, res: any) => {
  await initializeApp();
  server(req, res);
};


if (process.env.NODE_ENV !== 'production') {
  const bootstrap = async () => {
    const nestApp = await initializeApp();
    await nestApp.listen(3000);
    console.log('🚀 Local development server running on http://localhost:3000/api');
  };
  bootstrap();
}