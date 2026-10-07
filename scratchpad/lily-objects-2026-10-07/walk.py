"""Lily on the object: per venue, check the lily is not offered in the words, the object wears the emblem, taking it from the card works."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib
Game = importlib.import_module(os.environ.get('HARNESS','harness')).Game
OUT = sys.argv[1]; W, H = int(sys.argv[2]), int(sys.argv[3]); only = sys.argv[4:] 
os.makedirs(OUT, exist_ok=True)
V = [("chippy", "Chinese Fish and Chips", "cf-wrap", 1, "(set: $hadChippy to false)"),
     ("pillars", "Entering The Pillars of Hercules", "pi-wrap", 2, "(set: $metCritic to true)"),
     ("ronnies", "Ronnie Scott's", "ri-wrap", 3, "(set: $knowsRonnies to true)"),
     ("colony", "The Colony Room", "ci-wrap", 4, ""),
     ("french", "The French", "fi-wrap", 5, "")]
g = Game(width=W, height=H)
res = {}
for key, pas, w, n, seeds in V:
    if only and key not in only: continue
    p = g.page(pas, seeds + "(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
    def cam(): return p.evaluate("(w) => { const e=document.getElementById(w); return e ? e.dataset.cam : null; }", w)
    for _ in range(200):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle' && !!document.getElementById(w).dataset.words", w): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1500); Game.clear_overlays(p)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=3000)
    except Exception as e: print(key, "no dismiss", e)
    p.wait_for_timeout(2500)
    r = {}
    r["hookInWords"] = p.evaluate("(n) => { const h=document.querySelector('tw-hook[name=\"lily'+n+'\"]'); return h ? {claimed: h.classList.contains('dss-claimed'), rects: h.getClientRects().length} : null; }", n)
    r["strip"] = p.evaluate("() => [...document.querySelectorAll('.dss-room-strip-btn')].map(b=>b.textContent)")
    gl = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); const sp=e.hotspots; const out=[]; g.children.forEach((s,i)=>out.push([s.position.x,s.position.y,s.position.z,s.visible,!!(s.material.map&&s.material.map.image&&s.material.map.image.width===256&&!s.renderOrder===999)])); return out; }", w)
    lilyAt = p.evaluate("(w) => { const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); const s=g.children.find(s=>s.visible && s.renderOrder===999); if(!s) return null; const v=s.position.clone().project(e.camera); const c=document.querySelector('#'+w+' canvas'); const r=c.getBoundingClientRect(); return [r.left+(v.x+1)/2*r.width, r.top+(1-v.y)/2*r.height]; }", w)
    r["lilyAt"] = lilyAt
    p.screenshot(path=os.path.join(OUT, "%d-%s-1-room.png" % (n, key)))
    if lilyAt:
        x, y = lilyAt
        p.screenshot(path=os.path.join(OUT, "%d-%s-2-emblem-close.png" % (n, key)), clip={"x": max(0, x-150), "y": max(0, y-110), "width": 300, "height": 220})
        p.mouse.move(x, y); p.wait_for_timeout(400); p.mouse.down(); p.mouse.up()
        for _ in range(150):
            if cam() == 'inspect': break
            p.wait_for_timeout(150)
        p.wait_for_timeout(700)
        r["card"] = p.evaluate("(w) => { const d=document.querySelector('#'+w+' .dss-room-card'); return d && d.style.opacity==='1' ? [...d.querySelectorAll('.fi-action')].map(b=>b.textContent) : null; }", w)
        p.screenshot(path=os.path.join(OUT, "%d-%s-3-card.png" % (n, key)))
        took = p.evaluate("(w) => { const b=[...document.querySelectorAll('#'+w+' .dss-room-card .fi-action')].find(b=>b.textContent==='Always take a flower'); if(!b) return false; b.click(); return true; }", w)
        r["pressed"] = took
        for _ in range(150):
            if cam() == 'idle': break
            p.wait_for_timeout(150)
        p.wait_for_timeout(2500)
        r["after"] = p.evaluate("([n,w]) => { const h=document.querySelector('tw-hook[name=\"lily'+n+'\"]'); const e=window._dssThreeRegistry[w]; const g=e.scene.getObjectByName('restGlow'); return {glimpse: h && !!h.querySelector('.lily-glimpse'), claimed: h && h.classList.contains('dss-claimed'), rects: h && h.getClientRects().length, words: document.getElementById(w).dataset.words, lilySprites: g.children.filter(s=>s.visible && s.renderOrder===999).length}; }", [n, w])
        p.screenshot(path=os.path.join(OUT, "%d-%s-4-after.png" % (n, key)))
    Game.click(p, "AUDIT READ", 400)
    r["state"] = p.evaluate("() => (document.querySelector('#audit-state')?.textContent||'').slice(0,90)")
    r["jsErrors"] = p._errs[:3]
    res[key] = r; print(key, json.dumps(r, ensure_ascii=False), flush=True)
    p.close()
g.close()
