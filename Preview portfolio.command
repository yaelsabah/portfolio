#!/bin/bash
# Double-click this file to preview the portfolio at http://localhost:5173
# Keep the Terminal window open while you look at the site; close it to stop.
cd "$(dirname "$0")" || exit 1
PORT=5173
if lsof -i :$PORT >/dev/null 2>&1; then
  echo "A preview is already running, so this just opens the browser."
  echo "If pages look out of date, close the other preview window and double-click this file again."
  open "http://localhost:$PORT"
  exit 0
fi
(sleep 1; open "http://localhost:$PORT") &
python3 serve.py $PORT
