
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('popup-images', 'popup-images', true, 1048576, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 1048576, allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

CREATE POLICY "Popup images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'popup-images');

CREATE POLICY "Admins can upload popup images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'popup-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update popup images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'popup-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete popup images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'popup-images' AND public.has_role(auth.uid(), 'admin'));
