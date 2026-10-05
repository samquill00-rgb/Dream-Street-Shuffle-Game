"""Visible text nodes with a straight apostrophe or quote, outside tw-link (link labels stay straight on purpose). Args: OUT [passages]"""
import sys, os, json
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
SEED = "(set: $haunts to (a:))(set: $alba to (a: $alba1, $alba2, $alba3))(set: $hasMissingPage to true)(set: $hasTrishaMatchbook to true)(set: $opponent to 'Jack Curtis')"
CASES = sys.argv[1:] or ["Dean Street","The Night Ahead","Nazca Race","Pyramid Run","The Climb","The Reclamation","Trisha's Beer Mats","Fight starts","Cecil Court Waltz","PP Pong","Ride Jeffrey Bernard's cow","Green Sea House of Cards","Soho Square Gents","Towards Dawn","The Dawn","Alt-Dawn","The Blackout","The Fetch","Centre Point","The Phone Box","Soho Square","Coach and Horses","Trisha's","The French House","The Colony Room","Ronnie Scott's","The Pillars of Hercules","Lackland's","Cecil Court Approach","Chinese Fish and Chips","Copper's Cellar","O'Flatterly introduction","The Interval","Night Summary"]
PROBE = """() => { const out=[]; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); while(w.nextNode()){ const t=w.currentNode, v=t.nodeValue; if(!/['"]/.test(v)) continue; const pe=t.parentElement; if(!pe||pe.closest('script, style, tw-link, #audit-name, #audit-state, tw-sidebar, [hidden]')) continue; if(!pe.getClientRects().length) continue; const cs=getComputedStyle(pe); if(cs.visibility==='hidden'||cs.opacity==='0') continue; out.push({tag:pe.tagName.toLowerCase()+(pe.className&&typeof pe.className==='string'?'.'+pe.className.split(' ')[0]:''), text:v.trim().slice(0,90)}); } return out; }"""
g = Game(width=1440, height=900)
for pas in CASES:
    try:
        p = g.page(pas, SEED); Game.click(p, "BEGIN", 0); p.wait_for_timeout(2500); Game.clear_overlays(p); p.wait_for_timeout(800)
        hits = p.evaluate(PROBE); at = Game.name(p)
        for h in hits: print("%-28s %-26s %s" % (pas if at==pas else pas+" ("+at+")", h['tag'][:26], h['text']), flush=True)
        p.close()
    except Exception as e: print(pas, "ERR", str(e)[:80], flush=True)
g.close()
