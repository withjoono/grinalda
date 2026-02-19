import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminStatisticService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getRecentSignUps(): Promise<Record<string, number>> {
    const result: Array<{ date: string; count: bigint }> = await this.prisma.$queryRaw`
      SELECT DATE(create_dt) as date, COUNT(*) as count
      FROM hub.auth_member
      WHERE create_dt IS NOT NULL
      GROUP BY DATE(create_dt)
      ORDER BY DATE(create_dt) ASC
    `;

    const signUpTrends: Record<string, number> = {};
    result.forEach((record) => {
      signUpTrends[record.date] = Number(record.count);
    });

    return signUpTrends;
  }

  async getRecentPayments(): Promise<
    Array<{
      name: string;
      email: string;
      amount: number;
      date: string;
      serviceName: string;
    }>
  > {
    const recentPayments: Array<{
      name: string;
      email: string;
      amount: string;
      date: string;
      servicename: string;
    }> = await this.prisma.$queryRaw`
      SELECT
        m.nickname AS name,
        m.email AS email,
        po.paid_amount AS amount,
        po.create_dt AS date,
        ps.product_nm AS servicename
      FROM hub.payment_order po
      LEFT JOIN hub.auth_member m ON po.member_id = m.id
      LEFT JOIN hub.payment_service ps ON po.pay_service_id = ps.id
      WHERE po.paid_amount > 0
        AND po.order_state = 'COMPLETE'
      ORDER BY po.create_dt DESC
      LIMIT 20
    `;

    return recentPayments.map((payment) => ({
      name: payment.name,
      email: payment.email,
      amount: parseFloat(String(payment.amount)),
      date: payment.date,
      serviceName: payment.servicename,
    }));
  }

  async getDailySales(): Promise<Record<string, number>> {
    const result: Array<{ date: string; total_sales: string }> = await this.prisma.$queryRaw`
      SELECT DATE(create_dt) as date, SUM(paid_amount) as total_sales
      FROM hub.payment_order
      WHERE paid_amount > 0
        AND order_state = 'COMPLETE'
      GROUP BY DATE(create_dt)
      ORDER BY DATE(create_dt) ASC
    `;

    const dailySales: Record<string, number> = {};
    result.forEach((record) => {
      dailySales[record.date] = parseFloat(String(record.total_sales));
    });

    return dailySales;
  }

  async getActiveContractCount(): Promise<number> {
    return this.prisma.paymentContract.count({
      where: {
        contract_period_end_dt: { gt: new Date() },
        contract_use: 1,
        product_code: { not: 'TICKET' },
      },
    });
  }
}
