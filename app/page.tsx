import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import ClientScrollButton from '@/components/ClientScrollButton';
import { TrendingUp, BookOpen, ArrowRight, Github, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

const PopularCard = ({ post, index }: { post: any, index: number }) => {
  const floatAnimation =
    index % 3 === 0 ? 'animate-float-slow' :
    index % 3 === 1 ? 'animate-float-medium' : 'animate-float-fast';

  const positionClass = index % 2 !== 0 ? 'md:-mt-12' : 'mt-0';

  return (
    <Link href={`/posts/${post.id}`} className={`block h-full ${floatAnimation} ${positionClass}`}>
      <div className="w-[260px] md:w-[280px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 dark:border-gray-700/50 shadow-xl dark:shadow-none hover:scale-105 transition-transform duration-300 group cursor-pointer relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={10} /> Top {index + 1}
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 truncate max-w-[80px]">{post.categoryName}</span>
          </div>

          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors h-14">
            {post.title}
          </h4>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Eye size={12}/> {post.views}
            </span>
            <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LatestCard = ({ post }: { post: any }) => {
  return (
    <Link href={`/posts/${post.id}`} className="block h-full">
      <div className="w-[320px] md:w-[340px] bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-md h-full flex flex-col justify-between group">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide">
               New
             </span>
             <span className="text-xs font-medium text-gray-400 dark:text-gray-500 truncate max-w-[180px]">
               {post.categoryName}
             </span>
          </div>
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed h-10 mb-4">
            {post.excerpt || post.content.substring(0, 50)}...
          </p>
        </div>
        <div className="text-xs font-medium text-gray-400 flex items-center gap-1.5 pt-4 border-t border-gray-50 dark:border-gray-700/50">
          <Calendar size={12}/> {post.createdAt ? post.createdAt.split('T')[0] : ''}
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {
  const postData = await getPosts({ page: 0, size: 10 });
  const posts = postData.content;
  const marqueePosts = [...posts, ...posts];

  const popularData = await getPosts({ page: 0, size: 5, sort: 'views,desc' });
  const popularPosts = popularData.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">

      <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-purple-100/40 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60 animate-pulse delay-700"></div>

        <div className="text-center z-10 max-w-4xl px-6 animate-fadeIn">
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">
               Personal Tech Archive
             </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tight leading-tight drop-shadow-sm">
            Invest in Code,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              Recording Every Step.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            안녕하세요, 백엔드 개발자 <strong className="font-semibold text-gray-900 dark:text-white">이승태</strong>입니다.<br/>
            <span className="text-gray-500 dark:text-gray-400">Java & Spring</span> 생태계에서의 경험과 고민, 그리고 성장의 과정을 기록하는 저만의 공간입니다.
            단순한 코드 스니펫을 넘어, <span className="border-b-2 border-blue-200 dark:border-blue-800 pb-0.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">왜(Why)와 어떻게(How)</span>에 대한 깊이 있는 이야기를 담습니다.
          </p>

          <div className="flex justify-center gap-4">
            <a href="https://github.com/SeungTaeGit/Slog" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-7 py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-lg hover:-translate-y-1 text-sm">
              <Github size={18} /> GitHub
            </a>
          </div>
        </div>

        <ClientScrollButton />
      </section>


      <div className="w-full pb-20 relative z-10" id="content">

        <main className="w-full animate-fadeIn space-y-10 pt-20">

            {popularPosts.length > 0 && (
                <section className="max-w-[100vw] overflow-hidden">
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="text-red-500" size={28} /> Popular Posts
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">가장 많은 분들이 읽어주신 글입니다.</p>
                    </div>

                    <div className="flex overflow-x-auto pb-24 px-8 md:px-12 gap-8 no-scrollbar snap-x snap-mandatory min-h-[420px] items-center">
                        {popularPosts.map((post, index) => (
                            <div key={post.id} className="snap-center flex-shrink-0">
                                <PopularCard post={post} index={index} />
                            </div>
                        ))}
                        <div className="w-4 flex-shrink-0"></div>
                    </div>
                </section>
            )}

            <div className="w-full flex justify-center py-10">
               <div className="w-3/5 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
            </div>

            <section className="w-full bg-gradient-to-b from-transparent via-gray-50/50 to-transparent dark:via-gray-900/20 py-20">
                <div className="max-w-7xl mx-auto px-6 mb-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} /> Latest Updates
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">최근 작성된 글들이 실시간으로 흐릅니다.</p>
                    </div>
                    <Link href="/category/All" className="hidden md:flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        View Archive <ArrowRight size={16}/>
                    </Link>
                </div>

                <div className="relative w-full overflow-hidden group">
                    <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50/10 dark:from-gray-900/10 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50/10 dark:from-gray-900/10 to-transparent z-10 pointer-events-none"></div>

                    <div className="flex w-max animate-marquee pause-on-hover py-4">
                        <div className="grid grid-rows-2 grid-flow-col gap-5 px-4">
                            {marqueePosts.map((post, index) => (
                                <div key={`${post.id}-${index}`} className="w-[320px] md:w-[340px]">
                                    <LatestCard post={post} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link href="/category/All" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                        View All Posts <ArrowRight size={16}/>
                    </Link>
                </div>
            </section>

        </main>
      </div>
    </div>
  );
}