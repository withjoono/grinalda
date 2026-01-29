import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * SSO 코드 생성 요청 DTO
 * Hub에서 다른 서비스로 이동 시 일회용 코드 생성
 */
export class SsoGenerateCodeDto {
  @ApiProperty({
    description: '대상 서비스 식별자 (susi, jungsi, examhub, studyplanner)',
    example: 'susi',
  })
  @IsNotEmpty()
  @IsString()
  targetService: string;
}
