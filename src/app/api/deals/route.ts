import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// 딜 목록 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const isPublic = searchParams.get('public');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let query = supabase
      .from('deals')
      .select(`
        *,
        user:users(id, name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (isPublic === 'true') {
      query = query.eq('is_public', true);
    }

    const { data: deals, error } = await query;

    if (error) throw error;

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('딜 목록 조회 실패:', error);
    return NextResponse.json({ error: '딜 목록을 가져오는데 실패했습니다' }, { status: 500 });
  }
}

// 새 딜 생성
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      original_email_subject,
      original_email_from,
      original_email_date,
      original_email_body,
      discount_amount,
      discount_code,
      expiry_date,
      category,
      is_public,
    } = body;

    // 필수 필드 검증
    if (!title || !original_email_subject || !original_email_from || !original_email_date) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다' }, { status: 400 });
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        user_id: userId,
        title,
        description,
        original_email_subject,
        original_email_from,
        original_email_date,
        original_email_body: original_email_body || '',
        discount_amount,
        discount_code,
        expiry_date,
        category: category || '기타',
        is_public: is_public ?? false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, deal });
  } catch (error) {
    console.error('딜 생성 실패:', error);
    return NextResponse.json({ error: '딜 생성에 실패했습니다' }, { status: 500 });
  }
}

