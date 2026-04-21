import { Controller, Get, Post, Body, Delete, Param, Logger, Patch} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() productDto: any) {
    this.logger.log('--- API POST: Received request to create new product ---');
    return this.productsService.create(productDto);
  }

  @Get('available')
  async getAvailable() {
    this.logger.log('--- API GET: POS Dashboard requesting available stock ---');
    return this.productsService.getAvailableProducts();
  }
  @Delete(':id')
async remove(@Param('id') id: string) {
  return this.productsService.delete(id);
}
@Patch(':id')
async update(@Param('id') id: string, @Body() updateProductDto: any) {
  return this.productsService.update(id, updateProductDto);
}
}