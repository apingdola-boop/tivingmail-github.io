'use client';

import { useState } from 'react';
import { Heart, Eye, ExternalLink, Lock, Globe, X } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostUser {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

interface Post {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  original_email_subject: string;
  original_email_from: string;
  original_email_date: string;
  original_email_body?: string | null;
  category: string;
  is_public: boolean;
  likes_count: number;
  views_count: number;
  created_at: string;
  user?: PostUser;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  isLiked?: boolean;
}

export default function PostCard({ post, onLike, isLiked = false }: PostCardProps) {
  const [showModal, setShowModal] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  const userName = post.user?.name || '익명';
  const userAvatar = post.user?.avatar_url;

  // 카테고리별 아이콘 색상
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

  return (
    <>
      <article className="post-card p-6 animate-fade-in-up">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
                {userName[0]}
              </div>
            )}
            <div>
              <p className="font-medium text-white">{userName}</p>
              <p className="text-xs text-gray-400">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
        <h3 
          className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {post.title}
        </h3>

        {/* 설명 */}
        {post.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {post.description}
          </p>
        )}

        {/* 카테고리 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge border ${getCategoryStyle(post.category)}`}>
            {post.category}
          </span>
        </div>

        {/* 원본 이메일 정보 */}
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">📧 원본 이메일</p>
          <p className="text-sm text-gray-300 truncate">{post.original_email_from}</p>
          <p className="text-xs text-gray-400 truncate mt-1">{post.original_email_subject}</p>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike?.(post.id)}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes_count}</span>
            </button>
            <div className="flex items-center space-x-1 text-gray-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{post.views_count}</span>
            </div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1 text-[var(--color-secondary)] hover:text-[var(--color-secondary)]/80 transition-colors"
          >
            <span className="text-sm font-medium">자세히 보기</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </article>

      {/* 상세 보기 모달 */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-[#1a1a2e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-[#1a1a2e] p-6 border-b border-white/10 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)]/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg">
                    {userName[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white text-lg">{userName}</p>
                  <p className="text-sm text-gray-400">{timeAgo}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="p-6">
              {/* 카테고리 & 공개 상태 */}
              <div className="flex items-center gap-2 mb-4">
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

              {/* 제목 */}
              <h2 className="text-2xl font-bold text-white mb-4">
                {post.title}
              </h2>

              {/* 원본 이메일 정보 */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-2">📧 원본 이메일 정보</p>
                <div className="space-y-2">
                  <p className="text-white">
                    <span className="text-gray-400">보낸 사람:</span> {post.original_email_from}
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">제목:</span> {post.original_email_subject}
                  </p>
                  <p className="text-white">
                    <span className="text-gray-400">날짜:</span>{' '}
                    {format(new Date(post.original_email_date), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                  </p>
                </div>
              </div>

              {/* 이메일 본문 */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">📄 이메일 내용</p>
                <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {post.original_email_body || post.description || '내용 없음'}
                  </p>
                </div>
              </div>

              {/* 좋아요 & 조회수 */}
              <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => onLike?.(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes_count} 좋아요</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Eye className="w-6 h-6" />
                  <span>{post.views_count} 조회</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
