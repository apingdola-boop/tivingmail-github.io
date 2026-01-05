import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// 랜덤 코드 생성
function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 혼동되는 문자 제외
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 초대 코드 목록 조회 (관리자용)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;

    if (adminAuth !== 'true') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { data: codes, error } = await supabase
      .from('invite_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ codes: codes || [] });
  } catch (error) {
    console.error('초대 코드 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// 새 초대 코드 생성 (관리자용)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;

    if (adminAuth !== 'true') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const body = await request.json();
    const count = Math.min(body.count || 1, 10); // 최대 10개

    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = generateCode(6);
      
      const { data, error } = await supabase
        .from('invite_codes')
        .insert({
          code: code,
          is_used: false,
        })
        .select()
        .single();

      if (!error && data) {
        codes.push(data);
      }
    }

    return NextResponse.json({ 
      success: true, 
      codes,
      message: `${codes.length}개의 초대 코드가 생성되었습니다`
    });
  } catch (error) {
    console.error('초대 코드 생성 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

