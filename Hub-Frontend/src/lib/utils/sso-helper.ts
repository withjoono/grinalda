/**
 * SSO (Single Sign-On) 헬퍼 유틸리티
 * 외부 서비스로 이동할 때 토큰을 URL에 포함시켜 자동 로그인 지원
 *
 * ⚠️ 보안 주의사항:
 * - URL 파라미터의 토큰은 브라우저 히스토리, Referrer, 프록시 로그에 노출될 수 있음
 * - 토큰은 수신 측에서 즉시 URL에서 제거해야 함
 * - 가능하면 postMessage 방식 사용 권장 (@shared/sso-client 라이브러리)
 */

import { getAccessToken, getRefreshToken, setTokens } from '@/lib/api/token-manager';
import { useTokenStore } from '@/stores/atoms/tokens';
import { useAuthStore } from '@/stores/client/use-auth-store';
// 공유 SSO 라이브러리 사용
import { isValidJwtFormat, validateToken } from '@shared/sso-client';

// 내부용 래퍼 (만료된 토큰 체크 포함)
function getTokenExpiry(token: string): number | null {
  const validation = validateToken(token);
  if (!validation.isValid) {
    console.warn(`⚠️ 토큰 검증 실패: ${validation.error}`);
    return null;
  }
  return validation.expiry ?? null;
}

/**
 * SSO URL 생성
 * 현재 사용자의 토큰을 URL 파라미터에 추가하여 외부 서비스에서 자동 로그인 가능하게 함
 *
 * ⚠️ 보안 경고: URL에 토큰을 포함하면 히스토리/로그에 노출될 수 있습니다.
 *
 * @param baseUrl - 외부 서비스 URL
 * @returns 토큰이 포함된 SSO URL (비로그인 시 원본 URL 반환)
 */
export function generateSSOUrl(baseUrl: string): string {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    // 로그인되지 않은 경우 토큰 없이 그대로 반환
    return baseUrl;
  }

  // 토큰 유효성 검증
  if (!isValidJwtFormat(accessToken)) {
    console.error('❌ SSO: 유효하지 않은 Access Token 형식');
    return baseUrl;
  }

  // 토큰 만료 확인
  const expiry = getTokenExpiry(accessToken);
  if (expiry === null) {
    console.error('❌ SSO: 토큰이 만료되었거나 유효하지 않음');
    return baseUrl;
  }

  const url = new URL(baseUrl);
  url.searchParams.set('sso_access_token', accessToken);
  url.searchParams.set('sso_refresh_token', refreshToken);

  return url.toString();
}

/**
 * SSO 지원 서비스인지 확인
 * @param href - 체크할 URL
 * @returns SSO 지원 서비스 여부
 */
export function isSSOService(href: string): boolean {
  // 환경변수가 없을 경우 기본값 사용
  const ssoServices = [
    import.meta.env.VITE_SUSI_URL || 'http://localhost:3001',
    import.meta.env.VITE_JUNGSI_URL || 'http://localhost:3002',
    import.meta.env.VITE_MYEXAM_URL || 'http://localhost:3003',
    import.meta.env.VITE_STUDYPLANNER_URL || 'http://localhost:3004',
  ].filter(Boolean);

  return ssoServices.some((service) => href.startsWith(service));
}

/**
 * URL 파라미터에서 SSO 토큰을 추출하고 자동 로그인 처리
 * Hub나 다른 서비스에서 SSO로 접근할 때 사용
 *
 * @returns 성공 여부
 */
export function processSSOLogin(): boolean {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ssoAccessToken = urlParams.get('sso_access_token');
    const ssoRefreshToken = urlParams.get('sso_refresh_token');

    // SSO 토큰이 없으면 처리하지 않음
    if (!ssoAccessToken || !ssoRefreshToken) {
      return false;
    }

    console.log('🔐 SSO 토큰 발견 - 자동 로그인 처리 중...');

    // 보안: URL에서 토큰 즉시 제거 (히스토리에 남지 않도록)
    urlParams.delete('sso_access_token');
    urlParams.delete('sso_refresh_token');

    const newUrl = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);

    // 토큰 형식 검증
    if (!isValidJwtFormat(ssoAccessToken)) {
      console.error('❌ SSO: 유효하지 않은 Access Token 형식');
      return false;
    }

    // JWT에서 만료 시간 추출 및 검증
    const tokenExpiry = getTokenExpiry(ssoAccessToken);
    if (tokenExpiry === null) {
      console.error('❌ SSO: 토큰이 만료되었거나 유효하지 않음');
      return false;
    }

    // token-manager에만 저장 (single source of truth)
    // Zustand 스토어들은 token-manager를 감싸는 역할
    setTokens(ssoAccessToken, ssoRefreshToken);

    // Zustand 스토어 동기화 (UI 반응성을 위해)
    useTokenStore.getState().setTokens(ssoAccessToken, ssoRefreshToken);
    useAuthStore.getState().setTokens(ssoAccessToken, ssoRefreshToken, tokenExpiry);

    console.log('✅ SSO 자동 로그인 성공');
    return true;
  } catch (error) {
    // 에러 발생 시에도 URL에서 토큰 제거 시도
    try {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete('sso_access_token');
      urlParams.delete('sso_refresh_token');
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } catch {
      // 무시
    }

    console.error('❌ SSO 로그인 처리 실패:', error);
    return false;
  }
}
