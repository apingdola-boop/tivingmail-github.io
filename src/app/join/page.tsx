'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Zap, Share2, ArrowRight, Key, Lock, Eye, EyeOff } from 'lucide-react';

const ICON_OPTIONS = ['📬', '📧', '📰', '🎬', '🛒', '💰', '🎮', '📱', '🎵', '📚', '✈️', '🍔', '⚽', '💼', '🎨'];
const COLOR_OPTIONS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const KEYWORD_PRESETS = [
  { label: '티빙 문구 추천', value: '[티빙], 인증, 안내' },
  { label: '넷플릭스 문구 추천', value: '넷플릭스, 회원, 임시, 코드' },
];

export default function JoinPage() {
  const [step, setStep] = useState<'invite' | 'info' | 'form'>('info');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [inviteRequired, setInviteRequired] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    keywords: '',
    icon: '📬',
    color: '#3B82F6',
    isPrivate: false,
    password: '',
  });

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, slug });
  };

  // 설정 로드 (초대 코드 필요 여부)
  const loadInviteSetting = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      const required = Boolean(data.inviteRequired);
      setInviteRequired(required);
      setStep(required ? 'invite' : 'info');
    } catch (error) {
      setInviteRequired(false);
      setStep('info');
    }
  };

  // 초대 코드 확인
  const handleCheckInviteCode = async () => {
    if (!inviteCode.trim()) {
      setInviteError('초대 코드를 입력하세요');
      return;
    }

    setIsCheckingCode(true);
    setInviteError('');

    try {
      const res = await fetch('/api/invite/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode }),
      });

      const data = await res.json();

      if (!data.valid) {
        setInviteError(data.error || '유효하지 않은 코드입니다');
        return;
      }

      // 코드 유효 - 다음 단계로
      setStep('info');
    } catch (error) {
      setInviteError('코드 확인에 실패했습니다');
    } finally {
      setIsCheckingCode(false);
    }
  };

  // 초대 코드 설정 불러오기
  useEffect(() => {
    loadInviteSetting();
  }, []);

  const handleGoogleLogin = () => {
    // 비밀번호 보호 설정 시 비밀번호 필수 확인
    if (formData.isPrivate && !formData.password.trim()) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    // 채널 정보를 세션에 저장하고 Google 로그인으로 이동
    sessionStorage.setItem('pending_channel', JSON.stringify({
      ...formData,
      inviteCode: inviteRequired ? inviteCode : '',
    }));
    window.location.href = '/api/auth/google?redirect=/join/complete';
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

      {inviteRequired === null ? (
        <main className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">설정 불러오는 중...</p>
          </div>
        </main>
      ) : step === 'invite' ? (
        /* 초대 코드 입력 */
        <main className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Key className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">초대 코드 입력</h1>
            <p className="text-gray-400 mb-6">
              채널을 만들려면 초대 코드가 필요합니다
            </p>

            {inviteError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm">{inviteError}</p>
              </div>
            )}

            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="초대 코드 입력"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              maxLength={10}
            />

            <button
              onClick={handleCheckInviteCode}
              disabled={isCheckingCode}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {isCheckingCode ? '확인 중...' : '확인'}
            </button>

            <p className="text-gray-500 text-xs mt-6">
              초대 코드는 관리자에게 요청하세요
            </p>
          </div>
        </main>
      ) : step === 'info' ? (
        /* 소개 페이지 */
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              나만의 <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">이메일 채널</span> 만들기
            </h1>
            <p className="text-xl text-gray-400">
              Google 로그인 한 번으로 특정 이메일을 자동 공유하는 채널을 만들 수 있어요
            </p>
            {!inviteRequired && (
              <p className="text-sm text-purple-200/80 mt-3">
                현재는 임시로 초대 코드 없이 채널 생성이 가능합니다.
              </p>
            )}
          </div>

          {/* 작동 방식 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. 채널 정보 입력</h3>
              <p className="text-gray-400 text-sm">
                채널 이름과 이메일 필터 키워드를 설정
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Google 로그인</h3>
              <p className="text-gray-400 text-sm">
                Gmail 읽기 권한으로 이메일 자동 동기화
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. 링크 공유</h3>
              <p className="text-gray-400 text-sm">
                채널 링크만 공유하면 누구나 볼 수 있음
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('form')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl flex items-center gap-2 mx-auto transition-all shadow-lg shadow-purple-500/25"
            >
              시작하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      ) : (
        /* 채널 생성 폼 */
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <button
              onClick={() => setStep('info')}
              className="text-gray-400 hover:text-white mb-4"
            >
              ← 뒤로
            </button>

            <h1 className="text-2xl font-bold text-white mb-6">채널 정보 입력</h1>

            <div className="space-y-6">
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

              {/* 채널 URL */}
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
                    placeholder="my-channel"
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
                  placeholder="이 채널에 대한 간단한 설명"
                  rows={2}
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
                  placeholder="[TVING], 확인, 안내"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">쉼표로 구분, 이 키워드가 메일 제목에 있으면 자동 공유</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {KEYWORD_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, keywords: preset.value })}
                      className="px-3 py-2 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
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
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
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
                      className={`w-8 h-8 rounded-full border-4 transition-all ${
                        formData.color === color
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* 비밀번호 보호 설정 */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        비밀번호 보호
                      </label>
                      <p className="text-xs text-gray-500">
                        팀원끼리만 볼 수 있도록 비밀번호 설정
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      isPrivate: !formData.isPrivate,
                      password: !formData.isPrivate ? formData.password : ''
                    })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isPrivate ? 'bg-purple-600' : 'bg-white/20'
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.isPrivate ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.isPrivate && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="채널 접근 비밀번호 입력"
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      ⚠️ 비밀번호를 잊으면 채널 관리 페이지에서 변경할 수 있어요
                    </p>
                  </div>
                )}
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">
                          {formData.name || '채널 이름'}
                        </h3>
                        {formData.isPrivate && (
                          <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            비공개
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        /channel/{formData.slug || 'my-channel'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google 로그인 버튼 */}
              <button
                onClick={handleGoogleLogin}
                disabled={!formData.name || !formData.slug || !formData.keywords}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google 계정으로 채널 만들기
              </button>

              <p className="text-center text-gray-500 text-xs">
                Gmail 읽기 권한이 필요합니다. 키워드가 포함된 이메일만 동기화됩니다.
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

