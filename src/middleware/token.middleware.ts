import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const token = req.cookies['access_token'];
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    next();
  }
}
