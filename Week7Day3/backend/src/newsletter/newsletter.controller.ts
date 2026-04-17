import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  private readonly logger = new Logger(NewsletterController.name);

  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    this.logger.log(`--- [API POST] Newsletter Subscription Request for: ${email} ---`);

    if (!email || !email.includes('@')) {
      this.logger.warn(`[API ERROR] Invalid email provided: ${email}`);
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.newsletterService.subscribe(email);
      this.logger.log(`[API SUCCESS] Subscription flow complete for ${email}`);
      return result;
    } catch (error:any) {
      this.logger.error(`[API FATAL] Subscription failed: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}