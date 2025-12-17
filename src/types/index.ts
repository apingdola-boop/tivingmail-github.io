export * from './database';

export interface EmailData {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  snippet: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export type PostCategory = 
  | '뉴스/소식'
  | '공지사항'
  | '이벤트'
  | '업데이트'
  | '팁/정보'
  | '리뷰/후기'
  | '질문/답변'
  | '기타';

export const POST_CATEGORIES: PostCategory[] = [
  '뉴스/소식',
  '공지사항',
  '이벤트',
  '업데이트',
  '팁/정보',
  '리뷰/후기',
  '질문/답변',
  '기타',
];
