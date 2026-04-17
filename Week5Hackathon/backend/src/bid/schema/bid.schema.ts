import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  bidderId!: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  amount!: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);