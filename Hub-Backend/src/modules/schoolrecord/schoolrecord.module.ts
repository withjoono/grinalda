import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SchoolRecordAttendanceDetailEntity } from 'src/database/entities/schoolrecord/schoolrecord-attendance-detail.entity';
import { SchoolRecordSelectSubjectEntity } from 'src/database/entities/schoolrecord/schoolrecord-select-subject.entity';
import { SchoolRecordSubjectLearningEntity } from 'src/database/entities/schoolrecord/schoolrecord-subject-learning.entity';
import { SchoolRecordVolunteerEntity } from 'src/database/entities/schoolrecord/schoolrecord-volunteer.entity';
import { SchoolrecordSportsArtEntity } from 'src/database/entities/schoolrecord/schoolrecord-sport-art.entity';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { CommonModule } from 'src/common/common.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { MembersModule } from 'src/modules/members/members.module';
import { SchoolRecordService } from './schoolrecord.service';
import { SchoolRecordController } from './schoolrecord.controller';
import { SchoolRecordHtmlParserService } from './parsers/html-parser.service';
import { AiPdfParserService } from './parsers/ai-pdf-parser.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SchoolRecordAttendanceDetailEntity,
            SchoolRecordSelectSubjectEntity,
            SchoolRecordSubjectLearningEntity,
            SchoolRecordVolunteerEntity,
            SchoolrecordSportsArtEntity,
            MemberEntity,
        ]),
        ConfigModule,
        CommonModule,     // JwtService (JwtAuthGuard 의존성)
        FirebaseModule,   // FirebaseAdminService (JwtAuthGuard 의존성)
        MembersModule,    // MembersService (JwtAuthGuard 의존성)
    ],
    controllers: [SchoolRecordController],
    providers: [
        SchoolRecordService,
        SchoolRecordHtmlParserService,
        AiPdfParserService,
    ],
    exports: [SchoolRecordService],
})
export class SchoolRecordModule { }
