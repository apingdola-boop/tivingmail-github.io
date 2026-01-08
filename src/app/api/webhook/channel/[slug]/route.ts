import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 채널별 웹훅 - 이메일 수신
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    console.log(`📥 채널 "${slug}" 웹훅 수신`);

    // 채널 정보 조회
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (channelError || !channel) {
      console.error('❌ 채널을 찾을 수 없음:', slug);
      return NextResponse.json(
        { error: '채널을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 시크릿 검증 (선택적 - 채널별 시크릿 설정 가능)
    // 기본 시크릿 또는 채널별 시크릿 허용
    const defaultSecret = process.env.WEBHOOK_SECRET || 'tving-mail-secret-2024';
    if (body.secret !== defaultSecret) {
      console.warn('⚠️ 잘못된 웹훅 시크릿');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email } = body;

    if (!email || !email.subject || !email.from) {
      return NextResponse.json(
        { error: '이메일 데이터가 필요합니다' },
        { status: 400 }
      );
    }

    // 중복 확인 (제목 + 날짜)
    const emailDate = email.date || new Date().toISOString();
    const { data: existing } = await supabase
      .from('deals')
      .select('id')
      .eq('channel_id', channel.id)
      .eq('original_email_subject', email.subject)
      .eq('original_email_date', emailDate)
      .single();

    if (existing) {
      console.log('⚠️ 중복 이메일:', email.subject);
      return NextResponse.json({
        success: true,
        message: '이미 공유된 이메일입니다',
        duplicate: true,
      });
    }

    // 새 이메일 저장
    const { error: insertError } = await supabase
      .from('deals')
      .insert({
        user_id: channel.owner_id,
        channel_id: channel.id,
        title: email.subject,
        description: email.snippet || email.body?.substring(0, 200) || '',
        original_email_subject: email.subject,
        original_email_from: email.from,
        original_email_date: emailDate,
        original_email_body: email.body || '',
        category: '뉴스/소식',
        is_public: true,
      } as Record<string, unknown>);

    if (insertError) {
      console.error('❌ 이메일 저장 실패:', insertError);
      return NextResponse.json(
        { error: '이메일 저장에 실패했습니다' },
        { status: 500 }
      );
    }

    console.log(`✅ 채널 "${channel.name}"에 이메일 공유됨:`, email.subject);

    return NextResponse.json({
      success: true,
      message: '이메일이 채널에 공유되었습니다',
      channel: channel.name,
    });
  } catch (error) {
    console.error('채널 웹훅 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 웹훅 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data: channel } = await supabase
      .from('channels')
      .select('name, slug, keywords')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!channel) {
      return NextResponse.json(
        { error: '채널을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: `채널 "${channel.name}" 웹훅이 작동 중입니다`,
      channel: channel.name,
      keywords: channel.keywords,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}






