"""The test route as a first-time player, with a handover probe at every arrival.
Steps: 'link:Text' clicks a tw-link (or any button/.dss-room-* control with that text); 'door:id' teleports beside a map door and walks in;
'veil' dismisses a room's entry modal; 'card:Name' opens a room close-up by hotspot name; 'wait:ms'.
Args: OUT PRE then steps. Env: real light unless DSS_FAST."""
import sys, os, json, time
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
import harness; from harness import Game
OUT, PRE = sys.argv[1], sys.argv[2]; STEPS = sys.argv[3:]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
p = g.page(os.environ.get("ROUTE_TARGET") or None, os.environ.get("ROUTE_SEEDS", ""))   # untouched Start unless ROUTE_TARGET
OVER = "#coin-overlay,#cig-overlay,#eat-overlay,#dss-key-overlay,#venue-hint-overlay,#word-wise-overlay,#wtw-overlay,#liver-eat-overlay,.dss-rules-overlay,#match-overlay,.coach-plumbing-intro,.dss-room-veil-on,tw-story>.dss-threshold,#drink-popup,.drink-popup,.spew-popup,#spew-overlay,.haunt-box,.lore-box,.item-overlay,tw-error"
PROBE = """(sel) => { const vis=e=>{ if(!e.getClientRects().length) return false; const cs=getComputedStyle(e); return cs.visibility!=='hidden' && cs.opacity!=='0' && cs.display!=='none'; };
 const over=[...document.querySelectorAll(sel)].filter(vis).map(e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ').slice(0,2).join('.'):''));
 const tps=[...document.querySelectorAll('tw-passage')].filter(e=>!e.closest('.dss-ghost')); const tp=tps[tps.length-1];
 let plain=0; if(tp){ const w=document.createTreeWalker(tp,NodeFilter.SHOW_TEXT); while(w.nextNode()){const t=w.currentNode; if(!t.nodeValue.trim()) continue; const pe=t.parentElement; if(!pe||pe.closest('.dss-threshold, .dss-room-veil, script, style, #audit-name, #audit-state, tw-sidebar, .dss-hub-flag')) continue; if(pe.getClientRects().length && vis(pe)) plain+=t.nodeValue.trim().length;} }
 return {n: tps.length, op: tp?getComputedStyle(tp).opacity.slice(0,4):null, over, plain, at: document.querySelector('#audit-name')?.textContent||'', stats: (document.querySelector('.stat-bars')||{innerText:''}).innerText.replace(/\\s+/g,' ').slice(0,60)}; }"""
def probe(label):
    t0 = time.time(); tl = []
    for i in range(21):
        tl.append((int((time.time()-t0)*1000), p.evaluate(PROBE, OVER))); p.wait_for_timeout(150)
    notes = []
    for t, s in tl:
        big = [o for o in s['over'] if not o.startswith('tw-story>') and 'dss-threshold' not in o]
        if len(s['over']) >= 2 and len(set(o.split('.')[0]+o.split('.')[-1] for o in s['over'])) >= 2: notes.append("%dms two overlays %s" % (t, s['over']))
        if 'tw-error' in ' '.join(s['over']): notes.append("%dms tw-error" % t)
        if s['n'] >= 2 and t > 1200: notes.append("%dms two passages" % t)
    panel = any('dss-threshold' in ' '.join(s['over']) or 'dss-room-veil' in ' '.join(s['over']) for t, s in tl)
    flash = [t for t, s in tl if s['plain'] > 0 and float(s['op'] or 1) > 0.05 and not any('dss-threshold' in o or 'dss-room-veil' in o for o in s['over'])]
    if panel and flash and flash[0] < 900: notes.append("plain text before the panel at %sms" % flash[:3])
    last = tl[-1][1]
    errs = [e[:120] for e in p._errs if 'audio' not in e.lower()]
    print("%-34s at=%-28s over=%s stats=%s %s %s" % (label, last['at'], last['over'], last['stats'][:40], ("| " + "; ".join(sorted(set(notes)))) if notes else "", ("JS " + str(errs[-1:])) if errs else ""), flush=True)
    p.screenshot(path=os.path.join(OUT, "%s%02d-%s.png" % (PRE, probe.i, label.replace(':','-').replace(' ','_').replace('.','')[:30]))); probe.i += 1
probe.i = 0
def links(): return p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link, tw-passage button, .dss-room-veil tw-link, .dss-room-veil button, .dss-room-card button, .dss-room-card tw-link, .dss-room-strip button, [id$=-enter-btn], div[style*=cursor]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()).filter(t=>t && t!=='AUDIT READ')")
def click_text(text):
    return p.evaluate("""(text) => { const els=[...document.querySelectorAll('tw-link, button, [role=button], div, span, a')].filter(e=>e.textContent.trim()===text && e.getClientRects().length && ![...e.children].some(c=>c.textContent.trim()===text)); if(!els.length) return false; els[els.length-1].click(); return true; }""", text)
if os.environ.get("ROUTE_TARGET"): click_text("BEGIN"); p.wait_for_timeout(1500)
probe("start")
for step in STEPS:
    kind, _, arg = step.partition(':')
    if kind == 'link' or kind == 'btn':
        ok = False
        for alt in arg.split('|'):
            if click_text(alt): ok = True; step = kind + ':' + alt; break
        if not ok: print("NO LINK", arg, "have", links()[:12], flush=True); break
    elif kind == 'door':
        d = p.evaluate("(id) => { const d=(window.__dssDoors||[]).find(x=>x.id===id); return d?[d.c,d.r,d.fc,d.fr]:null; }", arg)
        if not d: print("NO DOOR", arg, flush=True); break
        p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", d[2:]); p.wait_for_timeout(500)
        dc, dr = d[0]-d[2], d[1]-d[3]; key = 'ArrowRight' if dc>0 else 'ArrowLeft' if dc<0 else 'ArrowDown' if dr>0 else 'ArrowUp'
        p.keyboard.down(key); p.wait_for_timeout(900); p.keyboard.up(key)
    elif kind == 'tele':
        c, r, key = arg.split(',')
        for _ in range(40):
            if p.evaluate("() => !!document.querySelector('.soho-map-stage canvas') && !!window.__dssSohoTeleport"): break
            p.wait_for_timeout(250)
        ok = p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [int(c), int(r)]); p.wait_for_timeout(600); print("  teleport", ok, flush=True)
        if key: p.keyboard.down(key); p.wait_for_timeout(1400); p.keyboard.up(key)
    elif kind == 'veil':
        p.evaluate("() => { const v=document.querySelector('.dss-room-veil-on'); if(v) v.click(); }")
    elif kind == 'card':
        p.evaluate("(n) => { const s=(window.dssRoomReveal&&window.dssRoomReveal.spots||[]); return window.dssRoomOpen ? window.dssRoomOpen(n) : null; }", arg)
    elif kind == 'wait':
        p.wait_for_timeout(int(arg)); continue
    elif kind == 'clear':
        Game.clear_overlays(p); continue
    probe(step)
print("END links:", links()[:14], flush=True)
g.close()
