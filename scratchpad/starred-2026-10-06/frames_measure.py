"""Measure each minigame's frame width against the passage column. Args: OUTDIR label [W H]"""
import sys, time, urllib.parse, json, os
from playwright.sync_api import sync_playwright
OUT, label = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1440; H = int(sys.argv[4]) if len(sys.argv) > 4 else 900
CASES = sys.argv[5:] or ["Nazca Race", "Pyramid Run", "The Climb", "The Reclamation", "King's Chamber", "Trisha's Beer Mats", "Green Sea House of Cards", "PP Pong", "Fight starts", "Cecil Court Waltz", "Ride Jeffrey Bernard's cow"]
SEL = ".rc-stage,.hc-stage,.pr-stage,.nazca-race-stage,.pyr-run-stage,#dss-harmony,#dss-beer-mats,#dss-beer-mats .mats-stage,#bar-arena,.pp-arena,.trishas-frame,.worm-wall,.haunt-stage,.cig-stage,.hc-rules,.dss-rules-card,[class*='rules'],[id*='frame'],[class*='frame'],[class*='stage'],[class*='arena'],iframe,canvas"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    for pas in CASES:
        c = b.new_context(viewport={"width": W, "height": H}); p = c.new_page(); errs=[]
        p.on("pageerror", lambda e: errs.append(str(e)[:120]))
        p.goto("http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=" + urllib.parse.quote(pas)); time.sleep(6)
        for _ in range(4): p.evaluate("() => { document.querySelectorAll('#coin-overlay,#match-overlay,#cig-overlay,#eat-overlay,#dss-key-overlay,#dss-quest-overlay,#drink-popup-overlay,#spew-popup-overlay').forEach(e=>e.remove()); }"); time.sleep(0.2)
        info = p.evaluate("""(sel) => { const tp=document.querySelector('tw-passage'); const r=tp.getBoundingClientRect(); const cs=getComputedStyle(tp); const els=[...document.querySelectorAll(sel)].filter(e=>e.getClientRects().length && !e.closest('.stat-bars, #dss-notebook, tw-sidebar')); const seen=new Set(); const out=[]; for (const e of els) { const b=e.getBoundingClientRect(); if (b.width<200) continue; const k=e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:''); if(seen.has(k)) continue; seen.add(k); out.push([k, Math.round(b.x), Math.round(b.width), Math.round(b.height)]); } return {passage:[Math.round(r.x), Math.round(r.width), cs.maxWidth, cs.paddingLeft], els: out.slice(0,8), docW: document.documentElement.scrollWidth}; }""", SEL)
        print("%-28s %s" % (pas, json.dumps(info)), "errs", [e for e in errs if 'audio' not in e.lower()][:1], flush=True)
        p.screenshot(path=os.path.join(OUT, "%s-%s-%dx%d.png" % (label, pas.replace(' ','-').replace("'",''), W, H)))
        c.close()
    b.close()
