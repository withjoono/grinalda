import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from '@/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { BaseResponse } from './types/base-response';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
}

const refreshToken = async (): Promise<string> => {
  const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
  try {
    const response: AxiosResponse<BaseResponse<RefreshTokenResponse>> = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {
        refreshToken,
      },
      {
        withCredentials: true,
      }
    );
    if (!response.data.success) {
      throw new Error('Unable to refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken, tokenExpiry } = response.data.data;
    setTokens(accessToken, newRefreshToken, tokenExpiry);
    return accessToken;
  } catch (error) {
    clearTokens();
    throw new Error('Unable to refresh token');
  }
};

const authInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const { accessToken, tokenExpiry } = useAuthStore.getState();
  const currentTime = Math.floor(Date.now() / 1000);

  if (tokenExpiry && tokenExpiry < currentTime) {
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

axiosInstance.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));

export const request = async <T>(options: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance(options);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'API request failed');
    }
    throw new Error('API request failed');
  }
};

export const requestFile = async <T>(url: string, formData: FormData): Promise<T> => {
  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'File upload failed');
    }
    throw new Error('File upload failed');
  }
};

export const requestGet = async <T>(url: string): Promise<T> => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Get request failed');
    }
    throw new Error('Get request failed');
  }
};
