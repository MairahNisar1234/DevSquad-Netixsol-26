import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { Bid, BidSchema } from './schema/bid.schema'; 
import { Auction, AuctionSchema } from '../auction/schemas/auctions.schema';
import {BidGateway} from './bid.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Auction.name, schema: AuctionSchema },
  
    ]),
  ],
  controllers: [BidController],
  providers: [BidService, BidGateway],
  exports: [BidService, BidGateway],
})
export class BidModule {}