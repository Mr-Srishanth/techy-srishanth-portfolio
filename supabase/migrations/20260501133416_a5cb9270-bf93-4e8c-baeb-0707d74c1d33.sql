-- Add category + description to certificates (backward-compatible)
ALTER TABLE public.certificates 
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Index for fast category grouping
CREATE INDEX IF NOT EXISTS idx_certificates_category ON public.certificates (category);

-- Storage bucket for certificate logos (public, used by admin preset+upload flow)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-logos', 'certificate-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "Public read certificate-logos" ON storage.objects;
CREATE POLICY "Public read certificate-logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-logos');

-- Authenticated write
DROP POLICY IF EXISTS "Auth upload certificate-logos" ON storage.objects;
CREATE POLICY "Auth upload certificate-logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'certificate-logos');

DROP POLICY IF EXISTS "Auth update certificate-logos" ON storage.objects;
CREATE POLICY "Auth update certificate-logos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'certificate-logos');

DROP POLICY IF EXISTS "Auth delete certificate-logos" ON storage.objects;
CREATE POLICY "Auth delete certificate-logos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'certificate-logos');