import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

/**
 * My 생기부 앱 전용 사용자 테이블
 * - Hub의 auth_member와 별도로 앱별 사용자 데이터를 관리
 * - hub_member_id를 통해 Hub 사용자와 연결
 */
@Entity('ms_auth_member')
@Index(['hub_member_id'], { unique: true })
export class MsAuthMemberEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', unique: true, comment: 'Hub auth_member.id 참조' })
    hub_member_id: number;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '닉네임' })
    nickname: string | null;

    @Column({ type: 'varchar', length: 500, nullable: true, comment: '이메일' })
    email: string | null;

    @Column({ type: 'varchar', length: 20, default: 'student', comment: '회원 유형 (student, teacher, parent)' })
    member_type: string;

    @Column({ type: 'varchar', length: 10, nullable: true, comment: '졸업년도' })
    graduate_year: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true, comment: '전공 (0: 문과, 1: 이과)' })
    major: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true, comment: '고교유형 ID' })
    hst_type_id: string | null;

    @Column({ type: 'varchar', length: 1, default: 'N', comment: '계정 정지 여부' })
    account_stop_yn: string;

    @Column({ type: 'timestamp', nullable: true, comment: '생성일시' })
    create_dt: Date;

    @Column({ type: 'timestamp', nullable: true, comment: '수정일시' })
    update_dt: Date;
}
