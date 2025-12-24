import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 개별 게시물 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: deal, error } = await supabase
      .from('deals')
      .select(`
        *,
        user:users(id, name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '게시물을 찾을 수 없습니다' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('게시물 조회 실패:', error);
    return NextResponse.json({ error: '게시물을 가져오는데 실패했습니다' }, { status: 500 });
  }
}





