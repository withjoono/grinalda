import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    description: 'Grant type',
    example: 'authorization_code',
    enum: ['authorization_code', 'refresh_token'],
  })
  @IsString()
  @IsIn(['authorization_code', 'refresh_token'])
  grant_type: string;

  @ApiProperty({
    description: 'Authorization code (grant_type=authorization_code인 경우 필수)',
    example: 'AUTH_CODE_...',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: 'OAuth 클라이언트 ID',
    example: 'susi-app',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'OAuth 클라이언트 Secret (Confidential Client용)',
    example: 'susi-secret-change-in-production',
    required: false,
  })
  @IsString()
  @IsOptional()
  client_secret?: string;

  @ApiProperty({
    description: 'Redirect URI (Authorization 요청 시와 동일해야 함)',
    example: 'http://localhost:3001/auth/callback',
    required: false,
  })
  @IsString()
  @IsOptional()
  redirect_uri?: string;

  @ApiProperty({
    description: 'PKCE Code Verifier',
    example: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
    required: false,
  })
  @IsString()
  @IsOptional()
  code_verifier?: string;

  @ApiProperty({
    description: 'Refresh token (grant_type=refresh_token인 경우 필수)',
    example: 'eyJhbGciOi...',
    required: false,
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
