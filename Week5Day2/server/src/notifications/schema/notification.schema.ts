import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  issuer: Types.ObjectId;

  // MERGED ENUM: Includes all types including DISLIKE and REPLY
  @Prop({ 
    required: true, 
    enum: ['LIKE', 'REPLY', 'FOLLOW', 'DISLIKE', 'COMMENT'] 
  })
  type: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);