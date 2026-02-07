import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    Index,
    CreateDateColumn,
} from 'typeorm';
import { MemberEntity } from '../member/member.entity';

@Entity('mentoring_account_link_tb')
export class MentoringLinkEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Index('IDX_mentoring_account_link_member_id')
    @Column({ type: 'bigint', name: 'member_id' })
    member_id: number;

    @Index('IDX_mentoring_account_link_linked_member_id')
    @Column({ type: 'bigint', name: 'linked_member_id' })
    linked_member_id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    created_at: Date;

    @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;

    @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'linked_member_id' })
    linked_member: MemberEntity;
}
