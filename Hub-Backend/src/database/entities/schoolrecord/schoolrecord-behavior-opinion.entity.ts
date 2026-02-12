import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MemberEntity } from '../member/member.entity';

@Entity('sgb_behavior_opinion')
export class SchoolRecordBehaviorOpinionEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: '아이디' })
    id: number;

    @Column({ type: 'text', nullable: true, comment: '학년' })
    grade: string;

    @Column({ type: 'text', nullable: true, comment: '행동특성 및 종합의견' })
    content: string;

    @ManyToOne(() => MemberEntity, { nullable: true })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;
}
