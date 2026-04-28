
CREATE TABLE public.news_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  cover_image_url TEXT,
  author_name TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_news_posts_slug ON public.news_posts(slug);
CREATE INDEX idx_news_posts_published_at ON public.news_posts(published_at DESC) WHERE published = true;

ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view published posts" ON public.news_posts
  FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY "Admins manage posts" ON public.news_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_news_posts_updated
  BEFORE UPDATE ON public.news_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('news-media', 'news-media', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies (no broad public SELECT — files reachable via direct CDN URL)
CREATE POLICY "Admins list news media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins upload news media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update news media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete news media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news-media' AND public.has_role(auth.uid(), 'admin'::app_role));
