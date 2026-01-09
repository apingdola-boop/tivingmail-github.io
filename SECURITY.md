# 🔐 MailBridge 보안 설정 가이드

## 환경 변수 분류

### 🔒 서버 전용 (절대 노출 금지)
이 변수들은 **Netlify/Vercel 환경 변수**에만 설정하세요.

| 변수명 | 설명 | 발급 위치 |
|--------|------|-----------|
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 시크릿 | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_REDIRECT_URI` | OAuth 콜백 URL | 직접 설정 |
| `WEBHOOK_SECRET` | Apps Script 연동용 비밀 키 | 직접 생성 |
| `CRON_SECRET` | Cron Job 인증용 (선택) | 직접 생성 |

### 🌐 공개 변수 (안전)
이 변수들은 클라이언트에 노출되어도 안전합니다.

| 변수명 | 설명 | 안전한 이유 |
|--------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | URL만으로는 접근 불가 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 | RLS(Row Level Security)로 보호됨 |
| `NEXT_PUBLIC_APP_URL` | 앱 URL | 공개 정보 |

---

## 🔑 WEBHOOK_SECRET 생성 방법

강력한 랜덤 문자열을 생성하세요:

```bash
# Linux/Mac
openssl rand -hex 32

# 또는 온라인에서 생성
# https://randomkeygen.com/
```

예시: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

## 📋 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] `GOOGLE_CLIENT_SECRET`이 코드에 하드코딩되지 않음
- [ ] `WEBHOOK_SECRET`을 강력한 랜덤 문자열로 설정함
- [ ] Netlify/Vercel에 모든 서버 전용 변수가 설정됨
- [ ] Google Apps Script에 올바른 `WEBHOOK_SECRET` 설정됨

---

## 🛡️ 사이트 접근 권한

| 기능 | 접근 권한 | 설명 |
|------|-----------|------|
| 피드 보기 | ✅ 누구나 | 링크만 있으면 접근 가능 |
| 게시물 상세 보기 | ✅ 누구나 | 로그인 없이 가능 |
| 이메일 동기화 | 🔐 관리자만 | Google 로그인 필요 |
| 웹훅 API | 🔐 시크릿 필요 | Apps Script만 호출 가능 |

---

## ⚠️ 주의사항

1. **절대로 시크릿을 코드에 직접 작성하지 마세요**
2. **환경 변수는 Netlify/Vercel 대시보드에서만 설정하세요**
3. **Git에 `.env.local` 파일을 커밋하지 마세요**












