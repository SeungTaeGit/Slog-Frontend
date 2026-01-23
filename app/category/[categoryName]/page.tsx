import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { Layers } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ categoryName: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.categoryName);

  const postData = await getPosts({ page: 0, size: 10, categoryName: categoryName });
  const posts = postData.content;

  const categories = [
    { name: 'All', count: 12 },
    { name: 'Java / Spring', count: 5 },
    { name: 'Architecture', count: 3 },
    { name: 'AWS / Infra', count: 2 },
    { name: 'Retrospective', count: 2 },
  ];
  const tags = ['Spring Boot', 'JPA', 'Docker', 'Redis'];
  const seriesData = [
     { title: 'Spring Boot Mastery' },
     { title: 'AWS for Beginners' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] pb-20">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

          {/* 사이드바  */}
          <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
            <div className="bg-white/50 backdrop-blur p-6 rounded-2xl border border-white/60">
              <Sidebar activeCategory={categoryName} />
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">
             {/* 헤더 */}
             <div className="flex items-end justify-between mb-8 pb-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="bg-blue-600 p-2 rounded-xl text-white"><Layers size={24}/></span>
                    {categoryName}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 ml-1">
                      Category &middot; <span className="font-bold text-gray-800">{postData.totalElements}</span> posts
                    </p>
                </div>
             </div>

             {/* 게시글 리스트 */}
             <div className="grid gap-8 animate-fadeIn">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-500 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                    아직 이 카테고리에 작성된 글이 없습니다.
                  </div>
                )}
             </div>
          </main>

        </div>
      </div>
    </div>
  );
}