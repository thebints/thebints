
-- Impact reports
CREATE TABLE public.impact_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view published reports" ON public.impact_reports
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage reports" ON public.impact_reports
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_impact_reports_updated
  BEFORE UPDATE ON public.impact_reports
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Gallery projects
CREATE TABLE public.gallery_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  project_date DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view published projects" ON public.gallery_projects
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins manage projects" ON public.gallery_projects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_gallery_projects_updated
  BEFORE UPDATE ON public.gallery_projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Gallery photos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.gallery_projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_gallery_photos_project ON public.gallery_photos(project_id, sort_order);

CREATE POLICY "Public view photos of published projects" ON public.gallery_photos
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.gallery_projects p WHERE p.id = project_id AND p.published = true));
CREATE POLICY "Admins manage photos" ON public.gallery_photos
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enforce max 12 photos per project
CREATE OR REPLACE FUNCTION public.enforce_gallery_photo_limit()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE c INT;
BEGIN
  SELECT COUNT(*) INTO c FROM public.gallery_photos WHERE project_id = NEW.project_id;
  IF c >= 12 THEN
    RAISE EXCEPTION 'A gallery project can contain at most 12 photos';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_gallery_photos_limit
  BEFORE INSERT ON public.gallery_photos
  FOR EACH ROW EXECUTE FUNCTION public.enforce_gallery_photo_limit();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('impact-reports', 'impact-reports', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
CREATE POLICY "Public read impact reports"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'impact-reports');
CREATE POLICY "Admins upload impact reports"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'impact-reports' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update impact reports"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'impact-reports' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete impact reports"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'impact-reports' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery');
CREATE POLICY "Admins upload gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
