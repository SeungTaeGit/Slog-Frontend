"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSystemLogs } from '@/lib/api';
import { SystemLogDto } from '@/types';
import { Activity, AlertTriangle, AlertCircle, Info, Search, X, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SystemLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<SystemLogDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [levelFilter, setLevelFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedLog, setSelectedLog] = useState<SystemLogDto | null>(null);

  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return router.replace('/login');

    setLoading(true);
    try {
      const data = await getSystemLogs({
        page,
        size: 15,
        level: levelFilter === 'ALL' ? undefined : levelFilter
      }, token);

      setLogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, levelFilter, router]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const LevelBadge = ({ level }: { level: string }) => {
    switch (level) {
      case 'ERROR':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800"><AlertCircle size={10}/> ERROR</span>;
      case 'WARN':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 text-xs font-bold border border-yellow-200 dark:border-yellow-800"><AlertTriangle size={10}/> WARN</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800"><Info size={10}/> INFO</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600 dark:text-blue-400" /> System Logs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">서버의 상태와 에러를 모니터링합니다.</p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => { setLevelFilter(lvl); setPage(0); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-gray-700/50 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex h-96 items-center justify-center text-gray-400">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-gray-400 gap-2">
            <Terminal size={32} className="opacity-50"/>
            <p>로그 데이터가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100/50 dark:border-gray-700/50 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                  <th className="px-6 py-4 w-40">Time</th>
                  <th className="px-6 py-4 w-24">Level</th>
                  <th className="px-6 py-4 w-32">Method/URL</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 w-32 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-gray-700/50 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                      {log.createdAt.replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="px-6 py-3">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">{log.method}</span>
                        <span className="text-gray-400 text-[10px] truncate max-w-[150px]" title={log.url}>{log.url}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                       <p className="text-gray-800 dark:text-gray-200 truncate max-w-md" title={log.message}>
                         {log.message}
                       </p>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {log.stackTrace && (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
           Page {page + 1} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedLog(null)}>
          <div
            className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
               <div className="flex items-center gap-3">
                  <LevelBadge level={selectedLog.level} />
                  <span className="font-mono text-sm text-gray-500">{selectedLog.createdAt.replace('T', ' ')}</span>
               </div>
               <button onClick={() => setSelectedLog(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                 <X size={20} className="text-gray-500"/>
               </button>
            </div>

            <div className="p-6 overflow-y-auto bg-[#1E1E1E] text-gray-300 font-mono text-xs leading-relaxed custom-scrollbar">
               <div className="mb-4 pb-4 border-b border-gray-700">
                  <p className="text-blue-400 font-bold mb-1">Request URL:</p>
                  <p className="break-all">{selectedLog.method} {selectedLog.url}</p>
               </div>
               <div className="mb-4 pb-4 border-b border-gray-700">
                  <p className="text-yellow-400 font-bold mb-1">Message:</p>
                  <p className="whitespace-pre-wrap">{selectedLog.message}</p>
               </div>
               <div>
                  <p className="text-red-400 font-bold mb-2">Stack Trace:</p>
                  <pre className="whitespace-pre-wrap break-all text-[11px]">{selectedLog.stackTrace}</pre>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}