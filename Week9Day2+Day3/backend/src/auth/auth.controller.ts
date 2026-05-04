import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    this.logger.log(`Creating account for: ${body.username}`);
    return this.authService.signup(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: any) {
    this.logger.log(`Login attempt for: ${body.username}`);
    return this.authService.login(body.username, body.password);
  }
}