import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
