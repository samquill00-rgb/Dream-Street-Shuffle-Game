#!/bin/bash
# sequential, two at a time at most: rooms (ten), dream loop routes, night walk, ship E re-run, sweep
cd /home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16
O=../review-2026-10-04/out; SC=../scene-closeups-2026-09-25; K=$SC/rooms-2026-09-30
export PYTHONPATH=.:$SC DSS_FAST=1
( for r in fi ci pi ri; do echo "######## $r"; timeout 1200 python3 $SC/${r}_routes.py $O/rooms 1280 2>&1 | awk '/^  ok/{n++; next} {print} END{print "  checks ok: " n}'; done
  for r in cb ti lk cf oi; do echo "######## $r"; timeout 1200 python3 $K/five_routes.py $r $O/rooms 1280 2>&1 | awk '/^  ok/{n++; next} {print} END{print "  checks ok: " n}'; done
  echo "######## cu"; timeout 900 python3 $K/cu_routes.py $O/rooms 1280 2>&1 | awk '/^  ok/{n++; next} {print} END{print "  checks ok: " n}'
  echo ROOMS_DONE ) > $O/rooms.log 2>&1 &
( cd /home/user/Dream-Street-Shuffle-Game && PYTHONPATH=scratchpad/audit-2026-09-16 python3 scratchpad/review-2026-10-04/night.py scratchpad/review-2026-10-04/out/night > scratchpad/review-2026-10-04/out/night.log 2>&1
  cd scratchpad/audit-2026-09-16 && ROUTES_OUT=$O/routes.json timeout 1500 python3 ../polish-loop-2026-09-23/routes.py 1280 > $O/routes.log 2>&1
  echo NIGHT_ROUTES_DONE >> $O/night.log ) &
wait; echo BATCH2_DONE
