'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  icon: string;
  color: string;
  owner: {
    name: string;
    avatar_url: string;
  };
  created_at: string;
}

interface Email {
  id: string;
  title: string;
  description: string;
  original_email_from: string;
  original_email_date: string;
  original_email_body: string;
  created_at: string;
}

export default function ChannelPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [channel, setChannel] = useState<Channel | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setIsLoading(true);
        
        // 채널 정보 가져오기
        const channelRes = await fetch(`/api/channels/${slug}`);
        const channelData = await channelRes.json();
        
        if (!channelRes.ok) {
          throw new Error(channelData.error || '채널을 찾을 수 없습니다');
        }
        
        setChannel(channelData.channel);
        setEmails(channelData.emails || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchChannelData();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">채널 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            📬 MailChannel
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/create-channel"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
            >
              + 채널 만들기
            </Link>
          </div>
        </div>
      </header>

      {/* Channel Header */}
      <div 
        className="border-b border-white/10"
        style={{ backgroundColor: `${channel.color}15` }}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">
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

          {/* 공유 링크 & 관리 */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400 mb-2">📎 이 채널 공유하기</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/channel/${channel.slug}` : ''}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/channel/${channel.slug}`);
                    alert('링크가 복사되었습니다!');
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  복사
                </button>
              </div>
            </div>
            
            <Link
              href={`/channel/${channel.slug}/manage`}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-semibold text-white">채널 관리</p>
                <p className="text-sm text-gray-400">동기화 & 설정</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Emails List */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            📧 공유된 이메일 ({emails.length}개)
          </h2>
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">아직 공유된 이메일이 없습니다</h3>
            <p className="text-gray-400">
              채널 운영자가 Google 로그인하면 키워드가 포함된 이메일이 자동으로 공유됩니다
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 cursor-pointer transition-all"
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {email.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {email.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📤 {email.original_email_from}</span>
                      <span>🕐 {formatDate(email.original_email_date)}</span>
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 text-sm rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: `${channel.color}20`,
                      color: channel.color
                    }}
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEmail(null)}
        >
          <div 
            className="bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="p-6 border-b border-white/10"
              style={{ backgroundColor: `${channel.color}15` }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{selectedEmail.title}</h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span>📤 {selectedEmail.original_email_from}</span>
                <span>🕐 {formatDate(selectedEmail.original_email_date)}</span>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div 
                className="text-gray-300 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: selectedEmail.original_email_body || selectedEmail.description 
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

