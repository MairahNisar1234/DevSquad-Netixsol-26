import { Injectable, NotFoundException, Logger, InternalServerErrorException, Inject } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; 
import { Cron, CronExpression } from '@nestjs/schedule';
import { Auction, AuctionDocument } from './schemas/auctions.schema';
import { v2 as cloudinary } from 'cloudinary'; 
import { BidGateway } from '../bid/bid.gateway'; 
import { Bid, BidDocument } from '../bid/schema/bid.schema';
import { AuctionGateway } from './auctions.gateway'; 
const toStream = require('buffer-to-stream');

@Injectable()
export class AuctionService {
  private readonly logger = new Logger(AuctionService.name);

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary,
    @InjectModel('User') private readonly userModel: Model<any>,
    private readonly bidGateway: BidGateway,
    private readonly auctionGateway: AuctionGateway // ✅ Added missing injection
  ) {}

  /**
   * Create a new auction listing with Cloudinary image uploads
   */
  async create(data: any, files: Express.Multer.File[]): Promise<Auction> {
    this.logger.log(`Processing ${files?.length || 0} images for new auction: ${data.make} ${data.model}`);
    const imageUrls: string[] = [];

    try {
      if (files && files.length > 0) {
        for (const file of files) {
          const uploadResult: any = await new Promise((resolve, reject) => {
            const upload = this.cloudinaryInstance.uploader.upload_stream(
              { folder: 'bidding-platform' }, 
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
            );
            toStream(file.buffer).pipe(upload); 
          });
          imageUrls.push(uploadResult.secure_url);
        }
      }

      const lotNumber = `LOT-${Math.floor(100000 + Math.random() * 900000)}`;
      const auctionEndTime = new Date();
      auctionEndTime.setDate(auctionEndTime.getDate() + 7);

      const newAuction = new this.auctionModel({
        ...data,
        title: `${data.year} ${data.make} ${data.model}`,
        basePrice: Number(data.maxBid),
        odometer: Number(data.mileage),
        color: data.paint,
        category: data.category || 'Sedan',
        sellerId: data.sellerId,
        lotNumber: data.lotNumber || lotNumber, 
        images: imageUrls,
        endTime: data.endTime || auctionEndTime,
        status: 'active',
        vin: data.vin,
        year: data.year,
        engineSize: data.engineSize,
        paint: data.paint,
        gccSpecs: data.gccSpecs,
        accidentHistory: data.accidentHistory,
        fullServiceHistory: data.fullServiceHistory,
        modification: data.modification,
        notes: data.notes
      });
      
      const savedAuction = await newAuction.save();

      // ✅ Fixed property name from AuctionGateway to auctionGateway
      this.auctionGateway.sendNewAuctionNotification(savedAuction);

      this.bidGateway.server.emit('notification', {
        title: 'New Auction Alert!',
        message: `A new ${savedAuction.make} ${savedAuction.model} has just been posted.`,
        auctionId: savedAuction._id,
        image: savedAuction.images?.[0] || null,
        type: 'NEW_AUCTION'
      });

      return savedAuction;
    } catch (error) {
      this.logger.error("AUCTION_CREATE_ERROR", error);
      throw new InternalServerErrorException('Failed to create auction listing');
    }
  }

  async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    if (!file) throw new InternalServerErrorException('No file provided');
    try {
      const uploadResult: any = await new Promise((resolve, reject) => {
        const upload = this.cloudinaryInstance.uploader.upload_stream(
          { folder: 'user-avatars' }, 
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        toStream(file.buffer).pipe(upload);
      });
      return uploadResult.secure_url;
    } catch (error) {
      this.logger.error("CLOUDINARY_SINGLE_UPLOAD_ERROR", error);
      throw new InternalServerErrorException('Failed to upload profile image');
    }
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findAll(query: any): Promise<Auction[]> {
    const { category, make, minPrice, maxPrice, color } = query;
    const filters: any = {};
    if (category) filters.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (make) filters.make = { $regex: new RegExp(`^${make}$`, 'i') };
    if (color) filters.color = { $regex: new RegExp(`^${color}$`, 'i') };
    
    if (minPrice || maxPrice) {
      filters.basePrice = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    return this.auctionModel
      .find(filters)
      .populate('sellerId', 'name email')
      .populate('bids')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Auction> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID format');
    const auction = await this.auctionModel
      .findById(id)
      .populate('sellerId', 'name email')
      .populate('highestBidderId', 'name email')
      .populate('winnerId', 'name email')
      .exec();
    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAuctionClosing() {
    this.logger.log("Checking for Ended Auctions...");
    const expiredAuctions = await this.auctionModel.find({
        endTime: { $lte: new Date() },
        status: "active"
    });

    for (const auction of expiredAuctions) {
        const auctionIdStr = (auction._id as any).toString();
        await this.finalizeAuction(auctionIdStr);
        this.logger.log(`Auction ${auctionIdStr} finalized.`);
    }
  }

  async findBySeller(sellerId: string): Promise<Auction[]> {
    return this.auctionModel
      .find({ sellerId: sellerId as any }) 
      .sort({ createdAt: -1 })      
      .exec();
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const result = await this.auctionModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Auction not found');
    return { message: 'Auction deleted successfully', id };
  }

  async finalizeAuction(auctionId: string): Promise<Auction> {
    const highestBid = await this.bidModel
      .findOne({ auctionId })
      .sort({ amount: -1 })
      .exec();

    if (!highestBid) {
      const closedAuction = await this.auctionModel.findByIdAndUpdate(
        auctionId,
        { status: 'closed', winnerId: null },
        { new: true },
      );
      if (!closedAuction) throw new NotFoundException('Auction not found');
      
      // Notify closure even if no bids
      this.bidGateway.server.emit('auction-closed', { id: auctionId, winnerId: null });
      return closedAuction;
    }

    const updatedAuction = await this.auctionModel.findByIdAndUpdate(
      auctionId,
      {
        winnerId: highestBid.bidderId,
        status: 'closed',
      },
      { new: true },
    )
    .populate('winnerId', 'name email')
    .populate('sellerId', 'name email');

    if (!updatedAuction) throw new NotFoundException(`Auction ID ${auctionId} not found`);

    const auctionData = updatedAuction as any;
    const sellerId = auctionData.sellerId?._id?.toString() || auctionData.sellerId?.toString();
    const winnerId = auctionData.winnerId?._id?.toString() || auctionData.winnerId?.toString();

    // ✅ Aligning payload with frontend listeners
    const resultPayload = {
      id: auctionId,
      auctionId,
      winnerId,
      sellerId,
      finalPrice: highestBid.amount,
    };

    // Notify public channel
    this.bidGateway.server.emit('auction-closed', resultPayload);

    // ✅ Notify winner in their private room to trigger the Payment UI
    if (winnerId) {
      this.auctionGateway.server.to(winnerId).emit('won-auction', {
        auctionId,
        finalPrice: highestBid.amount,
        message: `🎉 Congratulations! You won the auction for ${auctionData.make} ${auctionData.model}.`,
      });
    }

    return updatedAuction;
  }
}