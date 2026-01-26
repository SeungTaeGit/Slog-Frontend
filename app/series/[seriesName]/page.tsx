import Link from 'next/link';
import { getPosts } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { List, ArrowLeft, Clock, ArrowRight } from 'lucide-react';

interface SeriesPageProps {
  params: Promise<{ seriesName: string }>;
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const resolvedParams = await params;
  const seriesName = decodeURIComponent(resolvedParams.seriesName);
  const postData = await getPosts({ page: 0, size: 20, seriesName: seriesName, sort: 'createdAt,asc' });
  const posts = postData.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20 transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link href="/" className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors inline-block">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm"><ArrowLeft size={16}/></div>
          Back to list
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
             <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-white/60 dark:border-gray-700/50 transition-colors">
                <Sidebar activeSeries={seriesName} />
             </div>
          </aside>

          <main className="flex-1 min-w-0 animate-fadeIn">
             <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-[2rem] p-8 md:p-10 mb-12 border border-purple-100 dark:border-purple-800/50 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 dark:bg-purple-800/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <List size={12}/> Series
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{postData.totalElements} Posts</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{seriesName}</h2>
                   <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                      이 시리즈는 연재 중인 기술 포스팅 모음입니다. 순서대로 읽어보세요.
                   </p>
                </div>
             </div>

             <div className="relative space-y-8 pl-4 md:pl-8 before:absolute before:left-[27px] md:before:left-[43px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                {posts.length > 0 ? (
                   posts.map((post, index) => (
                      <div key={post.id} className="relative pl-12 group">
                         <div className="absolute left-0 top-6 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-colors z-10 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-300">
                            {index + 1}
                         </div>
                         <Link href={`/posts/${post.id}`} className="block">
                            <article className="bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/60 dark:border-gray-700/50 shadow-sm hover:shadow-lg dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
                               <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                  <div className="flex-1">
                                     <div className="flex items-center gap-3 mb-2 text-xs font-bold uppercase tracking-wider">
                                        <span className="text-purple-600 dark:text-purple-400">Part {index + 1}</span>
                                        <span className="text-gray-300 dark:text-gray-600">•</span>
                                        <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={12}/> {post.createdAt}</span>
                                     </div>
                                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{post.title}</h3>
                                     <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">{post.excerpt || post.content.substring(0, 100)}</p>
                                  </div>
                                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-sm gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                     Read <ArrowRight size={16}/>
                                  </div>
                               </div>
                            </article>
                         </Link>
                      </div>
                   ))
                ) : (
                   <div className="py-20 text-center text-gray-500 dark:text-gray-400 ml-8">아직 이 시리즈에 연재된 글이 없습니다.</div>
                )}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}