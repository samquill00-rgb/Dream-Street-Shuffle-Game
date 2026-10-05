import sys, os
from PIL import Image
B='/mnt/project-files/ghosts-2026-10-05/before/'; A='/mnt/project-files/ghosts-2026-10-05/after/'
O='/home/user/Dream-Street-Shuffle-Game/scratchpad/ghosts-2026-10-05/'
for n in sys.argv[1:]:
    if os.path.exists(B+n) and os.path.exists(A+n):
        b=Image.open(B+n).crop((0,340,1280,710)); a=Image.open(A+n).crop((0,340,1280,710))
        out=Image.new('RGB',(1280,744)); out.paste(b,(0,0)); out.paste(a,(0,374)); out.save(O+'cmp-'+n); print('wrote',n)
    else: print('missing',n)
