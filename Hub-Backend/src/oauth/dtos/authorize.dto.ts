import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class AuthorizeDto {
  @ApiProperty({
    description: 'OAuth 클라이언트 ID',
    example: 'susi-app',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'Redirect URI (등록된 URI와 정확히 일치해야 함)',
    example: 'http://localhost:3001/auth/callback',
  })
  @IsString()
  @IsNotEmpty()
  redirect_uri: string;

  @ApiProperty({
    description: 'Response type (항상 code)',
    example: 'code',
  })
  @IsString()
  @IsIn(['code'])
  response_type: string;

  @ApiProperty({
    description: '요청 스코프 (공백으로 구분)',
    example: 'openid profile email',
  })
  @IsString()
  @IsNotEmpty()
  scope: string;

  @ApiProperty({
    description: 'CSRF 방지를 위한 state 파라미터',
    example: 'random_state_string_32_chars',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'PKCE Code Challenge (base64url 인코딩된 SHA-256 해시)',
    example: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    required: false,
  })
  @IsString()
  @IsOptional()
  code_challenge?: string;

  @ApiProperty({
    description: 'PKCE Code Challenge Method',
    example: 'S256',
    enum: ['S256', 'plain'],
    required: false,
  })
  @IsString()
  @IsIn(['S256', 'plain'])
  @IsOptional()
  code_challenge_method?: string;
}
