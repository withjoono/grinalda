import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findAll() {
    return await this.prisma.paymentService.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.paymentService.findUnique({ where: { id } });
  }

  // 판매중인 상품 하나 조회
  async findOneAvailable(id: number) {
    return await this.prisma.paymentService.findFirst({
      where: { id, delete_flag: 0 },
      select: {
        id: true,
        product_nm: true,
        product_price: true,
        term: true,
        product_payment_type: true,
        explain_comment: true,
        refund_policy: true,
        promotion_discount: true,
        product_image: true,
        product_cate_code: true,
        product_type_code: true,
        service_range_code: true,
        available_count: true,
      },
    });
  }

  // 판매중인 상품 조회
  async findAvailable() {
    return await this.prisma.paymentService.findMany({
      where: { delete_flag: 0 },
      select: {
        id: true,
        product_nm: true,
        product_price: true,
        term: true,
        product_payment_type: true,
        explain_comment: true,
        refund_policy: true,
        promotion_discount: true,
        product_image: true,
        product_cate_code: true,
        product_type_code: true,
        service_range_code: true,
        available_count: true,
      },
    });
  }
}
