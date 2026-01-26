import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import SearchInput from '@/components/SearchInput';
import PostList from '@/components/PostList';
import { Menu, Search, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PopularPostCard = ({ post }: { post: any }) => {
  return (
    <Link href={`/posts/${post.id}`} className="block">
      <div className="w-72 flex-shrink-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60 dark:border-gray-700/50 mr-5 cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-white bg-gradient-to-r from-rose-400 to-orange-400 px-2 py-0.5 rounded-full shadow-sm">HOT</span>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{post.categoryName}</span>
        </div>
        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {post.title}
        </h4>
        <div className="flex items-center text-xs text-gray-400 gap-3 font-medium">
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400"><TrendingUp size={12} className="text-blue-400" /> {post.views}</span>
        </div>
      </div>
    </Link>
  );
};

export default async function Home() {
  const postData = await getPosts({ page: 0, size: 5 });
  const posts = postData.content;

  const popularData = await getPosts({ page: 0, size: 5, sort: 'views,desc' });
  const popularPosts = popularData.content;
  const marqueePosts = [...popularPosts, ...popularPosts];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20 transition-colors duration-300">

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
         <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

            <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
               <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-white/60 dark:border-gray-700/50 transition-colors">
                  <Sidebar activeCategory="" />
               </div>
            </aside>

            <main className="flex-1 min-w-0">
               {/* Hero Section */}
               <section className="mb-16 text-center md:text-left relative">
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/50 dark:border-gray-700/50 transition-colors">
                     <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg flex-shrink-0">
                        <img
                           src="https://via.placeholder.com/150?text=User"
                           alt="Profile"
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Dev_Junior</h1>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                           <span className="font-bold text-blue-600 dark:text-blue-400">Java & Spring</span> 백엔드 개발자입니다.<br/>
                           꾸준함의 힘을 믿으며, 배운 것을 기록합니다.
                        </p>
                        <div className="flex gap-3 justify-center md:justify-start">
                           <a href="#" className="text-xs font-bold bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition">GitHub</a>
                           <a href="#" className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Email</a>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Trending Ticker */}
               {popularPosts.length > 0 && (
                 <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                       <TrendingUp className="text-red-500" size={20} />
                       <h3 className="font-bold text-gray-800 dark:text-gray-200">Popular Posts</h3>
                    </div>
                    <div className="overflow-hidden mask-linear-fade">
                       <div className="flex w-max animate-marquee hover:pause">
                          {marqueePosts.map((post, index) => (
                             <PopularPostCard key={`pop-${index}`} post={post} />
                          ))}
                       </div>
                    </div>
                 </section>
               )}

               {/* Latest Posts */}
               <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                       <BookOpen className="text-blue-600 dark:text-blue-400" size={24}/> Latest Updates
                    </h2>
                    <Link href="/category/All" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                       View All <ArrowRight size={16}/>
                    </Link>
                  </div>

                  <div className="grid gap-8 animate-fadeIn">
                     {posts.length > 0 ? (
                       posts.map(post => <PostCard key={post.id} post={post} />)
                     ) : (
                       <div className="py-20 text-center text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                          게시글이 없습니다.
                       </div>
                     )}
                  </div>

                  <div className="mt-12 text-center">
                    <Link href="/category/All" className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm font-bold shadow-sm hover:shadow-xl hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-gray-100 dark:border-gray-700">
                       All Posts Archive <ArrowRight size={16}/>
                    </Link>
                  </div>
               </div>
            </main>
         </div>
      </div>
    </div>
  );
}