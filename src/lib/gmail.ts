import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};

export const getTokensFromCode = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const setCredentials = (accessToken: string, refreshToken?: string) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
};

export const getGmailClient = (accessToken: string, refreshToken?: string) => {
  const auth = setCredentials(accessToken, refreshToken);
  return google.gmail({ version: 'v1', auth });
};

// 할인 관련 이메일 검색 키워드
const DEAL_KEYWORDS = [
  '할인',
  '세일',
  'SALE',
  '쿠폰',
  'coupon',
  '프로모션',
  'promotion',
  '특가',
  '이벤트',
  '무료배송',
  '% OFF',
  '% 할인',
  '원 할인',
];

export const searchDealEmails = async (
  accessToken: string,
  refreshToken?: string,
  maxResults: number = 20
) => {
  const gmail = getGmailClient(accessToken, refreshToken);
  
  // 할인 관련 키워드로 검색 쿼리 생성
  const query = DEAL_KEYWORDS.map(keyword => `subject:${keyword}`).join(' OR ');
  
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = response.data.messages || [];
    const emails = [];

    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full',
      });

      const headers = email.data.payload?.headers || [];
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      // 이메일 본문 추출
      let body = '';
      const payload = email.data.payload;
      
      if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      } else if (payload?.parts) {
        const textPart = payload.parts.find(
          part => part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }

      emails.push({
        id: message.id,
        subject,
        from,
        date,
        body: body.substring(0, 2000), // 본문은 2000자까지만
        snippet: email.data.snippet || '',
      });
    }

    return emails;
  } catch (error) {
    console.error('Gmail API 에러:', error);
    throw error;
  }
};

export const getUserInfo = async (accessToken: string) => {
  const oauth2 = google.oauth2({ version: 'v2', auth: setCredentials(accessToken) });
  const { data } = await oauth2.userinfo.get();
  return data;
};

