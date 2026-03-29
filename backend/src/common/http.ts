export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const success = <T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiSuccess<T> => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
});
