import { Controller, Get, Post, Patch, Delete, Body, Param, Logger } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart() {
    this.logger.debug('🚀 API RECEIVED: GET /cart');
    return this.cartService.getCart();
  }

  @Post('add')
  async add(@Body() product: any) {
    this.logger.debug(`🚀 API RECEIVED: POST /cart/add (Product: ${product.name})`);
    return this.cartService.addItem(product);
  }

  @Patch('update')
  async update(@Body() body: { productId: string, action: 'increment' | 'decrement' }) {
    this.logger.debug(`🚀 API RECEIVED: PATCH /cart/update (ID: ${body.productId})`);
    return this.cartService.updateQty(body.productId, body.action);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.debug(`🚀 API RECEIVED: DELETE /cart/${id}`);
    return this.cartService.removeItem(id);
  }
}