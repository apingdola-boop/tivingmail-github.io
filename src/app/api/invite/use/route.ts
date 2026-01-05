import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// 초대 코드 사용 처리
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!code) {
      return NextResponse.json(
        { success: false, error: '초대 코드가 필요합니다' },
        { status: 400 }
      );
    }

    // 코드 사용 처리
    const { error } = await supabase
      .from('invite_codes')
      .update({
        is_used: true,
        used_by: userId || null,
        used_at: new Date().toISOString(),
      })
      .eq('code', code.toUpperCase())
      .eq('is_used', false);

    if (error) {
      console.error('초대 코드 사용 처리 오류:', error);
      return NextResponse.json(
        { success: false, error: '코드 사용 처리에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('초대 코드 사용 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

