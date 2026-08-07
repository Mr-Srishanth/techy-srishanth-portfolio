-- ── Projects: full case-study fields ──
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS research text,
  ADD COLUMN IF NOT EXISTS architecture text,
  ADD COLUMN IF NOT EXISTS challenges text,
  ADD COLUMN IF NOT EXISTS solved_how text,
  ADD COLUMN IF NOT EXISTS lessons text,
  ADD COLUMN IF NOT EXISTS tech_stack text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS key_features text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS gallery text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT ''::text,
  ADD COLUMN IF NOT EXISTS year text NOT NULL DEFAULT ''::text;

-- ── Certificates: credibility detail ──
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS skills text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS completion_date text NOT NULL DEFAULT ''::text;

-- ── Skills: expertise level + grouping ──
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS proficiency text NOT NULL DEFAULT ''::text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT ''::text;

-- ── Timeline events (was hardcoded) ──
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL DEFAULT ''::text,
  title text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  icon text NOT NULL DEFAULT 'Star'::text,
  accent text NOT NULL DEFAULT 'primary'::text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.timeline_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline_events TO authenticated;
GRANT ALL ON public.timeline_events TO service_role;

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view timeline events"
  ON public.timeline_events FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert timeline events"
  ON public.timeline_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update timeline events"
  ON public.timeline_events FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete timeline events"
  ON public.timeline_events FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── Journey milestones (was hardcoded) ──
CREATE TABLE IF NOT EXISTS public.journey_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  date_label text NOT NULL DEFAULT ''::text,
  icon text NOT NULL DEFAULT 'Code2'::text,
  accent text NOT NULL DEFAULT 'primary'::text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.journey_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_items TO authenticated;
GRANT ALL ON public.journey_items TO service_role;

ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view journey items"
  ON public.journey_items FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert journey items"
  ON public.journey_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update journey items"
  ON public.journey_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete journey items"
  ON public.journey_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_journey_items_updated_at
  BEFORE UPDATE ON public.journey_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();