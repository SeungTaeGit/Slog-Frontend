import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import SearchInput from '@/components/SearchInput';
import { Menu, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default async function Home() {
  const postData = await getPosts({ page: 0, size: 10 });
  const posts = postData.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] pb-20">

      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="bg-white/70 backdrop-blur-xl border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors">
                  <Menu size={24} />
              </button>
              <div className="flex items-center gap-1 cursor-pointer group">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">S</div>
                  <span className="text-xl font-bold text-gray-800 tracking-tight">log.</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors py-2">About</a>
              <a href="#" className="hover:text-blue-600 transition-colors py-2">Portfolio</a>
              <a href="#" className="text-blue-600 font-semibold bg-blue-50/50 px-4 py-1.5 rounded-full transition-colors border border-blue-100/50">Blog</a>
            </div>

            <SearchInput />

            <button className="md:hidden p-2 text-gray-600">
              <Search size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

          <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
              <div className="bg-white/50 backdrop-blur p-6 rounded-2xl border border-white/60">
              <Sidebar
                  categories={[
                      { name: 'All', count: postData.totalElements },
                      { name: 'Java / Spring', count: 5 },
                      { name: 'Architecture', count: 3 },
                      { name: 'AWS / Infra', count: 2 },
                      { name: 'Retrospective', count: 2 },
                  ]}
                  tags={['Spring Boot', 'JPA', 'Docker', 'Redis']}
                  series={[{ title: 'Spring Boot Mastery' }, { title: 'AWS for Beginners' }]}
                  currentCategory="All"
              />
              </div>
          </aside>

          <main className="flex-1 min-w-0">
             <div className="flex items-end justify-between mb-8 pb-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
                    Latest Posts
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 ml-5">
                      Total <span className="font-bold text-gray-800">{postData.totalElements}</span> posts
                    </p>
                </div>
             </div>

             <div className="grid gap-8">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-500 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                    게시글이 아직 없습니다.
                  </div>
                )}
             </div>

             {!postData.last && (
               <div className="mt-24 text-center">
                 <button className="px-8 py-3 bg-white text-gray-600 rounded-full text-sm font-bold shadow-sm hover:shadow-xl hover:text-blue-600 transition-all border border-gray-100">
                   Load more posts
                 </button>
               </div>
             )}
          </main>

        </div>
      </div>
    </div>
  );
}