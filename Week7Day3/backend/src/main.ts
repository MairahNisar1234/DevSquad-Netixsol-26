import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Enable CORS so your Next.js app can call this API
  app.enableCors();
  
  // 2. Start the server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(`🔗 Test Auth at: http://localhost:${port}/auth/google`);
}
bootstrap();