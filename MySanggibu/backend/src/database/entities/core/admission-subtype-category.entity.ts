import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AdmissionSubtypeEntity } from './admission-subtype.entity';

@Entity('ss_admission_subtype_category', { comment: '특별전형 카테고리 테이블' })
export class AdmissionSubtypeCategoryEntity {
  @PrimaryGeneratedColumn({ comment: '카테고리 고유 ID' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    comment: '카테고리 이름 (예: 지역인재, 사회적 배려/저소득)',
  })
  name: string;

  @Column({
    name: 'display_order',
    type: 'int',
    default: 0,
    comment: '표시 순서',
  })
  displayOrder: number;

  @OneToMany(() => AdmissionSubtypeEntity, (subtype) => subtype.category)
  subtypes: AdmissionSubtypeEntity[];
}
