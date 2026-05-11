import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop()
category!: string;

  @Prop({ required: true })
  price!: number;

  @Prop()
  description!: string;

  @Prop()
  symptoms_addressed!: string; 

  @Prop({ default: 0 })
  stock_quantity!: number;

  @Prop()
  image_url!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);