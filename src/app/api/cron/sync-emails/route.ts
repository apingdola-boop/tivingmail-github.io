import { NextRequest, NextResponse } from 'next/server';
import { searchTvingEmails } from '@/lib/gmail';
import { supabase } from '@/lib/supabase';

// Vercel Cron Job 또는 수동 호출로 모든 사용자의 이메일 동기화
export async function GET(request: NextRequest) {
  // 간단한 보안: 시크릿 키 확인 (선택적)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // CRON_SECRET이 설정되어 있으면 확인, 없으면 무시
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Vercel Cron에서 호출하는 경우 허용
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    if (!isVercelCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    console.log('🔄 자동 이메일 동기화 시작...');

    // 모든 사용자 조회 (refresh_token이 있는 사용자만)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, google_access_token, google_refresh_token')
      .not('google_refresh_token', 'is', null);

    if (usersError) {
      throw usersError;
    }

    if (!users || users.length === 0) {
      console.log('📭 동기화할 사용자가 없습니다');
      return NextResponse.json({ 
        success: true, 
        message: '동기화할 사용자가 없습니다',
        synced: 0 
      });
    }

    console.log(`👥 ${users.length}명의 사용자 이메일 동기화 중...`);

    let totalSynced = 0;
    const results = [];

    for (const user of users) {
      try {
        // Gmail에서 TVING 이메일 검색 (최근 이메일만, 최대 20개)
        const emails = await searchTvingEmails(
          user.google_access_token,
          user.google_refresh_token,
          20  // 최신 20개만 검색
        );

        console.log(`📧 ${user.email}: ${emails.length}개 이메일 발견`);

        if (emails.length > 0) {
          // 기존에 저장된 이메일 조회 (제목 + 날짜로 중복 체크)
          const { data: existingDeals } = await supabase
            .from('deals')
            .select('original_email_subject, original_email_date')
            .eq('user_id', user.id);

          // 제목+날짜 조합으로 중복 체크 (같은 제목이라도 다른 날짜면 허용)
          const existingKeys = new Set(
            existingDeals?.map(d => `${d.original_email_subject}|${d.original_email_date}`) || []
          );

          // 새 이메일만 필터링 (제목+날짜 조합으로 체크)
          const newEmails = emails.filter(
            email => !existingKeys.has(`${email.subject}|${email.date}`)
          );

          console.log(`🆕 ${user.email}: ${newEmails.length}개 새 이메일`);

          // 새 이메일들을 deals 테이블에 저장
          for (const email of newEmails) {
            await supabase
              .from('deals')
              .insert({
                user_id: user.id,
                title: email.subject,
                description: email.snippet,
                original_email_subject: email.subject,
                original_email_from: email.from,
                original_email_date: email.date,
                original_email_body: email.body,
                category: '뉴스/소식',
                is_public: true,
              } as Record<string, unknown>);
          }

          totalSynced += newEmails.length;
          results.push({
            email: user.email,
            found: emails.length,
            synced: newEmails.length,
          });
        }
      } catch (userError) {
        console.error(`❌ ${user.email} 동기화 실패:`, userError);
        results.push({
          email: user.email,
          error: '동기화 실패',
        });
      }
    }

    console.log(`✅ 자동 동기화 완료! 총 ${totalSynced}개 이메일 저장`);

    return NextResponse.json({
      success: true,
      message: `${totalSynced}개의 새 이메일이 동기화되었습니다`,
      totalSynced,
      results,
    });
  } catch (error) {
    console.error('❌ 자동 동기화 실패:', error);
    return NextResponse.json(
      { error: '자동 동기화에 실패했습니다' },
      { status: 500 }
    );
  }
}

// POST도 지원 (수동 호출용)
export async function POST(request: NextRequest) {
  return GET(request);
}










