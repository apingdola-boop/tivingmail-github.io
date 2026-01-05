'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  icon: string;
  color: string;
  owner_id: string;
  created_at: string;
}

export default function ManageChannelPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await fetch(`/api/channels/${slug}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error);
        }
        
        setChannel(data.channel);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchChannel();
    }
  }, [slug]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch(`/api/channels/${slug}/sync`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSyncResult({
        success: true,
        message: data.message,
      });
    } catch (err) {
      setSyncResult({
        success: false,
        message: err instanceof Error ? err.message : '동기화에 실패했습니다',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 채널을 삭제하시겠습니까? 모든 이메일도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const res = await fetch(`/api/channels/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다');
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
      </AdminGuard>
    );
  }

  if (error || !channel) {
    return (
      <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-white mb-2">채널을 찾을 수 없습니다</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            📬 MailChannel
          </Link>
          <Link 
            href={`/channel/${slug}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← 채널로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* 채널 정보 */}
        <div 
          className="rounded-2xl p-8 mb-8 border-2"
          style={{ 
            borderColor: channel.color,
            backgroundColor: `${channel.color}10`
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span 
              className="text-5xl p-4 rounded-2xl"
              style={{ backgroundColor: `${channel.color}30` }}
            >
              {channel.icon}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-white">{channel.name}</h1>
              <p className="text-gray-400">/channel/{channel.slug}</p>
            </div>
          </div>
          
          {channel.description && (
            <p className="text-gray-300 mb-4">{channel.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {channel.keywords.map((keyword, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${channel.color}30`,
                  color: channel.color
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 관리 기능 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 이메일 동기화 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📧 이메일 동기화</h2>
            <p className="text-gray-400 mb-6">
              Gmail에서 키워드가 포함된 이메일을 불러와 채널에 공유합니다.
            </p>
            
            {syncResult && (
              <div className={`p-4 rounded-lg mb-4 ${
                syncResult.success 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}>
                {syncResult.message}
              </div>
            )}
            
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSyncing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  동기화 중...
                </>
              ) : (
                <>🔄 지금 동기화하기</>
              )}
            </button>
          </div>

          {/* 채널 링크 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🔗 채널 공유</h2>
            <p className="text-gray-400 mb-6">
              이 링크를 공유하면 누구나 채널의 이메일을 볼 수 있습니다.
            </p>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? `${window.location.origin}/channel/${channel.slug}` : ''}
                className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/channel/${channel.slug}`);
                  alert('링크가 복사되었습니다!');
                }}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                복사
              </button>
            </div>
          </div>

          {/* Google Apps Script 설정 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">⚡ 실시간 동기화 설정</h2>
            <p className="text-gray-400 mb-4">
              Google Apps Script를 설정하면 새 이메일이 올 때마다 자동으로 채널에 공유됩니다.
            </p>
            
            <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">
{`// Google Apps Script 코드
// 1. script.google.com 접속
// 2. 새 프로젝트 만들기
// 3. 아래 코드 붙여넣기 후 저장

const WEBHOOK_URL = '${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/channel/${channel.slug}';
const WEBHOOK_SECRET = 'your-secret-key'; // 원하는 비밀키로 변경
const SEARCH_KEYWORDS = ${JSON.stringify(channel.keywords)};

function checkNewEmails() {
  const query = SEARCH_KEYWORDS.map(k => 'subject:"' + k + '"').join(' OR ');
  const threads = GmailApp.search(query, 0, 10);
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(message => {
      // 이메일 데이터를 웹훅으로 전송
      const emailData = {
        secret: WEBHOOK_SECRET,
        email: {
          subject: message.getSubject(),
          from: message.getFrom(),
          date: message.getDate().toISOString(),
          body: message.getPlainBody().substring(0, 2000),
          snippet: message.getPlainBody().substring(0, 200)
        }
      };
      
      UrlFetchApp.fetch(WEBHOOK_URL, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(emailData)
      });
    });
  });
}

// 트리거 설정: 편집 > 현재 프로젝트의 트리거 > 트리거 추가`}
              </pre>
            </div>
          </div>

          {/* 위험 영역 */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-red-400 mb-4">⚠️ 위험 영역</h2>
            <p className="text-gray-400 mb-4">
              채널을 삭제하면 모든 이메일도 함께 삭제되며 복구할 수 없습니다.
            </p>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              🗑️ 채널 삭제
            </button>
          </div>
        </div>
      </main>
    </div>
    </AdminGuard>
  );
}

