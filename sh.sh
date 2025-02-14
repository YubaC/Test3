#!/usr/bin/env bash
# filepath: /d:/TEST0/GIT/Test3/scripts/create-release-pr.sh
set -Eeuo pipefail
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <version>" >&2
  exit 1
fi

VERSION="$1"
BRANCH="release/${VERSION}"

echo "Creating branch: ${BRANCH}"
git checkout -b "${BRANCH}"

echo "Adding changes..."
git add .

echo "Committing changes..."
git commit -m "chore: semantic release ${VERSION}"

echo "Pushing branch ${BRANCH} to remote..."
git push origin "${BRANCH}"

echo "Creating PR for branch ${BRANCH}..."
gh pr create --title "chore: semantic release ${VERSION}" \
             --body "chore: semantic release ${VERSION}" \
             --base main \
             --head "${BRANCH}" \

echo "Done."
