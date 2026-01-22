#!/bin/bash
# Stop hook: Run full verification before Claude finishes
# Called when Claude is about to stop responding

set -e

echo "=== Running verification checks ==="

errors=0

# Get the parent directory (Fractional First) from talentflow
parent_dir="$(dirname "$CLAUDE_PROJECT_DIR")"

# Check talentflow (current project dir)
echo ""
echo "--- talentflow ---"
cd "$CLAUDE_PROJECT_DIR"

# Check for uncommitted changes
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  echo "Uncommitted changes in talentflow:"
  git status --short
fi

# Run tests if they exist
if [ -f "vitest.config.ts" ]; then
  echo "Running tests..."
  if ! npm run test:run 2>&1 | tail -20; then
    echo "ERROR: Tests failed in talentflow"
    errors=$((errors + 1))
  fi
fi

# Run lint
echo "Running lint..."
if ! npm run lint 2>&1 | tail -10; then
  echo "WARNING: Lint issues in talentflow"
fi

# Check public-profiles
if [ -d "$parent_dir/public-profiles" ]; then
  echo ""
  echo "--- public-profiles ---"
  cd "$parent_dir/public-profiles"

  # Check for uncommitted changes
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    echo "Uncommitted changes in public-profiles:"
    git status --short
  fi

  # Run tests if they exist
  if [ -f "vitest.config.ts" ]; then
    echo "Running tests..."
    if ! npm run test:run 2>&1 | tail -20; then
      echo "ERROR: Tests failed in public-profiles"
      errors=$((errors + 1))
    fi
  fi

  # Run lint
  echo "Running lint..."
  if ! npm run lint 2>&1 | tail -10; then
    echo "WARNING: Lint issues in public-profiles"
  fi
fi

echo ""
echo "=== Verification complete ==="

if [ $errors -gt 0 ]; then
  echo "FAILED: $errors error(s) found"
  exit 2  # Block Claude from stopping
else
  echo "All checks passed"
  exit 0
fi
