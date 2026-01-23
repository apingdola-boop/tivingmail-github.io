import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;

    if (adminAuth !== 'true') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'invite_required')
      .single();

    if (error) {
      return NextResponse.json({ inviteRequired: false });
    }

    const inviteRequired =
      typeof data?.value === 'boolean'
        ? data.value
        : Boolean(data?.value?.invite_required);

    return NextResponse.json({ inviteRequired });
  } catch (error) {
    console.error('관리자 설정 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;

    if (adminAuth !== 'true') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const body = await request.json();
    const inviteRequired = Boolean(body.inviteRequired);

    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert(
        { key: 'invite_required', value: inviteRequired },
        { onConflict: 'key' }
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, inviteRequired });
  } catch (error) {
    console.error('관리자 설정 저장 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
