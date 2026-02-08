import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';
import { MemberEntity } from './entities/member/member.entity';
import { MemberStudentEntity } from './entities/member/member-student.entity';
import { MemberTeacherEntity } from './entities/member/member-teacher.entity';
import { MemberParentEntity } from './entities/member/member-parent.entity';
import { MemberInterestsEntity } from './entities/member/member-interests';

import { PayServiceEntity } from './entities/pay/pay-service.entity';
import { PayCouponEntity } from './entities/pay/pay-coupon.entity';
import { PayContractEntity } from './entities/pay/pay-contract.entity';
import { PayOrderEntity } from './entities/pay/pay-order.entity';
import { PayCancelLogEntity } from './entities/pay/pay-cancel-log.entity';
import { PayProductEntity } from './entities/pay/pay-product.entity';
import { PayServiceProductEntity } from './entities/pay/pay-service-product.entity';

import { BoardEntity } from './entities/boards/board.entity';
import { PostEntity } from './entities/boards/post.entity';
import { CommentEntity } from './entities/boards/comment.entity';

import { MemberUploadFileListEntity } from './entities/member/member-file';
import { SubjectCodeListEntity } from './entities/common-code/subject-code-list-entity';

import { OAuthClientEntity } from './entities/oauth/oauth-client.entity';
import { OAuthAuthorizationCodeEntity } from './entities/oauth/oauth-authorization-code.entity';
import {
  AppEntity,
  AppSubscriptionEntity,
  ProductPermissionMappingEntity,
} from './entities/subscription';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.configService.getOrThrow('database', { infer: true });
    const nodeEnv = this.configService.get('app.nodeEnv', { infer: true });
    const isDevelopment = nodeEnv === 'development';
    const isSqlite = dbConfig.type === 'better-sqlite3';

    console.log('🔍 TypeORM Config:', {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.name,
      username: dbConfig.username,
      synchronize: dbConfig.synchronize,
    });

    const baseOptions = {
      type: dbConfig.type,
      database: dbConfig.name,
      synchronize: dbConfig.synchronize,
      logging: false,
      // 개발환경: 빠른 실패, 프로덕션: 안정적 재시도
      retryAttempts: isDevelopment ? 3 : 10,
      retryDelay: isDevelopment ? 1000 : 3000,
      // this.configService.getOrThrow('app.nodeEnv', { infer: true }) ===
      // 'development',
    };

    // SQLite는 host, port, username, password가 필요하지 않음
    const connectionOptions = isSqlite
      ? baseOptions
      : {
        ...baseOptions,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
      };

    return {
      ...connectionOptions,
      entities: [
        MemberEntity,
        MemberStudentEntity,
        MemberTeacherEntity,
        MemberParentEntity,
        MemberInterestsEntity, // 유저 관심목록(수시 교과, 수시 학종, 논술)
        MemberUploadFileListEntity, // 유저 업로드 파일


        // 결제 관련
        PayServiceEntity, // 서비스 (판매 상품)
        PayCouponEntity, // 쿠폰
        PayContractEntity, // 계약
        PayOrderEntity, // 결제 주문
        PayCancelLogEntity, // 결제 취소 로그
        PayProductEntity, // 상품 코드 (상품 마스터)
        PayServiceProductEntity, // 서비스-상품 관계

        // 통합 코드
        SubjectCodeListEntity, // 교과 코드

        // 게시판 관련
        BoardEntity,
        PostEntity,
        CommentEntity,


        // OAuth 2.0 관련
        OAuthClientEntity, // OAuth 클라이언트 등록
        OAuthAuthorizationCodeEntity, // OAuth Authorization Code

        // 앱 구독/권한 관련
        AppEntity, // 앱 정의 (examhub, susi 등)
        AppSubscriptionEntity, // 사용자별 앱 구독 정보
        ProductPermissionMappingEntity, // 상품-권한 매핑 (관리자가 동적 관리)

      ],
    } as TypeOrmModuleOptions;
  }
}
