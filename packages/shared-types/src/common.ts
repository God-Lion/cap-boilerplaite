export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
  };
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status: number;
  errors?: Record<string, string[]>; // Field-specific errors
}
