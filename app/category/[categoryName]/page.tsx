import { getPosts } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import PostList from '@/components/PostList';
import { Layers } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ categoryName: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.categoryName);
  const apiCategoryFilter = categoryName === 'All' ? undefined : categoryName;

  const postData = await getPosts({
    page: 0,
    size: 10,
    categoryName: apiCategoryFilter
  });

  const posts = postData.content;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20 transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">

          <aside className="hidden md:block w-64 flex-shrink-0 h-fit sticky top-28">
             <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-white/60 dark:border-gray-700/50 transition-colors">
                <Sidebar activeCategory={categoryName} />
             </div>
          </aside>

          <main className="flex-1 min-w-0">
             <div className="flex items-end justify-between mb-8 pb-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                    <span className="bg-blue-600 p-2 rounded-xl text-white"><Layers size={24}/></span>
                    {categoryName} Posts
                    </h2>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 ml-1">
                      {categoryName === 'All' ? 'Total Archive' : 'Category'} &middot; <span className="font-bold text-gray-800 dark:text-gray-200">{postData.totalElements}</span> posts
                    </p>
                </div>
             </div>

             <PostList
                initialPosts={posts}
                totalElements={postData.totalElements}
                categoryName={apiCategoryFilter}
             />
          </main>

        </div>
      </div>
    </div>
  );
}