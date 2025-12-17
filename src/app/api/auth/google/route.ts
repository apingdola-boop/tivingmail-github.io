import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/gmail';

export async function GET() {
  try {
    const authUrl = getGoogleAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google Auth URL 생성 실패:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL!));
  }
}

