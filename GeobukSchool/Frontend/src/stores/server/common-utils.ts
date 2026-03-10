import { AxiosError } from "axios";
import { BaseResponse } from "./common-interface";
import { nestApiClient } from "./api-client";
import { useMutation } from "@tanstack/react-query";

export const handleApiError = (e: unknown): BaseResponse<any> => {
  console.log("Error 발생 - ", e);
  if (e instanceof AxiosError) {
    return {
      success: false,
      error: e.response?.data?.message || "An error occurred",
    };
  }
  return {
    success: false,
    error: "An error occurred",
  };
};

export const makeApiCall = async <T, R>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  body?: T,
  config?: any,
): Promise<BaseResponse<R>> => {
  try {
    const res = await nestApiClient.request<BaseResponse<R>>({
      url,
      method,
      data: body,
      ...config,
    });
    return res.data;
  } catch (e) {
    return handleApiError(e);
  }
};

export const createMutation = <T, R>(
  method: "POST" | "PATCH" | "DELETE",
  url: string,
  onSuccessCallback?: (data: BaseResponse<R>) => void,
) => {
  return useMutation({
    mutationFn: (body: T) => makeApiCall<T, R>(method, url, body),
    onSuccess: onSuccessCallback,
    onError: (e) => {
      if (e instanceof Error) {
        console.log("예상치 못한 에러 발생", e);
      }
    },
  });
};
