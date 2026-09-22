import json
from harness import Game, URL
from playwright.sync_api import sync_playwright
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
class G(Game):
    def __init__(self,w=1280,h=900):
        self.pw=sync_playwright().start(); self.b=self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS); self.w,self.h=w,h
def errs(p): return {"pageErrors":[e[:200] for e in p._errs if 'audio' not in e.lower()][:4],"console":[c[1][:160] for c in p._cons if 'textContent' not in c[1] and 'udio' not in c[1]][:5]}
g=G(); p0=g.b.new_page(); p0.goto(URL+"?dev=1",wait_until="domcontentloaded"); p0.wait_for_timeout(300); p0.close()
out={}
p=g.page("Nazca Race",audit_header=False); p.wait_for_timeout(3000)
out["nazcaButtons"]=p.evaluate("()=>[...document.querySelectorAll('button')].map(b=>b.id+':'+b.textContent.trim()).slice(0,8)")
btn=p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>/begin|start|race|go|drive/i.test(b.textContent));if(b){b.click();return b.textContent.trim()}return null}")
p.wait_for_timeout(800); p.keyboard.down("w"); p.wait_for_timeout(6000); p.screenshot(path="climb/astra_nazca_1.png"); p.keyboard.down("ArrowLeft"); p.wait_for_timeout(1200); p.keyboard.up("ArrowLeft"); p.keyboard.press(" "); p.wait_for_timeout(3000); p.keyboard.up("w"); p.screenshot(path="climb/astra_nazca_2.png")
out["nazca"]={"beginBtn":btn,"text":p.evaluate("()=>(document.querySelector('.nazca-race-frame')||document.querySelector('tw-passage')).innerText.replace(/\\s+/g,' ').slice(0,260)"),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"skip":p.evaluate("()=>getComputedStyle(document.getElementById('nz-race-skip')).display"),"errors":errs(p)}
links=p.evaluate("()=>[...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())"); out["nazcaLinks"]=links[:6]
sk=[l for l in links if 'skip' in l.lower()]
if sk: Game.click(p,sk[0],1800)
out["nazcaTeardown"]={"tags":p.evaluate("()=>document.querySelector('tw-passage')?.getAttribute('tags')"),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"errors":errs(p)}
p.close()
p=g.page("Pyramid Run",audit_header=False); p.wait_for_timeout(3000)
out["pyrButtons"]=p.evaluate("()=>[...document.querySelectorAll('button')].map(b=>b.id+':'+b.textContent.trim()).slice(0,8)")
btn=p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>/begin|start|run|go|descend/i.test(b.textContent));if(b){b.click();return b.textContent.trim()}return null}")
p.wait_for_timeout(1500); p.screenshot(path="climb/astra_pyr_1.png")
for i in range(9): p.wait_for_timeout(900); p.keyboard.press("ArrowUp")
p.screenshot(path="climb/astra_pyr_2.png")
out["pyramid"]={"beginBtn":btn,"text":p.evaluate("()=>(document.querySelector('.pr-stage')||document.querySelector('tw-passage')).innerText.replace(/\\s+/g,' ').slice(0,260)"),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"errors":errs(p)}
links=p.evaluate("()=>[...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())"); sk=[l for l in links if 'skip' in l.lower()]
if sk: Game.click(p,sk[0],1800)
out["pyrTeardown"]={"tags":p.evaluate("()=>document.querySelector('tw-passage')?.getAttribute('tags')"),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"errors":errs(p)}
p.close()
g.w,g.h=390,780
for name in ("Nazca Race","Pyramid Run"):
    p=g.page(name,audit_header=False); p.wait_for_timeout(3000); p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(b=>/begin|start|race|run|go|drive|descend/i.test(b.textContent));if(b)b.click()}"); p.wait_for_timeout(2500)
    out["phone "+name]={"scrollW":p.evaluate("()=>document.documentElement.scrollWidth"),"errors":errs(p)}; p.screenshot(path="climb/astra_phone_%s.png"%name.split()[0]); p.close()
g.close(); json.dump(out,open("climb/smoke_np.json","w"),indent=1); print(json.dumps(out))
