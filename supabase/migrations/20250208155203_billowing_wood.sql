/*
  # Document Upload Setup
  
  1. Changes
    - Creates document upload functions for each category
    - Sets up document metadata validation
    - Adds document versioning support
    - Creates document access tracking
  
  2. Security
    - Enforces RLS policies for document access
    - Validates document metadata
    - Tracks document access history
*/

-- Create document_versions table for versioning support
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  file_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(document_id, version_number)
);

-- Create document_access_logs table for tracking
CREATE TABLE IF NOT EXISTS public.document_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('view', 'download', 'print', 'share')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Document versions viewable by document viewers"
  ON public.document_versions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      JOIN public.users u ON u.id = auth.uid()
      WHERE d.id = document_versions.document_id
      AND (u.role = 'admin' OR u.role = 'subscriber')
    )
  );

CREATE POLICY "Access logs viewable by admins only"
  ON public.document_access_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to validate document metadata
CREATE OR REPLACE FUNCTION validate_document_metadata(
  p_category TEXT,
  p_metadata JSONB
) RETURNS BOOLEAN AS $$
BEGIN
  -- Common validation for all documents
  IF NOT (
    p_metadata ? 'title' AND 
    p_metadata ? 'description' AND
    p_metadata ? 'keywords'
  ) THEN
    RETURN FALSE;
  END IF;

  -- Category-specific validation
  CASE p_category
    WHEN 'Hansards' THEN
      IF NOT (
        p_metadata ? 'session' AND
        p_metadata ? 'parliament_number' AND
        p_metadata ? 'sitting_number'
      ) THEN
        RETURN FALSE;
      END IF;

    WHEN 'Courts of Record' THEN
      IF NOT (
        p_metadata ? 'case_number' AND
        p_metadata ? 'judge' AND
        p_metadata ? 'court_division' AND
        p_metadata ? 'judgment_date'
      ) THEN
        RETURN FALSE;
      END IF;

    WHEN 'Acts of Parliament' THEN
      IF NOT (
        p_metadata ? 'act_number' AND
        p_metadata ? 'commencement_date' AND
        p_metadata ? 'assent_date'
      ) THEN
        RETURN FALSE;
      END IF;

    WHEN 'Statutory Instruments' THEN
      IF NOT (
        p_metadata ? 'si_number' AND
        p_metadata ? 'made_date' AND
        p_metadata ? 'commencement_date'
      ) THEN
        RETURN FALSE;
      END IF;

    WHEN 'Gazettes' THEN
      IF NOT (
        p_metadata ? 'gazette_number' AND
        p_metadata ? 'gazette_date' AND
        p_metadata ? 'notice_type'
      ) THEN
        RETURN FALSE;
      END IF;

    WHEN '7th Revised Edition' THEN
      IF NOT (
        p_metadata ? 'chapter' AND
        p_metadata ? 'volume' AND
        p_metadata ? 'revision_date'
      ) THEN
        RETURN FALSE;
      END IF;

    ELSE
      -- For other categories, basic metadata is sufficient
      RETURN TRUE;
  END CASE;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to upload a new document
CREATE OR REPLACE FUNCTION upload_document(
  p_title TEXT,
  p_category TEXT,
  p_subcategory TEXT,
  p_file_url TEXT,
  p_metadata JSONB,
  p_user_id UUID
) RETURNS UUID AS $$
DECLARE
  v_document_id UUID;
  v_version_number INT;
BEGIN
  -- Validate metadata
  IF NOT validate_document_metadata(p_category, p_metadata) THEN
    RAISE EXCEPTION 'Invalid metadata for category %', p_category;
  END IF;

  -- Create document
  INSERT INTO public.documents (
    title,
    category,
    subcategory,
    file_url,
    metadata,
    user_id
  ) VALUES (
    p_title,
    p_category,
    p_subcategory,
    p_file_url,
    p_metadata || jsonb_build_object(
      'status', 'active',
      'version', '1.0',
      'uploaded_by', p_user_id,
      'upload_date', now()
    ),
    p_user_id
  ) RETURNING id INTO v_document_id;

  -- Create initial version
  INSERT INTO public.document_versions (
    document_id,
    version_number,
    file_url,
    metadata,
    created_by
  ) VALUES (
    v_document_id,
    1,
    p_file_url,
    p_metadata,
    p_user_id
  );

  RETURN v_document_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to log document access
CREATE OR REPLACE FUNCTION log_document_access(
  p_document_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.document_access_logs (
    document_id,
    user_id,
    action,
    metadata
  ) VALUES (
    p_document_id,
    p_user_id,
    p_action,
    p_metadata || jsonb_build_object(
      'ip_address', current_setting('request.headers')::jsonb->>'x-forwarded-for',
      'user_agent', current_setting('request.headers')::jsonb->>'user-agent',
      'timestamp', now()
    )
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update document version
CREATE OR REPLACE FUNCTION update_document_version(
  p_document_id UUID,
  p_file_url TEXT,
  p_metadata JSONB,
  p_user_id UUID
) RETURNS INT AS $$
DECLARE
  v_next_version INT;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM public.document_versions
  WHERE document_id = p_document_id;

  -- Create new version
  INSERT INTO public.document_versions (
    document_id,
    version_number,
    file_url,
    metadata,
    created_by
  ) VALUES (
    p_document_id,
    v_next_version,
    p_file_url,
    p_metadata,
    p_user_id
  );

  -- Update document with new version
  UPDATE public.documents
  SET 
    file_url = p_file_url,
    metadata = metadata || 
      jsonb_build_object(
        'version', v_next_version::text || '.0',
        'last_updated_by', p_user_id,
        'last_updated', now()
      ),
    updated_at = now()
  WHERE id = p_document_id;

  RETURN v_next_version;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id 
  ON public.document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at 
  ON public.document_versions(created_at);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_document_id 
  ON public.document_access_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_user_id 
  ON public.document_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_created_at 
  ON public.document_access_logs(created_at);