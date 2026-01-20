import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OAuthClientEntity } from './oauth-client.entity';
import { MemberEntity } from '../member/member.entity';

@Entity('oauth_authorization_codes')
export class OAuthAuthorizationCodeEntity {
  @ApiProperty({ description: 'Authorization Code ID (Primary Key)' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Authorization Code (유니크)', example: 'AUTH_CODE_...' })
  @Column({ unique: true, length: 255 })
  @Index()
  code: string;

  @ApiProperty({ description: '클라이언트 ID', example: 'susi-app' })
  @Column({ length: 255 })
  clientId: string;

  @ApiProperty({ description: '사용자 ID' })
  @Column({ type: 'int' })
  memberId: number;

  @ApiProperty({ description: '리다이렉트 URI', example: 'http://localhost:3001/auth/callback' })
  @Column({ type: 'text' })
  redirectUri: string;

  @ApiProperty({
    description: '허용된 스코프 목록',
    type: [String],
    example: ['openid', 'profile', 'email'],
  })
  @Column('varchar', { array: true, length: 255 })
  scope: string[];

  @ApiProperty({ description: 'PKCE Code Challenge', nullable: true })
  @Column({ nullable: true, length: 255 })
  codeChallenge: string | null;

  @ApiProperty({ description: 'PKCE Code Challenge Method', example: 'S256', nullable: true })
  @Column({ nullable: true, length: 10 })
  codeChallengeMethod: string | null;

  @ApiProperty({ description: '만료 시간' })
  @Column({ type: 'timestamp' })
  @Index()
  expiresAt: Date;

  @ApiProperty({ description: '사용 여부', default: false })
  @Column({ default: false })
  isUsed: boolean;

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => OAuthClientEntity)
  @JoinColumn({ name: 'clientId', referencedColumnName: 'clientId' })
  client: OAuthClientEntity;

  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'memberId' })
  member: MemberEntity;
}
