import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { PrismaService } from 'src/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class IamPortService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  // [포트원] 엑세스 토큰 가져오기
  async getAccessToken(): Promise<string> {
    try {
      const tokenResponse = await firstValueFrom(
        this.httpService
          .post('https://api.iamport.kr/users/getToken', {
            imp_key: this.configService.getOrThrow('pay', { infer: true }).impKey,
            imp_secret: this.configService.getOrThrow('pay', { infer: true }).impSecret,
          })
          .pipe(
            catchError((error: AxiosError) => {
              throw new Error(`토큰 가져오기 실패: ${error.message}`);
            }),
          ),
      );

      return tokenResponse.data.response.access_token;
    } catch (error) {
      this.logger.error(`액세스 토큰을 가져오는 데 실패했습니다: ${error.message}`);
      throw new BadRequestException('결제 서버에 오류가 발생했습니다.');
    }
  }

  // [포트원] 결제정보 가져오기
  async getPaymentInfo(impUid: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const paymentDataResponse = await firstValueFrom(
        this.httpService
          .get(`https://api.iamport.kr/payments/${impUid}`, {
            headers: { Authorization: accessToken },
          })
          .pipe(
            catchError((error: AxiosError) => {
              throw new Error(`결제 정보 가져오기 실패: ${error.message}`);
            }),
          ),
      );

      return paymentDataResponse.data.response;
    } catch (error) {
      this.logger.error(`결제 정보를 가져오는 데 실패했습니다: ${error.message}`);
      throw new BadRequestException('결제 서버에 오류가 발생했습니다.');
    }
  }

  async cancelPayment(
    impUid: string,
    merchantUid: string,
    cancelReason: string,
    error?: any,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const accessToken = await this.getAccessToken();

        const result = await firstValueFrom(
          this.httpService
            .post(
              'https://api.iamport.kr/payments/cancel',
              { imp_uid: impUid },
              { headers: { Authorization: accessToken } },
            )
            .pipe(
              catchError((axiosError: AxiosError) => {
                throw new Error(`결제 취소 실패: ${axiosError.message}`);
              }),
            ),
        );

        const payOrder = await tx.paymentOrder.findFirst({
          where: { merchant_uid: merchantUid },
        });

        if (payOrder) {
          await tx.paymentOrder.update({
            where: { id: payOrder.id },
            data: {
              order_state: 'CANCEL',
              cancel_amount: result.data.response.amount || 0,
              update_dt: new Date(),
            },
          });

          await tx.paymentCancelLog.create({
            data: {
              cancel_reason: cancelReason,
              code: impUid,
              fail_reason: error?.message || null,
              imp_uid: impUid,
              merchant_uid: merchantUid,
              pay_amount: payOrder.paid_amount.toString(),
              pay_method: payOrder.card_name || payOrder.emb_pg_provider || '',
              result_msg: error?.response?.data?.message || null,
              status: 'CANCEL',
              create_dt: new Date(),
              update_dt: new Date(),
            },
          });
        }
      });
    } catch (txError) {
      this.logger.error('결제 취소 실패:', txError.message);
      throw new BadRequestException('결제 취소에 실패했습니다. 고객센터에 문의해주세요.');
    }
  }
}
