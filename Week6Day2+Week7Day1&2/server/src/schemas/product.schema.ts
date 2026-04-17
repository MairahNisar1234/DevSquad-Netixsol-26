import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Define the Review Structure
@Schema({ _id: true, timestamps: true })
export class Review {
  @Prop({ required: true })
  userName!: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ required: true })
  comment!: string;
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  brandName!: string;

  @Prop({ required: true, unique: true })
  sku!: string; 

  @Prop({ required: true, default: 0 })
  stock!: number;

  @Prop({ required: true })
  regularPrice!: number; 

  @Prop({ default: 0 })
  salePrice!: number; 

  @Prop({ default: 0 })
  priceInPoints!: number;

  @Prop({ required: true, default: 'cash_only', enum: ['cash_only', 'points_only', 'hybrid'] })
  purchaseType!: string;

  @Prop({ default: false })
  isOnSale!: boolean;

  @Prop({ default: 0 })
  discountPercentage!: number;

  @Prop([String])
  colors!: string[]; 

  @Prop([String])
  sizes!: string[]; 

  @Prop([String])
  tags!: string[]; 

  @Prop([{
    url: { type: String, required: true },
    color: { type: String, required: false }
  }])
  images!: { url: string; color: string }[];

  // --- NEW REVIEW FIELDS ---
  @Prop({ type: [Review], default: [] })
  reviews!: Review[];

  @Prop({ default: 0 })
  averageRating!: number;

  @Prop({ default: 0 })
  numReviews!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);