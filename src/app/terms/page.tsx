'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-8">이용약관</h1>
          
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제1조 (목적)</h2>
              <p>
                본 약관은 MailBridge(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 
                이용자와 서비스 제공자의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제2조 (서비스 내용)</h2>
              <p>본 서비스는 다음과 같은 기능을 제공합니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Gmail 이메일 동기화 및 공유</li>
                <li>키워드 기반 이메일 필터링</li>
                <li>채널 생성 및 관리</li>
                <li>이메일 정보 공유 플랫폼</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제3조 (이용자 자격)</h2>
              <p>
                본 서비스는 Google 계정을 보유한 모든 사용자가 이용할 수 있습니다. 
                서비스 이용을 위해서는 Google OAuth 인증이 필요합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제4조 (이용자의 의무)</h2>
              <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>타인의 개인정보를 무단으로 수집, 이용하는 행위</li>
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>불법적인 목적으로 서비스를 이용하는 행위</li>
                <li>타인의 권리를 침해하는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제5조 (서비스 제공자의 의무)</h2>
              <p>서비스 제공자는 다음을 준수합니다:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>안정적인 서비스 제공을 위해 노력합니다</li>
                <li>이용자의 개인정보를 보호합니다</li>
                <li>서비스 장애 발생 시 신속히 복구합니다</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제6조 (면책조항)</h2>
              <p>
                서비스 제공자는 천재지변, 불가항력적 사유로 인한 서비스 중단에 대해 
                책임을 지지 않습니다. 또한 이용자가 서비스를 통해 공유한 정보로 인해 
                발생하는 문제에 대해서는 이용자가 책임을 집니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제7조 (서비스 변경 및 중단)</h2>
              <p>
                서비스 제공자는 필요한 경우 서비스의 전부 또는 일부를 변경하거나 
                중단할 수 있습니다. 이 경우 사전에 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">제8조 (분쟁 해결)</h2>
              <p>
                본 약관과 관련하여 발생한 분쟁은 대한민국 법률을 준거법으로 하며, 
                관할 법원은 서비스 제공자의 소재지를 관할하는 법원으로 합니다.
              </p>
            </section>

            <section className="pt-4 border-t border-white/20">
              <p className="text-sm text-gray-400">
                본 약관은 2024년 1월 1일부터 시행됩니다.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                최종 수정일: 2024년 1월 6일
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

