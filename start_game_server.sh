#!/bin/bash
# Dream Street Shuffle — local playtest server
# Run this once per session before playtesting in Claude/Cowork.
# It starts a local web server and opens the game in Chrome.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8765

# Check if something is already running on the port
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Server already running on port $PORT."
else
  echo "Starting server on http://localhost:$PORT ..."
  cd "$SCRIPT_DIR"
  python3 -m http.server $PORT &
  sleep 1
fi

# Open the game in Chrome
open -a "Google Chrome" "http://localhost:$PORT/Dream%20Street%20Shuffle.html"
echo "Game opened in Chrome."
echo ""
echo "Leave this Terminal window open while playtesting."
echo "Press Ctrl+C when you're done to stop the server."

# Keep the script running so the server stays alive
wait
