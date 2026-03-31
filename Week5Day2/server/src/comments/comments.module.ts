import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.services';
import { CommentsGateway } from './comments.gateway';
import { Comment, CommentSchema } from './schemas/comments.schema';
import { NotificationsModule } from '../notifications/notifications.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    NotificationsModule,
  ],
  controllers: [CommentsController],
  // Use providers so they can talk to each other
  providers: [CommentsService, CommentsGateway],
  exports: [CommentsService],
})
export class CommentsModule {}