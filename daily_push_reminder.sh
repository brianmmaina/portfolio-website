#!/bin/zsh

REPO_PATH="/Users/brianmmaina/portfolio website"
NOW="$(date '+%Y-%m-%d %H:%M:%S')"

osascript <<EOF
tell application "Terminal"
  activate
  do script "cd \"$REPO_PATH\"; echo ''; echo '================ Daily Push Reminder ================'; echo 'Time: $NOW'; echo 'Run: git status'; echo 'Then: git add . && git commit -m \"day X: progress\" && git push'; echo '===================================================='; echo ''"
end tell
EOF
