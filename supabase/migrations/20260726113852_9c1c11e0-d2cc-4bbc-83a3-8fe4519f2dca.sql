
-- Restrict storage write policies to admin users
DROP POLICY IF EXISTS "Authenticated users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload certificate-logos" ON storage.objects;
DROP POLICY IF EXISTS "Auth update certificate-logos" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete certificate-logos" ON storage.objects;

CREATE POLICY "Admins can upload portfolio images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload certificate logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'certificate-logos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update certificate logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'certificate-logos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete certificate logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'certificate-logos' AND public.has_role(auth.uid(), 'admin'));

-- Lock down SECURITY DEFINER function: revoke from public/authenticated, keep for the function's own RLS usage
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
