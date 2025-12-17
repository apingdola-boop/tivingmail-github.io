# 📬 메일브릿지 (MailBridge)

이메일로 받은 유용한 정보를 다른 사람들과 쉽게 공유하는 플랫폼입니다.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ 주요 기능

- 📧 **Gmail 자동 연동**: OAuth로 안전하게 Gmail 연결
- 📝 **선택적 공유**: 공유할 이메일을 직접 선택
- 🔒 **공개/비공개 설정**: 원하는 범위로 공유
- 🏷️ **카테고리 분류**: 뉴스, 공지, 이벤트, 팁 등 다양한 카테고리
- ❤️ **좋아요 & 조회수**: 유용한 정보에 반응하기

## 📁 카테고리

| 카테고리 | 설명 |
|---------|-----|
| 📰 뉴스/소식 | 최신 뉴스와 소식 |
| 📢 공지사항 | 중요한 공지사항 |
| 🎉 이벤트 | 이벤트 및 행사 정보 |
| 🔄 업데이트 | 서비스 업데이트 소식 |
| 💡 팁/정보 | 유용한 팁과 정보 |
| ⭐ 리뷰/후기 | 제품/서비스 리뷰 |
| ❓ 질문/답변 | Q&A |
| 📌 기타 | 기타 정보 |

## 🚀 시작하기

### 1. 의존성 설치

```bash
cd dealmail
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env.local` 파일을 생성하세요:

```bash
copy env.example .env.local
```

필요한 환경 변수:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Gmail API)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase-schema.sql` 파일의 내용을 SQL Editor에서 실행
3. 프로젝트 URL과 anon key를 환경 변수에 추가

### 4. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com)에서 새 프로젝트 생성
2. Gmail API 활성화
3. OAuth 2.0 클라이언트 ID 생성 (웹 애플리케이션)
4. 승인된 리디렉션 URI 추가: `http://localhost:3000/api/auth/google/callback`
5. 클라이언트 ID와 시크릿을 환경 변수에 추가

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
dealmail/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/google/          # Google OAuth 라우트
│   │   │   ├── deals/                # 게시물 CRUD API
│   │   │   └── emails/               # 이메일 동기화 API
│   │   ├── feed/                     # 정보 피드 페이지
│   │   ├── login/                    # 로그인 페이지
│   │   ├── sync/                     # 이메일 동기화 페이지
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # 메인 랜딩 페이지
│   ├── components/
│   │   ├── PostCard.tsx              # 게시물 카드 컴포넌트
│   │   └── Header.tsx                # 헤더 컴포넌트
│   ├── lib/
│   │   ├── gmail.ts                  # Gmail API 유틸리티
│   │   └── supabase.ts               # Supabase 클라이언트
│   └── types/
│       ├── database.ts               # DB 타입 정의
│       └── index.ts                  # 공통 타입
├── supabase-schema.sql               # 데이터베이스 스키마
├── env.example                       # 환경 변수 예시
└── README.md
```

## 🎨 UI/UX 특징

- **다크 테마**: 눈에 편안한 다크 모드 기본 적용
- **인디고/시안 컬러**: 모던하고 차분한 색상 조합
- **글래스모피즘**: 반투명 유리 효과
- **부드러운 애니메이션**: 페이드인, 호버, 플로팅 효과
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

## 🔐 보안

- 사용자가 직접 선택한 이메일만 공유됨
- 자동 공유 기능 없음 (100% 수동 선택)
- OAuth 2.0 표준 인증 사용
- 토큰은 암호화되어 저장
- 언제든지 연결 해제 가능

## 📝 라이선스

MIT License

---

Made with ❤️ by MailBridge Team
