import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterWithSocialDto {
  @ApiProperty({
    description: '소셜 로그인 제공자',
    example: 'google',
    enum: ['naver', 'google'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['naver', 'google'])
  socialType: 'naver' | 'google';

  @ApiProperty({
    description: '소셜 로그인 액세스 토큰 (OAuth 제공자로부터 발급받은 토큰)',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '김학생',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '휴대폰 번호 (하이픈 포함 가능)',
    example: '010-1234-5678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'SMS 수신 동의 여부',
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
    description: '초/중/고',
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
    description: '학교타입',
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
    description: '학부모 타입',
    example: '아버지',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentType?: string;

  @ApiProperty({
    description: '초대 코드',
    example: 'ABC123XYZ789',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  inviteCode?: string;
}
