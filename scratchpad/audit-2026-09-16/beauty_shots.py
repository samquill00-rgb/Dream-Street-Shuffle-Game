import sys, json
from harness import Game, URL
from playwright.sync_api import sync_playwright
tag=sys.argv[1]
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
class G(Game):
    def __init__(self,w=1280,h=900):
        self.pw=sync_playwright().start(); self.b=self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS); self.w,self.h=w,h
SHOTS=[("Dean Street","",3500),("The French","",2500),("Nazca Approach","",4000),("Easter Island Shore","",4000),("PP Pong","",2500),("Cecil Court Waltz","",2500),("Fight starts","",2500),("The Plain of Chebar","",3000),("Airport Pub","",4000),("The Walk In","",3500)]
g=G(); errs={}
for name,seed,wait in SHOTS:
    try:
        p=g.page(name,seeds=seed,audit_header=False); p.wait_for_timeout(wait); Game.clear_overlays(p)
        p.screenshot(path="beauty/%s_%s.png"%(tag,name.replace(' ','_')))
        errs[name]=[e for e in p._errs if 'audio' not in e.lower()][:3]; p.close()
    except Exception as e: errs[name]="ERR "+str(e)[:120]
g.w,g.h=390,780
for name in ("Dean Street","The French"):
    p=g.page(name,audit_header=False); p.wait_for_timeout(3000); Game.clear_overlays(p); p.screenshot(path="beauty/%s_phone_%s.png"%(tag,name.replace(' ','_'))); errs["phone "+name]=[e for e in p._errs if 'audio' not in e.lower()][:3]; p.close()
g.close(); print(json.dumps(errs))
