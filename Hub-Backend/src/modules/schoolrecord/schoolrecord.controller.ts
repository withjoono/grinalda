import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SchoolRecordService } from './schoolrecord.service';
import { SchoolRecordHtmlParserService } from './parsers/html-parser.service';
import { AiPdfParserService } from './parsers/ai-pdf-parser.service';
import { Hub2015KyokwaSubject } from 'src/database/entities/hub-2015-kyokwa-subject.entity';
import { Hub2022KyokwaSubject } from 'src/database/entities/hub-2022-kyokwa-subject.entity';
import { SubjectCodeMapping } from './parsers/schoolrecord-parser.types';

/** 2015 개정 교육과정 대상 유저 ID 접두사 */
const CURRICULUM_2015_PREFIXES = ['ss_26H3', 'ss_26H4', 'ss_26H0'];

@ApiTags('SchoolRecord')
@ApiBearerAuth()
@Controller('schoolrecord')
@UseGuards(JwtAuthGuard)
export class SchoolRecordController {
    private readonly logger = new Logger(SchoolRecordController.name);

    constructor(
        private readonly schoolRecordService: SchoolRecordService,
        private readonly htmlParserService: SchoolRecordHtmlParserService,
        private readonly aiPdfParserService: AiPdfParserService,
        @InjectRepository(Hub2015KyokwaSubject)
        private readonly hub2015Repository: Repository<Hub2015KyokwaSubject>,
        @InjectRepository(Hub2022KyokwaSubject)
        private readonly hub2022Repository: Repository<Hub2022KyokwaSubject>,
    ) { }

    /**
     * memberId 기반으로 적합한 교육과정의 과목 코드 매핑 배열 생성
     */
    private async getSubjectCodeMappings(memberId: string): Promise<SubjectCodeMapping[]> {
        const is2015 = CURRICULUM_2015_PREFIXES.some((prefix) => memberId.startsWith(prefix));
        const hubData = is2015
            ? await this.hub2015Repository.find()
            : await this.hub2022Repository.find();

        return hubData.map((hub) => ({
            mainSubjectName: hub.kyokwa,
            mainSubjectCode: hub.kyokwa_code,
            subjectName: hub.subject_name,
            subjectCode: hub.id, // hub ID를 과목 코드로 사용 (e.g., 15H0111)
        }));
    }

    /**
     * snake_case → camelCase 변환 유틸리티
     */
    private snakeToCamel(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    private convertKeysToCamel(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertKeysToCamel(item));
        }
        if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    this.snakeToCamel(key),
                    this.convertKeysToCamel(value),
                ]),
            );
        }
        return obj;
    }

    @Get(':memberId')
    @ApiOperation({ summary: '생기부 전체 데이터 조회' })
    @ApiResponse({ status: 200, description: '성공' })
    @ApiResponse({ status: 404, description: '회원을 찾을 수 없음' })
    async getSchoolRecord(@Param('memberId') memberId: string) {
        const data = await this.schoolRecordService.getSchoolRecord(memberId);
        return this.convertKeysToCamel(data);
    }

    @Post(':memberId/parse/html')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'HTML 파일 업로드 및 파싱' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
        },
    })
    @ApiResponse({ status: 201, description: '파싱 및 저장 성공' })
    async parseHtml(
        @Param('memberId') memberId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('파일을 업로드해주세요.');
        }

        const htmlContent = file.buffer.toString('utf-8');
        const subjectCodeMappings = await this.getSubjectCodeMappings(memberId);
        const result = this.htmlParserService.parseAll(htmlContent, subjectCodeMappings);
        await this.schoolRecordService.saveHtmlParsedData(memberId, result);

        return {
            message: '생기부 HTML 파싱 및 저장 완료',
            subjectLearningsCount: result.subjectLearnings.length,
            selectSubjectsCount: result.selectSubjects.length,
            volunteersCount: result.volunteers.length,
        };
    }

    @Post(':memberId/parse/pdf')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'PDF 파일 업로드 및 AI 파싱' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
        },
    })
    @ApiResponse({ status: 201, description: '파싱 및 저장 성공' })
    async parsePdf(
        @Param('memberId') memberId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('파일을 업로드해주세요.');
        }

        const result = await this.aiPdfParserService.parse(file.buffer);
        await this.schoolRecordService.saveParsedPdfData(memberId, result);

        return {
            message: '생기부 PDF 파싱 및 저장 완료',
            subjectLearningsCount: result.subjectLearnings.length,
            selectSubjectsCount: result.selectSubjects.length,
        };
    }

    @Patch(':memberId/life-record')
    @ApiOperation({ summary: '수동 생기부 편집 (폼 기반 저장)' })
    @ApiResponse({ status: 200, description: '수정 성공' })
    @ApiResponse({ status: 404, description: '회원을 찾을 수 없음' })
    async editLifeRecord(
        @Param('memberId') memberId: string,
        @Body() body: {
            attendances: any[];
            subjects: any[];
            selectSubjects: any[];
        },
    ) {
        await this.schoolRecordService.editLifeRecord(memberId, body);
        return { message: '생기부 데이터가 수정되었습니다.' };
    }

    @Delete(':memberId')
    @ApiOperation({ summary: '생기부 데이터 삭제' })
    @ApiResponse({ status: 200, description: '삭제 성공' })
    @ApiResponse({ status: 404, description: '회원을 찾을 수 없음' })
    async deleteSchoolRecord(@Param('memberId') memberId: string) {
        await this.schoolRecordService.deleteSchoolRecord(memberId);
        return { message: '생기부 데이터가 삭제되었습니다.' };
    }
}
