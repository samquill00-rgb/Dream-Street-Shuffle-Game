#!/bin/bash
# extract the UserScript passage and node --check it
cd /home/user/Dream-Street-Shuffle-Game
python3 - <<'PY'
import re
src=open("Dream Street Shuffle.twee",encoding="utf-8").read()
i=src.index(":: UserScript")
j=src.index("\n:: ", i+5)
open("${TMPDIR:-/tmp}/dss-userscript.js","w").write(src[src.index("\n",i)+1:j])
PY
/opt/node22/bin/node --check ${TMPDIR:-/tmp}/dss-userscript.js && echo "node --check OK"
