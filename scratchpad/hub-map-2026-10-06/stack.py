import sys, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
W, H = int(sys.argv[1]), int(sys.argv[2])
g = Game(width=W, height=H)
p = g.page("Dean Street", audit_header=False); Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
p.wait_for_timeout(3000); Game.clear_overlays(p)
print(json.dumps(p.evaluate("""() => { const tp=document.querySelector('tw-passage'); const out=[];
 const sel=['#dean-lamp-svg','h1.game-title','.scene-location','.scene-date','.soho-map-stage','.soho-map-bar'];
 for (const s of sel){ const e=tp.querySelector(s); if(!e) {out.push([s,null]); continue;} const r=e.getBoundingClientRect(), c=getComputedStyle(e); out.push([s, Math.round(r.top+pageYOffset), Math.round(r.bottom+pageYOffset), c.display, c.marginTop, c.marginBottom, c.paddingTop, c.paddingBottom, c.lineHeight, c.fontSize]); }
 // text nodes directly in the passage between title and map: wrap-less text, find br elements / the bag line
 const walker=document.createTreeWalker(tp, NodeFilter.SHOW_TEXT); const texts=[]; let n; while(n=walker.nextNode()){ if(n.textContent.trim().length>3 && !n.parentElement.closest('.soho-map-wrap, .soho-hub-dock, script, style, svg')){ const rg=document.createRange(); rg.selectNode(n); const r=rg.getBoundingClientRect(); if(r.height) texts.push([n.textContent.trim().slice(0,30), Math.round(r.top+pageYOffset), Math.round(r.bottom+pageYOffset), n.parentElement.tagName+'.'+n.parentElement.className]); } }
 out.push(['texts', texts.slice(0,12)]);
 const brs=[...tp.querySelectorAll(':scope > br, :scope > tw-hook > br')].map(b=>Math.round(b.getBoundingClientRect().top+pageYOffset)); out.push(['brs', brs.slice(0,20)]); const kids=[...tp.childNodes].map(k=>{ if(k.nodeType===3){ if(!k.textContent.trim()) return null; const rg=document.createRange(); rg.selectNode(k); const r=rg.getBoundingClientRect(); return ['#text', Math.round(r.top+pageYOffset), Math.round(r.bottom+pageYOffset), k.textContent.trim().slice(0,20)]; } if(!k.getBoundingClientRect) return null; const r=k.getBoundingClientRect(); if(!r.height && k.tagName!=='BR') return null; return [k.tagName+'.'+String(k.className).slice(0,20), Math.round(r.top+pageYOffset), Math.round(r.bottom+pageYOffset), (k.textContent||'').trim().slice(0,20)]; }).filter(Boolean).filter(k=>k[1]>380 && k[1]<560); out.push(['kids', kids]); const near=[...tp.childNodes].filter(k=>k.getBoundingClientRect && Math.abs(k.getBoundingClientRect().top+pageYOffset-392)<3).map(k=>k.outerHTML.slice(0,160)); out.push(['near', near]); const prev=[...tp.childNodes]; const bi=prev.findIndex(k=>k.tagName==='BR' && Math.abs(k.getBoundingClientRect().top+pageYOffset-392)<3); out.push(['before-br', prev.slice(Math.max(0,bi-4), bi+1).map(k=>k.nodeType===3?('#text:'+JSON.stringify(k.textContent.slice(0,40))):k.outerHTML.slice(0,140))]);
 return out; }"""), indent=0))
p.close(); g.close()
