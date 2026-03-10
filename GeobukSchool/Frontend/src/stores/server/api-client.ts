import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from "axios";
import { useAuthStore } from "../client/use-auth-store";
import { BaseResponse } from "./common-interface";

const SPRING_API_URL = import.meta.env.VITE_API_URL_SPRING as string;
const PARSING_API_URL = import.meta.env.VITE_PARSING_API_URL as string;
const NEST_API_URL = import.meta.env.VITE_API_URL_NEST as string;

const parsingApiClient = axios.create({
  baseURL: PARSING_API_URL,
  withCredentials: true,
});

const springApiClient = axios.create({
  baseURL: SPRING_API_URL,
  withCredentials: true,
});

const nestApiClient = axios.create({
  baseURL: NEST_API_URL,
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
    const response: AxiosResponse<BaseResponse<RefreshTokenResponse>> =
      await axios.post(
        `${NEST_API_URL}/auth/refresh`,
        {
          refreshToken,
        },
        {
          withCredentials: true,
        },
      );
    if (!response.data.success) {
      throw new Error("Unable to refresh token");
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      tokenExpiry,
    } = response.data.data;
    setTokens(accessToken, newRefreshToken, tokenExpiry);
    return accessToken;
  } catch (error) {
    clearTokens();
    throw new Error("Unable to refresh token");
  }
};

const authInterceptor = async (
  config: InternalAxiosRequestConfig,
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

parsingApiClient.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error),
);

springApiClient.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error),
);
nestApiClient.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error),
);

export { springApiClient, nestApiClient, parsingApiClient };
