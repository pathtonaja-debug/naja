-- Create storage bucket for reflection photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('reflections', 'reflections', false);

-- Create RLS policies for reflections bucket
CREATE POLICY "Anyone can view their own reflection photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'reflections');

CREATE POLICY "Anyone can upload their own reflection photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reflections');

CREATE POLICY "Anyone can update their own reflection photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'reflections');

CREATE POLICY "Anyone can delete their own reflection photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'reflections');

-- Add mood column to reflections table
ALTER TABLE public.reflections 
ADD COLUMN mood text;