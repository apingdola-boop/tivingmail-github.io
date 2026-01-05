'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Zap, Share2, ArrowRight, Sparkles, Users, Plus } from 'lucide-react';

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
  deals: { count: number }[];
}

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch('/api/channels');
        const data = await res.json();
        setChannels(data.channels || []);
      } catch (error) {
        console.error('채널 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
            📬 MailChannel
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              로그인
            </Link>
            <Link 
              href="/create-channel"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              채널 만들기
            </Link>
          </div>
        </div>
      </header>
      
      {/* 히어로 섹션 */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* 뱃지 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">누구나 쉽게 이메일 채널을 만들 수 있어요</span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            나만의 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">이메일 채널</span>을
            <br />
            만들어보세요
          </h1>

          {/* 서브 타이틀 */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Google 로그인 한 번으로 특정 이메일을 자동으로 공유하는 채널을 만들 수 있어요.
            <br />
            채널 링크만 공유하면 누구나 볼 수 있습니다!
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/create-channel" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25"
            >
              <Mail className="w-5 h-5" />
              채널 만들기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/feed" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20"
            >
              기존 피드 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 작동 방식 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            🚀 이렇게 작동해요
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. 채널 만들기</h3>
              <p className="text-gray-400">
                채널 이름과 이메일 필터 키워드를 설정하고 Google 로그인
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. 자동 동기화</h3>
              <p className="text-gray-400">
                설정한 키워드가 포함된 이메일이 자동으로 채널에 공유됨
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. 링크 공유</h3>
              <p className="text-gray-400">
                채널 링크만 공유하면 누구나 로그인 없이 볼 수 있음
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 채널 목록 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              📺 공개 채널
            </h2>
            <Link 
              href="/create-channel"
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              새 채널 만들기
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">채널 불러오는 중...</p>
            </div>
          ) : channels.length === 0 ? (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">아직 채널이 없어요</h3>
              <p className="text-gray-400 mb-6">첫 번째 채널을 만들어보세요!</p>
              <Link 
                href="/create-channel"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                채널 만들기
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/channel/${channel.slug}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span 
                      className="text-4xl p-3 rounded-xl"
                      style={{ backgroundColor: `${channel.color}30` }}
                    >
                      {channel.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {channel.name}
                      </h3>
                      <p className="text-sm text-gray-500">/channel/{channel.slug}</p>
                    </div>
                  </div>
                  
                  {channel.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {channel.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {channel.keywords.slice(0, 3).map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${channel.color}20`,
                          color: channel.color
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                    {channel.keywords.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-gray-400">
                        +{channel.keywords.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📧 {channel.deals?.[0]?.count || 0}개의 이메일</span>
                    <span 
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ backgroundColor: channel.color, color: 'white' }}
                    >
                      보기 →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-gray-400 mb-8">
            Google 로그인 한 번이면 나만의 이메일 채널을 만들 수 있어요
          </p>
          <Link 
            href="/create-channel" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
          >
            <Users className="w-5 h-5" />
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📬</span>
            <span className="font-bold text-white">MailChannel</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 MailChannel. 이메일 채널 플랫폼
          </p>
        </div>
      </footer>
    </div>
  );
}
