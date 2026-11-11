#!/bin/bash
# Double-click this file to preview the portfolio at http://localhost:5173
# Keep the Terminal window open while you look at the site; close it to stop.
cd "$(dirname "$0")/site/yael-portfolio" || exit 1
PORT=5173
if lsof -i :$PORT >/dev/null 2>&1; then
  echo "The preview is already running."
  open "http://localhost:$PORT"
  exit 0
fi
echo "Starting the portfolio preview at http://localhost:$PORT"
echo "Keep this window open while you look at the site. Close it to stop."
(sleep 1; open "http://localhost:$PORT") &
python3 -m http.server $PORT
