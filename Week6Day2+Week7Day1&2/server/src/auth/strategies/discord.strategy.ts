import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super({
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/api/auth/discord/callback`,
      scope: ['identify', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<any> {
    const { username, email, avatar, id } = profile;
    
    // Discord avatar URLs follow a specific pattern
    const avatarUrl = avatar 
      ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const user = {
      provider: 'discord',
      providerId: id,
      email: email,
      name: username,
      picture: avatarUrl,
    };
    done(null, user);
  }
}