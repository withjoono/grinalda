import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * SSO 코드 검증 요청 DTO
 * 다른 서비스에서 Hub로 코드 검증 및 토큰 교환 요청
 */
export class SsoVerifyCodeDto {
  @ApiProperty({
    description: 'SSO 일회용 코드 (5분 유효)',
    example: 'SSO_abc123def456',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: '요청 서비스 식별자 (보안 검증용)',
    example: 'susi',
  })
  @IsNotEmpty()
  @IsString()
  serviceId: string;
}
