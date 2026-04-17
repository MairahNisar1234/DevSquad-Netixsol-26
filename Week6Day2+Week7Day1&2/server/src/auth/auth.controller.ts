import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Delete,
  Param,
  Req,
  Res,
  Patch,
} from '@nestjs/common';

import { authService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: authService) {}

  // =========================
  // REGISTER
  // =========================
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.Login(body);
  }

  // =========================
  // ALL USERS
  // =========================
  @Get('all-users')
  async getAllUsers() {
    return this.authService.findAllUsers();
  }

  // =========================
  // PROFILE (JWT PROTECTED)
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    console.log('🟡 User from Token:', req.user);

    const userId = req.user.sub || req.user.userId || req.user.id;

    return this.authService.getProfile(userId);
  }

  // =========================
  // DELETE USER
  // =========================
  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
  @Patch('update-profile')
@UseGuards(JwtAuthGuard)
async updateProfile(@Req() req, @Body() updateData: { avatar?: string; name?: string }) {
  const userId = req.user.userId || req.user.id || req.user._id;
  return this.authService.update(userId, updateData);
}

  // =========================
  // GOOGLE LOGIN
  // =========================
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const result = await this.authService.validateOAuthUser(req.user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return res.redirect(
      `${frontendUrl}/login-success?token=${result.access_token}`
    );
  }

  // =========================
  // GITHUB LOGIN
  // =========================
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req: any) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: any, @Res() res: any) {
    const result = await this.authService.validateOAuthUser(req.user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // ✅ FIXED

    return res.redirect(
      `${frontendUrl}/login-success?token=${result.access_token}`
    );
  }

  // =========================
  // DISCORD LOGIN
  // =========================
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth(@Req() req: any) {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(@Req() req: any, @Res() res: any) {
    const result = await this.authService.validateOAuthUser(req.user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return res.redirect(
      `${frontendUrl}/login-success?token=${result.access_token}`
    );
  }
  
  
}
