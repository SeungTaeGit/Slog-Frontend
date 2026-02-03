import Link from 'next/link';
import { getPostDetail } from '@/lib/api';
import { ArrowLeft, Calendar, TrendingUp, Layers, Heart, Share2 } from 'lucide-react';
import AdminButtons from '@/components/AdminButtons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import TableOfContents from '@/components/TableOfContents';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const post = await getPostDetail(id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const thumbnail = post.thumbnailUrl || 'https://via.placeholder.com/1200x630?text=Slog+Tech+Blog';

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 100),
      images: [{ url: thumbnail, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  const post = await getPostDetail(Number(resolvedParams.id), cookieHeader);
  const generateId = (text: string) => text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-');

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F1F5FF] to-[#FFFFFF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 animate-fadeIn">
        <BackButton />

        <div className="flex flex-col xl:flex-row gap-10 items-start">
          <article className="flex-1 w-full min-w-0 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl dark:shadow-none border border-white/60 dark:border-gray-700/50 relative overflow-hidden transition-colors">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 dark:bg-blue-900/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

             <header className="relative z-10 mb-10 border-b border-gray-100 dark:border-gray-700 pb-10">
               <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs font-bold flex items-center gap-1">
                    <Layers size={12}/> {post.categoryName}
                  </span>
               </div>

               <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 leading-tight">
                 {post.title}
               </h1>

               <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-gray-500 dark:text-gray-400">
                 <div className="flex items-center gap-6">
                   <span className="font-bold text-gray-700 dark:text-gray-300">Dev_Junior</span>
                   <span className="flex items-center gap-1.5"><Calendar size={15}/> {post.createdAt}</span>
                   <span className="flex items-center gap-1.5"><TrendingUp size={15}/> {post.views} views</span>
                 </div>

                 <div className="flex items-center gap-2">
                   <AdminButtons postId={post.id} />
                   <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                   <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Heart size={20}/></button>
                   <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><Share2 size={20}/></button>
                 </div>
               </div>
             </header>

             <div className="prose max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line relative z-10">
               <ReactMarkdown
                 components={{
                   h1: ({node, children, ...props}) => <h1 id={generateId(String(children))} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2 scroll-mt-32" {...props}>{children}</h1>,
                   h2: ({node, children, ...props}) => <h2 id={generateId(String(children))} className="text-2xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-200 scroll-mt-32" {...props}>{children}</h2>,
                   h3: ({node, children, ...props}) => <h3 id={generateId(String(children))} className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200 scroll-mt-32" {...props}>{children}</h3>,
                   ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-400" {...props} />,
                   ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-gray-600 dark:text-gray-400" {...props} />,
                   li: ({node, ...props}) => <li className="mb-1" {...props} />,
                   blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 italic" {...props} />,
                   code({ node, inline, className, children, ...props }: any) {
                     const match = /language-(\w+)/.exec(className || '');
                     return !inline && match ? (
                       <SyntaxHighlighter
                         style={vscDarkPlus}
                         language={match[1]}
                         PreTag="div"
                         className="rounded-xl shadow-md my-6 text-sm"
                         {...props}
                       >
                         {String(children).replace(/\n$/, '')}
                       </SyntaxHighlighter>
                     ) : (
                       <code className="bg-gray-100 dark:bg-gray-700 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                         {children}
                       </code>
                     );
                   },
                   p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300" {...props} />,
                   a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
                   img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg my-4 shadow-sm" {...props} />,
                 }}
               >
                 {post.content}
               </ReactMarkdown>
             </div>

             <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
               <div className="flex flex-wrap gap-2">
                 {post.tags.map((tag) => (
                   <span key={tag} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer">
                     #{tag}
                   </span>
                 ))}
               </div>
             </div>
          </article>

          <TableOfContents content={post.content} />
        </div>
      </div>
    </div>
  );
}