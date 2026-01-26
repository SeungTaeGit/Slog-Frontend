"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { createPost, updatePost, getPostDetail } from '@/lib/api';
import { ArrowLeft, Save, Layers, Tag, List, Eye, Edit3 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function WriteEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form, setForm] = useState({
    title: '',
    categoryName: '',
    tags: '',
    seriesName: '',
    content: '',
  });

  useEffect(() => {
    if (postId) {
      setIsEditMode(true);
      setIsLoading(true);
      getPostDetail(Number(postId))
        .then((data) => {
          setForm({
            title: data.title,
            categoryName: data.categoryName,
            tags: data.tags.join(', '),
            seriesName: data.seriesName || '',
            content: data.content,
          });
        })
        .catch((err) => {
          console.error(err);
          alert('글 정보를 불러오지 못했습니다.');
          router.push('/admin/write');
        })
        .finally(() => setIsLoading(false));
    }
  }, [postId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.categoryName) {
      alert('제목, 카테고리, 본문은 필수입니다.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!confirm(isEditMode ? '글을 수정하시겠습니까?' : '글을 발행하시겠습니까?')) return;

    setIsLoading(true);
    try {
      const tagsArray = form.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      if (isEditMode && postId) {
        await updatePost(Number(postId), {
          title: form.title,
          content: form.content,
          categoryName: form.categoryName,
          tags: tagsArray,
          seriesName: form.seriesName || undefined,
          status: 'PUBLIC',
        }, token);
        alert('글이 수정되었습니다!');
      } else {
        await createPost({
          title: form.title,
          content: form.content,
          categoryName: form.categoryName,
          tags: tagsArray,
          seriesName: form.seriesName || undefined,
          status: 'PUBLIC',
        }, token);
        alert('글이 발행되었습니다!');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-gray-800 font-sans pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="hidden md:inline font-medium">Exit</span>
        </button>

        <div className="font-bold text-lg text-gray-800">
          {isEditMode ? 'Edit Post' : 'New Post'}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
        >
          <Save size={18} />
          {isLoading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update' : 'Publish')}
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">

          {/* [Left] 입력 폼 */}
          <div className={`flex flex-col h-full ${activeTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-6 space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="제목을 입력하세요"
                  className="w-full text-3xl font-black text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex-1 min-w-[200px]">
                  <Layers size={16} className="text-blue-500"/>
                  <input
                    type="text"
                    name="categoryName"
                    value={form.categoryName}
                    onChange={handleChange}
                    placeholder="Category (e.g. Java)"
                    className="bg-transparent text-sm w-full outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex-1 min-w-[200px]">
                  <List size={16} className="text-purple-500"/>
                  <input
                    type="text"
                    name="seriesName"
                    value={form.seriesName}
                    onChange={handleChange}
                    placeholder="Series (Optional)"
                    className="bg-transparent text-sm w-full outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                <Tag size={16} className="text-gray-400"/>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="Tags (쉼표로 구분)"
                  className="bg-transparent text-sm w-full outline-none"
                />
              </div>
            </div>

            <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
               <div className="absolute top-4 right-4 flex bg-gray-100 p-1 rounded-lg lg:hidden z-10">
                  <button onClick={() => setActiveTab('write')} className={`p-2 rounded-md ${activeTab === 'write' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}><Edit3 size={16} /></button>
                  <button onClick={() => setActiveTab('preview')} className={`p-2 rounded-md ${activeTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}><Eye size={16} /></button>
               </div>
               <textarea
                 name="content"
                 value={form.content}
                 onChange={handleChange}
                 placeholder="Write your story..."
                 className="w-full h-full p-6 resize-none outline-none text-base leading-relaxed font-mono text-gray-700"
               ></textarea>
            </div>
          </div>

          {/* [Right] 미리보기 */}
          <div className={`flex flex-col h-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden ${activeTab === 'write' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview</span>
               <div className="lg:hidden">
                  <button onClick={() => setActiveTab('write')} className="text-sm text-blue-600 font-bold">Close Preview</button>
               </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
               {form.content ? (
                 <ReactMarkdown components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-gray-600" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-gray-50 text-gray-600 italic" {...props} />,
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
                            <code className="bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-600" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                        img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg my-4 shadow-sm" {...props} />,
                    }}>{form.content}</ReactMarkdown>
               ) : (
                 <div className="h-full flex items-center justify-center text-gray-300">작성된 내용이 여기에 미리보기로 표시됩니다.</div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Editor...</div>}>
      <WriteEditor />
    </Suspense>
  );
}