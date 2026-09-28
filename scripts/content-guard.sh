#!/usr/bin/env bash
#
# content-guard.sh - fail the build when public content leaks internal references.
#
# This repository is public. Every file in it is read by LeadsHook customers and by
# the AI agents they run. This script is the mechanical half of the authoring
# contract in CONTRIBUTING.md section 3: it greps hand-authored prose for the
# forbidden categories and exits non-zero on the first file that contains one.
#
# What this is NOT: it is not a sync gate. It never fetches, clones, or compares
# against LeadsHook's private repository, and it must stay that way. Checkout plus
# grep, nothing else.
#
# Self-exclusions (documented in CONTRIBUTING.md's preamble): CONTRIBUTING.md holds
# a deliberate fenced block of forbidden examples, and this script necessarily holds
# the pattern list itself. Both are skipped, or the guard trips on its own rules and
# can never pass.
#
# Usage: bash scripts/content-guard.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 2

# ---------------------------------------------------------------------------
# Files excluded from the scan. Paths are relative to the repository root and
# must match the `find` output form (leading "./").
# ---------------------------------------------------------------------------
EXCLUDED_FILES=(
  "./CONTRIBUTING.md"          # contains the forbidden-examples block, by design
  "./scripts/content-guard.sh" # contains the pattern list itself
)

# ---------------------------------------------------------------------------
# Allowlist: hosts and repositories customer content is SUPPOSED to name.
# Each occurrence is blanked out before the patterns run, so a rule can never
# trip on one of them. Longest / most specific first.
# ---------------------------------------------------------------------------
ALLOWED=(
  "mcp.leadshook.app"
  "agents.leadshook.app"
  "github.com/LeadsHook/skills"
  "leadshook.app"
)

# ---------------------------------------------------------------------------
# Forbidden patterns. One entry per line: "<category>|<flags>|<ERE>"
#   flags: "i" for case-insensitive, "-" for case-sensitive.
# Categories mirror CONTRIBUTING.md section 3.1.
# ---------------------------------------------------------------------------
RULES=(
  # 1. private source-tree directory paths
  "private source path|-|(^|[^[:alnum:]_./-])(apps|packages|context)/"
  "private source path|-|(^|[^[:alnum:]_/-])[.]agents/"

  # 2. internal package names
  "internal package name|-|@leadshook/"

  # 3. build / test / lint commands
  "internal build command|-|(^|[^[:alnum:]_.@/-])pnpm[[:space:]]"
  "internal build command|-|(^|[^[:alnum:]_.@/-])nx[[:space:]]"
  "internal build command|-|(^|[^[:alnum:]_.@/-])npx[[:space:]]+tsc"

  # 4. internal spec paths
  "internal spec path|-|context/references/"
  "internal spec path|-|tmp/design-md/"

  # 5. decision-record citations
  "decision-record citation|-|ADR-[0-9]"
  "decision-record citation|i|docs/adr/"

  # 6. internal hostnames
  "internal hostname|i|leadshook[.]net"
  "internal hostname|i|leadshook[.]dev"
  "internal hostname|i|localhost"

  # 7. internal agent / skill names
  "internal tooling name|i|(generate-decision-tree|generate-page-from-design|generate-page|general-purpose|docs-maintainer|debug-specialist)"

  # 8. internal source forge (any host or path)
  "internal forge reference|i|gitlab"
)

# Build one sed program that blanks every allowlisted literal.
sed_program=""
for allowed in "${ALLOWED[@]}"; do
  escaped="${allowed//./[.]}"
  sed_program+="s|${escaped}|<allowed-host>|g;"
done

violations=0
scanned=0

while IFS= read -r -d '' file; do
  skip=0
  for excluded in "${EXCLUDED_FILES[@]}"; do
    if [ "$file" = "$excluded" ]; then
      skip=1
      break
    fi
  done
  [ "$skip" -eq 1 ] && continue

  # Skip binaries: -I makes grep treat them as non-matching anyway, but this
  # keeps the scanned count honest.
  if ! grep -Iq "" "$file" 2>/dev/null; then
    continue
  fi

  scanned=$((scanned + 1))
  cleaned="$(sed "$sed_program" "$file")"

  for rule in "${RULES[@]}"; do
    category="${rule%%|*}"
    rest="${rule#*|}"
    flags="${rest%%|*}"
    pattern="${rest#*|}"

    if [ "$flags" = "i" ]; then
      hits="$(printf '%s\n' "$cleaned" | grep -I -n -E -i -- "$pattern" || true)"
    else
      hits="$(printf '%s\n' "$cleaned" | grep -I -n -E -- "$pattern" || true)"
    fi

    if [ -n "$hits" ]; then
      while IFS= read -r hit; do
        [ -z "$hit" ] && continue
        lineno="${hit%%:*}"
        text="${hit#*:}"
        printf '%s:%s: [%s] %s\n' "${file#./}" "$lineno" "$category" "$text"
        violations=$((violations + 1))
      done <<< "$hits"
    fi
  done
done < <(find . -path ./.git -prune -o -type f -print0)

echo
if [ "$violations" -gt 0 ]; then
  echo "content-guard: FAIL - ${violations} forbidden reference(s) in ${scanned} scanned file(s)."
  echo "content-guard: see CONTRIBUTING.md section 3 for what to write instead."
  exit 1
fi

echo "content-guard: OK - no forbidden references in ${scanned} scanned file(s)."
exit 0
