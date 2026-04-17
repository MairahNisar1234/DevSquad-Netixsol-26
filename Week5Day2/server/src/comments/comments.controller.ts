import { Controller, Get, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { CommentsService } from './comments.services';
import { JwtAuthGuard } from '../users/jwt-auth.guard';
import { CommentsGateway } from './comments.gateway'; 

@Controller('comments') 
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsGateway: CommentsGateway 
  ) {}

  @Get(':postId')
  async getCommentsByPost(@Param('postId') postId: string) {
    return this.commentsService.findAllByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    const updated = await this.commentsService.toggleLike(id, req.user.userId);
    
    // ⚠️ CRITICAL: Broadcast the update so the UI refreshes for everyone
    this.commentsGateway.server.emit('comment_updated', updated);
    
    // Also trigger the notification logic here if needed
    const recipientId = updated.author._id?.toString() || updated.author.toString();
    if (recipientId !== req.user.userId) {
       this.commentsGateway.server.to(recipientId).emit('new_notification', {
         type: 'LIKE',
         from: req.user.username,
         message: `liked your comment`
       });
    }

    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/dislike')
  async toggleDislike(@Param('id') id: string, @Req() req: any) {
    const updated = await this.commentsService.toggleDislike(id, req.user.userId);
    
    // Broadcast the update
    this.commentsGateway.server.emit('comment_updated', updated);
    
    return updated;
  }
}