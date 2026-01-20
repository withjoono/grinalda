import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  Res,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { OAuthService } from './oauth.service';
import { AuthorizeDto } from './dtos/authorize.dto';
import { ConsentDto } from './dtos/consent.dto';
import { TokenDto } from './dtos/token.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentMemberId } from '../auth/decorators/current-member_id.decorator';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '../auth/services/cookie.service';
import { JwtService as CustomJwtService } from '../common/jwt/jwt.service';
import { AllConfigType } from 'src/config/config.type';

@ApiTags('OAuth 2.0 + OIDC')
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly cookieService: CookieService,
    private readonly jwtService: CustomJwtService,
  ) {}

  /**
   * GET /oauth/authorize
   * OAuth Authorization 요청 시작점
   * 1. 클라이언트 검증
   * 2. 로그인 확인
   * 3. 동의 화면으로 리다이렉트
   */
  @Public()
  @Get('authorize')
  @ApiOperation({
    summary: 'OAuth Authorization 요청',
    description:
      'OAuth 2.0 Authorization Code Flow의 시작점. 클라이언트가 사용자 인증을 요청합니다.',
  })
  @ApiResponse({ status: 302, description: '로그인 페이지 또는 동의 화면으로 리다이렉트' })
  @ApiResponse({ status: 400, description: '잘못된 요청 파라미터' })
  async authorize(
    @Query() query: AuthorizeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // 1. 클라이언트 검증
      const client = await this.oauthService.validateClient(query.client_id);

      // 2. Redirect URI 검증
      this.oauthService.validateRedirectUri(client, query.redirect_uri);

      // 3. Scope 검증
      const scopes = query.scope.split(' ');
      this.oauthService.validateScopes(client, scopes);

      // 4. 로그인 확인 (쿠키 또는 Authorization 헤더에서 토큰 추출)
      let memberId: number | null = null;

      try {
        const accessToken = this.cookieService.extractAccessToken(req);
        if (accessToken) {
          const jwtSecret = this.configService.getOrThrow('auth', { infer: true }).secret;
          const memberIdStr = this.jwtService.getMemberIdFromToken(accessToken, jwtSecret);
          memberId = Number(memberIdStr);
        }
      } catch (error) {
        // 토큰이 유효하지 않거나 만료된 경우 로그인 필요
        memberId = null;
      }

      if (!memberId) {
        // 로그인하지 않은 경우 → 프론트엔드 로그인 페이지로 리다이렉트 (현재 URL 저장)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const returnUrl = encodeURIComponent(req.originalUrl);
        return res.redirect(`${frontendUrl}/auth/login?return_url=${returnUrl}`);
      }

      // 5. 동의 화면으로 리다이렉트 (모든 파라미터 전달)
      const consentParams = new URLSearchParams({
        client_id: query.client_id,
        client_name: client.clientName,
        redirect_uri: query.redirect_uri,
        scope: query.scope,
        state: query.state,
        ...(query.code_challenge && { code_challenge: query.code_challenge }),
        ...(query.code_challenge_method && {
          code_challenge_method: query.code_challenge_method,
        }),
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/oauth/consent?${consentParams.toString()}`);
    } catch (error) {
      // 에러 발생 시 클라이언트에 에러 정보 전달
      const errorUrl = new URL(query.redirect_uri);
      errorUrl.searchParams.set('error', 'invalid_request');
      errorUrl.searchParams.set(
        'error_description',
        error.message || 'Unknown error',
      );
      errorUrl.searchParams.set('state', query.state);

      return res.redirect(errorUrl.toString());
    }
  }

  /**
   * POST /oauth/consent
   * 사용자가 동의 화면에서 승인 버튼을 누른 후 호출
   * Authorization Code 생성 및 콜백
   */
  @Post('consent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'OAuth 동의 처리',
    description: '사용자가 권한 요청을 승인하면 Authorization Code를 생성하여 콜백합니다.',
  })
  @ApiResponse({
    status: 302,
    description: '클라이언트 콜백 URL로 리다이렉트 (code + state 포함)',
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async consent(
    @Body() body: ConsentDto,
    @CurrentMemberId() memberId: string,
    @Res() res: Response,
  ) {
    if (!memberId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    try {
      // 1. Authorization Code 생성 (10분 유효)
      const code = await this.oauthService.generateAuthorizationCode({
        clientId: body.client_id,
        memberId: Number(memberId),
        redirectUri: body.redirect_uri,
        scope: body.scope.split(' '), // 문자열을 배열로 변환
        codeChallenge: body.code_challenge,
        codeChallengeMethod: body.code_challenge_method,
      });

      // 2. 클라이언트 콜백 URL로 리다이렉트 (code + state)
      const callbackUrl = new URL(body.redirect_uri);
      callbackUrl.searchParams.set('code', code);
      callbackUrl.searchParams.set('state', body.state);

      return res.redirect(callbackUrl.toString());
    } catch (error) {
      // 에러 발생 시 클라이언트에 에러 정보 전달
      const errorUrl = new URL(body.redirect_uri);
      errorUrl.searchParams.set('error', 'server_error');
      errorUrl.searchParams.set(
        'error_description',
        error.message || 'Unknown error',
      );
      errorUrl.searchParams.set('state', body.state);

      return res.redirect(errorUrl.toString());
    }
  }

  /**
   * POST /oauth/token
   * Authorization Code를 Access Token으로 교환
   * 또는 Refresh Token으로 새 Access Token 발급
   */
  @Public()
  @Post('token')
  @ApiOperation({
    summary: 'OAuth Token 발급',
    description:
      'Authorization Code를 Access Token으로 교환하거나 Refresh Token으로 새 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token 발급 성공',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOi...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOi...' },
        id_token: { type: 'string', example: 'eyJhbGciOi...' },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: { type: 'number', example: 7200 },
      },
    },
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async token(@Body() body: TokenDto) {
    if (body.grant_type === 'authorization_code') {
      // Authorization Code Grant
      if (!body.code) {
        throw new BadRequestException('code가 필요합니다.');
      }

      if (!body.redirect_uri) {
        throw new BadRequestException('redirect_uri가 필요합니다.');
      }

      // 1. Authorization Code 검증
      const authCode =
        await this.oauthService.validateAuthorizationCode(body.code);

      // 2. Client ID 일치 확인
      if (authCode.clientId !== body.client_id) {
        throw new UnauthorizedException('클라이언트 ID가 일치하지 않습니다.');
      }

      // 3. Client Secret 검증 (Confidential Client인 경우)
      if (body.client_secret) {
        const client = await this.oauthService.validateClient(body.client_id);
        if (client.clientSecret !== body.client_secret) {
          throw new UnauthorizedException('클라이언트 Secret이 일치하지 않습니다.');
        }
      }

      // 4. Redirect URI 일치 확인
      if (authCode.redirectUri !== body.redirect_uri) {
        throw new UnauthorizedException('Redirect URI가 일치하지 않습니다.');
      }

      // 5. PKCE 검증 (Code Challenge가 있는 경우)
      if (authCode.codeChallenge) {
        if (!body.code_verifier) {
          throw new BadRequestException('code_verifier가 필요합니다.');
        }

        const isValidPKCE = this.oauthService.verifyPKCE(
          body.code_verifier,
          authCode.codeChallenge,
        );

        if (!isValidPKCE) {
          throw new UnauthorizedException('PKCE 검증에 실패했습니다.');
        }
      }

      // 6. Code를 사용 처리 (재사용 방지)
      await this.oauthService.markCodeAsUsed(body.code);

      // 7. Access Token 및 Refresh Token 생성
      const tokens = this.oauthService.generateTokens(authCode.memberId);

      // 8. ID Token 생성 (OIDC)
      const idToken = await this.oauthService.generateIdToken(
        authCode.memberId,
        body.client_id,
      );

      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        id_token: idToken,
        token_type: 'Bearer',
        expires_in: 7200, // 2시간
      };
    } else if (body.grant_type === 'refresh_token') {
      // Refresh Token Grant
      if (!body.refresh_token) {
        throw new BadRequestException('refresh_token이 필요합니다.');
      }

      // Client ID 검증
      if (!body.client_id) {
        throw new BadRequestException('client_id가 필요합니다.');
      }

      // 클라이언트 검증
      await this.oauthService.validateClient(body.client_id);

      try {
        // Refresh Token에서 memberId 추출
        const jwtSecret = this.configService.getOrThrow('auth', { infer: true }).refreshSecret;
        const memberIdStr = this.jwtService.getMemberIdFromToken(body.refresh_token, jwtSecret);
        const memberId = Number(memberIdStr);

        // 새 토큰 생성
        const tokens = this.oauthService.generateTokens(memberId);

        // ID Token 생성 (OIDC)
        const idToken = await this.oauthService.generateIdToken(memberId, body.client_id);

        return {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          id_token: idToken,
          token_type: 'Bearer',
          expires_in: 7200, // 2시간
        };
      } catch (error) {
        throw new UnauthorizedException('유효하지 않거나 만료된 Refresh Token입니다.');
      }
    } else {
      throw new BadRequestException('지원되지 않는 grant_type입니다.');
    }
  }

  /**
   * POST /oauth/logout
   * OAuth SSO 로그아웃 - 모든 클라이언트에서 사용자 세션 정리
   * Authorization Codes를 삭제하여 SSO 연결된 앱들의 세션을 무효화합니다.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'OAuth SSO 로그아웃',
    description:
      '사용자의 모든 OAuth Authorization Codes를 삭제하여 SSO 연결된 앱들의 세션을 정리합니다. ' +
      '특정 클라이언트만 로그아웃하려면 client_id를 전달하세요.',
  })
  @ApiResponse({
    status: 200,
    description: 'OAuth 로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        revokedCodes: { type: 'number', example: 3 },
        message: { type: 'string', example: 'OAuth 로그아웃이 완료되었습니다.' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패 (JWT 토큰 없음 또는 유효하지 않음)' })
  async logout(
    @CurrentMemberId() memberId: string,
    @Body() body?: { client_id?: string },
  ) {
    const memberIdNum = Number(memberId);

    // 로그아웃 전 활성 코드 수 확인
    const activeCodesCount = await this.oauthService.countActiveCodes(memberIdNum);

    // 특정 클라이언트만 로그아웃
    if (body?.client_id) {
      await this.oauthService.revokeCodesByClient(memberIdNum, body.client_id);
      return {
        success: true,
        revokedCodes: activeCodesCount,
        message: `클라이언트 ${body.client_id}의 OAuth 세션이 삭제되었습니다.`,
      };
    }

    // 모든 클라이언트 로그아웃
    await this.oauthService.revokeAllCodes(memberIdNum);

    return {
      success: true,
      revokedCodes: activeCodesCount,
      message: 'OAuth 로그아웃이 완료되었습니다.',
    };
  }
}
