import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FirebaseLoginDto {
  @ApiProperty({
    description: 'Firebase ID Token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class FirebaseRegisterDto {
  @ApiProperty({
    description: 'Firebase ID Token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({
    description: '닉네임 (이름)',
    example: '홍길동',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '학교 ID (선택)',
    example: 123,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hstTypeId?: number;

  @ApiProperty({
    description: '학교/대상 유형 (초등학생, 중학생, 고등학생, 중등검정고시, 대입검정고시, 재수생)',
    example: '고등학생',
    required: false,
  })
  @IsOptional()
  @IsString()
  schoolLevel?: string;

  @ApiProperty({
    description: '사용자 타입 코드 (E1~E6, M0~M3, H0~H3, HN)',
    example: 'H2',
    required: false,
  })
  @IsOptional()
  @IsString()
  userTypeCode?: string;

  @ApiProperty({
    description: '휴대폰 번호 (선택)',
    example: '01012345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'SMS 수신동의',
    example: true,
  })
  @IsBoolean()
  ckSmsAgree: boolean;

  @ApiProperty({
    description: '회원 유형 (student, teacher, parent)',
    example: 'student',
  })
  @IsString()
  @IsNotEmpty()
  memberType: string;

  @ApiProperty({
    description: '선생님 담당 과목 (teacher 전용)',
    example: '수학',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: '학부모 유형 (parent 전용)',
    example: '아버지',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentType?: string;
}
