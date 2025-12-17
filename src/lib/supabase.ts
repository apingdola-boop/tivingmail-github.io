import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase 클라이언트를 lazy하게 생성 (빌드 시 환경 변수 없어도 오류 방지)
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) {
    return _supabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // 환경 변수가 없으면 더미 클라이언트 반환 (빌드 시)
    console.warn('Supabase 환경 변수가 설정되지 않았습니다.');
    return createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder');
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

// Proxy를 사용해서 supabase 객체에 접근할 때만 클라이언트 생성
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = new Proxy({} as SupabaseClient<any, any, any>, {
  get(_, prop) {
    const client = getSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop];
  }
});

// 호환성을 위한 함수들
export const createClientSupabase = () => getSupabaseClient();
export const createServerSupabaseClient = () => getSupabaseClient();
