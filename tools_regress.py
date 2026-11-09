#!/usr/bin/env python3
"""Dream Street Shuffle regression player (2026-11-07).

Plays the built html headless and muted, the way a player would (real pointer
clicks on the 3D rooms, real button presses), and checks that things already
fixed after a playtest stay fixed. Run it after sync_html.py:

    ~/.dss-regress/venv/bin/python tools_regress.py            # everything
    ~/.dss-regress/venv/bin/python tools_regress.py french     # names containing "french"

Nothing opens on screen and nothing makes a sound. Each check gets a fresh
browser context, so no save carries between checks. Failures leave a
screenshot in ~/.dss-regress/shots/.

Two kinds of check:
  * WATCHERS run during every check: page errors; a hint slip typing (with its
    sound) while it cannot be seen; a petal/mote trail that starts off screen
    or does not end at the NOTEBOOK.
  * CHECKS: one per playtest note worth keeping fixed. Add a new one with
    @check("name", "the note it guards") when a note is fixed.

Setup, once: python3 -m venv ~/.dss-regress/venv && ~/.dss-regress/venv/bin/pip install playwright
(the Chrome for Testing it drives is already in ~/Library/Caches/ms-playwright).
"""
import functools, glob, re, http.server, os, socketserver, sys, threading, time, traceback
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
HTML = "Dream%20Street%20Shuffle.html"
SHOTS = os.path.expanduser("~/.dss-regress/shots")
FLAGS = ["--mute-audio", "--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist",
         "--autoplay-policy=no-user-gesture-required"]


def chrome_path():
    hits = sorted(glob.glob(os.path.expanduser(
        "~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing")))
    return hits[-1] if hits else None


# ---------------------------------------------------------------- watchers (in page)
INIT = r"""
(function () {
  var R = window.__reg = { viol: [], smash: [], ramps: [], motes: 0 };
  function bad(kind, msg) { if (R.viol.length < 40) R.viol.push(kind + ': ' + msg); }
  // gain ramps to silence, with their length in seconds (the music fades)
  try {
    var BAC = window.BaseAudioContext || window.AudioContext, cg = BAC.prototype.createGain;
    BAC.prototype.createGain = function () { var g = cg.apply(this, arguments); g.gain.__ctx = this; return g; };
    var lr = AudioParam.prototype.linearRampToValueAtTime;
    AudioParam.prototype.linearRampToValueAtTime = function (v, t) {
      if (this.__ctx && v <= 0.001) R.ramps.push({ at: Math.round(performance.now()), secs: +(t - this.__ctx.currentTime).toFixed(2), pn: ((document.getElementById('dss-pn') || {}).textContent || '').trim() });
      return lr.apply(this, arguments);
    };
  } catch (e) {}
  function visibleAt(el) {
    if (!el || !el.getClientRects().length) return false;
    var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < 0.05) return false;
    var r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 40);
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    var top = document.elementFromPoint(x, y); return !!top && (el === top || el.contains(top));
  }
  var wrapped = false;
  setInterval(function () {
    var a = window.dssAudio; if (!a || wrapped || !a.typewriterTick) return; wrapped = true;
    var tick = a.typewriterTick, smash = a.glassSmash;
    a.typewriterTick = function () {
      // a slip that is part-way typed must be in plain sight while it clicks
      Array.prototype.forEach.call(document.querySelectorAll('#dss-hint-stack .dss-hint-slip:not(.typed)'), function (c) {
        var t = (c.querySelector('.dss-hint-type') || {}).textContent || '';
        if (t.length && t !== c.__regLast && !c.__dssGoing && !visibleAt(c)) bad('slip', 'typing while hidden: "' + t.slice(0, 50) + '"');
        c.__regLast = t;
      });
      return tick.apply(this, arguments);
    };
    if (smash) a.glassSmash = function () { R.smash.push(Math.round(performance.now())); return smash.apply(this, arguments); };
  }, 50);
  // every trail to the NOTEBOOK: starts on screen, ends at the visible NOTEBOOK link
  var mo = new MutationObserver(function (ms) {
    ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) {
      if (n.nodeType !== 1 || !/(^|\s)([a-z]+-mote|lily-petal-mote)(\s|$)/.test(n.className || '')) return;
      if (/^dss-/.test(n.className)) return;
      R.motes++;
      var x = parseFloat(n.style.left), y = parseFloat(n.style.top), dx, dy;
      if (/lily-petal-mote/.test(n.className)) { dx = parseFloat(n.style.getPropertyValue('--dx')); dy = parseFloat(n.style.getPropertyValue('--dy')); }
      else { dx = parseFloat(n.style.getPropertyValue('--mote-tx')); dy = parseFloat(n.style.getPropertyValue('--mote-ty')); }
      if (!n.style.left && !n.style.top) {   /* a card's own motes sit where the CSS puts them inside the card: measure the box */
        setTimeout(function () { var b = n.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
          if (document.contains(n) && !(cx > 6 && cy > 6 && cx < innerWidth - 6 && cy < innerHeight - 6)) bad('trail', n.className.split(' ')[0] + ' starts off screen at ' + Math.round(cx) + ',' + Math.round(cy)); }, 0);
        return;
      }
      if (!(x > 6 && y > 6 && x < innerWidth - 6 && y < innerHeight - 6)) bad('trail', n.className.split(' ')[0] + ' starts off screen at ' + Math.round(x) + ',' + Math.round(y));
      if (window.dssMoteTarget && isFinite(dx)) { var t = window.dssMoteTarget(); var miss = Math.hypot(x + dx - t[0], y + dy - t[1]); if (miss > 30) bad('trail', n.className.split(' ')[0] + ' ends ' + Math.round(miss) + 'px from the NOTEBOOK'); }
    }); });
  });
  (function arm() { if (!document.documentElement) return setTimeout(arm, 5); mo.observe(document.documentElement, { childList: true, subtree: true }); })();
})();
"""


# ---------------------------------------------------------------- server + driver
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    handler = functools.partial(Quiet, directory=ROOT)
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), handler)
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


class Fail(Exception):
    pass


class Run:
    """One check: a fresh context, one page, the watchers, small helpers."""

    def __init__(self, browser, port, name):
        self.name = name
        self.ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        self.ctx.add_init_script(INIT)
        self.page = self.ctx.new_page()
        self.errors = []
        self.page.on("pageerror", lambda e: self.errors.append(str(e)[:200]))
        self.port = port
        self.info = ""

    def go(self, passage, wait=9000):
        from urllib.parse import quote
        self.page.goto("http://127.0.0.1:%d/%s?t=%d&start=%s" % (self.port, HTML, int(time.time()), quote(passage)), timeout=90000)
        self.page.wait_for_timeout(wait)

    def js(self, code, *args):
        return self.page.evaluate(code, *args)

    def pn(self):
        return self.js("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim()")

    def wait_for(self, code, ms=8000, what="condition"):
        t0 = time.time()
        while time.time() - t0 < ms / 1000:
            if self.js(code):
                return
            self.page.wait_for_timeout(150)
        raise Fail("timed out waiting for " + what)

    def expect(self, ok, msg):
        if not ok:
            raise Fail(msg)

    # rooms
    def room_ready(self, room, photos=True):
        self.wait_for("() => !!(window.__dssRooms && window.__dssRooms['%s'])" % room, 15000, "the %s room" % room)
        # the room's opening words: press its onward button if it is up
        for _ in range(3):
            btn = self.page.locator(".dss-room-dismiss:visible")
            if btn.count():
                try:
                    btn.first.click(timeout=3000)
                except Exception:   # something sits over it (the Coach's): press it the way the keyboard does
                    self.js("() => { var b = [].filter.call(document.querySelectorAll('.dss-room-dismiss'), function (e) { return e.getClientRects().length; })[0]; if (b) b.click(); }")
                self.page.wait_for_timeout(1400)
            else:
                break
        self.wait_for("() => window.__dssRooms['%s'].mode() === 'idle'" % room, 8000, "the room camera to settle")
        self.clear_lore()
        self.clear_slips()
        self.clear_lore()
        # since 2026-11-07 the French holds every other object back until its photographs are looked at, once a run
        if photos and room == "fi" and self.js("() => window.__dssRooms.fi.names().join('|')") == "Photographs":
            self.look_at_photos()

    def look_at_photos(self):
        self.click_object("fi", "Photographs")
        # 2026-11-08: the VOICES slip shows over the card at once; read it to the end, then Back to the room (one press)
        self.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip.dss-hint-voices.typed'), function (e) { return getComputedStyle(e).visibility !== 'hidden' && e.getClientRects().length; })", 30000, "the VOICES slip, typed, over the photographs")
        self.back_click("fi")
        self.wait_for("() => window.__dssRooms.fi.mode() === 'idle'", 8000, "the camera back from the photographs")
        self.clear_lore(); self.clear_slips(); self.clear_lore()

    def clear_lore(self, rounds=4):
        """A lore card (THE GREAT WORK, a room's note) opens on the first press; read it and press its button (Go on, Next note or the press it came from), like a player."""
        for _ in range(rounds):
            if not self.js("() => !!document.querySelector('#dss-lore-overlay')"):
                return
            on = self.page.locator("#dss-lore-overlay .dss-lore-on")
            if on.count():
                on.first.click()
            else:
                self.page.keyboard.press("Escape")
            self.page.wait_for_timeout(1200)

    def clear_slips(self, rounds=6):
        """Read and close the hint slips like a player: wait for each to finish typing, then press its x.
        The night's first slips are modal and swallow every other click until both are read."""
        for _ in range(rounds):
            if not self.js("() => !!document.querySelector('#dss-hint-stack .dss-hint-slip:not(.out)')"):
                self.page.wait_for_timeout(1200)   # a second slip can follow the first
                if not self.js("() => !!document.querySelector('#dss-hint-stack .dss-hint-slip:not(.out)')"):
                    return
            self.wait_for("() => [].every.call(document.querySelectorAll('#dss-hint-stack .dss-hint-slip:not(.out)'), function (c) { return c.classList.contains('typed'); })", 30000, "a slip to finish typing")
            x = self.page.locator("#dss-hint-stack .dss-hint-slip:not(.out) .dss-hint-x")
            if x.count():
                x.last.click()
            self.page.wait_for_timeout(900)

    def click_object(self, room, name):
        pt = self.js("([r, n]) => window.__dssRooms[r].point(n)", [room, name])
        self.expect(pt, "no object called %r in %s" % (name, room))
        self.page.mouse.move(pt[0], pt[1])
        self.page.wait_for_timeout(150)
        self.page.mouse.click(pt[0], pt[1])
        self.page.wait_for_timeout(2600)   # the camera's walk to the close-up
        self.expect(self.js("([r]) => window.__dssRooms[r].mode()", [room]) == "inspect", "clicking %r did not open its close-up" % name)

    def back_click(self, room):
        """Step back out of a close-up the way a player does: a real mouse click on "Back to the room". Fails if the click does nothing."""
        b = self.page.locator(".dss-room-back:visible")
        if b.count():
            box = b.first.bounding_box()
            self.page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        else:   # a card with no such button (a figure, an exit): Esc, as a player would
            self.page.keyboard.press("Escape")
        for _ in range(40):
            self.page.wait_for_timeout(200)
            if self.js("([r]) => window.__dssRooms[r].mode()", [room]) != "inspect":
                return
        raise Fail("clicking 'Back to the room' in %s did nothing (the mouse is stuck)" % room)

    def card_buttons(self):
        return self.js("() => [].slice.call(document.querySelectorAll('.fi-action')).filter(function (b) { return b.getClientRects().length; }).map(function (b) { return b.textContent.trim(); })")

    def press(self, text):
        b = self.page.locator(".fi-action:visible", has_text=text)
        self.expect(b.count() > 0, "no %r button on the card (buttons: %s)" % (text, self.card_buttons()))
        b.first.click()

    def finish(self, failed):
        viol = self.js("() => (window.__reg || {}).viol || []")
        problems = list(viol) + ["page error: " + e for e in self.errors]
        if failed or problems:
            os.makedirs(SHOTS, exist_ok=True)
            try:
                self.page.screenshot(path=os.path.join(SHOTS, self.name + ".png"))
            except Exception:
                pass
        self.ctx.close()
        return problems


# ---------------------------------------------------------------- checks
CHECKS = []


def check(name, note):
    def deco(fn):
        CHECKS.append((name, note, fn))
        return fn
    return deco


@check("french-artists-no-stray-lore", "2026-11-07 note 4: the Chariots lore opened on the famous artists")
def _(r):
    r.go("The French")
    r.room_ready("fi")
    r.click_object("fi", "The famous artists")
    r.press("Approach")
    # JOHN's interruption walks the camera to him first; watch the whole way for a stray lore card
    for _ in range(60):
        r.expect(not r.js("() => !!document.querySelector('#dss-lore-overlay')"), "a lore card opened when approaching the artists")
        if r.pn() == "The Stranger at the French":
            break
        r.page.wait_for_timeout(200)
    r.expect(r.pn() == "The Stranger at the French", "Approach went to %r, not The Stranger at the French" % r.pn())


@check("french-paperback-lore-and-slip", "2026-11-07 notes 3 and 4: the lore belongs to the paperback; a slip under a lore card waits, silent")
def _(r):
    r.go("The French")
    r.room_ready("fi")
    r.click_object("fi", "An orange paperback")
    r.press("Go on")
    r.wait_for("() => !!document.querySelector('#dss-lore-overlay')", 5000, "the Chariots lore card")
    r.expect("Chariots" in r.js("() => document.querySelector('#dss-lore-overlay').textContent"), "the lore card is not Chariots of the Gods?")
    r.js("() => window.dssInlineHint('REGRESSION TEST SLIP, TYPED AFTER THE LORE CARD CLOSES', { now: true })")
    r.page.wait_for_timeout(3000)
    typed = r.js("() => [].map.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent; }).join('|')")
    r.expect("REGRESSION" not in typed, "the slip typed itself out under the lore card")
    r.page.keyboard.press("Escape")
    r.wait_for("() => !document.querySelector('#dss-lore-overlay')", 4000, "the lore card to close")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent.indexOf('REGRESSION') >= 0; })", 8000, "the slip to type once the lore card closed")


@check("french-photographs-first", "2026-11-07 (Sam): the French teaches the VOICES; until its photographs are looked at, only they glow (the door, the way out, waits too); Back to the room still clicks with the VOICES slip waiting (the mouse froze)")
def _(r):
    r.go("The French")
    r.room_ready("fi", photos=False)
    names = r.js("() => window.__dssRooms.fi.names()")
    r.expect(names == ["Photographs"], "before the photographs the room offers %s" % names)
    r.click_object("fi", "Photographs")
    r.wait_for("() => /THE PRIME/.test(document.body.innerText)", 8000, "the voices on the photographs")
    # 2026-11-08 (Sam, note 5: "STILL THERE IS NO SLIP HERE EXPLAINING THE VOICES"): the VOICES slip is on screen while the voices are
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip.dss-hint-voices.typed'), function (e) { return getComputedStyle(e).visibility !== 'hidden' && e.getClientRects().length; })", 30000, "the VOICES slip on screen over the photographs' card")
    for _ in range(4):   # 2026-11-07 (Sam): the lily line came up over the photographs' voices; it waits for the room
        r.page.wait_for_timeout(500)
        r.expect(not r.js("() => [].some.call(document.querySelectorAll('.dss-room-lily-hint'), function (e) { return e.getClientRects().length && +getComputedStyle(e).opacity > 0.3; })"), "the lily line showed while the photographs' card was up")
    r.back_click("fi")   # one press: the typed VOICES slip lets it through
    r.wait_for("() => window.__dssRooms.fi.mode() === 'idle'", 8000, "the camera back")
    r.clear_slips(); r.clear_lore()
    names = r.js("() => window.__dssRooms.fi.names()")
    r.expect(len(names) >= 5, "after the photographs the room still offers only %s" % names)
    r.expect("A blue door" in names, "the door (the way out) is still held after the photographs")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-room-lily-hint'), function (e) { return e.getClientRects().length && +getComputedStyle(e).opacity > 0.3; })", 8000, "the lily line once back in the room")


NOTE_OPEN = "() => !!document.querySelector('.pn-save') && !!document.querySelector('.pn-save').getClientRects().length"


def note_opens(r, how, where):
    """Open the playtest-notes box by Shift+N or the NOTE button, then close it with Esc."""
    if how == "key":
        r.page.keyboard.press("Shift+KeyN")
    else:
        b = r.js("() => { var b = document.getElementById('dss-note-btn'); if (!b) return null; var q = b.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }")
        if not b:
            return "%s: no NOTE button" % where
        r.page.mouse.click(b[0], b[1])
    r.page.wait_for_timeout(600)
    ok = r.js(NOTE_OPEN)
    r.page.keyboard.press("Escape"); r.page.wait_for_timeout(400)
    return "" if ok else "%s: %s did not open the notes" % (where, "Shift+N" if how == "key" else "the NOTE button")


@check("notes-open-everywhere", "2026-11-07 (Sam): the playtest notes would not always open; Shift+N and the NOTE button, in a close-up with a must-read slip waiting, a dream world, and a scene inside a frame")
def _(r):
    bad = []
    r.go("The French")
    r.room_ready("fi", photos=False)
    r.click_object("fi", "Photographs")   # the VOICES slip is waiting, hidden, under the card
    r.page.wait_for_timeout(1500)
    bad += [note_opens(r, "key", "the photographs' close-up"), note_opens(r, "button", "the photographs' close-up")]
    r.page.goto("http://127.0.0.1:%d/%s?t=%d&start=nazca" % (r.port, HTML, int(time.time())), timeout=90000)
    r.page.wait_for_timeout(9000)
    r.page.mouse.click(720, 450); r.page.wait_for_timeout(500)
    bad += [note_opens(r, "key", "the Nazca world"), note_opens(r, "button", "the Nazca world")]
    r.go("Dawn Approach White", wait=12000)
    fr = r.js("() => { var f = document.querySelector('iframe'); if (!f) return null; var q = f.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }")
    if fr:
        r.page.mouse.click(fr[0], fr[1]); r.page.wait_for_timeout(800)
        inside = r.js("() => document.activeElement && document.activeElement.tagName")
        bad.append(note_opens(r, "key", "the dawn approach (focus in %s)" % inside))
    else:
        bad.append("no frame on Dawn Approach White to click into")
    bad = [b for b in bad if b]
    r.expect(not bad, "; ".join(bad))


@check("french-door-sign-shows", "2026-11-07 note 7: SORTIR sat inside the door panel, the notice looked blank")
def _(r):
    r.go("The French")
    r.room_ready("fi")
    r.click_object("fi", "A blue door")
    r.page.wait_for_timeout(800)
    res = r.js("""() => { var T = window.THREE, R = window.__dssRooms.fi, sign = null;
      R.scene.traverse(function (m) { var im = m.isMesh && m.material && m.material.map && m.material.map.image; if (im && im.width === 256 && im.height === 320) sign = m; });
      if (!sign) return 'no sign mesh';
      var cam = new T.Vector3(); R.camera.getWorldPosition(cam); var hits = 0, seen = 0;
      [[-0.07, -0.1], [0.07, -0.1], [0, 0], [-0.07, 0.1], [0.07, 0.1]].forEach(function (o) {
        var p = new T.Vector3(o[0], o[1], 0).applyMatrix4(sign.matrixWorld), d = p.clone().sub(cam), L = d.length(); d.normalize();
        var vis = []; R.scene.traverse(function (m) { if (m.isMesh && m.visible) { var q = m; while (q && q.visible) q = q.parent; if (!q) vis.push(m); } });
        var h = new T.Raycaster(cam, d, 0, L + 0.05).intersectObjects(vis, false); hits++; if (h[0] && h[0].object === sign) seen++; });
      return seen + '/' + hits; }""")
    # the door swings a little ajar on look, so a corner sample can graze the frame; the buried notice read 0/5
    r.expect(res in ("4/5", "5/5"), "the SORTIR notice is hidden from the door close-up (%s points seen)" % res)


@check("empty-glass-smash-and-trail", "2026-11-07 note 6: the smash came before the drink popup closed; THE DEBT's trail started in the corner")
def _(r):
    r.go("The Empty Glass", wait=2500)
    r.wait_for("() => window._drinkPopupOpen === true", 6000, "the drink popup")
    r.page.wait_for_timeout(800)
    r.expect(not r.js("() => window.__reg.smash.length"), "the glass smashed while the drink popup was still open")
    r.js("() => { var o = document.getElementById('drink-popup-overlay'); if (o) o.remove(); window._drinkPopupOpen = false; window.__regClosed = Math.round(performance.now()); window.dispatchEvent(new CustomEvent('drinkpopup:closed')); }")
    r.page.wait_for_timeout(4500)
    gap = r.js("() => window.__reg.smash.length ? window.__reg.smash[0] - window.__regClosed : null")
    r.expect(gap is not None, "no glass smash after the drink popup closed")
    r.expect(2500 <= gap <= 3600, "the smash came %d ms after the popup closed (want about 2800, 2026-11-08 note 7: later)" % gap)
    r.expect(r.js("() => window.__reg.motes") > 0, "THE DEBT sent no trail to the NOTEBOOK")


@check("night-ahead-music-fade", "2026-11-07 note 1: the Title music cut too quickly into The Night Ahead")
def _(r):
    r.go("Title", wait=6000)
    r.page.mouse.click(5, 5)   # wake the audio, as a player's first press does
    r.page.wait_for_timeout(2500)
    link = r.page.locator("tw-link", has_text="BEGIN")
    r.expect(link.count() > 0, "no BEGIN on the Title")
    t0 = r.js("() => performance.now()")
    link.first.click()
    r.page.wait_for_timeout(2500)
    r.expect(r.pn() == "The Night Ahead", "BEGIN went to %r" % r.pn())
    ramps = r.js("(t0) => window.__reg.ramps.filter(function (x) { return x.at >= t0; })", t0)
    longest = max([x["secs"] for x in ramps] or [0])
    r.expect(longest >= 4.5, "the music let go over %.1f s, not a slow fade (ramps: %s)" % (longest, ramps[:4]))


# ---------------------------------------------------------------- every room, every object
# A first-night visit to each room (a fresh save): every object you can click opens its close-up, its card is
# not empty, and nothing solid stands between the close-up camera and the thing it looks at.
ROOMS = [("fi", "The French"), ("ci", "The Colony Room"), ("pi", "Entering The Pillars of Hercules"), ("ri", "Ronnie Scott's"),
         ("cu", "Turn to Copper"), ("cb", "Coach and Horses bar"), ("ti", "Trisha's"), ("lk", "Martin Lackland's Office"),
         ("oi", "O'Flatterly's shop"), ("cf", "Chinese Fish and Chips")]

BLOCKED = """([room, name]) => { var T = window.THREE, R = window.__dssRooms[room], sp = R.spot(name); if (!sp) return 'no spot';
  var cam = new T.Vector3(); R.camera.getWorldPosition(cam);
  var vis = []; R.scene.traverse(function (m) { if (!m.isMesh) return; var q = m; while (q && q.visible) q = q.parent; if (q) return;
    var mt = Array.isArray(m.material) ? m.material[0] : m.material; if (!mt || mt.transparent || mt.depthWrite === false || mt.blending === T.AdditiveBlending) return; vis.push(m); });
  var box = new T.Box3().setFromObject(sp.root); if (box.isEmpty()) box.setFromCenterAndSize(new T.Vector3().fromArray(sp.tgt), new T.Vector3(0.1, 0.1, 0.1));
  var pts = [], c = new T.Vector3(); box.getCenter(c); pts.push(c);
  for (var q = 0; q < 8; q++) pts.push(new T.Vector3(q & 1 ? 0.75 : 0.25, q & 2 ? 0.75 : 0.25, q & 4 ? 0.75 : 0.25).multiply(new T.Vector3().subVectors(box.max, box.min)).add(box.min));
  var seen = 0, blocker = '';
  pts.forEach(function (pt) { var d = pt.clone().sub(cam), L = d.length(); d.normalize(); var h = new T.Raycaster(cam, d, 0, L).intersectObjects(vis, false), ok = true;
    for (var i = 0; i < h.length; i++) { var o = h[i].object, own = false, w = o; while (w) { if (w === sp.root) { own = true; break; } w = w.parent; }
      if (own) break; if (h[i].distance < L - 0.08) { ok = false; if (!blocker) { var p = o.geometry && o.geometry.parameters; blocker = o.geometry.type.replace('Geometry', '') + (p ? ' ' + Object.keys(p).filter(function (k) { return typeof p[k] === 'number' && !/Segments|Start|Length/.test(k); }).map(function (k) { return +p[k].toFixed(2); }).join('x') : ''); } break; } }
    if (ok) seen++; });
  return seen >= 3 ? '' : blocker + ' (' + seen + ' of 9 points of it in view)'; }"""


# Judged by eye, so the ray test passes them: (room, object): why it is fine.
SEEN_BY_EYE = {
    ("cu", "ASHTON GRANGER"): "a seated ghost behind his chair; head and shoulders in view (2026-11-07 screenshot)",
    ("oi", "INIS O’FLATTERLY"): "a ghost behind his counter; in view above it (2026-11-07 screenshot)",
}


def room_check(room, passage):
    def fn(r):
        r.go(passage)
        r.room_ready(room)
        names = r.js("([room]) => window.__dssRooms[room].names()", [room])
        r.expect(names, "no objects to click")
        bad = []
        for name in names:
            if r.js("([room]) => window.__dssRooms[room].mode()", [room]) != "idle" or r.pn() != passage:
                r.go(passage)
                r.room_ready(room)
            pt = r.js("([r, n]) => window.__dssRooms[r].point(n)", [room, name])
            if not pt or not (0 < pt[0] < 1440 and 0 < pt[1] < 900):
                bad.append("%s: not on screen from the room view" % name)
                continue
            r.clear_lore(); r.clear_slips()
            r.wait_for("([room]) => window.__dssRooms[room].mode() === 'idle' && !window.__dssRooms[room].blocked()".replace("([room])", "() ").replace("window.__dssRooms[room]", "window.__dssRooms['%s']" % room), 8000, "the room to be free to click")
            r.page.mouse.move(pt[0], pt[1]); r.page.wait_for_timeout(150); r.page.mouse.click(pt[0], pt[1])
            r.page.wait_for_timeout(2600)
            if r.js("([room]) => window.__dssRooms[room].mode()", [room]) != "inspect":
                under = r.js("([x, y]) => { var e = document.elementFromPoint(x, y); return e ? e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && e.className.baseVal === undefined ? '.' + String(e.className).split(' ').join('.') : '') : 'nothing'; }", pt)
                bad.append("%s: clicking it did not open its close-up (under the pointer: %s; page %s)" % (name, under, r.pn()))
                r.page.screenshot(path=os.path.join(SHOTS, "room-%s-%s.png" % (room, name.replace(' ', '_').replace('/', '_'))))
                continue
            card = r.js("() => { var c = [].filter.call(document.querySelectorAll('.dss-room-card'), function (e) { return e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.1; })[0]; return c ? c.innerText.replace(/\\s+/g, ' ').trim() : null; }")
            if not card or len(card) < 3:
                bad.append("%s: its card is empty" % name)
            blk = "" if (room, name) in SEEN_BY_EYE else r.js(BLOCKED, [room, name])
            if blk:
                bad.append("%s: hidden in its close-up behind %s" % (name, blk))
                r.page.screenshot(path=os.path.join(SHOTS, "room-%s-%s.png" % (room, name.replace(' ', '_').replace('/', '_'))))
            r.back_click(room)
            r.page.wait_for_timeout(2200)
        r.expect(not bad, "; ".join(bad))
    return fn


for _room, _passage in ROOMS:
    check("room-" + _room, "every object in %s opens, has a card, and is not hidden in its close-up" % _passage)(room_check(_room, _passage))


# ---------------------------------------------------------------- the dream worlds
# Each world from its preview start (?start=<world>), walked like a curious player: on every page press the first
# way on not yet taken, up to 30 pages or back to Dean Street. On every page: no errors (the watchers), any 3D view
# is not blank, and the page fits a 1440x900 laptop screen without scrolling.
WORLD_ENDS = {"Night Ahead Part Two": 1, "The Fetch": 1}
WORLDS = ["himalayas", "nazca", "easter", "pyramid", "ezekiel"]

CLICKABLES = """() => { var out = [], seen = new Set();
  [].forEach.call(document.querySelectorAll('body *'), function (e) {
    if (e.closest('tw-header, .stat-bars, #stat-bars-lifted, .dss-ghost, #dss-hint-stack, #dss-lore-overlay, .notebook-link, #dss-debug-panel, #dss-note-btn')) return;   /* the test build's NOTE button is not a way on (2026-11-08: moved on screen by note 24) */
    var tag = e.tagName; if (tag === 'CANVAS' || tag === 'svg' || tag === 'HTML' || tag === 'BODY') return;
    var cs = getComputedStyle(e); if (cs.cursor !== 'pointer' && tag !== 'TW-LINK') return;
    if (e.parentElement && getComputedStyle(e.parentElement).cursor === 'pointer' && e.parentElement.closest('body *') && !/^TW-/.test(tag)) return;
    if (!e.getClientRects().length || cs.visibility === 'hidden' || +cs.opacity < 0.2) return;
    var r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return; if (r.bottom < 0 || r.top > innerHeight) { e.scrollIntoView({ block: 'center' }); r = e.getBoundingClientRect(); } if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return;
    var x = r.left + r.width / 2, y = r.top + r.height / 2, top = document.elementFromPoint(x, y); if (!top || !(top === e || e.contains(top))) return;
    var t = (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim(); if (!t || t.length > 80 || seen.has(t) || /^(mute|unmute)/i.test(t)) return; seen.add(t);
    out.push({ t: t, x: x, y: y }); });
  return out; }"""


def blank_canvases(r):
    """Visible 3D views that rendered nothing (near-black and flat)."""
    import io
    from PIL import Image, ImageStat
    boxes = r.js("() => [].filter.call(document.querySelectorAll('canvas'), function (c) { var b = c.getBoundingClientRect(); return b.width >= 300 && b.height >= 200 && c.getClientRects().length && getComputedStyle(c).visibility !== 'hidden' && !c.closest('.dss-ghost'); }).map(function (c) { var b = c.getBoundingClientRect(); return [Math.max(0, b.left), Math.max(0, b.top), Math.min(innerWidth, b.right), Math.min(innerHeight, b.bottom)]; })")
    bad = []
    for x0, y0, x1, y1 in boxes:
        if x1 - x0 < 50 or y1 - y0 < 50:
            continue
        png = r.page.screenshot(clip={"x": x0, "y": y0, "width": x1 - x0, "height": y1 - y0})
        st = ImageStat.Stat(Image.open(io.BytesIO(png)).convert("L"))
        if st.mean[0] < 6 and st.stddev[0] < 4:
            bad.append("a %dx%d 3D view is blank" % (x1 - x0, y1 - y0))
    return bad


def world_check(world):
    def fn(r):
        r.go(world, wait=10000)
        taken, path, bad = set(), [], []
        for step in range(30):
            r.clear_lore(); r.clear_slips()
            pn = r.pn()
            path.append(pn)
            if pn == "Dean Street" and step:
                break
            for b in blank_canvases(r):
                bad.append("%s: %s" % (pn, b))
            over = r.js("() => (document.scrollingElement || document.documentElement).scrollHeight - innerHeight")
            if over > 4:
                bad.append("%s: scrolls %d px on a 1440x900 screen" % (pn, over))
            opts = r.js(CLICKABLES)
            fresh = [o for o in opts if (pn, o["t"]) not in taken]
            if not fresh and r.js("() => /hold to hum|held down/i.test(document.body.innerText)"):
                # a hold game (the King's Chamber hum): hold Space for different lengths until it lets you on
                for hold in (1200, 2000, 2800, 3600, 1600, 2400, 3200):
                    r.page.keyboard.down("Space"); r.page.wait_for_timeout(hold); r.page.keyboard.up("Space"); r.page.wait_for_timeout(2500)
                    if r.pn() != pn or r.js(CLICKABLES):
                        break
                if r.pn() != pn:
                    continue
                opts = r.js(CLICKABLES)
                fresh = [o for o in opts if (pn, o["t"]) not in taken]
            if not fresh:
                bad.append("%s: no way on found (the walk stopped here)" % pn) if r.pn() not in ("Dean Street",) and step < 29 and not WORLD_ENDS.get(pn) else None
                break
            o = fresh[0]
            taken.add((pn, o["t"]))
            over = r.js("() => (document.scrollingElement || document.documentElement).scrollHeight - innerHeight")
            if over > 4:   # the page grew while it was played (a game's way on appearing below the fold)
                bad.append("%s: scrolls %d px on a 1440x900 screen" % (pn, over))
            r.page.mouse.click(o["x"], o["y"])
            r.page.wait_for_timeout(3500)
        r.info = "walked: " + " > ".join(dict.fromkeys(path))
        r.expect(len(set(path)) > 1, "the walk never left %s" % path[0])
        r.expect(not bad, "; ".join(dict.fromkeys(bad)))
    return fn


for _w in WORLDS:
    check("world-" + _w, "the %s dream world: walks without errors, no blank 3D view, no scrolling at 1440x900" % _w)(world_check(_w))


# ---------------------------------------------------------------- Dean Street and the Soho map
# The hub on a fresh first night: it fits the laptop screen, its map draws, every hub link has a door on the map
# (the map is the only way a player reaches them), and every open door, walked into from its doorstep, goes in.
HUB_LINKS = """() => [].filter.call(document.querySelectorAll('.soho-hub-dock tw-link, tw-story tw-link'), function (l) { return !l.closest('tw-header, .dss-ghost, #dss-lore-overlay, #dss-hint-stack'); })
  .map(function (l) { return l.textContent.replace(/\\s+/g, ' ').trim(); }).filter(function (t, i, a) { return t && a.indexOf(t) === i; })"""


def hub_ready(r):
    r.go("Dean Street", wait=10000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    r.wait_for("() => !!(window.dssSohoMap && window.dssSohoMap.state)", 10000, "the Soho map")


BACKWARDS = re.compile(r"^\u2190|back|leave|not now", re.I)


def play_on(r, until, steps=60):
    """Press forward choices (first untaken, 'back' last), waiting out typewriter pages, until until(pn) holds."""
    taken = set()
    for _ in range(steps):
        r.clear_lore(); r.clear_slips()
        pn = r.pn()
        if until(pn):
            return pn
        opts, k = [], 0
        while True:
            opts = sorted([o for o in r.js(CLICKABLES) if (pn, o["t"]) not in taken], key=lambda o: bool(BACKWARDS.search(o["t"])))
            if opts or k >= 30:
                break
            r.page.wait_for_timeout(2000); k += 1
        if not opts:
            raise Fail("stuck on %s with no way on" % pn)
        taken.add((pn, opts[0]["t"]))
        r.page.mouse.click(opts[0]["x"], opts[0]["y"])
        r.page.wait_for_timeout(3500)
    raise Fail("did not get there in %d pages" % steps)


def walk_into(r, door):
    """Stand next to a map door and walk onto it with the on-screen d-pad, as a player would."""
    d = r.js("(id) => { var d = window.dssSohoMap.doors.filter(function (x) { return x.id === id; })[0]; return d ? { c: d.c, r: d.r, fc: d.fc, fr: d.fr } : null; }", door)
    r.expect(d, "no door %r on the map" % door)
    if (d["c"], d["r"]) != (d["fc"], d["fr"]):
        tries = [((d["fc"], d["fr"]), "right" if d["c"] > d["fc"] else "left" if d["c"] < d["fc"] else "down" if d["r"] > d["fr"] else "up")]
    else:   # a door on the tile itself: step on from a neighbour
        tries = [((d["c"], d["r"] + 1), "up"), ((d["c"] - 1, d["r"]), "right"), ((d["c"] + 1, d["r"]), "left"), ((d["c"], d["r"] - 1), "down")]
    for (c, rr), way in tries:
        r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", [c, rr])
        r.page.wait_for_timeout(500)
        r.js("""(way) => { var b = document.querySelector('[data-dir="' + way + '"]'); if (!b) return;
          b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 7, isPrimary: true }));
          setTimeout(function () { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 7, isPrimary: true })); }, 200); }""", way)
        for _ in range(32):
            r.page.wait_for_timeout(250)
            if r.pn() != "Dean Street":
                return r.pn()
    return "Dean Street"


def hub_problems(r, label):
    bad = blank_canvases(r)
    over = r.js("() => (document.scrollingElement || document.documentElement).scrollHeight - innerHeight")
    if over > 4:
        bad.append("%s scrolls %d px on a 1440x900 screen" % (label, over))
    links = [t for t in r.js(HUB_LINKS) if not re.match(r"^[a-z]+(-[a-z]+)+$|^NOTEBOOK$|^No one yet\.$", t)]   # machinery links (gw-read, next-poke) and the pitch's "no"
    orphans = r.js("(links) => links.filter(function (t) { return !window.dssSohoMap.doors.some(function (d) { return d.rx.test(t); }); })", links)
    if orphans:
        bad.append("%s: hub links with no door on the map: %s" % (label, orphans))
    return bad, links


@check("hub-first-night", "the first Dean Street: fits the screen, the map draws, each hub link has a map door, the Ginger Light door goes in")
def _(r):
    hub_ready(r)
    bad, links = hub_problems(r, "the first Dean Street")
    got = walk_into(r, "ginger")
    if got == "Dean Street":
        bad.append("walking onto the Ginger Light door did nothing")
    r.info = "links: %s; Ginger Light door -> %s" % (links, got)
    r.expect(not bad, "; ".join(bad))


@check("hub-second-visit", "the second Dean Street (after the poet, LILY and Name Your Book): same, only the French offered (not the Pillars), and its door goes in")
def _(r):
    hub_ready(r)
    r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return /See who/.test(x.textContent); })[0]; if (l) l.click(); }")
    r.page.wait_for_timeout(3500)
    play_on(r, lambda pn: pn == "Dean Street")
    r.wait_for("() => !!(window.dssSohoMap && window.dssSohoMap.state)", 10000, "the Soho map")
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    # the second Dean Street hands you the Donkey coin: toss it, then pocket it, as a player does
    for sel in ("#coin-toss-btn", "#coin-keep-btn"):
        r.wait_for("() => { var b = document.querySelector('%s'); return !!b && getComputedStyle(b).visibility !== 'hidden'; }" % sel, 15000, sel)
        r.page.click(sel); r.page.wait_for_timeout(2500)
    r.wait_for("() => !document.querySelector('#coin-overlay') || getComputedStyle(document.querySelector('#coin-overlay')).display === 'none' || !document.querySelector('#coin-overlay').offsetParent", 8000, "the coin card to close")
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    bad, links = hub_problems(r, "the second Dean Street")
    if any(re.search("Pillars|BELLETRIST", t) for t in links):
        bad.append("the Pillars are offered before the French (2026-11-07: the French first)")
    got = walk_into(r, "french")
    if got == "Dean Street":
        bad.append("walking onto the French door did nothing")
    r.info = "links: %s; French door -> %s" % (links, got)
    if got == "Approach The French":   # and once you have been in, the Pillars open
        play_on(r, lambda pn: pn == "The French", steps=6)
        r.room_ready("fi")
        r.clear_slips(); r.clear_lore()   # the MORALE and SOBRIETY slips of a first arrival
        r.click_object("fi", "A blue door")
        r.press("Out onto the street")
        r.wait_for("() => (document.getElementById('dss-pn') || {}).textContent === 'Dean Street'", 15000, "Dean Street through the French's door")
        r.page.wait_for_timeout(3000)
        r.clear_lore(); r.clear_slips(); r.clear_lore()
        if not any(re.search("Pillars", t) for t in r.js(HUB_LINKS)):
            bad.append("the Pillars are still closed after the French")
    r.expect(not bad, "; ".join(bad))


# ---------------------------------------------------------------- main

# ---------------------------------------------------------------- 2026-11-08 playtest notes
@check("feeding-after-choice", "2026-11-08 note 16: THE FEEDING haunt box waits for your choice at O'Flatterly's quest, then shows before you leave")
def _(r):
    r.go("O'Flatterly's quest", wait=6000)
    r.clear_slips(); r.clear_lore()
    r.page.wait_for_timeout(6000)   # the old hold showed it at 9 s by itself
    r.expect(r.js("() => { var b = document.querySelector('.haunt-box:not(.dss-ghost .haunt-box)'); return !b || getComputedStyle(b).display === 'none'; }"), "THE FEEDING showed before a choice was clicked")
    r.page.locator(".dss-room-veil tw-link", has_text="Not tonight.").first.click()
    r.wait_for("() => { var b = document.querySelector('.haunt-box:not(.dss-ghost .haunt-box)'); return b && getComputedStyle(b).display !== 'none'; }", 2500, "THE FEEDING to show on the click")
    r.expect(r.pn() == "O'Flatterly's quest", "the choice left before THE FEEDING was shown")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street'", 25000, "the choice to go through once the box had shown")


@check("go-on-not-continue", "2026-11-08 note 21: no link says Continue; the Interval's says Go on")
def _(r):
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect("[[Continue|" not in html, "a [[Continue|...]] link is still in the build")
    r.expect(not re.search(r">\s*GAME WON\s*<", html), "a GAME WON banner is still in the build (note 39)")
    svg = open(os.path.join(ROOT, "assets", "interval-stairwell.svg"), encoding="utf-8").read()
    r.expect("rotate(180" not in svg, "the Interval stairwell is drawn upside down again (note 19)")
    r.go("The Interval", wait=5000)
    r.wait_for("() => [].some.call(document.querySelectorAll('tw-passage tw-link, .dss-room-veil tw-link'), function (l) { return l.textContent.trim() === 'Go on'; })", 5000, "a Go on link on the Interval")


@check("polaroid-close", "2026-11-08 note 20: the stairs' polaroid has a cross on its corner, a line saying how to put it away, and any click closes it")
def _(r):
    r.go("The Interval: the stairs", wait=5000)
    r.clear_slips()
    r.page.locator(".dss-room-veil tw-link, tw-passage tw-link", has_text="Turn and follow her").first.click()
    r.wait_for("() => !!document.querySelector('#dss-photo-pop.in')", 8000, "the polaroid screen")
    box = r.js("""() => { var f = document.querySelector('.dss-photo-pop-frame'), x = document.querySelector('.dss-photo-pop-frame .dss-photo-pop-x'), h = document.querySelector('.dss-photo-pop-hint');
      if (!f || !x || !h) return null; var a = f.getBoundingClientRect(), b = x.getBoundingClientRect(); return { near: Math.abs(b.right - a.right) < 30 && Math.abs(b.top - a.top) < 30, hint: h.textContent, vis: getComputedStyle(h).visibility }; }""")
    r.expect(box, "the polaroid screen has no frame, cross or hint")
    r.expect(box["near"], "the cross is not on the polaroid's corner")
    r.page.wait_for_timeout(800)
    r.page.mouse.click(60, 840)
    r.wait_for("() => !document.querySelector('#dss-photo-pop')", 3000, "a click anywhere to put the polaroid away")


@check("barber-choice-after-scene", "2026-11-08 notes 27-28: at the barber's the choices wait under the 3D scene until its button is pressed")
def _(r):
    r.go("The Barbershop", wait=1500)
    r.expect(r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-passage tw-link'), function (x) { return x.textContent.trim() === 'A haircut'; })[0]; return !!l && getComputedStyle(l).visibility === 'hidden'; }"), "the barber's choices show before the scene's button is pressed")
    r.page.wait_for_timeout(3000)
    r.page.get_by_text("AT THE BARBER’S DOOR").click()
    r.page.wait_for_timeout(1500)
    r.expect(r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-passage tw-link'), function (x) { return x.textContent.trim() === 'A haircut'; })[0]; return !!l && getComputedStyle(l).visibility === 'visible' && l.getClientRects().length > 0; }"), "the barber's choices did not show after the scene")


@check("mandala-return", "2026-11-08 note 33: the Himalayan Return goes home through a kaleidoscope tunnel and a mandala, then clears")
def _(r):
    r.go("Himalayan Return", wait=2500)
    r.expect(r.js("() => !!document.querySelector('.dss-mandala-intro canvas')"), "no mandala tunnel on the Himalayan Return")
    r.page.wait_for_timeout(10500)
    r.expect(r.js("() => !document.querySelector('.dss-mandala-intro')"), "the mandala tunnel did not clear")


@check("map-pace-steady", "2026-11-08 note 35: the map's walk keeps its pace when the frame rate falls")
def _(r):
    hub_ready(r)
    def walk(ms):
        ok = r.js("() => window.__dssSohoTeleport(18, 3)")
        r.expect(ok, "could not stand on Dean Street at 18,3")
        r.page.wait_for_timeout(600)
        r.js("""(ms) => { var b = document.querySelector('[data-dir="down"]');
          b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 9, isPrimary: true }));
          setTimeout(function () { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 9, isPrimary: true })); }, ms); }""", ms)
        r.page.wait_for_timeout(ms + 700)
        return r.js("() => window.__dssSohoWhere()[1]") - 3
    fast = walk(1800)
    r.js("() => { window.__dssHog = true; (function hog() { if (!window.__dssHog) return; var t = performance.now(); while (performance.now() - t < 40) {} requestAnimationFrame(hog); })(); }")
    slow = walk(1800)
    r.js("() => { window.__dssHog = false; }")
    r.info = "rows walked in 1.8 s: %d at full speed, %d with the page loaded" % (fast, slow)
    r.expect(fast >= 4, "the walk barely moved (%d rows)" % fast)
    r.expect(slow >= fast * 0.7, "the walk slowed with the frame rate: %d rows, against %d" % (slow, fast))


@check("fetch-box-spaced", "2026-11-08 note 39: the Fetch's tally is two rows")
def _(r):
    r.go("The Fetch", wait=26000)
    r.expect(r.js("() => document.querySelectorAll('.fetch-owed .fetch-owed-row').length") == 2, "the Fetch's tally is not two rows")


@check("dawn-clean", "2026-11-08 notes 43-44: no readers' slips mid-dawn, no film grain on the Dawn, ANOTHER NIGHT waits for the petals")
def _(r):
    r.go("Dawn", wait=3000)
    r.expect(r.js("() => { var d = document.getElementById('dawn-slips'); return !d || !d.getClientRects().length; }"), "the readers' slips show on the Dawn")
    r.expect(r.js("() => getComputedStyle(document.body, '::after').display") == "none", "the film grain runs on the Dawn")
    for _ in range(4):
        b = r.page.locator(".dawn-page.dawn-pg-on .dawn-on")
        if b.count():
            b.first.click(); r.page.wait_for_timeout(2500)
    r.expect(r.js("() => { var e = document.getElementById('dawn-play-again'); return !e || getComputedStyle(e).visibility === 'hidden' || !e.classList.contains('dawn-petal-restart'); }"), "ANOTHER NIGHT showed with the petal page")
    r.wait_for("() => !!document.querySelector('.dawn-petal-wrap')", 6000, "the petals to rise soon after their page")
    r.wait_for("() => { var e = document.getElementById('dawn-play-again'); return e && e.classList.contains('dawn-petal-restart'); }", 20000, "ANOTHER NIGHT after the petals")


@check("french-ashtray-clear", "2026-11-08 note 6: the French bar's ashtray runs into nothing")
def _(r):
    r.go("The French", wait=9000)
    hits = r.js("""() => { var T = window.THREE, reg = window._dssThreeRegistry || {}, out = [];
      for (var k in reg) { var sc = reg[k] && reg[k].scene; if (!sc) continue; sc.updateMatrixWorld(true);
        var ash = null; sc.traverse(function (o) { if (!ash && o.isGroup && o.children.some(function (c) { return c.geometry && c.geometry.type === 'LatheGeometry' && c.material && c.material.opacity === 0.3; })) ash = o; });
        if (!ash) continue;
        var g = new T.Box3().setFromObject(ash).expandByScalar(0.005);
        sc.traverse(function (o) { if (!o.isMesh || !o.visible) return; for (var p = o; p; p = p.parent) if (p === ash) return;
          var b = new T.Box3().setFromObject(o); if (b.isEmpty()) return; var s = b.getSize(new T.Vector3()); if (s.x > 0.3 || s.z > 0.3) return;
          if (b.intersectsBox(g)) out.push(o.geometry.type); }); }
      return out; }""")
    r.expect(not hits, "the ashtray runs into %s" % hits)


HALO_OFF = r"""(room) => { var T = window.THREE, R = window.__dssRooms[room], out = [];
  R.camera.updateMatrixWorld(true); var W = R.wrap.getBoundingClientRect();
  function scr(v) { var p = v.clone().project(R.camera); return [(p.x + 1) / 2 * W.width, (1 - p.y) / 2 * W.height]; }
  R.names().forEach(function (n) { var sp = R.spot(n); if (!sp || !sp.root) return;
    var wp = new T.Vector3(); if (sp.haloAt) wp.fromArray(sp.haloAt); else { sp.root.getWorldPosition(wp); if (sp.figure) wp.y += 0.45; }
    var b = new T.Box3().setFromObject(sp.root); if (b.isEmpty()) return;
    var xs = [], ys = []; for (var q = 0; q < 8; q++) { var s = scr(new T.Vector3(q & 1 ? b.max.x : b.min.x, q & 2 ? b.max.y : b.min.y, q & 4 ? b.max.z : b.min.z)); xs.push(s[0]); ys.push(s[1]); }
    var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys), h = scr(wp);
    var mx = Math.max(12, (x1 - x0) * 0.1), my = Math.max(12, (y1 - y0) * 0.1);
    var c = new T.Vector3(); b.getCenter(c);
    if (!(h[0] >= x0 - mx && h[0] <= x1 + mx && h[1] >= y0 - my && h[1] <= y1 + my) || c.distanceTo(wp) > b.getSize(new T.Vector3()).length() * 0.75)
      out.push(n + ' (halo at ' + h.map(Math.round) + ', object ' + [x0, y0, x1, y1].map(Math.round) + ')'); });
  return out; }"""


@check("room-halos-on-objects", "2026-11-08 nightwork (family J, after Sam's playtest note 37): in every room each object's halo sits on the object, not on the wall beside it")
def _(r):
    bad = []
    for room, pn in ROOMS:
        r.go(pn, wait=6000)
        r.wait_for("() => !!(window.__dssRooms && window.__dssRooms['%s'])" % room, 15000, "the %s room" % room)
        r.page.wait_for_timeout(2000)
        off = r.js(HALO_OFF, room)
        if off:
            bad.append("%s: %s" % (room, "; ".join(off)))
    r.expect(not bad, "halos off their objects: " + " | ".join(bad))


@check("labels-named", "2026-11-08 nightwork (family E, after Sam's playtest notes 5, 14 and 21): no link or card button says only On. or Continue (the Dawn's own page turns excepted)")
def _(r):
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    html = re.sub(r'<button class="dawn-on" type="button">On\.</button>', "", html)
    found = re.findall(r"\[\[(?:On\.|Continue)\||>\s*On\.\s*</button>|textContent = [^;]{0,80}'On\.'", html)
    r.expect(not found, "vague labels in the build: %s" % found[:6])


@check("voices-slip-lets-back-through", "2026-11-08 nightwork (family A): a VOICES slip still typing does not swallow the first click on Back to the room")
def _(r):
    r.go("Coach and Horses bar")
    r.room_ready("cb")
    r.click_object("cb", "A cow")
    r.wait_for("() => !!document.querySelector('.dss-hint-slip.dss-hint-voices:not(.typed):not(.out)')", 12000, "the VOICES slip to start typing")
    b = r.page.locator(".dss-room-back:visible").first.bounding_box()
    r.page.mouse.click(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
    r.wait_for("() => window.__dssRooms.cb.mode() !== 'inspect'", 4000, "one click on Back to the room to leave the close-up while VOICES types")

TI_OVERLAPS = """() => { var R = window.__dssRooms.ti, out = [], items = [];
  function box(o) { var b = new THREE.Box3(), any = false; o.updateMatrixWorld(true); o.traverse(function(m) { if (!m.isMesh || !m.visible || !m.geometry) return; var ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every(function(x) { return !x || x.visible === false || x.transparent || x.isMeshBasicMaterial; })) return; if (m.geometry.type === 'TubeGeometry' || (m.geometry.type === 'SphereGeometry' && m.geometry.parameters.radius < 0.04)) return; /* fairy-light wires and bulbs run along things on purpose */
    if (!m.geometry.boundingBox) m.geometry.computeBoundingBox(); b.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld)); any = true; }); return any ? b : null; }
  R.scene.children.forEach(function(o, i) { if (!o.visible || o.isLight || o.name === 'dssPipes') return; var b = box(o); if (!b) return; var s = b.getSize(new THREE.Vector3());
    if (s.x > 5 || s.z > 5) { if (o.isGroup) o.children.forEach(function(c, j) { var bc = box(c); if (bc) items.push({ n: i + '.' + j, b: bc, g: i }); }); return; } items.push({ n: String(i), b: b, g: i }); });
  function vol(b) { var s = b.getSize(new THREE.Vector3()); return Math.max(s.x, 0.01) * Math.max(s.y, 0.01) * Math.max(s.z, 0.01); }
  for (var a = 0; a < items.length; a++) for (var c = a + 1; c < items.length; c++) {
    var A = items[a].b, B = items[c].b, I = A.clone().intersect(B); if (I.isEmpty()) continue; var t = I.getSize(new THREE.Vector3()); if (t.x < 0.005 || t.y < 0.005 || t.z < 0.005) continue;
    var S = vol(A) < vol(B) ? A.getSize(new THREE.Vector3()) : B.getSize(new THREE.Vector3()), sz = [S.x, S.y, S.z], tt = [t.x, t.y, t.z], thin = sz.indexOf(Math.min.apply(null, sz)), f = 1; for (var k = 0; k < 3; k++) if (k !== thin) f *= Math.min(1, tt[k] / Math.max(sz[k], 0.01)); /* face overlap: flat things on a wall are measured across their face, not their depth */ if (f > 0.1) out.push(items[a].n + ' at ' + A.getCenter(new THREE.Vector3()).toArray().map(function(v) { return v.toFixed(2); }) + ' with ' + items[c].n + ' at ' + B.getCenter(new THREE.Vector3()).toArray().map(function(v) { return v.toFixed(2); }) + ' (' + Math.round(f * 100) + '%)'); }
  return out; }"""


@check("ti-no-overlaps", "2026-11-09 note: in Trisha's lots of objects overlapped (panels under the wheel, clock and photographs; porthole on the door frame; bench and monster in the stairwell wall)")
def _(r):
    r.go("Trisha's", wait=6500)
    r.room_ready("ti")
    r.page.wait_for_timeout(3000)
    clash = r.js(TI_OVERLAPS)
    r.expect(not clash, "objects in Trisha's overlap: " + "; ".join(clash[:8]))


def main(argv):
    want = [a.lower() for a in argv[1:]]
    todo = [c for c in CHECKS if not want or any(w in c[0] for w in want)]
    exe = chrome_path()
    if not exe:
        print("No Chrome for Testing in ~/Library/Caches/ms-playwright. Run: ~/.dss-regress/venv/bin/playwright install chromium")
        return 2
    srv = serve()
    port = srv.server_address[1]
    failed = 0
    t_all = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=exe, headless=True, args=FLAGS)
        for name, note, fn in todo:
            r = Run(browser, port, name)
            t0 = time.time()
            err = None
            try:
                fn(r)
            except Fail as e:
                err = str(e)
            except Exception as e:
                err = "harness error: " + "".join(traceback.format_exception_only(type(e), e)).strip()[:300]
            problems = r.finish(err is not None)
            ok = err is None and not problems
            failed += 0 if ok else 1
            print("%s  %-34s %4.0fs  %s" % ("PASS" if ok else "FAIL", name, time.time() - t0, "" if ok else "(" + note + ")"))
            for line in ([err] if err else []) + problems:
                print("        - " + line)
            if getattr(r, "info", ""):
                print("        . " + r.info[:400])
        print("%d of %d passed in %.0f s%s" % (len(todo) - failed, len(todo), time.time() - t_all, "" if not failed else "; screenshots in " + SHOTS), flush=True)
        # 2026-11-08: closing the browser after a long run sometimes never returns; the summary is out, so give it 20 s and go
        threading.Timer(20, lambda: os._exit(1 if failed else 0)).start()
        browser.close()
    srv.shutdown()
    os._exit(1 if failed else 0)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
