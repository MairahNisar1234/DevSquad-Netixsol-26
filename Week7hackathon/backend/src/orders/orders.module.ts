import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema'; // 1. Import the schema
import { Product, ProductSchema } from '../products/schemas/products.schema';
import { Material, MaterialSchema } from '../material/schemas/material.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      // 2. Register the Order model here!
      { name: Order.name, schema: OrderSchema }, 
      { name: Product.name, schema: ProductSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}