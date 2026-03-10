import { AxiosError } from 'axios';
import { IErrorResponse } from '../types/response-types';

export const handleApiError = (e: unknown): IErrorResponse => {
  const errorResponse: IErrorResponse = {
    success: false,
    error: 'An unknown error occurred',
  };

  if (e instanceof AxiosError) {
    errorResponse.error = e.response?.data?.message || 'An API error occurred';
  } else if (e instanceof Error) {
    errorResponse.error = e.message;
  }

  // 개발 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    console.error('Formatted Error Response:', errorResponse);
  }

  return errorResponse;
};
