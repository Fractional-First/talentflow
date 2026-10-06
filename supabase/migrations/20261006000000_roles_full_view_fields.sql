-- Roles "Full" view fields (ff-workspace#34): everything Reza tracks per role
-- in the spreadsheet — who was introduced, who was confirmed, the two SOW
-- links and quick notes. Purely additive: existing rows keep NULLs and no
-- data is backfilled (roles are entered by hand, ff-workspace#26).

ALTER TABLE public.roles
  ADD COLUMN client_sow_url TEXT
    CONSTRAINT roles_client_sow_url_check CHECK (client_sow_url ~* '^https?://\S+$'),
  ADD COLUMN candidate_sow_url TEXT
    CONSTRAINT roles_candidate_sow_url_check CHECK (candidate_sow_url ~* '^https?://\S+$'),
  ADD COLUMN notes TEXT,
  -- ON DELETE SET NULL so deleting a profile clears the hire rather than
  -- blocking the delete (see roles_confirmed_candidate_introduced_fkey below).
  ADD COLUMN confirmed_candidate_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Candidates introduced to a role. profile_id covers both profile types:
-- guests (added by FF from LinkedIn) and authenticated (signed up) profiles
-- are rows in the same profiles table.
CREATE TABLE public.role_candidates (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, profile_id)
);

CREATE INDEX role_candidates_profile_id_idx ON public.role_candidates(profile_id);

-- The confirmed hire must be one of the candidates introduced to that role.
-- NO ACTION (checked at end of statement), not RESTRICT: when a profile is
-- deleted, its role_candidates rows cascade away and the profiles FK above
-- nulls confirmed_candidate_id in the same statement, so the check passes.
-- Unlinking the confirmed candidate on its own is refused.
ALTER TABLE public.roles
  ADD CONSTRAINT roles_confirmed_candidate_introduced_fkey
  FOREIGN KEY (id, confirmed_candidate_id)
  REFERENCES public.role_candidates(role_id, profile_id);

-- Same model as roles: RLS on, no policies, served only through the
-- admin-checked SECURITY DEFINER RPCs in 20261006000100_roles_full_view_rpcs.sql.
ALTER TABLE public.role_candidates ENABLE ROW LEVEL SECURITY;
