// Generic API response interface
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

// For strongly-typed responses with specific data models
export type ApiSuccessResponse<T> = ApiResponse<T> & {
  data: T;  // Make data required for success responses
  error: undefined;
};

export type ApiErrorResponse = ApiResponse & {
  data: undefined;
  error: string;  // Make error required for error responses
};

// Type guard to check if a response is successful
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.status >= 200 && response.status < 300 && response.data !== undefined;
}

// Type guard to check if a response is an error
export function isErrorResponse(response: ApiResponse): response is ApiErrorResponse {
  return response.status >= 400 || response.error !== undefined;
}
