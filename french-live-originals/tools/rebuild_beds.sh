#!/bin/bash
# Rebuild the French bar and the four indoor venue beds after changing a dial in recipes.py, ticking glasses,
# or dropping a new recording into glass-originals/. Refreshes glass.html, renders with the floor, and copies
# the finished beds to where the game loads them (and to layered-with-floor/). Needs clean/ (make_clean.sh).
set -e
cd "$(dirname "$0")"
/usr/bin/python3 glass.py
/usr/bin/python3 recipes.py french_bar busy_bar warm_pub quiet_lounge colony_room --floor
for n in the-french-pub-layered indoor-busy-bar indoor-warm-pub indoor-quiet-lounge indoor-colony-room; do
  cp "out/$n-floor.m4a" ../../
  cp "out/$n-floor.m4a" ../layered-with-floor/
done
echo "beds copied into the game folder"
