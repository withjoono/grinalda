import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsBoolean()
  ck_sms_agree?: boolean;

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
}
