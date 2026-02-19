import { Module } from '@nestjs/common';
import { AdminStatisticController } from './controllers/admin-statistic.controller';
import { AdminStatisticService } from './services/admin-statistic.service';
import { AdminPaymentController } from './controllers/admin-pay.controller';
import { AdminPaymentService } from './services/admin-pay.service';
import { AdminMemberController } from './controllers/admin-member.controller';
import { AdminMemberService } from './services/admin-member.service';
import { AdminProductManagementController } from './controllers/admin-product-management.controller';
import { AdminProductManagementService } from './services/admin-product-management.service';

@Module({
  imports: [],
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
