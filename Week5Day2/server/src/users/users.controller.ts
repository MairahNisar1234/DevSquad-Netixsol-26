import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseGuards, 
  Req, 
  Put, 
  NotFoundException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. SIGNUP
  @Post('signup')
  signup(@Body() dto: any) {
    return this.usersService.signup(dto);
  }

  // 2. LOGIN
  @Post('login')
  login(@Body() dto: any) {
    return this.usersService.login(dto);
  }

  // 3. GET PROFILE (Publicly accessible by username)
  @Get('profile/:username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // 4. UPDATE PROFILE (Requires Auth)
  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async update(@Req() req: any, @Body() updateDto: any) {
    const userId = req.user.userId || req.user.sub || req.user.id; 
    
    if (!userId) {
      throw new NotFoundException('User identity not found in token');
    }

    const updatedUser = await this.usersService.updateProfile(userId, updateDto);
    
    return {
      message: 'Nexus Profile Synced Successfully',
      user: updatedUser
    };
  }

  // 5. FOLLOW/UNFOLLOW TOGGLE (Requires Auth)
  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  async toggleFollow(@Param('id') targetId: string, @Req() req: any) {
    const currentUserId = req.user.userId || req.user.sub || req.user.id;
    return this.usersService.toggleFollow(targetId, currentUserId);
  }

  @Get('all')
  async getAllUsers() {
    return this.usersService.findAll();
  }
}