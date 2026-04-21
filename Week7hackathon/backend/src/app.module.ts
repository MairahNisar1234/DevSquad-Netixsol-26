import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import your custom modules
import { MaterialModule } from './material/material.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Load Environment Variables
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-pos'),

    MaterialModule,
    ProductsModule,
    OrdersModule,
    MediaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}