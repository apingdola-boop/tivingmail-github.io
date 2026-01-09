'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-white/10 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 로고 및 저작권 */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">📧 MailBridge</h3>
            <p className="text-gray-400 text-sm mt-1">
              이메일 공유 플랫폼
            </p>
          </div>

          {/* 링크 */}
          <div className="flex gap-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              이용약관
            </Link>
          </div>

          {/* 저작권 */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MailBridge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}






