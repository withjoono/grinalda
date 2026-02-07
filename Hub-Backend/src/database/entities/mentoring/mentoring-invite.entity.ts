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

@Entity('mentoring_temp_code_tb')
export class MentoringInviteEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', name: 'member_id' })
    member_id: number;

    @Index('IDX_mentoring_temp_code_code')
    @Column({ type: 'varchar', length: 255 })
    code: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    return_url: string | null;

    @Column({
        type: 'varchar',
        length: 20,
        default: 'pending',
    })
    status: 'pending' | 'accepted' | 'expired';

    @Index('IDX_mentoring_temp_code_expire_at')
    @Column({ type: 'timestamp' })
    expire_at: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    created_at: Date;

    @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;
}
