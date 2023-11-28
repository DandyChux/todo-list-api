import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private requests = new Map<string, { count: number; startTime: Date }>();

  use(req: any, res: any, next: () => void) {
    const ip =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    const limit = 100; // max number of requests
    const windowMs = 15 * 60 * 1000; // 15 minutes

    if (!this.requests.has(ip)) {
      this.requests.set(ip, { count: 1, startTime: new Date() });
    } else {
      const data = this.requests.get(ip);
      const currentTime = new Date();
      if (currentTime.getTime() - data.startTime.getTime() > windowMs) {
        // reset count and start time
        data.count = 1;
        data.startTime = currentTime;
      } else if (data.count >= limit) {
        // limit exceeded
        return res
          .status(429)
          .send('Too many requests, please try again later.');
      } else {
        data.count += 1;
      }
    }

    next();
  }
}
