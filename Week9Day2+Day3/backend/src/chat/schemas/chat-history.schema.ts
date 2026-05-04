import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  sessionId!: string;

  @Prop({ required: true })
  role!: 'user' | 'assistant';

  @Prop({ required: true })
  content!: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);