-- Create dua_folders table
CREATE TABLE public.dua_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dua_folders
ALTER TABLE public.dua_folders ENABLE ROW LEVEL SECURITY;

-- RLS policies for dua_folders
CREATE POLICY "Users can view their own folders"
  ON public.dua_folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders"
  ON public.dua_folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON public.dua_folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON public.dua_folders FOR DELETE
  USING (auth.uid() = user_id);

-- Add new columns to duas table for the guided dua builder
ALTER TABLE public.duas
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.dua_folders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS selected_names TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS request_text TEXT,
ADD COLUMN IF NOT EXISTS ummah_prayers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS include_salawat BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS final_text TEXT;

-- Create index for folder lookups
CREATE INDEX IF NOT EXISTS idx_duas_folder_id ON public.duas(folder_id);
CREATE INDEX IF NOT EXISTS idx_duas_is_favorite ON public.duas(is_favorite);
CREATE INDEX IF NOT EXISTS idx_dua_folders_user_id ON public.dua_folders(user_id);