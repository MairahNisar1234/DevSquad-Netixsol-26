import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.services';
import { NotificationsService } from '../notifications/notifications.service'; 

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly commentsService: CommentsService,
    private readonly notificationsService: NotificationsService 
  ) {}

  // 1. PRIVATE ROOM: Essential for targeted notifications
  @SubscribeMessage('join_notifications')
  handleJoinNotifications(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (userId) {
      client.join(userId);
      console.log(`User ${userId} joined room: ${userId}`);
    }
  }

  // 2. LIVE TYPING: Makes the app feel "active"
  @SubscribeMessage('typing_start')
  handleTypingStart(@MessageBody() data: { postId: string; username: string }) {
    this.server.emit('user_typing', { ...data, isTyping: true });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(@MessageBody() data: { postId: string }) {
    this.server.emit('user_typing', { ...data, isTyping: false });
  }

  // 3. COMMENTS: Handles both the post and the notification
  @SubscribeMessage('add_comment')
  async handleComment(@MessageBody() data: any) {
    try {
      const cleanUserId = data.userId?.$oid || data.userId;
      const newComment = await this.commentsService.create(cleanUserId, data);
      
      // Update the comment list for everyone
      this.server.emit('new_comment', newComment);

      if (data.parentId) {
        const parentComment = await this.commentsService.findById(data.parentId);
        const recipientId = parentComment.author._id?.toString() || parentComment.author.toString();

        if (recipientId !== cleanUserId) {
          // PERSIST: Save to MongoDB
          await this.notificationsService.create({
            recipient: recipientId,
            issuer: cleanUserId,
            type: 'REPLY',
            message: 'replied to your comment'
          });

          // PUSH: Send to user's private room
          this.server.to(recipientId).emit('new_notification', {
            from: newComment.author.username,
            message: "replied to your comment",
            type: "REPLY"
          });
        }
      }
    } catch (error: any) {
      console.error("Comment Error:", error.message);
    }
  }

  // 4. LIKES: Targeted notification to the comment author
  @SubscribeMessage('like_comment')
  async handleLike(@MessageBody() data: any) {
    try {
      const cleanCommentId = data.commentId?.$oid || data.commentId;
      const cleanUserId = data.userId?.$oid || data.userId;
      
      const updated = await this.commentsService.toggleLike(cleanCommentId, cleanUserId);
      this.server.emit('comment_updated', updated);

      const recipientId = updated.author._id?.toString() || updated.author.toString();
      
      if (recipientId !== cleanUserId) {
        await this.notificationsService.create({
          recipient: recipientId,
          issuer: cleanUserId,
          type: 'LIKE',
          message: 'liked your comment'
        });

        this.server.to(recipientId).emit('new_notification', {
          type: 'LIKE',
          from: data.username, 
          message: `liked your comment`,
        });
      }
    } catch (error: any) {
      console.error("Like Error:", error.message);
    }
  }
@SubscribeMessage('dislike_comment')
async handleDislike(@MessageBody() data: any) {
  try {
    const cleanCommentId = data.commentId?.$oid || data.commentId;
    const cleanUserId = data.userId?.$oid || data.userId;
    
    const updated = await this.commentsService.toggleDislike(cleanCommentId, cleanUserId);
    this.server.emit('comment_updated', updated);

    const recipientId = updated.author._id?.toString() || updated.author.toString();
    
    if (recipientId !== cleanUserId) {
      // SAVE TO DB
      await this.notificationsService.create({
        recipient: recipientId,
        issuer: cleanUserId,
        type: 'DISLIKE', // Add this to your Enum in the schema!
        message: 'disliked your comment'
      });

      // EMIT TO USER
      this.server.to(recipientId).emit('new_notification', {
        type: 'DISLIKE',
        from: data.username, 
        message: `disliked your comment`,
      });
    }
  } catch (error: any) {
    console.error("Gateway Dislike Error:", error.message);
  }
}
  // 5. FOLLOW: Real-time alert when someone hits "Follow"
  @SubscribeMessage('notify_follow')
  async handleFollowNotification(@MessageBody() data: { targetId: string, followerId: string, followerName: string }) {
    if (data.targetId && data.followerId !== data.targetId) {
      await this.notificationsService.create({
        recipient: data.targetId,
        issuer: data.followerId,
        type: 'FOLLOW',
        message: 'started following you'
      });

      this.server.to(data.targetId).emit('new_notification', {
        from: data.followerName,
        message: "started following you!",
        type: "FOLLOW"
      });
    }
  }
}