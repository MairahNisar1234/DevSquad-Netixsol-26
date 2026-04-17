// src/auth/strategies/github.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/api/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { username, emails, photos, id } = profile;
    const user = {
      provider: 'github',
      providerId: id,
      email: emails[0].value,
      name: username,
      picture: photos[0].value,
    };
    done(null, user);
  }
}