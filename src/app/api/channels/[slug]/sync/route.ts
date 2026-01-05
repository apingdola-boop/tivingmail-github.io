import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { searchEmailsByKeywords } from '@/lib/gmail';
import { cookies } from 'next/headers';

// 채널 이메일 동기화
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // 현재 로그인한 사용자 확인
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const accessToken = cookieStore.get('access_token')?.value;

    if (!userId || !accessToken) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // 채널 정보 조회
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select('*')
      .eq('slug', slug)
      .single();

    if (channelError || !channel) {
      return NextResponse.json(
        { error: '채널을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 채널 소유자 확인
    if (channel.owner_id !== userId) {
      return NextResponse.json(
        { error: '채널 소유자만 동기화할 수 있습니다' },
        { status: 403 }
      );
    }

    // 사용자의 refresh_token 가져오기
    const { data: user } = await supabase
      .from('users')
      .select('google_refresh_token')
      .eq('id', userId)
      .single();

    const refreshToken = user?.google_refresh_token;

    // 채널 키워드로 이메일 검색
    const keywords = channel.keywords || [];
    if (keywords.length === 0) {
      return NextResponse.json(
        { error: '채널에 키워드가 설정되지 않았습니다' },
        { status: 400 }
      );
    }

    console.log(`🔄 채널 "${channel.name}" 이메일 동기화 시작...`);
    console.log(`📝 키워드: ${keywords.join(', ')}`);

    const emails = await searchEmailsByKeywords(
      accessToken,
      keywords,
      refreshToken || undefined,
      20  // 최신 20개만
    );

    console.log(`📧 ${emails.length}개의 이메일 발견`);

    // 기존 Gmail 메시지 ID 조회 (정확한 중복 체크)
    const { data: existingDeals } = await supabase
      .from('deals')
      .select('gmail_message_id')
      .eq('channel_id', channel.id)
      .not('gmail_message_id', 'is', null);

    const existingIds = new Set(
      existingDeals?.map(d => d.gmail_message_id) || []
    );

    // Gmail 메시지 ID로 새 이메일만 필터링
    const newEmails = emails.filter(
      email => email.id && !existingIds.has(email.id)
    );

    console.log(`🆕 ${newEmails.length}개의 새로운 이메일 저장 예정 (기존 ${existingIds.size}개)`);

    // 새 이메일들을 deals 테이블에 저장
    let savedCount = 0;
    for (const email of newEmails) {
      const { error: insertError } = await supabase
        .from('deals')
        .insert({
          user_id: userId,
          channel_id: channel.id,
          gmail_message_id: email.id,  // Gmail 메시지 ID 저장
          title: email.subject,
          description: email.snippet,
          original_email_subject: email.subject,
          original_email_from: email.from,
          original_email_date: email.date,
          original_email_body: email.body,
          category: '뉴스/소식',
          is_public: true,
        } as Record<string, unknown>);

      if (!insertError) {
        savedCount++;
      }
    }

    console.log(`✅ ${savedCount}개의 이메일 저장 완료!`);

    return NextResponse.json({
      success: true,
      message: `${savedCount}개의 새 이메일이 동기화되었습니다`,
      found: emails.length,
      saved: savedCount,
    });
  } catch (error) {
    console.error('채널 동기화 오류:', error);
    return NextResponse.json(
      { error: '이메일 동기화에 실패했습니다' },
      { status: 500 }
    );
  }
}

