import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/** 사정관 학종 평가 시 질문 목록 */
@Entity('officer_bottom_survey_tb')
export class OfficerEvaluationSurveyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'evaluate_content', type: 'varchar', length: 500 })
  evaluateContent: string; // 소분류 (실제 질문 내용)

  @Column({ name: 'order_num', type: 'int', nullable: true })
  orderNum: number; // 순서 (질문번호)

  @Column({ name: 'main_category', type: 'varchar', length: 50, nullable: true })
  mainCategory: string; // 대분류: 1. 진로역량, 2. 학업역량, 3. 공동체역량, 4. 기타 역량

  @Column({ name: 'middle_category', type: 'varchar', length: 100, nullable: true })
  middleCategory: string; // 중분류

  @Column({ name: 'main_survey_type', type: 'varchar', length: 20, nullable: true })
  mainSurveyType: string; // 레거시 카테고리 (하위 호환용)
}
