import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    // redirect 파라미터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const redirectTo = searchParams.get('redirect') || '/feed';

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    // state에 redirect 경로 저장
    const state = Buffer.from(JSON.stringify({ redirect: redirectTo })).toString('base64');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: state,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google Auth URL 생성 실패:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL!));
  }
}
