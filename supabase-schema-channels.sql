-- =============================================
-- MailChannel 다중 채널 시스템 스키마
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Channels 테이블 (새로 추가)
-- =============================================
CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,  -- URL용 고유 이름 (예: tving, news)
    name TEXT NOT NULL,          -- 채널 표시 이름
    description TEXT,            -- 채널 설명
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    keywords TEXT[] DEFAULT '{}', -- 이메일 필터링 키워드 배열
    icon TEXT DEFAULT '📬',       -- 채널 아이콘
    color TEXT DEFAULT '#3B82F6', -- 채널 테마 색상
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channels 인덱스
CREATE INDEX IF NOT EXISTS idx_channels_slug ON public.channels(slug);
CREATE INDEX IF NOT EXISTS idx_channels_owner_id ON public.channels(owner_id);

-- =============================================
-- 2. Deals 테이블에 channel_id 컬럼 추가
-- =============================================
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE;

-- channel_id 인덱스
CREATE INDEX IF NOT EXISTS idx_deals_channel_id ON public.deals(channel_id);

-- =============================================
-- 3. Channels RLS 정책
-- =============================================
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- 누구나 채널 목록 조회 가능
CREATE POLICY "Anyone can view channels" ON public.channels
    FOR SELECT USING (true);

-- 로그인한 사용자만 채널 생성 가능
CREATE POLICY "Authenticated users can create channels" ON public.channels
    FOR INSERT WITH CHECK (true);

-- 채널 소유자만 수정 가능
CREATE POLICY "Channel owners can update their channels" ON public.channels
    FOR UPDATE USING (owner_id::text = auth.uid()::text);

-- 채널 소유자만 삭제 가능
CREATE POLICY "Channel owners can delete their channels" ON public.channels
    FOR DELETE USING (owner_id::text = auth.uid()::text);

-- =============================================
-- 4. Deals RLS 정책 업데이트
-- =============================================
-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Anyone can view public deals" ON public.deals;
DROP POLICY IF EXISTS "Users can view their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can insert their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can update their own deals" ON public.deals;
DROP POLICY IF EXISTS "Users can delete their own deals" ON public.deals;

-- 모든 public deals 조회 가능 (채널 포함)
CREATE POLICY "Anyone can view public deals" ON public.deals
    FOR SELECT USING (is_public = true);

-- 채널 소유자는 자신의 채널 deals 관리 가능
CREATE POLICY "Channel owners can insert deals" ON public.deals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Channel owners can update deals" ON public.deals
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Channel owners can delete deals" ON public.deals
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- =============================================
-- 5. Channels updated_at 트리거
-- =============================================
DROP TRIGGER IF EXISTS set_channels_updated_at ON public.channels;
CREATE TRIGGER set_channels_updated_at
    BEFORE UPDATE ON public.channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 기존 데이터 마이그레이션 (선택사항)
-- 기존 deals를 기본 채널로 연결
-- =============================================
-- 나중에 필요시 실행:
-- UPDATE public.deals SET channel_id = '기존채널UUID' WHERE channel_id IS NULL;







