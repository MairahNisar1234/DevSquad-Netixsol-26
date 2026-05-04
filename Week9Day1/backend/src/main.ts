import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // Standard default import

let cachedServer: any;

async function createServer() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors({
      origin: process.env.FRONTEND_URL || '*', 
      methods: 'GET,POST',
      allowedHeaders: 'Content-Type,Authorization',
    });

    await nestApp.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

// Vercel's entry point
export default async (req: any, res: any) => {
  const server = await createServer();
  return server(req, res);
};