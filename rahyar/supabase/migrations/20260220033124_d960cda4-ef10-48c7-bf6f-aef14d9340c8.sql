
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  grade INT NOT NULL DEFAULT 7 CHECK (grade BETWEEN 7 AND 12),
  bio TEXT DEFAULT '',
  total_xp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  locale TEXT NOT NULL DEFAULT 'fa',
  theme TEXT NOT NULL DEFAULT 'light',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fa TEXT NOT NULL,
  name_ar TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🏅',
  xp_required INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general'
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are public" ON public.badges FOR SELECT USING (true);

-- User Badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all user_badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can insert badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- XP Transactions
CREATE TABLE public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'quiz',
  source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own xp" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp" ON public.xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quizzes
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fa TEXT NOT NULL,
  title_ar TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  grade INT NOT NULL DEFAULT 7,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  time_limit_minutes INT NOT NULL DEFAULT 15,
  xp_reward INT NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes are public" ON public.quizzes FOR SELECT USING (true);

-- Quiz Questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_fa TEXT NOT NULL,
  question_ar TEXT NOT NULL DEFAULT '',
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INT NOT NULL DEFAULT 0,
  explanation_fa TEXT NOT NULL DEFAULT '',
  explanation_ar TEXT NOT NULL DEFAULT '',
  skill_tag TEXT NOT NULL DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are public" ON public.quiz_questions FOR SELECT USING (true);

-- Quiz Attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]',
  skill_analysis JSONB NOT NULL DEFAULT '{}',
  time_spent_seconds INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resources
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fa TEXT NOT NULL,
  title_ar TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'lesson',
  grade INT NOT NULL DEFAULT 7,
  category TEXT NOT NULL DEFAULT 'general',
  url TEXT,
  content_fa TEXT,
  content_ar TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are public" ON public.resources FOR SELECT USING (true);

-- Video Links (Aparat)
CREATE TABLE public.video_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fa TEXT NOT NULL,
  title_ar TEXT NOT NULL DEFAULT '',
  grade INT NOT NULL DEFAULT 7,
  category TEXT NOT NULL DEFAULT 'general',
  aparat_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INT DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Videos are public" ON public.video_links FOR SELECT USING (true);

-- Learning Paths
CREATE TABLE public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title_fa TEXT NOT NULL DEFAULT '',
  skills JSONB NOT NULL DEFAULT '[]',
  weeks JSONB NOT NULL DEFAULT '[]',
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own paths" ON public.learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own paths" ON public.learning_paths FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own paths" ON public.learning_paths FOR UPDATE USING (auth.uid() = user_id);

-- Messages (internal messaging)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can mark as read" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Chat history for AI assistant
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chat" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard weekly cache
CREATE TABLE public.leaderboard_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  xp_earned INT NOT NULL DEFAULT 0,
  rank INT,
  UNIQUE(user_id, week_start)
);
ALTER TABLE public.leaderboard_weekly ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard is public" ON public.leaderboard_weekly FOR SELECT USING (true);
CREATE POLICY "Users can insert own leaderboard" ON public.leaderboard_weekly FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard" ON public.leaderboard_weekly FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_grade ON public.profiles(grade);
CREATE INDEX idx_profiles_total_xp ON public.profiles(total_xp DESC);
CREATE INDEX idx_xp_transactions_user ON public.xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id, completed_at DESC);
CREATE INDEX idx_quiz_questions_quiz ON public.quiz_questions(quiz_id, sort_order);
CREATE INDEX idx_resources_grade ON public.resources(grade, type);
CREATE INDEX idx_video_links_grade ON public.video_links(grade);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id, is_read);
CREATE INDEX idx_leaderboard_week ON public.leaderboard_weekly(week_start, xp_earned DESC);
CREATE INDEX idx_learning_paths_user ON public.learning_paths(user_id);
CREATE INDEX idx_chat_history_user ON public.chat_history(user_id, created_at);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'کاربر جدید'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
