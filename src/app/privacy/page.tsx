'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. 수집하는 개인정보</h2>
              <p>본 서비스는 다음과 같은 개인정보를 수집합니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Google 계정 이메일 주소</li>
                <li>Google 계정 프로필 이름</li>
                <li>Google 계정 프로필 사진</li>
                <li>Gmail 이메일 내용 (사용자가 지정한 키워드가 포함된 이메일만)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. 개인정보 수집 목적</h2>
              <p>수집된 개인정보는 다음 목적으로 사용됩니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>사용자 인증 및 서비스 제공</li>
                <li>이메일 동기화 및 공유 기능 제공</li>
                <li>채널 관리 및 운영</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. 개인정보 보유 및 이용 기간</h2>
              <p>
                개인정보는 서비스 이용 기간 동안 보유되며, 사용자가 계정을 삭제하거나 
                서비스 탈퇴를 요청하는 경우 즉시 파기됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. 개인정보의 제3자 제공</h2>
              <p>
                본 서비스는 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 
                단, 법령에 의해 요구되는 경우는 예외로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. 개인정보의 안전성 확보 조치</h2>
              <p>본 서비스는 개인정보 보호를 위해 다음과 같은 조치를 취합니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>SSL/TLS 암호화 통신</li>
                <li>접근 권한 관리</li>
                <li>정기적인 보안 점검</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. 사용자 권리</h2>
              <p>사용자는 다음과 같은 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>개인정보 열람 요청</li>
                <li>개인정보 수정 요청</li>
                <li>개인정보 삭제 요청</li>
                <li>서비스 이용 동의 철회</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Google API 사용</h2>
              <p>
                본 서비스는 Google OAuth 2.0 및 Gmail API를 사용합니다. 
                Google API 사용에 관한 자세한 내용은{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Google 개인정보처리방침
                </a>
                을 참조하세요.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. 문의</h2>
              <p>
                개인정보 관련 문의사항이 있으시면 아래로 연락주세요.
              </p>
              <p className="mt-2">
                이메일: apingdola@gmail.com
              </p>
            </section>

            <section className="pt-4 border-t border-white/20">
              <p className="text-sm text-gray-400">
                본 개인정보처리방침은 2025년 1월 9일부터 시행됩니다.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                최종 수정일: 2025년 1월 9일
              </p>
            </section>
          </div>

          <div className="mt-8">
            <a 
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              ← 홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}







