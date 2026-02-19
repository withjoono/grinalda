import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '../common/jwt/jwt.service';
import { MembersService } from '../modules/members/services/members.service';
import * as crypto from 'crypto';

interface GenerateAuthCodeData {
  clientId: string;
  memberId: string;
  redirectUri: string;
  scope: string[];
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

@Injectable()
export class OAuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
  ) { }

  async validateClient(clientId: string) {
    const client = await this.prisma.oAuthClient.findFirst({
      where: { clientId, isActive: true },
    });

    if (!client) {
      throw new NotFoundException('등록되지 않은 클라이언트입니다.');
    }

    return client;
  }

  validateRedirectUri(client: { redirectUris: string[] }, redirectUri: string): void {
    if (!client.redirectUris.includes(redirectUri)) {
      throw new BadRequestException('허용되지 않은 redirect_uri입니다.');
    }
  }

  validateScopes(client: { allowedScopes: string[] }, requestedScopes: string[]): void {
    const invalidScopes = requestedScopes.filter((scope) => !client.allowedScopes.includes(scope));

    if (invalidScopes.length > 0) {
      throw new BadRequestException(`허용되지 않은 scope: ${invalidScopes.join(', ')}`);
    }
  }

  async generateAuthorizationCode(data: GenerateAuthCodeData): Promise<string> {
    const client = await this.validateClient(data.clientId);
    this.validateRedirectUri(client, data.redirectUri);
    this.validateScopes(client, data.scope);

    const member = await this.membersService.findOneById(data.memberId);
    if (!member) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const code = `AUTH_CODE_${crypto.randomBytes(32).toString('base64url')}`;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.prisma.oAuthAuthorizationCode.create({
      data: {
        code,
        clientId: data.clientId,
        memberId: data.memberId,
        redirectUri: data.redirectUri,
        scope: data.scope,
        codeChallenge: data.codeChallenge || null,
        codeChallengeMethod: data.codeChallengeMethod || null,
        expiresAt,
        isUsed: false,
      },
    });

    return code;
  }

  async validateAuthorizationCode(code: string) {
    const authCode = await this.prisma.oAuthAuthorizationCode.findUnique({
      where: { code },
      include: { client: true, member: true },
    });

    if (!authCode) {
      throw new UnauthorizedException('유효하지 않은 authorization code입니다.');
    }

    if (authCode.isUsed) {
      throw new UnauthorizedException('Authorization code가 이미 사용되었습니다.');
    }

    if (new Date() > authCode.expiresAt) {
      throw new UnauthorizedException('Authorization code가 만료되었습니다.');
    }

    return authCode;
  }

  async markCodeAsUsed(code: string): Promise<void> {
    await this.prisma.oAuthAuthorizationCode.update({
      where: { code },
      data: { isUsed: true },
    });
  }

  verifyPKCE(codeVerifier: string, codeChallenge: string): boolean {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    return hash === codeChallenge;
  }

  generateTokens(memberId: string) {
    const accessToken = this.jwtService.createAccessToken(memberId);
    const refreshToken = this.jwtService.createRefreshToken(memberId);
    const tokenExpiry = this.jwtService.getTokenExpiryTime();

    return { accessToken, refreshToken, tokenExpiry };
  }

  async generateIdToken(memberId: string, clientId: string): Promise<string> {
    const member = await this.membersService.findOneById(memberId);

    if (!member) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const payload = {
      sub: memberId,
      aud: clientId,
      iss: 'Hub',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7200,
      email: member.email,
      nickname: member.nickname,
      phone: member.phone,
    };

    return this.jwtService.createIdToken(payload);
  }

  async cleanupExpiredCodes(): Promise<void> {
    await this.prisma.oAuthAuthorizationCode.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  async revokeAllCodes(memberId: string): Promise<void> {
    await this.prisma.oAuthAuthorizationCode.deleteMany({
      where: { memberId },
    });
  }

  async revokeCodesByClient(memberId: string, clientId: string): Promise<void> {
    await this.prisma.oAuthAuthorizationCode.deleteMany({
      where: { memberId, clientId },
    });
  }

  async countActiveCodes(memberId: string): Promise<number> {
    return await this.prisma.oAuthAuthorizationCode.count({
      where: {
        memberId,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }
}
