import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterWithEmailDto {
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'student@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호 (6-500자)',
    example: 'password123!',
    minLength: 6,
    maxLength: 500,
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. It must be at least 6 characters long.',
  })
  @MaxLength(500, {
    message: 'Password is too long. It must be at most 500 characters long.',
  })
  password: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '김학생',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string; // 이름

  @ApiProperty({
    description: '휴대폰 번호 (하이픈 포함 가능)',
    example: '010-1234-5678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'SMS 수신 동의 여부 (선택, 기본값 false)',
    example: true,
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ckSmsAgree?: boolean;

  @ApiProperty({
    description: '회원 유형 (학생/교사/학부모)',
    example: 'student',
    enum: ['student', 'teacher', 'parent'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['student', 'teacher', 'parent'])
  memberType?: string;

  @ApiProperty({
    description: '세부 사용자 타입 코드 (H2, HM, FA 등)',
    example: 'H2',
    required: false,
  })
  @IsString()
  @IsOptional()
  userTypeDetailCode?: string;

  @ApiProperty({
    description: '초/중/고 (초등, 중등, 고등)',
    example: '고',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolLevel?: string;

  @ApiProperty({
    description: '학년',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  grade?: number;

  @ApiProperty({
    description: '학교코드',
    example: 'H324',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolCode?: string;

  @ApiProperty({
    description: '학교명',
    example: '경기고',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolName?: string;

  @ApiProperty({
    description: '학교소재지',
    example: '서울',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolLocation?: string;

  @ApiProperty({
    description: '학교타입 (일반고, 특목고 등)',
    example: '일반고',
    required: false,
  })
  @IsString()
  @IsOptional()
  schoolType?: string;

  @ApiProperty({
    description: '과목 (선생님 전용)',
    example: '수학',
    required: false,
  })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({
    description: '학부모 타입 (아버지, 어머니 등)',
    example: '아버지',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentType?: string;

  @ApiProperty({
    description: '초대 코드 (선생님이 생성한 초대 링크 코드, 회원가입 후 자동 연동)',
    example: 'ABC123XYZ789',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  inviteCode?: string;
}
