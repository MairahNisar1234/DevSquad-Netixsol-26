import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * This method can be customized to handle specific error 
   * messages if the token is missing or invalid.
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('You must be logged in to access the Cricket Graph');
    }
    return user;
  }
}