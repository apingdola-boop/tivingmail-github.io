import Link from 'next/link';

export default function SupportThanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">접수 완료</h1>
          <p className="text-gray-400 mb-6">
            문의가 정상적으로 접수되었습니다. 빠르게 확인하겠습니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
