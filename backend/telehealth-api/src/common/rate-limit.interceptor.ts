import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private store: RateLimitStore = {};
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 100; // max requests per window

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const key = this.generateKey(request);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup(now);
    
    // Get or create rate limit entry
    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }
    
    const entry = this.store[key];
    
    // Reset if window has expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.windowMs;
    }
    
    // Increment request count
    entry.count++;
    
    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', this.maxRequests);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - entry.count));
    response.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));
    
    // Check if rate limit exceeded
    if (entry.count > this.maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          error: 'Rate limit exceeded',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    
    return next.handle();
  }

  private generateKey(request: any): string {
    // Use user ID if authenticated, otherwise use IP
    const userId = request.user?.userId;
    const ip = request.ip || request.connection.remoteAddress;
    return userId || ip;
  }

  private cleanup(now: number): void {
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }
}

