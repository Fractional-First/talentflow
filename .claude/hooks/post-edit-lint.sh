#!/bin/bash
# Post-edit hook: Run ESLint on changed files (fast feedback)
# Exit 0 = success, Exit 2 = blocking error

set -e

# Read tool input from stdin
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Skip if no file path or not a JS/TS file
if [ -z "$file_path" ] || ! echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx)$'; then
  exit 0
fi

# Get the parent directory (Fractional First) from talentflow
parent_dir="$(dirname "$CLAUDE_PROJECT_DIR")"

# Determine which repo based on file path
if echo "$file_path" | grep -q "talentflow"; then
  cd "$CLAUDE_PROJECT_DIR" || exit 0
elif echo "$file_path" | grep -q "public-profiles"; then
  cd "$parent_dir/public-profiles" || exit 0
else
  # Default to current project dir
  cd "$CLAUDE_PROJECT_DIR" || exit 0
fi

# Run ESLint on the specific file (suppress errors for missing files)
if [ -f "$file_path" ]; then
  npm run lint -- "$file_path" 2>&1 | head -30 || true
fi

# Don't block on lint errors - just show them
exit 0
