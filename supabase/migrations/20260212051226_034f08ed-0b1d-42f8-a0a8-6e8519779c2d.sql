
-- Create storage bucket for cycad images
INSERT INTO storage.buckets (id, name, public) VALUES ('cycad-images', 'cycad-images', true);

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload cycad images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cycad-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to cycad images
CREATE POLICY "Cycad images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'cycad-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own cycad images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cycad-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own cycad images"
ON storage.objects FOR DELETE
USING (bucket_id = 'cycad-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image_url column to cycad_items
ALTER TABLE public.cycad_items ADD COLUMN image_url TEXT;
