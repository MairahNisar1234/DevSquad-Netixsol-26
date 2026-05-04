// src/chat/schemas/conversation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId; 

  @Prop({ required: true })
question!: string;

// MAKE SURE THIS IS HERE
  @Prop({ required: true, index: true })
  sessionId!: string;

  @Prop({ required: true })
  answer!: string;

  @Prop({ type: Array })
  mongoQuery!: any; 

}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
