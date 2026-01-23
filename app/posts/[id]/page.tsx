import Link from 'next/link';
import { getPostDetail } from '@/lib/api';
import { ArrowLeft, Calendar, TrendingUp, Layers, Heart, Share2 } from 'lucide-react';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = await params;
  const post = await getPostDetail(Number(resolvedParams.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] pb-20">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors inline-block"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
            <ArrowLeft size={16}/>
          </div>
          Back to list
        </Link>

        <article className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/60 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

           <header className="relative z-10 mb-10 border-b border-gray-100 pb-10">
             <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex items-center gap-1">
                  <Layers size={12}/> {post.categoryName}
                </span>
             </div>

             <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
               {post.title}
             </h1>

             <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-gray-500">
               <div className="flex items-center gap-6">
                 <span className="font-bold text-gray-700">Dev_Junior</span>
                 <span className="flex items-center gap-1.5"><Calendar size={15}/> {post.createdAt}</span>
                 <span className="flex items-center gap-1.5"><TrendingUp size={15}/> {post.views} views</span>
               </div>
               <div className="flex gap-2">
                 <button className="p-2 rounded-full hover:bg-gray-100"><Heart size={20}/></button>
                 <button className="p-2 rounded-full hover:bg-gray-100"><Share2 size={20}/></button>
               </div>
             </div>
           </header>

           <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line relative z-10">
             {post.content}
           </div>

           <div className="mt-12 pt-8 border-t border-gray-100">
             <div className="flex flex-wrap gap-2">
               {post.tags.map((tag) => (
                 <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                   #{tag}
                 </span>
               ))}
             </div>
           </div>
        </article>
      </div>
    </div>
  );
}