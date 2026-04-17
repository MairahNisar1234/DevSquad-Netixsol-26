import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type AuctionDocument = Auction & Document;

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
})
export class Auction {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  make!: string;

  @Prop({ required: true })
  model!: string;

  @Prop({ required: true })
  category!: string; 

  @Prop({ default: 0 })
  bidCount!: number;
  
  @Prop({ required: true, unique: true })
  vin!: string; 

  @Prop({ required: true })
  year!: string;

  @Prop({ default: '1.5L' })
  engineSize!: string;

  @Prop({ required: true })
  paint!: string;

  @Prop({ default: 'No' })
  gccSpecs!: string;

  @Prop({ default: 'Original paint' })
  accidentHistory!: string;

  @Prop({ default: 'Yes' })
  fullServiceHistory!: string;

  @Prop({ default: 'Completely stock' })
  modification!: string;

  @Prop({ default: '' })
  notes!: string;

  @Prop({ required: true })
  basePrice!: number; 

  @Prop({ default: 0 })
  highestBid!: number;

  @Prop({ default: 100 })
  minIncrement!: number;

  @Prop({ required: true, unique: true })
  lotNumber!: string;

  @Prop({ required: true })
  odometer!: number; 

  @Prop({ required: true, default: 'unspecified' })
  color!: string; 

  @Prop({ type: String, required: true })
  sellerId!: string; 

  @Prop({ required: true })
  endTime!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winnerId!: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  highestBidderId!: Types.ObjectId | null;

  @Prop({ 
    type: String, 
    enum: ['active', 'closed', 'cancelled'], 
    default: 'active' 
  })
  status!: string;

  @Prop({ type: [String], default: [] }) 
  images!: string[]; 
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

/**
 * 2. ADD THE VIRTUAL FIELD HERE
 * This links the Bids to the Auction based on the auction ID.
 */
AuctionSchema.virtual('bids', {
  ref: 'Bid',             // Name of the Bid model in your project
  localField: '_id',      // The Auction's ID
  foreignField: 'auction', // The field in your BidSchema that stores the Auction ID
});

