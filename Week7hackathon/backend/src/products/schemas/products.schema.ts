import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class RecipeItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Material', required: true })
  materialId!: string;

  @Prop({ required: true })
  quantityNeeded!: number;

  @Prop({ type: Boolean, default: false })
  isOptional!: boolean;
}

// New Schema for Customization Options
@Schema()
class ProductOption {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Material' })
  materialId!: string;

  @Prop({ default: 0 })
  priceExtra!: number;

  @Prop({ type: String, enum: ['extra', 'removable'], default: 'extra' })
  type!: string;
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ type: [RecipeItem], required: true })
  recipe!: RecipeItem[];

  @Prop({ type: [ProductOption], default: [] }) // 🔥 Added this for user customization
  options!: ProductOption[];

  @Prop({ required: true })
  category!: string; 

  @Prop()
  imageUrl!: string; 
}

export const ProductSchema = SchemaFactory.createForClass(Product);