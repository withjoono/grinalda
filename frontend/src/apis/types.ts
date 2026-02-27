export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError<T = null> extends Error {
  data: T;
  message: string;
}
