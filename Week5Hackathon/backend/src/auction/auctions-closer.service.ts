import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './schemas/auctions.schema';
import { BidGateway } from '../bid/bid.gateway';
import { User } from '../users/schemas/users.schema'; // ✅ Ensure this path is correct

@Injectable()
export class AuctionCloserService {
  private readonly logger = new Logger(AuctionCloserService.name);

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(User.name) private userModel: Model<User>, // ✅ Inject User model to get names
    private readonly bidGateway: BidGateway,
  ) {}

  /**
   * ✅ This function runs automatically every 60 seconds.
   * It finds "active" auctions where the endTime has passed.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredAuctions() {
    this.logger.log('Checking for expired auctions...');

    const now = new Date();

    // 1. Find all active auctions that should have ended by now
    const expiredAuctions = await this.auctionModel.find({
      status: 'active',
      endTime: { $lte: now },
    });

    if (expiredAuctions.length === 0) {
      return; 
    }

    this.logger.warn(`Found ${expiredAuctions.length} auctions to close.`);

    for (const auction of expiredAuctions) {
      try {
        // 2. Update the status in the database
        auction.status = 'closed';
        await auction.save();

        // ✅ 3. Find Winner Name for the Announcement
        let winnerName = "No Bids";
        if (auction.highestBidderId) {
          const winner = await this.userModel.findById(auction.highestBidderId);
          winnerName = winner ? winner.name : "Unknown User";
        }

        this.logger.log(`SUCCESS: Auction ${auction._id} (${auction.make} ${auction.model}) is now CLOSED.`);

        // 4. 📢 Tell the Frontend via Sockets (Includes Winner Name now)
        this.bidGateway.server.emit('auction-closed', {
          id: auction._id,
          title: `${auction.make} ${auction.model}`,
          winnerName: winnerName, // ✅ Added for frontend notification
          finalPrice: auction.highestBid || auction.basePrice,
        });

      } catch (error) {
        this.logger.error(`Failed to close auction ${auction._id}:`, error);
      }
    }
  }
}