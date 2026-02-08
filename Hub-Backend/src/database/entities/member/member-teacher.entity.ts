import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { MemberEntity } from './member.entity';

@Entity('auth_member_t')
export class MemberTeacherEntity {
    @PrimaryColumn({ type: 'varchar', length: 30 })
    member_id: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    school_level: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    subject: string | null;

    @OneToOne(() => MemberEntity, (member) => member.teacherProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;
}
