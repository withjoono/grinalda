import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class ConsentDto {
  @ApiProperty({
    description: 'OAuth 클라이언트 ID',
    example: 'susi-app',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'Redirect URI',
    example: 'http://localhost:3001/auth/callback',
  })
  @IsString()
  @IsNotEmpty()
  redirect_uri: string;

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
    description: 'PKCE Code Challenge',
    required: false,
  })
  @IsString()
  @IsOptional()
  code_challenge?: string;

  @ApiProperty({
    description: 'PKCE Code Challenge Method',
    example: 'S256',
    required: false,
  })
  @IsString()
  @IsOptional()
  code_challenge_method?: string;
}
