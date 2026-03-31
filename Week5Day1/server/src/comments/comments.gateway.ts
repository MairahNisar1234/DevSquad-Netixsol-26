import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class CommentsGateway {
  @WebSocketServer()
  server!: Server; 

  // In-memory store (Reset on server restart)
  private comments: any[] = []; 

  @SubscribeMessage('join_blog')
  handleJoin(@MessageBody() data: { postId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.postId);
    // Sort by newest first before sending initial batch
    const filtered = this.comments
      .filter(c => c.postId === data.postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    client.emit('initial_comments', filtered);
  }

  @SubscribeMessage('add_comment')
  handleComment(@MessageBody() data: { text: string; user: string; postId: string }) {
    const newComment = {
      _id: Math.random().toString(36).substring(2, 11), // Slightly longer ID
      text: data.text,
      user: data.user,
      postId: data.postId,
      likes: 0,
      shares: 0, // Track shares for the new icon
      replies: [],
      createdAt: new Date().toISOString(), // Use ISO string for consistent frontend parsing
    };

    this.comments.push(newComment);
    
    // Broadcast to everyone in the room
    this.server.to(data.postId).emit('new_comment', newComment);
  }

  @SubscribeMessage('like_comment')
  handleLike(@MessageBody() data: { commentId: string; postId: string }) {
    const comment = this.comments.find(c => c._id === data.commentId);
    if (comment) {
      comment.likes += 1;
      // Tag the action so frontend shows 'Like' notification
      const updatedComment = { ...comment, lastAction: 'like' };
      this.server.to(data.postId).emit('comment_updated', updatedComment);
    }
  }

  @SubscribeMessage('reply_comment')
  handleReply(@MessageBody() data: { commentId: string; text: string; user: string; postId: string }) {
    const comment = this.comments.find(c => c._id === data.commentId);
    if (comment) {
      const newReply = { 
        user: data.user, 
        text: data.text, 
        createdAt: new Date().toISOString() 
      };
      comment.replies.push(newReply);
      
      // Tag the action so frontend shows 'Reply' notification
      const updatedComment = { ...comment, lastAction: 'reply' };
      this.server.to(data.postId).emit('comment_updated', updatedComment);
    }
  }

  // Optional: Track when someone clicks that new Share icon
  @SubscribeMessage('share_comment')
  handleShare(@MessageBody() data: { commentId: string; postId: string }) {
    const comment = this.comments.find(c => c._id === data.commentId);
    if (comment) {
      comment.shares = (comment.shares || 0) + 1;
      this.server.to(data.postId).emit('comment_updated', comment);
    }
  }
}