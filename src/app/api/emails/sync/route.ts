import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { searchDealEmails } from '@/lib/gmail';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    // 사용자 정보 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('google_access_token, google_refresh_token')
      .eq('id', userId)
      .single();

    if (userError || !user?.google_access_token) {
      return NextResponse.json({ error: 'Gmail 연동이 필요합니다' }, { status: 401 });
    }

    // Gmail에서 할인 이메일 검색
    const emails = await searchDealEmails(
      user.google_access_token,
      user.google_refresh_token || undefined,
      20
    );

    return NextResponse.json({ 
      success: true, 
      emails,
      count: emails.length 
    });
  } catch (error) {
    console.error('이메일 동기화 실패:', error);
    return NextResponse.json({ 
      error: '이메일을 가져오는데 실패했습니다' 
    }, { status: 500 });
  }
}

