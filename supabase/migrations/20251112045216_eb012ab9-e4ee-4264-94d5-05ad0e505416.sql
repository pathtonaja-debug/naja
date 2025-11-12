-- Add full-body avatar fields to companion_profiles
ALTER TABLE companion_profiles 
ADD COLUMN IF NOT EXISTS full_body_url TEXT,
ADD COLUMN IF NOT EXISTS portrait_url TEXT,
ADD COLUMN IF NOT EXISTS portrait_crop JSONB DEFAULT '{"x": 0, "y": 0, "width": 256, "height": 256}'::jsonb,
ADD COLUMN IF NOT EXISTS selected_variant_id INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT '{}'::jsonb;

-- Create storage bucket for companion avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('companion-avatars', 'companion-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view companion avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload companion avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update companion avatars" ON storage.objects;

-- Storage policies for companion avatars
CREATE POLICY "Anyone can view companion avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'companion-avatars');

CREATE POLICY "Anyone can upload companion avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'companion-avatars');

CREATE POLICY "Anyone can update companion avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'companion-avatars');