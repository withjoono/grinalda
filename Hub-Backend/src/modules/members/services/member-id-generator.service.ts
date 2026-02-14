import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberEntity } from 'src/database/entities/member/member.entity';

/**
 * 회원 ID 자동 생성 서비스
 * 형식: {타입접두사}{연도2자리}{세부코드}{월2자리}{일2자리}{순번}
 * 예: S26H201011 = 학생 + 2026년 + 고2 + 01월 + 01일 + 1번째
 */
@Injectable()
export class MemberIdGeneratorService {
    constructor(
        @InjectRepository(MemberEntity)
        private membersRepository: Repository<MemberEntity>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * 새 회원 ID를 생성합니다.
     * @param userTypeCode - 사용자타입 접두사 (S, T, P)
     * @param detailCode - 세부사용자타입코드 (H2, HM, FA 등)
     * @param date - 등록 날짜 (기본: 현재)
     */
    async generateId(
        userTypeCode: string,
        detailCode: string,
        date?: Date,
    ): Promise<string> {
        const now = date || new Date();
        const year = String(now.getFullYear()).slice(-2); // 26
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12
        const day = String(now.getDate()).padStart(2, '0'); // 01-31

        // ID prefix: S26H20101 (타입+연도+세부코드+월+일)
        const prefix = `${userTypeCode}${year}${detailCode}${month}${day}`;

        // 같은 prefix로 시작하는 기존 ID 중 가장 큰 순번 찾기
        // CAST(id AS TEXT)를 사용하여 bigint/varchar 모두 지원
        const result = await this.dataSource.query(
            `SELECT CAST(id AS TEXT) as id FROM auth_member
             WHERE CAST(id AS TEXT) LIKE $1
             ORDER BY CAST(id AS TEXT) DESC LIMIT 1`,
            [`${prefix}%`],
        );

        let seq = 1;
        if (result.length > 0) {
            const lastId = result[0].id;
            const lastSeq = lastId.slice(prefix.length);
            const parsed = parseInt(lastSeq, 10);
            if (!isNaN(parsed)) {
                seq = parsed + 1;
            }
        }

        return `${prefix}${seq}`;
    }

    /**
     * member_type에서 타입코드 접두사를 반환합니다.
     */
    static getTypeCode(memberType: string): string {
        switch (memberType) {
            case 'student': return 'S';
            case 'teacher': return 'T';
            case 'parent': return 'P';
            default: return 'S';
        }
    }
}
