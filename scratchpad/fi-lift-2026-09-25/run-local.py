from pathlib import Path
import sys, types, runpy
root=Path('/Users/samquill/Claude work/Dream Street Shuffle - Game Files')
src=(root/'scratchpad/audit-2026-09-16/harness.py').read_text().replace('/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee',str(root/'Dream Street Shuffle.twee')).replace('/opt/pw-browsers/chromium-1194/chrome-linux/chrome','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
if 'reduced' in sys.argv: src=src.replace('p.goto(URL,', "p.emulate_media(reduced_motion='reduce')\n        p.goto(URL,")
h=types.ModuleType('harness'); exec(compile(src,'harness-local','exec'),h.__dict__); sys.modules['harness']=h
runpy.run_path(str(root/'scratchpad/scene-closeups-2026-09-25/fi_shot.py'),run_name='__main__')
