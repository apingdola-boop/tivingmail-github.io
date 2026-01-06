-- =============================================
-- 딜메일 (DealMail) 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Users 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    google_access_token TEXT,
    google_refresh_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =============================================
-- 2. Deals 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    original_email_subject TEXT NOT NULL,
    original_email_from TEXT NOT NULL,
    original_email_date TIMESTAMPTZ NOT NULL,
    original_email_body TEXT,
    discount_amount TEXT,
    discount_code TEXT,
    expiry_date DATE,
    category TEXT DEFAULT '기타',
    is_public BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals 인덱스
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON public.deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_is_public ON public.deals(is_public);
CREATE INDEX IF NOT EXISTS idx_deals_category ON public.deals(category);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);

-- =============================================
-- 3. Likes 테이블
-- =============================================
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, deal_id)
);

-- Likes 인덱스
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_deal_id ON public.likes(deal_id);

-- =============================================
-- 4. RLS (Row Level Security) 정책
-- =============================================

-- Users 테이블 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Deals 테이블 RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public deals" ON public.deals
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own deals" ON public.deals
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own deals" ON public.deals
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own deals" ON public.deals
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own deals" ON public.deals
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- Likes 테이블 RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON public.likes
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- =============================================
-- 5. 함수: 좋아요 카운트 업데이트
-- =============================================
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.deals SET likes_count = likes_count + 1 WHERE id = NEW.deal_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.deals SET likes_count = likes_count - 1 WHERE id = OLD.deal_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 좋아요 트리거
DROP TRIGGER IF EXISTS on_like_change ON public.likes;
CREATE TRIGGER on_like_change
    AFTER INSERT OR DELETE ON public.likes
    FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- =============================================
-- 6. 함수: updated_at 자동 업데이트
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users updated_at 트리거
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Deals updated_at 트리거
DROP TRIGGER IF EXISTS set_deals_updated_at ON public.deals;
CREATE TRIGGER set_deals_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();











