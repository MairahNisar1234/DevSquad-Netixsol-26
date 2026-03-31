import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.notifService.findByUser(userId);
  }

  @Patch('read/:userId')
  async readAll(@Param('userId') userId: string) {
    return this.notifService.markAsRead(userId);
  }
}