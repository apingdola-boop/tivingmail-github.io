import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// 모든 채널 목록 조회
export async function GET() {
  try {
    const { data: channels, error } = await supabase
      .from('channels')
      .select(`
        *,
        owner:users(name, avatar_url),
        deals:deals(count)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('채널 조회 오류:', error);
      return NextResponse.json({ error: '채널을 불러오는데 실패했습니다' }, { status: 500 });
    }

    return NextResponse.json({ channels: channels || [] });
  } catch (error) {
    console.error('채널 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}

// 새 채널 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, keywords, icon, color } = body;

    // 필수 필드 검증
    if (!name || !slug || !keywords || keywords.length === 0) {
      return NextResponse.json(
        { error: '채널 이름, 주소, 키워드는 필수입니다' },
        { status: 400 }
      );
    }

    // slug 형식 검증
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: '채널 주소는 영문 소문자, 숫자, 하이픈만 사용 가능합니다' },
        { status: 400 }
      );
    }

    // 현재 로그인한 사용자 확인 (쿠키에서)
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // 🔒 사용자당 채널 개수 제한 (최대 2개)
    const MAX_CHANNELS_PER_USER = 2;
    const { data: userChannels, error: countError } = await supabase
      .from('channels')
      .select('id')
      .eq('owner_id', userId)
      .eq('is_active', true);

    if (countError) {
      console.error('채널 수 확인 오류:', countError);
    }

    const currentChannelCount = userChannels?.length || 0;
    if (currentChannelCount >= MAX_CHANNELS_PER_USER) {
      return NextResponse.json(
        { error: `채널은 계정당 최대 ${MAX_CHANNELS_PER_USER}개까지만 만들 수 있습니다` },
        { status: 400 }
      );
    }

    // slug 중복 확인
    const { data: existingChannel } = await supabase
      .from('channels')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingChannel) {
      return NextResponse.json(
        { error: '이미 사용 중인 채널 주소입니다' },
        { status: 400 }
      );
    }

    // 채널 생성
    const { data: channel, error } = await supabase
      .from('channels')
      .insert({
        name,
        slug,
        description: description || null,
        keywords,
        icon: icon || '📬',
        color: color || '#3B82F6',
        owner_id: userId,
        is_active: true,
      } as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      console.error('채널 생성 오류:', error);
      return NextResponse.json(
        { error: '채널 생성에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      channel,
      message: '채널이 생성되었습니다!'
    });
  } catch (error) {
    console.error('채널 생성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

