import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractTokenHeader(context.switchToHttp().getRequest());
    const payload = await this.signInToken(token);
    context.switchToHttp().getRequest().user = payload;
    return true;
  }

  async signInToken(token: string): Promise<string> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    if (payload) {
      return payload;
    }
    throw new UnauthorizedException();
  }

  extractTokenHeader(request: Request): string {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      return token;
    }
    throw new UnauthorizedException();
  }
}
