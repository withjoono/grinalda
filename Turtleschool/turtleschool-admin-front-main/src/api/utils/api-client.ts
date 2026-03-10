import axios, { InternalAxiosRequestConfig, AxiosHeaders, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { IBaseAPIResponse } from '../types/response-types';
import { IAuthTokenData } from '../types/auth-types';
import { handleApiError } from './common-utils';
import { isTokenExpired } from './auth-utils';

// const SPRING_API_URL = import.meta.env.VITE_API_URL_SPRING as string;
const NEST_API_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!NEST_API_URL) {
  throw new Error('API URLs are not properly configured in environment variables');
}

export const refreshTokenApi = async (
  refreshToken: string
): Promise<IBaseAPIResponse<IAuthTokenData>> => {
  try {
    const response = await axios.post<IBaseAPIResponse<IAuthTokenData>>(
      `${NEST_API_URL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    return handleApiError(e);
  }
};

const refreshToken = async (): Promise<string | never> => {
  const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
  try {
    if (!refreshToken) return '';
    const response = await refreshTokenApi(refreshToken);

    if (!response.success) {
      throw new Error('Unable to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken, tokenExpiry } = response.data;
    setTokens(accessToken, newRefreshToken, tokenExpiry);
    return accessToken;
  } catch (error) {
    clearTokens();
    const handledError = handleApiError(error);
    throw new Error(`Unable to refresh token: ${handledError.error}`);
  }
};

const authInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const { accessToken, tokenExpiry } = useAuthStore.getState();

  if (isTokenExpired(tokenExpiry)) {
    try {
      const newAccessToken = await refreshToken();
      config.headers = new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${newAccessToken}`,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  } else if (accessToken) {
    config.headers = new AxiosHeaders({
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    });
  }
  return config;
};

const errorInterceptor = (error: AxiosError) => {
  if (import.meta.env.DEV) {
    console.error('API Error:', error);
  }
  return Promise.reject(error);
};

const createApiClient = (baseURL: string) => {
  const client = axios.create({ baseURL, withCredentials: true });
  client.interceptors.request.use(authInterceptor, errorInterceptor);
  client.interceptors.response.use((response) => response, errorInterceptor);
  return client;
};

const nestApiClient = createApiClient(NEST_API_URL);

export { nestApiClient };
