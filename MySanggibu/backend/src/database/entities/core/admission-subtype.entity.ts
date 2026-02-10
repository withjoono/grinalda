import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdmissionEntity } from './admission.entity';
import { AdmissionSubtypeCategoryEntity } from './admission-subtype-category.entity';

@Entity('ss_admission_subtype', { comment: '전형 세부유형 정보 테이블' })
export class AdmissionSubtypeEntity {
  @PrimaryGeneratedColumn({ comment: '전형 세부유형 고유 ID' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    comment: '전형 세부유형 이름 (예: 농어촌, 특기자)',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: '전형 코드 (Excel 파일의 특별전형 코드)',
  })
  code: string | null;

  @Column({
    name: 'category_id',
    type: 'int',
    nullable: true,
    comment: '카테고리 ID',
  })
  categoryId: number | null;

  @ManyToOne(() => AdmissionSubtypeCategoryEntity, (category) => category.subtypes)
  @JoinColumn({ name: 'category_id' })
  category: AdmissionSubtypeCategoryEntity;

  @ManyToMany(() => AdmissionEntity, (admission) => admission.subtypes)
  admissions: AdmissionEntity[];
}
