import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(email: string, pass: string, role: string = 'USER') {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new this.userModel({ 
      email, 
      password: hashedPassword, 
      role 
    });
    
    const savedUser = await newUser.save();
    return { message: 'User created', email: savedUser.email };
  }

  async login(email: string, pass: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    return {
      userId: user._id,
      email: user.email,
      role: user.role
    };
  }
}