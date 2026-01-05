'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Eye, ArrowLeft, Calendar, Mail, User, Globe, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Header from '@/components/Header';

interface Post {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  original_email_subject: string;
  original_email_from: string;
  original_email_date: string;
  original_email_body: string | null;
  category: string;
  is_public: boolean;
  likes_count: number;
  views_count: number;
  created_at: string;
  user?: {
    id: string;
    name: string | null;
    avatar_url: string | null;
  };
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/deals/${params.id}`);
        const data = await response.json();
        
        if (data.deal) {
          setPost(data.deal);
        }
      } catch (error) {
        console.error('게시물 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case '뉴스/소식':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case '공지사항':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case '이벤트':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case '업데이트':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case '팁/정보':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case '리뷰/후기':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case '질문/답변':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">로딩 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center py-20">
            <p className="text-2xl text-white mb-4">게시물을 찾을 수 없습니다</p>
            <button
              onClick={() => router.push('/feed')}
              className="btn-primary"
            >
              피드로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  const userName = post.user?.name || '익명';
  const userAvatar = post.user?.avatar_url;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 뒤로가기 */}
          <button
            onClick={() => router.push('/feed')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            피드로 돌아가기
          </button>

          {/* 메인 카드 */}
          <article className="post-card p-8">
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-14 h-14 rounded-full border-2 border-[var(--color-primary)]/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-xl">
                    {userName[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white text-lg">{userName}</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(post.created_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge border ${getCategoryStyle(post.category)}`}>
                  {post.category}
                </span>
                {post.is_public ? (
                  <span className="badge badge-public">
                    <Globe className="w-3 h-3 mr-1" />
                    공개
                  </span>
                ) : (
                  <span className="badge badge-private">
                    <Lock className="w-3 h-3 mr-1" />
                    비공개
                  </span>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {post.title}
            </h1>

            {/* 원본 이메일 정보 */}
            <div className="bg-white/5 rounded-xl p-5 mb-6">
              <h3 className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                원본 이메일 정보
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">보낸 사람</p>
                    <p className="text-white">{post.original_email_from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">제목</p>
                    <p className="text-white">{post.original_email_subject}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">날짜</p>
                    <p className="text-white">
                      {format(new Date(post.original_email_date), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 이메일 본문 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">📄 이메일 내용</h3>
              <div className="bg-white/5 rounded-xl p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                    {post.original_email_body || post.description || '내용 없음'}
                  </p>
                </div>
              </div>
            </div>

            {/* 좋아요 & 조회수 */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-lg">{post.likes_count + (isLiked ? 1 : 0)}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Eye className="w-6 h-6" />
                  <span className="text-lg">{post.views_count}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}










