import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 특정 채널 정보 및 이메일 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 채널 정보 조회
    const { data: channel, error: channelError } = await supabase
      .from('channels')
      .select(`
        *,
        owner:users(name, avatar_url)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (channelError || !channel) {
      return NextResponse.json(
        { error: '채널을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 해당 채널의 이메일 조회
    const { data: emails, error: emailsError } = await supabase
      .from('deals')
      .select('*')
      .eq('channel_id', channel.id)
      .eq('is_public', true)
      .order('original_email_date', { ascending: false });

    if (emailsError) {
      console.error('이메일 조회 오류:', emailsError);
    }

    return NextResponse.json({
      channel,
      emails: emails || [],
    });
  } catch (error) {
    console.error('채널 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 채널 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, description, keywords, icon, color } = body;

    const { data: channel, error } = await supabase
      .from('channels')
      .update({
        name,
        description,
        keywords,
        icon,
        color,
        updated_at: new Date().toISOString(),
      } as Record<string, unknown>)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('채널 수정 오류:', error);
      return NextResponse.json(
        { error: '채널 수정에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, channel });
  } catch (error) {
    console.error('채널 수정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 채널 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('채널 삭제 오류:', error);
      return NextResponse.json(
        { error: '채널 삭제에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: '채널이 삭제되었습니다' });
  } catch (error) {
    console.error('채널 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}


