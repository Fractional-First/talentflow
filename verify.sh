#!/bin/bash
# verify.sh - Vite project verification
set -e
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  $(basename $(pwd)) Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HAS_LINT=$(node -p "require('./package.json').scripts?.lint ? 'yes' : 'no'")
HAS_TEST=$(node -p "require('./package.json').scripts?.test || require('./package.json').scripts?.['test:run'] ? 'yes' : 'no'")
HAS_BUILD=$(node -p "require('./package.json').scripts?.build ? 'yes' : 'no'")

echo ""
echo "1. Lint"
if [ "$HAS_LINT" = "yes" ]; then npm run lint; echo "  ✓ Lint passed"; else echo "  ⊘ Skipping"; fi
echo ""
echo "2. Tests"
if [ "$HAS_TEST" = "yes" ]; then npm run test:run 2>/dev/null || npm run test; echo "  ✓ Tests passed"; else echo "  ⊘ Skipping"; fi
echo ""
echo "3. Build"
if [ "$HAS_BUILD" = "yes" ]; then npm run build; echo "  ✓ Build successful"; else echo "  ⊘ Skipping"; fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ All checks passed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
