"""The silent second doorway visit (17-18 Nov call 9, seen once, not reproduced): try to make it happen through the map.

Plays Dean Street the way a player does: walks onto the Livonia Street doorway, presses E, holds the card,
then steps back into the doorway again at set moments and presses E, logging every quarter second what
the map's busy() would see (its own selectors, copied from the map IIFE ~.twee 6345 and dssOverlayBusy
~.twee 6394), whether "Step into the doorway." shows, and whether a press gave a card or a gain.

  ~/.dss-regress/venv/bin/python -u tools/doorway_repro.py ["Test Start 4"]

Queued for after the full regression (headless, never beside it). What it should show if the trace is right:
a press while a hint slip or the fading card is up does nothing and says nothing.
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import tools_regress as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

START = sys.argv[1] if len(sys.argv) > 1 else "Test Start 4"
SPOT, STAND = (4, 10), (5, 10)   # the Livonia Street doorway's tile and the tile beside it (DOORS 'dwlivonia', ~.twee 6575)

WHY = r"""() => {
  var hits = [], q = function (s) { return [].filter.call(document.querySelectorAll(s), function (e) { return !e.closest('.dss-ghost'); }); };
  ['.dss-room-card[aria-hidden="false"]', '.dss-hint-slip:not(.out)', 'tw-dialog', '.phone-ringing:not(.ring-wait)', '.dss-rules-overlay', '.dss-slip-fly', '.dss-refusal:not(.dss-filed)',
   '#coin-overlay', '#match-overlay', '#cig-overlay', '#eat-overlay', '#dss-key-overlay', '#dss-lily-overlay', '#dss-quest-overlay', '#liver-eat-overlay', '#napkin-popup-overlay',
   '#drink-popup-overlay', '#spew-popup-overlay', '.coach-plumbing-intro', '.dss-mandala-intro', '#dss-lore-overlay', '#dss-gate-flash', '#dss-photo-pop', '#dss-print-viewer[open]', '#dss-boot-veil']
   .forEach(function (s) { var m = q(s); if (m.length) hits.push(s + (s.indexOf('slip') >= 0 ? ' "' + m[0].textContent.trim().slice(0, 50) + '"' : '')); });
  if (window._drinkPopupOpen === true) hits.push('_drinkPopupOpen');
  var b = document.querySelector('.dss-doorway-btn');
  return { busy: hits, btn: !!(b && b.style.display !== 'none' && b.offsetParent), at: window.__dssSohoWhere ? window.__dssSohoWhere() : null,
           card: !!document.getElementById('spew-popup-overlay'), pn: ((document.getElementById('dss-pn') || {}).textContent || '').trim(), pend: window._dssPopPending || 0 };
}"""


def log(t0, what, s):
    print("%6.2fs  %-28s at %-8s btn %-5s card %-5s pend %d  busy: %s" % (time.time() - t0, what, s["at"], s["btn"], s["card"], s["pend"], "; ".join(s["busy"]) or "-"), flush=True)


def onto_doorway(r):
    """Teleport beside the doorway and step onto it with the arrow key, as a player arrives."""
    r.wait_for("() => typeof window.__dssSohoTeleport === 'function'", 15000, "the Soho map")
    r.expect(r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", list(STAND)), "the tile beside the doorway is not walkable")
    r.page.keyboard.press("ArrowLeft"); r.page.wait_for_timeout(700)
    return r.js("() => window.__dssSohoWhere()") == list(SPOT)


def hold_card(r):
    r.wait_for("() => !!document.querySelector('#spew-popup-overlay canvas')", 10000, "the doorway card")
    r.page.wait_for_timeout(900)
    box = r.js("() => { var b = document.querySelector('#spew-popup-overlay canvas').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
    r.page.mouse.move(*box); r.page.mouse.down(); r.page.wait_for_timeout(1500); r.page.mouse.up()


def try_press(r, t0, label):
    """On the doorway, press E; say whether a card came within 3 s."""
    before = r.js(T.STATS)
    s = r.js(WHY); log(t0, label + " (before E)", s)
    r.page.keyboard.press("e")
    got = False
    for _ in range(12):
        r.page.wait_for_timeout(250)
        if r.js("() => !!document.getElementById('spew-popup-overlay')"): got = True; break
    s = r.js(WHY); log(t0, label + (" -> CARD" if got else " -> NOTHING"), s)
    return got, before


def main():
    srv = T.serve(); port = srv.server_address[1]
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=T.chrome_path(), headless=True, args=T.FLAGS)
        r = T.Run(browser, port, "doorway-repro")
        try:
            r.go(START, wait=10000)
            r.clear_lore(); r.clear_slips(); r.clear_lore()
            t0 = time.time()
            print("start: %s, stats %s" % (r.pn(), r.js(T.STATS)))
            r.expect(onto_doorway(r), "could not step onto the doorway (at %s)" % r.js("() => window.__dssSohoWhere()"))
            got, before = try_press(r, t0, "first visit")
            r.expect(got, "the first visit gave no card")
            hold_card(r)
            # the card fades about 7.9 s after a finished hold; watch the map come back, quarter second by quarter second
            for _ in range(24):
                r.page.wait_for_timeout(250); log(t0, "after the hold", r.js(WHY))
            print("stats after the first visit: %s (were %s)" % (r.js(T.STATS), before), flush=True)
            # A: back in as soon as the map takes a step (whatever is still up)
            if onto_doorway(r):
                got, _ = try_press(r, t0, "A: straight back in")
                if got: hold_card(r); r.wait_for("() => !document.getElementById('spew-popup-overlay')", 15000, "the card to close")
            r.page.wait_for_timeout(1500)
            # B: with a hint slip up, as a primer or a lingering slip would be
            r.js("() => window.dssInlineHint && window.dssInlineHint('A test slip, as one left over from the last page would be.')")
            r.page.wait_for_timeout(600)
            if onto_doorway(r) or r.js("() => window.__dssSohoWhere()") == list(SPOT):
                try_press(r, t0, "B: with a slip up")
            # C: the slip gone, the same press
            r.clear_slips(); r.page.wait_for_timeout(800)
            if r.js("() => window.__dssSohoWhere()") == list(SPOT) or onto_doorway(r):
                try_press(r, t0, "C: slip cleared")
            print("page errors: %s" % (r.errors[:5] or "none"))
        except T.Fail as e:
            print("STOPPED: %s" % e)
        finally:
            try: r.ctx.close()
            except Exception: pass
            browser.close(); srv.shutdown()


if __name__ == "__main__":
    main()
