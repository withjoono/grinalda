/**
 * SSO 로그아웃 리스너
 *
 * Hub에서 로그아웃 시 다른 SSO 연결 앱(Susi, StudyPlanner 등)에서
 * 자동으로 로그아웃 처리하기 위한 리스너
 *
 * 사용법:
 * 1. 독립 앱의 root 컴포넌트나 App.tsx에서 import
 * 2. useEffect에서 setupSSOLogoutListener() 호출
 * 3. cleanup 시 반환된 함수 호출
 *
 * @example
 * ```typescript
 * import { setupSSOLogoutListener } from '@/lib/sso-logout-listener';
 *
 * function App() {
 *   useEffect(() => {
 *     const cleanup = setupSSOLogoutListener({
 *       onLogout: () => {
 *         // 앱의 로그아웃 로직 실행
 *         clearTokens();
 *         window.location.href = '/login';
 *       },
 *       allowedOrigins: [
 *         'http://localhost:3000', // Hub 개발 서버
 *         'https://hub.turtleschool.com', // Hub 프로덕션
 *       ],
 *     });
 *
 *     return cleanup;
 *   }, []);
 *
 *   return <YourApp />;
 * }
 * ```
 */

export interface SSOLogoutListenerOptions {
  /**
   * 로그아웃 시 실행할 콜백 함수
   */
  onLogout: () => void;

  /**
   * 허용된 오리진 목록 (보안을 위해 명시적으로 지정)
   */
  allowedOrigins: string[];

  /**
   * 디버그 로그 활성화 여부 (기본: false)
   */
  debug?: boolean;
}

/**
 * SSO 로그아웃 리스너 설정
 * @param options 리스너 옵션
 * @returns cleanup 함수
 */
export function setupSSOLogoutListener(
  options: SSOLogoutListenerOptions,
): () => void {
  const { onLogout, allowedOrigins, debug = false } = options;

  const log = (...args: any[]) => {
    if (debug) {
      console.log('[SSO Logout Listener]', ...args);
    }
  };

  // 1. BroadcastChannel 리스너 (같은 브라우저 내 다른 탭)
  let broadcastChannel: BroadcastChannel | null = null;

  try {
    broadcastChannel = new BroadcastChannel('sso_logout');

    broadcastChannel.onmessage = (event) => {
      log('BroadcastChannel 메시지 수신:', event.data);

      if (event.data?.type === 'SSO_LOGOUT') {
        log('🚪 SSO 로그아웃 감지 (BroadcastChannel)');
        onLogout();
      }
    };

    log('✅ BroadcastChannel 리스너 설정 완료');
  } catch (err) {
    log('⚠️ BroadcastChannel 미지원:', err);
  }

  // 2. postMessage 리스너 (다른 오리진에서 메시지)
  const handleMessage = (event: MessageEvent) => {
    // 보안: 허용된 오리진에서 온 메시지만 처리
    if (!allowedOrigins.includes(event.origin)) {
      log('⚠️ 허용되지 않은 오리진에서 메시지:', event.origin);
      return;
    }

    log('postMessage 수신:', event.data, 'from', event.origin);

    if (event.data?.type === 'SSO_LOGOUT') {
      log('🚪 SSO 로그아웃 감지 (postMessage)');
      onLogout();
    }
  };

  window.addEventListener('message', handleMessage);
  log('✅ postMessage 리스너 설정 완료');

  // 3. localStorage 변경 감지 (다른 탭에서 localStorage 변경 시)
  const handleStorageChange = (event: StorageEvent) => {
    log('Storage 변경 감지:', event.key);

    // accessToken이 삭제되면 로그아웃으로 간주
    if (event.key === 'accessToken' && event.newValue === null) {
      log('🚪 SSO 로그아웃 감지 (localStorage)');
      onLogout();
    }

    // refreshToken이 삭제되면 로그아웃으로 간주
    if (event.key === 'refreshToken' && event.newValue === null) {
      log('🚪 SSO 로그아웃 감지 (localStorage)');
      onLogout();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  log('✅ localStorage 리스너 설정 완료');

  // Cleanup 함수 반환
  return () => {
    log('🧹 SSO 로그아웃 리스너 정리 중...');

    if (broadcastChannel) {
      broadcastChannel.close();
      log('✅ BroadcastChannel 닫힘');
    }

    window.removeEventListener('message', handleMessage);
    log('✅ postMessage 리스너 제거됨');

    window.removeEventListener('storage', handleStorageChange);
    log('✅ localStorage 리스너 제거됨');
  };
}

/**
 * React Hook: SSO 로그아웃 리스너
 *
 * @example
 * ```typescript
 * import { useSSOLogoutListener } from '@/lib/sso-logout-listener';
 *
 * function App() {
 *   useSSOLogoutListener({
 *     onLogout: () => {
 *       clearTokens();
 *       window.location.href = '/login';
 *     },
 *     allowedOrigins: ['http://localhost:3000', 'https://hub.turtleschool.com'],
 *     debug: true,
 *   });
 *
 *   return <YourApp />;
 * }
 * ```
 */
export function useSSOLogoutListener(options: SSOLogoutListenerOptions): void {
  // React useEffect에서 사용하려면 이 함수를 import하여 사용
  // 실제 구현은 각 앱의 환경에 맞게 조정
  if (typeof window === 'undefined') {
    return; // SSR 환경에서는 실행하지 않음
  }

  const cleanup = setupSSOLogoutListener(options);

  // 브라우저 환경이 아니거나 cleanup이 필요한 경우를 대비
  if (typeof window !== 'undefined' && 'addEventListener' in window) {
    window.addEventListener('beforeunload', cleanup);
  }
}

/**
 * 독립 앱에서 사용할 수 있는 완전한 로그아웃 헬퍼 함수
 *
 * @example
 * ```typescript
 * import { performSSOLogout } from '@/lib/sso-logout-listener';
 *
 * function LogoutButton() {
 *   const handleLogout = async () => {
 *     await performSSOLogout({
 *       clearTokens: () => {
 *         localStorage.removeItem('accessToken');
 *         localStorage.removeItem('refreshToken');
 *       },
 *       redirectUrl: '/login',
 *     });
 *   };
 *
 *   return <button onClick={handleLogout}>로그아웃</button>;
 * }
 * ```
 */
export async function performSSOLogout(options: {
  clearTokens: () => void;
  redirectUrl: string;
  notifyHub?: boolean;
  hubApiUrl?: string;
}): Promise<void> {
  const {
    clearTokens,
    redirectUrl,
    notifyHub = false,
    hubApiUrl = 'http://localhost:4001',
  } = options;

  console.log('🚪 [SSO] 로그아웃 시작...');

  // 1. Hub에 로그아웃 알림 (선택사항)
  if (notifyHub) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await fetch(`${hubApiUrl}/oauth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('✅ [SSO] Hub에 로그아웃 알림 완료');
      }
    } catch (err) {
      console.warn('⚠️ [SSO] Hub 로그아웃 알림 실패 (무시하고 진행):', err);
    }
  }

  // 2. 로컬 토큰 삭제
  clearTokens();
  console.log('✅ [SSO] 토큰 삭제 완료');

  // 3. 리다이렉트
  window.location.href = redirectUrl;
}
