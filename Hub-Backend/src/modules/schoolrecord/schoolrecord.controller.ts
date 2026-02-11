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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SchoolRecordService } from './schoolrecord.service';
import { SchoolRecordHtmlParserService } from './parsers/html-parser.service';
import { AiPdfParserService } from './parsers/ai-pdf-parser.service';

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
    ) { }

    /**
     * snake_case → camelCase 변환 유틸리티
     * 기존 Susi 백엔드는 humps 라이브러리를 사용했으나 Hub는 raw entity를 반환하므로
     * 프론트엔드 호환성을 위해 수동 변환
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
        const result = this.htmlParserService.parseAll(htmlContent);
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
