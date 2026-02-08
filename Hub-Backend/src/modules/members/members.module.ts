import { Module } from '@nestjs/common';
import { MembersService } from './services/members.service';
import { MemberIdGeneratorService } from './services/member-id-generator.service';
import { MembersController } from './controllers/members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { MemberStudentEntity } from 'src/database/entities/member/member-student.entity';
import { MemberTeacherEntity } from 'src/database/entities/member/member-teacher.entity';
import { MemberParentEntity } from 'src/database/entities/member/member-parent.entity';
import { MemberInterestsController } from './controllers/member-interests.controller';
import { MemberInterestsEntity } from 'src/database/entities/member/member-interests';
import { MemberInterestsService } from './services/member-interests.service';
import { MemberSchoolRecordController } from './controllers/member-schoolrecord.controller';
import { SchoolRecordModule } from '../schoolrecord/schoolrecord.module';
// TODO: 독립 앱으로 분리 - Susi 엔티티
// import { SuSiSubjectEntity } from 'src/database/entities/susi/susi-subject.entity';
// import { SusiComprehensiveEntity } from 'src/database/entities/susi/susi-comprehensive.entity';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
// REMOVED: 독립 앱으로 분리 - Regular/Recruitment 관련
// import { RecruitmentUnitEntity } from 'src/database/entities/core/recruitment-unit.entity';
// import { MemberRecruitmentUnitCombinationEntity } from 'src/database/entities/member/member-recruitment-unit-combination.entity';
// import { MemberRecruitmentUnitCombinationService } from './services/member-combination.service';
// import { MemberCombinationController } from './controllers/member-combination.controller';
// import { MemberRegularInterestsEntity } from 'src/database/entities/member/member-regular-interests';
// import { MemberRegularCombinationEntity } from 'src/database/entities/member/member-regular-combination.entity';
// import { MemberRegularInterestsService } from './services/member-regular-interests.service';
// import { MemberRegularInterestsController } from './controllers/memeber-regular-interests.controller';
// import { RegularAdmissionEntity } from 'src/database/entities/core/regular-admission.entity';
// import { MemberRegularCombinationService } from './services/member-regular-combination.service';
// import { MemberRegularCombinationController } from './controllers/member-regular-combination.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberEntity,
      MemberStudentEntity,
      MemberTeacherEntity,
      MemberParentEntity,
      MemberInterestsEntity,
      // TODO: 독립 앱으로 분리 - Susi 엔티티
      // SuSiSubjectEntity,
      // SusiComprehensiveEntity,
      // REMOVED: 독립 앱으로 분리
      // RecruitmentUnitEntity,
      // MemberRecruitmentUnitCombinationEntity,
      // MemberRegularInterestsEntity,
      // MemberRegularCombinationEntity,
      // RegularAdmissionEntity,
    ]),
    SchoolRecordModule,
    BcryptModule,
  ],
  providers: [
    MembersService,
    MemberIdGeneratorService,
    MemberInterestsService,
    // REMOVED: 독립 앱으로 분리
    // MemberRecruitmentUnitCombinationService,
    // MemberRegularInterestsService,
    // MemberRegularCombinationService,
  ],
  controllers: [
    MembersController,
    MemberInterestsController,
    MemberSchoolRecordController,
    // REMOVED: 독립 앱으로 분리
    // MemberCombinationController,
    // MemberRegularInterestsController,
    // MemberRegularCombinationController,
  ],
  exports: [MembersService, MemberIdGeneratorService, MemberInterestsService],
})
export class MembersModule { }
