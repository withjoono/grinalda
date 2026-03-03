import { Module } from '@nestjs/common';
import { SchoolRecordService } from './schoolrecord.service';
import { SchoolRecordController } from './schoolrecord.controller';
import { SchoolRecordHtmlParserService } from './parsers/html-parser.service';
import { AiPdfParserService } from './parsers/ai-pdf-parser.service';

@Module({
  imports: [
  ],
  controllers: [SchoolRecordController],
  providers: [
    SchoolRecordService,
    SchoolRecordHtmlParserService,
    AiPdfParserService,
  ],
  exports: [
    SchoolRecordService,
    SchoolRecordHtmlParserService,
    AiPdfParserService,
  ],
})
export class SchoolRecordModule {}
