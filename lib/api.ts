import { ApiResponse, PageResponse, PostResponseDto, PostSearchCondition, SidebarDataDto } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

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

    if (!res.ok) return mockData();

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
    console.error('API Error:', error);
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

export async function createPost(data: CreatePostRequestDto, token: string = ''): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create post');
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