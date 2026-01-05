'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ICON_OPTIONS = ['📬', '📧', '📰', '🎬', '🛒', '💰', '🎮', '📱', '🎵', '📚', '✈️', '🍔', '⚽', '💼', '🎨'];
const COLOR_OPTIONS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function CreateChannelPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    keywords: '',
    icon: '📬',
    color: '#3B82F6',
  });

  const handleSlugChange = (value: string) => {
    // slug는 영문, 숫자, 하이픈만 허용
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const keywords = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          keywords,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '채널 생성에 실패했습니다');
      }

      // 채널 생성 성공 - 채널 페이지로 이동
      router.push(`/channel/${formData.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            📬 MailChannel
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">새 채널 만들기</h1>
          <p className="text-gray-300 mb-8">
            이메일을 자동으로 공유할 채널을 만들어보세요
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 채널 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                채널 이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 티빙 알림"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 채널 URL (slug) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                채널 주소 *
              </label>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">/channel/</span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="tving"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">영문, 숫자, 하이픈만 사용 가능</p>
            </div>

            {/* 채널 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                채널 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="이 채널에 대한 간단한 설명을 적어주세요"
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* 이메일 필터 키워드 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일 필터 키워드 *
              </label>
              <input
                type="text"
                required
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="[TIVING], 확인, 안내"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-400 mt-1">쉼표로 구분, 이 키워드가 메일 제목에 있으면 자동 공유</p>
            </div>

            {/* 아이콘 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                채널 아이콘
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                      formData.icon === icon
                        ? 'border-purple-500 bg-purple-500/30'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* 색상 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                테마 색상
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      formData.color === color
                        ? 'border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 미리보기 */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                미리보기
              </label>
              <div 
                className="p-4 rounded-xl border-2"
                style={{ 
                  borderColor: formData.color,
                  backgroundColor: `${formData.color}20`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{formData.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {formData.name || '채널 이름'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      /channel/{formData.slug || 'slug'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '생성 중...' : '🚀 채널 만들기'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            채널을 만들려면 먼저{' '}
            <Link href="/login" className="text-purple-400 hover:underline">
              Google 로그인
            </Link>
            이 필요합니다
          </p>
        </div>
      </main>
    </div>
  );
}

