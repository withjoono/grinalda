import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { KyokwaSubjectsService } from './kyokwa-subjects.service';

@Controller('kyokwa-subjects')
export class KyokwaSubjectsController {
    constructor(private readonly kyokwaSubjectsService: KyokwaSubjectsService) { }

    /**
     * 교과 목록 조회
     * GET /kyokwa-subjects?curriculum=2015|2022
     */
    @Public()
    @Get()
    async getKyokwaList(@Query('curriculum') curriculum: string) {
        const cur = curriculum === '2015' ? '2015' : '2022';
        return this.kyokwaSubjectsService.getKyokwaList(cur);
    }

    /**
     * 특정 교과의 과목 목록 조회
     * GET /kyokwa-subjects/:kyokwaCode/subjects?curriculum=2015|2022
     */
    @Public()
    @Get(':kyokwaCode/subjects')
    async getSubjects(
        @Param('kyokwaCode') kyokwaCode: string,
        @Query('curriculum') curriculum: string,
    ) {
        const cur = curriculum === '2015' ? '2015' : '2022';
        return this.kyokwaSubjectsService.getSubjectsByKyokwa(kyokwaCode, cur);
    }
}
