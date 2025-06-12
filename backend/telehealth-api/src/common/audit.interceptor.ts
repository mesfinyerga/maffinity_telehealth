import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLog } from '../common/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, body, user, ip, headers } = request;
    const userAgent = headers['user-agent'];
    
    // Skip logging for certain endpoints
    const skipPaths = ['/health', '/metrics', '/api/docs'];
    if (skipPaths.some(path => url.includes(path))) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logAction({
            userId: user?.userId,
            action: `${method} ${url}`,
            resourceType: this.extractResourceType(url),
            resourceId: this.extractResourceId(url, data),
            newValues: this.sanitizeData(body),
            ipAddress: ip,
            userAgent,
            statusCode: response.statusCode,
            duration: Date.now() - startTime,
          });
        },
        error: (error) => {
          this.logAction({
            userId: user?.userId,
            action: `${method} ${url} (ERROR)`,
            resourceType: this.extractResourceType(url),
            resourceId: this.extractResourceId(url),
            newValues: { error: error.message },
            ipAddress: ip,
            userAgent,
            statusCode: error.status || 500,
            duration: Date.now() - startTime,
          });
        },
      }),
    );
  }

  private async logAction(logData: any) {
    try {
      const auditLog = this.auditLogRepository.create({
        userId: logData.userId,
        action: logData.action,
        resourceType: logData.resourceType,
        resourceId: logData.resourceId,
        newValues: logData.newValues,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to save audit log:', error);
    }
  }

  private extractResourceType(url: string): string {
    const pathSegments = url.split('/').filter(segment => segment);
    if (pathSegments.length >= 3) {
      return pathSegments[2]; // e.g., /api/v1/users -> users
    }
    return 'unknown';
  }

  private extractResourceId(url: string, data?: any): string | null {
    // Extract UUID from URL path
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = url.match(uuidRegex);
    if (match) {
      return match[0];
    }

    // Try to extract ID from response data
    if (data && typeof data === 'object' && data.id) {
      return data.id;
    }

    return null;
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'key'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}

