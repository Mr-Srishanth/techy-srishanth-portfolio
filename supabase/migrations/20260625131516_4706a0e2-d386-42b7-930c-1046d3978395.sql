
DROP POLICY IF EXISTS "Authenticated users can insert portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can update portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Authenticated users can insert section visibility" ON public.section_visibility;
DROP POLICY IF EXISTS "Authenticated users can update section visibility" ON public.section_visibility;

-- Lock down has_role: only authenticated callers, never anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
