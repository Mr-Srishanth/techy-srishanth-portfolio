
-- Portfolio content (single row)
CREATE TABLE public.portfolio_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_name TEXT NOT NULL DEFAULT 'Arrabola Srishanth',
  hero_subtitle TEXT NOT NULL DEFAULT 'AI & Software Developer',
  hero_bio TEXT NOT NULL DEFAULT '',
  current_focus TEXT NOT NULL DEFAULT 'Data Structures & Algorithms',
  about_title TEXT NOT NULL DEFAULT 'Aspiring AI & Software Developer',
  about_p1 TEXT NOT NULL DEFAULT '',
  about_p2 TEXT NOT NULL DEFAULT '',
  profile_image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view portfolio content" ON public.portfolio_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update portfolio content" ON public.portfolio_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert portfolio content" ON public.portfolio_content FOR INSERT TO authenticated WITH CHECK (true);

-- Skills
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT '⚙️',
  logo TEXT,
  upcoming BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update skills" ON public.skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete skills" ON public.skills FOR DELETE TO authenticated USING (true);

-- Projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

-- Certificates
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL DEFAULT '',
  image TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update certificates" ON public.certificates FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete certificates" ON public.certificates FOR DELETE TO authenticated USING (true);

-- Greetings
CREATE TABLE public.greetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.greetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view greetings" ON public.greetings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert greetings" ON public.greetings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update greetings" ON public.greetings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete greetings" ON public.greetings FOR DELETE TO authenticated USING (true);

-- Section visibility (single row)
CREATE TABLE public.section_visibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  about BOOLEAN NOT NULL DEFAULT true,
  skills BOOLEAN NOT NULL DEFAULT true,
  skill_radar BOOLEAN NOT NULL DEFAULT true,
  rpg_skill_tree BOOLEAN NOT NULL DEFAULT true,
  projects BOOLEAN NOT NULL DEFAULT true,
  timeline BOOLEAN NOT NULL DEFAULT true,
  learning_journey BOOLEAN NOT NULL DEFAULT true,
  achievements BOOLEAN NOT NULL DEFAULT true,
  certificates BOOLEAN NOT NULL DEFAULT true,
  github BOOLEAN NOT NULL DEFAULT true,
  contact BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view section visibility" ON public.section_visibility FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update section visibility" ON public.section_visibility FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert section visibility" ON public.section_visibility FOR INSERT TO authenticated WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_portfolio_content_updated_at BEFORE UPDATE ON public.portfolio_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_greetings_updated_at BEFORE UPDATE ON public.greetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_section_visibility_updated_at BEFORE UPDATE ON public.section_visibility FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
