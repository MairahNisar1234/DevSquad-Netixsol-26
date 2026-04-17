import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller() // Removed 'products' from here to allow multiple root routes
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  async getProducts() {
    return this.productsService.findAll();
  }


  @Get('categories')
  async getCategories() {
    return this.productsService.findCategories();
  }
}