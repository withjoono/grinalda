import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth_member_file')
export class MemberUploadFileListEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ name: 'create_dt' })
  create_dt: Date;

  @Column({ name: 'file_key', length: 500 })
  file_key: string;

  @Column({ name: 'file_name', length: 500 })
  file_name: string;

  @Column({ name: 'file_path', length: 500 })
  file_path: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  file_size: number;

  @Column({ name: 'file_type', length: 500 })
  file_type: string;

  @Column({ name: 'member_id', type: 'varchar', length: 30 })
  member_id: string;

  @UpdateDateColumn({ name: 'update_dt' })
  update_dt: Date;
}
