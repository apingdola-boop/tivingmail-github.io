/**
 * 🔐 환경 변수 설정 파일
 * 
 * 이 파일은 환경 변수를 안전하게 관리합니다.
 * - 서버 전용 변수: 클라이언트에 절대 노출되지 않음
 * - 공개 변수: 클라이언트에서도 사용 가능 (NEXT_PUBLIC_ prefix)
 */

// ============================================
// 🔒 서버 전용 환경 변수 (절대 클라이언트 노출 금지)
// ============================================

/**
 * 서버 전용 설정을 가져옵니다.
 * ⚠️ 이 함수는 서버 사이드에서만 호출해야 합니다!
 */
export function getServerConfig() {
  // 클라이언트에서 호출 시 에러
  if (typeof window !== 'undefined') {
    throw new Error('getServerConfig는 서버에서만 호출할 수 있습니다!');
  }

  return {
    // Google OAuth (Gmail API)
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    },
    // 웹훅 보안
    webhook: {
      secret: process.env.WEBHOOK_SECRET,
    },
    // Cron Job 보안
    cron: {
      secret: process.env.CRON_SECRET,
    },
  };
}

/**
 * 필수 서버 환경 변수를 검증합니다.
 */
export function validateServerConfig() {
  const config = getServerConfig();
  const missing: string[] = [];

  if (!config.google.clientId) missing.push('GOOGLE_CLIENT_ID');
  if (!config.google.clientSecret) missing.push('GOOGLE_CLIENT_SECRET');
  if (!config.google.redirectUri) missing.push('GOOGLE_REDIRECT_URI');
  if (!config.webhook.secret) missing.push('WEBHOOK_SECRET');

  if (missing.length > 0) {
    console.warn(`⚠️ 누락된 서버 환경 변수: ${missing.join(', ')}`);
    return false;
  }

  return true;
}

// ============================================
// 🌐 공개 환경 변수 (클라이언트에서 사용 가능)
// ============================================

/**
 * 공개 설정 (클라이언트에서도 안전하게 사용 가능)
 * NEXT_PUBLIC_ prefix가 붙은 변수만 사용
 */
export const publicConfig = {
  // Supabase (anon key는 공개용으로 설계됨, RLS로 보호)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  // 앱 URL
  appUrl: process.env.NEXT_PUBLIC_APP_URL || '',
};

// ============================================
// 📋 환경 변수 목록 (문서화용)
// ============================================

/**
 * 필요한 환경 변수 목록
 * 
 * 🔒 서버 전용 (Netlify/Vercel 환경 변수에만 설정):
 * - GOOGLE_CLIENT_ID: Google Cloud Console에서 발급
 * - GOOGLE_CLIENT_SECRET: Google Cloud Console에서 발급
 * - GOOGLE_REDIRECT_URI: OAuth 콜백 URL
 * - WEBHOOK_SECRET: Apps Script 연동용 비밀 키 (직접 생성)
 * - CRON_SECRET: Cron Job 인증용 (선택)
 * 
 * 🌐 공개 (클라이언트에서도 사용):
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase 프로젝트 URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anon 키 (공개용)
 * - NEXT_PUBLIC_APP_URL: 배포된 앱 URL
 */












