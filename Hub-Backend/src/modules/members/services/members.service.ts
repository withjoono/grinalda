import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterWithEmailDto } from 'src/auth/dtos/register-with-email.dto';
import { RegisterWithSocialDto } from 'src/auth/dtos/register-with-social';
import { SocialUser } from 'src/auth/types/social-user.type';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { PrismaService } from 'src/database/prisma.service';
import { EditProfileDto } from '../dtos/edit-profile.dto';
import { MemberIdGeneratorService } from './member-id-generator.service';

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
    private memberIdGenerator: MemberIdGeneratorService,
  ) { }

  findOneByEmail(email: string) {
    return this.prisma.authMember.findFirst({
      where: { email },
    });
  }

  findOneByEmailAndProviderType(
    email: string,
    providerType: 'local' | 'google' | 'naver',
  ) {
    return this.prisma.authMember.findFirst({
      where: { email, provider_type: providerType },
    });
  }

  findOneById(id: string) {
    return this.prisma.authMember.findUnique({
      where: { id },
    });
  }

  findMeById(id: string) {
    return this.prisma.authMember.findUnique({
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
        studentProfile: true,
        teacherProfile: true,
        parentProfile: true,
      },
    });
  }

  async findActiveServicesById(memberId: string): Promise<string[]> {
    // 테스트 계정은 모든 서비스 이용 가능
    const testAccountEmails = ['test@test.com', 'admin@test.com'];
    const member = await this.prisma.authMember.findUnique({
      where: { id: memberId },
      select: { email: true },
    });

    if (member && testAccountEmails.includes(member.email)) {
      return ['S', 'J', 'T']; // 수시, 정시, 티켓 모두 활성화
    }

    const results: { service_range_code: string }[] = await this.prisma.$queryRaw`
      SELECT ps.service_range_code
      FROM hub.payment_contract pc
      JOIN hub.payment_order po ON pc.order_id = po.id
      JOIN hub.payment_service ps ON po.pay_service_id = ps.id
      WHERE pc.member_id = ${memberId}
        AND pc.contract_period_end_dt > NOW()
        AND pc.contract_use = 1
    `;

    return results.map((result) => result.service_range_code);
  }

  findOneByOAuthId(oauthId: string) {
    return this.prisma.authMember.findFirst({
      where: { oauth_id: oauthId },
    });
  }

  findOneByPhone(phone: string) {
    return this.prisma.authMember.findFirst({
      where: { phone: phone.replaceAll('-', '') },
    });
  }

  async saveMemberByEmail(data: RegisterWithEmailDto) {
    const hashedPassword = await this.bcryptService.hashPassword(data.password);

    const memberType = data.memberType || 'student';
    const userTypeCode = MemberIdGeneratorService.getTypeCode(memberType);
    const detailCode = data.userTypeDetailCode || this.getDefaultDetailCode(memberType);

    const id = await this.memberIdGenerator.generateId(userTypeCode, detailCode);

    const savedMember = await this.prisma.authMember.create({
      data: {
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
      },
    });

    // 타입별 서브 테이블에 프로필 저장
    await this.saveTypeProfile(savedMember.id, memberType, data);

    return savedMember;
  }

  async saveMemberBySocial(
    data: RegisterWithSocialDto,
    socialUser: SocialUser,
  ) {
    const memberType = data.memberType || 'student';
    const userTypeCode = MemberIdGeneratorService.getTypeCode(memberType);
    const detailCode = data.userTypeDetailCode || this.getDefaultDetailCode(memberType);

    const id = await this.memberIdGenerator.generateId(userTypeCode, detailCode);

    const savedMember = await this.prisma.authMember.create({
      data: {
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
      },
    });

    // 타입별 서브 테이블에 프로필 저장
    await this.saveTypeProfile(savedMember.id, memberType, data);

    return savedMember;
  }

  async editProfile(memberId: string, updateData: EditProfileDto) {
    const member = await this.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    // 공통 필드 업데이트
    const memberUpdate: Record<string, any> = { update_dt: new Date() };
    if (updateData.nickname !== undefined) memberUpdate.nickname = updateData.nickname;
    if (updateData.phone !== undefined) memberUpdate.phone = updateData.phone;
    if (updateData.ck_sms_agree !== undefined) memberUpdate.ck_sms_agree = updateData.ck_sms_agree;

    const updatedMember = await this.prisma.authMember.update({
      where: { id: memberId },
      data: memberUpdate,
    });

    // 학생 프로필 업데이트
    if (member.member_type === 'student') {
      const studentUpdate: Record<string, any> = {};
      if (updateData.school_level !== undefined) studentUpdate.school_level = updateData.school_level;
      if (updateData.grade !== undefined) studentUpdate.grade = updateData.grade;
      if (updateData.school_code !== undefined) studentUpdate.school_code = updateData.school_code;
      if (updateData.school_name !== undefined) studentUpdate.school_name = updateData.school_name;
      if (Object.keys(studentUpdate).length > 0) {
        await this.prisma.authMemberStudent.updateMany({
          where: { member_id: memberId },
          data: studentUpdate,
        });
      }
    }

    // 선생님 프로필 업데이트
    if (member.member_type === 'teacher') {
      const teacherUpdate: Record<string, any> = {};
      if (updateData.subject !== undefined) teacherUpdate.subject = updateData.subject;
      if (updateData.teacher_school_level !== undefined) teacherUpdate.school_level = updateData.teacher_school_level;
      if (Object.keys(teacherUpdate).length > 0) {
        await this.prisma.authMemberTeacher.updateMany({
          where: { member_id: memberId },
          data: teacherUpdate,
        });
      }
    }

    // 학부모 프로필 업데이트
    if (member.member_type === 'parent') {
      if (updateData.parent_type !== undefined) {
        await this.prisma.authMemberParent.updateMany({
          where: { member_id: memberId },
          data: { parent_type: updateData.parent_type },
        });
      }
    }

    return updatedMember;
  }

  findOneByEmailAndPhone(email: string, phone: string) {
    return this.prisma.authMember.findFirst({
      where: { email, phone: phone.replaceAll('-', '') },
    });
  }

  async updatePassword(memberId: string, newPassword: string): Promise<void> {
    await this.prisma.authMember.update({
      where: { id: memberId },
      data: {
        password: newPassword,
        provider_type: 'local',
      },
    });
  }

  // ============================================
  // Firebase Auth 관련 메서드
  // ============================================

  findOneByFirebaseUid(firebaseUid: string) {
    return this.prisma.authMember.findFirst({
      where: { firebase_uid: firebaseUid },
    });
  }

  async linkFirebaseUid(memberId: string, firebaseUid: string): Promise<void> {
    await this.prisma.authMember.update({
      where: { id: memberId },
      data: {
        firebase_uid: firebaseUid,
        update_dt: new Date(),
      },
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
  }) {
    const memberType = data.memberType || 'student';
    const userTypeCode = MemberIdGeneratorService.getTypeCode(memberType);
    const detailCode = data.userTypeDetailCode || this.getDefaultDetailCode(memberType);

    const id = await this.memberIdGenerator.generateId(userTypeCode, detailCode);

    const savedMember = await this.prisma.authMember.create({
      data: {
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
      },
    });

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
      case 'student':
        await this.prisma.authMemberStudent.create({
          data: {
            member_id: memberId,
            school_code: data.schoolCode || null,
            school_name: data.schoolName || null,
            school_location: data.schoolLocation || null,
            school_type: data.schoolType || null,
            school_level: data.schoolLevel || null,
            grade: data.grade || null,
          },
        });
        break;
      case 'teacher':
        await this.prisma.authMemberTeacher.create({
          data: {
            member_id: memberId,
            school_level: data.schoolLevel || null,
            subject: data.subject || null,
          },
        });
        break;
      case 'parent':
        await this.prisma.authMemberParent.create({
          data: {
            member_id: memberId,
            parent_type: data.parentType || null,
          },
        });
        break;
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
