'use client';

import { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Heart, Inbox } from 'lucide-react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { POST_CATEGORIES } from '@/types';

// 임시 더미 데이터
const DUMMY_POSTS = [
  {
    id: '1',
    user_id: 'user1',
    title: '📢 [네이버] 12월 서비스 업데이트 안내 - 새로운 기능 추가',
    description: '네이버 서비스에 새로운 기능들이 추가되었습니다. 검색 결과 개선, UI 변경, 그리고 새로운 AI 기능까지! 자세한 내용을 확인해보세요.',
    original_email_subject: '[네이버] 12월 서비스 업데이트 안내',
    original_email_from: 'notice@naver.com',
    original_email_date: '2024-12-15T09:00:00Z',
    category: '업데이트',
    is_public: true,
    likes_count: 128,
    views_count: 1520,
    created_at: '2024-12-15T10:00:00Z',
    user: {
      id: 'user1',
      name: '테크뉴스',
      avatar_url: null,
    },
  },
  {
    id: '2',
    user_id: 'user2',
    title: '💡 개발자를 위한 2024년 트렌드 기술 정리',
    description: '2024년 개발자라면 알아야 할 주요 기술 트렌드를 정리했습니다. AI/ML, 클라우드, 새로운 프레임워크 등을 다룹니다.',
    original_email_subject: '2024 Developer Trends Newsletter',
    original_email_from: 'newsletter@techblog.com',
    original_email_date: '2024-12-14T14:00:00Z',
    category: '팁/정보',
    is_public: true,
    likes_count: 256,
    views_count: 3200,
    created_at: '2024-12-14T15:00:00Z',
    user: {
      id: 'user2',
      name: '개발자Kim',
      avatar_url: null,
    },
  },
  {
    id: '3',
    user_id: 'user3',
    title: '🎉 [카카오] 연말 이벤트 안내 - 선물 받아가세요!',
    description: '카카오에서 연말을 맞아 특별한 이벤트를 진행합니다. 참여만 해도 다양한 경품을 받을 수 있는 기회!',
    original_email_subject: '[카카오] 연말 감사 이벤트',
    original_email_from: 'event@kakao.com',
    original_email_date: '2024-12-13T11:00:00Z',
    category: '이벤트',
    is_public: true,
    likes_count: 89,
    views_count: 920,
    created_at: '2024-12-13T12:00:00Z',
    user: {
      id: 'user3',
      name: '이벤트헌터',
      avatar_url: null,
    },
  },
  {
    id: '4',
    user_id: 'user4',
    title: '📰 [조선일보] 오늘의 주요 뉴스 헤드라인',
    description: '오늘 가장 중요한 뉴스들을 한눈에 확인하세요. 정치, 경제, 사회, 문화 등 다양한 분야의 소식을 전합니다.',
    original_email_subject: '오늘의 뉴스 브리핑',
    original_email_from: 'news@chosun.com',
    original_email_date: '2024-12-16T08:00:00Z',
    category: '뉴스/소식',
    is_public: true,
    likes_count: 67,
    views_count: 890,
    created_at: '2024-12-16T09:00:00Z',
    user: {
      id: 'user4',
      name: '뉴스봇',
      avatar_url: null,
    },
  },
  {
    id: '5',
    user_id: 'user5',
    title: '⭐ [인프런] React 강의 솔직 후기 - 추천할까요?',
    description: '인프런에서 인기 있는 React 강의를 들어봤습니다. 장단점을 솔직하게 리뷰합니다. 수강 전에 참고하세요!',
    original_email_subject: '강의 수강 완료 안내',
    original_email_from: 'info@inflearn.com',
    original_email_date: '2024-12-12T16:00:00Z',
    category: '리뷰/후기',
    is_public: true,
    likes_count: 134,
    views_count: 1100,
    created_at: '2024-12-12T17:00:00Z',
    user: {
      id: 'user5',
      name: '학습자A',
      avatar_url: null,
    },
  },
  {
    id: '6',
    user_id: 'user6',
    title: '❓ TypeScript에서 제네릭 사용법 질문',
    description: 'TypeScript 제네릭을 사용할 때 자주 발생하는 에러와 해결 방법에 대해 질문드립니다. 답변 부탁드려요!',
    original_email_subject: 'Re: TypeScript 질문',
    original_email_from: 'dev@company.com',
    original_email_date: '2024-12-11T10:00:00Z',
    category: '질문/답변',
    is_public: true,
    likes_count: 23,
    views_count: 450,
    created_at: '2024-12-11T11:00:00Z',
    user: {
      id: 'user6',
      name: '주니어개발자',
      avatar_url: null,
    },
  },
];

type SortType = 'latest' | 'popular' | 'likes';

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 필터링 및 정렬
  const filteredPosts = DUMMY_POSTS
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views_count - a.views_count;
        case 'likes':
          return b.likes_count - a.likes_count;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              📬 <span className="gradient-text">정보</span> 피드
            </h1>
            <p className="text-gray-400">
              사용자들이 공유한 유용한 이메일 정보를 확인하세요
            </p>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* 검색창 */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="정보 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>

            {/* 정렬 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('latest')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  sortBy === 'latest'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Clock className="w-4 h-4" />
                최신순
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  sortBy === 'popular'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                인기순
              </button>
              <button
                onClick={() => setSortBy('likes')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  sortBy === 'likes'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Heart className="w-4 h-4" />
                좋아요순
              </button>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              전체
            </button>
            {POST_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 게시물 카드 그리드 */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    isLiked={likedPosts.has(post.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Inbox className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-400">
                다른 검색어나 카테고리를 선택해보세요
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

