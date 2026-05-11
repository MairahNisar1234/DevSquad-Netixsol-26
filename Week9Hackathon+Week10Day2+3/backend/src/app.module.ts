import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/product.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module'; // 1. Import it here

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    AuthModule,
    ProductsModule,
    ChatModule, // 2. Add it to the imports array
  ],
})
export class AppModule {}