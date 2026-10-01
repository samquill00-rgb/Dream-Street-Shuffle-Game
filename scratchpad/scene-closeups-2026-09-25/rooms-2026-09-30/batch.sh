#!/bin/bash
# phone (390) and reduced-motion (1280) walks of the six new rooms, one batch
cd /home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16
SP=/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/a04c9ce2-be29-569b-a134-280a80f366a5/scratchpad
export PYTHONPATH=.:../scene-closeups-2026-09-25
for mode in "390" "1280 reduced"; do
  for r in cb ti lk cf oi; do echo "######## $r $mode"; timeout 1500 python3 $SP/five_routes.py $r $SP/shots $mode 2>&1 | awk '/^  ok/{n++; next} {print} END{print "  checks ok: " n}'; done
  echo "######## cu $mode"; timeout 900 python3 $SP/cu_routes.py $SP/shots $mode 2>&1 | awk '/^  ok/{n++; next} {print} END{print "  checks ok: " n}'
done
echo finished
