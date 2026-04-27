-- Enable RLS on linkedin_connections to prevent Data API exposure.
-- No policies are added: the table is only ever accessed via the service-role
-- key (import script) and SECURITY DEFINER RPCs (search_candidates_admin),
-- both of which bypass RLS. Anon and authenticated roles get default-deny.

ALTER TABLE public.linkedin_connections ENABLE ROW LEVEL SECURITY;
