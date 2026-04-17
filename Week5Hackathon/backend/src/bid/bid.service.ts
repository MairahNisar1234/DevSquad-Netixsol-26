import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { Auction } from '../auction/schemas/auctions.schema';
import { BidGateway } from './bid.gateway';


@Injectable()
export class BidService {
    constructor(
        @InjectModel(Bid.name) private bidModel: Model<Bid>,
        @InjectModel(Auction.name) private auctionModel: Model<Auction>,
        private readonly bidGateway: BidGateway,
    ) {}

   async PlaceBid(auctionId: string, bidderId: string, amount: number) {
        try {
            if (!bidderId) {
                throw new BadRequestException('Invalid Bidder ID');
            }

            const auction = await this.auctionModel.findById(auctionId);
            if (!auction) throw new NotFoundException('Auction not found');

            console.log(`Bidding Check -> Bidder: ${bidderId} | Highest: ${auction.highestBidderId}`);

            if (auction.status !== 'active') {
                throw new BadRequestException(`This auction is ${auction.status} and no longer accepting bids`);
            }

            if (Date.now() > new Date(auction.endTime).getTime()) {
                throw new BadRequestException('Auction has ended');
            }

            const currentHighest = auction.highestBid || auction.basePrice;
            const minIncrement = auction.minIncrement || 100;
            const minRequiredBid = currentHighest + minIncrement;

            if (amount < minRequiredBid) {
                throw new BadRequestException(`Next bid must be at least $${minRequiredBid.toLocaleString()}`);
            }

            const sellerIdStr = auction.sellerId ? String(auction.sellerId) : null;
            const highestBidderIdStr = auction.highestBidderId ? String(auction.highestBidderId) : null;
            const bidderIdStr = String(bidderId);

            if (sellerIdStr && sellerIdStr === bidderIdStr) {
                throw new BadRequestException('Seller cannot bid on their own auction');
            }

            if (highestBidderIdStr && highestBidderIdStr === bidderIdStr) {
                throw new BadRequestException('You are already the highest bidder');
            }

          
            const updatedAuction = await this.auctionModel.findOneAndUpdate(
                {
                    _id: auctionId,
                    status: 'active', 
                    $or: [
                        { highestBid: { $lt: amount } },
                        { highestBid: { $exists: false } }
                    ]
                },
                {
                    $set: {
                        highestBid: amount,
                        highestBidderId: bidderId 
                    },
                    $inc: { bidCount: 1 } // 🔥 This ensures the List Card shows the correct count
                },
                { new: true }
            ).populate('highestBidderId', 'name').lean();

            if (!updatedAuction) {
                throw new BadRequestException('A higher bid was just placed by someone else. Please try again.');
            }

            const newBid = new this.bidModel({
                auctionId: auctionId,   
                bidderId: bidderId,     
                amount,
            });

            const savedBid = await newBid.save();

            const bidderName = updatedAuction.highestBidderId && typeof updatedAuction.highestBidderId === 'object'
                ? (updatedAuction.highestBidderId as any).name
                : 'Anonymous';

            this.bidGateway.emitNewBid(auctionId, {
                title: 'New Bid Placed!',
                message: `${bidderName} placed a bid of $${amount.toLocaleString()}`,
                highestBid: amount,
                highestBidderId: bidderId,
                bidderName: bidderName,
                bidCount: (updatedAuction as any).bidCount, // Pass the new count to the gateway
                type: 'NEW_BID',
                auctionId: auctionId,
                time: new Date()
            });

            return {
                success: true,
                message: 'Bid placed successfully',
                data: savedBid
            };

        } catch (error: unknown) {
            console.error("BID_ERROR:", error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            throw new InternalServerErrorException(errorMessage);
        }
    }

    // ... (getMyBiddingHistory and getBidsByAuction remain unchanged as they work fine)
    async getBidsByAuction(auctionId: string) {
        try {
            if (!auctionId) {
                throw new BadRequestException('Auction ID is required');
            }

            const bids = await this.bidModel
                .find({ auctionId: auctionId } as any) 
                .populate('bidderId', 'name email')
                .sort({ amount: -1 })
                .exec();

            if (!bids || bids.length === 0) {
                return {
                    success: true,
                    message: 'No bids yet for this auction',
                    data: []
                };
            }

            return {
                success: true,
                count: bids.length,
                highestBid: bids[0].amount,
                history: bids
            };
        } catch (error: unknown) {
            console.error("FETCH_BIDS_ERROR:", error);
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException('Could not retrieve bid history');
        }
    }

    async getMyBiddingHistory(bidderId: string) {
        try {
            if (!bidderId) {
                throw new BadRequestException('Invalid Bidder ID');
            }

            const bids = await this.bidModel
                .find({ bidderId: bidderId } as any) 
                .populate('auctionId')
                .sort({ createdAt: -1 })
                .exec();

            return {
                success: true,
                count: bids.length,
                data: bids
            };
        } catch (error) {
            console.error("MY_BIDS_ERROR:", error);
            throw new InternalServerErrorException('Could not retrieve your bidding history');
        }
    }
}