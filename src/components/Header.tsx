'use client';

import Link from 'next/link';
import { Newspaper, Menu, X, User, LogOut, Inbox } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  user?: {
    name: string;
    avatar_url?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">메일브릿지</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/feed" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Inbox className="w-4 h-4" />
              정보 피드
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/my-posts" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  내 게시물
                </Link>
                <Link 
                  href="/sync" 
                  className="btn-secondary text-sm py-2 px-4"
                >
                  이메일 동기화
                </Link>
                <div className="flex items-center space-x-2">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <button className="text-gray-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm py-2 px-6">
                로그인
              </Link>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/feed" 
                className="text-gray-300 hover:text-white transition-colors px-2 py-2"
              >
                정보 피드
              </Link>
              {user ? (
                <>
                  <Link 
                    href="/my-posts" 
                    className="text-gray-300 hover:text-white transition-colors px-2 py-2"
                  >
                    내 게시물
                  </Link>
                  <Link 
                    href="/sync" 
                    className="text-gray-300 hover:text-white transition-colors px-2 py-2"
                  >
                    이메일 동기화
                  </Link>
                </>
              ) : (
                <Link href="/login" className="btn-primary text-center">
                  로그인
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
