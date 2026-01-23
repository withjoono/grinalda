import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OAuthClientEntity } from '../database/entities/oauth/oauth-client.entity';
import { OAuthAuthorizationCodeEntity } from '../database/entities/oauth/oauth-authorization-code.entity';
import { JwtService } from '../common/jwt/jwt.service';
import { MembersService } from '../modules/members/services/members.service';
import * as crypto from 'crypto';

interface GenerateAuthCodeData {
  clientId: string;
  memberId: number;
  redirectUri: string;
  scope: string[];
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(OAuthClientEntity)
    private readonly oauthClientRepository: Repository<OAuthClientEntity>,
    @InjectRepository(OAuthAuthorizationCodeEntity)
    private readonly authCodeRepository: Repository<OAuthAuthorizationCodeEntity>,
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
  ) {}

  /**
   * OAuth 클라이언트 검증
   * @param clientId 클라이언트 ID
   * @returns OAuthClientEntity
   */
  async validateClient(clientId: string): Promise<OAuthClientEntity> {
    const client = await this.oauthClientRepository.findOne({
      where: { clientId, isActive: true },
    });

    if (!client) {
      throw new NotFoundException('등록되지 않은 클라이언트입니다.');
    }

    return client;
  }

  /**
   * Redirect URI 검증
   * @param client OAuth 클라이언트
   * @param redirectUri 요청된 리다이렉트 URI
   */
  validateRedirectUri(client: OAuthClientEntity, redirectUri: string): void {
    if (!client.redirectUris.includes(redirectUri)) {
      throw new BadRequestException('허용되지 않은 redirect_uri입니다.');
    }
  }

  /**
   * Scope 검증
   * @param client OAuth 클라이언트
   * @param requestedScopes 요청된 스코프 배열
   */
  validateScopes(client: OAuthClientEntity, requestedScopes: string[]): void {
    const invalidScopes = requestedScopes.filter(
      (scope) => !client.allowedScopes.includes(scope),
    );

    if (invalidScopes.length > 0) {
      throw new BadRequestException(
        `허용되지 않은 scope: ${invalidScopes.join(', ')}`,
      );
    }
  }

  /**
   * Authorization Code 생성 (10분 유효)
   * @param data Authorization Code 생성 데이터
   * @returns 생성된 Authorization Code
   */
  async generateAuthorizationCode(data: GenerateAuthCodeData): Promise<string> {
    // 1. 클라이언트 검증
    const client = await this.validateClient(data.clientId);

    // 2. Redirect URI 검증
    this.validateRedirectUri(client, data.redirectUri);

    // 3. Scope 검증
    this.validateScopes(client, data.scope);

    // 4. 사용자 존재 확인
    const member = await this.membersService.findOneById(data.memberId);
    if (!member) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 5. Authorization Code 생성 (32바이트 랜덤)
    const code = `AUTH_CODE_${crypto.randomBytes(32).toString('base64url')}`;

    // 6. 만료 시간 설정 (10분)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // 7. DB에 저장
    const authCode = this.authCodeRepository.create({
      code,
      clientId: data.clientId,
      memberId: data.memberId,
      redirectUri: data.redirectUri,
      scope: data.scope,
      codeChallenge: data.codeChallenge || null,
      codeChallengeMethod: data.codeChallengeMethod || null,
      expiresAt,
      isUsed: false,
    });

    await this.authCodeRepository.save(authCode);

    return code;
  }

  /**
   * Authorization Code 검증
   * @param code Authorization Code
   * @returns OAuthAuthorizationCodeEntity
   */
  async validateAuthorizationCode(
    code: string,
  ): Promise<OAuthAuthorizationCodeEntity> {
    const authCode = await this.authCodeRepository.findOne({
      where: { code },
      relations: ['client', 'member'],
    });

    if (!authCode) {
      throw new UnauthorizedException('유효하지 않은 authorization code입니다.');
    }

    // 이미 사용된 코드 확인
    if (authCode.isUsed) {
      throw new UnauthorizedException(
        'Authorization code가 이미 사용되었습니다.',
      );
    }

    // 만료 확인
    if (new Date() > authCode.expiresAt) {
      throw new UnauthorizedException('Authorization code가 만료되었습니다.');
    }

    return authCode;
  }

  /**
   * Authorization Code 사용 처리
   * @param code Authorization Code
   */
  async markCodeAsUsed(code: string): Promise<void> {
    await this.authCodeRepository.update({ code }, { isUsed: true });
  }

  /**
   * PKCE 검증 (S256 방식)
   * @param codeVerifier 클라이언트가 제공한 Code Verifier
   * @param codeChallenge 저장된 Code Challenge
   * @returns 검증 성공 여부
   */
  verifyPKCE(codeVerifier: string, codeChallenge: string): boolean {
    // SHA-256 해시 후 base64url 인코딩
    const hash = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    return hash === codeChallenge;
  }

  /**
   * Access Token 및 Refresh Token 생성
   * @param memberId 사용자 ID
   * @returns { accessToken, refreshToken, tokenExpiry }
   */
  generateTokens(memberId: number) {
    const accessToken = this.jwtService.createAccessToken(memberId);
    const refreshToken = this.jwtService.createRefreshToken(memberId);
    const tokenExpiry = this.jwtService.getTokenExpiryTime();

    return {
      accessToken,
      refreshToken,
      tokenExpiry,
    };
  }

  /**
   * ID Token 생성 (OpenID Connect)
   * @param memberId 사용자 ID
   * @param clientId 클라이언트 ID
   * @returns ID Token (JWT)
   */
  async generateIdToken(memberId: number, clientId: string): Promise<string> {
    const member = await this.membersService.findOneById(memberId);

    if (!member) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // OIDC ID Token payload
    const payload = {
      sub: memberId.toString(), // Subject (사용자 식별자)
      aud: clientId, // Audience (클라이언트 ID)
      iss: 'Hub', // Issuer (발급자)
      iat: Math.floor(Date.now() / 1000), // Issued At
      exp: Math.floor(Date.now() / 1000) + 7200, // Expiration (2시간)
      email: member.email,
      nickname: member.nickname,
      phone: member.phone,
    };

    // ID Token을 커스텀 payload로 서명하여 반환
    return this.jwtService.createIdToken(payload);
  }

  /**
   * 만료된 Authorization Code 정리 (스케줄러에서 호출)
   */
  async cleanupExpiredCodes(): Promise<void> {
    await this.authCodeRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  /**
   * 특정 사용자의 모든 Authorization Codes 삭제 (OAuth 로그아웃)
   * @param memberId 사용자 ID
   */
  async revokeAllCodes(memberId: number): Promise<void> {
    await this.authCodeRepository.delete({ memberId });
  }

  /**
   * 특정 사용자의 특정 클라이언트 Authorization Codes 삭제
   * @param memberId 사용자 ID
   * @param clientId 클라이언트 ID
   */
  async revokeCodesByClient(
    memberId: number,
    clientId: string,
  ): Promise<void> {
    await this.authCodeRepository.delete({ memberId, clientId });
  }

  /**
   * Authorization Code 사용 여부 확인
   * @param memberId 사용자 ID
   * @returns 활성 코드 개수
   */
  async countActiveCodes(memberId: number): Promise<number> {
    return await this.authCodeRepository.count({
      where: {
        memberId,
        isUsed: false,
        expiresAt: LessThan(new Date()),
      },
    });
  }
}
