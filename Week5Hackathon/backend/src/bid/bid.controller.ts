import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { BidService } from './bid.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  // ✅ PROTECTED ROUTE
  @UseGuards(JwtAuthGuard)
  @Post('place')
  async placeBid(
    @Body('auctionId') auctionId: string,
    @Body('amount') amount: number,
    @Request() req: any
  ) {
    const bidderId = req.user.userId; // ✅ from JWT

    return await this.bidService.PlaceBid(auctionId, bidderId, amount);
  }

  @Get('auction/:auctionId')
  async getAuctionHistory(@Param('auctionId') auctionId: string) {
    return await this.bidService.getBidsByAuction(auctionId);
  }
  // backend/src/bid/bid.controller.ts

@UseGuards(JwtAuthGuard)
@Get('my-history')
async getMyHistory(@Request() req) {
  // Use the ID from the token
  const userId = req.user.userId || req.user.id;
  return this.bidService.getMyBiddingHistory(userId);
}
}