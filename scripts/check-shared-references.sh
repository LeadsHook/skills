#!/usr/bin/env bash
#
# check-shared-references.sh - fail when copies of a shared skill reference drift.
#
# Some reference files are needed by more than one skill. Skills cannot reliably read
# each other's files on every client, so each skill carries its own copy. This script
# keeps those copies identical: edit one, copy it to the others, and this passes.
#
# Usage: bash scripts/check-shared-references.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS="$ROOT/plugins/leadshook/skills"

# One line per shared file: "<reference path>|<skill> <skill> ..."
SHARED=(
  "references/previews.md|build-decision-tree style-decision-tree"
  "references/brand-brief.md|style-decision-tree build-landing-page"
)

failures=0

for entry in "${SHARED[@]}"; do
  ref="${entry%%|*}"
  read -r -a skills <<< "${entry#*|}"
  first="$SKILLS/${skills[0]}/$ref"

  if [ ! -f "$first" ]; then
    echo "check-shared-references: missing ${skills[0]}/$ref"
    failures=$((failures + 1))
    continue
  fi

  for skill in "${skills[@]:1}"; do
    copy="$SKILLS/$skill/$ref"
    if [ ! -f "$copy" ]; then
      echo "check-shared-references: missing $skill/$ref (copy it from ${skills[0]})"
      failures=$((failures + 1))
    elif ! cmp -s "$first" "$copy"; then
      echo "check-shared-references: $skill/$ref differs from ${skills[0]}/$ref"
      failures=$((failures + 1))
    fi
  done
done

if [ "$failures" -gt 0 ]; then
  echo "check-shared-references: FAIL - ${failures} problem(s)."
  exit 1
fi

echo "check-shared-references: OK - ${#SHARED[@]} shared reference(s) in sync."
exit 0
