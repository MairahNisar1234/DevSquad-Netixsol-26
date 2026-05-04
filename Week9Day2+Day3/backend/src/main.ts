import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://cricket-ai-app.vercel.app',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Logic: If there is no origin (server-to-server) or the origin is in our whitelist
      if (!origin || allowedOrigins.some(o => o === origin)) {
        callback(null, true);
      } else {
        logger.error(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept',
      'X-Custom-Header' // Add any other custom headers your frontend uses
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}
bootstrap();