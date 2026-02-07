/**
 * SSO (Single Sign-On) 헬퍼 유틸리티
 * Backend Token Exchange 방식으로 안전하게 구현
 *
 * 보안 향상:
 * - Hub Backend에서 일회용 SSO 코드 생성 (5분 유효)
 * - 코드만 URL에 포함 (토큰 노출 없음)
 * - Susi Backend가 Hub Backend에 코드 검증 및 토큰 교환
 */

import { authClient } from '@/lib/api';
import { hasTokens } from '@/lib/api/token-manager';

/**
 * SSO URL 생성 (Backend Token Exchange 방식)
 * Hub Backend에 일회용 코드를 요청하고 URL에 포함
 *
 * @param baseUrl - 외부 서비스 URL
 * @param targetService - 대상 서비스 식별자 (susi, jungsi 등)
 * @returns SSO 코드가 포함된 URL (비로그인 시 원본 URL 반환)
 */
export async function generateSSOUrl(
  baseUrl: string,
  targetService: string = 'susi'
): Promise<string> {
  // 로그인 확인
  if (!hasTokens()) {
    console.log('❌ SSO URL 생성 실패: 로그인되지 않음');
    return baseUrl;
  }

  try {
    // Hub Backend에 SSO 코드 생성 요청
    const response = await authClient.post('/auth/sso/generate-code', {
      targetService,
    });

    const { code } = response.data.data || response.data;

    console.log(`✅ SSO 코드 생성 성공: ${code.substring(0, 20)}...`);

    // URL에 코드 추가
    const url = new URL(baseUrl);
    url.searchParams.set('sso_code', code);

    return url.toString();
  } catch (error) {
    console.error('❌ SSO 코드 생성 실패:', error);
    return baseUrl; // 실패 시 원본 URL 반환
  }
}

/**
 * SSO 지원 서비스 매핑
 */
const SSO_SERVICE_MAP: Record<string, string> = {
  'http://localhost:3001': 'susi',
  'http://localhost:3002': 'jungsi',
  'http://localhost:3003': 'examhub',
  'http://localhost:3004': 'studyplanner',
  'http://localhost:3005': 'tutorboard',
};

/**
 * SSO 지원 서비스인지 확인하고 서비스 ID 반환
 * @param href - 체크할 URL
 * @returns 서비스 ID 또는 null
 */
export function getSSOServiceId(href: string): string | null {
  // 환경 변수에서 URL 가져오기
  const susiUrl = import.meta.env.VITE_SUSI_URL || 'http://localhost:3001';
  const jungsiUrl = import.meta.env.VITE_JUNGSI_URL || 'http://localhost:3002';
  const myexamUrl = import.meta.env.VITE_MYEXAM_URL || 'http://localhost:3003';
  const studyplannerUrl = import.meta.env.VITE_STUDYPLANNER_URL || 'http://localhost:3004';
  const tutorboardUrl = import.meta.env.VITE_TUTORBOARD_URL || 'http://localhost:3005';

  if (href.startsWith(susiUrl)) return 'susi';
  if (href.startsWith(jungsiUrl)) return 'jungsi';
  if (href.startsWith(myexamUrl)) return 'examhub';
  if (href.startsWith(studyplannerUrl)) return 'studyplanner';
  if (href.startsWith(tutorboardUrl)) return 'tutorboard';

  return null;
}

/**
 * SSO 지원 서비스인지 확인
 * @param href - 체크할 URL
 * @returns SSO 지원 서비스 여부
 */
export function isSSOService(href: string): boolean {
  return getSSOServiceId(href) !== null;
}
