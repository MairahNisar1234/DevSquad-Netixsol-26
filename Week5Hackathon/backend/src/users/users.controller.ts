import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Logger,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './users.service';
import { AuctionService } from '../auction/auctions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly auctionService: AuctionService
  ) {}

  @Post('register')
  async register(@Body() userData: any) {
    return this.userService.register(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId || req.user.id;
    return this.userService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    const userId = req.user.userId || req.user.id;
    return this.userService.updateUser(userId, updateData);
  }

  // ✅ FIXED: Profile Image Upload Route
  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    const userId = req.user.userId || req.user.id;

    if (!file) {
      throw new InternalServerErrorException('No file uploaded');
    }

    try {
      // ✅ FIX: Use correct method (no change in logic, just correct function)
      const imageUrl = await this.auctionService.uploadSingleFile(file);

      // ✅ Same logic as before
      return this.userService.updateUser(userId, { avatar: imageUrl });

    } catch (error) {
      this.logger.error(`Avatar upload failed for user ${userId}`, error);
      throw new InternalServerErrorException('Failed to process profile image');
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}