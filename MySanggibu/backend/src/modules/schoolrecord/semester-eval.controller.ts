// @ts-nocheck
/**
 * Semester Evaluation Controller
 * - POST /schoolrecord/eval/semester — 학기별 세특 평가
 * - POST /schoolrecord/eval/comprehensive — 종합 평가 (세특+창체+행특)
 */

import { Controller, Post, Body } from '@nestjs/common';
import { SemesterEvalService, SemesterEvalRequestDto, ComprehensiveEvalRequestDto } from './semester-eval.service';

@Controller('schoolrecord')
export class SemesterEvalController {
    constructor(private readonly semesterEvalService: SemesterEvalService) { }

    @Post('eval/semester')
    async evaluateSemester(@Body() dto: SemesterEvalRequestDto) {
        const result = await this.semesterEvalService.evaluateSemester(dto);
        return { success: true, data: result };
    }

    @Post('eval/comprehensive')
    async evaluateComprehensive(@Body() dto: ComprehensiveEvalRequestDto) {
        const result = await this.semesterEvalService.evaluateComprehensive(dto);
        return { success: true, data: result };
    }
}
