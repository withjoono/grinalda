import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberEntity } from 'src/database/entities/member/member.entity';

/**
 * 회원 ID 자동 생성 서비스
 * 숫자 전용 형식 (bigint 호환): {타입1자리}{연도2자리}{세부코드2자리}{월2자리}{일2자리}{순번}
 * 예: 1260202141 = 1(학생) + 26(2026년) + 02(고2) + 02(월) + 14(일) + 1(순번)
 *
 * 타입 매핑: student=1, teacher=2, parent=3
 * 세부코드 매핑: H1=01, H2=02, H3=03, HM=11, HE=12, HS=13, FA=21, MO=22
 */
@Injectable()
export class MemberIdGeneratorService {
    constructor(
        @InjectRepository(MemberEntity)
        private membersRepository: Repository<MemberEntity>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * 새 회원 ID를 생성합니다 (숫자 전용, bigint 호환).
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

        // 숫자 변환
        const numType = MemberIdGeneratorService.typeCodeToNumeric(userTypeCode);
        const numDetail = MemberIdGeneratorService.detailCodeToNumeric(detailCode);

        // ID prefix: 126020214 (타입+연도+세부코드+월+일)
        const prefix = `${numType}${year}${numDetail}${month}${day}`;

        // 같은 prefix로 시작하는 기존 ID 중 가장 큰 순번 찾기
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
     * member_type에서 타입코드 접두사를 반환합니다 (문자).
     */
    static getTypeCode(memberType: string): string {
        switch (memberType) {
            case 'student': return 'S';
            case 'teacher': return 'T';
            case 'parent': return 'P';
            default: return 'S';
        }
    }

    /**
     * 타입코드(S, T, P)를 숫자로 변환합니다.
     */
    private static typeCodeToNumeric(code: string): string {
        const map: Record<string, string> = { 'S': '1', 'T': '2', 'P': '3' };
        return map[code] || '1';
    }

    /**
     * 세부코드(H2, HM 등)를 2자리 숫자로 변환합니다.
     */
    private static detailCodeToNumeric(code: string): string {
        const map: Record<string, string> = {
            'H1': '01', 'H2': '02', 'H3': '03',
            'HM': '11', 'HE': '12', 'HS': '13',
            'FA': '21', 'MO': '22',
        };
        return map[code] || '99';
    }
}
