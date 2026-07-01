#!/usr/bin/env bash
set -euo pipefail

mkdir -p .git/hooks

cat > .git/hooks/pre-commit <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail

npm run check
HOOK

chmod +x .git/hooks/pre-commit

echo "Installed pre-commit hook."
