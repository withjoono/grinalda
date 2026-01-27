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
    description: '전공 (0: 문과, 1: 이과)',
    example: '0',
  })
  @IsString()
  @IsNotEmpty()
  isMajor: string;

  @ApiProperty({
    description: '졸업예정연도',
    example: '2025',
  })
  @IsString()
  @IsNotEmpty()
  graduateYear: string;

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
}
