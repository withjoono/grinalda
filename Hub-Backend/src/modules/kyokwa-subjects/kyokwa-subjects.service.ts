import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KyokwaSubjectsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * 교과 목록 조회 (DISTINCT kyokwa, kyokwa_code)
     */
    async getKyokwaList(curriculum: '2015' | '2022') {
        if (curriculum === '2015') {
            const rows = await this.prisma.hub2015KyokwaSubject.findMany({
                select: { kyokwa: true, kyokwa_code: true },
                distinct: ['kyokwa_code'],
                orderBy: { kyokwa_code: 'asc' },
            });
            return rows.map((r) => ({ kyokwa: r.kyokwa, kyokwaCode: r.kyokwa_code }));
        } else {
            const rows = await this.prisma.hub2022KyokwaSubject.findMany({
                select: { kyokwa: true, kyokwa_code: true },
                distinct: ['kyokwa_code'],
                orderBy: { kyokwa_code: 'asc' },
            });
            return rows.map((r) => ({ kyokwa: r.kyokwa, kyokwaCode: r.kyokwa_code }));
        }
    }

    /**
     * 특정 교과의 과목 목록 조회
     */
    async getSubjectsByKyokwa(kyokwaCode: string, curriculum: '2015' | '2022') {
        if (curriculum === '2015') {
            const rows = await this.prisma.hub2015KyokwaSubject.findMany({
                where: { kyokwa_code: kyokwaCode },
                select: {
                    id: true,
                    subject_name: true,
                    subject_code: true,
                    classification: true,
                    evaluation_method: true,
                },
                orderBy: { subject_code: 'asc' },
            });
            return rows.map((r) => ({
                id: r.id,
                subjectName: r.subject_name,
                subjectCode: r.subject_code,
                classification: r.classification,
                evaluationMethod: r.evaluation_method,
            }));
        } else {
            const rows = await this.prisma.hub2022KyokwaSubject.findMany({
                where: { kyokwa_code: kyokwaCode },
                select: {
                    id: true,
                    subject_name: true,
                    subject_code: true,
                    classification: true,
                    evaluation_method: true,
                },
                orderBy: { subject_code: 'asc' },
            });
            return rows.map((r) => ({
                id: r.id,
                subjectName: r.subject_name,
                subjectCode: r.subject_code,
                classification: r.classification,
                evaluationMethod: r.evaluation_method,
            }));
        }
    }
}
