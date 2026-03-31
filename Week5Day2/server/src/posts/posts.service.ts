// server/src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schema/post.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private usersService: UsersService, // To get the following list
  ) {}

  async create(userId: string, content: string) {
    const newPost = new this.postModel({
      author: new Types.ObjectId(userId),
      content,
    });
    return (await newPost.save()).populate('author', 'username profilePicture');
  }

  // THE FEED LOGIC: Finds posts from people you follow
  async getFollowedFeed(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.postModel
      .find({
        author: { $in: user.following }, // $in matches any ID in the array
      })
      .sort({ createdAt: -1 })
      .populate('author', 'username profilePicture')
      .exec();
  }

  async findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).populate('author', 'username profilePicture').exec();
  }
}