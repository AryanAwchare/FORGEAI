-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR FITNESS & WELLNESS APP
-- =====================================================
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal VARCHAR(100),
  equipment TEXT[],
  fitness_level VARCHAR(50) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  availability VARCHAR(100),
  limitations TEXT,
  initial_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  unit VARCHAR(10) CHECK (unit IN ('kg', 'lbs')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- =====================================================
-- FITNESS GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fitness_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(100) NOT NULL,
  target VARCHAR(255),
  deadline DATE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  progress DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fitness_goals_user_id ON fitness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_goals_status ON fitness_goals(status);

-- =====================================================
-- WORKOUTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  workout_type VARCHAR(100),
  duration INTEGER, -- in minutes
  calories_burned INTEGER,
  exercises JSONB DEFAULT '[]',
  notes TEXT,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'skipped', 'partial', 'planned')),
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
  feedback TEXT,
  phase VARCHAR(100),
  fatigue_level VARCHAR(20) CHECK (fatigue_level IN ('low', 'medium', 'high')),
  consistency_score DECIMAL(3,2),
  agent_focus VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON workouts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_status ON workouts(status);

-- =====================================================
-- WORKOUT HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS workout_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'skipped', 'partial')),
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_history_user_id ON workout_history(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_history_date ON workout_history(date DESC);

-- =====================================================
-- FITNESS PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fitness_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  body_fat DECIMAL(4,2),
  measurements JSONB DEFAULT '{}', -- chest, waist, hips, arms, legs, etc.
  photos TEXT[], -- URLs to progress photos
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_fitness_progress_user_id ON fitness_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_progress_date ON fitness_progress(date DESC);

-- =====================================================
-- EXERCISES LIBRARY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS exercises_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100), -- strength, cardio, flexibility, etc.
  muscle_groups TEXT[],
  equipment_needed TEXT[],
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT,
  video_url TEXT,
  image_url TEXT,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_library_category ON exercises_library(category);
CREATE INDEX IF NOT EXISTS idx_exercises_library_difficulty ON exercises_library(difficulty_level);

-- =====================================================
-- AI INTERACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- workout_generation, chat, form_analysis, meal_plan
  input_data JSONB,
  output_data JSONB,
  model_used VARCHAR(100),
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at DESC);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- workout_reminder, goal_milestone, achievement, tip
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fitness_goals_updated_at BEFORE UPDATE ON fitness_goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- User Profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Fitness Goals policies
CREATE POLICY "Users can view own goals" ON fitness_goals
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own goals" ON fitness_goals
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own goals" ON fitness_goals
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own goals" ON fitness_goals
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Workouts policies
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Workout History policies
CREATE POLICY "Users can view own workout history" ON workout_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own workout history" ON workout_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Fitness Progress policies
CREATE POLICY "Users can view own progress" ON fitness_progress
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own progress" ON fitness_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress" ON fitness_progress
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own progress" ON fitness_progress
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- AI Interactions policies
CREATE POLICY "Users can view own ai interactions" ON ai_interactions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own ai interactions" ON ai_interactions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Exercises library is public (read-only)
CREATE POLICY "Anyone can view exercises library" ON exercises_library
  FOR SELECT USING (true);

-- =====================================================
-- DONE! 
-- =====================================================
-- You should see "Success. No rows returned" if everything worked.
-- This created 9 tables, indexes, security policies, and triggers.
