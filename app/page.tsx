import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import ClientScrollButton from '@/components/ClientScrollButton';
import { TrendingUp, BookOpen, ArrowRight, Github, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

const TickerCard = ({ post }: { post: any }) => {
  return (
    <Link href={`/posts/${post.id}`} className="block h-full">
      <div className="w-[300px] md:w-[350px] bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg dark:shadow-none hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group cursor-pointer">

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={10} /> Trending
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{post.categoryName}</span>
          </div>

          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt || post.content.substring(0, 50)}...
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={12}/> {post.createdAt}
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
            Read <ArrowRight size={12}/>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {
  const postData = await getPosts({ page: 0, size: 6 });
  const posts = postData.content;

  const popularData = await getPosts({ page: 0, size: 5, sort: 'views,desc' });
  const popularPosts = popularData.content;

  const marqueePosts = [...popularPosts, ...popularPosts, ...popularPosts];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">

      {/* Intro Section */}
      <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-purple-100/40 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60 animate-pulse delay-700"></div>

        <div className="text-center z-10 max-w-3xl px-6 animate-fadeIn">
          <div className="mb-6 inline-block">
             <span className="px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-bold tracking-wider">
               BACKEND DEVELOPER
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            안녕하세요,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dev_Junior</span> 입니다.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-10">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Java & Spring</span>을 주력으로 하는 백엔드 개발자입니다.<br className="hidden md:block"/>
            단순한 코드 작성을 넘어, <span className="underline decoration-blue-200 dark:decoration-blue-800 decoration-4 underline-offset-4">비즈니스 가치를 창출하는 아키텍처</span>를 고민합니다.
          </p>

          <div className="flex justify-center gap-4">
            <a href="https://github.com" className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition shadow-lg hover:-translate-y-1">
              <Github size={20} /> GitHub
            </a>
            <a href="mailto:email@example.com" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-lg hover:-translate-y-1">
              <Mail size={20} /> Contact Me
            </a>
          </div>
        </div>

        <ClientScrollButton />
      </section>


      {/* Content Section */}
      <div className="max-w-[100vw] overflow-hidden pb-20 relative z-10" id="content">

        {/* Title */}
        <div className="mb-12 text-center pt-20 px-4">
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
             <BookOpen className="text-blue-600 dark:text-blue-400" /> Recent Archive
           </h2>
           <p className="text-gray-500 dark:text-gray-400 mt-2">최근 학습하고 정리한 기록들입니다.</p>
        </div>

        <main className="w-full animate-fadeIn">

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
                <section className="mb-24 w-full">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <TrendingUp className="text-red-500" size={20} />
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest text-sm">Trending Now</h3>
                    </div>

                    <div className="relative w-full overflow-hidden group">
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#F8F9FF] dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#F8F9FF] dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>

                        <div className="flex gap-6 w-max animate-marquee pause-on-hover px-4">
                            {marqueePosts.map((post, index) => (
                                <div key={`${post.id}-${index}`} className="flex-shrink-0">
                                    <TickerCard post={post} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Posts */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Latest Updates</h2>
                    <Link href="/category/All" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                        View All Posts <ArrowRight size={16}/>
                    </Link>
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                    {posts.length > 0 ? (
                        posts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                            게시글이 없습니다.
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/category/All" className="inline-flex items-center gap-2 px-10 py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full font-bold shadow-lg hover:shadow-xl hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                        Go to Archive <ArrowRight size={18}/>
                    </Link>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}