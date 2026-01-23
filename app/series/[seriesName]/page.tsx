import Link from 'next/link';
import { getPosts } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { List, ArrowLeft, BookOpen, Clock } from 'lucide-react';

interface SeriesPageProps {
  params: Promise<{ seriesName: string }>;
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const resolvedParams = await params;
  const seriesName = decodeURIComponent(resolvedParams.seriesName);

  const postData = await getPosts({ page: 0, size: 20, seriesName: seriesName });
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors inline-block"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
            <ArrowLeft size={16}/>
          </div>
          Back to list
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

          {/* 사이드바 */}
          <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
             <div className="bg-white/50 backdrop-blur p-6 rounded-2xl border border-white/60">
                <Sidebar
                  categories={categories}
                  tags={tags}
                  series={seriesData}
                  activeCategory=""
                />
             </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0 animate-fadeIn">

             {/* 시리즈 헤더 카드 */}
             <div className="bg-purple-50/50 rounded-[2rem] p-8 md:p-10 mb-12 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <List size={12}/> Series
                      </span>
                      <span className="text-sm text-gray-500">{postData.totalElements} Posts</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{seriesName}</h2>
                   <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                      이 시리즈는 연재 중인 기술 포스팅 모음입니다. <br className="hidden md:block"/>
                      순서대로 읽으면 기술의 흐름을 이해하는 데 도움이 됩니다.
                   </p>
                </div>
             </div>

             <div className="relative space-y-8 pl-4 md:pl-8 before:absolute before:left-[27px] md:before:left-[43px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200">
                {posts.length > 0 ? (
                   posts.map((post, index) => (
                      <div key={post.id} className="relative pl-12 group">
                         <div className="absolute left-0 top-6 w-8 h-8 rounded-full bg-white border-4 border-gray-200 group-hover:border-purple-500 transition-colors z-10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-purple-600">
                            {posts.length - index}
                         </div>

                         {/* 글 카드 */}
                         <Link href={`/posts/${post.id}`} className="block">
                            <article className="bg-white/60 hover:bg-white backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                               <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                  <div className="flex-1">
                                     <div className="flex items-center gap-3 mb-2 text-xs font-bold uppercase tracking-wider">
                                        <span className="text-purple-600">Part {posts.length - index}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-400 flex items-center gap-1"><Clock size={12}/> {post.createdAt}</span>
                                     </div>
                                     <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">{post.title}</h3>
                                     <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt || post.content.substring(0, 100)}</p>
                                  </div>

                                  {/* 읽기 버튼 */}
                                  <div className="flex items-center text-purple-600 font-bold text-sm gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                     Read <ArrowRight size={16}/>
                                  </div>
                               </div>
                            </article>
                         </Link>
                      </div>
                   ))
                ) : (
                   <div className="py-20 text-center text-gray-500 ml-8">
                      아직 이 시리즈에 연재된 글이 없습니다.
                   </div>
                )}
             </div>

          </main>

        </div>
      </div>
    </div>
  );
}