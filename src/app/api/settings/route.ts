import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
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
    console.error('설정 조회 오류:', error);
    return NextResponse.json({ inviteRequired: false });
  }
}
