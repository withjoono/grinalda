import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterWithEmailDto } from 'src/auth/dtos/register-with-email.dto';
import { RegisterWithSocialDto } from 'src/auth/dtos/register-with-social';
import { SocialUser } from 'src/auth/types/social-user.type';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { MemberEntity } from 'src/database/entities/member/member.entity';
import { MemberStudentEntity } from 'src/database/entities/member/member-student.entity';
import { MemberTeacherEntity } from 'src/database/entities/member/member-teacher.entity';
import { MemberParentEntity } from 'src/database/entities/member/member-parent.entity';
import { DataSource, Repository } from 'typeorm';
import { EditProfileDto } from '../dtos/edit-profile.dto';
import { MemberIdGeneratorService } from './member-id-generator.service';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private membersRepository: Repository<MemberEntity>,
    @InjectRepository(MemberStudentEntity)
    private studentRepository: Repository<MemberStudentEntity>,
    @InjectRepository(MemberTeacherEntity)
    private teacherRepository: Repository<MemberTeacherEntity>,
    @InjectRepository(MemberParentEntity)
    private parentRepository: Repository<MemberParentEntity>,
    private readonly dataSource: DataSource,
    private bcryptService: BcryptService,
    private memberIdGenerator: MemberIdGeneratorService,
  ) { }

  findOneByEmail(email: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOneBy({
      email,
    });
  }

  findOneByEmailAndProviderType(
    email: string,
    providerType: 'local' | 'google' | 'naver',
  ): Promise<MemberEntity | null> {
    return this.membersRepository.findOneBy({
      email,
      provider_type: providerType,
    });
  }

  findOneById(id: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOneBy({
      id,
    });
  }

  findMeById(id: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        role_type: true,
        phone: true,
        ck_sms_agree: true,
        nickname: true,
        member_type: true,
        user_type_code: true,
        user_type_detail_code: true,
      },
      relations: ['studentProfile', 'teacherProfile', 'parentProfile'],
    });
  }

  async findActiveServicesById(memberId: string): Promise<string[]> {
    // 테스트 계정은 모든 서비스 이용 가능
    const testAccountEmails = ['test@test.com', 'admin@test.com'];
    const member = await this.membersRepository.findOne({
      where: { id: memberId },
      select: ['email'],
    });

    if (member && testAccountEmails.includes(member.email)) {
      return ['S', 'J', 'T']; // 수시, 정시, 티켓 모두 활성화
    }

    const query = `
      SELECT ps.service_range_code
      FROM payment_contract pc
      JOIN payment_order po ON pc.order_id = po.id
      JOIN payment_service ps ON po.pay_service_id = ps.id
      WHERE pc.member_id = $1
        AND pc.contract_period_end_dt > NOW()
        AND pc.contract_use = 1
    `;
    const results = await this.dataSource.query(query, [memberId]);

    return results.map((result) => result.service_range_code);
  }

  findOneByOAuthId(oauthId: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOneBy({
      oauth_id: oauthId,
    });
  }

  findOneByPhone(phone: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOneBy({
      phone: phone.replaceAll('-', ''),
    });
  }

  async saveMemberByEmail(data: RegisterWithEmailDto): Promise<MemberEntity | null> {
    const hashedPassword = await this.bcryptService.hashPassword(data.password);

    const memberType = data.memberType || 'student';
    const userTypeCode = MemberIdGeneratorService.getTypeCode(memberType);
    const detailCode = data.userTypeDetailCode || this.getDefaultDetailCode(memberType);

    const id = await this.memberIdGenerator.generateId(userTypeCode, detailCode);

    const member = this.membersRepository.create({
      id,
      nickname: data.nickname,
      email: data.email,
      password: hashedPassword,
      role_type: 'ROLE_USER',
      phone: data.phone?.replaceAll('-', '') || '',
      ck_sms: true,
      ck_sms_agree: data.ckSmsAgree,
      account_stop_yn: 'N',
      provider_type: 'local',
      member_type: memberType,
      user_type_code: userTypeCode,
      user_type_detail_code: detailCode,
      reg_year: Number(new Date().getFullYear().toString().slice(-2)),
      reg_month: String(new Date().getMonth() + 1).padStart(2, '0'),
      reg_day: String(new Date().getDate()).padStart(2, '0'),
      create_dt: new Date(),
      update_dt: new Date(),
    });

    const savedMember = await this.membersRepository.save(member);

    // 타입별 서브 테이블에 프로필 저장
    await this.saveTypeProfile(savedMember.id, memberType, data);

    return savedMember;
  }

  async saveMemberBySocial(
    data: RegisterWithSocialDto,
    socialUser: SocialUser,
  ): Promise<MemberEntity | null> {
    const memberType = data.memberType || 'student';
    const userTypeCode = MemberIdGeneratorService.getTypeCode(memberType);
    const detailCode = data.userTypeDetailCode || this.getDefaultDetailCode(memberType);

    const id = await this.memberIdGenerator.generateId(userTypeCode, detailCode);

    const member = this.membersRepository.create({
      id,
      nickname: data.nickname,
      email: socialUser.email,
      profile_image_url: socialUser.profile_image,
      oauth_id: socialUser.id,
      role_type: 'ROLE_USER',
      phone: data.phone?.replaceAll('-', '') || '',
      ck_sms: true,
      ck_sms_agree: data.ckSmsAgree,
      account_stop_yn: 'N',
      member_type: memberType,
      user_type_code: userTypeCode,
      user_type_detail_code: detailCode,
      reg_year: Number(new Date().getFullYear().toString().slice(-2)),
      reg_month: String(new Date().getMonth() + 1).padStart(2, '0'),
      reg_day: String(new Date().getDate()).padStart(2, '0'),
      provider_type: data.socialType,
      create_dt: new Date(),
      update_dt: new Date(),
    });

    const savedMember = await this.membersRepository.save(member);

    // 타입별 서브 테이블에 프로필 저장
    await this.saveTypeProfile(savedMember.id, memberType, data);

    return savedMember;
  }

  async editProfile(memberId: string, updateData: EditProfileDto): Promise<MemberEntity> {
    const member = await this.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    // 공통 필드 업데이트
    if (updateData.nickname !== undefined) {
      member.nickname = updateData.nickname;
    }
    if (updateData.phone !== undefined) {
      member.phone = updateData.phone;
    }
    if (updateData.ck_sms_agree !== undefined) {
      member.ck_sms_agree = updateData.ck_sms_agree;
    }

    member.update_dt = new Date();
    await this.membersRepository.save(member);

    // 학생 프로필 업데이트
    if (member.member_type === 'student') {
      const studentProfile = await this.studentRepository.findOneBy({ member_id: memberId });
      if (studentProfile) {
        if (updateData.school_level !== undefined) {
          studentProfile.school_level = updateData.school_level;
        }
        if (updateData.grade !== undefined) {
          studentProfile.grade = updateData.grade;
        }
        if (updateData.school_code !== undefined) {
          studentProfile.school_code = updateData.school_code;
        }
        if (updateData.school_name !== undefined) {
          studentProfile.school_name = updateData.school_name;
        }
        await this.studentRepository.save(studentProfile);
      }
    }

    // 선생님 프로필 업데이트
    if (member.member_type === 'teacher') {
      const teacherProfile = await this.teacherRepository.findOneBy({ member_id: memberId });
      if (teacherProfile) {
        if (updateData.subject !== undefined) {
          teacherProfile.subject = updateData.subject;
        }
        if (updateData.teacher_school_level !== undefined) {
          teacherProfile.school_level = updateData.teacher_school_level;
        }
        await this.teacherRepository.save(teacherProfile);
      }
    }

    // 학부모 프로필 업데이트
    if (member.member_type === 'parent') {
      const parentProfile = await this.parentRepository.findOneBy({ member_id: memberId });
      if (parentProfile) {
        if (updateData.parent_type !== undefined) {
          parentProfile.parent_type = updateData.parent_type;
        }
        await this.parentRepository.save(parentProfile);
      }
    }

    return member;
  }

  findOneByEmailAndPhone(email: string, phone: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOne({
      where: { email, phone: phone.replaceAll('-', '') },
    });
  }

  async updatePassword(memberId: string, newPassword: string): Promise<void> {
    await this.membersRepository.update(memberId, {
      password: newPassword,
      provider_type: 'local',
    });
  }

  // ============================================
  // Firebase Auth 관련 메서드
  // ============================================

  findOneByFirebaseUid(firebaseUid: string): Promise<MemberEntity | null> {
    return this.membersRepository.findOneBy({
      firebase_uid: firebaseUid,
    });
  }

  async linkFirebaseUid(memberId: string, firebaseUid: string): Promise<void> {
    await this.membersRepository.update(memberId, {
      firebase_uid: firebaseUid,
      update_dt: new Date(),
    });
  }

  async saveMemberByFirebase(data: {
    firebaseUid: string;
    email?: string;
    name: string;
    photoUrl?: string;
    provider: string;
    phone?: string;
    schoolLevel?: string;
    userTypeDetailCode?: string;
    ckSmsAgree?: boolean;
    memberType?: string;
    grade?: number;
    subject?: string;
    parentType?: string;
  }): Promise<MemberEntity> {
    const memberType = data.memberType || 'student';
    const userTypeCode = MemberIdGeneratorService.getTypeCode(memberType);
    const detailCode = data.userTypeDetailCode || this.getDefaultDetailCode(memberType);

    const id = await this.memberIdGenerator.generateId(userTypeCode, detailCode);

    const member = this.membersRepository.create({
      id,
      email: data.email || `${data.firebaseUid}@firebase.local`,
      nickname: data.name,
      firebase_uid: data.firebaseUid,
      profile_image_url: data.photoUrl || null,
      role_type: 'ROLE_USER',
      phone: data.phone || '',
      ck_sms: false,
      ck_sms_agree: data.ckSmsAgree || false,
      account_stop_yn: 'N',
      provider_type: data.provider === 'google.com' ? 'google' : 'firebase',
      member_type: memberType,
      user_type_code: userTypeCode,
      user_type_detail_code: detailCode,
      reg_year: Number(new Date().getFullYear().toString().slice(-2)),
      reg_month: String(new Date().getMonth() + 1).padStart(2, '0'),
      reg_day: String(new Date().getDate()).padStart(2, '0'),
      create_dt: new Date(),
      update_dt: new Date(),
    });

    const savedMember = await this.membersRepository.save(member);

    // 타입별 서브 테이블에 프로필 저장
    await this.saveTypeProfile(savedMember.id, memberType, data);

    return savedMember;
  }

  // ============================================
  // Private 헬퍼 메서드
  // ============================================

  /**
   * member_type에 따라 서브 테이블에 프로필 데이터를 저장합니다.
   */
  private async saveTypeProfile(
    memberId: string,
    memberType: string,
    data: {
      schoolCode?: string;
      schoolName?: string;
      schoolLocation?: string;
      schoolType?: string;
      schoolLevel?: string;
      grade?: number;
      subject?: string;
      parentType?: string;
    },
  ): Promise<void> {
    switch (memberType) {
      case 'student': {
        const profile = this.studentRepository.create({
          member_id: memberId,
          school_code: data.schoolCode || null,
          school_name: data.schoolName || null,
          school_location: data.schoolLocation || null,
          school_type: data.schoolType || null,
          school_level: data.schoolLevel || null,
          grade: data.grade || null,
        });
        await this.studentRepository.save(profile);
        break;
      }
      case 'teacher': {
        const profile = this.teacherRepository.create({
          member_id: memberId,
          school_level: data.schoolLevel || null,
          subject: data.subject || null,
        });
        await this.teacherRepository.save(profile);
        break;
      }
      case 'parent': {
        const profile = this.parentRepository.create({
          member_id: memberId,
          parent_type: data.parentType || null,
        });
        await this.parentRepository.save(profile);
        break;
      }
    }
  }

  /**
   * member_type에 따른 기본 세부코드 반환
   */
  private getDefaultDetailCode(memberType: string): string {
    switch (memberType) {
      case 'student': return 'H2'; // 기본: 고2
      case 'teacher': return 'HM'; // 기본: 고등수학
      case 'parent': return 'FA'; // 기본: 아버지
      default: return 'H2';
    }
  }
}
