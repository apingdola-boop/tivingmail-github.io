'use client';

export default function LogoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-8">📧 MailBridge 로고</h1>
        
        {/* 로고 미리보기 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.svg" 
              alt="MailBridge Logo" 
              className="w-48 h-48"
            />
          </div>
          
          <p className="text-gray-300 mb-6">
            보라색 그라데이션 배경에 편지 봉투와 다리(Bridge) 심볼이 있는 로고입니다.
          </p>
          
          {/* 다운로드 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/logo.png" 
              download="mailbridge-logo.png"
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
            >
              📥 PNG 다운로드 (추천)
            </a>
            <a 
              href="/logo.svg" 
              download="mailbridge-logo.svg"
              className="inline-block px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              📥 SVG 다운로드
            </a>
          </div>
        </div>

        {/* 사용 안내 */}
        <div className="bg-white/5 rounded-xl p-6 text-left">
          <h2 className="text-xl font-semibold text-white mb-4">Google 심사용 로고 변환 방법</h2>
          <div className="space-y-3 text-gray-300">
            <p>1. 위 SVG 파일을 다운로드하세요</p>
            <p>2. 아래 무료 변환 사이트에서 PNG로 변환하세요:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <a href="https://cloudconvert.com/svg-to-png" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                  cloudconvert.com
                </a>
              </li>
              <li>
                <a href="https://svgtopng.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                  svgtopng.com
                </a>
              </li>
            </ul>
            <p>3. 크기를 <span className="text-white font-semibold">120x120 픽셀</span> 이상으로 설정하세요</p>
            <p>4. PNG 파일을 Google Cloud Console에 업로드하세요</p>
          </div>
        </div>

        <div className="mt-8">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}

