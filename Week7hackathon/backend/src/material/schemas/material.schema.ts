import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Material extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true })
  unit!: string; 

  @Prop({ required: true, default: 0 })
  stockQuantity!: number;

  @Prop({ required: true, default: 10 })
  minStockLevel!: number;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);