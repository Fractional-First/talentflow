-- Create table
CREATE TABLE public.job_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  jd_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_job_descriptions_status ON public.job_descriptions(status);
CREATE INDEX idx_job_descriptions_created_at ON public.job_descriptions(created_at DESC);

-- RLS
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published JDs"
  ON public.job_descriptions
  FOR SELECT
  TO public
  USING (status = 'published');

-- Updated_at trigger (reuses existing function)
CREATE TRIGGER job_descriptions_updated_at
  BEFORE UPDATE ON public.job_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comment
COMMENT ON TABLE public.job_descriptions IS 'Structured job descriptions for executive search engagements';
