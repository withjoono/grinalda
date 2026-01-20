import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable, ExecutionContext } from '@nestjs/common';

/**
 * 커스텀 Rate Limiting Guard
 *
 * localhost와 127.0.0.1에서의 요청은 Rate Limiting을 적용하지 않습니다.
 * 개발 환경에서는 제한 없이 API를 호출할 수 있도록 합니다.
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;

    // localhost나 127.0.0.1에서의 요청은 Rate Limiting 제외
    const isLocalhost =
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === 'localhost' ||
      ip?.startsWith('127.') ||
      ip?.startsWith('::ffff:127.');

    if (isLocalhost) {
      return true; // Rate Limiting 건너뛰기
    }

    return super.shouldSkip(context);
  }
}
