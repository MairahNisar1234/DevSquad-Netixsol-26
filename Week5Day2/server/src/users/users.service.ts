import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/users.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: any) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const exists = await this.userModel.findOne({ 
      $or: [{ email: normalizedEmail }, { username: dto.username.trim() }] 
    });
    
    if (exists) throw new BadRequestException('Email or Username already in use');

    // Ensure password exists before hashing
    if (!dto.password) throw new BadRequestException('Password is required');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ 
      ...dto, 
      email: normalizedEmail, 
      password: hashedPassword,
      profilePicture: dto.profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    });
    
    await user.save();
    return { message: 'User created successfully' };
  }

  async login(dto: any) {
    // 1. Accept either username OR email from the frontend
    const identifier = dto.username || dto.email;
    const { password } = dto;

    if (!identifier || !password) {
      throw new UnauthorizedException('Username/Email and password are required');
    }

    // 2. Find user by checking BOTH the email and username fields
    const user = await this.userModel.findOne({ 
      $or: [
        { email: identifier.toLowerCase().trim() }, 
        { username: identifier.trim() }
      ] 
    }).select('+password');

    // 3. Safety Check
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id.toString(), username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { 
        id: user._id.toString(), 
        username: user.username, 
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0
      }
    };
  }
// ADD THIS METHOD
  async findById(userId: string) {
    const user = await this.userModel.findById(userId)
      .select('-password') // Never send the password back
      .exec();
    
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async findByUsername(username: string) {
    // Populate following as well to show complete profile stats
    const user = await this.userModel.findOne({ username })
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture')
      .exec();
      
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
async findAll() {
  return this.userModel.find().select('-password').exec(); 
}
async updateProfile(userId: string, updateDto: { profilePicture?: string; bio?: string }) {
  const updatedUser = await this.userModel.findByIdAndUpdate(
    userId,
    { 
      $set: { 
        profilePicture: updateDto.profilePicture, 
        bio: updateDto.bio 
      } 
    },
    { new: true } // This ensures the method returns the updated document
  ).exec();

  if (!updatedUser) {
    throw new NotFoundException('User not found');
  }

  // Return the user object in the same format your Login method uses
  return {
    id: updatedUser._id.toString(),
    username: updatedUser.username,
    bio: updatedUser.bio,
    profilePicture: updatedUser.profilePicture,
    followersCount: updatedUser.followers?.length || 0,
    followingCount: updatedUser.following?.length || 0
  };
}
  // users.service.ts
async toggleFollow(targetId: string, currentUserId: string) {
  // 1. Fetch both users
  const targetUser = await this.userModel.findById(targetId);
  const currentUser = await this.userModel.findById(currentUserId);

  // 2. Use .some() and .toString() for reliable comparison
  const isAlreadyFollowing = currentUser.following.some(
    (id) => id.toString() === targetId
  );

  if (isAlreadyFollowing) {
    // UNFOLLOW
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
  } else {
    // FOLLOW
    currentUser.following.push(new Types.ObjectId(targetId) as any);
    targetUser.followers.push(new Types.ObjectId(currentUserId) as any);
  }

  // 3. Save both!
  await currentUser.save();
  await targetUser.save();

  return { 
    following: !isAlreadyFollowing, 
    followerCount: targetUser.followers.length 
  };
}
}