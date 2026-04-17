import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface OrderItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  size: string;
  color: string;
  priceAtPurchase: number;
}

@Schema({ timestamps: true })
export class Order extends Document {

  // ===========================
  // 👤 USER INFO
  // ===========================
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  phoneNumber!: string;

  @Prop({ required: true })
  address!: string;

  // ===========================
  // 💳 PAYMENT INFO
  // ===========================
  @Prop({ 
    required: true,
    enum: ['stripe', 'points', 'cod'] 
  })
  paymentMethod!: string;

  @Prop({ default: '0000' })
  lastFourDigits!: string;

  @Prop({ 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  })
  paymentStatus!: string;

  @Prop()
  stripeSessionId?: string;

  @Prop()
  stripePaymentIntentId?: string;

  @Prop({ default: 0 })
  pointsUsed?: number;

  // ===========================
  // 🛒 ITEMS
  // ===========================
  @Prop([{
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
  }])
  items!: OrderItem[];

  // ===========================
  // 💰 TOTALS
  // ===========================
  @Prop({ required: true })
  totalAmount!: number;

  // ===========================
  // 📦 ORDER STATUS (SHIPPING)
  // ===========================
  @Prop({ 
    default: 'pending', 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] 
  })
  status!: string;
 @Prop({
  type: Object,
})
summary!: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);