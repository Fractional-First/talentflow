#!/usr/bin/env bash
# Prints the edge functions to deploy for a push, one name per line.
#
#   changed-functions.sh <before-sha> <after-sha>   functions changed in that range
#   changed-functions.sh --all                      every function
#
# Only the functions a merge touched are deployed, never the whole folder,
# because production may hold function versions that were deployed by hand
# and never committed. Redeploying an untouched function would silently replace
# them. The exceptions deploy every function: a change to supabase/functions/_shared/
# (imported by every function) or to supabase/config.toml (verify_jwt lives there).
# A deleted function is reported, not deleted: removing one from production
# stays a deliberate, manual step.
set -euo pipefail

FN_DIR=supabase/functions

all_functions() {
  for d in "$FN_DIR"/*/; do
    name=$(basename "$d")
    case "$name" in _*|.*) continue ;; esac
    [ -f "$d/index.ts" ] && echo "$name"
  done
}

if [ "${1:-}" = "--all" ]; then
  all_functions
  exit 0
fi

before=${1:?usage: changed-functions.sh <before-sha> <after-sha> | --all}
after=${2:?usage: changed-functions.sh <before-sha> <after-sha> | --all}

# A new branch or a force-push has no usable "before": deploy everything.
if [[ "$before" =~ ^0+$ ]] || ! git cat-file -e "$before^{commit}" 2>/dev/null; then
  echo "No usable base commit ($before); deploying every function." >&2
  all_functions
  exit 0
fi

changed=$(git diff --name-only "$before" "$after" -- "$FN_DIR" supabase/config.toml)

if printf '%s\n' "$changed" | grep -qE "^($FN_DIR/_shared/|supabase/config\.toml$)"; then
  echo "_shared/ or config.toml changed; deploying every function." >&2
  all_functions
  exit 0
fi

printf '%s\n' "$changed" | sed -nE "s|^$FN_DIR/([^/]+)/.*|\1|p" | sort -u | while read -r name; do
  case "$name" in _*|.*) continue ;; esac
  if [ -f "$FN_DIR/$name/index.ts" ]; then
    echo "$name"
  else
    echo "::warning::Function '$name' was removed from the repo. It is NOT deleted from production; run 'supabase functions delete $name' by hand if that's intended." >&2
  fi
done
