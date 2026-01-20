import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('oauth_clients')
export class OAuthClientEntity {
  @ApiProperty({ description: '클라이언트 ID (Primary Key)' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '클라이언트 식별자', example: 'susi-app' })
  @Column({ unique: true, length: 255 })
  clientId: string;

  @ApiProperty({ description: '클라이언트 시크릿 (PKCE 사용 시 선택사항)' })
  @Column({ nullable: true, length: 255 })
  clientSecret: string | null;

  @ApiProperty({ description: '클라이언트 이름', example: 'Susi Application' })
  @Column({ length: 255 })
  clientName: string;

  @ApiProperty({
    description: '허용된 리다이렉트 URI 목록',
    type: [String],
    example: ['http://localhost:3001/auth/callback'],
  })
  @Column('text', { array: true })
  redirectUris: string[];

  @ApiProperty({
    description: '허용된 스코프 목록',
    type: [String],
    example: ['openid', 'profile', 'email'],
  })
  @Column('varchar', { array: true, length: 255 })
  allowedScopes: string[];

  @ApiProperty({ description: '활성화 여부', default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
