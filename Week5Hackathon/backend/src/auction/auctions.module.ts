import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionService } from './auctions.service';
import { AuctionController } from './auctions.controller';
import { Auction, AuctionSchema } from './schemas/auctions.schema';
import { User, UserSchema } from '../users/schemas/users.schema';
import { Bid, BidSchema } from '../bid/schema/bid.schema';
import { CloudinaryProvider } from './cloudinary.provider';
import { BidModule } from '../bid/bid.module';
import { UserModule } from '../users/users.module';
import { AuctionCloserService } from './auctions-closer.service';
import { AuctionGateway } from './auctions.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
      { name: Bid.name, schema: BidSchema },
    ]),
    BidModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuctionController],
  providers: [
    AuctionService, 
    CloudinaryProvider, 
    AuctionCloserService,
    AuctionGateway 
  ],
  exports: [
    AuctionService, 
    MongooseModule, 
    AuctionGateway 
  ],
})
export class AuctionModule {}