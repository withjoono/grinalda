import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    JwtModule, // JwtAuthGuard에 필요
    MembersModule, // JwtAuthGuard의 MembersService 의존성 해결
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule { }
