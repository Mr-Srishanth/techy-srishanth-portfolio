
-- 1. Roles enum + user_roles table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Security definer role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Replace overly-permissive write policies on every content table
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'achievements','certificates','greetings','portfolio_content',
    'projects','section_visibility','skills'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete %1$s" ON public.%1$I', t);

    EXECUTE format($f$
      CREATE POLICY "Admins can insert %1$s"
        ON public.%1$I FOR INSERT TO authenticated
        WITH CHECK (public.has_role(auth.uid(), 'admin'))
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "Admins can update %1$s"
        ON public.%1$I FOR UPDATE TO authenticated
        USING (public.has_role(auth.uid(), 'admin'))
        WITH CHECK (public.has_role(auth.uid(), 'admin'))
    $f$, t);

    EXECUTE format($f$
      CREATE POLICY "Admins can delete %1$s"
        ON public.%1$I FOR DELETE TO authenticated
        USING (public.has_role(auth.uid(), 'admin'))
    $f$, t);
  END LOOP;
END $$;

-- portfolio_content had no DELETE policy originally; that's fine.

-- 4. Remove broad public SELECT policies on storage.objects for public buckets
-- (Public URLs still work for known paths; this just prevents listing the buckets.)
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public read certificate-logos" ON storage.objects;
