import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { authService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
// --- NEW STRATEGY IMPORTS ---
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretrandomstring123', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [
    authService, 
    JwtStrategy,
    // --- ADDED SOCIAL STRATEGIES ---
    GoogleStrategy,
    GithubStrategy,
    DiscordStrategy
  ],
  exports: [JwtStrategy, PassportModule], 
})
export class AuthModule {}