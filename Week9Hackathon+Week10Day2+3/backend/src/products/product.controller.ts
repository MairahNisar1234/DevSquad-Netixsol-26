import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.productsService.searchProducts(query);
  }
}