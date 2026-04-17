import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Product, ProductSchema } from '../schemas/product.schema';
import { AuthModule } from '../auth/auth.module';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  imports: [
   
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, NotificationsGateway],
  exports: [ProductsService], 

})
export class ProductsModule {}