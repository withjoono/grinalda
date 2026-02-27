import axios, { AxiosInstance } from 'axios';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

const getDomain = () => {
  return process.env.NEXT_PUBLIC_SERVER_DOMAIN;
};

export class Api {
  static instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_DOMAIN || '',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  static init = (session: Session | null) => {
    if (session?.user.accessToken) {
      Api.addToken(session.user.accessToken);
    }
    Api.instance.defaults.baseURL = `${getDomain()}`;

    // 응답 인터셉터 — 글로벌 에러 핸들링
    Api.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';

        if (status === 401) {
          // 인증 만료 → 자동 로그아웃
          toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
          signOut({ callbackUrl: '/login' });
        } else if (status === 403) {
          toast.error('접근 권한이 없습니다.');
        } else if (status >= 500) {
          toast.error(`서버 오류: ${message}`);
        }

        return Promise.reject(error);
      },
    );
  };

  static addToken = (token: string) => {
    localStorage.setItem('token', token);
    Api.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  static removeToken = () => {
    localStorage.removeItem('token');
    delete Api.instance.defaults.headers.common['Authorization'];
  };

  static get = async <T>(url: string, params?: object) => {
    return Api.instance.get<T>(url, { params }).then((res) => res.data);
  };

  static post = async <T>(url: string, body?: object) => {
    return Api.instance.post<T>(url, body).then((res) => res.data);
  };

  static put = async <T>(url: string, body?: object) => {
    return Api.instance.put<T>(url, body).then((res) => res.data);
  };

  static patch = async <T>(url: string, body?: object) => {
    return Api.instance.patch<T>(url, body).then((res) => res.data);
  };

  static delete = async <T>(url: string) => {
    return Api.instance.delete<T>(url).then((res) => res.data);
  };

  static postForm = async <T>(url: string, body?: FormData) => {
    return Api.instance.postForm<T>(url, body).then((res) => res.data);
  };
}
