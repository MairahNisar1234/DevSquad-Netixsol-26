import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notifModel: Model<Notification>,
  ) {}

  // Save a new notification to DB
  async create(data: any) {
    const newNotif = new this.notifModel(data);
    return await newNotif.save();
  }

  // Get notifications for a specific user
  async findByUser(userId: string) {
    return await this.notifModel
      .find({ recipient: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 }) // Newest first
      .populate('issuer', 'username profilePicture') // Get issuer details for the UI
      .limit(20)
      .exec();
  }

  // Mark all as read when they open the bell
  async markAsRead(userId: string) {
    return await this.notifModel.updateMany(
      { recipient: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    );
  }
}