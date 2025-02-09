/*
  # Set up Storage Buckets and Upload Limits
  
  1. Creates storage buckets for different document types
  2. Sets upload size limit to 50MB
  3. Configures allowed file types
  4. Enables public access where needed
*/

-- Create storage buckets for different document types
DO $$
BEGIN
  -- Hansards bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'hansards',
    'hansards',
    true,
    52428800, -- 50MB in bytes
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Judgments bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'judgments',
    'judgments',
    true,
    52428800,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Legislation bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'legislation',
    'legislation',
    true,
    52428800,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Gazettes bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'gazettes',
    'gazettes',
    true,
    52428800,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Acts bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'acts',
    'acts',
    true,
    52428800,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Statutory instruments bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'statutory',
    'statutory',
    true,
    52428800,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Revised edition bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'revised',
    'revised',
    true,
    52428800,
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
END $$;

-- Create storage policies for each bucket
DO $$
DECLARE
  bucket_name TEXT;
BEGIN
  FOR bucket_name IN 
    SELECT name FROM storage.buckets
  LOOP
    -- Allow authenticated users to read files
    EXECUTE format(
      'CREATE POLICY "Authenticated users can read files" ON storage.objects
       FOR SELECT TO authenticated
       USING (bucket_id = %L)', bucket_name
    );

    -- Allow subscribers and admins to download files
    EXECUTE format(
      'CREATE POLICY "Subscribers and admins can download" ON storage.objects
       FOR SELECT TO authenticated
       USING (
         bucket_id = %L AND
         EXISTS (
           SELECT 1 FROM public.users
           WHERE id = auth.uid()
           AND (role = ''admin'' OR role = ''subscriber'')
         )
       )', bucket_name
    );

    -- Allow admins to upload and delete files
    EXECUTE format(
      'CREATE POLICY "Admins can upload files" ON storage.objects
       FOR INSERT TO authenticated
       WITH CHECK (
         bucket_id = %L AND
         EXISTS (
           SELECT 1 FROM public.users
           WHERE id = auth.uid() AND role = ''admin''
         )
       )', bucket_name
    );

    EXECUTE format(
      'CREATE POLICY "Admins can update files" ON storage.objects
       FOR UPDATE TO authenticated
       USING (
         bucket_id = %L AND
         EXISTS (
           SELECT 1 FROM public.users
           WHERE id = auth.uid() AND role = ''admin''
         )
       )', bucket_name
    );

    EXECUTE format(
      'CREATE POLICY "Admins can delete files" ON storage.objects
       FOR DELETE TO authenticated
       USING (
         bucket_id = %L AND
         EXISTS (
           SELECT 1 FROM public.users
           WHERE id = auth.uid() AND role = ''admin''
         )
       )', bucket_name
    );
  END LOOP;
END $$;