import { Controller, Get, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    this.logger.log('--- [AUTH] Initiating Google SSO Redirect ---');
    // Guard handles the redirection automatically
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    this.logger.log(`--- [AUTH] Callback received for: ${req.user.email} ---`);
    
    const user = req.user;
    
    
    const redirectUrl = `http://localhost:3001/dashboard?email=${user.email}&name=${user.firstName}`;
    
    this.logger.log(`[AUTH] User authenticated. Redirecting to: ${redirectUrl}`);
    return res.redirect(redirectUrl);
  }
}