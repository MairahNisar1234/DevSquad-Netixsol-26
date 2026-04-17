import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ===========================
  // 🧾 CREATE ORDER
  // ===========================
  @Post()
  @UseGuards(JwtAuthGuard)
  async placeOrder(@Req() req, @Body() createOrderDto: any) {
    console.log('🧾 Creating order for user:', req.user);

    const userId = req.user.userId || req.user.id || req.user._id;

    const result = await this.orderService.createOrder(userId, createOrderDto);

    console.log('✅ Order created:', result._id);

    return result;
  }

  // ===========================
  // 💳 STRIPE CHECKOUT
  // ===========================
 @UseGuards(JwtAuthGuard)
@Post('checkout/stripe')
async createStripeCheckout(@Req() req, @Body() body: any) {

  console.log('🚀 CHECKOUT HIT');
  console.log('👤 req.user:', req.user);

  if (!req.user) {
    console.log('❌ NO USER FOUND IN REQUEST');
    throw new Error('User not authenticated');
  }

  return this.orderService.createCheckoutSession(body, req.user);
}

  // ===========================
  // ⭐ POINTS CHECKOUT
  // ===========================
  @Post('checkout/points')
  @UseGuards(JwtAuthGuard)
  async checkoutWithPoints(@Req() req, @Body() body: any) {
    console.log('⭐ Points checkout');

    const result = await this.orderService.checkoutWithPoints(
      body,
      req.user,
    );

    console.log('✅ Points order completed:', result._id);

    return result;
  }

  // ===========================
  // 📦 USER ORDERS
  // ===========================
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Req() req) {
    const userId = req.user.userId || req.user.id || req.user._id;

    console.log('📦 Fetching orders for:', userId);

    return this.orderService.getUserOrders(userId);
  }

  // ===========================
  // 🛠 ADMIN - ALL ORDERS
  // ===========================
  @Get()
  async getAllOrders(@Query('status') status?: string) {
    console.log('🛠 Fetching all orders');

    return this.orderService.findAll(status);
  }

  // ===========================
  // 🔍 SINGLE ORDER
  // ===========================
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrderDetails(@Param('id') id: string) {
    console.log('🔍 Fetching order:', id);

    return this.orderService.findOne(id);
  }

  // ===========================
  // ✏️ UPDATE STATUS
  // ===========================
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    console.log('✏️ Updating order status:', id, status);

    return this.orderService.updateStatus(id, status);
  }

  // ===========================
  // 🔔 STRIPE WEBHOOK (FIXED)
  // ===========================
 // server/src/order/order.controller.ts

@Post('webhook')
async stripeWebhook(
  @Req() req: any,
  @Headers('stripe-signature') signature: string,
) {
  console.log('🚀 WEBHOOK ENDPOINT HIT');
  const rawBody = req.rawBody;

  if (!rawBody) {
    console.error('❌ WEBHOOK ERROR: Missing raw body. Ensure main.ts has rawBody enabled!');
    throw new BadRequestException('Missing raw body');
  }

  try {
    const event = this.orderService['stripe'].webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    
    console.log('✅ Webhook Signature Verified');
    return this.orderService.handleWebhook(event);
  } catch (err:any) {
    console.error('❌ WEBHOOK VERIFICATION FAILED:', err.message);
    throw new BadRequestException(`Webhook Error: ${err.message}`);
  }
}
@Get('verify/:sessionId')
async verify(@Param('sessionId') sessionId: string) {
  const order = await this.orderService.findOneByStripeSession(sessionId);
  
  const points = Math.floor(order.totalAmount / 10);

  return {
    success: order.paymentStatus === 'paid',
    pointsEarned: points,
    totalAmount: order.totalAmount,
    order,
  };
}
}