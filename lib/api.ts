import {
  ApiResponse,
  PageResponse,
  PostResponseDto,
  PostSearchCondition,
  SidebarDataDto,
  DashboardStatsDto,
  CreatePostRequestDto,
  UpdatePostRequestDto
} from '@/types';

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

// 1. 게시글 목록 조회
export async function getPosts(condition: PostSearchCondition): Promise<PageResponse<PostResponseDto>> {
  try {
    const queryString = createQueryString(condition);
    const res = await fetch(`${BASE_URL}/posts?${queryString}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
        console.error(`API Error (getPosts): ${res.status}`);
        return mockData();
    }

    const response: ApiResponse<PageResponse<PostResponseDto>> = await res.json();
    return response.data || mockData();
  } catch (error) {
    console.error('API Error:', error);
    return mockData();
  }
}

// 2. 게시글 상세 조회 (안전장치 강화)
export async function getPostDetail(id: number, cookieHeaders?: string): Promise<PostResponseDto> {
  try {
    const headers: HeadersInit = {};
    if (cookieHeaders) {
      headers['Cookie'] = cookieHeaders;
    }

    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      cache: 'no-store',
      headers: headers,
    });

    if (!res.ok) {
        console.error(`❌ 상세 조회 API 에러 (Status: ${res.status})`);
        // 에러 시 404를 띄우지 않고 더미 데이터를 보여줘서 확인 가능하게 함
        return mockData().content[0];
    }

    const response: ApiResponse<PostResponseDto> = await res.json();

    // 데이터가 없으면 더미 데이터 반환
    if (!response.data) {
        console.error(`❌ 상세 조회 데이터 없음 (ID: ${id})`);
        return mockData().content[0];
    }

    return response.data;
  } catch (error) {
    console.error('❌ 상세 조회 네트워크 오류:', error);
    return mockData().content[0];
  }
}

// 3. 게시글 작성
export async function createPost(data: CreatePostRequestDto, token: string = ''): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create post: ${res.status} ${errorText}`);
  }
}

// 4. 게시글 수정
export async function updatePost(id: number, data: UpdatePostRequestDto, token: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update post');
}

// 5. 게시글 삭제
export async function deletePost(id: number, token: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete post');
}

// 6. 사이드바 데이터 조회
export async function getSidebarData(): Promise<SidebarDataDto> {
  try {
    const [categoriesRes, tagsRes, seriesRes] = await Promise.all([
      fetch(`${BASE_URL}/categories`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/tags`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/series`, { cache: 'no-store' }),
    ]);

    // 하나라도 실패하면 더미 데이터 반환
    if (!categoriesRes.ok || !tagsRes.ok || !seriesRes.ok) {
       throw new Error('API Response Not OK');
    }

    const categoriesData = await categoriesRes.json();
    const tagsData = await tagsRes.json();
    const seriesData = await seriesRes.json();

    return {
      categories: categoriesData.data || [],
      tags: tagsData.data || [],
      series: seriesData.data || [],
    };
  } catch (error) {
    console.error('Sidebar API Error (Using Mock):', error);
    return {
      categories: [
        { id: 1, name: 'All', count: 12 },
        { id: 2, name: 'Java / Spring', count: 5 },
      ],
      tags: ['Spring Boot', 'JPA', 'Docker'],
      series: [{ id: 1, name: 'Spring Boot Mastery', count: 3 }]
    };
  }
}

// 7. 대시보드 통계 조회
export async function getDashboardStats(token: string): Promise<DashboardStatsDto> {
  const res = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  const response: ApiResponse<DashboardStatsDto> = await res.json();
  return response.data;
}

// 8. 시스템 헬스 체크
export async function getSystemHealth(token?: string): Promise<string> {
  try {
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    const res = await fetch('http://localhost:8080/actuator/health', {
      headers,
      cache: 'no-store'
    });

    if (!res.ok) return 'DOWN';
    const data = await res.json();
    return data.status;
  } catch (e) {
    return 'DOWN';
  }
}

// 9. 관리자: 게시글 전체 조회
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

// 10. 관리자: 게시글 상태 변경
export async function updatePostStatus(id: number, status: 'PUBLIC' | 'PRIVATE', token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to update post status');
}

// 11. 관리자: 게시글 복구
export async function restorePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/restore`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to restore post');
}

// 12. 관리자: 게시글 영구 삭제
export async function hardDeletePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/hard`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to hard delete post');
}

// 13. 관리자: 휴지통 보내기 (Soft Delete)
export async function softDeletePost(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to soft delete post');
}

// 14. 관리자: 카테고리 이름 수정
export async function updateCategory(id: number, newName: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error('Failed to update category');
}

// 15. 관리자: 카테고리 삭제
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

// 16. 관리자: 시리즈 이름 수정
export async function updateSeries(id: number, newName: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/series/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ newName }),
  });
  if (!res.ok) throw new Error('Failed to update series');
}

// 17. 관리자: 시리즈 삭제
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

// 18. 시스템 로그 조회
export async function getSystemLogs(condition: any, token: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('page', String(condition.page || 0));
    params.append('size', String(condition.size || 15));
    if (condition.level && condition.level !== 'ALL') {
      params.append('level', condition.level);
    }

    const res = await fetch(`${BASE_URL}/admin/logs?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch system logs');
    const response = await res.json();
    return response.data;
}

// 더미 데이터
function mockData(): PageResponse<PostResponseDto> {
  return {
    content: [
      {
        id: 1,
        title: '[Connection Error] 백엔드 연결 실패',
        excerpt: '백엔드 API 호출에 실패했습니다. 서버가 켜져있는지 확인해주세요.',
        content: '### 문제 해결 방법\n\n1. 백엔드 서버(Port 8080)가 실행 중인지 확인하세요.\n2. 백엔드 로그에 에러(500, 400 등)가 찍히는지 확인하세요.\n3. CORS 설정이나 쿠키 관련 로직을 점검하세요.',
        categoryName: 'Error Log',
        tags: ['Error', 'Check Server'],
        status: 'PUBLIC',
        views: 0,
        createdAt: new Date().toISOString(),
        comments: 0
      }
    ],
    pageable: { pageNumber: 0, pageSize: 10 },
    totalPages: 1,
    totalElements: 1,
    last: true,
    size: 10,
    number: 0
  };
}