import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderItem } from '../schemas/order.schema';
import { Product } from '../schemas/product.schema';
import { User } from '../schemas/user.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Types } from 'mongoose';
@Injectable()
export class OrderService {
  private stripe!: InstanceType<typeof Stripe>;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly notificationsGateway: NotificationsGateway,
    private configService: ConfigService,
  ) {
    const stripeSecret = this.configService.get<string>('STRIPE_SECRET_KEY');

    console.log('🔑 Stripe key exists:', !!stripeSecret);

    if (!stripeSecret) {
      throw new Error('❌ STRIPE_SECRET_KEY missing in .env');
    }

    this.stripe = new Stripe(stripeSecret);

    console.log('✅ Stripe initialized');
  }

  // ===========================
  // 💳 STRIPE CHECKOUT (FIXED TOTAL)
  // ===========================
  async createCheckoutSession(orderDto: any, user: any) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    console.log('💳 Creating Stripe session...');

    const userId = user?.userId || user?._id || user?.id;

    if (!userId) {
      throw new BadRequestException('User must be authenticated to checkout');
    }

    // ✅ FIX: correct total calculation (this was causing 0 points issue)
    const calculatedTotal = orderDto.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    const INR_TO_USD = 0.012;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: orderDto.items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * INR_TO_USD * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel`,
      metadata: {
        userId: userId.toString(),
      },
    });

    console.log('✅ Stripe session created:', session.id);

    await this.orderModel.create({
      userId: userId,
      name: orderDto.name || user.name || 'Customer',
      email: orderDto.email || user.email,
      phoneNumber: orderDto.phoneNumber || '0000000000',
      address: orderDto.address || 'Pending Stripe Info',
      items: orderDto.items.map((item: any) => ({
        productId: item.productId,
        productName: item.name || item.productName,
        quantity: item.quantity,
        priceAtPurchase: item.price || item.priceAtPurchase,
        size: item.size || 'N/A',
        color: item.color || 'N/A',
      })),

      // ✅ FIXED: always correct value stored
      totalAmount: calculatedTotal,

      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripeSessionId: session.id,
    });

    console.log('📦 Pending order saved');

    return { url: session.url };
  }

  // ===========================
  // ⭐ POINTS CHECKOUT (UNCHANGED)
  // ===========================
  async checkoutWithPoints(orderDto: any, user: any) {
    console.log('⭐ Points checkout');

    const totalPoints = orderDto.total;

    if (user.loyaltyPoints < totalPoints) {
      throw new BadRequestException('Not enough points');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      $inc: { loyaltyPoints: -totalPoints },
    });

    const order = await this.orderModel.create({
      userId: user._id,
      items: orderDto.items,
      totalAmount: 0,
      pointsUsed: totalPoints,
      paymentMethod: 'points',
      paymentStatus: 'success',
    });

    console.log('✅ Points order created:', order._id);

    return order;
  }

  // ===========================
  // 🧾 NORMAL ORDER (UNCHANGED)
  // ===========================
  async createOrder(userId: string, createOrderDto: any) {
    console.log('🧾 Creating order');

    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');

    const { items, address, name, email, phoneNumber, summary } =
      createOrderDto;

    const orderName = name || user.name;
    const orderEmail = email || user.email;

    const pointsUsed = Number(summary?.pointsUsed) || 0;

    let calculatedTotal = 0;
    const processedItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productModel.findById(item.productId).lean();

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const price = Number(product['regularPrice']) || 0;
      const qty = Number(item.quantity) || 0;

      calculatedTotal += price * qty;

      await this.productModel.updateOne(
        { _id: item.productId },
        { $inc: { stock: -qty } },
      );

      processedItems.push({
        productId: product._id as any,
        productName: String(product['name'] || 'Product'),
        quantity: qty,
        size: item.size,
        color: item.color,
        priceAtPurchase: price,
      });
    }

    const discount = Math.round(calculatedTotal * 0.2);
    const deliveryFee = 15;

    const finalTotal =
      calculatedTotal - discount + deliveryFee - pointsUsed;

    const savedOrder = await this.orderModel.create({
      userId,
      name: orderName,
      email: orderEmail,
      phoneNumber,
      address,
      items: processedItems,
      totalAmount: finalTotal,
      paymentMethod: 'cod',
      paymentStatus: 'success',
      summary: {
        subtotal: calculatedTotal,
        discount,
        pointsUsed,
        deliveryFee,
        totalAmount: finalTotal,
      },
    });

    console.log('✅ Order created:', savedOrder._id);

    const pointsEarned = Math.floor(finalTotal / 10);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: pointsEarned - pointsUsed } },
      { new: true },
    );

    this.notificationsGateway.sendAdminOrderAlert(savedOrder);
    this.notificationsGateway.sendUserOrderConfirmation(
      userId,
      savedOrder._id.toString(),
    );

    if (updatedUser) {
      this.notificationsGateway.sendPointsNotification(
        pointsEarned,
        updatedUser.loyaltyPoints,
      );
    }

    return savedOrder;
  }




async handleWebhook(event: any) {
  console.log('🔔 WEBHOOK RECEIVED:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const stripeSessionId = session.id;

    console.log('💳 Stripe Session ID:', stripeSessionId);

    // 1. Find the order
    const order = await this.orderModel.findOne({ stripeSessionId });

    if (!order) {
      console.error('❌ ERROR: No order found for session:', stripeSessionId);
      return;
    }

    console.log('📦 Order Found:', order._id.toString(), 'Current Status:', order.paymentStatus);

    if (order.paymentStatus !== 'success') {
      // 2. Update Order Status
      order.paymentStatus = 'success';
      order.status = 'processing';
      await order.save();
      console.log('✅ Order status updated to PAID in DB');

      const pointsEarned = Math.floor(order.totalAmount / 10);
      console.log(`💰 Points Calculated: ${pointsEarned} (Total: ${order.totalAmount})`);

      console.log('👤 Attempting to add points to User ID String:', order.userId);
      
      try {
        const userObjectId = new Types.ObjectId(order.userId);

        const updatedUser = await this.userModel.findByIdAndUpdate(
          userObjectId,
          { $inc: { loyaltyPoints: pointsEarned } },
          { new: true }
        );

        if (updatedUser) {
          console.log('⭐ SUCCESS: User points updated. New balance:', updatedUser.loyaltyPoints);
        } else {
          console.error('❌ ERROR: findByIdAndUpdate returned null. User ID might not exist in Users collection.');
        }
      } catch (err) {
        console.error('❌ ERROR: Invalid User ID format or DB failure:', err);
      }
    } else {
      console.log('⚠️ Order was already marked as PAID. Skipping logic.');
    }
  }
}

async getUserOrders(userId: string) {
  console.log('🔍 FETCHING ORDERS FOR USER:', userId);
  
  try {
    const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 });
    console.log(`📊 Found ${orders.length} orders for this user.`);
    return orders;
  } catch (error) {
    console.error('❌ DB ERROR in getUserOrders:', error);
    return [];
  }
}

 

  async findAll(status?: string) {
    const filter = status ? { status } : {};
    return this.orderModel.find(filter).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException(`Order not found`);
    return order;
  }

  async findOneByStripeSession(sessionId: string) {
    const order = await this.orderModel.findOne({
      stripeSessionId: sessionId,
    });

    if (!order) {
      throw new NotFoundException('Order not found for this session');
    }

    return order;
  }

 async updateStatus(id: string, status: string) {
  const updatedOrder = await this.orderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!updatedOrder) {
    throw new NotFoundException('Order not found');
  }

  // ✅ SEND REAL-TIME EVENT TO ALL CLIENTS
  this.notificationsGateway.server.emit(
    'orderStatusUpdated',
    updatedOrder
  );

  // existing notification (keep)
  this.notificationsGateway.sendUserOrderConfirmation(
    updatedOrder.userId.toString(),
    updatedOrder._id.toString(),
  );

  return updatedOrder;
}

  async getProductSalesCount(productId: string): Promise<number> {
    const orders = await this.orderModel.find({
      'items.productId': productId,
    });

    return orders.reduce((total, order) => {
      const item = order.items.find(
        (i) => i.productId.toString() === productId,
      );
      return total + (item?.quantity || 0);
    }, 0);
  }
}