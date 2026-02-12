import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MemberEntity } from '../member/member.entity';

@Entity('sgb_creative_activity')
export class SchoolRecordCreativeActivityEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: '아이디' })
    id: number;

    @Column({ type: 'text', nullable: true, comment: '학년' })
    grade: string;

    @Column({ type: 'text', nullable: true, comment: '활동유형 (자치활동, 동아리활동, 봉사활동, 진로활동)' })
    activity_type: string;

    @Column({ type: 'text', nullable: true, comment: '특기사항' })
    content: string;

    @ManyToOne(() => MemberEntity, { nullable: true })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;
}
