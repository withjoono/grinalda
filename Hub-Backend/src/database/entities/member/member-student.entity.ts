import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { MemberEntity } from './member.entity';

@Entity('auth_member_s')
export class MemberStudentEntity {
    @PrimaryColumn({ type: 'varchar', length: 30 })
    member_id: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    school_code: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    school_name: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    school_location: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    school_type: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    school_level: string | null;

    @Column({ type: 'int', nullable: true })
    grade: number | null;

    @OneToOne(() => MemberEntity, (member) => member.studentProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;
}
