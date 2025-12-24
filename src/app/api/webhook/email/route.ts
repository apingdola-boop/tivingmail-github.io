import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 🔐 비밀 키는 반드시 환경 변수로만 설정 (코드에 노출 금지)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Google Apps Script에서 호출하는 웹훅 API
export async function POST(request: NextRequest) {
  try {
    // 환경 변수 미설정 시 거부
    if (!WEBHOOK_SECRET) {
      console.error('❌ WEBHOOK_SECRET 환경 변수가 설정되지 않았습니다');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await request.json();
    
    // 비밀 키 확인
    if (body.secret !== WEBHOOK_SECRET) {
      console.warn('⚠️ 잘못된 웹훅 시크릿으로 접근 시도');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = body;

    if (!email || !email.subject || !email.from) {
      return NextResponse.json({ error: 'Invalid email data' }, { status: 400 });
    }

    console.log('📧 웹훅으로 새 이메일 수신:', email.subject);

    // 중복 확인 (제목 + 발신자 + 날짜로 체크 - 같은 제목도 다른 시간에 오면 허용)
    const emailDate = email.date || new Date().toISOString();
    const { data: existing } = await supabase
      .from('deals')
      .select('id')
      .eq('original_email_subject', email.subject)
      .eq('original_email_from', email.from)
      .eq('original_email_date', emailDate)
      .single();

    if (existing) {
      console.log('⚠️ 완전히 동일한 이메일:', email.subject);
      return NextResponse.json({ 
        success: true, 
        message: '완전히 동일한 이메일입니다',
        duplicate: true 
      });
    }

    // 새 게시물 저장 (같은 제목이라도 다른 시간에 온 메일은 허용)
    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        user_id: null, // 웹훅으로 들어온 이메일은 user_id 없음
        title: email.subject,
        description: email.snippet || email.body?.substring(0, 200) || '',
        original_email_subject: email.subject,
        original_email_from: email.from,
        original_email_date: email.date || new Date().toISOString(),
        original_email_body: email.body || '',
        category: '뉴스/소식',
        is_public: true,
        likes_count: 0,
        views_count: 0,
      } as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      console.error('❌ 이메일 저장 실패:', error);
      throw error;
    }

    console.log('✅ 새 이메일 저장 완료:', email.subject);

    return NextResponse.json({ 
      success: true, 
      message: '이메일이 성공적으로 저장되었습니다',
      deal 
    });
  } catch (error) {
    console.error('❌ 웹훅 처리 실패:', error);
    return NextResponse.json(
      { error: '이메일 저장에 실패했습니다' },
      { status: 500 }
    );
  }
}

// GET 요청으로 상태 확인
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'TVING 이메일 웹훅 API가 작동 중입니다' 
  });
}




