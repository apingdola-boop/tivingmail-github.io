'use client';

import { useState } from 'react';
import { RefreshCw, Mail, Check, Globe, Lock, Sparkles, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { POST_CATEGORIES, type PostCategory, type EmailData } from '@/types';

interface ProcessedEmail extends EmailData {
  selected: boolean;
  isPublic: boolean;
  category: PostCategory;
  customTitle: string;
}

export default function SyncPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<ProcessedEmail[]>([]);
  const [step, setStep] = useState<'sync' | 'select' | 'done'>('sync');

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/emails/sync', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.emails) {
        setEmails(data.emails.map((email: EmailData) => ({
          ...email,
          selected: false,
          isPublic: true,
          category: '기타' as PostCategory,
          customTitle: email.subject,
        })));
        setStep('select');
      }
    } catch (error) {
      console.error('동기화 실패:', error);
      alert('이메일 동기화에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmailSelection = (index: number) => {
    setEmails(prev => prev.map((email, i) => 
      i === index ? { ...email, selected: !email.selected } : email
    ));
  };

  const updateEmail = (index: number, updates: Partial<ProcessedEmail>) => {
    setEmails(prev => prev.map((email, i) => 
      i === index ? { ...email, ...updates } : email
    ));
  };

  const handleSubmit = async () => {
    const selectedEmails = emails.filter(e => e.selected);
    
    if (selectedEmails.length === 0) {
      alert('공유할 게시물을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      for (const email of selectedEmails) {
        await fetch('/api/deals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: email.customTitle,
            description: email.snippet,
            original_email_subject: email.subject,
            original_email_from: email.from,
            original_email_date: email.date,
            original_email_body: email.body,
            category: email.category,
            is_public: email.isPublic,
          }),
        });
      }
      setStep('done');
    } catch (error) {
      console.error('게시물 생성 실패:', error);
      alert('게시물 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCount = emails.filter(e => e.selected).length;

  return (
    <div className="min-h-screen">
      <Header user={{ name: '사용자' }} />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 스텝 인디케이터 */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {['sync', 'select', 'done'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s 
                    ? 'bg-[var(--color-primary)] text-white'
                    : i < ['sync', 'select', 'done'].indexOf(step)
                      ? 'bg-[var(--color-secondary)] text-white'
                      : 'bg-white/10 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-20 h-1 mx-2 rounded ${
                    i < ['sync', 'select', 'done'].indexOf(step)
                      ? 'bg-[var(--color-secondary)]'
                      : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* 동기화 단계 */}
          {step === 'sync' && (
            <div className="post-card p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center animate-float">
                <Mail className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                이메일 동기화
              </h1>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Gmail에서 이메일을 불러옵니다.
                공유하고 싶은 이메일만 선택할 수 있습니다.
              </p>
              <button
                onClick={handleSync}
                disabled={isLoading}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    이메일 불러오는 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    이메일 불러오기
                  </>
                )}
              </button>
            </div>
          )}

          {/* 선택 단계 */}
          {step === 'select' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    공유할 이메일 선택
                  </h1>
                  <p className="text-gray-400">
                    {emails.length}개의 이메일을 찾았습니다
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {selectedCount}개 선택됨
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || selectedCount === 0}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    공유하기
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {emails.map((email, index) => (
                  <div
                    key={email.id}
                    className={`post-card p-6 transition-all ${
                      email.selected ? 'ring-2 ring-[var(--color-primary)]' : ''
                    }`}
                  >
                    {/* 헤더 */}
                    <div className="flex items-start gap-4 mb-4">
                      <button
                        onClick={() => toggleEmailSelection(index)}
                        className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                          email.selected
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-white/10 text-gray-500 hover:bg-white/20'
                        }`}
                      >
                        {email.selected && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">
                          {email.subject}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {email.from}
                        </p>
                      </div>
                    </div>

                    {/* 미리보기 */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {email.snippet}
                    </p>

                    {/* 옵션 (선택된 경우에만 표시) */}
                    {email.selected && (
                      <div className="pt-4 border-t border-white/10 space-y-4 animate-fade-in-up">
                        {/* 제목 수정 */}
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            제목 (수정 가능)
                          </label>
                          <input
                            type="text"
                            value={email.customTitle}
                            onChange={(e) => updateEmail(index, { customTitle: e.target.value })}
                            className="input-field"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* 카테고리 */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              카테고리
                            </label>
                            <select
                              value={email.category}
                              onChange={(e) => updateEmail(index, { category: e.target.value as PostCategory })}
                              className="input-field"
                            >
                              {POST_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* 공개 여부 */}
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              공개 설정
                            </label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateEmail(index, { isPublic: true })}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                                  email.isPublic
                                    ? 'bg-[var(--color-secondary)] text-white'
                                    : 'bg-white/5 text-gray-400'
                                }`}
                              >
                                <Globe className="w-4 h-4" />
                                공개
                              </button>
                              <button
                                onClick={() => updateEmail(index, { isPublic: false })}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                                  !email.isPublic
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-white/5 text-gray-400'
                                }`}
                              >
                                <Lock className="w-4 h-4" />
                                비공개
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 완료 단계 */}
          {step === 'done' && (
            <div className="post-card p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                공유 완료! 🎉
              </h1>
              <p className="text-gray-400 mb-8">
                {selectedCount}개의 게시물이 성공적으로 공유되었습니다.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href="/feed" className="btn-primary">
                  피드 보기
                </a>
                <button
                  onClick={() => { setStep('sync'); setEmails([]); }}
                  className="btn-secondary"
                >
                  더 추가하기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
