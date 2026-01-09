-- 채널 비밀번호 보호 기능을 위한 스키마 업데이트
-- Supabase SQL Editor에서 실행하세요

-- channels 테이블에 password 필드 추가
ALTER TABLE channels ADD COLUMN IF NOT EXISTS password TEXT DEFAULT NULL;

-- 비밀번호가 설정된 채널은 is_private으로 표시
ALTER TABLE channels ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

-- 인덱스 추가 (공개 채널만 조회할 때 성능 향상)
CREATE INDEX IF NOT EXISTS idx_channels_is_private ON channels(is_private);

-- 주석 추가
COMMENT ON COLUMN channels.password IS '채널 접근 비밀번호 (NULL이면 공개 채널)';
COMMENT ON COLUMN channels.is_private IS '비공개 채널 여부';


