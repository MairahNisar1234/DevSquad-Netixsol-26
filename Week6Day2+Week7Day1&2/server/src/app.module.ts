import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ===========================
    // MONGODB CONNECTION
    // ===========================
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error('MONGO_URI is not defined in .env');
        }

        return {
          uri,
        };
      },
    }),

    // ===========================
    // FEATURE MODULES
    // ===========================
    AuthModule,
    ProductsModule,
    OrderModule,
    CloudinaryModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}