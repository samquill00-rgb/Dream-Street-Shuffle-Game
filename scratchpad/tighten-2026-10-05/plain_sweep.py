"""Plain pages under the threshold panel: flash before the panel, header overlap, spill, double frames.
Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 ../tighten-2026-10-05/plain_sweep.py OUT"""
import sys, os, json
import harness; from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W = int(os.environ.get("RW", "960")); PRE = os.environ.get("PRE", "")
g = Game(width=W, height=800)
SEED = "(set: $haunts to (a:))(set: $alba to (a: $alba1, $alba2, $alba3))(set: $hasMissingPage to true)(set: $hasTrishaMatchbook to true)(set: $opponent to 'Jack Curtis')"
CASES = sys.argv[2:] or ["Soho Square Gents","Shana Reads","Carthage shore","His round","The Synthesis","Beaten","The dark pass","Standing","O'Flatterly's Gift","The Wheel","The Interval","Dawn Lily Sprig","Alley: Bateman's Buildings","The Colony Room Door","Colony drink","Lackland's Back Room","The Cave","Alt-Dawn","Himalayan Turn-Back","Which drink at the Pillars?","The Phone Box","Cow ride success","The Listening Moai","The Painter's Gaze","O'Flatterly introduction","The Ridge","The Fetch","The Blackout","Nazca Turn-Back","Cecil Court Approach","Maltese Gangsters","Maritime interlude","The Night Ahead","Aoife memory 2","Soho Square","Towards Dawn","Trisha's Loo","Coach and Horses","The Colony Room Door"]
PROBE = """() => {
 const tp=document.querySelector('tw-passage'); if(!tp) return {no:1};
 const v=document.querySelector('tw-story > .dss-threshold'); const b=v&&v.querySelector('.dss-room-prose');
 const hdr=document.querySelector('.stat-bars, #stat-bars-lifted, .header-links'); const hr=hdr&&hdr.getBoundingClientRect();
 const cs=getComputedStyle(tp);
 // plain text visible outside the panel?
 let plain=0; const w=document.createTreeWalker(tp,NodeFilter.SHOW_TEXT); while(w.nextNode()){const t=w.currentNode; if(!t.nodeValue.trim()) continue; const pe=t.parentNode; if(!pe||pe.closest('.dss-threshold, tw-include, script, style, #audit-name, #audit-state, tw-sidebar')) continue; if(pe.getClientRects().length) plain+=t.nodeValue.trim().length;}
 const r=b&&b.getBoundingClientRect();
 // nested framed blocks inside the panel (own border + background, wide)
 const frames=b?[...b.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e); const rr=e.getBoundingClientRect(); return rr.width>r.width*0.6 && rr.height>80 && s.borderTopWidth!=='0px' && s.borderTopStyle!=='none' && s.backgroundColor!=='rgba(0, 0, 0, 0)';}).map(e=>(e.tagName+'.'+e.className).slice(0,50)):[];
 return {mark: tp.getAttribute('data-dss-threshold'), op: cs.opacity, plain, panel: !!v,
   top: r?Math.round(r.top):null, bottom: r?Math.round(r.bottom):null, h: r?Math.round(r.height):null, sh: b?b.scrollHeight:null, ch: b?b.clientHeight:null,
   hdrBottom: hr?Math.round(hr.bottom):null, frames, links: b?[...b.querySelectorAll('tw-link')].filter(l=>l.getClientRects().length).map(l=>l.textContent.trim()).filter(t=>t!=='AUDIT READ').length:0,
   docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, fs: b?getComputedStyle(b).fontSize:null };
}"""
res = {}
for pas in CASES:
    p = g.page(pas, SEED)
    Game.click(p, "BEGIN", 0)
    tl = []
    for t in (250, 450, 650, 900, 1300, 2600):
        p.wait_for_timeout(t - (tl[-1][0] if tl else 0)); tl.append((t, p.evaluate(PROBE)))
    Game.clear_overlays(p)
    at = Game.name(p)
    fin = p.evaluate(PROBE)
    flash = [t for t,s in tl if s.get('plain',0)>0 and float(s.get('op',1))>0.05 and not s.get('panel')]
    notes = []
    if at != pas: notes.append("landed at %s" % at)
    if flash: notes.append("plain text visible before panel at %sms" % flash)
    if fin.get('panel'):
        if fin['hdrBottom'] and fin['top'] is not None and fin['top'] < fin['hdrBottom']: notes.append("panel under header (top %s < hdr %s)" % (fin['top'], fin['hdrBottom']))
        if fin['sh'] and fin['ch'] and fin['sh'] > fin['ch'] + 4: notes.append("scrolls inside (%s/%s)" % (fin['sh'], fin['ch']))
        if fin['frames']: notes.append("inner frames %s" % fin['frames'][:3])
        if fin['plain']>0: notes.append("plain text also outside panel (%s chars)" % fin['plain'])
    else:
        notes.append("NO PANEL mark=%s" % fin.get('mark'))
    if fin.get('docW',0) > W+2: notes.append("horizontal scroll %s" % fin['docW'])
    errs=[e[:160] for e in p._errs if 'audio' not in e.lower()]
    if errs: notes.append("JS %s" % errs[:1])
    print("%-30s %s | h=%s sh=%s ch=%s top=%s hdr=%s links=%s" % (pas, "; ".join(notes) or "ok", fin.get('h'), fin.get('sh'), fin.get('ch'), fin.get('top'), fin.get('hdrBottom'), fin.get('links')), flush=True)
    res[pas] = {"notes": notes, "final": fin, "timeline": tl}
    p.screenshot(path=os.path.join(OUT, PRE + "plain-" + pas.replace(" ", "_").replace("'", "").replace("?", "").replace(":", "") + ".png"))
    p.close()
g.close()
json.dump(res, open(os.path.join(OUT, PRE+"plain_sweep.json"), "w"), indent=1)
