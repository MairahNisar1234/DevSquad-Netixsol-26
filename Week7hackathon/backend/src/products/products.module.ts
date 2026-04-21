import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/products.schema';
import { Material, MaterialSchema } from '../material/schemas/material.schema';

@Module({
  imports: [
    // Register both Product and Material schemas
    // We need MaterialSchema here to calculate "availableStock" logic
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  // Exporting this allows the Orders module to access Product logic
  exports: [ProductsService],
})
export class ProductsModule {}