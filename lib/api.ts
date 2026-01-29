import { ApiResponse, PageResponse, PostResponseDto, PostSearchCondition, SidebarDataDto, DashboardStatsDto } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface PostSearchCondition {
  page?: number;
  size?: number;
  keyword?: string;
  categoryName?: string;
  tagName?: string;
  seriesName?: string;
  sort?: string;
}

const createQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      searchParams.append(key, String(params[key]));
    }
  });
  return searchParams.toString();
};

export async function getPosts(condition: PostSearchCondition): Promise<PageResponse<PostResponseDto>> {
  try {
    const queryString = createQueryString(condition);
    const res = await fetch(`${BASE_URL}/posts?${queryString}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
        console.error(`API Error: ${res.status} ${res.statusText}`);
        return mockData();
    }

    const response: ApiResponse<PageResponse<PostResponseDto>> = await res.json();
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return mockData();
  }
}

export async function getPostDetail(id: number): Promise<PostResponseDto> {
  try {
    const res = await fetch(`${BASE_URL}/posts/${id}`, { cache: 'no-store' });
    if (!res.ok) return mockData().content[0];
    const response: ApiResponse<PostResponseDto> = await res.json();
    return response.data;
  } catch (error) {
    return mockData().content[0];
  }
}

export interface CreatePostRequestDto {
  title: string;
  content: string;
  categoryName: string;
  tags: string[];
  seriesName?: string;
  status: 'PUBLIC' | 'PRIVATE';
}

export interface UpdatePostRequestDto {
    title?: string;
    content?: string;
    categoryName?: string;
    tags?: string[];
    seriesName?: string;
    status?: 'PUBLIC' | 'PRIVATE';
}

export async function getDashboardStats(token: string): Promise<DashboardStatsDto> {
  const res = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  const response: ApiResponse<DashboardStatsDto> = await res.json();
  return response.data;
}

export async function getSystemHealth(token: string): Promise<string> {
  try {
    const res = await fetch('http://localhost:8080/actuator/health', {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) return 'DOWN';
    const data = await res.json();
    return data.status;
  } catch (e) {
    return 'DOWN';
  }
}

export async function getAdminPosts(token: string, page: number, status?: string, keyword?: string): Promise<PageResponse<PostResponseDto>> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('size', '10');
  if (status) params.append('status', status);
  if (keyword) params.append('keyword', keyword);

  const res = await fetch(`${BASE_URL}/admin/posts?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Failed to fetch admin posts');
  const response = await res.json();
  return response.data;
}

export async function createPost(data: CreatePostRequestDto, token: string = ''): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
}

export async function updatePost(id: number, data: UpdatePostRequestDto, token: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update post');
}

export async function deletePost(id: number, token: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete post');
}

export async function updateCategory(id: number, newName: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error('Failed to update category');
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete category');
  }
}

export async function updateSeries(id: number, newName: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/series/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error('Failed to update series');
}

export async function deleteSeries(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/series/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete series');
  }
}

export async function getSidebarData(): Promise<SidebarDataDto> {
  try {
    const [categoriesRes, tagsRes, seriesRes] = await Promise.all([
      fetch(`${BASE_URL}/categories`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/tags`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/series`, { cache: 'no-store' }),
    ]);

    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { data: [] };
    const tagsData = tagsRes.ok ? await tagsRes.json() : { data: [] };
    const seriesData = seriesRes.ok ? await seriesRes.json() : { data: [] };

    return {
      categories: categoriesData.data || [],
      tags: tagsData.data || [],
      series: seriesData.data || [],
    };
  } catch (error) {
    return { categories: [], tags: [], series: [] };
  }
}

function mockData(): PageResponse<PostResponseDto> {
  return {
    content: [],
    pageable: { pageNumber: 0, pageSize: 10 },
    totalPages: 0,
    totalElements: 0,
    last: true,
    size: 10,
    number: 0
  };
}

export async function updatePostStatus(id: number, status: 'PUBLIC' | 'PRIVATE', token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to update post status');
}

export async function restorePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/restore`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to restore post');
}

export async function hardDeletePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/hard`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to hard delete post');
}

export async function softDeletePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to soft delete post');
}