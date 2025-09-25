export interface UPIRecord {
  id: string;
  name: string;
  upiId: string;
  score: number;
  status: 'Safe' | 'Risk';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
