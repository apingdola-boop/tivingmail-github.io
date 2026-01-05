'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function JoinCompletePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('채널 생성 중...');
  const [channelSlug, setChannelSlug] = useState('');

  useEffect(() => {
    const createChannel = async () => {
      try {
        // 세션에서 채널 정보 가져오기
        const pendingChannel = sessionStorage.getItem('pending_channel');
        
        if (!pendingChannel) {
          setStatus('error');
          setMessage('채널 정보를 찾을 수 없습니다. 다시 시도해주세요.');
          return;
        }

        const channelData = JSON.parse(pendingChannel);
        
        // 키워드 파싱
        const keywords = channelData.keywords
          .split(',')
          .map((k: string) => k.trim())
          .filter((k: string) => k.length > 0);

        // 채널 생성 API 호출
        const response = await fetch('/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...channelData,
            keywords,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '채널 생성에 실패했습니다');
        }

        // 초대 코드 사용 처리
        if (channelData.inviteCode) {
          await fetch('/api/invite/use', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: channelData.inviteCode }),
          });
        }

        // 세션 정리
        sessionStorage.removeItem('pending_channel');

        setChannelSlug(channelData.slug);
        setStatus('success');
        setMessage('채널이 생성되었습니다!');

        // 3초 후 채널 페이지로 이동
        setTimeout(() => {
          router.push(`/channel/${channelData.slug}`);
        }, 2000);

      } catch (error) {
        console.error('채널 생성 오류:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : '채널 생성에 실패했습니다');
      }
    };

    createChannel();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-white mb-2">{message}</h1>
            <p className="text-gray-400">잠시만 기다려주세요...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-2xl font-bold text-white mb-2">{message}</h1>
            <p className="text-gray-400 mb-6">채널 페이지로 이동합니다...</p>
            <Link
              href={`/channel/${channelSlug}`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
            >
              채널 바로가기 →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">😢</div>
            <h1 className="text-2xl font-bold text-white mb-2">오류 발생</h1>
            <p className="text-red-300 mb-6">{message}</p>
            <Link
              href="/join"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              다시 시도하기
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

