import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsBoolean()
  ck_sms_agree?: boolean;

  @IsOptional()
  @IsString()
  phone?: string;

  // ===== 학생 전용 =====
  @IsOptional()
  @IsString()
  school_level?: string;

  @IsOptional()
  @IsInt()
  grade?: number;

  @IsOptional()
  @IsString()
  school_code?: string;

  @IsOptional()
  @IsString()
  school_name?: string;

  // ===== 선생님 전용 =====
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  teacher_school_level?: string;

  // ===== 학부모 전용 =====
  @IsOptional()
  @IsString()
  parent_type?: string;
}
