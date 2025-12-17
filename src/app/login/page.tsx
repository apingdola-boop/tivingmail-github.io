'use client';

import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Google OAuth 시작
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20 px-4 flex items-center justify-center">
        {/* 배경 효과 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[var(--color-primary)]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-[var(--color-secondary)]/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* 뒤로가기 */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>

          {/* 로그인 카드 */}
          <div className="post-card p-8">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center animate-pulse-glow">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">메일브릿지 로그인</h1>
              <p className="text-gray-400">Gmail을 연결하여 정보를 공유하세요</p>
            </div>

            {/* Google 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 계속하기
            </button>

            {/* 권한 안내 */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center mb-4">
                로그인 시 다음 권한을 요청합니다
              </p>
              
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">이메일 읽기 (읽기 전용)</p>
                  <p className="text-xs text-gray-400">공유할 이메일을 선택하기 위해 필요합니다</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">프로필 정보</p>
                  <p className="text-xs text-gray-400">이름과 프로필 사진을 표시합니다</p>
                </div>
              </div>
            </div>

            {/* 보안 안내 */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-500" />
              <p className="text-xs text-gray-400">
                자동으로 이메일이 공유되지 않습니다. 직접 선택한 이메일만 공유됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
