import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  userMessage!: string;

  @Prop({ required: true })
  botResponse!: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);