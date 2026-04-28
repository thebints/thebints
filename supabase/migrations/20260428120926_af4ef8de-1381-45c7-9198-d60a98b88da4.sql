
-- 1. Replace permissive public bucket SELECT with scoped read (no listing)
DROP POLICY IF EXISTS "Public read impact reports" ON storage.objects;
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;

-- Note: public buckets remain accessible by direct URL via Supabase's public CDN
-- regardless of storage.objects policies, so we don't need a permissive SELECT.
-- We add a narrow authenticated SELECT for admin tooling only.
CREATE POLICY "Admins list impact reports"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'impact-reports' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins list gallery"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Lock down has_role execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
