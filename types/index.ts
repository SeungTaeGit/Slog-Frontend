export interface ApiResponse<T> {
  status: 'SUCCESS' | 'FAIL';
  message: string | null;
  data: T;
}

export interface PostResponseDto {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  categoryName: string;
  tags: string[];
  seriesName?: string;
  status: 'PUBLIC' | 'PRIVATE' | 'DRAFT' | 'DELETED';
  views: number;
  createdAt: string;
  comments: number;
}

export interface PostSearchCondition {
  page?: number;
  size?: number;
  keyword?: string;
  categoryName?: string;
  tagName?: string;
  seriesName?: string;
  sort?: string;
  status?: string;
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

export interface CategoryResponseDto {
  id: number;
  name: string;
  count: number;
}

export interface SeriesResponseDto {
  id: number;
  name: string;
  count: number;
}

export interface SidebarDataDto {
  categories: CategoryResponseDto[];
  tags: string[];
  series: SeriesResponseDto[];
}

export interface DashboardStatsDto {
  totalPosts: number;
  totalViews: number;
  todayPosts: number;
  totalCategories: number;
  totalSeries: number;
}

export interface SystemHealthDto {
  status: string;
  details?: any;
}

export interface AdminPostDto extends PostResponseDto {
}

export interface SystemLogDto {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  method: string;
  url: string;
  message: string;
  stackTrace?: string;
  clientIp: string;
  createdAt: string;
}

export interface LogSearchCondition {
  page?: number;
  size?: number;
  level?: string;
}