import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode, getUserInfo } from '@/lib/gmail';
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
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userInfo.email)
      .single();

    let userId: string;

    if (existingUser) {
      // 기존 사용자 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: userInfo.name,
          avatar_url: userInfo.picture,
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token || existingUser.google_refresh_token,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id);

      if (updateError) throw updateError;
      userId = existingUser.id;
    } else {
      // 새 사용자 생성
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: userInfo.email,
          name: userInfo.name,
          avatar_url: userInfo.picture,
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
        })
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

    return NextResponse.redirect(new URL('/sync', process.env.NEXT_PUBLIC_APP_URL!));
  } catch (error) {
    console.error('Google 콜백 처리 실패:', error);
    return NextResponse.redirect(new URL('/login?error=callback_failed', process.env.NEXT_PUBLIC_APP_URL!));
  }
}

