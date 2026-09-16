"""Playwright harness for Dream Street Shuffle audits.

run(name, target, seeds, actions) — boots the game with the Start passage
rewritten so that after its own (set:) defaults it applies BASE + seeds and
(go-to:)s target; then clicks each action link text in order; returns a dict
with passage name, tw-errors, JS errors, link texts and a state readout.
"""
import re, json, sys, time
from playwright.sync_api import sync_playwright

TWEE = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

src = open(TWEE, encoding="utf-8").read()
_hdr = re.compile(r'^:: (.+?)(?:\s+\[([^\]]*)\])?(?:\s+(\{[^\n]+\}))?\s*$', re.M)
_ms = list(_hdr.finditer(src))
BODIES = {}
TAGS = {}
for i, m in enumerate(_ms):
    BODIES[m.group(1)] = src[m.end():_ms[i+1].start() if i+1 < len(_ms) else len(src)]
    TAGS[m.group(1)] = (m.group(2) or "").split()

BASE = ('(set: $metRed to true)(set: $returns to 8)(set: $sawAoifeReflection to true)'
        '(set: $sawAoifeMemory2 to true)(set: $hadPhoneCall to true)(set: $hadLilyCall1 to true)'
        '(set: $hadDualRing to true)(set: $shownOpenNightTip to true)(set: $shownVenueHint to true)'
        '(set: $primerShown to true)(set: $hasMatches to true)(set: $hasCoin to true)'
        '(set: $alba to (a: $alba1))(set: $visited\'s French to true)')

STATE_VARS = ["returns","metCritic","inisToldOfPillars","dreamKey","alba","haunts","metShana",
              "completedSetlist","metDavy","knowsCopperSecret","sobriety","confidence","coachUrgent",
              "hasDrawing","completedDreams","worldsVisited","keyTicket","keyLighter","keyEye",
              "keySlip","keyCocaine","nightPhase","hasCoin","hasMatches","returnedPage"]

AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n'
                '(link-repeat: "AUDIT READ")[<div id="audit-state">(print: (dm: '
                + ",".join('"%s", $%s' % (v, v) for v in STATE_VARS) + '))</div>]')

OVERLAYS = ('#coin-overlay,#match-overlay,#cig-overlay,#eat-overlay,#dss-key-overlay,'
            '#dss-quest-overlay,#drink-popup-overlay,#spew-popup-overlay')

INIT_JS = """({start, header}) => {
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.querySelector('tw-passagedata[name="Start"]');
    const h = document.querySelector('tw-passagedata[name="header header"]');
    if (start !== null) s.textContent = start;
    if (header !== null) h.textContent = header;
    if (start !== null) document.querySelector('tw-storydata').setAttribute('startnode', s.getAttribute('pid'));
  });
}"""

class Game:
    def __init__(self, headless=True, width=1280, height=900):
        self.pw = sync_playwright().start()
        self.b = self.pw.chromium.launch(headless=headless, executable_path=CHROME)
        self.w, self.h = width, height

    def close(self):
        self.b.close(); self.pw.stop()

    def page(self, target=None, seeds="", audit_header=True, base=True, start_override=None):
        p = self.b.new_page(viewport={"width": self.w, "height": self.h})
        errs = []
        p.on("pageerror", lambda e: errs.append(str(e) + " @@ " + (e.stack or "")[:600]))
        p.on("requestfailed", lambda r: cons.append(("reqfail", r.url)))
        p.on("response", lambda r: cons.append(("http"+str(r.status), r.url)) if r.status >= 400 else None)
        cons = []
        p.on("console", lambda m: cons.append((m.type, m.text)) if m.type in ("error","warning") else None)
        p._errs = errs; p._cons = cons
        if start_override is not None:
            start = start_override
        elif target is not None:
            start = BODIES["Start"].replace('(go-to: "The Night Ahead")',
                     (BASE if base else "") + seeds + '\n(go-to: ' + json.dumps(target) + ')')
        else:
            start = None
        header = BODIES["header header"] + AUDIT_HEADER if audit_header else None
        p.add_init_script("(" + INIT_JS + ")(" + json.dumps({"start": start, "header": header}) + ")")
        p.goto(URL, wait_until="domcontentloaded")
        p.wait_for_timeout(1300)
        return p

    @staticmethod
    def clear_overlays(p, rounds=6):
        for _ in range(rounds):
            n = p.evaluate("""(sel) => { let n=0; document.querySelectorAll(sel).forEach(e=>{n++; e.remove();}); return n; }""", OVERLAYS)
            if not n: break
            p.wait_for_timeout(200)

    @staticmethod
    def click(p, text, wait=700):
        ok = p.evaluate("""(txt) => { const e=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()===txt); if(!e) return false; e.click(); return true; }""", text)
        p.wait_for_timeout(wait)
        return ok

    @staticmethod
    def name(p):
        return p.evaluate("() => document.querySelector('#audit-name')?.textContent || document.querySelector('tw-passage')?.getAttribute('tags') || '?'")

    @staticmethod
    def snapshot(p):
        Game.click(p, "AUDIT READ", 250)
        return p.evaluate("""() => ({
          at: document.querySelector('#audit-name')?.textContent,
          state: document.querySelector('#audit-state')?.textContent,
          twErrors: [...document.querySelectorAll('tw-error')].map(e=>e.textContent.slice(0,300)),
          links: [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim()).filter(t=>t!=='AUDIT READ'),
          textSample: (document.querySelector('tw-passage')?.innerText||'').slice(0,4000),
        })""")

def run(g, name, target, seeds="", actions=(), clear=True, base=True):
    p = g.page(target, seeds, base=base)
    Game.click(p, "BEGIN", 900)
    if clear: Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
        if clear: Game.clear_overlays(p)
    steps = []
    for a in actions:
        if clear: Game.clear_overlays(p)
        ok = Game.click(p, a)
        if clear: Game.clear_overlays(p)
        steps.append((a, ok, Game.name(p)))
    snap = Game.snapshot(p)
    out = {"name": name, "steps": steps, **snap, "jsErrors": list(p._errs), "console": list(p._cons)}
    p.close()
    return out
