import Link from 'next/link';
import { Mail, Zap, Share2, Shield, ArrowRight, Sparkles, Users, Globe } from 'lucide-react';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* 히어로 섹션 */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-secondary)]/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-accent)]/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* 뱃지 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-sm text-gray-300">이메일 정보를 스마트하게 공유하세요</span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            이메일 속 <span className="gradient-text">유용한 정보</span>를
            <br />
            함께 나누세요
          </h1>

          {/* 서브 타이틀 */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Gmail을 연결하면 중요한 이메일을 쉽게 공유할 수 있습니다.
            <br />
            뉴스, 공지사항, 유용한 정보를 다른 사람들과 나눠보세요.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/login" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 animate-pulse-glow">
              <Mail className="w-5 h-5" />
              Gmail로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/feed" className="btn-secondary text-lg px-8 py-4">
              정보 피드 둘러보기
            </Link>
          </div>

          {/* 히어로 이미지/미리보기 */}
          <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="post-card max-w-2xl mx-auto p-8 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">Gmail 자동 동기화</p>
                  <p className="text-sm text-gray-400">방금 전</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                📢 [네이버] 12월 서비스 업데이트 안내
              </h3>
              <p className="text-gray-400 mb-4">
                새로운 기능이 추가되었습니다. 더욱 편리해진 서비스를 확인해보세요...
              </p>
              <div className="flex gap-2">
                <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30">업데이트</span>
                <span className="badge badge-public">
                  <Globe className="w-3 h-3 mr-1" />
                  공개
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1,234+</div>
              <p className="text-gray-400">공유된 정보</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">567+</div>
              <p className="text-gray-400">활성 사용자</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">89%</div>
              <p className="text-gray-400">만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            어떻게 <span className="gradient-text">작동</span>하나요?
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            3단계로 간단하게 이메일 정보를 공유할 수 있어요
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 기능 1 */}
            <div className="post-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Gmail 연결</h3>
              <p className="text-gray-400">
                Google 계정으로 안전하게 로그인하고
                Gmail 접근 권한을 허용합니다.
              </p>
            </div>

            {/* 기능 2 */}
            <div className="post-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--color-secondary)] to-teal-400 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. 이메일 선택</h3>
              <p className="text-gray-400">
                공유하고 싶은 이메일을 선택하고
                카테고리를 지정합니다.
              </p>
            </div>

            {/* 기능 3 */}
            <div className="post-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. 선택적 공유</h3>
              <p className="text-gray-400">
                공개 또는 비공개로 설정하여
                원하는 사람들과 정보를 나눕니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            다양한 <span className="gradient-text">카테고리</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '뉴스/소식', icon: '📰', color: 'from-amber-500 to-orange-500' },
              { name: '공지사항', icon: '📢', color: 'from-red-500 to-pink-500' },
              { name: '이벤트', icon: '🎉', color: 'from-pink-500 to-purple-500' },
              { name: '업데이트', icon: '🔄', color: 'from-blue-500 to-cyan-500' },
              { name: '팁/정보', icon: '💡', color: 'from-green-500 to-emerald-500' },
              { name: '리뷰/후기', icon: '⭐', color: 'from-purple-500 to-violet-500' },
              { name: '질문/답변', icon: '❓', color: 'from-cyan-500 to-blue-500' },
              { name: '기타', icon: '📌', color: 'from-gray-500 to-slate-500' },
            ].map((cat) => (
              <div key={cat.name} className="post-card p-4 text-center hover:scale-105 transition-transform cursor-pointer">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl`}>
                  {cat.icon}
                </div>
                <p className="font-medium text-white">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 보안 안내 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="post-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                개인정보 보호를 최우선으로
              </h3>
              <p className="text-gray-400">
                메일브릿지는 사용자가 선택한 이메일만 공유합니다. 개인 이메일은 절대 자동으로 공유되지 않으며,
                공유 여부와 공개 범위를 직접 선택할 수 있습니다.
                언제든지 연결을 해제할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-gray-400 mb-8">
            유용한 이메일 정보를 다른 사람들과 함께 나눠보세요
          </p>
          <Link href="/login" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            <Users className="w-5 h-5" />
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">메일브릿지</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 MailBridge. 이메일 정보 공유 플랫폼
          </p>
        </div>
      </footer>
    </div>
  );
}
