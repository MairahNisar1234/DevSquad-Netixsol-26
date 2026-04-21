import { Controller, Post, Body, Get, Param, Patch, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Complete a Sale (POS Transaction)
   * This creates the initial order with a default 'Pending' status.
   */
  @Post()
  async placeOrder(@Body() orderData: { items: { productId: string; quantity: number }[] }) {
    // Logic to check stock and subtract ingredients
    return this.ordersService.processOrder(orderData);
  }

  /**
   * Get order history for the Dashboard & Analytics
   */
  @Get()
  async getOrderHistory() {
    return this.ordersService.findAll();
  }

  /**
   * Update Order Status (Accept/Reject)
   * PATCH http://localhost:3000/orders/:id/status
   */
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const updatedOrder = await this.ordersService.updateStatus(id, status);
    
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }
}