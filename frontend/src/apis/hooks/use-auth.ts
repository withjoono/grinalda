import { ApiRoutes } from '@/constants/routes';
import { useMutation } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  termsOfService: boolean;
  privacyPolicy: boolean;
  marketingConsent: boolean;
  grade: number;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupRequest) => {
      return Api.post(toUrl(ApiRoutes.AUTH.REGISTER), data);
    },
    onSuccess: () => {},
  });
};

export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<{
  user: {
    id: number;
    email: string;
    name?: string;
    profileImage?: string;
    role: 'ROLE_USER' | 'ROLE_ADMIN';
  };
  accessToken: string;
  expiresIn: number; // 밀리초
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}${ApiRoutes.AUTH.LOGIN}`,
    {
      method: 'POST',
      body: JSON.stringify({ email: data.email, password: data.password }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '로그인에 실패했습니다.');
  }

  return response.json();
};
