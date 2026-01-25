/**
 * SSO Provider Hook (Hub 전용)
 *
 * Hub에서 독립 앱으로 postMessage를 통해 토큰을 안전하게 전달
 *
 * @description
 * 플로우:
 * 1. 사용자가 외부 서비스 버튼 클릭
 * 2. 새 창(popup)으로 서비스 열기
 * 3. 서비스에서 SSO_TOKEN_REQUEST 메시지 수신
 * 4. postMessage로 토큰 전달 (URL 노출 없음)
 */

import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/client/use-auth-store';
import { getAccessToken, getRefreshToken } from '@/lib/api/token-manager';
import {
  validateToken,
  isAllowedOrigin,
  type SSOPostMessageData,
  type SSOTokens,
} from '@shared/sso-client';

// SSO 지원 서비스 목록
const SSO_SERVICES = [
  import.meta.env.VITE_SUSI_URL || 'http://localhost:3001',
  import.meta.env.VITE_JUNGSI_URL || 'http://localhost:3002',
  import.meta.env.VITE_MYEXAM_URL || 'http://localhost:3003',
  import.meta.env.VITE_STUDYPLANNER_URL || 'http://localhost:3004',
].filter(Boolean);

/**
 * URL이 SSO 지원 서비스인지 확인
 */
export function isSSOService(url: string): boolean {
  return SSO_SERVICES.some(service => url.startsWith(service));
}

/**
 * SSO Provider Hook
 *
 * Hub에서 사용하여 독립 앱에 토큰을 postMessage로 전달
 */
export function useSSOProvider() {
  const { accessToken: storeAccessToken } = useAuthStore();
  const openWindowsRef = useRef<Map<string, Window>>(new Map());

  /**
   * 현재 토큰 가져오기
   */
  const getTokens = useCallback((): SSOTokens | null => {
    const accessToken = getAccessToken() || storeAccessToken;
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    // 토큰 검증
    const validation = validateToken(accessToken);
    if (!validation.isValid) {
      console.warn('[SSO Provider] 토큰이 유효하지 않음:', validation.error);
      return null;
    }

    return {
      accessToken,
      refreshToken,
      tokenExpiry: validation.expiry,
    };
  }, [storeAccessToken]);

  /**
   * postMessage 리스너 - 자식 창에서 토큰 요청 수신
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent<SSOPostMessageData>) => {
      // Origin 검증
      if (!isAllowedOrigin(event.origin)) {
        return;
      }

      const data = event.data;
      if (!data || typeof data !== 'object' || data.type !== 'SSO_TOKEN_REQUEST') {
        return;
      }

      console.log('[SSO Provider] 토큰 요청 수신:', event.origin);

      // 토큰 가져오기
      const tokens = getTokens();
      if (!tokens) {
        console.warn('[SSO Provider] 전달할 토큰 없음');
        // 에러 응답
        event.source?.postMessage(
          {
            type: 'SSO_TOKEN_RESPONSE',
            error: 'NO_TOKENS',
            requestId: data.requestId,
          } as SSOPostMessageData,
          { targetOrigin: event.origin }
        );
        return;
      }

      // 토큰 전달
      console.log('[SSO Provider] 토큰 전달:', event.origin);
      event.source?.postMessage(
        {
          type: 'SSO_TOKEN_RESPONSE',
          tokens,
          requestId: data.requestId,
        } as SSOPostMessageData,
        { targetOrigin: event.origin }
      );
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [getTokens]);

  /**
   * SSO 서비스 열기 (postMessage 방식)
   *
   * @param targetUrl - 대상 서비스 URL
   * @param options - 옵션
   */
  const openSSOService = useCallback(async (
    targetUrl: string,
    options?: {
      /** 새 창 대신 현재 창에서 열기 (토큰은 opener를 통해 전달) */
      samePage?: boolean;
      /** 타임아웃 (ms) */
      timeout?: number;
    }
  ): Promise<Window | null> => {
    const { samePage = false, timeout = 5000 } = options ?? {};

    // SSO 서비스 확인
    if (!isSSOService(targetUrl)) {
      console.log('[SSO Provider] SSO 서비스가 아님, 일반 링크로 이동:', targetUrl);
      if (samePage) {
        window.location.href = targetUrl;
        return null;
      }
      return window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    // 토큰 확인
    const tokens = getTokens();
    if (!tokens) {
      console.log('[SSO Provider] 로그인되지 않음, 일반 링크로 이동');
      if (samePage) {
        window.location.href = targetUrl;
        return null;
      }
      return window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    // 새 창 열기 (postMessage 수신을 위해 opener 참조 유지)
    // noopener를 사용하지 않아야 자식 창에서 opener 접근 가능
    const newWindow = window.open(targetUrl, '_blank');

    if (!newWindow) {
      console.warn('[SSO Provider] 팝업이 차단됨');
      // 팝업 차단 시 URL 파라미터 방식으로 폴백 (보안상 좋지 않지만 대안)
      const { generateSSOUrl } = await import('@/lib/utils/sso-helper');
      window.location.href = generateSSOUrl(targetUrl);
      return null;
    }

    // 열린 창 추적
    const windowId = `${targetUrl}_${Date.now()}`;
    openWindowsRef.current.set(windowId, newWindow);

    // 일정 시간 후 참조 제거
    setTimeout(() => {
      openWindowsRef.current.delete(windowId);
    }, timeout);

    return newWindow;
  }, [getTokens]);

  /**
   * 모든 SSO 서비스에 로그아웃 브로드캐스트
   */
  const broadcastLogout = useCallback(() => {
    const message: SSOPostMessageData = {
      type: 'SSO_LOGOUT',
    };

    // 열린 창들에 로그아웃 메시지 전송
    openWindowsRef.current.forEach((win, key) => {
      try {
        if (!win.closed) {
          const origin = new URL(key.split('_')[0]).origin;
          win.postMessage(message, origin);
        }
      } catch (error) {
        console.warn('[SSO Provider] 로그아웃 브로드캐스트 실패:', error);
      }
    });
  }, []);

  return {
    openSSOService,
    broadcastLogout,
    isSSOService,
    getTokens,
  };
}
