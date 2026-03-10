#!/bin/bash
# Start Game Server — double-click this once to serve the game locally.
# Keep the Terminal window open while you're working.
cd "$(dirname "$0")"
echo "Game server starting at http://localhost:8765"
echo "Open that URL in Chrome — keep this window open."
python3 -m http.server 8765
