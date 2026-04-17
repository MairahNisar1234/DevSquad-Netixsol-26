import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // ✅ Removed .js for CommonJS compatibility
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // 1. Enable CORS
  // On Render, once you have your frontend URL, 
  // replace '*' with 'https://your-frontend.vercel.app'
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Global Validation
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // 3. Render Port Binding
  // Render looks for your app on 0.0.0.0
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); 
  
  logger.log(`🚀 Server is steaming ahead on port: ${port}`);
}
bootstrap();