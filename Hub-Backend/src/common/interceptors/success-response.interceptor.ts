import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SKIP_SUCCESS_RESPONSE_KEY } from '../decorators/skip-success-response.decorator';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // @SkipSuccessResponse() 데코레이터가 있으면 래핑하지 않음
    const skipResponse = this.reflector.getAllAndOverride<boolean>(SKIP_SUCCESS_RESPONSE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipResponse) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
