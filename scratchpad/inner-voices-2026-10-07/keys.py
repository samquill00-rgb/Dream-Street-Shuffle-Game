"""Keyboard and screen reader: Tab to an object (it lights, its name shows), Enter opens its card (focus on its first
choice), the card is announced and names each voice, Escape steps back to the object; a key pocketed by keyboard. Args: OUT"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
p = g.page("Chinese Fish and Chips", "(set: $inisToldOfPillars to true)(set: $hadChippy to false)(set: $enteredVenue to true)")
Game.click(p, "BEGIN", 1200)
for _ in range(200):
    if p.evaluate("() => !!document.querySelector('#cf-wrap canvas') && document.getElementById('cf-wrap').dataset.cam === 'idle' && !!document.getElementById('cf-wrap').dataset.words"): break
    p.wait_for_timeout(300)
p.wait_for_timeout(1200)
try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=2500)
except Exception: pass
p.wait_for_timeout(1500); Game.clear_overlays(p)
print("objects in tab order:", p.evaluate("() => [...document.querySelectorAll('#cf-wrap .dss-room-keys button')].filter(b=>b.tabIndex===0).map(b=>b.textContent)"))
p.focus('#cf-wrap .dss-room-keys button:nth-child(5)'); p.wait_for_timeout(500)
print("focused:", p.evaluate("() => document.activeElement.textContent"), "name shown:", p.evaluate("() => { const e=document.querySelector('#cf-wrap .dss-room-hovername'); return e && e.style.opacity==='1' ? e.textContent : null; }"))
p.screenshot(path=os.path.join(OUT, 'keys-1-focus.png'))
p.keyboard.press("Enter"); p.wait_for_timeout(1800)
print("card:", p.evaluate("() => { const c=document.querySelector('#cf-wrap .dss-room-card'); return {hidden: c.getAttribute('aria-hidden'), live: c.getAttribute('aria-live'), text: c.innerText.replace(/\\s+/g,' ').slice(0,260)}; }"))
print("focus now:", p.evaluate("() => document.activeElement.textContent + ' / ' + document.activeElement.getAttribute('role')"))
print("voices as read:", p.evaluate("() => [...document.querySelectorAll('#cf-wrap .dss-voice')].map(v=>v.textContent)"))
p.screenshot(path=os.path.join(OUT, 'keys-2-card.png'))
p.keyboard.press("Escape")
for _ in range(80):
    if p.evaluate("() => document.getElementById('cf-wrap').dataset.cam") == 'idle': break
    p.wait_for_timeout(150)
print("after Escape:", p.evaluate("() => document.getElementById('cf-wrap').dataset.cam"), "focus:", p.evaluate("() => document.activeElement.textContent"), "card hidden:", p.evaluate("() => document.querySelector('#cf-wrap .dss-room-card').getAttribute('aria-hidden')"))
# the ticket (the key) by keyboard
i = p.evaluate("() => [...document.querySelectorAll('#cf-wrap .dss-room-keys button')].findIndex(b=>b.textContent==='the ticket')")
p.wait_for_timeout(600); p.focus('#cf-wrap .dss-room-keys button:nth-child(%d)' % (i + 1)); p.keyboard.press("Enter"); p.wait_for_timeout(1800)
print("ticket focus:", p.evaluate("() => document.activeElement.textContent"))
p.keyboard.press("Enter"); p.wait_for_timeout(2000)
Game.click(p, "AUDIT READ", 400)
print("pocketed:", p.evaluate("() => (document.querySelector('#audit-state')?.innerText||'').split('\\n').filter(l=>/^dreamKey|^keyTicket/.test(l))"))
print("errors:", [e[:80] for e in p._errs if 'decode' not in e])
g.close()
