import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(body: any) {
    const { email, username, password } = body;
    const exists = await this.userModel.findOne({ email });
    if (exists) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, username, password: hashedPassword });
    return user.save();
  }

  async login(body: any) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      username: user.username,
      access_token: this.jwtService.sign({ username: user.username, sub: user._id }),
    };
  }
}