export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">문의/요청 접수</h1>
          <p className="text-gray-400 mb-8">
            문의사항이나 요청사항을 남겨주시면 빠르게 확인해드릴게요.
          </p>

          <form
            name="support"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            action="/support/thanks"
            className="space-y-5"
          >
            <input type="hidden" name="form-name" value="support" />

            <input type="hidden" name="bot-field" />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이름
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="연락받을 이메일"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                유형
              </label>
              <select
                name="category"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                defaultValue="question"
              >
                <option value="question" className="bg-slate-900">질문</option>
                <option value="request" className="bg-slate-900">요청</option>
                <option value="issue" className="bg-slate-900">오류/민원</option>
                <option value="other" className="bg-slate-900">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                내용
              </label>
              <textarea
                name="message"
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="자세한 내용을 입력해주세요"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
            >
              접수하기
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
