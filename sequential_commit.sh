#!/usr/bin/env bash

set -euo pipefail

SLEEP=10

# get a list of changed files | just print the second element separated by whitespace - the path | split the path on / and take the first element | loop over the list, each iteration becoming 'dir'
git status --porcelain | awk '{print $2}' | cut -d/ -f1 | sort -u | while read -r dir; do
    # stage everything within dir
    git add -- "$dir"
    # if there are staged commits then commit and push them
    if ! git diff --cached --quiet; then
        git commit -m "Add $dir"
        git push

        echo "Pushed $dir, waiting ${SLEEP}s..."
        sleep "$SLEEP"
    fi
done