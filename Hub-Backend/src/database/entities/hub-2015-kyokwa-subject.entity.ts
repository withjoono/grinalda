
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('hub_2015_kyokwa_subject')
export class Hub2015KyokwaSubject {
    @PrimaryColumn({ type: 'varchar', length: 20, comment: 'ID (e.g., 15H0111)' })
    id: string;

    @Column({ type: 'varchar', length: 50, comment: '교과 (e.g., 국어)' })
    kyokwa: string;

    @Column({ type: 'varchar', length: 10, comment: '교과코드 (e.g., 15H01)' })
    kyokwa_code: string;

    @Column({ type: 'varchar', length: 50, comment: '종류 (e.g., 공통과목)' })
    classification: string;

    @Column({ type: 'int', comment: '종류코드 (e.g., 1)' })
    classification_code: number;

    @Column({ type: 'varchar', length: 100, comment: '과목 (e.g., 국어)' })
    subject_name: string;

    @Column({ type: 'int', comment: '과목코드 (e.g., 1)' })
    subject_code: number;

    @Column({ type: 'varchar', length: 50, nullable: true, comment: '성취평가,성적 (e.g., 5단계,성취)' })
    evaluation_method: string;
}
