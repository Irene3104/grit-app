-- ============================================
-- Questify Database Schema (Supabase/PostgreSQL)
-- ============================================

-- 1. 유저 프로필
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  character_type TEXT NOT NULL DEFAULT 'egg',  -- egg → 랜덤 부화
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 퀘스트 (목표 단위)
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  duration TEXT NOT NULL,               -- '1day', '3days', '1week', 'custom'
  custom_date TEXT,
  deadline_hour TEXT NOT NULL DEFAULT '11:00',
  deadline_period TEXT NOT NULL DEFAULT 'PM' CHECK (deadline_period IN ('AM', 'PM')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 퀘스트 아이템 (할 일 목록)
CREATE TABLE quest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 데일리 사이드 퀘스트 로그
CREATE TABLE daily_quest_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id INTEGER NOT NULL,            -- dailyQuests.ts 의 id
  completed_date DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, completed_date)       -- 하루 1번만
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quest_logs ENABLE ROW LEVEL SECURITY;

-- profiles: 본인만 CRUD
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- quests: 본인만 CRUD
CREATE POLICY "Users can CRUD own quests"
  ON quests FOR ALL USING (auth.uid() = user_id);

-- quest_items: 본인만 CRUD
CREATE POLICY "Users can CRUD own quest items"
  ON quest_items FOR ALL USING (auth.uid() = user_id);

-- daily_quest_logs: 본인만 CRUD
CREATE POLICY "Users can CRUD own daily logs"
  ON daily_quest_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_quests_user_id ON quests(user_id);
CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quest_items_quest_id ON quest_items(quest_id);
CREATE INDEX idx_daily_quest_logs_user_date ON daily_quest_logs(user_id, completed_date);

-- ============================================
-- 자동 프로필 생성 트리거
-- (Supabase Auth 가입 시 자동으로 profiles 생성)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- updated_at 자동 갱신 트리거
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
