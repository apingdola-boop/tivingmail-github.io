import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 특정 채널 정보 및 이메일 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const inputPassword = searchParams.get('password');

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

    // 비공개 채널인 경우 비밀번호 확인
    if (channel.is_private && channel.password) {
      if (!inputPassword) {
        // 비밀번호 필요 알림 (채널 기본 정보만 반환)
        return NextResponse.json({
          channel: {
            id: channel.id,
            name: channel.name,
            slug: channel.slug,
            icon: channel.icon,
            color: channel.color,
            is_private: true,
            description: channel.description,
          },
          requiresPassword: true,
          emails: [],
        });
      }
      
      if (inputPassword !== channel.password) {
        return NextResponse.json(
          { error: '비밀번호가 올바르지 않습니다', requiresPassword: true },
          { status: 401 }
        );
      }
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

    // 비밀번호는 클라이언트에 반환하지 않음
    const { password, ...channelWithoutPassword } = channel;

    return NextResponse.json({
      channel: channelWithoutPassword,
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






