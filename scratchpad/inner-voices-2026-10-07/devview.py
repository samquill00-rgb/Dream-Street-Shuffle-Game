"""The dev panel's voices view: open the panel in the chippy, pick the chippy, flip a seen flag. Args: OUT"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
g = Game(width=1440, height=900)
p = g.page("Chinese Fish and Chips", "(set: $inisToldOfPillars to true)(set: $hadChippy to false)(set: $enteredVenue to true)")
p.evaluate("() => localStorage.setItem('dssVoicesSeen', JSON.stringify(['fi/the window']))")
Game.click(p, "BEGIN", 6000); Game.clear_overlays(p)
p.keyboard.press("Backquote"); p.wait_for_timeout(800)
p.click('.dss-dbg-vroom[data-room="cf"]'); p.wait_for_timeout(400)
print(p.evaluate("() => document.getElementById('dss-dbg-voices').innerText.split('\\n').slice(0, 16)"))
p.click('.dss-dbg-vseen[data-path="cf/the menu"]'); p.wait_for_timeout(300)
print('menu flipped:', p.evaluate("() => window.dssVoices.has('cf/the menu')"), p.evaluate("() => document.getElementById('dss-dbg-trails').textContent"))
p.evaluate("() => document.getElementById('dss-dbg-voices').scrollIntoView()")
p.screenshot(path=os.path.join(OUT, 'dev-voices.png'))
print(p._errs[:2])
# "Open" jumps into the room: pick the Coach, press Open, the page reloads into the Coach
p.click('.dss-dbg-vroom[data-room="cb"]'); p.wait_for_timeout(300)
p.click('#dss-dbg-voices .dss-dbg-jump'); p.wait_for_timeout(6000)
print("after Open:", p.evaluate("() => document.querySelector('#audit-name')?.textContent || location.hash"))
g.close()
