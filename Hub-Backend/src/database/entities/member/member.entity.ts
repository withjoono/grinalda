import { Column, Entity, PrimaryColumn, Index, OneToMany, OneToOne } from 'typeorm';
import { MemberInterestsEntity } from './member-interests';
import { Exclude, Expose } from 'class-transformer';
import { PostEntity } from '../boards/post.entity';
import { CommentEntity } from '../boards/comment.entity';
import { MemberStudentEntity } from './member-student.entity';
import { MemberTeacherEntity } from './member-teacher.entity';
import { MemberParentEntity } from './member-parent.entity';

@Entity('auth_member')
@Index(['email', 'phone', 'oauth_id'])
export class MemberEntity {
  // ID: {타입접두사}{연도2자리}{세부코드}{월2자리}{일2자리}{순번}
  // 예: S26H208011 = 학생 + 2026년 + 고2 + 08월 + 01일 + 1번째
  @PrimaryColumn({ type: 'varchar', length: 30 })
  id: string;

  @Column({ type: 'varchar', length: 500 })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 500 })
  role_type: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({
    type: 'bit',
    default: () => "b'0'",
    transformer: {
      from: (v: Buffer | number | boolean) =>
        v === true || v === 1 || (v instanceof Buffer && v[0] === 1),
      to: (v: boolean) => (v ? 1 : 0),
    },
  })
  ck_sms: boolean;

  @Column({
    type: 'bit',
    default: () => "b'0'",
    transformer: {
      from: (v: Buffer | number | boolean) =>
        v === true || v === 1 || (v instanceof Buffer && v[0] === 1),
      to: (v: boolean) => (v ? 1 : 0),
    },
  })
  ck_sms_agree: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname: string | null;

  @Column({ type: 'varchar', length: 20, default: 'student' }) // student, teacher, parent
  member_type: string;

  @Column({ type: 'varchar', length: 4000, nullable: true })
  profile_image_url: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  provider_type: string | null;

  @Expose({ groups: ['admin'] })
  @Column({ type: 'varchar', length: 500, nullable: true })
  oauth_id: string | null;

  @Expose({ groups: ['admin'] })
  @Index('idx_member_firebase_uid')
  @Column({ type: 'varchar', length: 128, nullable: true })
  firebase_uid: string | null;

  // ===== 엑셀 기반 새 칼럼 =====

  // 사용자 타입 접두사 (S: 학생, T: 선생님, P: 학부모)
  @Column({ type: 'varchar', length: 5, nullable: true })
  user_type_code: string | null;

  // 세부 사용자 타입 코드 (H2, HM, FA 등)
  @Column({ type: 'varchar', length: 5, nullable: true })
  user_type_detail_code: string | null;

  // 등록년도 (2자리 연도, 예: 25)
  @Column({ type: 'int', nullable: true })
  reg_year: number | null;

  // 등록월 (2자리, 예: "01")
  @Column({ type: 'varchar', length: 2, nullable: true })
  reg_month: string | null;

  // 등록일 (2자리, 예: "01")
  @Column({ type: 'varchar', length: 2, nullable: true })
  reg_day: string | null;

  @Expose({ groups: ['admin'] })
  @Column({ type: 'varchar', length: 1, default: 'N' })
  account_stop_yn: string;

  @Expose({ groups: ['admin'] })
  @Column({ type: 'timestamp', nullable: true })
  create_dt: Date;

  @Expose({ groups: ['admin'] })
  @Column({ type: 'timestamp', nullable: true })
  update_dt: Date;

  // ===== 타입별 프로필 (1:1 관계) =====

  @OneToOne(() => MemberStudentEntity, (profile) => profile.member, { cascade: true, eager: false })
  studentProfile: MemberStudentEntity;

  @OneToOne(() => MemberTeacherEntity, (profile) => profile.member, { cascade: true, eager: false })
  teacherProfile: MemberTeacherEntity;

  @OneToOne(() => MemberParentEntity, (profile) => profile.member, { cascade: true, eager: false })
  parentProfile: MemberParentEntity;

  @OneToMany(() => MemberInterestsEntity, (interest) => interest.member)
  interests: MemberInterestsEntity[];

  @OneToMany(() => PostEntity, (post) => post.member)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.member)
  comments: CommentEntity[];
}
