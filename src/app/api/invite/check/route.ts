import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 초대 코드 확인
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, error: '초대 코드를 입력하세요' },
        { status: 400 }
      );
    }

    // 코드 조회
    const { data: inviteCode, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !inviteCode) {
      return NextResponse.json(
        { valid: false, error: '유효하지 않은 초대 코드입니다' },
        { status: 400 }
      );
    }

    // 이미 사용된 코드인지 확인
    if (inviteCode.is_used) {
      return NextResponse.json(
        { valid: false, error: '이미 사용된 초대 코드입니다' },
        { status: 400 }
      );
    }

    // 만료 확인
    if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: '만료된 초대 코드입니다' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('초대 코드 확인 오류:', error);
    return NextResponse.json(
      { valid: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}


