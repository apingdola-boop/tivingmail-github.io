import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, getUserInfo, searchTvingEmails } from '@/lib/gmail';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/login?error=access_denied', process.env.NEXT_PUBLIC_APP_URL!));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', process.env.NEXT_PUBLIC_APP_URL!));
  }

  try {
    // 인증 코드로 토큰 교환
    const tokens = await getTokensFromCode(code);
    
    if (!tokens.access_token) {
      throw new Error('액세스 토큰을 받지 못했습니다');
    }

    // 사용자 정보 가져오기
    const userInfo = await getUserInfo(tokens.access_token);

    if (!userInfo.email) {
      throw new Error('사용자 이메일을 가져오지 못했습니다');
    }

    // 사용자 정보 저장/업데이트
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userInfo.email)
      .single();

    let userId: string;
    let refreshToken: string | null = null;

    if (existingUser) {
      // 기존 사용자 업데이트
      refreshToken = tokens.refresh_token || existingUser.google_refresh_token;
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: userInfo.name || null,
          avatar_url: userInfo.picture || null,
          google_access_token: tokens.access_token,
          google_refresh_token: refreshToken,
          updated_at: new Date().toISOString(),
        } as Record<string, unknown>)
        .eq('id', existingUser.id);

      if (updateError) throw updateError;
      userId = existingUser.id;
    } else {
      // 새 사용자 생성
      refreshToken = tokens.refresh_token || null;
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: userInfo.email,
          name: userInfo.name || null,
          avatar_url: userInfo.picture || null,
          google_access_token: tokens.access_token,
          google_refresh_token: refreshToken,
        } as Record<string, unknown>)
        .select()
        .single();

      if (insertError) throw insertError;
      userId = newUser.id;
    }

    // 세션 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set('user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    cookieStore.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1시간
    });

    // 🚀 자동 TVING 이메일 동기화
    try {
      console.log('🔄 TVING 이메일 자동 동기화 시작...');
      
      const emails = await searchTvingEmails(
        tokens.access_token,
        refreshToken || undefined,
        50 // 최대 50개 이메일
      );

      console.log(`📧 ${emails.length}개의 TVING 이메일 발견`);

      if (emails.length > 0) {
        // 기존에 저장된 이메일 제목 목록 조회 (중복 방지)
        const { data: existingDeals } = await supabase
          .from('deals')
          .select('original_email_subject')
          .eq('user_id', userId);

        const existingSubjects = new Set(
          existingDeals?.map(d => d.original_email_subject) || []
        );

        // 새 이메일만 필터링
        const newEmails = emails.filter(
          email => !existingSubjects.has(email.subject)
        );

        console.log(`🆕 ${newEmails.length}개의 새로운 이메일 저장 예정`);

        // 새 이메일들을 deals 테이블에 저장
        for (const email of newEmails) {
          await supabase
            .from('deals')
            .insert({
              user_id: userId,
              title: email.subject,
              description: email.snippet,
              original_email_subject: email.subject,
              original_email_from: email.from,
              original_email_date: email.date,
              original_email_body: email.body,
              category: '뉴스/소식',
              is_public: true, // 자동 공개
            } as Record<string, unknown>);
        }

        console.log('✅ TVING 이메일 자동 동기화 완료!');
      }
    } catch (syncError) {
      // 동기화 실패해도 로그인은 성공으로 처리
      console.error('⚠️ TVING 이메일 자동 동기화 실패:', syncError);
    }

    return NextResponse.redirect(new URL('/feed', process.env.NEXT_PUBLIC_APP_URL!));
  } catch (error) {
    console.error('Google 콜백 처리 실패:', error);
    return NextResponse.redirect(new URL('/login?error=callback_failed', process.env.NEXT_PUBLIC_APP_URL!));
  }
}
