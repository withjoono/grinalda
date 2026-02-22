import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { MembersModule } from 'src/modules/members/members.module';
import { SchoolRecordService } from './schoolrecord.service';
import { SchoolRecordController } from './schoolrecord.controller';
import { SchoolRecordHtmlParserService } from './parsers/html-parser.service';
import { AiPdfParserService } from './parsers/ai-pdf-parser.service';
import { Hub2015KyokwaSubject } from 'src/database/entities/hub-2015-kyokwa-subject.entity';
import { Hub2022KyokwaSubject } from 'src/database/entities/hub-2022-kyokwa-subject.entity';

@Module({
    imports: [

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
