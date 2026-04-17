import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';

@Injectable()
export class authService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  // =========================
  // REGISTER
  // =========================
  async register(UserData: any) {
    const { email, name, password, role } = UserData;

    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      name,
      password: hashedPassword,
      role: role || 'user',
      provider: 'local',
      lastLogin: new Date(),
      loginHistory: [],
    });

    await newUser.save();

    return { message: 'User registered Successfully' };
  }

  // =========================
  // LOGIN
  // =========================
 async Login(UserData: any) {
    const { email, password } = UserData;

    // 1. Normalize email to lowercase to prevent case-sensitivity issues
    const normalizedEmail = email.toLowerCase();

    // 2. Find user and explicitly select password if your schema has { select: false }
    const user = await this.userModel.findOne({ email: normalizedEmail });

    // 3. Single check for security (don't tell the user IF the email exists or not)
    if (!user) {
       throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatching) {
       throw new UnauthorizedException('Invalid credentials');
    }

    try {
      // 4. Update Login Tracking
      user.lastLogin = new Date();
      user.provider = 'local';
      
      // Ensure loginHistory array exists before pushing
      if (!user.loginHistory) user.loginHistory = [];
      
      user.loginHistory.push({
        provider: 'local',
        loginAt: new Date(),
      });

      // 5. Save the updates
      await user.save();

      // 6. Create JWT Payload (Keep it small!)
      const payload = {
        email: user.email,
        sub: user._id, // 'sub' is the standard for user ID in JWTs
        role: user.role,
      };

      // 7. Return Token and Clean User Object (No password!)
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints || 0,
          provider: user.provider,
          lastLogin: user.lastLogin,
        },
      };
      
    } catch (error) {
      // Catching potential database save errors
      console.error('Login tracking update failed:', error);
      throw new UnauthorizedException('Login failed due to server error');
    }
  }

  // =========================
  // PROFILE
  // =========================
  async getProfile(userId: string) {
    console.log("🟡 PROFILE userId:", userId);

    if (!userId) {
      throw new UnauthorizedException('No user ID found in token');
    }

    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints || 0,
      provider: user.provider,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      loginHistory: user.loginHistory || [],
    };
  }

  // =========================
  // ALL USERS
  // =========================
  async findAllUsers() {
    return await this.userModel.find().select('-password').exec();
  }

  // =========================
  // DELETE USER
  // =========================
  async deleteUser(id: string) {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new BadRequestException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
  async update(userId: string, data: any) {
  return this.userModel.findByIdAndUpdate(userId, data, { new: true });
}

  // =========================
  // GOOGLE / GITHUB / DISCORD LOGIN
  // =========================
  async validateOAuthUser(profile: any) {
    console.log("🟡 OAuth profile:", profile);

    const email =
      profile.emails?.[0]?.value ||
      profile.email ||
      profile._json?.email;

    const avatar =
      profile.photos?.[0]?.value ||
      profile._json?.avatar_url ||
      profile._json?.picture;

    const name =
      profile.displayName ||
      profile.username ||
      profile._json?.name ||
      'User';

    const provider = profile.provider;
    const providerId = profile.id;

    if (!email) {
      throw new Error("No email from OAuth provider");
    }

    let user = await this.userModel.findOne({ email });

    // =========================
    // CREATE USER
    // =========================
    if (!user) {
      user = new this.userModel({
        email,
        name,
        avatar,
        provider,
        providerId,
        password: Math.random().toString(36).slice(2),
        role: 'user',
        loyaltyPoints: 0,
        lastLogin: new Date(),
        loginHistory: [
          {
            provider,
            loginAt: new Date(),
          },
        ],
      });

      await user.save();
    } else {
      // =========================
      // UPDATE USER
      // =========================
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.provider = provider;
      user.providerId = providerId;

      user.lastLogin = new Date();

      user.loginHistory.push({
        provider,
        loginAt: new Date(),
      });

      await user.save();
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user._id,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        provider: user.provider,
        lastLogin: user.lastLogin,
        avatar: user.avatar, 
      },
    };
  }
}