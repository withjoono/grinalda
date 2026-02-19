import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async handleProductSpecificLogic(
    tx: Prisma.TransactionClient,
    productId: bigint,
    memberId: string,
    orderId: bigint,
  ) {
    this.logger.warn(
      `상품별 로직 처리 시작: 상품 ID ${productId}, 회원 ID ${memberId}, 주문 ID ${orderId}`,
    );
    const service = await this.findProductById(productId);

    const productTypeCode = service.product_type_code;

    switch (productTypeCode) {
      case 'FIXEDTERM':
        await this.contractFixedTermService(tx, service, memberId, orderId);
        break;
      case 'TICKET':
        await this.contractOfficerTicket(tx, service, memberId, orderId);
        break;
      case 'PACKAGE':
        await this.contractSusiPackage(tx, service, memberId, orderId);
        break;
      default:
        this.logger.warn(`알 수 없는 상품 타입: ${productTypeCode}, 기간권으로 처리합니다.`);
        await this.contractFixedTermService(tx, service, memberId, orderId);
    }
    this.logger.warn(`상품별 로직 처리 완료: 상품 ID ${productId}`);
  }

  private async findProductById(productId: bigint) {
    const product = await this.prisma.paymentService.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    this.logger.warn(`상품 조회 완료: 상품 ID ${productId}`);
    return product;
  }

  private async contractFixedTermService(
    tx: Prisma.TransactionClient,
    service: any,
    memberId: string,
    orderId: bigint,
  ) {
    let endDate: Date;
    if (service.term) {
      endDate = new Date(service.term);
    } else {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await this.createPayContract(tx, service, memberId, orderId, endDate);
    this.logger.warn(
      `기간권 계약 완료: 회원 ID ${memberId}, 상품 ID ${service.id}, 종료일 ${endDate.toISOString()}`,
    );
  }

  private async contractOfficerTicket(
    tx: Prisma.TransactionClient,
    service: any,
    memberId: string,
    orderId: bigint,
  ) {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100);

    await this.createPayContract(tx, service, memberId, orderId, endDate);
    this.logger.warn(`사정관 이용권 계약 완료: 회원 ID ${memberId}, 상품 ID ${service.id}`);
  }

  private async contractSusiPackage(
    tx: Prisma.TransactionClient,
    service: any,
    memberId: string,
    orderId: bigint,
  ) {
    let endDate: Date;
    if (service.term) {
      endDate = new Date(service.term);
    } else {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await this.createPayContract(tx, service, memberId, orderId, endDate);
    this.logger.warn(`수시 패키지 계약 완료: 회원 ID ${memberId}, 상품 ID ${service.id}`);
  }

  private async createPayContract(
    tx: Prisma.TransactionClient,
    service: any,
    memberId: string,
    orderId: bigint,
    endDate: Date,
  ) {
    const today = new Date();

    await tx.paymentContract.create({
      data: {
        contract_period_end_dt: endDate,
        contract_start_dt: today,
        contract_use: 1,
        create_dt: today,
        product_code: service.product_type_code,
        regular_contract_fl: false,
        update_dt: today,
        member_id: memberId,
        order_id: orderId,
      },
    });
  }

  async handleFailedPayment(
    tx: Prisma.TransactionClient,
    payServiceId: bigint,
    memberId: string,
  ): Promise<void> {
    this.logger.warn(`결제 실패 처리 시작: 회원 ID ${memberId}, 상품 ID ${payServiceId}`);
    try {
      const payOrder = await tx.paymentOrder.findFirst({
        where: {
          pay_service_id: payServiceId,
          member_id: memberId,
        },
      });

      if (payOrder) {
        await tx.paymentOrder.update({
          where: { id: payOrder.id },
          data: { order_state: 'FAILED', update_dt: new Date() },
        });
        this.logger.warn(`주문 상태 업데이트: 주문 ID ${payOrder.id}, 새 상태 'FAILED'`);

        await this.cancelContract(tx, payOrder.id, memberId);
      }

      this.logger.warn(`결제 실패 처리 완료: 회원 ID ${memberId}, 상품 ID ${payServiceId}`);
    } catch (error) {
      this.logger.error(`결제 실패 처리 중 오류 발생: ${error.message}`, {
        stack: error.stack,
      });
      throw new BadRequestException('결제 실패 처리 중 오류가 발생했습니다.');
    }
  }

  async handleCancelledPayment(
    tx: Prisma.TransactionClient,
    payOrderId: bigint,
    memberId: string,
  ): Promise<void> {
    this.logger.warn(`결제 취소 처리 시작: 회원 ID ${memberId}, 주문 ID ${payOrderId}`);
    try {
      await this.cancelContract(tx, payOrderId, memberId);
      this.logger.warn(`결제 취소 처리 완료: 회원 ID ${memberId}, 주문 ID ${payOrderId}`);
    } catch (error) {
      this.logger.error(`결제 취소 처리 중 오류 발생: ${error.message}`, {
        stack: error.stack,
      });
      throw new BadRequestException('결제 취소 처리 중 오류가 발생했습니다.');
    }
  }

  private async cancelContract(tx: Prisma.TransactionClient, orderId: bigint, memberId: string): Promise<void> {
    const contract = await tx.paymentContract.findFirst({
      where: { order_id: orderId, member_id: memberId },
    });

    if (contract) {
      await tx.paymentContract.update({
        where: { id: contract.id },
        data: { contract_use: 0, update_dt: new Date() },
      });
      this.logger.warn(`계약 상태 업데이트: 계약 ID ${contract.id}, 새 상태 '사용안함'`);
    }
    this.logger.warn(`계약 취소 완료: 주문 ID ${orderId}, 회원 ID ${memberId}`);
  }
}
