import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(username: string, pass: string) {
    const exists = await this.userModel.findOne({ username });
    if (exists) throw new ConflictException('Username already exists');

    const passwordHash = await bcrypt.hash(pass, 10);
    const newUser = new this.userModel({ username, passwordHash });
    await newUser.save();
    return { message: 'User created successfully' };
  }

  async login(username: string, pass: string) {
  const user = await this.userModel.findOne({ username });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isMatch = await bcrypt.compare(pass, user.passwordHash);
  if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  const payload = { sub: user._id, username: user.username };
  return {
    token: this.jwtService.sign(payload), // Changed from access_token to token
    username: user.username,
  };
}
}