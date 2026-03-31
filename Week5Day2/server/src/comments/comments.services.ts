import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comments.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  private toObjectId(id: string): Types.ObjectId {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException(`Invalid ID format`);
    return new Types.ObjectId(id);
  }

  async create(userId: string, dto: any): Promise<any> {
    const newComment = new this.commentModel({
      content: dto.content,
      postId: dto.postId,
      author: this.toObjectId(userId),
      parentId: dto.parentId ? this.toObjectId(dto.parentId) : null,
    });

    const saved = await newComment.save();
    return saved.populate('author', 'username profilePicture');
  }

  async findAllByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ postId })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
  }

  async toggleLike(commentId: string, userId: string): Promise<any> {
    const comment = await this.commentModel.findById(this.toObjectId(commentId));
    if (!comment) throw new NotFoundException('Comment not found');

    const uid = this.toObjectId(userId);
    comment.dislikes = comment.dislikes.filter(id => id.toString() !== uid.toString());

    const hasLiked = comment.likes.some(id => id.toString() === uid.toString());
    if (!hasLiked) comment.likes.push(uid);
    else comment.likes = comment.likes.filter(id => id.toString() !== uid.toString());

    return (await comment.save()).populate('author', 'username profilePicture');
  }

  async toggleDislike(commentId: string, userId: string): Promise<any> {
    const comment = await this.commentModel.findById(this.toObjectId(commentId));
    if (!comment) throw new NotFoundException('Comment not found');

    const uid = this.toObjectId(userId);
    comment.likes = comment.likes.filter(id => id.toString() !== uid.toString());

    const hasDisliked = comment.dislikes.some(id => id.toString() === uid.toString());
    if (!hasDisliked) comment.dislikes.push(uid);
    else comment.dislikes = comment.dislikes.filter(id => id.toString() !== uid.toString());

    return (await comment.save()).populate('author', 'username profilePicture');
  }

  async findById(id: string): Promise<any> {
    const comment = await this.commentModel.findById(this.toObjectId(id)).populate('author', 'username profilePicture');
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }
}