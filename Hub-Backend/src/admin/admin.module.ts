import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { AdminStatisticController } from './controllers/admin-statistic.controller';
import { AdminStatisticService } from './services/admin-statistic.service';
import { PayOrderEntity } from 'src/database/entities/pay/pay-order.entity';
import { AdminPaymentController } from './controllers/admin-pay.controller';
import { AdminPaymentService } from './services/admin-pay.service';
import { PayContractEntity } from 'src/database/entities/pay/pay-contract.entity';
import { AdminMemberController } from './controllers/admin-member.controller';
import { AdminMemberService } from './services/admin-member.service';
import { PayProductEntity } from 'src/database/entities/pay/pay-product.entity';
import { PayServiceEntity } from 'src/database/entities/pay/pay-service.entity';
import { PayServiceProductEntity } from 'src/database/entities/pay/pay-service-product.entity';
import { PayCouponEntity } from 'src/database/entities/pay/pay-coupon.entity';
import { AdminProductManagementController } from './controllers/admin-product-management.controller';
import { AdminProductManagementService } from './services/admin-product-management.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      PayOrderEntity,
      PayContractEntity,
      PayProductEntity,
      PayServiceEntity,
      PayServiceProductEntity,
      PayCouponEntity,
    ]),
  ],
  controllers: [
    AdminStatisticController,
    AdminPaymentController,
    AdminMemberController,
    AdminProductManagementController,
  ],
  providers: [
    AdminStatisticService,
    AdminPaymentService,
    AdminMemberService,
    AdminProductManagementService,
  ],
})
export class AdminModule { }
