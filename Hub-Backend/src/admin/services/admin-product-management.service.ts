import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AdminSearchDto, CreateServiceDto } from '../dtos/admin-product.dto';
import { CreateCouponDto, UpdateCouponDto } from '../dtos/admin-coupon.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminProductManagementService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  // ==================== 상품 (Product) ====================

  async findAllProductCodes() {
    return this.prisma.paymentProduct.findMany();
  }

  async findProducts(searchDto: AdminSearchDto) {
    const { searchWord, page = 0, pageSize = 10 } = searchDto;

    const where: Prisma.PaymentProductWhereInput = {};
    if (searchWord) {
      where.product_name = { contains: searchWord, mode: 'insensitive' };
    }

    const [list, totalCount] = await Promise.all([
      this.prisma.paymentProduct.findMany({
        where,
        skip: page,
        take: pageSize,
      }),
      this.prisma.paymentProduct.count({ where }),
    ]);

    return { list, totalCount };
  }

  // ==================== 서비스 (PayService) ====================

  async findServices(searchDto: AdminSearchDto) {
    const { searchWord, productCateCode, page, pageSize } = searchDto;

    const where: Prisma.PaymentServiceWhereInput = { delete_flag: 0 };

    if (productCateCode) {
      where.product_cate_code = productCateCode;
    }

    if (searchWord) {
      where.product_nm = { contains: searchWord, mode: 'insensitive' };
    }

    const offset = page !== undefined && pageSize !== undefined
      ? (page > 0 ? (page - 1) * pageSize : 0)
      : undefined;

    const [list, totalCount] = await Promise.all([
      this.prisma.paymentService.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: offset,
        take: pageSize,
      }),
      this.prisma.paymentService.count({ where }),
    ]);

    return { list, totalCount };
  }

  async findServiceById(serviceId: number) {
    const serviceInfo = await this.prisma.paymentService.findUnique({
      where: { id: serviceId },
    });

    if (!serviceInfo) {
      throw new NotFoundException('서비스를 찾을 수 없습니다.');
    }

    // 서비스에 연결된 상품 목록 조회
    const productionInfo = await this.prisma.paymentServiceProduct.findMany({
      where: { pay_service_id: serviceId },
      include: {
        product: {
          select: { id: true, product_code: true, product_type: true, product_name: true },
        },
      },
    });

    return {
      serviceInfo,
      productionInfo: productionInfo.map((sp) => sp.product),
    };
  }

  async saveService(dto: CreateServiceDto) {
    return this.prisma.$transaction(async (tx) => {
      let savedService;

      if (dto.id) {
        // 수정
        const existingService = await tx.paymentService.findUnique({
          where: { id: dto.id },
        });

        if (!existingService) {
          throw new NotFoundException('서비스를 찾을 수 없습니다.');
        }

        savedService = await tx.paymentService.update({
          where: { id: dto.id },
          data: {
            product_nm: dto.productNm,
            product_price: dto.productPrice,
            term: dto.term || existingService.term,
            product_payment_type: dto.productPaymentType || existingService.product_payment_type,
            explain_comment: dto.explainComment || existingService.explain_comment,
            refund_policy: dto.refundPolicy || existingService.refund_policy,
            promotion_discount: dto.promotionDiscount ?? existingService.promotion_discount,
            product_image: dto.productImage || existingService.product_image,
            product_cate_code: dto.productCateCode || existingService.product_cate_code,
            product_type_code: dto.productTypeCode || existingService.product_type_code,
            service_range_code: dto.serviceRangeCode || existingService.service_range_code,
            available_count: dto.availableCount ?? existingService.available_count,
            update_dt: new Date(),
          },
        });

        // 기존 상품 연결 삭제
        await tx.paymentServiceProduct.deleteMany({
          where: { pay_service_id: dto.id },
        });
      } else {
        // 신규 생성
        savedService = await tx.paymentService.create({
          data: {
            product_nm: dto.productNm,
            product_price: dto.productPrice,
            term: dto.term,
            product_payment_type: dto.productPaymentType,
            explain_comment: dto.explainComment,
            refund_policy: dto.refundPolicy,
            promotion_discount: dto.promotionDiscount || 0,
            product_image: dto.productImage,
            product_cate_code: dto.productCateCode,
            product_type_code: dto.productTypeCode,
            service_range_code: dto.serviceRangeCode,
            available_count: dto.availableCount,
            delete_flag: 0,
            create_dt: new Date(),
            update_dt: new Date(),
          },
        });
      }

      // 상품 연결 저장
      if (dto.productListInfo && dto.productListInfo.length > 0) {
        for (const product of dto.productListInfo) {
          const productId = product.payProductId || product.id;
          if (productId) {
            await tx.paymentServiceProduct.create({
              data: {
                pay_service_id: savedService.id,
                pay_product_id: productId,
              },
            });
          }
        }
      }

      return savedService;
    });
  }

  async deleteService(serviceId: number) {
    const service = await this.prisma.paymentService.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('서비스를 찾을 수 없습니다.');
    }

    await this.prisma.paymentService.update({
      where: { id: serviceId },
      data: { delete_flag: 1, update_dt: new Date() },
    });
  }

  // ==================== 쿠폰 (Coupon) ====================

  async findCoupons(searchDto: AdminSearchDto) {
    const { searchWord, page = 0, pageSize = 10 } = searchDto;

    const where: Prisma.PaymentCouponWhereInput = {};
    if (searchWord) {
      where.pay_service = {
        product_nm: { contains: searchWord, mode: 'insensitive' },
      };
    }

    const offset = page > 0 ? (page - 1) * pageSize : 0;

    const [list, totalCount] = await Promise.all([
      this.prisma.paymentCoupon.findMany({
        where,
        include: {
          pay_service: {
            select: {
              product_nm: true,
              product_price: true,
              product_payment_type: true,
              promotion_discount: true,
              delete_flag: true,
            },
          },
        },
        skip: offset,
        take: pageSize,
      }),
      this.prisma.paymentCoupon.count({ where }),
    ]);

    return { list, totalCount };
  }

  async createCoupon(dto: CreateCouponDto) {
    return this.prisma.paymentCoupon.create({
      data: {
        coupon_number: dto.couponNumber || this.generateCouponNumber(),
        discount_info: dto.discountInfo,
        discount_value: dto.discountValue,
        number_of_available: dto.numberOfAvailable,
        pay_service_id: dto.payServiceId || null,
      },
    });
  }

  async updateCoupon(id: number, dto: UpdateCouponDto) {
    const service = await this.prisma.paymentService.findUnique({
      where: { id: dto.payServiceId },
    });

    if (!service) {
      throw new NotFoundException('서비스를 찾을 수 없습니다.');
    }

    const coupon = await this.prisma.paymentCoupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    }

    return this.prisma.paymentCoupon.update({
      where: { id },
      data: {
        discount_info: dto.discountInfo,
        discount_value: dto.discountValue,
        number_of_available: dto.numberOfAvailable,
        pay_service_id: dto.payServiceId,
      },
    });
  }

  async deleteCoupons(ids: number[]) {
    await this.prisma.paymentCoupon.deleteMany({
      where: { id: { in: ids } },
    });
  }

  private generateCouponNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 25; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
