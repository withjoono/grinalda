import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AdminPayOrderResponseDto, AdminPayOrderSearchQueryDto } from '../dtos/admin-pay-order.dto';

@Injectable()
export class AdminPaymentService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getAllOrders(
    searchQueryDto: AdminPayOrderSearchQueryDto,
  ): Promise<AdminPayOrderResponseDto> {
    const { orderState, searchWord, page = 1, pageSize = 10 } = searchQueryDto;

    const where: any = {};

    if (orderState) {
      where.order_state = orderState;
    }

    if (searchWord) {
      where.member = {
        OR: [
          { nickname: { contains: searchWord, mode: 'insensitive' } },
          { email: { contains: searchWord, mode: 'insensitive' } },
        ],
      };
    }

    const [list, totalCount] = await Promise.all([
      this.prisma.paymentOrder.findMany({
        where,
        include: {
          member: { select: { nickname: true, email: true } },
        },
        orderBy: { create_dt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.paymentOrder.count({ where }),
    ]);

    return { list, totalCount };
  }
}
