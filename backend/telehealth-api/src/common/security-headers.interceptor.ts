import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SecurityHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    // Set security headers
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Remove server information
    response.removeHeader('X-Powered-By');

    return next.handle().pipe(
      catchError((error) => {
        // Don't expose internal error details in production
        if (process.env.NODE_ENV === 'production') {
          if (error instanceof HttpException) {
            return throwError(() => error);
          } else {
            return throwError(() => new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR));
          }
        }
        return throwError(() => error);
      }),
    );
  }
}

