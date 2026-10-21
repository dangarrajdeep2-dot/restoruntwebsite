-- ====================================================================
-- 004_storage.sql: Supabase Storage Buckets & Policies
-- ====================================================================

-- 1. CREATE STORAGE BUCKETS IF THEY DON'T EXIST
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('menu-images', 'menu-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('gallery', 'gallery', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. STORAGE POLICIES: PUBLIC READ ACCESS FOR BUCKETS
DROP POLICY IF EXISTS "Public can view menu images" ON storage.objects;
CREATE POLICY "Public can view menu images" ON storage.objects
FOR SELECT USING (bucket_id IN ('menu-images', 'gallery'));

-- 3. STORAGE POLICIES: ADMIN INSERTION ACCESS
DROP POLICY IF EXISTS "Admins can upload to menu-images and gallery" ON storage.objects;
CREATE POLICY "Admins can upload to menu-images and gallery" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('menu-images', 'gallery')
  AND public.is_admin()
);

-- 4. STORAGE POLICIES: ADMIN UPDATE ACCESS
DROP POLICY IF EXISTS "Admins can update images in menu-images and gallery" ON storage.objects;
CREATE POLICY "Admins can update images in menu-images and gallery" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('menu-images', 'gallery')
  AND public.is_admin()
);

-- 5. STORAGE POLICIES: ADMIN DELETE ACCESS
DROP POLICY IF EXISTS "Admins can delete images in menu-images and gallery" ON storage.objects;
CREATE POLICY "Admins can delete images in menu-images and gallery" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('menu-images', 'gallery')
  AND public.is_admin()
);
