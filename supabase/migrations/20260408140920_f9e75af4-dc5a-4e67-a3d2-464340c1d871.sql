
-- Phase 1: Storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Allow public read access to portfolio images
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Phase 2: Achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🏆',
  link TEXT,
  color TEXT NOT NULL DEFAULT 'text-primary',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can insert achievements" ON public.achievements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update achievements" ON public.achievements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete achievements" ON public.achievements FOR DELETE TO authenticated USING (true);

-- Enable realtime for achievements
ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;

-- Phase 2: Social links + resume URL on portfolio_content
ALTER TABLE public.portfolio_content
  ADD COLUMN github_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN linkedin_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN instagram_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN email TEXT NOT NULL DEFAULT '',
  ADD COLUMN resume_url TEXT NOT NULL DEFAULT '';

-- Phase 3: Project URLs
ALTER TABLE public.projects
  ADD COLUMN live_url TEXT,
  ADD COLUMN github_url TEXT;
