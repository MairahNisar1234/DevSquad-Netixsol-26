import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// server/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CRITICAL: Allow your future Vercel URL or '*' for now
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // CRITICAL: Use process.env.PORT for Railway/Render
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();

