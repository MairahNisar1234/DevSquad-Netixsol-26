import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({
    type: [{
      productId: { type: Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      price: Number,
      notes: String,
      customizations: [Object]
    }],
    required: true
  })
  items!: any[];

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({ default: 'Pending' })
  status!: string;

  @Prop({ default: 'Dine In' }) 
  orderType!: string;

  @Prop({ default: Date.now })
  orderDate!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);