import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SymptomMap extends Document {
  @Prop({ required: true, unique: true })
  symptom!: string; // e.g., "tired"

  @Prop([String])
  recommendedProducts!: string[]; // e.g., ["Vitamin B Complex", "Iron Supplements"]
}

export const SymptomMapSchema = SchemaFactory.createForClass(SymptomMap);