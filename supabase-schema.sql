-- Supabase Database Schema for Schedule Calendar
-- This replaces the IndexedDB structure with user-based authentication

-- Enable Row Level Security (RLS) for user-specific data

-- Options table (replaces Options store) - user-specific settings
CREATE TABLE IF NOT EXISTS options (
  id TEXT PRIMARY KEY DEFAULT '',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_view TEXT,
  theme TEXT,
  theme_color TEXT DEFAULT '#aa5fd3',
  bg_color TEXT DEFAULT '#c5e4f7',
  language TEXT DEFAULT 'Ko',
  holiday BOOLEAN DEFAULT true,
  anniversary BOOLEAN DEFAULT false,
  exquisiteness BOOLEAN DEFAULT false,
  lunar BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table (replaces Category store) - user-specific categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules table (replaces Schedule store) - user-specific schedules
CREATE TABLE IF NOT EXISTS schedules (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  category_id TEXT REFERENCES categories(id),
  description TEXT,
  type TEXT DEFAULT 'schedule',
  turn INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_options_user_id ON options(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedules_category ON schedules(category_id);

-- Enable RLS
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for user-specific data access

-- Options policies
CREATE POLICY "Users can view own options" ON options
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own options" ON options
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own options" ON options
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own options" ON options
  FOR DELETE USING (auth.uid() = user_id);

-- Categories policies  
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Schedules policies
CREATE POLICY "Users can view own schedules" ON schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules" ON schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_options_updated_at 
  BEFORE UPDATE ON options 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at 
  BEFORE UPDATE ON schedules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();