export interface IAuthTokenData {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
