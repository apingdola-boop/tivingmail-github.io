'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';

interface InviteCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export default function InviteCodesPage() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [message, setMessage] = useState('');

  const fetchCodes = async () => {
    try {
      const res = await fetch('/api/admin/invite-codes');
      const data = await res.json();
      setCodes(data.codes || []);
    } catch (error) {
      console.error('코드 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: generateCount }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✅ ${data.codes.length}개의 초대 코드가 생성되었습니다!`);
        fetchCodes(); // 목록 새로고침
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setMessage(`📋 "${code}" 복사됨!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const copyAllAvailable = () => {
    const availableCodes = codes
      .filter(c => !c.is_used)
      .map(c => c.code)
      .join('\n');
    
    if (availableCodes) {
      navigator.clipboard.writeText(availableCodes);
      setMessage('📋 사용 가능한 모든 코드가 복사되었습니다!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const availableCount = codes.filter(c => !c.is_used).length;
  const usedCount = codes.filter(c => c.is_used).length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">
              📬 MailChannel
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white">
              ← 대시보드로
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎟️ 초대 코드 관리</h1>
          <p className="text-gray-400 mb-8">초대 코드를 생성하고 관리하세요</p>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">{codes.length}</div>
              <div className="text-gray-400 text-sm">전체</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{availableCount}</div>
              <div className="text-gray-400 text-sm">사용 가능</div>
            </div>
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-400">{usedCount}</div>
              <div className="text-gray-400 text-sm">사용됨</div>
            </div>
          </div>

          {/* 코드 생성 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">✨ 새 코드 생성</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-400">개수:</label>
                <select
                  value={generateCount}
                  onChange={(e) => setGenerateCount(Number(e.target.value))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  {[1, 2, 3, 5, 10].map(n => (
                    <option key={n} value={n} className="bg-slate-800">{n}개</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg disabled:opacity-50"
              >
                {isGenerating ? '생성 중...' : '🎲 코드 생성'}
              </button>
              {availableCount > 0 && (
                <button
                  onClick={copyAllAvailable}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                  📋 전체 복사
                </button>
              )}
            </div>
          </div>

          {/* 메시지 */}
          {message && (
            <div className="mb-6 p-4 rounded-lg bg-white/10 border border-white/20 text-center text-white">
              {message}
            </div>
          )}

          {/* 코드 목록 */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">📋 코드 목록</h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">로딩 중...</p>
              </div>
            ) : codes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🎟️</div>
                <p className="text-gray-400">아직 초대 코드가 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {codes.map((code) => (
                  <div 
                    key={code.id} 
                    className={`p-4 flex items-center justify-between ${
                      code.is_used ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl font-mono font-bold ${
                        code.is_used ? 'text-gray-500' : 'text-white'
                      }`}>
                        {code.code}
                      </span>
                      {code.is_used ? (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                          사용됨
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          사용 가능
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm">
                        {formatDate(code.created_at)}
                      </span>
                      {!code.is_used && (
                        <button
                          onClick={() => copyCode(code.code)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg"
                        >
                          복사
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

