import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { MemberEntity } from './member.entity';

@Entity('auth_member_p')
export class MemberParentEntity {
    @PrimaryColumn({ type: 'varchar', length: 30 })
    member_id: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    parent_type: string | null;

    @OneToOne(() => MemberEntity, (member) => member.parentProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;
}
