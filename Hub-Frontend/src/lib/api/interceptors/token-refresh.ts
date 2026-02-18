/**
 * 토큰 갱신 인터셉터
 * Reference 프로젝트의 단순화된 토큰 갱신 패턴 적용
 */

import axios, { AxiosError } from 'axios';
import { camelizeKeys } from 'humps';
import { env } from '@/lib/config/env';
import {
  clearTokens,
  getRefreshToken,
  setAccessToken,
} from '../token-manager';
import { ERROR_CODES } from '../../errors/error-codes';

/**
 * 토큰 갱신 API 호출
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    // Hub Backend POST /auth/refresh (body에 refreshToken 전달)
    // publicClient 대신 raw axios 사용 (decamelizeKeys가 refreshToken을 refresh_token으로 변환하는 것 방지)
    const response = await axios.post(env.apiUrlNest + '/auth/refresh', {
      refreshToken,
    });

    // Hub API 응답 형식: { data: { accessToken, refreshToken } }
    const data = response.data?.data || response.data;
    const newAccessToken = data?.accessToken;
    if (newAccessToken) {
      setAccessToken(newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return null;
  }
};

/**
 * 로그아웃 처리 (토큰 제거 + 로그인 페이지 이동)
 */
const handleLogout = () => {
  // 인증 페이지(/auth/*)에서는 로그아웃 처리하지 않음
  // 로그인 페이지 접근 시 자동 로그아웃 방지
  if (window.location.pathname.startsWith('/auth/')) {
    return;
  }

  clearTokens();
  window.location.href = '/auth/login';
};

/**
 * 에러 Response 인터셉터 (토큰 갱신 포함)
 * Reference 프로젝트의 에러 처리 패턴 적용
 */
export const authResponseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as any;

  // 에러 응답 데이터를 camelCase로 변환
  if (error.response?.data) {
    error.response.data = camelizeKeys(error.response.data);
  }

  // 401 에러 처리
  if (error.response?.status === 401) {
    const errorData = error.response.data as any;
    const errorCode = errorData?.detailCode;

    // C401: 토큰 만료 → 갱신 시도
    if (errorCode === ERROR_CODES.TOKEN_EXPIRED && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // authClient 대신 직접 axios 사용 (순환 참조 방지)
        return axios.request({
          ...originalRequest,
          headers: { ...originalRequest.headers, Authorization: `Bearer ${newAccessToken}` },
        });
      } else {
        // 갱신 실패 → 로그아웃
        handleLogout();
        return Promise.reject(error);
      }
    }

    // C999: 유효하지 않은 토큰 → 로그아웃
    if (errorCode === ERROR_CODES.INVALID_TOKEN) {
      handleLogout();
      return Promise.reject(error);
    }

    // C5050: 세션 만료 → 로그아웃
    if (errorCode === ERROR_CODES.SESSION_EXPIRED) {
      alert(errorData?.message || '세션이 만료되었습니다.');
      handleLogout();
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
};
