import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// 복잡한 초대 코드 생성 (형식: XXXX-XXXX-XXXX)
function generateSecureCode(): string {
  // crypto 모듈로 암호학적으로 안전한 랜덤 생성
  const randomBytes = crypto.randomBytes(9); // 9바이트 = 12자리 base32
  
  // base32 인코딩 (혼동되는 문자 제외: 0, O, I, 1, L)
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 12; i++) {
    const byte = randomBytes[Math.floor(i * 9 / 12)];
    const index = (byte + i * 7) % chars.length;
    code += chars[index];
    
    // 4자리마다 하이픈 추가 (마지막 제외)
    if ((i + 1) % 4 === 0 && i < 11) {
      code += '-';
    }
  }
  
  return code;
}

// 대체 코드 생성 (더 랜덤한 방식)
function generateCode(): string {
  const segments = [];
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz';
  
  for (let s = 0; s < 3; s++) {
    let segment = '';
    for (let i = 0; i < 4; i++) {
      // 더 랜덤한 인덱스 선택
      const randomValue = Math.random() * Date.now() % chars.length;
      segment += chars.charAt(Math.floor(randomValue));
    }
    segments.push(segment);
  }
  
  return segments.join('-');
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
    const errors = [];
    
    for (let i = 0; i < count; i++) {
      // crypto 사용 시도, 실패하면 대체 방식 사용
      let code: string;
      try {
        code = generateSecureCode();
      } catch {
        code = generateCode();
      }
      
      const { data, error } = await supabase
        .from('invite_codes')
        .insert({
          code: code,
          is_used: false,
        } as Record<string, unknown>)
        .select()
        .single();

      if (error) {
        console.error('코드 생성 실패:', error);
        errors.push(error.message);
      } else if (data) {
        codes.push(data);
      }
    }

    if (codes.length === 0 && errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `코드 생성 실패: ${errors[0]}`,
        details: errors
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      codes,
      message: `${codes.length}개의 초대 코드가 생성되었습니다`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('초대 코드 생성 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

