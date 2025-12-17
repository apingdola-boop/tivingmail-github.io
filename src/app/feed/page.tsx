'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Heart, Inbox, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { POST_CATEGORIES } from '@/types';

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

type SortType = 'latest' | 'popular' | 'likes';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // 피드 데이터 가져오기
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/deals?public=true');
      const data = await response.json();
      
      if (data.deals) {
        setPosts(data.deals);
      }
    } catch (error) {
      console.error('피드 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 수동 동기화
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const response = await fetch('/api/cron/sync-emails', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setSyncMessage(`✅ ${data.totalSynced}개의 새 이메일이 동기화되었습니다!`);
        // 피드 새로고침
        await fetchPosts();
      } else {
        setSyncMessage('⚠️ 동기화할 이메일이 없거나 먼저 로그인이 필요합니다.');
      }
    } catch (error) {
      console.error('동기화 실패:', error);
      setSyncMessage('❌ 동기화에 실패했습니다.');
    } finally {
      setIsSyncing(false);
      // 5초 후 메시지 숨기기
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchPosts();
  }, []);

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
  const filteredPosts = posts
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
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                📬 <span className="gradient-text">정보</span> 피드
              </h1>
              <p className="text-gray-400">
                사용자들이 공유한 유용한 이메일 정보를 확인하세요
              </p>
            </div>
            
            {/* 동기화 버튼 */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="btn-secondary flex items-center gap-2 self-start md:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? '동기화 중...' : '이메일 새로고침'}
            </button>
          </div>

          {/* 동기화 메시지 */}
          {syncMessage && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center animate-fade-in-up">
              <p className="text-white">{syncMessage}</p>
            </div>
          )}

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

          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 mx-auto text-[var(--color-primary)] mb-4 animate-spin" />
              <p className="text-gray-400">피드를 불러오는 중...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            /* 게시물 카드 그리드 */
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
                {searchQuery || selectedCategory ? '검색 결과가 없습니다' : '아직 공유된 정보가 없습니다'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedCategory 
                  ? '다른 검색어나 카테고리를 선택해보세요'
                  : '로그인하면 TVING 관련 이메일이 자동으로 동기화됩니다!'
                }
              </p>
              {!searchQuery && !selectedCategory && (
                <a href="/login" className="btn-primary inline-flex items-center gap-2">
                  로그인하고 이메일 동기화하기
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
