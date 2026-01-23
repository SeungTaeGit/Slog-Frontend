export interface ApiResponse<T> {
  status: 'SUCCESS' | 'FAIL';
  message: string | null;
  data: T;
}

export interface PostResponseDto {
  id: number;
  title: string;
  content: string;
  thumbnailUrl?: string;
  categoryName: string;
  tags: string[];
  seriesName?: string;
  status: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
}

export interface PostSearchCondition {
  page?: number;
  size?: number;
  keyword?: string;
  categoryName?: string;
  tagName?: string;
  seriesName?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}