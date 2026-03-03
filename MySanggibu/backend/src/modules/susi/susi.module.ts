import { Module } from '@nestjs/common';
import { SusiSubjectService } from './services/susi-subject.service';
import { SusiSubjectController } from './controllers/susi-subject.controller';
import { SusiComprehensiveService } from './services/susi-comprehensive.service';
import { SusiPassRecordController } from './controllers/susi-pass-record.controller';
import { SusiPassRecordService } from './services/susi-pass-record-service';
import { SusiComprehensiveController } from './controllers/susi-comprehensive.controller';
import { SusiKyokwaController } from './controllers/susi-kyokwa.controller';
import { SusiKyokwaService } from './services/susi-kyokwa.service';
import { SusiRecruitmentUnitController } from './controllers/susi-recruitment-unit.controller';
import { SusiRecruitmentUnitService } from './services/susi-recruitment-unit.service';
import { SusiUnitCategoryController } from './controllers/susi-unit-category.controller';
import { SusiUnitCategoryService } from './services/susi-unit-category.service';
import { SusiCategorySubjectNecessityController } from './controllers/susi-category-subject-necessity.controller';
import { SusiCategorySubjectNecessityService } from './services/susi-category-subject-necessity.service';
import { SusiSubjectCodeController } from './controllers/susi-subject-code.controller';
import { SusiSubjectCodeService } from './services/susi-subject-code.service';
import { SusiCalculationModule } from './calculation/susi-calculation.module';

// 2027학년도 새 테이블 Entity

// 2027학년도 새 Service/Controller
import { SusiKyokwa2027Service } from './services/susi-kyokwa-2027.service';
import { SusiKyokwa2027Controller } from './controllers/susi-kyokwa-2027.controller';
import { SusiJonghap2027Service } from './services/susi-jonghap-2027.service';
import { SusiJonghap2027Controller } from './controllers/susi-jonghap-2027.controller';

// 계열 적합성 진단
import { SeriesEvaluationController } from './controllers/series-evaluation.controller';
import { SeriesEvaluationService } from './services/series-evaluation.service';

@Module({
  imports: [
    SusiCalculationModule, // 수시 교과전형 환산점수 계산 모듈
  ],
  controllers: [
    SusiSubjectController,
    SusiComprehensiveController,
    SusiPassRecordController,
    SusiKyokwaController, // 새 교과전형 API
    SusiRecruitmentUnitController, // 수시 모집단위 통합 API
    SusiUnitCategoryController, // 수시 모집단위 계열 분류 API
    SusiCategorySubjectNecessityController, // 계열별 필수/권장 과목 API
    SusiSubjectCodeController, // 2015 개정 교과/과목 코드 API

    // 2027학년도 새 API
    SusiKyokwa2027Controller, // 2027 교과전형 API
    SusiJonghap2027Controller, // 2027 종합전형 API

    // 계열 적합성 진단 API
    SeriesEvaluationController,
  ],
  providers: [
    SusiSubjectService,
    SusiComprehensiveService,
    SusiPassRecordService,
    SusiKyokwaService, // 새 교과전형 서비스
    SusiRecruitmentUnitService, // 수시 모집단위 통합 서비스
    SusiUnitCategoryService, // 수시 모집단위 계열 분류 서비스
    SusiCategorySubjectNecessityService, // 계열별 필수/권장 과목 서비스
    SusiSubjectCodeService, // 2015 개정 교과/과목 코드 서비스

    // 2027학년도 새 서비스
    SusiKyokwa2027Service, // 2027 교과전형 서비스
    SusiJonghap2027Service, // 2027 종합전형 서비스

    // 계열 적합성 진단 서비스
    SeriesEvaluationService,
  ],
  exports: [
    SusiSubjectService,
    SusiComprehensiveService,
    SusiKyokwaService,
    SusiRecruitmentUnitService,
    SusiUnitCategoryService,
    SusiCategorySubjectNecessityService, // 계열별 필수/권장 과목 서비스
    SusiSubjectCodeService, // 2015 개정 교과/과목 코드 서비스
    SusiCalculationModule, // 수시 교과전형 환산점수 계산 모듈

    // 2027학년도 새 서비스
    SusiKyokwa2027Service, // 2027 교과전형 서비스
    SusiJonghap2027Service, // 2027 종합전형 서비스
  ],
})
export class SusiModule {}











