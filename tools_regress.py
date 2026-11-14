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
import functools, glob, math, re, http.server, os, socketserver, sys, threading, time, traceback
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
    r.wait_for("() => !!document.querySelector('#dss-lore-overlay')", 8000, "the Chariots lore card (it opens by itself since 2026-11-11 note 5)")
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


@check("trail-badge-shows", "2026-11-09 earlier note 34: no sign in the bottom left of which trail you were on")
def _(r):
    r.go("Dean Street", wait=5000)
    r.expect(not r.js("() => !!document.querySelector('.dss-trail-badge')"), "a trail badge shows before any trail is begun")
    r.js("() => { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { x.setAttribute('data-trails', 'true'); x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; f(); setInterval(f, 100); localStorage.setItem('dssVoicesSeen', JSON.stringify(['ci/A piano'])); localStorage.setItem('dssTrailTonight', JSON.stringify({ n: +localStorage.getItem('dssNightNo') || 0, seen: {'ci/A piano': true} })); }")
    r.page.wait_for_timeout(1500)
    t = r.js("() => { var t = document.querySelector('.dss-trail-badge'); if (!t) return ''; var b = t.getBoundingClientRect(); return (b.right <= innerWidth && b.right > innerWidth - 420 && b.top > 60 && b.top < 320 ? 'in ' : 'out ') + t.textContent; }")
    r.expect(t.startswith("in ") and "THE HIMALAYAS TRAIL" in t and "Pillars of Hercules" in t, "the trail badge is missing, wrong or off its corner (%r)" % t)


@check("trail-compass", "2026-11-11 note 9: the trail badge is a compass whose hand points across the Soho map to the next step's door")
def _(r):
    r.go("Dean Street", wait=5000)
    r.js("() => { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { x.setAttribute('data-trails', 'true'); x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; f(); setInterval(f, 100); localStorage.setItem('dssVoicesSeen', JSON.stringify(['ci/A piano'])); localStorage.setItem('dssTrailTonight', JSON.stringify({ n: +localStorage.getItem('dssNightNo') || 0, seen: {'ci/A piano': true} })); }")
    r.page.wait_for_timeout(1500)
    r.expect(r.js("() => !!document.querySelector('.dss-trail-badge .dss-compass-hand')"), "the trail badge has no compass")
    door = r.js("() => { var d = window.dssSohoMap.doors.filter(function (x) { return x.id === 'pillars'; })[0]; return [d.fc, d.fr]; }")
    got = []
    for spot in ([19, 30], [43, 30], [30, 11]):
        ok = r.js("([c, r0]) => { for (var dc = 0; dc < 4; dc++) for (var s = -1; s <= 1; s += 2) if (window.__dssSohoTeleport(c + dc * s, r0)) return [c + dc * s, r0]; return null; }", spot)
        r.expect(ok, "could not stand at %s" % spot)
        if not ok: return
        r.page.wait_for_timeout(1400)
        ang = r.js("() => { var m = new DOMMatrix(getComputedStyle(document.querySelector('.dss-trail-badge .dss-compass-hand')).transform); return Math.atan2(m.b, m.a) * 180 / Math.PI; }")
        want = math.degrees(math.atan2(door[0] - ok[0], -(door[1] - ok[1])))
        off = abs(((ang - want) + 540) % 360 - 180)
        got.append("%s: %.0f (want %.0f)" % (ok, ang, want))
        r.expect(off < 12, "the compass points %.0f degrees off the Pillars door from %s" % (off, ok))
    r.info = "; ".join(got)
    r.page.locator(".dss-trail-badge").screenshot(path=os.path.join(SHOTS, "trail-compass.png"))


@check("trail-picks-up-part-way", "2026-11-09 Sam: a trail can be picked up at any step (the cellar starts two of them)")
def _(r):
    r.go("Dean Street", wait=5000)
    r.js("() => { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { x.setAttribute('data-trails', 'true'); x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; f(); setInterval(f, 100); localStorage.setItem('dssVoicesSeen', JSON.stringify(['pi/A lattice window'])); localStorage.setItem('dssTrailTonight', JSON.stringify({ n: +localStorage.getItem('dssNightNo') || 0, seen: {'pi/A lattice window': true} })); }")
    r.page.wait_for_timeout(1500)
    t = r.js("() => { var t = document.querySelector('.dss-trail-badge'); return t ? t.textContent : ''; }")
    r.expect("THE HIMALAYAS TRAIL" in t and "French" in t, "seeing only the trail's middle step lit no badge for its last (%r)" % t)


@check("trishas-trail-door", "2026-11-09 Sam: the Nazca trail needs a way past Trisha's bouncers without the matchbook")
def _(r):
    r.page.add_init_script("(function () { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { if (x.getAttribute('data-trails') !== 'true') x.setAttribute('data-trails', 'true'); if (x.getAttribute('data-lying') !== 'lighter cocaine ticket slip eye') x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; new MutationObserver(f).observe(document, { subtree: true, childList: true, attributes: true }); })();")
    r.go("Dean Street", wait=3000)
    r.js("() => { localStorage.setItem('dssVoicesSeen', JSON.stringify([])); localStorage.removeItem('dssTrailTonight'); }")
    r.go("Failure: Trisha's", wait=4000)
    t = r.js("() => document.querySelector('tw-story').innerText")
    r.expect("They do not know you." in t, "off the trail, the doorman no longer refuses (%r)" % t[:200])
    r.js("() => { localStorage.setItem('dssVoicesSeen', JSON.stringify(['cu/A bulb'])); localStorage.setItem('dssTrailTonight', JSON.stringify({ n: +localStorage.getItem('dssNightNo') || 0, seen: {'cu/A bulb': true} })); }")
    r.go("Failure: Trisha's", wait=4000)
    t = r.js("() => document.querySelector('tw-story').innerText")
    r.expect("Enter Trisha" in t and "They do not know you." not in t, "with Trisha's the live trail step, the doorman still refuses (%r)" % t[-300:])


SWAPS = []   # (old, new) pairs applied to the served html: only for proving a check fails with an old bug planted (see --plant)


def scratch_passage(r, name, body):
    """Serve the built html with one extra passage, for states a ?start= jump cannot set (e.g. a later night phase)."""
    import html as _h
    def handle(route):
        resp = route.fetch(); t = resp.text()
        for a, b in SWAPS:
            assert a in t, "plant: %r not in the html" % a; t = t.replace(a, b)
        tag = '<tw-passagedata pid="99999" name="%s" tags="" position="0,0" size="100,100">%s</tw-passagedata>' % (_h.escape(name), _h.escape(body))
        route.fulfill(response=resp, body=t.replace("</tw-storydata>", tag + "</tw-storydata>", 1))
    r.page.route("**/" + HTML + "*", handle)


@check("barber-jimmy-slips", "2026-11-09 note 14: a slip telling you the barbershop, then Mister Jimmy's, has opened")
def _(r):
    scratch_passage(r, "T-phase1", '(set: $nightPhase to 1)(set: $returns to 3)[[Walk on|Dean Street]]')
    r.go("T-phase1", wait=4000)
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.page.wait_for_timeout(3000)
    typed = lambda: r.js("() => [].map.call(document.querySelectorAll('.dss-hint-type, .dss-hint-slip'), function (e) { return e.textContent; }).join(' | ')")
    r.wait_for("() => document.body.innerText.indexOf('barbershop on Meard Street') >= 0 || [].some.call(document.querySelectorAll('.dss-hint-slip'), function (e) { return e.textContent.indexOf('barbershop') >= 0; })", 20000, "the barbershop slip on Dean Street at night phase 1")
    r.expect("Mister Jimmy" not in typed(), "Mister Jimmy's slip showed at night phase 1")
    r.clear_slips()
    scratch_passage(r, "T-phase2", '(set: $nightPhase to 2)(set: $returns to 4)(set: $barberSlipShown to true)[[Walk on|Dean Street]]')
    r.go("T-phase2", wait=4000)
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip'), function (e) { return e.textContent.indexOf('Mister Jimmy') >= 0; })", 20000, "Mister Jimmy's slip on Dean Street at night phase 2")


@check("inis-speech-types-by-paragraph", "2026-11-09 (earlier note 28): INIS's speech should type like The Night Ahead, each paragraph in about the same time")
def _(r):
    r.go("O'Flatterly's Third Pillar", wait=200)
    r.js("""() => { var t0 = performance.now(); window.__seen = new Map(); var iv = setInterval(function () { var v = document.querySelector('.dss-speech.vt-on:not(.dss-ghost .dss-speech)'); if (!v) return; v.querySelectorAll('.vt-c.vt-in').forEach(function (c) { if (!window.__seen.has(c)) window.__seen.set(c, performance.now() - t0); }); if (v.classList.contains('vt-done')) { clearInterval(iv); var w = document.createTreeWalker(v, NodeFilter.SHOW_ELEMENT), paras = [[]], ended = false; while (w.nextNode()) { var n = w.currentNode; if (n.tagName === 'BR') { if (paras[paras.length - 1].length) paras.push([]); } else if (n.classList.contains('vt-c') && window.__seen.has(n) && n.textContent.trim()) paras[paras.length - 1].push(window.__seen.get(n)); } paras = paras.filter(function (p) { return p.length > 3; }); window.__paras = paras.map(function (p) { var g = []; for (var k = 1; k < p.length; k++) g.push(p[k] - p[k - 1]); g.sort(function (x, y) { return x - y; }); return { n: p.length, med: Math.round(g[g.length >> 1]), breath: 0, start: Math.round(p[0]), end: Math.round(p[p.length - 1]) }; }); } }, 25); }""")
    r.wait_for("() => !!window.__paras", 60000, "INIS's speech to finish typing")
    d = r.js("() => window.__paras")
    r.info = "paragraph times ms: %r" % d
    r.expect(len(d) >= 2, "INIS's speech has fewer than two paragraphs (%r)" % d)
    for q in d:   # The Night Ahead's rule: about 1550 ms a paragraph spread over its letters, 22 to 74 ms a letter (the 25 ms poll blurs it a little)
        want = max(22, min(74, 1550.0 / q["n"]))
        r.expect(abs(q["med"] - want) <= 30, "a paragraph of %d letters types at %d ms a letter, not The Night Ahead's %d" % (q["n"], q["med"], want))
    breaths = [b["start"] - a["end"] for a, b in zip(d, d[1:])]
    r.expect(min(breaths) >= 280, "no breath between INIS's paragraphs (%r ms)" % breaths)


@check("endgame-1109", "2026-11-09 notes 34-40: LINE 3's gold bloom, THE WAY OUT slip, every typewriter page stained, the Dawn's route caption, THE END before ANOTHER NIGHT")
def _(r):
    scratch_passage(r, "T-l3", '(set: $alba to (a: $alba1, $alba2))[[Walk on|LINE 3]]')
    r.go("T-l3", wait=4000)
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.page.wait_for_timeout(3000)
    for _ in range(6):   # the dawn's approach first: press on until the line itself
        if r.js("() => !!document.querySelector('.dss-poem-whole:not(.dss-ghost *)')"): break
        l = r.page.locator("tw-link:visible:not(.dss-ghost tw-link)", has_text="Closer")
        if l.count(): l.first.click()
        r.page.wait_for_timeout(2500)
    r.wait_for("() => { var e = document.querySelector('.dss-poem-whole .dpw-words'); return e && !e.closest('.dss-ghost') && +getComputedStyle(e).opacity > 0.6; }", 25000, "THE POEM IS COMPLETE to bloom in gold on LINE 3")
    col = r.js("() => getComputedStyle(document.querySelector('.dss-poem-whole .dpw-words')).color")
    r.expect(col.startswith("rgb(") and int(col[4:].split(",")[0]) > 200, "LINE 3's words are not gold (%s)" % col)
    r.page.wait_for_timeout(5000)
    sh = r.js("() => [document.scrollingElement.scrollHeight, innerHeight]")
    r.expect(sh[0] <= sh[1] + 2, "LINE 3 with the poem whole scrolls at 1440x900 (%r)" % sh)
    r.go("Things turn up", wait=4000)
    bg = r.js("() => { var p = document.querySelector('.typewriter-page'); return p ? getComputedStyle(p, '::after').backgroundImage.slice(0, 4000) : 'no page'; }")
    r.expect("tnaB1" in bg, "Things turn up's typewriter page lacks The Night Ahead's stains")
    scratch_passage(r, "T-whole", '(set: $alba to (a: $alba1, $alba2, $alba3))(set: $returns to 3)[[Walk on|Dean Street]]')
    r.go("T-whole", wait=4000)
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip'), function (e) { return e.textContent.indexOf('THE WAY OUT') >= 0 && e.textContent.indexOf('You need more to get out') >= 0; })", 25000, "THE WAY OUT slip after the whole poem")
    r.page.unroute("**/*")
    r.go("Dawn", wait=2000)   # a walked night for the route map: ten steps along the first open row of the Soho plan
    seeded = r.js("() => { var M = window.dssSohoMap, n = +localStorage.getItem('dssNightNo') || 0; if (!M || !M.tiles) return false; for (var y = 0; y < M.rows; y++) { var p = []; for (var x = 0; x < M.cols; x++) { if (M.tiles[y][x] !== '#') p.push(x + ',' + y); else if (p.length < 10) p = []; else break; } if (p.length >= 10) { localStorage.setItem('dssRouteNow', JSON.stringify({ n: n, p: p.slice(0, 10) })); return true; } } return false; }")
    r.expect(seeded, "could not seed a route for the Dawn's map")
    r.go("Dawn", wait=3000)
    for _ in range(4):
        b = r.page.locator(".dawn-page.dawn-pg-on .dawn-on")
        if b.count():
            b.first.click(); r.page.wait_for_timeout(2500)
    r.expect(r.js("() => [].some.call(document.querySelectorAll('.dnp-caption'), function (e) { return /Your night.s route/.test(e.textContent); })"), "the Dawn's map has no 'Your night's route' caption")
    r.wait_for("() => { var e = document.getElementById('dawn-play-again'); return e && e.classList.contains('dawn-petal-restart'); }", 60000, "ANOTHER NIGHT after the petals")
    op = r.js("() => { var f = document.querySelector('.dawn-petal-finis'); return f ? +getComputedStyle(f).opacity : -1; }")
    r.expect(op > 0.85, "ANOTHER NIGHT came before THE END had come in (THE END opacity %s)" % op)


@check("ship-branches-render", "2026-11-09 ship rebuild: every call answer and fate renders the Harp's alley, the ask, the phone box and the Dawn with no Harlowe error")
def _(r):
    combos = []
    for call in ["pending", "offered", "given", "kept", "other-told", "other-kept", "warned", "refused", "missed"]:
        for fate in ["afloat", "sunk"]:
            combos.append((call, fate, "false", "true", "false"))
    combos += [("given", "afloat", "true", "true", "true"), ("given", "sunk", "true", "false", "true"), ("refused", "sunk", "false", "false", "true")]
    bad = []
    for call, fate, drunk, setup, resolved in combos:
        for page in ["The Harp's Alley", "Harp Alley Ask", "The Phone Box Answered", "Dawn"]:
            body = '(set: $shipCall to "%s")(set: $shipFate to "%s")(set: $shipCallDrunk to %s)(set: $shipSetup to %s)(set: $shipResolved to %s)(set: $metSalvu to true)(set: $harpMet to true)(set: $holdsAshtonName to true)(go-to: "%s")' % (call, fate, drunk, setup, resolved, page)
            r.page.unroute("**/*")
            scratch_passage(r, "T-ship", body)
            r.go("T-ship", wait=2200)
            e = r.js("() => [].map.call(document.querySelectorAll('tw-error, tw-story tw-expression[type=error]'), function (x) { return x.textContent.slice(0, 120); }).join(' | ')")
            if e: bad.append("%s/%s/%s/%s %s: %s" % (call, fate, drunk, resolved, page, e))
    r.page.unroute("**/*")
    r.info = "%d combinations" % len(combos)
    r.expect(not bad, "Harlowe errors: " + " || ".join(bad[:6]))


@check("gents-letters-solve", "2026-11-09 note 32, then 2026-11-14 (Sam: \"Can you put the anagram on the door? Make it the main thing\"): the jumbled letters are on the inside of the gents door in the 3D view, swap by real clicks there, turn gold, and open the way out; the page carries no tiles, only a way back to the door")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Coach and Horses lock", wait=5000)
    r.clear_lore(); r.clear_slips()
    D = "window._dssGentsDoor"
    r.wait_for("() => !!(%s && %s.wrap && %s.wrap.isConnected)" % (D, D, D), 15000, "the letters on the gents door")
    want = "JEFFREYBERNARDISUNWELL"
    cur = r.js("() => %s.letters()" % D)
    r.expect(sorted(cur) == sorted(want) and cur != want, "the door reads %r, not a jumble of JEFFREY BERNARD IS UNWELL" % cur)
    pts = r.js("([n]) => { var o = []; for (var i = 0; i < n; i++) o.push(%s.point(i)); return o; }" % D, [len(want)])
    off = [i for i, q in enumerate(pts) if not (20 < q[0] < 1420 and 20 < q[1] < 760)]
    r.expect(not off, "%d of the door's letters are off screen or under the buttons at 1440x900" % len(off))
    r.expect(min(abs(pts[i + 1][0] - pts[i][0]) for i in range(6)) >= 18, "the door's letters are closer than 18px apart: too small to click")
    r.expect(not r.js("() => !!document.querySelector('.gents-exit.gents-open:not(.dss-ghost *)')"), "the way out shows before the letters are sorted")
    # Steady Yourself with the letters unsorted: the page has no tiles of its own, and a way back to the door
    r.page.locator("text=/steady yourself/i").first.click(); r.page.wait_for_timeout(2500)
    r.expect(r.js("() => document.querySelectorAll('.gents-letters:not(.dss-ghost *) .gl-tile').length") == 0, "the page still carries its own letter tiles while the door has them")
    back = r.page.locator(".gents-letters:not(.dss-ghost *) .gl-door")
    r.expect(back.count() == 1, "no way back to the door on the page while the letters are unsorted")
    back.first.click(); r.page.wait_for_timeout(1200)
    r.expect(not r.js("() => %s.wrap.hidden" % D), "Back to the door did not bring the gents back")
    q = r.js("() => %s.point(0)" % D); r.page.mouse.move(q[0], q[1]); r.page.wait_for_timeout(250)
    r.expect(r.js("() => %s.wrap.style.cursor" % D) == "pointer", "no pointer cursor over a letter on the door")
    for i in range(len(want)):   # sort like a player: pick the wrong letter, then one further on that belongs here
        cur = r.js("() => %s.letters()" % D)
        if cur[i] == want[i]: continue
        j = next(k for k in range(i + 1, len(want)) if cur[k] == want[i] and cur[k] != want[k])
        for n in (i, j):
            q = r.js("([n]) => %s.point(n)" % D, [n]); r.page.mouse.click(q[0], q[1]); r.page.wait_for_timeout(120)
    r.page.wait_for_timeout(800)
    r.expect(r.js("() => %s.letters()" % D) == want and r.js("() => %s.solved()" % D), "the door reads %r after sorting by clicks, and is not marked sorted" % r.js("() => %s.letters()" % D))
    r.expect(r.js("() => !!document.querySelector('.gents-exit.gents-open:not(.dss-ghost *)')"), "the way out did not show once JEFFREY BERNARD IS UNWELL read true")
    r.page.locator("text=/steady yourself/i").first.click(); r.page.wait_for_timeout(2500)
    r.expect(r.page.locator(".gents-exit:not(.dss-ghost *) tw-link:visible").count() == 1, "the way out is not on the page after the door is sorted")
    r.expect(r.js("() => document.querySelectorAll('.gents-letters:not(.dss-ghost *) .gl-door').length") == 0, "Back to the door still shows once the letters are sorted")


@check("gents-just-solve", "2026-11-14 (Sam: \"have 'Just solve it, I need a drink.' as a button to solve it fast\"): his button is in the gents with the letters unsorted, clear of Steady Yourself, sorts the door in a few seconds, opens the way out and goes")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Coach and Horses lock", wait=5000)
    r.clear_lore(); r.clear_slips()
    D = "window._dssGentsDoor"
    r.wait_for("() => !!(%s && %s.wrap && %s.wrap.isConnected)" % (D, D, D), 15000, "the letters on the gents door")
    qb = r.page.locator(".gents-just-solve:visible")
    r.expect(qb.count() == 1, "no quick-solve button in the gents")
    r.expect(qb.first.inner_text().strip() == "Just solve it, I need a drink.", "the quick-solve button reads %r, not his words" % qb.first.inner_text())
    clash = r.js("""() => { var q = document.querySelector('.gents-just-solve').getBoundingClientRect(), bad = []; if (q.left < 0 || q.right > innerWidth || q.top < 0 || q.bottom > innerHeight) bad.push('off screen');
      [].forEach.call(%s.wrap.querySelectorAll('button, .dss-room-caption'), function (e) { if (e.classList.contains('gents-just-solve')) return; var b = e.getBoundingClientRect(); if (b.width && q.left < b.right && q.right > b.left && q.top < b.bottom && q.bottom > b.top) bad.push('over ' + (e.textContent || '').trim().slice(0, 24)); });
      for (var i = 0; i < 22; i++) { var pt = %s.point(i); if (pt[0] > q.left && pt[0] < q.right && pt[1] > q.top && pt[1] < q.bottom) bad.push('over letter ' + i); } return bad.join(', '); }""" % (D, D))
    r.expect(not clash, "the quick-solve button is " + clash)
    r.expect(not r.js("() => %s.solved()" % D), "the door is sorted before anything is pressed")
    qb.first.click()
    r.wait_for("() => %s.solved() && %s.letters() === %s.want" % (D, D, D), 5000, "the door to sort itself after Just solve it")
    r.expect(r.js("() => !!document.querySelector('.gents-exit.gents-open:not(.dss-ghost *)')"), "the way out did not show after Just solve it")
    r.expect(r.page.locator(".gents-just-solve").count() == 0, "the quick-solve button is still there once the door is sorted")
    r.page.locator("text=/steady yourself/i").first.click(); r.page.wait_for_timeout(2500)
    r.expect(r.page.locator(".gents-exit:not(.dss-ghost *) tw-link:visible").count() == 1, "the way out is not on the page after Just solve it")


@check("colony-membership", "2026-11-09 (Sam): after the first Colony visit you are made a member (a slip, once) and the Donkey no longer picks the door")
def _(r):
    scratch_passage(r, "T-colony", '(set: $visited to (dm: "French", false, "Pillars", false, "Colony", true, "Ronnies", false))(set: $hasCoin to true)(set: $returns to 2)[[Walk on|Dean Street]]')
    r.go("T-colony", wait=4000)
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip'), function (e) { return e.textContent.indexOf('member of the Colony Room') >= 0; })", 20000, "the Colony membership slip")
    r.page.unroute("**/*")
    scratch_passage(r, "T-colony2", '(set: $visited to (dm: "French", false, "Pillars", false, "Colony", true, "Ronnies", false))(set: $hasCoin to true)(set: $colonyMember to true)[[Walk on|The Colony Room Door]]')
    r.go("T-colony2", wait=4000)
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.page.wait_for_timeout(3000)
    flag = r.js("() => { var f = [].filter.call(document.querySelectorAll('.dss-coin-flag'), function (e) { return !e.closest('.dss-ghost'); })[0]; return f ? f.textContent.trim() : 'none'; }")
    r.expect(flag == "0", "a member holding the Donkey still has the coin pick the Colony door (flag %r)" % flag)
    r.page.unroute("**/*")


@check("lackland-talk-after-reading", "2026-11-09 note 13: once LACKLAND has read the book, a visit has a Talk to LACKLAND on his card, with Sam's line for the verdict he gave")
def _(r):
    for near, want in (("true", "chin up and head down"), ("false", "glassy as a snifter")):
        scratch_passage(r, "T-lk", '(set: $lacklandRead to true)(set: $lacklandNear to %s)[[Walk on|Martin Lackland\'s Office]]' % near)
        r.go("T-lk", wait=4000)
        r.page.locator("tw-link:has-text('Walk on')").first.click()
        r.room_ready("lk")
        r.clear_lore(); r.clear_slips()
        r.click_object("lk", "LACKLAND")
        r.page.wait_for_timeout(700)
        r.clear_lore()
        r.press("Talk to LACKLAND")
        r.page.wait_for_timeout(900)
        if r.js("() => !!document.querySelector('#dss-lore-overlay.dss-lore-auto')"):   # a first-visit lore waiting behind the card comes first; then ask again
            r.page.locator("#dss-lore-overlay.dss-lore-auto button:visible, #dss-lore-overlay.dss-lore-auto [role=button]:visible", has_text="Talk to LACKLAND").first.click()
            r.page.wait_for_timeout(1200)
        got = r.js("() => { var o = document.querySelector('#dss-lore-overlay.dss-jeff-card'); return o ? o.textContent.replace(/\\s+/g, ' ') : ''; }")
        r.expect(want in got, "after the %s verdict, Talk to LACKLAND showed %r" % ("near-yes" if near == "true" else "refusal", got[:120]))
        r.page.unroute("**/*")


@check("phone-other-question", "2026-11-09 (Sam's lines): with no name to give, FRANKIE asks who got you out (JOHN's rescue only); tell him or hang up; out alone or never down, he only checks you're about")
def _(r):
    def call(saved, press, want):
        scratch_passage(r, "T-call", '(set: $shipCall to "offered")(set: $shipSetup to true)(set: $holdsAshtonName to false)(set: $savedBy to "%s")(set: $sobriety to 80)[[Walk on|The Phone Box Answered]]' % saved)
        r.go("T-call", wait=4000)
        r.clear_slips()
        r.page.locator("tw-link:has-text('Walk on')").first.click(); r.page.wait_for_timeout(2500)
        r.clear_lore(); r.clear_slips()
        if press:
            r.page.locator("tw-link", has_text=press).first.click(); r.page.wait_for_timeout(1500)
        t = r.js("() => { var g = document.querySelector('.dss-ghost'); if (g) g.remove(); return document.querySelector('tw-story').innerText.replace(/\\s+/g, ' '); }")   # the scene lifts its words out of tw-passage
        r.expect(want in t, "savedBy %s, %s: expected %r, page reads %r" % (saved, press or "no press", want, t[:200]))
        r.expect(not r.js("() => !!document.querySelector('tw-error')"), "a Harlowe error on the call")
        r.page.unroute("**/*")
        return t
    t = call("john", None, "You’re going to tell me who it was.")
    r.expect("Tell him" in t and "Hang up" in t, "JOHN's rescue: no Tell him / Hang up")
    call("john", "Tell him", "clean as the driven snow")
    call("john", "Hang up", "now you know that they know who you are")
    t = call("nobody", None, "Stay easy.")
    r.expect("Tell him" not in t, "out alone, but FRANKIE still asked a question")
    call("", None, "Stay easy.")


@check("woman-line-paper-lore", "2026-11-09 (Sam): the Woman from the Line's paper carries a lore note on the overnight editions; her afloat news is Sam's line")
def _(r):
    for fate, want in (("afloat", "made it to Liverpool"), ("sunk", "all souls with her")):
        scratch_passage(r, "T-line", '(set: $shipFate to "%s")(set: $sobriety to 80)(set: $shipSetup to true)[[Walk on|The Woman from the Line]]' % fate)
        r.go("T-line", wait=4000)
        r.clear_slips()
        r.page.locator("tw-link:has-text('Walk on')").first.click(); r.page.wait_for_timeout(3500)
        r.expect(not r.js("() => !!document.querySelector('tw-error')"), "a Harlowe error on the Woman from the Line (%s)" % fate)
        seen = ""
        for _ in range(20):
            seen = r.js("() => { var o = document.querySelector('#dss-lore-overlay'); var g = document.querySelector('.dss-ghost'); if (g) g.remove(); return (o ? o.innerText : '') + ' | ' + document.querySelector('tw-story').innerText; }").replace("\n", " ")
            if "TOMORROW" in seen.upper() and "Fleet Street" in seen: break
            r.js("() => { if (document.querySelector('#dss-lore-overlay')) return; var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return /Tomorrow’s Paper/.test(e.textContent) && !e.closest('.dss-ghost'); })[0]; if (l && window.dssLore) window.dssLore.open(l); }")   # the link hides behind a dagger; press it as the dagger does
            r.page.wait_for_timeout(500)
        r.expect("Fleet Street" in seen, "%s: the lore note on the editions did not open (%r)" % (fate, seen[:200]))
        r.expect(want in seen, "%s: expected %r" % (fate, want))
        r.page.unroute("**/*")


@check("lk-back-gun-card", "2026-11-09 (Sam's words) + 2026-11-13 notes 21-23: the back room's modelled gun glows, a click on it flies in and shows his line in a room card; the ball rallies over the net; SECRET BACK ROOM caption; the button is not WATCH THE MATCH")
def _(r):
    r.go("Lackland's Back Room", wait=9000)
    r.clear_lore(); r.clear_slips()
    r.page.wait_for_timeout(3000); r.clear_slips(rounds=10)   # the night's first haunt brings THE GREAT WORK slips (2026-11-11), modal
    r.wait_for("() => !!window.__dssBackRoomGun", 15000, "the back room gun")
    r.page.wait_for_timeout(800)
    labels = r.js("() => [].map.call(document.querySelectorAll('#pb-wrap button, #pb-wrap .dss-room-caption'), function (b) { return b.textContent; }).join(' | ') + ' | ' + document.body.innerText")
    r.expect("WATCH THE MATCH" not in labels, "the arrival button still says WATCH THE MATCH above Watch the decider")
    r.expect("SECRET BACK ROOM" in labels, "the caption is not LACKLAND'S SECRET BACK ROOM")
    r.expect(not r.js("() => [].some.call(document.querySelectorAll('img, [src]'), function (e) { return /lackland-backroom-webley/.test(e.src || ''); })"), "the drawn Webley plane is back")
    st = r.js("() => window.__dssBackRoomGun.state()")
    r.expect(st["glow"] > 0.2, "the gun has no resting glow (%r)" % st)
    zs = r.js("() => [0, .3, .6, .9, 1.2, 1.5, 1.8, 2.1].map(function (t) { return window.__dssBackRoomBall(t).z; })")
    r.expect(min(zs) < -0.9 and max(zs) > 0.0, "the ball stays on one side of the net (%r)" % zs)
    xy = r.js("() => window.__dssBackRoomGun.screen()")
    r.page.mouse.click(xy["x"], xy["y"])
    r.page.wait_for_timeout(2200)
    st = r.js("() => window.__dssBackRoomGun.state()")
    r.expect(st["card"] and st["zoom"] > 0.95, "a click on the gun did not fly in to it (%r)" % st)
    got = r.js("() => { var d = document.querySelector('.dss-gun-card'); if (!d) return null; var p = d.querySelector('p'); return { t: d.innerText, c: getComputedStyle(p).color, o: getComputedStyle(d).opacity }; }")
    r.expect(got and "somebody might have to use it" in got["t"], "the gun card did not show Sam's line (%r)" % got)
    r.expect(got["c"] != "rgb(255, 58, 168)", "the gun card is still pink")
    r.expect(float(got["o"]) > 0.9, "the gun card did not come up (%r)" % got)
    r.page.keyboard.press("Escape")
    r.page.wait_for_timeout(2200)
    st = r.js("() => window.__dssBackRoomGun.state()")
    r.expect(not st["card"] and st["zoom"] < 0.05, "Esc did not fly back to the room (%r)" % st)


@check("room-arrival-pulse", "2026-11-09 (Sam, item 1): clicks on a room right after arrival seemed ignored; the opening words hold the room, so a press on the dimmed room pulses the onward button")
def _(r):
    r.go("Entering The Pillars of Hercules", wait=6000)
    r.clear_slips()
    r.wait_for("() => { for (var k in (window.__dssRooms || {})) { var R = window.__dssRooms[k]; if (R.wrap.isConnected && R.wrap.dataset.words === 'modal') return true; } return false; }", 20000, "the Pillars opening words")
    r.page.wait_for_timeout(800)
    d = r.js("() => { var b = [].filter.call(document.querySelectorAll('.dss-room-dismiss'), function (e) { return e.getClientRects().length; })[0]; return b ? b.className : null; }")
    r.expect(d and "pulse" not in d, "the onward button pulses before any press (%r)" % d)
    r.page.mouse.click(120, 450)
    r.page.wait_for_timeout(150)
    d = r.js("() => { var b = [].filter.call(document.querySelectorAll('.dss-room-dismiss'), function (e) { return e.getClientRects().length; })[0]; return b ? { c: b.className, a: getComputedStyle(b).animationName } : null; }")
    r.expect(d and "dss-room-dismiss-pulse" in d["c"] and d["a"] == "dssDismissPulse", "a press on the dimmed room did not pulse the onward button (%r)" % d)
    r.page.wait_for_timeout(1500)
    d = r.js("() => [].filter.call(document.querySelectorAll('.dss-room-dismiss'), function (e) { return e.getClientRects().length; })[0].className")
    r.expect("pulse" not in d, "the pulse did not clear (%r)" % d)
    words = r.js("() => [].filter.call(document.querySelectorAll('.dss-room-prose'), function (e) { return e.getClientRects().length; }).length")
    r.expect(words >= 1, "the press skipped the opening words")


@check("long-page-no-scrollbar", "2026-11-09 (Sam, item 2): Name Your Book showed a scrollbar for about three seconds before the page fit tightened it")
def _(r):
    r.go("Name Your Book", wait=0)
    seen = []
    for _ in range(24):
        r.page.wait_for_timeout(250)
        if r.pn() != "Name Your Book":
            continue
        seen.append(r.js("() => ({ over: document.scrollingElement.scrollHeight - window.innerHeight, bar: window.innerWidth - document.documentElement.clientWidth })"))
    shown = [x for x in seen if x["bar"] > 0]
    r.info = "samples %d, over at most %d px" % (len(seen), max([x["over"] for x in seen] or [0]))
    r.expect(len(seen) >= 8, "Name Your Book never came up")
    r.expect(not shown, "a scrollbar showed while the page settled (%r)" % shown[:3])
    end = seen[-1] if seen else {"over": 0}
    r.expect(end["over"] <= 0, "Name Your Book still runs %d px past the window at 1440x900" % end["over"])


@check("trail-badge-not-before-trails", "2026-11-10 (Sam): the EZEKIEL TRAIL badge showed on the opening page (The Night Ahead), before Dean Street, from steps looked at on an earlier night")
def _(r):
    r.go("The Night Ahead", wait=3000)
    r.js("() => { var t = window.DSS_VOICES.trails, k = Object.keys(t)[0]; localStorage.setItem('dssVoicesSeen', JSON.stringify([t[k].steps[0].at])); }")
    r.page.wait_for_timeout(2500)
    b = r.js("() => { var b = document.querySelector('.dss-trail-badge'); return b ? b.innerText : null; }")
    r.expect(b is None, "a trail badge shows on the opening page (%r)" % b)


@check("trail-badge-tonight-only", "2026-11-10 (Sam: \"this night only\"): the trail badge counts only steps looked at tonight, not on earlier nights")
def _(r):
    scratch_passage(r, "T-trail", '(set: $visitedCarthage to true)[[Walk on|Dean Street]]')
    r.go("T-trail", wait=3000)
    r.clear_slips()
    r.js("() => { var t = window.DSS_VOICES.trails, k = Object.keys(t).filter(function (x) { return x !== 'eye'; })[0]; window.__tk = t[k].steps[0].at; localStorage.setItem('dssVoicesSeen', JSON.stringify([window.__tk])); localStorage.removeItem('dssTrailTonight'); }")
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.page.wait_for_timeout(5000)
    r.page.unroute("**/*")
    r.expect(r.pn() == "Dean Street", "did not reach Dean Street (%s)" % r.pn())
    b = r.js("() => { var b = document.querySelector('.dss-trail-badge'); return b ? b.innerText : null; }")
    r.expect(b is None, "an earlier night's look put up a trail badge (%r)" % b)
    r.js("() => window.dssVoices.see(window.__tk)")
    r.page.wait_for_timeout(1500)
    b = r.js("() => { var b = document.querySelector('.dss-trail-badge'); return b ? b.innerText : null; }")
    r.expect(b and "TRAIL" in b, "tonight's look did not put up the trail badge (%r)" % b)


@check("more-keys-slip", "2026-11-10 note 20 (Sam): after the first crossing, Dean Street tells you once how to find another key")
def _(r):
    seen = "() => document.body.innerText.indexOf('MORE KEYS') >= 0 || [].some.call(document.querySelectorAll('.dss-hint-slip, .dss-hint-type'), function (e) { return e.textContent.indexOf('MORE KEYS') >= 0; })"
    scratch_passage(r, "T-nokey", '(set: $visitedCarthage to true)(set: $worldsVisited to (a:))(set: $dreamKey to "")[[Walk on|Dean Street]]')
    r.go("T-nokey", wait=3000)
    r.clear_slips()
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.page.wait_for_timeout(6000)
    r.expect(not r.js(seen), "the MORE KEYS slip showed before any crossing")
    r.page.unroute("**/*")
    scratch_passage(r, "T-keys", '(set: $visitedCarthage to true)(set: $worldsVisited to (a: "nazca"))(set: $dreamKey to "")(set: $keysSlipShown to false)[[Walk on|Dean Street]]')
    r.go("T-keys", wait=3000)
    r.clear_slips()
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.wait_for(seen, 25000, "the MORE KEYS slip on Dean Street after the first crossing")
    r.page.wait_for_timeout(8000)
    txt = r.js("() => document.body.innerText")
    r.expect("Four more lie in Soho" in txt and "three clues" in txt, "the MORE KEYS slip does not say four keys and three clues")
    r.page.unroute("**/*")


@check("napkin-page-fits", "2026-11-10 playthrough: the napkin sketch page (BENITO) ran 3 to 5 px past the screen; the game-canvas fit now acts on any overflow and sizes the tilted napkin by its layout width")
def _(r):
    for w, h in ((1440, 900), (1280, 800)):
        r.page.set_viewport_size({"width": w, "height": h})
        r.go("Sketch the Painter", wait=9000)
        r.clear_lore(); r.clear_slips()
        r.page.wait_for_timeout(2500)
        over = r.js("() => document.scrollingElement.scrollHeight - innerHeight")
        cw = r.js("() => { var c = document.getElementById('napkin-canvas'); return c ? c.offsetWidth : 0; }")
        r.expect(over <= 0, "the napkin page scrolls %d px at %dx%d" % (over, w, h))
        r.expect(cw >= 200, "the napkin shrank to %d px at %dx%d" % (cw, w, h))
    r.page.set_viewport_size({"width": 1440, "height": 900})


@check("line1-why-left", "2026-11-10 note 41 (Sam, a second time): on LINE 1 the two paragraphs under THE FIRST LINE OF THREE sit left, not centred")
def _(r):
    r.go("LINE 1", wait=7000)
    r.clear_slips()
    got = r.js("() => { var w = [].filter.call(document.querySelectorAll('.alba-why'), function (e) { return !e.closest('.dss-ghost'); })[0]; if (!w) return null; var range = document.createRange(); range.selectNodeContents(w); var rs = [].slice.call(range.getClientRects()), b = w.getBoundingClientRect(); return { align: getComputedStyle(w).textAlign, gaps: rs.filter(function (x) { return x.width > 40; }).map(function (x) { return Math.round(x.left - b.left); }), op: getComputedStyle(w).opacity }; }")
    r.info = repr(got)
    r.expect(got and got["align"] in ("left", "start"), "the paragraphs under THE FIRST LINE OF THREE are %r, not left" % (got and got["align"]))
    r.expect(got and max(got["gaps"] or [99]) <= 2, "a line under THE FIRST LINE OF THREE does not start at the left edge (%r)" % got)


@check("alba-lines-one-line", "2026-11-10 (Sam): each line of the alba sits on one line in its box (LINE 1 wrapped 'leaves' onto a second line)")
def _(r):
    r.go("LINE 1", wait=6000)
    r.clear_slips()
    lines = ["As cool as the pale wet leaves", "of lily-of-the-valley", "She lay beside me in the dawn."]
    for w in (1440, 1280, 800):
        r.page.set_viewport_size({"width": w, "height": 900})
        r.page.wait_for_timeout(400)
        for t in lines:
            got = r.js("(t) => { var b = [].filter.call(document.querySelectorAll('.revelation-box[data-alba]'), function (e) { return !e.closest('.dss-ghost'); })[0]; var em = b.querySelector('em'); em.innerHTML = '\u2018' + t + '\u2019<span class=alba-tw-cursor>\u2588</span>'; var lh = parseFloat(getComputedStyle(em).lineHeight); var br = b.getBoundingClientRect(), er = em.getBoundingClientRect(); return { h: em.getBoundingClientRect().height, lh: lh, over: em.scrollWidth - em.clientWidth, inside: er.right <= br.right + 1 && br.right <= innerWidth, fs: getComputedStyle(em).fontSize }; }", t)
            r.expect(got["h"] < got["lh"] * 1.5 and got["over"] <= 1 and got["inside"], "at %d px wide '%s' does not sit on one line in its box (%r)" % (w, t, got))
    r.page.set_viewport_size({"width": 1440, "height": 900})


@check("lk-book-voices", "2026-11-10 note 12 (Sam's rewrite): on LACKLAND's desk the book's card carries OLDBOY's 'Even you?' and THE THIRST's new line")
def _(r):
    r.go("Martin Lackland's Office", wait=6000)
    r.clear_slips()
    t = r.js("() => { var o = window.DSS_VOICES.objects.lk['Your book']; return [o.then, o.id, window.dssVoices.html('lk', 'Your book')]; }")
    r.expect(t[0] == "They say there\u2019s one in all of us. Even you?", "OLDBOY's line is %r" % t[0])
    r.expect(t[1] == "You\u2019d have written more books than you\u2019ve read.", "THE THIRST's line is %r" % t[1])
    r.expect("Even you?" in t[2], "the book's card does not show OLDBOY's line (%r)" % t[2][:300])


@check("hub-return-fits", "2026-11-09 overnight bug-play: back on Dean Street from a door, the street lamp ran 76 to 87 px past 900 and the page scrolled")
def _(r):
    r.go("Dean Street", wait=6000)
    r.js("() => { var l = [].filter.call(document.querySelectorAll('.soho-hub-dock tw-link'), function (e) { return !e.closest('.dss-ghost'); })[0]; l.click(); }")
    r.page.wait_for_timeout(3500)
    r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return !e.closest('.dss-ghost') && /Back to Dean/.test(e.textContent); })[0]; l.click(); }")
    worst = 0
    for _ in range(18):
        r.page.wait_for_timeout(300)
        if r.pn() == "Dean Street":
            worst = max(worst, r.js("() => document.scrollingElement.scrollHeight"))
    r.info = "tallest %d px" % worst
    r.expect(0 < worst <= 902, "back on Dean Street the page is %d px tall at 1440x900" % worst)


@check("hub-crowded-four-fits", "2026-11-10 (item 3): with four question boxes up at once Dean Street still ran 13 px past 900 after the second tightening step")
@check("hub-crowded-fits", "2026-11-09 overnight bug-play: later in the night Dean Street's question boxes pushed the street 31 to 76 px past 900")
def _(r):
    scratch_passage(r, "T-hub3", '(set: $sobriety to 30)(set: $knowsCecilCourt to true)(set: $metCritic to true)(set: $returns to 4)[[Walk on|Dean Street]]')
    r.go("T-hub3", wait=4000)
    r.clear_slips()
    r.page.locator("tw-link:has-text('Walk on')").first.click()
    r.page.wait_for_timeout(6000)
    r.page.unroute("**/*")
    n = r.js("() => [].filter.call(document.querySelectorAll('.book-pitch'), function (b) { return !b.closest('.dss-ghost'); }).length")
    r.expect(n >= 2, "the crowded street shows %d question boxes, not 2" % n)
    # a third box, as on a later lap (Who's next?), then the street re-fits as on arrival
    extra = 2 if "four" in r.name else 1
    r.js("(k) => { var b = [].filter.call(document.querySelectorAll('.book-pitch'), function (x) { return !x.closest('.dss-ghost'); })[0]; var h = b.closest('tw-expression') || b; for (var i = 0; i < k; i++) h.parentNode.insertBefore(h.cloneNode(true), h); document.querySelector('tw-story').classList.remove('dss-hub-tight', 'dss-hub-tighter', 'dss-hub-tightest'); window._passageGen = (window._passageGen || 0) + 1000; window.dispatchEvent(new Event('resize')); }", extra)
    r.page.wait_for_timeout(1200)
    loose = r.js("() => document.scrollingElement.scrollHeight")
    r.page.wait_for_timeout(4000)
    tight = r.js("() => document.scrollingElement.scrollHeight")
    r.info = "%d boxes: %d px before tightening, %d after (tight mode %s)" % (n + extra, loose, tight, r.js("() => document.querySelector('tw-story').classList.contains('dss-hub-tight')"))
    r.expect(tight <= 902, "a crowded Dean Street is %d px tall at 1440x900" % tight)


@check("fight-ends-after-leaving", "2026-11-09 overnight bug-play: a fight's round timer ended it after its page was left, and its end wrote to a missing element (page error on Dean Street)")
def _(r):
    r.go("Dean Street", wait=4000)
    res = r.js("""() => { if (!window.FightGame) return 'no FightGame'; var c = document.createElement('canvas'); c.id = 'reg-fight'; c.width = 300; c.height = 200; document.body.appendChild(c);
      var g; try { g = new window.FightGame('reg-fight'); } catch (e) { return 'could not build: ' + e.message; }
      c.remove(); try { g.copperHP = 0; g.endGame(); return 'ok'; } catch (e) { return 'endGame threw: ' + e.message; } }""")
    r.expect(res == "ok", res)


@check("slip-pauses-under-overlay", "2026-11-09 overnight bug-play: the resting French's slip typed on, unseen, under a doorway's Hold popup")
def _(r):
    r.go("Dean Street", wait=5000)
    r.clear_slips()
    r.js("() => window.dssInlineHint('REGRESSION a slip long enough to still be typing when the popup comes over it, and then some more words.')")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent.indexOf('REGRESSION') >= 0; })", 8000, "the slip to start typing")
    r.js("() => { var o = document.createElement('div'); o.id = 'spew-popup-overlay'; o.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6)'; document.body.appendChild(o); }")
    r.page.wait_for_timeout(2500)
    held = r.js("() => [].map.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent; }).join('')")
    r.page.wait_for_timeout(1500)
    r.expect(held == r.js("() => [].map.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent; }).join('')"), "the slip went on typing under the popup")
    r.js("() => document.getElementById('spew-popup-overlay').remove()")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip.typed'), function (e) { return e.textContent.indexOf('and then some more words') >= 0; })", 15000, "the slip to finish once the popup closed")


@check("jeffrey-speech-in-scene", "2026-11-09 note 2: JEFFREY's Friesian speech came up in the card on the right, unlike everyone else")
def _(r):
    r.go("Coach and Horses bar")
    r.room_ready("cb")
    r.click_object("cb", "JEFFREY BERNARD")
    r.page.wait_for_timeout(600)
    r.expect("Friesian" not in r.js("() => document.body.innerText"), "JEFFREY's speech shows in his card before 'Hear him out' is pressed")
    r.press("Hear him out")
    r.page.wait_for_timeout(900)
    t = r.js("() => { var o = document.querySelector('#dss-lore-overlay.dss-jeff-card'); return o ? o.innerText : ''; }")
    r.expect("JEFFREY BERNARD" in t and "Friesian cow through Soho" in t and "waking up on the floor." in t and "Could you then milk said cow?’ he says, ‘I doubt it." in t and "After Jeffrey Bernard" in t and "twenty Players" not in t, "'Hear him out' did not open his speech on a card of its own (%r)" % t[:120])   # 2026-11-09: Sam's retelling, credited "after"


@check("fortuna-fires-too", "2026-11-09 note 29: SUBCOMANDANTE FORTUNA lowers the rifle, but only you had one")
def _(r):
    r.go("The Reclamation", wait=6000)
    for sel in [".dss-rules-overlay button", "#rc-begin"]:
        b = r.page.locator(sel + ":visible")
        if b.count():
            b.first.click(); r.page.wait_for_timeout(1500)
    b = r.page.locator("#rc-begin:visible")
    if b.count(): b.first.click()
    r.page.wait_for_timeout(24000)
    t = r.js("() => document.body.innerText")
    import re as _re
    m = _re.search(r"SILENCED\s+(\d+)\s*/", t, _re.I)
    r.expect(m and int(m.group(1)) >= 1, "with no shot of yours fired, nothing was silenced in 24 s (%r)" % (m.group(0) if m else t[:200]))


@check("interval-pyre-art", "2026-11-09 note 26: the Interval stair image and the pyre were flat and lame; both are renders now, the pyre's fire drawn live")
def _(r):
    r.go("Dido", wait=7000)
    res = r.js("() => { var w = document.querySelector('.dss-carthage-pyre-art'); if (!w) return 'no pyre art'; var im = w.querySelector('img'), cv = w.querySelector('canvas.dss-pyre-canvas'); if (!im || !im.naturalWidth || !/carthage-pyre\\.jpg/.test(im.src)) return 'the pyre plate did not load'; if (!cv || !cv.width) return 'no fire canvas'; var d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, lit = 0; for (var i = 3; i < d.length; i += 16) if (d[i] > 20) lit++; return lit > 50 ? 'ok' : 'the fire canvas is empty'; }")
    r.expect(res == "ok", res)
    r.go("The Interval", wait=6000)
    res = r.js("() => { var im = document.querySelector('.dss-interval-stairs-art img'); return im && im.naturalWidth > 0 && /interval-stairwell-down\\.jpg/.test(im.src) ? 'ok' : 'the stairwell render did not load'; }")
    r.expect(res == "ok", res)


@check("blackout-kerb-plate", "2026-11-09 (Sam): the first Blackout's image was cartoon like, nothing like the game; it is a render from the kerb now")
def _(r):
    r.go("The Blackout", wait=900)
    res = r.js("() => new Promise(function (done) { var v = document.querySelector('.dss-blackout-stage .dss-blackout-first'); if (!v) return done('no first-blackout plate'); var bg = getComputedStyle(v).backgroundImage, m = /url\\(\"?([^\")]+)\"?\\)/.exec(bg); if (!m || !/blackout-kerb\\.webp/.test(m[1])) return done('the stage is not showing the kerb render: ' + bg); if (parseFloat(getComputedStyle(v).opacity) < 0.5) return done('the plate is not on show in its first second'); var im = new Image(); im.onload = function () { done(im.naturalWidth === 1600 && im.naturalHeight === 900 ? 'ok' : 'the plate is ' + im.naturalWidth + 'x' + im.naturalHeight); }; im.onerror = function () { done('the kerb render did not load'); }; im.src = m[1]; })")
    r.expect(res == "ok", res)
    r.page.screenshot(path=os.path.join(SHOTS, "blackout-kerb-plate.png"))
    r.page.wait_for_timeout(3600)
    res = r.js("() => { var on = document.querySelector('.dss-blackout-on tw-link'); if (!on || parseFloat(getComputedStyle(on.closest('.dss-blackout-on')).opacity) < 0.9) return 'Come to is not showing after the fall'; var se = document.scrollingElement; return se.scrollHeight - innerHeight > 2 ? 'the Blackout page scrolls by ' + (se.scrollHeight - innerHeight) + ' px' : 'ok'; }")
    r.expect(res == "ok", res)


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
    var mt = Array.isArray(m.material) ? m.material[0] : m.material; var mine = false; for (var w0 = m; w0; w0 = w0.parent) if (w0 === sp.root) { mine = true; break; } if (!mt || (!mine && (mt.visible === false || mt.colorWrite === false)) || mt.transparent || mt.depthWrite === false || mt.blending === T.AdditiveBlending) return; vis.push(m); });   /* 2026-11-11: an invisible click box (the shop ladder's) is not a wall */
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
            r.clear_lore()   # 2026-11-13: an object whose notes open by themselves on the look (LACKLAND's turntable, notes 17-18): read them, as a player would, before looking past them
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


@check("paperback-lore-again", "2026-11-11 notes 5 (twice): looking at the French's orange paperback opens its LORE by itself, on the first look and again after it has been read")
def _(r):
    r.go("The French", wait=9000)
    r.room_ready("fi"); r.clear_slips(); r.clear_lore()
    over = "() => { var o = document.getElementById('dss-lore-overlay'); return !!o && getComputedStyle(o).display !== 'none' && /CHARIOTS/i.test(o.innerText); }"
    for look in ("first", "second"):
        r.click_object("fi", "An orange paperback")
        r.wait_for(over, 8000, "the lore to open by itself on the %s look (nothing pressed)" % look)
        r.clear_lore(); r.page.wait_for_timeout(2500)
        if r.js("() => window.__dssRooms.fi.mode()") == "inspect":
            r.back_click("fi"); r.page.wait_for_timeout(2000)
    r.info = "opened by itself on both looks"


@check("glass-smash-procedural", "2026-11-11 note 6: the Empty Glass smash is the old procedural crash, not the recorded glassHeavy take (a beep)")
def _(r):
    # the swap sits inside the audio closure (and dssAudio's export is wrapped again), so read the build itself
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), HTML.replace("%20", " ")), encoding="utf-8").read()
    r.expect(re.search(r"glassSmash\s*=\s*_sfxSwap\(", src) is None, "glassSmash is swapped for a recorded take again")
    r.expect("function glassSmash()" in src, "the procedural glassSmash is gone")


@check("loading-not-pink", "2026-11-11 note 7: the 3D rooms' loading line is grey, not the draft pink")
def _(r):
    r.go("The French", wait=3000)
    cols = r.js("""() => { var made = null, line = document.getElementById('dss-load-line'); if (!line) { line = made = document.createElement('div'); line.id = 'dss-load-line'; line.innerHTML = '<div class="dss-load-text">loading</div><div class="dss-load-bar"><i></i></div>'; document.body.appendChild(line); }
      var t = getComputedStyle(line.querySelector('.dss-load-text')).color, b = getComputedStyle(line.querySelector('.dss-load-bar i')).backgroundColor; if (made) made.remove(); return [t, b]; }""")
    r.info = "text %s, bar %s" % tuple(cols)
    for c in cols:
        m = [float(x) for x in re.findall(r"[\d.]+", c)[:3]]
        r.expect(not (m[0] > m[1] + 50), "the loading line is still pink-red (%s)" % c)


@check("belletrist-no-bell", "2026-11-11 note 8: looking at The Belletrist in the Pillars does not ring the shop bell ('bell' inside his name)")
def _(r):
    r.go("Dean Street", wait=5000)
    got = r.js("() => [window.dssAudio.spotSound('The Belletrist') || '', window.dssAudio.spotSound('A shop bell') || '']")
    r.info = "Belletrist -> %r, a shop bell -> %r" % tuple(got)
    r.expect(got[0] != "bell", "The Belletrist still rings the bell")
    r.expect(got[1] == "bell", "a real bell no longer rings (%r)" % got[1])


@check("interval-no-trail-badge", "2026-11-11 note 11: the key trail badge does not show in the Interval (it does on Dean Street)")
def _(r):
    STUB = "() => { window.dssVoices = window.dssVoices || {}; window.dssVoices.activeTrail = function () { return { key: 'cocaine', world: 'himalayas', step: 0, of: 3, room: 'the French' }; }; }"
    seen = {}
    for pg in ("Dean Street", "The Interval"):
        r.go(pg, wait=6000)
        r.js(STUB); r.page.wait_for_timeout(1800)
        seen[pg] = r.js("() => !!document.querySelector('.dss-trail-badge')")
    r.info = "badge: %s" % seen
    r.expect(seen["Dean Street"], "the stubbed trail shows no badge on Dean Street (the check cannot see the badge)")
    r.expect(not seen["The Interval"], "the trail badge shows in the Interval")


@check("oi-cat-prints-hung", "2026-11-11 note 10: the two cat prints of O'Flatterly's Shelves hang in the shop, in view from the Shelves close-up")
def _(r):
    r.go("O'Flatterly's shop", wait=10000)
    r.room_ready("oi"); r.clear_slips(); r.clear_lore()
    d = r.page.locator(".dss-room-dismiss:visible")
    if d.count(): d.first.click(); r.page.wait_for_timeout(1500)
    r.click_object("oi", "Shelves"); r.page.wait_for_timeout(2500)
    res = r.js("""() => { var R = window.__dssRooms.oi, cam = R.camera, out = []; R.scene.updateMatrixWorld(true); R.scene.traverse(function (o) { var m = o.material, t = m && m.map; if (!o.isMesh || !t || !t.userData || !t.userData.dssPrint) return; var p = new o.position.constructor(); o.getWorldPosition(p); p.project(cam); out.push([t.userData.dssPrint, +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(3)]); }); return out; }""")
    r.info = "prints: %s" % res
    files = sorted(x[0] for x in res)
    r.expect(files == ["black-cat.jpg", "tuxedo-cat.jpg"], "the shop hangs %s, not the two cat prints" % files)
    for f, x, y, z in res:
        r.expect(abs(x) < 0.9 and abs(y) < 0.9 and z < 1, "%s is out of the Shelves close-up's view (%.2f, %.2f)" % (f, x, y))


@check("flagging-chippy-open", "2026-11-11 note 8: Flagging? offers the chippy only when Dean Street has its door open (low SOBRIETY alone opens the doorway first)")
def _(r):
    scratch_passage(r, "T-flag", '(set: $returns to 3)(set: $confidence to 70)(set: $sobriety to 30)(set: $hadChippy to false)(set: $hadBreather to false)[[Walk on|Dean Street]]')
    r.go("T-flag", wait=4000)
    r.page.wait_for_timeout(2500)   # the meters' rising numbers sit over the link for a moment
    r.clear_slips(); r.page.wait_for_timeout(800); r.clear_slips()   # the MORALE / SOBRIETY primer slips block the page
    r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return /Walk on/.test(x.textContent); })[0]; if (l) l.click(); }")
    r.page.wait_for_timeout(5000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    r.expect(r.pn() == "Dean Street", "the walk on did not reach Dean Street (on %s; page: %r)" % (r.pn(), r.js("() => document.body.innerText.slice(0, 300)")))
    box = r.js("() => { var b = document.querySelector('tw-passage .flag-next'); return b ? b.innerText : ''; }")
    links = r.js(HUB_LINKS)
    r.info = "box: %r; links: %s" % (box, [l for l in links if re.search("Halibut|doorway", l, re.I)])
    r.expect(box, "no Flagging? box with SOBRIETY at 30")
    chippy_open = any(re.search("Halibut", l) for l in links)
    r.expect(chippy_open or "chippy" not in box.lower(), "Flagging? offers the chippy while Dean Street has no way to it")


@check("where-next-no-gate-line", "2026-11-11 note 1: Where next? keeps quiet about Centre Point until its gate is open")
def _(r):
    scratch_passage(r, "T-wn", '(set: $returns to 3)(set: $knowsCecilCourt to true)(set: $metCritic to true)(set: $knowsAboutPage to true)(set: $hasMissingPage to true)(set: $returnedPage to true)(set: $inisToldOfPillars to true)(set: $nightAheadPart2Shown to true)[[Walk on|Dean Street]]')
    r.go("T-wn", wait=4000)
    r.page.wait_for_timeout(2500); r.clear_slips(); r.page.wait_for_timeout(800); r.clear_slips()
    r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return /Walk on/.test(x.textContent); })[0]; if (l) l.click(); }")
    r.page.wait_for_timeout(5000); r.clear_lore(); r.clear_slips(); r.clear_lore()
    r.expect(r.pn() == "Dean Street", "the walk on did not reach Dean Street (on %s)" % r.pn())
    t = r.js("() => [].map.call(document.querySelectorAll('tw-passage .where-next'), function (b) { return b.innerText; }).join(' | ')")
    r.info = "where next: %r" % t
    r.expect("will not open" not in t and "Centre Point" not in t, "Where next? spells out the Centre Point gate before it is open")


@check("pyre-pages-fit", "2026-11-11 polish run: Dido and Stay in Carthage ran 100 to 200 px past the window on empty lines; they fit at 1440x900 and 1280x800, Sam's paragraph gaps kept")
def _(r):
    got = []
    for w, h in ((1440, 900), (1280, 800)):
        r.page.set_viewport_size({"width": w, "height": h})
        for n in ("Dido", "Stay in Carthage"):
            r.go(n, wait=5000)
            v = r.js("() => { var tp = document.querySelector('tw-story > tw-passage:not(.dss-ghost)'), l = [].filter.call(tp.querySelectorAll('tw-link'), function (x) { return x.getClientRects().length && /Rest here|Wake/.test(x.textContent); })[0], b = l && l.getBoundingClientRect(); var gaps = [].filter.call(tp.querySelectorAll('tw-consecutive-br'), function (g) { return g.getClientRects().length; }).length; return { over: document.scrollingElement.scrollHeight - innerHeight, link: b ? Math.round(b.bottom) : null, gaps: gaps }; }")
            got.append("%s %dx%d over %s link %s gaps %s" % (n, w, h, v["over"], v["link"], v["gaps"]))
            r.expect(v["over"] <= 0 and v["link"] and v["link"] <= h, "%s at %dx%d scrolls or hides its way on (%r)" % (n, w, h, v))
            r.expect(v["gaps"] >= 2, "%s lost its paragraph gaps (%r)" % (n, v))
    r.info = "; ".join(got)


@check("room-entry-no-scrollbar", "2026-11-11 polish run: a scrollbar flashed for about a second on entering the French or the Colony at 1280x800, before the room lifted its words")
def _(r):
    r.page.set_viewport_size({"width": 1280, "height": 800})
    for n in ("The French", "The Colony Room"):
        r.go(n, wait=0)
        bars = []
        for _ in range(16):
            r.page.wait_for_timeout(200)
            bars.append(r.js("() => getComputedStyle(document.documentElement).overflowY === 'hidden' ? 0 : Math.max(0, document.scrollingElement.scrollHeight - innerHeight)"))   # headless scrollbars overlay, so measure what would scroll
        r.expect(max(bars) == 0, "%s showed a scrollbar while its room built (%r)" % (n, bars))


@check("ending-words-centred", "2026-11-11 polish run: EXPLICIT. LIBER. EST. sat flush left under the centred row of signals on the white and black ending pages")
def _(r):
    for n in ("White page", "Black page"):
        r.go(n, wait=8500)
        v = r.js("() => { var tp = document.querySelector('tw-story > tw-passage:not(.dss-ghost)'), sw = tp.querySelector('.ending-switchboard'), w = document.createTreeWalker(tp, NodeFilter.SHOW_TEXT), t; while ((t = w.nextNode())) if (/EXPLICIT/.test(t.textContent)) break; if (!t || !sw) return null; var rg = document.createRange(); rg.selectNodeContents(t); var a = rg.getBoundingClientRect(), b = sw.getBoundingClientRect(); return [Math.round(a.left + a.width / 2), Math.round(b.left + b.width / 2)]; }")
        r.expect(v and abs(v[0] - v[1]) < 24, "%s: the closing words are off the signals' centre line (%r)" % (n, v))


@check("mute-button-on-white", "2026-11-11 polish run: the mute button's dark glass showed as a flat grey block on the white pages")
def _(r):
    r.go("White page", wait=4000)
    bg = r.js("() => { var b = document.getElementById('dss-mute-btn'); if (!b) return null; var m = getComputedStyle(b).backgroundColor.match(/[\\d.]+/g).map(Number); return m; }")
    r.expect(bg and bg[0] > 200 and bg[1] > 200, "the mute button is still dark on the white page (%r)" % bg)


@check("page-turn-no-scroll-flash", "2026-11-11 polish run: Watkins and the alba pages ran past a 1280x800 window for up to 3 s as they settled, so a scrollbar flashed on the way in")
def _(r):
    r.page.set_viewport_size({"width": 1280, "height": 800})
    for dest in ("Watkins", "Alba Incomplete"):
        scratch_passage(r, "T-turn", "[[Go on|%s]]" % dest)
        r.go("T-turn", wait=3500)
        r.clear_slips()
        r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return /Go on/.test(x.textContent); })[0]; if (l) l.click(); }")
        seen = []
        for _ in range(30):   # through the 1.6 s hold and well past it
            r.page.wait_for_timeout(120)
            seen.append(r.js("() => { var cs = getComputedStyle(document.documentElement); return (cs.overflowY === 'hidden' || cs.scrollbarWidth === 'none') ? 0 : Math.max(0, document.scrollingElement.scrollHeight - innerHeight); }"))   # a bar the player could see
        r.expect(max(seen) == 0, "%s: the page could scroll while it settled (%r)" % (dest, seen))


@check("phone-header-clear", "2026-11-12 phone pass: on a 390x844 phone the 145 px header hid the first typed lines of Night Ahead: LILY and the first two lines of Copper's Lair")
def _(r):
    r.page.set_viewport_size({"width": 390, "height": 844})
    seen = []
    for dest in ("Night Ahead: LILY", "Turn to Copper", "Things turn up"):
        r.go(dest, wait=12000); r.clear_slips()
        res = r.js("""() => { var h = document.getElementById('stat-bars-lifted'); var hb = h && h.getClientRects().length ? Math.round(h.getBoundingClientRect().bottom) : 0;
          var box = document.querySelector('.dss-room-veil .dss-room-prose') || document.querySelector('.typewriter-page'); if (!box) return { hdr: hb, first: null };
          var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.nodeValue.trim() ? 1 : 3; } }), n = w.nextNode(), first = null;
          if (n) { var rg = document.createRange(); rg.selectNodeContents(n); var rs = rg.getClientRects(); if (rs.length) first = Math.round(rs[0].top); } return { hdr: hb, first: first }; }""")
        seen.append("%s %s" % (dest, res))
        r.expect(res["first"] is not None, "%s: no words found on the page" % dest)
        r.expect(res["hdr"] > 100, "%s: the header is not showing (%r)" % (dest, res))
        r.expect(res["first"] is None or res["first"] >= res["hdr"], "%s: the first line sits under the header (%r)" % (dest, res))
    r.info = "; ".join(seen)


@check("left-scenes-let-go", "2026-11-12 memory pass: a 35-minute night in one page grew from 12 to 183 MB; every room and 3D scene visited stayed in memory (resize and Escape listeners, the shared full-screen quad)")
def _(r):
    click = "(t) => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return x.textContent.indexOf(t) >= 0 && !x.closest('.dss-ghost'); })[0]; if (l) { l.click(); return true; } return false; }"
    scratch_passage(r, "T-in", "[[Go in|The French]]")
    r.go("T-in", wait=3500); r.clear_slips()
    r.expect(r.js(click, "Go in"), "no way into the French on the scratch page")
    r.page.wait_for_timeout(10000); r.clear_slips(); r.clear_lore()
    before = r.js("() => ({ pn: (document.getElementById('dss-pn') || {}).textContent, reg: Object.keys(window._dssThreeRegistry || {}), comps: (window.__dssComposers || []).length, gone: (window.__dssGone || []).length })")
    r.expect("fi-wrap" in before["reg"] and before["comps"] >= 1 and before["gone"] >= 1, "the French did not register its scene (%r)" % before)
    r.expect(r.js(click, "OUT ONTO THE STREET") or r.js(click, "Out onto the street"), "no way out of the French")
    r.page.wait_for_timeout(7000)   # the page turn, then the sweep's four seconds
    after = r.js("() => ({ pn: (document.getElementById('dss-pn') || {}).textContent, reg: Object.keys(window._dssThreeRegistry || {}).filter(function (k) { var e = window._dssThreeRegistry[k]; return !document.getElementById(k) && !(e.renderer && e.renderer.domElement && e.renderer.domElement.isConnected); }), comps: (window.__dssComposers || []).filter(function (x) { return !x.r.domElement.isConnected; }).length, gone: (window.__dssGone || []).filter(function (g) { return !g[0].isConnected; }).length, rooms: Object.keys(window.__dssRooms || {}).filter(function (k) { return !window.__dssRooms[k].wrap.isConnected; }) })")
    r.info = "before %s; left behind %s" % (before, after)
    r.expect("fi-wrap" not in (after["reg"] or []) and not after["reg"], "scenes no longer on the page are still held: %r" % after["reg"])
    r.expect(after["comps"] == 0, "%d post-effects stacks of gone scenes are still held" % after["comps"])
    r.expect(after["gone"] == 0, "%d listeners of gone room panels are still held" % after["gone"])
    r.expect(not after["rooms"], "the room hook still holds gone rooms: %r" % after["rooms"])


@check("phone-street-views-widen", "2026-11-12 phone pass (Sam: \"Yes, widen them\"): in portrait the street views showed a slot of each shopfront; they widen on tall screens and keep their own view on a laptop")
def _(r):
    fov = "() => { var e = (window._dssThreeRegistry || {})['ph-wrap']; return e && e.camera ? +e.camera.fov.toFixed(1) : null; }"
    r.go("Approach The Pillars", wait=10000)
    lap = r.js(fov)
    r.page.set_viewport_size({"width": 390, "height": 844}); r.page.wait_for_timeout(1500)
    ph = r.js(fov)
    r.page.set_viewport_size({"width": 1440, "height": 900}); r.page.wait_for_timeout(1500)
    back = r.js(fov)
    r.info = "laptop %s, phone %s, laptop again %s" % (lap, ph, back)
    r.expect(lap == 55.0, "the Pillars' street view is not its own 55 degrees on a laptop (%s)" % lap)
    r.expect(ph and ph > 75, "the street view did not widen on a phone (%s)" % ph)
    r.expect(back == 55.0, "the street view did not return to 55 degrees on a laptop (%s)" % back)


@check("title-no-save-note", "2026-11-11 note 6: the Title carries no instruction about saving")
def _(r):
    r.go("Title", wait=14000)
    t = r.js("() => (document.querySelector('tw-passage') || document.body).innerText")
    r.expect("saves itself" not in t and "come back again" not in t, "the Title still tells you how saving works")
    r.expect(re.search(r"BEGIN", t, re.I), "the Title did not render (no BEGIN)")
    r.info = "no save note"


@check("fi-beret-cat", "2026-11-11 note 4: the French's beret cat hangs left of the dog, the biggest frame, in sepia and in the Photographs close-up; no print tray")
def _(r):
    r.go("The French", wait=9000); r.room_ready("fi"); r.clear_slips(); r.clear_lore()
    r.click_object("fi", "Photographs"); r.page.wait_for_timeout(3000)
    r.expect(r.js("() => document.querySelectorAll('.dss-print-tray').length") == 0, "the French still offers 'Look at the prints'")
    res = r.js("""() => { var R = window.__dssRooms.fi, cam = R.camera, out = null, dog = null; R.scene.updateMatrixWorld(true);
      R.scene.traverse(function (o) { if (!o.isMesh) return; var t = o.material && o.material.map, p = new o.position.constructor(), s = new o.position.constructor(); o.getWorldPosition(p); o.getWorldScale(s);
        if (t && t.userData && t.userData.dssPrint === 'beret-cat.jpg') { var q = p.clone().project(cam); out = { x: +p.x.toFixed(2), w: +(o.geometry.parameters.width * s.x).toFixed(2), sx: +q.x.toFixed(2), sy: +q.y.toFixed(2) }; } });
      var grade = (window.dssPrints && JSON.stringify(window.dssPrints.forSpot('fi', 'Photographs'))) || ''; return { beret: out, sepia: /sepia\\(\\.7/.test(grade) }; }""")
    r.info = "%s" % res
    b = res["beret"]
    r.expect(b, "no beret cat on the French's wall")
    r.expect(abs(b["x"] - (-0.45)) < 0.1, "the beret cat is not in the frame left of the dog (x %.2f)" % b["x"])
    r.expect(b["w"] > 0.5, "the beret cat is not the biggest picture (%.2f m wide)" % b["w"])
    r.expect(abs(b["sx"]) < 0.9 and abs(b["sy"]) < 0.9, "the beret cat is out of the Photographs close-up (%.2f, %.2f)" % (b["sx"], b["sy"]))
    r.expect(res["sepia"], "the beret cat is not graded sepia")


@check("great-work-slips", "2026-11-11 notes 3 and 7: the night's first haunt brings THE GREAT WORK on the paper slips (not the big typed card), each new game")
def _(r):
    r.go("O'Flatterly's quest", wait=6000)
    r.clear_slips(); r.clear_lore()
    r.page.locator(".dss-room-veil tw-link", has_text="Not tonight.").first.click()
    got = None
    for _ in range(60):
        got = r.js("""() => { var s = [].filter.call(document.querySelectorAll('.dss-hint-slip'), function (e) { return /THE GREAT WORK/.test(e.textContent); })[0];
          return { slip: !!s, card: !!document.querySelector('#dss-lore-overlay.dss-gw-card'), pages: window.__dssGreatWorkSlips || 0, pn: (document.getElementById('dss-pn') || {}).textContent }; }""")
        if got["slip"] or got["card"]: break
        r.page.wait_for_timeout(500)
    r.info = "%s" % got
    r.expect(not got["card"], "THE GREAT WORK opened as the big lore card")
    r.expect(got["slip"], "THE GREAT WORK never came on a slip after the first haunt (on %s)" % got["pn"])


@check("map-walk-pace", "2026-11-11 (Sam, playtest note 2: the walking had become really slow): with the CPU slowed 6x, holding an arrow still walks at full pace")
def _(r):
    hub_ready(r)
    cdp = r.page.context.new_cdp_session(r.page)
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 6})
    try:
        r.js("() => window.__dssSohoTeleport(17, 38)"); r.page.wait_for_timeout(600)
        c0 = r.js("() => { var s = window.dssSohoMap.state; return [s.c, s.r]; }")
        r.page.locator("#soho-map-container canvas").first.focus()
        r.page.keyboard.down("ArrowUp"); r.page.wait_for_timeout(2000); r.page.keyboard.up("ArrowUp"); r.page.wait_for_timeout(400)
        c1 = r.js("() => { var s = window.dssSohoMap.state; return [s.c, s.r]; }")
    finally:
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": 1})
    n = abs(c1[1] - c0[1]) + abs(c1[0] - c0[0])
    r.info = "%d tiles in 2 s at 6x slower CPU (full pace is 8 or 9)" % n
    r.expect(n >= 7, "the walk dragged: %d tiles in 2 s with the CPU slowed 6x (full pace is 8 or 9)" % n)


@check("pillars-shanty", "2026-11-11 Sam's Drunken sailor: plays once, a moment into the Pillars approach, and not on Lackland's")
def _(r):
    # a ?start= page is the first of the load, which the passage watcher does not see; hand it the page the way the watcher does
    hand = "() => { window.dssLastShanty = 0; window.dssAudio.updateAmbientBedsForPassage(document.querySelector('tw-story > tw-passage')); }"
    r.go("Approach The Pillars")
    r.js(hand)
    r.page.wait_for_timeout(1500)
    early = r.js("() => window.dssLastShanty || 0")
    r.page.wait_for_timeout(2000)
    r.expect(r.js("() => window.dssLastShanty || 0"), "the shanty did not start on the Pillars approach")
    r.expect(not early, "the shanty started within 1.5 s (2026-11-13 note 2: it waits 2.6 s)")
    src = r.js("() => Array.from(document.scripts).map(s => s.textContent).join('\\n')")
    r.expect("_playSample(SHANTY_URL, 0.45" in src, "the shanty is back at its old quiet level (2026-11-13 note 2)")
    r.go("Approach Lacklands Office")
    r.js(hand)
    r.page.wait_for_timeout(3000)
    r.expect(not r.js("() => window.dssLastShanty || 0"), "the shanty started on Lackland's approach")
    r.info = "started on the Pillars approach only"


@check("lackland-doorbell", "2026-11-11 Sam's street recording: his doorbell rings walking in to Lackland's, his footsteps walking out")
def _(r):
    r.go("Approach Lacklands Office")
    r.page.wait_for_timeout(1500)
    ok = r.js("""() => { var a = [].slice.call(document.querySelectorAll('tw-passage tw-link')).filter(function (l) { return l.textContent.trim() === '\u00b7'; })[0]; if (!a) return false; a.click(); return true; }""")
    r.expect(ok, "no way in to Lackland's office on %s" % r.pn())
    r.page.wait_for_timeout(3000)
    t = r.js("() => window.dssLastTransition || ''")
    r.expect(t == "out>venue-lackland", "walking in to Lackland's asked for %r, not the doorbell" % t)
    src = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect(re.search(r"'out>venue-lackland':\s*\{\s*url:\s*'lackland-doorbell\.m4a'", src), "the Lackland door transition is not the doorbell file")
    r.expect(re.search(r"'venue-lackland>out':\s*\{\s*url:\s*'lackland-steps-out\.m4a'", src), "leaving Lackland's is not the footsteps file")
    r.info = "door: %s" % t


@check("hub-opens-fit", "2026-11-11 dream-world run: Dean Street with both gold OPENS. lines (Coach and Halibut) fits 1440x900")
def _(r):
    r.go("nazca", wait=10000)
    for t in ["STEP DOWN FROM THE BUS", "Out onto the pampa", "Turn back from the heat", "Dean Street"]:
        r.clear_lore(); r.clear_slips()
        o = [x for x in r.js(CLICKABLES) if x["t"].lower().startswith(t.lower())]
        r.expect(o, "no %r on %s" % (t, r.pn()))
        r.page.mouse.click(o[0]["x"], o[0]["y"]); r.page.wait_for_timeout(3500)
    r.page.wait_for_timeout(5000); r.clear_lore(); r.clear_slips(); r.clear_lore(); r.page.wait_for_timeout(1500)
    r.expect(r.pn() == "Dean Street", "the turn-back did not reach Dean Street (on %s)" % r.pn())
    n = r.js("() => document.querySelectorAll('tw-passage .haunt-opens').length")
    r.expect(n == 2, "expected the two OPENS. lines on Dean Street, found %d" % n)
    over = r.js("() => (document.scrollingElement || document.documentElement).scrollHeight - innerHeight")
    r.info = "two OPENS. lines, over %d px" % over
    r.expect(over <= 0, "Dean Street with two OPENS. lines scrolls %d px at 1440x900" % over)


def pub_pass_at(r, tile, way):
    """Stand on a tile, take one step with the d-pad, and read the pub walk-by level the map asked for."""
    r.js("() => { window.dssPubPass = null; }")
    r.expect(r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", list(tile)), "tile %s is not walkable" % (tile,))
    r.page.wait_for_timeout(400)
    r.js("""(way) => { var b = document.querySelector('[data-dir="' + way + '"]'); if (!b) return;
      b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 7, isPrimary: true }));
      setTimeout(function () { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 7, isPrimary: true })); }, 150); }""", way)
    r.page.wait_for_timeout(900)
    return r.js("() => window.dssPubPass")


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


TEST_STARTS = [
    # (passage, morale, sobriety, doors that must be on Dean Street, doors that must not)
    ("Test Start 1", 70, 70, [r"French"], [r"See who"]),
    ("Test Start 2", 58, 52, [r"Ronnie", r"Cecil Court", r"Lackland", r"Colony Room"], [r"See who"]),   # COPPER's cellar is still to find
    ("Test Start 3", 54, 46, [r"Pillars", r"Lackland"], [r"Ronnie", r"Visit the antiquarian", r"Colony Room"]),
    ("Test Start 4", 48, 40, [r"Coach", r"Sholto Gooch", r"^Trisha"], [r"Go to Lackland", r"Colony Room"]),   # Trisha's stays open for its key
]


@check("test-start-points", "2026-11-12 (Sam, for a playtester): the dev menu's test start points build a whole night's state (stats, haunts, lilies, alba, pocket) and land on a working Dean Street")
def _(r):
    bad = []
    for name, conf, sob, want, wont in TEST_STARTS:
        r.go(name, wait=10000)
        r.clear_lore(); r.clear_slips(); r.clear_lore()
        if r.pn() != "Dean Street":
            bad.append("%s landed on %r" % (name, r.pn())); continue
        bars = r.js("() => [].map.call(document.querySelectorAll('#stat-bars-lifted .bar-fill, tw-header .bar-fill'), function (b) { return parseInt(b.style.width, 10); }).slice(0, 2)")
        if bars != [conf, sob]:
            bad.append("%s: bars %s, want %s" % (name, bars, [conf, sob]))
        links = r.js(HUB_LINKS)
        for w in want:
            if not any(re.search(w, t) for t in links):
                bad.append("%s: no %s door in %s" % (name, w, links))
        for w in wont:
            if any(re.search(w, t) for t in links):
                bad.append("%s: %s door should be done in %s" % (name, w, links))
        bad += [b for b in hub_problems(r, name)[0] if "The third pillar is open." not in b]   # the pocket slip's words, not a door
    # Carthage is done on start 4 (LINE 2 seen, page back with INIS), so the Pillars door is the pub's, not the storm's: the jump has no LINE 2 in its history
    r.js("() => { var l = [].filter.call(document.querySelectorAll('.soho-hub-dock tw-link, tw-story tw-link'), function (e) { return !e.closest('.dss-ghost') && /^The Pillars$/.test(e.textContent.trim()); })[0]; l.click(); }")
    r.page.wait_for_timeout(4000)
    if r.pn() != "Approach The Pillars":
        bad.append("Test Start 4: the Pillars door led to %r, not the pub's approach" % r.pn())
    r.expect(not bad, "; ".join(bad))
    r.info = "four start points land on Dean Street with their stats and doors"


@check("doorway-gain-after-card", "2026-11-13 note 29 (Sam: \"I'm not sure if the doorway gave me stats back\"): the +4 and +6 rose and faded behind the Hold to piss card; they wait for it now")
def _(r):
    r.go("Test Start 2", wait=10000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return !e.closest('.dss-ghost') && e.textContent.trim() === 'Livonia Street'; })[0]; l.click(); }")
    r.wait_for("() => !!document.querySelector('#spew-popup-overlay canvas')", 8000, "the doorway card")
    LBL = "() => [].map.call(document.querySelectorAll('#stat-bars-lifted .stat-delta'), function (d) { return +getComputedStyle(d).opacity; })"
    r.page.wait_for_timeout(1200)
    under = r.js(LBL)
    r.expect(len(under) == 2 and max(under) < 0.05, "the +4/+6 played behind the card: opacities %s" % under)
    box = r.js("() => { var b = document.querySelector('#spew-popup-overlay canvas').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
    r.page.mouse.move(*box); r.page.mouse.down(); r.page.wait_for_timeout(1500); r.page.mouse.up()
    r.wait_for("() => !document.getElementById('spew-popup-overlay')", 15000, "the card to close")
    r.page.wait_for_timeout(2600)
    after = r.js(LBL)
    r.expect(len(after) == 2 and min(after) > 0.5, "no +4/+6 after the card closed: opacities %s" % after)
    r.info = "the doorway's +4/+6 wait for the card, then show"


@check("slip-writes-in-one-go", "2026-11-13 note 28 (Sam): the slips should not type letter by letter, they should write it all straight up in one go")
def _(r):
    r.go("Test Start 2", wait=10000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    msg = "REGRESSION SLIP: every word of this sentence should land on the paper at the same moment, with nothing left to type."
    r.js("(m) => window.dssInlineHint(m, { now: true })", msg)
    seen = []
    for _ in range(200):
        t = r.js("(m) => [].map.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent; }).filter(function (t) { return t && m.indexOf(t) === 0; })", msg)
        lens = sorted(set(len(x) for x in t if x))
        seen += [l for l in lens if l not in seen]
        if len(msg) in seen:
            break
        r.page.wait_for_timeout(80)
    r.expect(seen and seen[0] == len(msg), "the slip typed in pieces: lengths seen %s of %d" % (seen[:8], len(msg)))
    r.info = "the slip landed whole"


@check("french-photo-glow-left", "2026-11-13 note 27 (Sam): the Photographs glow moves to the left of the man raising a glass (frame 5, x 1.34), into the gap by the dog")
def _(r):
    r.go("The French")
    r.room_ready("fi", photos=False)
    src = r.js("() => [].map.call(document.querySelectorAll('script'), function (s) { return s.textContent; }).join('\\n').match(/name: 'Photographs',[^\\n]*?haloAt: \\[([-0-9.]+),/)")
    r.expect(src, "no haloAt for the French's Photographs")
    x = float(src[1])
    r.expect(0.6 < x < 1.1, "the Photographs glow sits at x %.2f, not in the gap left of his photograph (0.6 to 1.1)" % x)
    r.info = "the glow sits at x %.2f" % x


@check("ginger-french-spaced", "2026-11-13 note 26 (Sam): space the French and the Ginger Light out a little more on Dean Street; the Ginger Light's lamp and door move up together")
def _(r):
    hub_ready(r)
    d = r.js("() => { var m = window.dssSohoMap, o = {}; m.doors.forEach(function (x) { if (x.id === 'french' || x.id === 'ginger') o[x.id] = [x.c, x.r, x.fc, x.fr]; }); return o; }")
    gap = d["french"][3] - d["ginger"][3]
    r.expect(gap >= 6, "the Ginger Light and the French are %d tiles apart on Dean Street, want 6 or more: %s" % (gap, d))
    tile = r.js("(g) => window.dssSohoMap.tiles[g[3]][g[2]]", d["ginger"])
    r.expect(tile == "P", "the Ginger Light's corner is not pavement (%r)" % tile)
    r.info = "%d tiles apart" % gap


@check("hub-first-night", "the first Dean Street: fits the screen, the map draws, each hub link has a map door, the Ginger Light door goes in")
def _(r):
    hub_ready(r)
    bad, links = hub_problems(r, "the first Dean Street")
    got = walk_into(r, "ginger")
    if got == "Dean Street":
        bad.append("walking onto the Ginger Light door did nothing")
    r.info = "links: %s; Ginger Light door -> %s" % (links, got)
    r.expect(not bad, "; ".join(bad))


@check("hub-second-visit", "the second Dean Street (after the poet, LILY and Name Your Book): same, only the French offered (not the Pillars), the pub walk-by fades with it, and its door goes in")
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
    # 2026-11-11 (Sam: the pub walk-by "should fade in and out" as you pass an open pub without going in): far, then two tiles off the French
    far, near = pub_pass_at(r, (17, 38), "up"), pub_pass_at(r, (19, 32), "up")
    if not (far is not None and far < 0.01 and near is not None and near > 0.05):
        bad.append("the pub walk-by did not fade with the French (far %s, near %s)" % (far, near))
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
    r.wait_for("() => !!window.__dssGreatWorkSlips", 8000, "THE GREAT WORK slips (the night's first haunt)")
    r.page.wait_for_timeout(1500); r.clear_slips(rounds=10)   # 2026-11-11: the held choice goes once they are read (their click guard once swallowed it)
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


@check("barber-choice-after-scene", "2026-11-08 notes 27-28: at the barber's the choices wait under the 3D scene until its button is pressed; 2026-11-13 notes 25-26: the button says TO THE BARBER'S, the shop bell rings on it (not on the map step), the runner goes at 3.4 m/s in all three scenes")
def _(r):
    r.go("The Barbershop", wait=1500)
    r.expect(r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-passage tw-link'), function (x) { return x.textContent.trim() === 'A haircut'; })[0]; return !!l && getComputedStyle(l).visibility === 'hidden'; }"), "the barber's choices show before the scene's button is pressed")
    r.page.wait_for_timeout(3000)
    r.js("() => { window.__bellRings = 0; var A = window.dssAudio, f = A.doorShopBell; A.doorShopBell = function () { window.__bellRings++; return f.apply(this, arguments); }; }")
    r.page.wait_for_timeout(500)
    r.expect(r.js("() => window.__bellRings") == 0, "the shop bell rang before the barber's button was pressed")
    r.expect(r.page.get_by_text("AT THE BARBER’S DOOR").count() == 0, "the button still says AT THE BARBER’S DOOR (note 26)")
    r.page.get_by_text("TO THE BARBER’S").click()
    r.page.wait_for_timeout(1500)
    r.expect(r.js("() => window.__bellRings") == 1, "the shop bell did not ring once on the barber's button (%r)" % r.js("() => window.__bellRings"))
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect(not re.search(r"door\.id === 'barber'[^;]{0,80}doorShopBell", html), "the map step rings the barber's bell again (note 25)")
    r.expect(html.count("speed:3.4,rate:0.75") == 2 and html.count("speed: 3.4, rate: 0.75") == 1 and "speed:6,rate:1.25" not in html, "the runner is back at his old sprint in one of his three scenes (note 25)")
    r.expect(r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-passage tw-link'), function (x) { return x.textContent.trim() === 'A haircut'; })[0]; return !!l && getComputedStyle(l).visibility === 'visible' && l.getClientRects().length > 0; }"), "the barber's choices did not show after the scene")


KIPLING_PROBE = """() => {
  var r = (window._dssThreeRegistry || {})['jd-wrap']; if (!r) return null;
  var T = window.THREE, sc = r.scene, cam = r.camera, kip = sc.getObjectByName('kipling-front'); if (!kip) return { front: false };
  sc.updateMatrixWorld(true); cam.updateMatrixWorld(true);
  function px(v) { var p = v.clone().project(cam); return [(p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight]; }
  function corners(o) { var b = new T.Box3().setFromObject(o); return [px(new T.Vector3(b.min.x, b.min.y, b.max.z)), px(new T.Vector3(b.max.x, b.min.y, b.max.z)), px(new T.Vector3(b.min.x, b.max.y, b.max.z)), px(new T.Vector3(b.max.x, b.max.y, b.max.z))]; }
  var tusks = [], lights = 0, helices = 0;
  sc.traverse(function (o) { if (o.name === 'kipling-tusk') { var pa = o.geometry.attributes.position, v = new T.Vector3(), x0 = 9, x1 = -9, z1 = -9, y0 = 9, y1 = -9; for (var i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(o.matrixWorld); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); z1 = Math.max(z1, v.z); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); } tusks.push([x0, x1, z1, y1 - y0]); } if (o.name === 'kipling-helix') helices++; if (o.isPointLight) lights++; });
  var fascia = kip.getObjectByName('kipling-fascia'), crest = kip.getObjectByName('kipling-crest'), lamp = kip.getObjectByName('kipling-lamp');
  var tex = fascia && fascia.material.map && fascia.material.map.image, ink = 0;
  if (tex && tex.getContext) { var d = tex.getContext('2d').getImageData(0, 0, tex.width, tex.height).data; for (var i = 0; i < d.length; i += 16) if (d[i] > 170 && d[i + 1] > 160) ink++; }
  return { front: true, tusks: tusks, helices: helices, lights: lights, band: !!kip.getObjectByName('kipling-helix-band'), lamp: lamp ? lamp.intensity : 0, ink: ink,
    fascia: fascia ? corners(fascia) : null, crest: crest ? corners(crest) : null, cross: (function () { var c = sc.getObjectByName('jimmy-green-cross'); return c ? px(c.getWorldPosition(new T.Vector3())) : null; })(), jimmy: px(new T.Vector3(0, 1.45, -0.15)), w: innerWidth, h: innerHeight };
}"""


@check("kipling-front-in-drug-store", "2026-11-09 (Sam): Mr. Kipling's Mammoth Resurrection Emporium, a decorative front in the bay to the right of Mister Jimmy's; Jimmy's stays the middle of the frame")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Mister Jimmy’s Drug Store", wait=1500)
    r.wait_for("() => !!((window._dssThreeRegistry || {})['jd-wrap'])", 15000, "the Drug Store approach scene")
    r.page.wait_for_timeout(5500)   # the camera's settle
    worst = None
    for _i in range(13):   # the camera sways on a 31 s period: look at both ends of it
        p = r.js(KIPLING_PROBE)
        r.expect(p and p["front"], "no Kipling front in the Drug Store approach")
        r.expect(p["fascia"] and p["crest"] and p["band"], "the Kipling front has lost its name board, its crest or its painted band")
        for name in ("fascia", "crest"):
            for x, y in p[name]:
                r.expect(0 <= x <= p["w"] and 0 <= y <= p["h"], "Mr. Kipling's %s runs off the screen (a corner at %d,%d of %dx%d)" % ("name board" if name == "fascia" else "crest", x, y, p["w"], p["h"]))
        r.expect(min(c[0] for c in p["fascia"]) > p["jimmy"][0], "Mr. Kipling's is not to the right of Mister Jimmy's")
        r.expect(p["cross"] and 0 < p["cross"][0] < p["jimmy"][0] and 0 < p["cross"][1] < p["h"], "Mister Jimmy's green cross is gone or off the screen (2026-11-09, Sam: the green short-armed cross, not the CHEMIST box)")
        r.expect(0.35 * p["w"] < p["jimmy"][0] < 0.65 * p["w"], "Mister Jimmy's is no longer the middle of the frame (its centre at %d of %d)" % (p["jimmy"][0], p["w"]))
        edge = p["w"] - max(c[0] for c in p["fascia"])
        worst = edge if worst is None else min(worst, edge)
        r.page.wait_for_timeout(2000)
    r.expect(p["ink"] > 2500, "the name board carries no lettering (%d light samples)" % p["ink"])
    r.expect(len(p["tusks"]) >= 12 and p["helices"] == 2, "the window has %d tusks and %d helix colonnettes (wanted 12 or more, and 2)" % (len(p["tusks"]), p["helices"]))
    sizes = sorted(t[3] for t in p["tusks"])
    r.expect(sizes[0] < 0.4 and sizes[-1] > 1.4, "the tusks are not of several sizes (heights %.2f to %.2f)" % (sizes[0], sizes[-1]))
    for x0, x1, zmax, _h in p["tusks"]:
        r.expect(zmax < -0.25 and x0 > 2.1 and x1 < 3.12, "a tusk pokes out of the display (x %.2f to %.2f, front at z %.2f)" % (x0, x1, zmax))
    r.expect(0 < p["lamp"] < 2, "the display lamp is off or not dim (intensity %.2f)" % p["lamp"])
    r.expect(p["lights"] <= 12, "%d point lights in the Drug Store approach (the budget is 12)" % p["lights"])
    r.expect(r.js("() => !!document.querySelector('tw-passage') && [].some.call(document.querySelectorAll('button'), function (b) { return b.textContent.trim() === 'GO TO THE COUNTER'; })"), "the Drug Store's own button is gone")
    r.info = "name board stays %d px inside the right edge at the far end of the sway; %d tusks, %d point lights" % (worst, len(p["tusks"]), p["lights"])
    # the barber's, which shares the terrace code, has no Kipling front
    r.go("The Barbershop", wait=1500)
    r.wait_for("() => !!((window._dssThreeRegistry || {})['bd-wrap'])", 15000, "the barber's approach scene")
    r.expect(r.js("() => !window._dssThreeRegistry['bd-wrap'].scene.getObjectByName('kipling-front')"), "the Kipling front turned up at the barber's")


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
    r.wait_for("() => { var e = document.getElementById('dawn-play-again'); return e && e.classList.contains('dawn-petal-restart'); }", 60000, "ANOTHER NIGHT after the petals")   # 2026-11-09 note 40: it now waits for THE END too


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
    r.wait_for("() => !!document.querySelector('.dss-hint-slip.dss-hint-voices:not(.out)')", 12000, "the VOICES slip to land")   # 2026-11-13 note 28: slips land written, so there is no 'still typing' moment; it must not swallow the click while it is up
    b = r.page.locator(".dss-room-back:visible").first.bounding_box()
    r.page.mouse.click(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
    r.wait_for("() => window.__dssRooms.cb.mode() !== 'inspect'", 4000, "one click on Back to the room to leave the close-up while the VOICES slip is up")

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


# ---------------------------------------------------------------- 2026-11-09 audio and feel
TAP = r"""(function () {
  /* listen to what the game actually sends to the speakers (--mute-audio silences the device, not the graph) */
  var C = AudioNode.prototype.connect; window.__tap = { lv: [], starts: [] };
  function tapFor(ac) { if (ac.__tapA) return ac.__tapA; var a = ac.createAnalyser(); a.fftSize = 2048; ac.__tapA = a; var buf = new Float32Array(2048);
    setInterval(function () { a.getFloatTimeDomainData(buf); var s = 0; for (var i = 0; i < buf.length; i++) s += buf[i] * buf[i];
      window.__tap.lv.push([ac.currentTime, 10 * Math.log10(s / buf.length + 1e-12)]); }, 100); return a; }
  AudioNode.prototype.connect = function (dst) { var r = C.apply(this, arguments); try { if (dst instanceof AudioDestinationNode) C.call(this, tapFor(dst.context)); } catch (e) {} return r; };
  var S = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (w, off) { try { if (this.buffer && this.buffer.duration > 60) window.__tap.starts.push([this.context.currentTime, off || 0, this.buffer.duration]); } catch (e) {} return S.apply(this, arguments); };
})();"""


@check("dawn-piano-crossfade", "2026-11-09 note 38: the Dawn piano lets its final chord ring, then the next pass comes in over the tail, no stop-then-start silence")
def _(r):
    r.ctx.add_init_script(TAP)
    scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Dawn", wait=3000)
    r.page.mouse.click(5, 5)
    r.wait_for("() => window.__tap.starts.length >= 2", 95000, "the piano's second pass")
    r.page.wait_for_timeout(9000)
    d = r.js("() => window.__tap")
    (t1, off, dur), t2 = d["starts"][0], d["starts"][1][0]
    r.info = "second pass at %.1f s, first ends at %.1f s" % (t2 - t1, dur - off)
    FINAL_CHORD = 68.9   # where the last chord strikes in piano-eoin-roe.mp3 (file time)
    at = t2 - t1 + off   # file time of the first pass when the second begins
    r.expect(at >= FINAL_CHORD + 2, "the second pass came in %.1f s after the final chord; it needs 2 s to ring (Sam, later on 2026-11-09)" % (at - FINAL_CHORD))
    r.expect(t2 < t1 + (dur - off), "the second pass waited for the first to end (%.1f s in; the first ends at %.1f s)" % (t2 - t1, dur - off))
    peaks = {}
    for t, db in d["lv"]:
        if t2 - 1 <= t <= t2 + 8: k = int((t - t2) * 2); peaks[k] = max(peaks.get(k, -999), db)
    low = min(peaks.values())
    r.info += "; quietest half second across the seam %.1f dB" % low
    r.expect(low > -72, "the sound drops to silence across the seam (%.1f dB)" % low)   # the room tone under the chord's tail sits near -59; true silence reads far below -100


PONG_DRIVE = r"""() => {
  /* play the rallies: meet each ball with the bat moving down, then up, then still, and record the return's path */
  var P = window.__dssPong, cv = document.getElementById('pong-canvas'), W = cv.width, H = cv.height;
  var hits = [], cur = null, n = 0, V = [6, -6, 0], prev = null;
  function setMouse(my) { var r = cv.getBoundingClientRect(); my = Math.max(-40, Math.min(H + 40, my));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: r.left + 5, clientY: r.top + my * r.height / H, bubbles: true })); }
  function pred(b) { var px = P.pPad.x + P.pPad.w + b.r, f = (b.x - px) / -b.dx, y = b.y + b.dy * f;
    for (var k = 0; k < 6 && (y < b.r || y > H - b.r); k++) { if (y < b.r) y = 2 * b.r - y; if (y > H - b.r) y = 2 * (H - b.r) - y; } return [y, f]; }
  function tick() { if (!cv.isConnected) return;
    var b = P.ball, pad = P.pPad;
    if (prev && prev.dx < 0 && b.dx > 0 && b.x < W / 2) { cur = { v: pad.y - prev.py, want: V[n % 3], ys: [], t: Date.now() / 1000 }; hits.push(cur); n++; }
    if (cur && b.dx > 0) { if (b.y <= b.r + 0.5 || b.y >= H - b.r - 0.5) cur.wall = true; if (!cur.wall && cur.ys.length < 40) cur.ys.push(b.y); }
    if (b.dx < 0) { cur = null; var pr = pred(b), v = V[n % 3], f = Math.min(pr[1], 12); setMouse(pr[0] + 3 * v - v * f); }   /* the bat lags the mouse by 3 frames of its speed */
    prev = { dx: b.dx, py: pad.y }; window.__pongHits = hits; requestAnimationFrame(tick); }
  requestAnimationFrame(tick); }"""


@check("pong-spin-curves", "2026-11-09 note 16: sweep the bat as you hit and the ball curves the way you swept; a still bat hits straight")
def _(r):
    scratch_passage(r, "T-pong", '(set: $opponent to "Jack Curtis")(set: $sobriety to 90)(go-to: "PP Pong")')
    r.go("T-pong", wait=5000)
    r.page.get_by_text("Serve", exact=True).click(); r.page.wait_for_timeout(500)
    r.expect(r.js("() => !!window.__dssPong"), "the pong game did not start")
    r.js(PONG_DRIVE)
    r.page.wait_for_timeout(35000)
    swept, still = [], []
    for h in r.js("() => window.__pongHits || []"):
        ys = h["ys"]
        if len(ys) < 20: continue
        m = len(ys) - 1; bend = ys[m] - (ys[0] + (ys[1] - ys[0]) * m)   # how far the path left the straight line it set off on
        (swept if abs(h["v"]) > 3 else still).append((h["v"], bend))
    r.info = "swept %s; still %s" % (["%+.0f:%+.1f" % x for x in swept], ["%+.1f" % b for _, b in still])
    r.expect(len(swept) >= 3 and still, "too few clean returns to judge (%s)" % r.info)
    for v, bend in swept:
        r.expect(bend * v > 0 and abs(bend) >= 6, "a bat swept at %+.1f px a frame sent the ball %+.1f px off straight" % (v, bend))
    for v, bend in still:
        r.expect(abs(bend) < 2, "a still bat curved the ball %+.1f px" % bend)


@check("pong-spin-pops", "2026-11-09 (Sam): a swept hit sometimes throws a cartoon pop with one of his two lines; never on a still bat, never twice in 7 s, gone after about 2 s")
def _(r):
    scratch_passage(r, "T-pong", '(set: $opponent to "Jack Curtis")(set: $sobriety to 90)(go-to: "PP Pong")')
    r.go("T-pong", wait=5000)
    r.page.get_by_text("Serve", exact=True).click(); r.page.wait_for_timeout(500)
    r.js("""() => { window.__dssPongPopAlways = true; window.__pops = [];   /* the game's chance roll is skipped while this flag is set */
      new MutationObserver(function (ms) { ms.forEach(function (m) {
        [].forEach.call(m.addedNodes, function (n) { if (n.classList && n.classList.contains('pp-spin-pop')) {
          setTimeout(function () { var hit = (window.__pongHits || []).slice(-1)[0] || {}, q = n.getBoundingClientRect(); window.__pops.push({ t: Date.now(), text: n.textContent, v: hit.v, x: q.left, y: q.top, r: q.right, b: q.bottom, op: +getComputedStyle(n).opacity, el: n }); }, 400); } });
      }); }).observe(document.body, { childList: true }); }""")
    r.js(PONG_DRIVE)
    r.page.wait_for_timeout(30000)
    pops = r.js("() => window.__pops.map(function (p) { return { t: p.t, text: p.text, v: p.v, x: p.x, y: p.y, r: p.r, b: p.b, op: p.op, gone: !p.el.isConnected || Date.now() - p.t < 2500 }; })")
    r.info = "%d pops: %s" % (len(pops), [p["text"][:18] for p in pops])
    LINES = {"Call you Alastair Campbell the way you spin!", "How’s that for a dodgy dossier?"}
    r.expect(len(pops) >= 2, "too few pops in 30 s of swept hits (%s)" % r.info)
    for i, p in enumerate(pops):
        r.expect(p["text"] in LINES, "a pop said %r" % p["text"])
        r.expect(abs(p["v"] or 0) > 3, "a pop came on a hit with the bat at %s" % p["v"])
        r.expect(p["x"] >= 0 and p["y"] >= 0 and p["r"] <= 1440 and p["b"] <= 900, "a pop ran off the screen")
        r.expect(p["op"] > 0.8, "a pop was barely visible (opacity %.2f)" % p["op"])
        r.expect(p["gone"], "a pop stayed on screen")
        if i: r.expect(p["text"] != pops[i - 1]["text"], "the same line twice running"); r.expect(p["t"] - pops[i - 1]["t"] >= 6900, "two pops within 7 s")
    r.page.screenshot(path=os.path.join(SHOTS, "pong-spin-pops.png"))


@check("pocket-badge-rests", "2026-11-13 note 1 (Sam): the IN YOUR POCKET badge glows brighter, goes after a while and comes back while you hover the key's name in the header")
def _(r):
    r.go("Dean Street", wait=6000)
    r.clear_lore(); r.clear_slips()
    r.js("() => { var c = document.createElement('span'); c.className = 'pocket-cell'; c.id = 'test-pocket'; c.textContent = '⚲ THE BRASS LIGHTER'; c.style.cssText = 'position:fixed;left:20px;top:300px;z-index:99999999;padding:6px;background:#000;color:#fff'; document.body.appendChild(c); }")
    op = "() => { var b = document.querySelector('.dss-pocket-badge'); return b ? +getComputedStyle(b).opacity : -1; }"
    r.page.wait_for_timeout(2000)
    r.expect(r.js(op) > 0.5, "the badge did not show when the key came into the pocket (%r)" % r.js(op))
    r.expect(r.js("() => getComputedStyle(document.querySelector('.dss-pocket-badge')).animationName").find("dssPocketGlow") >= 0, "the badge has lost its glow")
    r.page.wait_for_timeout(7500)
    r.expect(r.js(op) < 0.05, "the badge did not go after a while (opacity %r)" % r.js(op))
    box = r.js("() => { var b = document.getElementById('test-pocket').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
    r.page.mouse.move(box[0], box[1]); r.page.wait_for_timeout(900)
    r.expect(r.js(op) > 0.5, "hovering the pocket name did not bring the badge back (%r)" % r.js(op))
    r.page.mouse.move(700, 600); r.page.wait_for_timeout(900)
    r.expect(r.js(op) < 0.05, "the badge stayed after the pointer left the pocket name")


@check("slip-ttl", "2026-11-13 note 3 (Sam): the 'X is in your pocket' slip goes by itself after a few seconds")
def _(r):
    r.go("Dean Street", wait=6000)
    r.clear_lore(); r.clear_slips()
    r.js("() => window.dssInlineHint('A slip that should go by itself.', { ttl: 2000 })")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip:not(.out)'), function (e) { return /go by itself/.test(e.textContent); })", 6000, "the test slip")
    r.wait_for("() => ![].some.call(document.querySelectorAll('.dss-hint-slip:not(.out)'), function (e) { return /go by itself/.test(e.textContent); })", 7000, "the slip to go by itself")
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect("ttl: 5000 }" in html, "the pocket slip no longer goes by itself (no ttl on its call)")


@check("portal-para-gap", "2026-11-13 note 4 (Sam): no extra line between the Third Pillar Portal's second and third paragraphs (read from the build: the Portal turns a jump without the third pillar's state back to the Pillars)")
def _(r):
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    i = html.find('name="Third Pillar Portal"')
    r.expect(i >= 0, "no Third Pillar Portal in the build")
    j = html.find("ezekiel-go", i)
    k = html.find("third blue post rears", j)
    seg = html[j:k]
    close = seg.find("&lt;/div&gt;")
    r.expect(close >= 0, "the Portal's roll has no end")
    after = seg[close + len("&lt;/div&gt;"):]
    after = re.sub(r"&lt;!--.*?--&gt;", "", after, flags=re.S)
    r.expect(after.startswith("\\"), "the roll's line break is back before the third paragraph (%r)" % after[:40])


@check("airport-pub-book", "2026-11-13 notes 5-6 (Sam): no 'The Enlightenment' hover box over the Airport Pub; Chariots of the Gods sits in a booth and opens its lore")
def _(r):
    r.go("Airport Pub", wait=12000)
    r.clear_lore(); r.clear_slips()
    for x, y in ((720, 450), (545, 489), (900, 400)):
        r.page.mouse.move(x, y); r.page.wait_for_timeout(300)
        r.expect(not r.js("() => [].some.call(document.querySelectorAll('div, span'), function (e) { return /The Enlightenment/.test(e.textContent) && e.children.length === 0 && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.1 && getComputedStyle(e).position !== 'static'; })"), "the Enlightenment hover box shows over the pub")
    r.expect(r.js("() => typeof window.__apOpenBookLore === 'function'"), "the booth's book is gone")
    r.js("() => window.__apOpenBookLore()")
    r.wait_for("() => { var o = document.getElementById('dss-lore-overlay'); return !!o && /CHARIOTS/i.test(o.innerText); }", 6000, "the book to open its lore")


@check("himalaya-notes", "2026-11-13 notes 7-10 (Sam): the Foothills page is dressed (ridges, prayer flags), the Climb's music has its long intro cut, no 'Himalayas ascent' label, the Cave's paragraphs evenly spaced")
def _(r):
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect("climb-music-cut.m4a" in html, "the Climb plays its uncut music again (note 8)")
    r.go("Foothills", wait=8000)
    bg = r.js("() => { var t = document.querySelector('tw-story .dss-threshold'), p = document.querySelector('.dss-room-prose'); return [t ? getComputedStyle(t).backgroundImage : '', p ? getComputedStyle(p).backgroundImage : '']; }")
    r.expect("svg" in bg[0], "the Foothills page has no ridges (%r)" % bg[0][:80])
    r.expect("svg" in bg[1], "the Foothills words have no prayer flags (%r)" % bg[1][:80])
    r.go("The Climb", wait=8000)
    r.expect(not r.js("() => /ASCENT/i.test((document.querySelector('.hc-toolbar') || {}).textContent || '')"), "the Climb still says Himalayas ascent (note 9)")
    r.go("The Cave", wait=8000)
    r.clear_lore(); r.clear_slips()
    r.expect(r.js("() => !!document.querySelector('.dss-cave-gap')"), "the Cave's choice sits tight under the words again (note 10)")


@check("liver-in-notebook", "2026-11-13 note 11 (Sam): the liver tip says it is in your NOTEBOOK")
def _(r):
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect("liver is in your NOTEBOOK" in html, "the liver tip does not say it is in your NOTEBOOK")


@check("soho-square-alley", "2026-11-13 notes 12-14 (Sam): the alley side of Soho Square shows the 3D square, not the drawn hut; the worm page's Back to the Square sits under its last line, no scrolling")
def _(r):
    r.go("Alley: Soho Square", wait=9000)
    r.clear_lore(); r.clear_slips()
    r.wait_for("() => { var w = document.getElementById('sq-wrap'), c = document.getElementById('sq-container'); return !!w && !!c && c.dataset.state === 'alley'; }", 15000, "the 3D square on the alley page")
    r.expect(not r.js("() => [].some.call(document.querySelectorAll('svg'), function (s) { return /hut/i.test(s.getAttribute('class') || '') && s.getClientRects().length; })"), "the drawn hut is still on the alley page")
    r.go("Soho Square: the gardener’s hut", wait=6000)
    r.clear_lore(); r.clear_slips()
    b = r.js("() => { var l = [].filter.call(document.querySelectorAll('.worm-back tw-link'), function (x) { return !x.closest('.dss-ghost'); })[0]; if (!l) return null; var b = l.getBoundingClientRect(); return { bottom: b.bottom, inGame: !!l.closest('#dss-worm-game'), scroll: document.scrollingElement.scrollHeight - innerHeight }; }")
    r.expect(b and b["inGame"], "Back to the Square is not under the worm's last line (%r)" % b)
    r.expect(b["bottom"] <= 900, "Back to the Square is below the fold (%r)" % b)


@check("lk-office-turntable-lore", "2026-11-13 notes 17, 18, 20 (Sam): the turntable's long note is two LORE notes that open by themselves on the look; the opening box ends Back to the office")
def _(r):
    r.go("Martin Lackland's Office", wait=12000)
    r.room_ready("lk"); r.clear_slips(); r.clear_lore()
    lbl = r.js("() => [].map.call(document.querySelectorAll('.dss-room-dismiss'), function (b) { return b.textContent.trim(); }).join('|')")
    r.expect("Back to the office" in lbl and "Into the office" not in lbl, "the opening box's button says %r, not Back to the office" % lbl)
    r.js("() => { try { localStorage.removeItem('dssLoreRead'); } catch (e) {} }")
    r.click_object("lk", "A turntable")
    seen = []
    for _ in range(3):
        r.wait_for("() => !!document.getElementById('dss-lore-overlay')", 8000, "a LORE note to open by itself on the turntable")
        seen.append(r.js("() => document.getElementById('dss-lore-overlay').innerText"))
        r.clear_lore(rounds=1); r.page.wait_for_timeout(1500)
        if not r.js("() => !!document.getElementById('dss-lore-overlay')"): 
            if len(seen) >= 2: break
            r.page.wait_for_timeout(1500)
            if not r.js("() => !!document.getElementById('dss-lore-overlay')"): break
    joined = " || ".join(seen)
    r.expect(len(seen) >= 2, "only one LORE note opened on the turntable (%r)" % joined[:200])
    r.expect(re.search("listening to", joined, re.I) and "Garrard" in joined, "the two turntable notes were not both read (%r)" % joined[:300])


@check("lk-reads-book", "2026-11-13 note 19 (Sam): LACKLAND reads the book with the Belletrist's turning-book animation, and his verdict waits for it to shut")
def _(r):
    r.go("Martin Lackland's Office", wait=12000)
    r.js("() => { var l = [].filter.call(document.querySelectorAll('.dss-room-prose tw-link'), function (x) { return x.textContent.trim() === 'Lay it down'; })[0]; if (l) l.click(); }")
    r.wait_for("() => !!document.querySelector('.dss-readbook .critic-book-stage, .dss-readbook-widget')", 6000, "the reading book")
    r.expect(r.js("() => getComputedStyle(document.querySelector('.dss-readbook-after')).visibility") == "hidden", "LACKLAND's verdict shows before the book has shut")
    r.wait_for("() => getComputedStyle(document.querySelector('.dss-readbook-after')).visibility === 'visible'", 15000, "the verdict after the book shuts")
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect(html.count("dss-readbook&quot; data-pages") >= 3, "not every reader has the turning book (LACKLAND, the novelist, SHANA)")


@check("pong-music-warm", "2026-11-13 note 24 (Sam): the pong music sits a little closer to the office track (the darker render)")
def _(r):
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect("pong-actress-warm.m4a" in html, "Pong plays the bright Actress render again")


@check("prints-on-walls", "2026-11-13 note 16 (Sam: \"I don't like these picture gallery things at all ... on the walls in frames\"): his prints hang framed in LACKLAND's office, the cellar and the chippy, and no card carries a picture strip; the Coach's and Ronnie's pictures hang together in view")
def _(r):
    for room, passage, want, spot in (("lk", "Martin Lackland's Office", 3, "Shelves"), ("cu", "Turn to Copper", 1, "A chesterfield"), ("cf", "Chinese Fish and Chips", 2, "A menu")):
        r.go(passage, wait=9000)
        r.room_ready(room); r.clear_slips(); r.clear_lore()
        r.page.wait_for_timeout(1500)
        got = r.js("([room]) => { var n = 0, loaded = 0; window.__dssRooms[room].scene.traverse(function (o) { if (o.name === 'dss-hung-print-face') { n++; if (o.material.map && o.material.map.userData.loaded) loaded++; } }); return [n, loaded]; }", [room])
        r.expect(got[0] == want, "%s: %d framed prints on the walls, expected %d" % (room, got[0], want))
        r.expect(got[1] == want, "%s: only %d of the prints loaded their pictures" % (room, got[1]))
        r.click_object(room, spot)
        r.page.wait_for_timeout(800)
        r.expect(r.js("() => document.querySelectorAll('.dss-print-tray, .dss-room-card button[aria-label*=\"print\" i]').length") == 0, "%s: the %s card still carries a picture strip" % (room, spot))
    # 2026-11-13 (Sam: "Do the same for the Coach and Ronnie's"): their pictures hang together where the room's opening view shows them
    for room, passage, name, want in (("cb", "Coach and Horses bar", "coach-wall-print", 5), ("ri", "Ronnie Scott's", "ronnie-wall-photo", 7)):
        r.go(passage, wait=9000)
        r.room_ready(room); r.clear_slips(); r.clear_lore()
        got = r.js("""([room, name]) => { var R = window.__dssRooms[room], cam = R.camera, T = window.THREE, n = 0, seen = 0; R.scene.updateMatrixWorld(true); R.scene.traverse(function (o) { if (o.name !== name) return; n++; var v = new T.Vector3(); o.getWorldPosition(v); v.project(cam); if (Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1) seen++; }); return [n, seen]; }""", [room, name])
        r.expect(got[0] == want, "%s: %d pictures on the wall, expected %d" % (room, got[0], want))
        r.expect(got[1] == want, "%s: only %d of its %d pictures are in the room's view" % (room, got[1], want))
    # 2026-11-13 (Sam: "Do the same for Trisha's and the Colony"): Trisha's nine photographs hang a size up on cream mounts, most in view; the Colony's salon hang shows both his prints
    r.go("Trisha's", wait=9000)
    r.room_ready("ti"); r.clear_slips(); r.clear_lore()
    got = r.js("""() => { var R = window.__dssRooms.ti, cam = R.camera, T = window.THREE, n = 0, seen = 0, big = 0; R.scene.updateMatrixWorld(true); R.scene.traverse(function (o) { if (o.name !== 'trisha-wall-photo') return; n++; if (o.scale.x >= 1.25) big++; var v = new T.Vector3(); o.getWorldPosition(v); v.project(cam); if (Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1) seen++; }); return [n, seen, big]; }""")
    r.expect(got[0] == 9 and got[2] == 9, "ti: %d mounted photographs (%d a size up), expected 9" % (got[0], got[2]))
    r.expect(got[1] >= 7, "ti: only %d of the photographs are in the room's view" % got[1])
    r.go("The Colony Room", wait=9000)
    r.room_ready("ci"); r.clear_slips(); r.clear_lore()
    got = r.js("""() => { var R = window.__dssRooms.ci, cam = R.camera, T = window.THREE, n = 0, seen = 0; R.scene.updateMatrixWorld(true); R.scene.traverse(function (o) { var m = o.material, d = m && m.map && m.map.userData; if (!d || !d.dssPrint) return; n++; var v = new T.Vector3(); o.getWorldPosition(v); v.project(cam); if (Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1) seen++; }); return [n, seen]; }""")
    r.expect(got[0] == 2 and got[1] == 2, "ci: his two prints are not both on the Colony's walls in view (%r)" % got)


@check("gents-door-heart", "2026-11-13/14 (Sam: \"prepare this image to add to the graffiti on the gents door\", \"below it, '2025-2066'\", then \"I want it only on the inside\", \"have the graffiti as decorative\"): the SILVER DARLINGS heart and its date are on the inside of the Coach's gents door, loaded and whole in the gents' view, small under the letters; none on the bar side")
def gents_door_heart(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Coach and Horses lock", wait=9000)
    # the gents is an arrival scene (no __dssRooms hook): read its scene and camera from the 3D registry
    got = r.js("""() => { var reg = window._dssThreeRegistry || {}, T = window.THREE, out = null; Object.keys(reg).forEach(function (id) { var e = reg[id]; if (!e || !e.scene || !e.camera) return; e.scene.updateMatrixWorld(true);
      e.scene.traverse(function (o) { if (o.name !== 'gents-door-heart') return; var g = o.geometry.parameters, im = o.material.map && o.material.map.image, seen = 0, top = -9;
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { var v = new T.Vector3(c[0] * g.width / 2, c[1] * g.height / 2, 0); o.localToWorld(v); top = Math.max(top, v.y); v.project(e.camera); if (Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1) seen++; });
        out = { id: id, w: im ? (im.naturalWidth || im.width || 0) : 0, seen: seen, top: top }; }); }); return out; }""")
    r.expect(got is not None, "no heart on the inside of the gents door")
    r.expect(got["w"] >= 512, "the heart's picture did not load (assets/gents-door-silver-darlings.png)")
    r.expect(got["seen"] == 4, "only %d of the heart's four corners are in the gents' view" % got["seen"])
    r.expect(got["top"] < 1.10, "the heart runs up into the letters (its head is at %.2f, the letters' foot at 1.10): it is decoration, under them" % got["top"])
    r.go("Coach and Horses bar", wait=9000)
    r.room_ready("cb")
    n = r.js("() => { var n = 0; window.__dssRooms.cb.scene.traverse(function (o) { if (o.name === 'gents-door-heart') n++; }); return n; }")
    r.expect(n == 0, "the heart is on the bar side of the gents door as well (Sam: only on the inside)")


def main(argv):
    # --plant=OLD|||NEW serves the html with OLD replaced (through scratch_passage), to prove a check fails with an old bug back
    for a in argv[1:]:
        if a.startswith("--plant="): SWAPS.append(tuple(a[8:].split("|||", 1)))
    want = [a.lower() for a in argv[1:] if not a.startswith("--plant=")]
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
