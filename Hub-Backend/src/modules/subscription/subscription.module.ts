import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEntity } from 'src/database/entities/subscription/app.entity';
import { AppSubscriptionEntity } from 'src/database/entities/subscription/app-subscription.entity';
import { ProductPermissionMappingEntity } from 'src/database/entities/subscription/product-permission-mapping.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEntity, AppSubscriptionEntity, ProductPermissionMappingEntity]),
    JwtModule, // JwtAuthGuard에 필요
    MembersModule, // JwtAuthGuard의 MembersService 의존성 해결
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
