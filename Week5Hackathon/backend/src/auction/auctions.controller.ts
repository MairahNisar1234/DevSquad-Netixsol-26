import { 
  Controller, Get, Post, Body, Query, Param, Delete, 
  UseInterceptors, UploadedFiles, UseGuards, Request,
  Logger, InternalServerErrorException, ForbiddenException, NotFoundException,
  UnauthorizedException 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuctionService } from './auctions.service';
import { BidService } from '../bid/bid.service'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auctions')
export class AuctionController {
  private readonly logger = new Logger(AuctionController.name);

  constructor(
    private readonly auctionService: AuctionService,
    private readonly bidService: BidService 
  ) {}

  @Post('create') 
  @UseGuards(JwtAuthGuard) 
  @UseInterceptors(FilesInterceptor('files', 50)) 
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createAuctionDto: any,
    @Request() req: any 
  ) {
    const sellerId = req.user?.userId || req.user?.id || req.user?.sub || req.user?._id;
    
    if (!sellerId) {
        this.logger.error(`User ID missing! JWT User Object: ${JSON.stringify(req.user)}`);
        throw new InternalServerErrorException('User identification failed. Please check your token.');
    }

    /**
     * FIX: Fetch verified name from DB using the sellerId from token.
     * This overwrites any "wrong name" sent from the frontend.
     */
    const user = await this.auctionService.getUserById(sellerId); 
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Split the DB 'name' field for the Auction record
    const nameParts = (user.name || "").split(' ');
    const dbFirstName = nameParts[0] || "Unknown";
    const dbLastName = nameParts.slice(1).join(' ') || "";

    // 3. MAP DATA (Ensuring numbers are correctly cast)
    const auctionData = {
      ...createAuctionDto,
      // FORCE identity from Database
      firstName: dbFirstName,
      lastName: dbLastName,
      sellerId: sellerId,
      // Map form fields to service expectations
      basePrice: Number(createAuctionDto.maxBid),
      odometer: Number(createAuctionDto.mileage),
      year: createAuctionDto.year,
      make: createAuctionDto.make,
      model: createAuctionDto.model,
      minIncrement: Number(createAuctionDto.minIncrement || 100),
    };

    return this.auctionService.create(auctionData, files || []);
  }

  @Post(':id/bid')
  @UseGuards(JwtAuthGuard)
  async placeBid(@Param('id') id: string, @Body('amount') amount: number, @Request() req: any) {
    const userId = req.user?.userId || req.user?.id || req.user?.sub || req.user?._id;
    
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return this.bidService.PlaceBid(id, userId, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-auctions')
  async getMyAuctions(@Request() req: any) {
    const userId = req.user.userId || req.user.id; 
    return this.auctionService.findBySeller(userId);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.auctionService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) { 
    return this.auctionService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId || req.user?.id || req.user?.sub || req.user?._id;
    const auction = await this.auctionService.findOne(id);
    
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.sellerId?.toString() !== userId.toString()) {
      throw new ForbiddenException('You do not have permission to delete this auction');
    }

    return this.auctionService.remove(id);
  }
}