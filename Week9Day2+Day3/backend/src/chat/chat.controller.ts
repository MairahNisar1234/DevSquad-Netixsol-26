import { Body, Controller, Post, Get, Req, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CricketService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class AskDto {
  question!: string;
  sessionId?: string; 
}

@Controller('api')
export class CricketController {
  constructor(private readonly cricketService: CricketService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ask')
  async ask(@Body() body: AskDto, @Req() req: any) {
    const userId = req.user?.userId; 

    if (!userId) {
      throw new UnauthorizedException('User identity could not be verified');
    }

    const sessionId = body.sessionId || 'default-session';

    return this.cricketService.ask(
      body.question, 
      sessionId, 
      userId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.cricketService.getHistory(userId);
  }

  /**
   * New Summary Endpoint
   * GET /api/summary/:userId
   */
  @UseGuards(JwtAuthGuard)
  @Get('summary/:userId')
  async getSummary(@Param('userId') userId: string) {
    return this.cricketService.getChatSummary(userId);
  }
}