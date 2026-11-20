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

    def go(self, passage, wait=9000, extra=""):
        from urllib.parse import quote
        # extra="&dev=0" turns the dev flag off for the rest of this check's context (the game remembers it), so the page is laid out as a player gets it, without the testing links
        self.page.goto("http://127.0.0.1:%d/%s?t=%d&start=%s%s" % (self.port, HTML, int(time.time()), quote(passage), extra), timeout=90000)
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
            # 2026-11-14 note 7: the MORALE and SOBRIETY slips cannot be closed until they have been up long enough to read
            self.wait_for("() => !document.querySelector('#dss-hint-stack .dss-hint-slip.dss-hint-held:not(.out)')", 12000, "a held slip to let go")
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
            r.page.locator("#dss-lore-overlay.dss-lore-auto .dss-lore-on").first.click()   # 2026-11-14 note 16: the note's foot button reads Go on now, not the press's own words
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
    r.clear_lore()   # 2026-11-18 (Sam, note 22): THE GREAT WORK is one popup card again, not slips; it sat over the gun and took the click
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


@check("book-title-box-steady", "2026-11-19 note 2 (Sam): on Name Your Book the page changed size as you typed; the title box keeps its height while the letters shrink")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Name Your Book", wait=7000)
    r.clear_lore(); r.clear_slips()
    SIZE = "() => { var ta = [].filter.call(document.querySelectorAll('textarea, input[type=text]'), function (e) { return !e.closest('.dss-ghost') && e.getClientRects().length; })[0]; if (!ta) return null; var p = ta.closest('tw-passage') || document.body; return [Math.round(ta.getBoundingClientRect().height * 10) / 10, Math.round(p.getBoundingClientRect().height), getComputedStyle(ta).fontSize]; }"
    first = r.js(SIZE)
    r.expect(first is not None, "no title box on Name Your Book")
    if first is None:
        return
    r.page.locator("textarea:visible, input[type=text]:visible").first.click()
    seen = [first]
    for ch in "The Unbearable Weight of Being Very Slightly Late":
        r.page.keyboard.type(ch)
        seen.append(r.js(SIZE))
    hs = sorted(set(s[0] for s in seen)); ps = sorted(set(s[1] for s in seen)); fs = sorted(set(s[2] for s in seen))
    r.info = "box %r, page %r, fonts %r" % (hs, ps, fs)
    r.expect(len(fs) >= 3, "the letters did not shrink as the title grew (%r)" % fs)
    r.expect(hs[-1] - hs[0] <= 1, "the title box changed height as you typed (%r)" % hs)
    r.expect(ps[-1] - ps[0] <= 1, "the page changed size as you typed (%r)" % ps)


@check("pillars-milton-quick", "2026-11-20 (Sam, playtest at the Pillars: \"Quicker typewriter on the milton here\"): the Milton line on entering the Pillars types at the quick verse pace")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Entering The Pillars of Hercules", wait=0)
    r.js("""() => { var L = window.__vt = { first: 0, last: 0, n: 0 }, t0 = performance.now(); (function tick() {
      var v = [].filter.call(document.querySelectorAll('.verse'), function (e) { return !e.closest('.dss-ghost') && /Hobson/.test(e.textContent); })[0];
      if (v) { var cs = v.querySelectorAll('.vt-in'); if (cs.length && !L.first) L.first = performance.now(); if (cs.length > L.n) { L.n = cs.length; L.last = performance.now(); } L.quick = v.classList.contains('verse-quick'); }
      if (performance.now() - t0 < 25000) requestAnimationFrame(tick); })(); }""")
    r.page.wait_for_timeout(20000)
    L = r.js("() => window.__vt")
    took = (L["last"] - L["first"]) / 1000.0 if L["first"] else -1
    r.info = "letters %d, typed in %.1f s, verse-quick %r" % (L["n"], took, L.get("quick"))
    r.expect(L["n"] >= 30, "the Milton line never typed (%r)" % L)
    r.expect(0 <= took <= 3.5, "the Milton line takes %.1f s to type (6.1 s at the old pace, 2.4 s at the quick one)" % took)


@check("page93-skip-this-game-only", "2026-11-19 note 6 and 2026-11-20 (Sam: the page 93 skip showed on the first night after a hard refresh; \"It should only give that option if you have already played a night and got it\"): the skip shows only on a later night of the same game")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    SHOWN = "() => { var e = [].filter.call(document.querySelectorAll('.dss-skip93'), function (x) { return !x.closest('.dss-ghost'); }).pop(); return e ? [!e.hidden, e.textContent.trim()] : null; }"
    seen = []
    for label, run, was, wasN, nowN, want in [("an earlier game", "7", "3", "4", "9", False),
                                                ("this game, the same night", "7", "7", "9", "9", False),
                                                ("this game, an earlier night", "7", "7", "8", "9", True),
                                                ("from before the night was kept", "7", "7", "", "9", False)]:
        r.go("O'Flatterly's quest", wait=1500)
        r.js("(a) => { localStorage.setItem('dssPage93Done', '1'); localStorage.setItem('dssRunFirst', a[0]); localStorage.setItem('dssPage93Run', a[1]); localStorage.setItem('dssPage93Night', a[2]); localStorage.setItem('dssNightNo', a[3]); }", [run, was, wasN, nowN])
        r.go("O'Flatterly's quest", wait=6000)
        got = r.js(SHOWN)
        seen.append((label, got))
        r.expect(got is not None and got[0] == want, "page 93 handed back in %s: the skip is %s (%r)" % (label, "hidden" if want else "offered", got))
        if want and got:
            r.expect("found on an earlier night" in got[1], "the skip reads %r" % got[1])
    r.info = repr(seen)


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


@check("benito-nail-pull", "2026-11-19 note 5 (Sam): pulling BENITO's nail had no visuals; his fingertip is drawn in gold hairline and the splint tugs free, the split glazes red, then the page turns")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    for w, h in ((1440, 900), (1280, 800)):
        r.page.set_viewport_size({"width": w, "height": h})
        r.go("BENITO\u2019s nail", wait=7000)
        r.clear_lore(); r.clear_slips()
        r.page.wait_for_timeout(800)
        over = r.js("() => document.scrollingElement.scrollHeight - innerHeight")
        fig = r.js("() => { var s = [].filter.call(document.querySelectorAll('#bn-svg'), function (e) { return !e.closest('.dss-ghost'); })[0]; if (!s) return null; var b = s.getBoundingClientRect(); return { w: Math.round(b.width), top: Math.round(b.top), bottom: Math.round(b.bottom) }; }")
        r.info = repr((w, over, fig))
        r.expect(fig and fig["w"] >= 200 and fig["top"] >= 0 and fig["bottom"] <= h, "BENITO's fingertip is missing or off screen at %dx%d (%r)" % (w, h, fig))
        r.expect(over <= 0, "BENITO's nail page scrolls %d px at %dx%d" % (over, w, h))
    r.page.set_viewport_size({"width": 1440, "height": 900})
    r.page.locator("tw-link", has_text="Pull the nail.").first.click()
    r.page.wait_for_timeout(700)
    mid = r.js("() => { var s = document.querySelector('#bn-splint'); var b = document.querySelector('#bn-blood'); return { tf: s ? getComputedStyle(s).transform : '', blood: b ? +getComputedStyle(b).opacity : -1, text: document.body.innerText.indexOf('Give me that napkin') >= 0 }; }")
    r.expect(mid["tf"] not in ("", "none") and not mid["text"], "the splint does not move before the page turns (%r)" % mid)
    r.page.wait_for_timeout(700)
    blood = r.js("() => { var b = document.querySelector('#bn-blood'); return b ? +getComputedStyle(b).opacity : -1; }")
    r.expect(blood > 0.3, "the split does not glaze red during the pull (opacity %r)" % blood)
    r.wait_for("() => document.body.innerText.indexOf('Give me that napkin') >= 0", ms=6000, what="BENITO's drawing after the pull")


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
    if SWAPS: scratch_passage(r, "T-plant", "x")
    r.go("Dean Street", wait=6000)
    r.js("() => { var l = [].filter.call(document.querySelectorAll('.soho-hub-dock tw-link'), function (e) { return !e.closest('.dss-ghost'); })[0]; l.click(); }")
    r.page.wait_for_timeout(3500)
    # 2026-11-14: measured on every frame, in the page. Polling every 300 ms from here caught the too-tall street about one run in four
    # (the lamp stood 870 px tall between its two sizing passes, a frame or three at a time), which made this check a coin toss
    r.js("""() => { window.__tall = 0; window.__frames = 0; var t0 = performance.now(); (function loop() {
        var lamp = [].filter.call(document.querySelectorAll('#dean-lamp-svg'), function (e) { return !e.closest('.dss-ghost'); })[0];
        if (lamp) { window.__frames++; window.__tall = Math.max(window.__tall, document.scrollingElement.scrollHeight); }
        if (performance.now() - t0 < 5600) requestAnimationFrame(loop); })();
      var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return !e.closest('.dss-ghost') && /Back to Dean/.test(e.textContent); })[0]; l.click(); }""")
    r.page.wait_for_timeout(6000)
    r.expect(r.pn() == "Dean Street", "the way back led to %s" % r.pn())
    worst = r.js("() => window.__tall")
    r.expect(r.js("() => window.__frames") > 60, "the street was only measured on %d frames" % r.js("() => window.__frames"))
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


@check("slip-waits-under-modal", "2026-11-19 (night-two walk: THE GREAT HAM's slip wrote itself out unseen near Cecil Court, seen once): a slip that falls due under a top-layer card (showModal, as the photo viewer and the jukebox) waits, and writes itself out once the card closes")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Dean Street", wait=5000)
    r.clear_slips()
    # the card opens the moment the slip lands, before it writes itself out (the queue already holds a slip while a modal is open)
    r.js("""() => { var mo = new MutationObserver(function () { var s = [].filter.call(document.querySelectorAll('.dss-hint-slip'), function (e) { return !e.classList.contains('typed'); })[0]; if (!s) return; mo.disconnect();
      var d = document.createElement('dialog'); d.id = 'reg-modal'; d.style.cssText = 'width:100vw;height:100vh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:rgba(0,0,0,0.7)'; document.body.appendChild(d); d.showModal(); });
      mo.observe(document.body, { childList: true, subtree: true }); window.dssInlineHint('REGRESSION a slip raised under a modal card', { now: true }); }""")
    r.page.wait_for_timeout(3000)
    early = r.js("() => [].some.call(document.querySelectorAll('.dss-hint-slip.typed'), function (e) { return e.textContent.indexOf('under a modal card') >= 0; })")
    r.js("() => { var d = document.getElementById('reg-modal'); d.close(); d.remove(); }")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-slip.typed'), function (e) { return e.textContent.indexOf('under a modal card') >= 0; })", 6000, "the slip to write itself out once the card closed")
    r.info = "typed under the modal: %s" % early
    r.expect(not early, "the slip wrote itself out under a modal card")


@check("jeffrey-speech-in-scene","2026-11-09 note 2: JEFFREY's Friesian speech came up in the card on the right, unlike everyone else")
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


DOG_SEEN = """() => { var T = window.THREE, R = window.__dssRooms.cu, d = window._dssCellarDog, a = R.spot('ASHTON GRANGER');
  R.scene.updateMatrixWorld(true); var box = new T.Box3().setFromObject(d), c = new T.Vector3(); box.getCenter(c);
  var cam = new T.Vector3(); R.camera.getWorldPosition(cam);
  var vis = []; R.scene.traverse(function (m) { if (!m.isMesh) return; var q = m; while (q && q.visible) q = q.parent; if (q) return;
    var mt = Array.isArray(m.material) ? m.material[0] : m.material; if (!mt || mt.visible === false || mt.colorWrite === false || mt.transparent || mt.depthWrite === false || mt.blending === T.AdditiveBlending) return; vis.push(m); });
  var pts = [c]; for (var q = 0; q < 8; q++) pts.push(new T.Vector3(q & 1 ? 0.75 : 0.25, q & 2 ? 0.75 : 0.25, q & 4 ? 0.75 : 0.25).multiply(new T.Vector3().subVectors(box.max, box.min)).add(box.min));
  var seen = 0, onScreen = 0;
  pts.forEach(function (pt) { var s = pt.clone().project(R.camera); if (Math.abs(s.x) < 1 && Math.abs(s.y) < 1 && s.z < 1) onScreen++;
    var dir = pt.clone().sub(cam), L = dir.length(); dir.normalize(); var h = new T.Raycaster(cam, dir, 0, L).intersectObjects(vis, false), own = false;
    if (h.length) for (var w = h[0].object; w; w = w.parent) if (w === d) own = true;
    if (!h.length || own || h[0].distance > L - 0.05) seen++; });
  var cv = R.wrap.querySelector('canvas').getBoundingClientRect(), s0 = c.clone().project(R.camera);
  var card = [].filter.call(document.querySelectorAll('.dss-room-card'), function (e) { return e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.1; })[0], cr = card ? card.getBoundingClientRect() : null;
  var px = cv.left + (s0.x + 1) / 2 * cv.width, py = cv.top + (1 - s0.y) / 2 * cv.height;
  return { min: box.min.toArray(), max: box.max.toArray(), c: c.toArray(), ashton: a ? a.tgt : null, seen: seen, onScreen: onScreen, at: [Math.round(px), Math.round(py)],
    underCard: !!cr && px > cr.left && px < cr.right && py > cr.top && py < cr.bottom, names: R.names() }; }"""


@check("cellar-dog-by-ashton", "2026-11-18 (Sam: \"can you add that dog by Ashton granger's feet?\", then \"not totally by the feet, a little in the centre too\", then \"can you put it [the rug] under the dog\"): his dog lies on his prayer rug on the cellar floor beside ASHTON's chair, on the room's side of it, in view from the room and from her close-up")
def cellar_dog_by_ashton(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Turn to Copper"); r.room_ready("cu")
    r.wait_for("() => { var d = window._dssCellarDog, n = 0; if (d) d.traverse(function (m) { if (m.isMesh) n++; }); return n >= 5; }", 15000, "the dog's model (models/dog.bin) to load into the cellar")
    g = r.js(DOG_SEEN)
    r.expect(g["ashton"], "no ASHTON GRANGER in the cellar to lie beside")
    ax, az = g["ashton"][0], g["ashton"][2]
    r.expect(-0.03 < g["min"][1] < 0.05 and g["max"][1] < 0.7, "the dog is not lying on the floor (it runs from %.2f to %.2f m up)" % (g["min"][1], g["max"][1]))
    dlen = max(g["max"][0] - g["min"][0], g["max"][2] - g["min"][2])
    r.expect(dlen < 1.06, "the dog's box is %.2f m along the floor; Sam had it made smaller on 19 Nov (\"a bit smaller and a bit fluffier\"): 1.13 m before, 1.00 m after, fur and all" % dlen)
    gap = math.hypot(max(g["min"][0] - ax, 0, ax - g["max"][0]), max(g["min"][2] - az, 0, az - g["max"][2]))
    r.expect(gap < 0.6, "the dog is %.2f m from ASHTON's chair, not by her feet" % gap)
    r.expect(ax < g["c"][0] and abs(g["c"][0]) < abs(ax) + 0.05, "the dog is not on the room's side of her chair (its middle is at x %.2f, her chair at %.2f, the room's middle at 0)" % (g["c"][0], ax))
    r.expect(g["onScreen"] >= 7 and g["seen"] >= 5, "the dog is not in view from the room (%d of 9 points on screen, %d not hidden)" % (g["onScreen"], g["seen"]))
    r.expect("A dog" in g["names"], "the dog is not a thing to click (Sam, 19 Nov: \"can she have a clickable PRIME voice that says 'Look in thy heart, and write.'\"); names: %r" % g["names"])
    # 2026-11-18 (Sam: "can you put it under the dog"): his prayer rug lies flat on the floor, under the middle of the dog
    rug = r.js("() => { var T = window.THREE, g = window._dssCellarRug, m = null; if (!g) return null; g.traverse(function (o) { if (o.isMesh) m = o; }); if (!m || !m.material.map || !m.material.map.image) return { loaded: false }; var b = new T.Box3().setFromObject(g); return { loaded: true, min: b.min.toArray(), max: b.max.toArray() }; }")
    r.expect(rug and rug["loaded"], "the prayer rug (models/prayer-rug.jpg) is not in the cellar")
    r.expect(rug["max"][1] < 0.02 and rug["min"][0] < g["c"][0] < rug["max"][0] and rug["min"][2] < g["c"][2] < rug["max"][2], "the prayer rug is not under the dog (rug x %.2f..%.2f, z %.2f..%.2f; the dog's middle %.2f, %.2f)" % (rug["min"][0], rug["max"][0], rug["min"][2], rug["max"][2], g["c"][0], g["c"][2]))
    r.click_object("cu", "ASHTON GRANGER"); r.page.wait_for_timeout(3200)
    c = r.js(DOG_SEEN)
    r.expect(c["onScreen"] >= 5 and c["seen"] >= 5, "the dog is not in view from ASHTON's close-up (%d of 9 points on screen, %d not hidden)" % (c["onScreen"], c["seen"]))
    r.expect(not c["underCard"], "in ASHTON's close-up the dog lies under her card (its middle at %r)" % c["at"])
    r.back_click("cu"); r.page.wait_for_timeout(2500)
    r.click_object("cu", "A dog")
    LINE = "() => [].some.call(document.querySelectorAll('.dss-voice-text'), function (e) { if (!/Look in thy heart, and write/.test(e.textContent) || !e.getClientRects().length) return false; var op = 1; for (var p = e; p && p.nodeType === 1; p = p.parentElement) op *= +getComputedStyle(p).opacity; return op > 0.5; })"   # the voices' box sits beside the card; shown, not just there
    SLIP = "() => [].some.call(document.querySelectorAll('.dss-hint-slip.dss-hint-voices.typed'), function (e) { return getComputedStyle(e).visibility !== 'hidden' && e.getClientRects().length; })"
    r.wait_for("() => (%s)() || (%s)()" % (LINE, SLIP), 30000, "THE PRIME's line, or the VOICES slip that teaches the first voice of a night")
    if not r.js(LINE):   # a fresh night: the dog is the first voice heard, so the VOICES slip teaches the voices on this look; her line is there on the next
        r.back_click("cu"); r.wait_for("() => window.__dssRooms.cu.mode() === 'idle'", 8000, "the camera back from the dog")
        r.clear_lore(); r.clear_slips(); r.clear_lore()
        r.click_object("cu", "A dog")
    r.wait_for(LINE, 12000, "THE PRIME's line in the dog's voice box")
    d = r.js(DOG_SEEN)
    r.expect(d["onScreen"] >= 7 and d["seen"] >= 5 and not d["underCard"], "the dog is not clear in her own close-up (%d of 9 on screen, %d not hidden, under the card: %r)" % (d["onScreen"], d["seen"], d["underCard"]))
    r.info = "%.2f m from her chair, middle at x %.2f (chair %.2f); room view %d/9 in view, her close-up %d/9, her own close-up %d/9 with THE PRIME's line" % (gap, g["c"][0], ax, g["seen"], c["seen"], d["seen"])


@check("rules-card-holds-keys", "2026-11-16 playtest (Broken 1): with a rules card up, a click off it and an arrow or Space started the Pyramid Run, the Climb or the Reclamation unseen under the card")
def _(r):
    for pas, cov in (("Pyramid Run", "pr-cover"), ("The Climb", "hc-cover"), ("The Reclamation", "rc-cover")):
        r.go(pas, wait=8000)
        r.expect(r.js("() => !!document.getElementById('dss-rules-overlay')"), "%s: no rules card came up" % pas)
        r.page.mouse.click(30, 450); r.page.wait_for_timeout(300)
        for k in ("ArrowRight", "Space", "ArrowUp"):
            r.page.keyboard.down(k); r.page.wait_for_timeout(400); r.page.keyboard.up(k)
        r.page.wait_for_timeout(1200)
        st = "() => { var c = document.getElementById('%s'); return c ? !c.hidden && getComputedStyle(c).display !== 'none' : false; }" % cov
        r.expect(r.js(st), "%s: the game started under its rules card" % pas)
        r.js("() => { var b = document.querySelector('.dss-rules-play'); if (b) b.click(); }"); r.page.wait_for_timeout(1500)
        r.expect(not r.js(st), "%s: Play did not start the game" % pas)
    r.info = "keys held off all three games until Play"


TURN_TRACE = """() => { var log = window.__turn = { t0: performance.now(), rows: [] };
  function tick() { var tp = document.querySelector('tw-story > tw-passage'), se = document.scrollingElement;
    var c = [].filter.call(document.querySelectorAll('tw-story > tw-passage canvas'), function (c) { var b = c.getBoundingClientRect(); return b.height > 150 && b.width > 150; })[0];
    log.rows.push([Math.round(performance.now() - log.t0), se.scrollHeight - innerHeight, tp ? +(+getComputedStyle(tp).opacity).toFixed(2) : 0, c ? Math.round(c.getBoundingClientRect().width) : 0, ((document.getElementById('dss-pn') || {}).textContent || '').trim()]);
    if (performance.now() - log.t0 < 5000) requestAnimationFrame(tick); }
  requestAnimationFrame(tick); }"""


@check("game-pages-fit-from-the-turn", "2026-11-18 leftovers (the 15-16 Nov playtest: 'Pyramid Run under the rules card overflows ~2.7 s at load before the fitter settles it'): the page fitter waited 1.6 s after a page turn, so the Pyramid Run, the Climb and the Reclamation faded in 200 to 400 px past the window and, at 1280x800, jumped a size smaller about 2 s later")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    bad, notes = [], []
    for W, H in ((1440, 900), (1280, 800)):
        r.page.set_viewport_size({"width": W, "height": H})
        for frm, link, game in (("Descending Corridor", "Into the dark", "Pyramid Run"), ("The Mountain", "Follow him", "The Climb"), ("Among the Moai", "Fight", "The Reclamation")):
            r.go(frm, wait=6000, extra="&dev=0")   # as a player has it: the testing links add a row to these pages
            r.clear_lore(); r.clear_slips()
            ok = r.js("([t]) => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return e.textContent.indexOf(t) >= 0 && !e.closest('.dss-ghost'); })[0]; window.__l = l; return !!l; }", [link])
            r.expect(ok, "no %r on %s" % (link, frm))
            r.js(TURN_TRACE); r.js("() => window.__l.click()")   # a real page turn, traced every frame for 5 s
            r.page.wait_for_timeout(5400)
            rows = [x for x in r.js("() => window.__turn.rows") if x[4] == game]
            r.expect(len(rows) > 30, "%r on %s did not reach %s" % (link, frm, game))
            seen = [x for x in rows if x[2] >= 0.3]   # from the moment the new page can be seen
            over = max(x[1] for x in seen); wide = [x[3] for x in seen if x[3]]
            if over > 0:
                bad.append("%s at %dx%d runs %d px past the window while it fades in (until %d ms after the press)" % (game, W, H, over, max(x[0] for x in seen if x[1] > 0)))
            if wide and max(wide) - min(wide) > 2:
                bad.append("%s at %dx%d changes size on show, %d to %d px wide" % (game, W, H, max(wide), min(wide)))
            notes.append("%s %dx%d: %d px wide" % (game, W, H, wide[-1] if wide else 0))
    r.info = "; ".join(notes)
    r.expect(not bad, "; ".join(bad))


@check("fight-end-card-fits", "2026-11-17 leftovers: the cellar fight's TRY AGAIN / MOVE ON and GET OUT ran 33 to 154 px under the fold, because the page fitter counted every look as a try and stopped for good about ten seconds into any page")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    bad = []
    for W, H in ((1440, 900), (1280, 800)):
        r.page.set_viewport_size({"width": W, "height": H})
        r.go("Fight starts", wait=6000)
        r.js("() => { var b = document.querySelector('.dss-rules-play'); if (b) b.click(); }")
        r.page.wait_for_timeout(16000)   # well past the old fitter's last look
        r.js("() => { document.getElementById('fight-end').innerHTML = '<span>🤜 STANDING 🤜</span><br><button class=\"fight-continue-btn\">Get out</button>'; }")
        over = 1
        for _i in range(40):   # the fitter takes a step or two; the fight's own lines come and go meanwhile
            r.page.wait_for_timeout(200)
            over = r.js("() => document.scrollingElement.scrollHeight - innerHeight")
            if over <= 0: break
        if over > 0: bad.append("%dx%d: the end card leaves the page %d px past the window" % (W, H, over))
    r.expect(not bad, "; ".join(bad))


@check("bar-timers-after-leaving", "2026-11-17 leftovers: a night-two walk logged \"Cannot set properties of null (setting 'textContent')\": the bar game's pour and carry timers wrote to its scoreboard after the page was left")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Ronnie’s Drinks", wait=8000)
    r.wait_for("() => !!window.currentBarGame || [].some.call(document.querySelectorAll('tw-link, button'), function (e) { return /Go to the bar|START|Play/i.test(e.textContent) && e.getClientRects().length; })", 15000, "the bar game or its way in")
    for _i in range(4):
        if r.js("() => !!(window.currentBarGame && window.currentBarGame.canvas && window.currentBarGame.canvas.isConnected)"): break
        r.js("() => { var b = document.getElementById('bar-start-btn'); if (b && b.getClientRects().length) { b.click(); return; } var l = [].filter.call(document.querySelectorAll('tw-link, button'), function (e) { return /Go to the bar|START/i.test(e.textContent) && e.getClientRects().length; })[0]; if (l) l.click(); }")
        r.page.wait_for_timeout(2500)
    r.expect(r.js("() => !!(window.currentBarGame && window.currentBarGame.canvas && window.currentBarGame.canvas.isConnected)"), "the bar game did not start")
    r.js("() => { window.__dssOldBar = window.currentBarGame; var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return /out onto the street/i.test(e.textContent); })[0]; if (l) l.click(); }")
    r.wait_for("() => !document.getElementById('bar-canvas')", 8000, "leaving Ronnie's Drinks")
    r.js("() => { var g = window.__dssOldBar; setTimeout(function () { g._startCarryTransition(); }, 0); setTimeout(function () { g._resultCarry(); }, 50); }")
    r.page.wait_for_timeout(2500)
    r.info = "the pour and carry steps ran after leaving, quietly"


@check("pyramid-hud-two-lines", "2026-11-16 leftovers: at 1280x800 a hazard hint took the Pyramid Run's status strip to a second line, the page ran 12 px past the window and the fitter shrank the game a step mid-run")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.page.set_viewport_size({"width": 1280, "height": 800})
    r.go("Pyramid Run", wait=6000)
    r.js("() => { var b = document.querySelector('.dss-rules-play'); if (b) b.click(); }"); r.page.wait_for_timeout(4000)
    r.js("() => { var b = document.getElementById('pr-pause'); if (b) b.click(); }"); r.page.wait_for_timeout(500)
    M = "() => { var h = document.getElementById('pyr-run-hud'), f = document.querySelector('.pr-frame'); return [h.offsetHeight, Math.round(f.getBoundingClientRect().width), document.scrollingElement.scrollHeight - innerHeight]; }"
    a = r.js(M)
    r.expect(a[2] <= 0, "the page scrolls %d px before any hint" % a[2])
    r.js("() => { document.getElementById('pyr-run-hud').textContent = 'SNAKE HEADS · HOLD ↑, RELEASE, JUMP AGAIN   ·   MARKS 0/7 · EACH TAKES BACK A STUMBLE   ·   STUMBLES 0/3'; }")
    r.page.wait_for_timeout(250)
    b = r.js(M)
    r.page.wait_for_timeout(2500)
    c = r.js(M)
    r.expect(b[2] <= 0, "a two-line hint pushed the page %d px past the window" % b[2])
    r.expect(b[0] <= a[0], "the strip grew from %d to %d px" % (a[0], b[0]))
    r.expect(abs(c[1] - a[1]) <= 1, "the game shrank from %d to %d px wide" % (a[1], c[1]))
    r.info = "strip %d px, game %d px wide, no scroll" % (a[0], a[1])


@check("rooms-reach-the-foot", "2026-11-16 (Sam: \"Fix the room band\"): nine of the ten rooms stopped about 100 px above the foot of a 1440x900 window and left a dark band; every room now runs to the foot and the page does not scroll")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    bad = []
    for room, passage in ROOMS + [("cx", "Approach Coppers Lair")]:   # the Copper's Lair approach shares the rooms' build (playtest 2026-11-16)
        r.go(passage)
        if room == "cx":
            r.wait_for("() => !!document.getElementById('cx-wrap')", 15000, "the Copper's Lair approach")
            r.page.wait_for_timeout(2500)
        else:
            r.room_ready(room)
        r.page.wait_for_timeout(800)
        m = r.js("([id]) => { var w = document.getElementById(id + '-wrap'); if (!w) return null; return [Math.round(w.getBoundingClientRect().bottom), window.innerHeight, document.documentElement.scrollHeight]; }", [room])
        if not m:
            bad.append("%s: no %s-wrap" % (room, room))
        elif m[0] < m[1] - 6:
            bad.append("%s ends at %d of %d" % (room, m[0], m[1]))
        elif m[2] > m[1] + 1:
            bad.append("%s scrolls (%d of %d)" % (room, m[2], m[1]))
    r.expect(not bad, "; ".join(bad))


# ---------------------------------------------------------------- the dream worlds
# Each world from its preview start (?start=<world>), walked like a curious player: on every page press the first
# way on not yet taken, up to 30 pages or back to Dean Street. On every page: no errors (the watchers), any 3D view
# is not blank, and the page fits a 1440x900 laptop screen without scrolling.
WORLD_ENDS = {"Night Ahead Part Two": 1, "The Fetch": 1, "Black page": 1, "White page": 1}   # 2026-11-15: the two last pages of the game have no way on by design; a walk that goes on past the Fetch ends there
WORLDS = ["himalayas", "nazca", "easter", "pyramid", "ezekiel"]
# 2026-11-18: pages that go on by themselves, with nothing to press (the Dawn Approach is a view held for 16 s, then the last page comes). The walker
# gave every page 8 s to show a way on, which with its other waits came to about 16 s: a full run on 16 Nov lost that race once on Dawn Approach Black
# and called the page a dead end. These are waited on for up to 40 s (in 2 s looks) before the walk says it has stopped.
WORLD_SLOW = {"Dawn Approach Black": 20, "Dawn Approach White": 20}

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
            # 2026-11-15: a way on that fades in slowly (Centre Point's CLIMB IT is not a fifth visible until about 5 s in, and whole by 9) was
            # sampled a moment too early and read as a dead end; look again for up to 8 s before saying the walk has stopped
            waited = 0
            while not fresh and waited < WORLD_SLOW.get(pn, 4) and r.pn() == pn and not r.js("() => /hold to hum|held down/i.test(document.body.innerText)"):
                r.page.wait_for_timeout(2000); waited += 1
                opts = r.js(CLICKABLES)
                fresh = [o for o in opts if (pn, o["t"]) not in taken]
            if r.pn() != pn:
                continue
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


@check("loading-pink", "2026-11-14 note 6 (Sam: \"'Loading' used to be pink, now it is not, turn it pink again\"; it was greyed on 2026-11-11, note 7): the loading line, its bar and the 3D rooms' own 'loading' are pink")
def _(r):
    r.go("The French", wait=3000)
    cols = r.js("""() => { var made = null, line = document.getElementById('dss-load-line'); if (!line) { line = made = document.createElement('div'); line.id = 'dss-load-line'; line.innerHTML = '<div class="dss-load-text">loading</div><div class="dss-load-bar"><i></i></div>'; document.body.appendChild(line); }
      var t = getComputedStyle(line.querySelector('.dss-load-text')).color, b = getComputedStyle(line.querySelector('.dss-load-bar i')).backgroundColor; if (made) made.remove(); return [t, b]; }""")
    r.info = "text %s, bar %s" % tuple(cols)
    for c in cols:
        m = [float(x) for x in re.findall(r"[\d.]+", c)[:3]]
        r.expect(m[0] > m[1] + 50 and m[2] > m[1] + 50, "the loading line is not pink (%s)" % c)
    html = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read()
    for a, b in SWAPS: html = html.replace(a, b)
    room = re.search(r"content: (?:&#39;|')loading(?:&#39;|');[^}]*?color: (#[0-9a-fA-F]{6})", html)
    r.expect(room is not None and room.group(1).lower() == "#ff3aa8", "the 3D rooms' own 'loading' is not pink (%s)" % (room.group(1) if room else "not found"))


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


@check("great-work-card", "2026-11-11 note 7 and 2026-11-18 note 22 (Sam, The Empty Glass: the Great Work \"should be [a] popup modal\", not slips): the night's first haunt brings THE GREAT WORK as one modal card with the wheel, each new game")
def _(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
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
    r.expect(not got["slip"], "THE GREAT WORK came on the paper slips again (the 11 Nov way, reversed 18 Nov)")
    r.expect(got["card"], "THE GREAT WORK never opened as its card after the first haunt (on %s)" % got["pn"])
    m = r.js("() => { var o = document.querySelector('#dss-lore-overlay.dss-gw-card'); return { wheel: !!o.querySelector('.dss-gw-fig .nb-wheel-svg'), on: !!o.querySelector('.dss-lore-on'), words: (o.querySelector('.editors-note') || {}).textContent.length || 0 }; }")
    r.info += "; %s" % m
    r.expect(m["wheel"] and m["on"] and m["words"] > 200, "the Great Work card is missing its wheel, its Go on or its words: %s" % m)


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
    r.page.wait_for_timeout(950)
    r.expect(r.js("() => window.dssLastShanty || 0"), "the shanty had not started 2.45 s into the Pillars approach (2026-11-14 note 11: \"a tiny bit sooner\", 2.0 s in; it was 2.6)")
    r.expect(not early, "the shanty started within 1.5 s (2026-11-13 note 2: \"happen too quickly\")")
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


@check("ginger-french-spaced", "2026-11-13 note 26 (Sam): space the French and the Ginger Light out a little more on Dean Street; then 2026-11-14 note 2: \"Move the ginger light back down one square\": five tiles apart, its lamp on the same tile as its door")
def _(r):
    hub_ready(r)
    d = r.js("() => { var m = window.dssSohoMap, o = {}; m.doors.forEach(function (x) { if (x.id === 'french' || x.id === 'ginger') o[x.id] = [x.c, x.r, x.fc, x.fr]; }); return o; }")
    gap = d["french"][3] - d["ginger"][3]
    r.expect(gap == 5, "the Ginger Light and the French are %d tiles apart on Dean Street, want 5 (four before the 13th, six until the 14th): %s" % (gap, d))
    lamp = r.js("() => (window.dssSohoMap.lamps || []).filter(function (l) { return l.ginger; }).map(function (l) { return [l.c, l.r]; })[0] || null")
    if lamp is not None: r.expect(lamp == [d["ginger"][0], d["ginger"][1]], "the Ginger Light's lamp (%r) is not on its door's tile (%r)" % (lamp, d["ginger"][:2]))
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
    r.wait_for("() => !!window.__dssGreatWorkCard", 8000, "THE GREAT WORK card (the night's first haunt)")
    r.page.wait_for_timeout(1500); r.clear_lore(); r.clear_slips(rounds=10)   # 2026-11-18: the card, not slips (note 22); the held choice goes once it is read
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


@check("polaroid-close", "2026-11-08 note 20: the stairs' polaroid has a cross on its corner and a line saying how to put it away; 2026-11-14 note 17: the first press pockets it and it stays up to read, the second puts it away")
def _(r):
    r.go("The Interval: the stairs", wait=5000)
    r.clear_slips()
    r.page.locator(".dss-room-veil tw-link, tw-passage tw-link", has_text="Turn and follow her").first.click()
    r.wait_for("() => !!document.querySelector('#dss-photo-pop.in')", 8000, "the polaroid screen")
    box = r.js("""() => { var f = document.querySelector('.dss-photo-pop-frame'), x = document.querySelector('.dss-photo-pop-frame .dss-photo-pop-x'), h = document.querySelector('.dss-photo-pop-hint');
      if (!f || !x || !h) return null; var a = f.getBoundingClientRect(), b = x.getBoundingClientRect(); return { near: Math.abs(b.right - a.right) < 30 && Math.abs(b.top - a.top) < 30, hint: h.textContent, vis: getComputedStyle(h).visibility }; }""")
    r.expect(box, "the polaroid screen has no frame, cross or hint")
    r.expect(box["near"], "the cross is not on the polaroid's corner")
    r.expect(box["hint"] == "Pocket the polaroid", "the line under the polaroid reads %r" % box["hint"])
    # 2026-11-14 note 17 (Sam: "'Pocket the polaroid' shouldn't close it immediately, that should need a second click so you can still read it")
    r.page.wait_for_timeout(800)
    r.page.mouse.click(60, 840)
    r.page.wait_for_timeout(900)
    st = r.js("() => { var o = document.querySelector('#dss-photo-pop'), h = document.querySelector('.dss-photo-pop-hint'); return o ? [o.classList.contains('pocketed'), o.classList.contains('out'), h ? h.textContent : ''] : null; }")
    r.expect(st is not None and not st[1], "the first press put the polaroid away at once")
    r.expect(st[0] and "pocket" in st[2].lower() and st[2] != "Pocket the polaroid", "the first press did not pocket it and say so (%r)" % (st,))
    r.page.mouse.click(60, 840)
    r.wait_for("() => !document.querySelector('#dss-photo-pop')", 3000, "the second press to put the polaroid away")


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
    r.expect(r.js("() => getComputedStyle(document.querySelector('.dss-pocket-badge')).animationName").find("dssAmberPaneBreath") >= 0, "the badge has lost its glow (since 2026-11-14 the amber pane's breath)")
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


@check("shelley-bust", "2026-11-14 (Sam: \"I want you to be able to move around it and admire the whole\", \"I want it on its own plinth in the shop\"): the scanned bust of SHELLEY stands on its plinth in O'FLATTERLY's shop, loads, opens its close-up, turns under a drag without stepping back, and swings home afterwards")
def shelley_bust(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("O'Flatterly's shop")
    r.room_ready("oi"); r.clear_slips(); r.clear_lore()
    ROT = "() => { var g = null; window.__dssRooms['oi'].scene.traverse(function (o) { if (o.name === 'shelley-bust') g = o.parent; }); return g ? [g.rotation.y, g.children.length, g.children.filter(function (c) { return c.material && c.material.map && c.material.map.image && c.material.map.image.width > 0; }).length] : null; }"
    r.wait_for(ROT.replace("return g ? [", "return !!g && !![").replace("] : null; }", "][2]; }"), 15000, "the bust's model and pictures")
    got = r.js(ROT)
    r.expect(got and got[2] >= 3, "the bust did not load its three parts with their pictures (%r)" % (got,))
    home = got[0]
    # 2026-11-14 (Sam: "make the halo/sprite under the bust brighter so it matches the others"): its resting glow is as strong as the brightest in the room
    # the glows are made in HOTSPOTS order (one sprite and one core each), the same order as names(); the bust is found by its name, not a fixed place (2026-11-19: the shop went from ten objects to six)
    spots = r.js("() => window.__dssRooms['oi'].names()")
    bi = spots.index("A bust of Percy Bysshe Shelley") if "A bust of Percy Bysshe Shelley" in spots else -1
    r.expect(bi >= 0, "the bust is not among the shop's objects (%r)" % (spots,))
    GL = "([n]) => { var g = null; window.__dssRooms['oi'].scene.traverse(function (o) { if (o.name === 'restGlow') g = o; }); var out = []; for (var i = 0; i < n; i++) { var c = g.children[i * 2]; out.push(c && c.visible ? c.material.opacity : 0); } return out; }"
    peak = [0.0] * len(spots)
    for _ in range(14):
        cur = r.js(GL, [len(spots)]); peak = [max(a_, b_) for a_, b_ in zip(peak, cur)]; r.page.wait_for_timeout(250)
    others = max([x for i_, x in enumerate(peak) if i_ != bi] or [0])
    r.expect(peak[bi] > 0 and peak[bi] >= others * 0.55,   # the glows breathe out of step (down to 0.68 of full); a used-up one sits at 0.38
              "the bust's resting glow is dimmer than the room's others (%.2f against %.2f; all %r)" % (peak[bi], others, [round(x, 2) for x in peak]))
    r.page.screenshot(path=os.path.join(SHOTS, "shelley-bust-room.png"))
    r.click_object("oi", "A bust of Percy Bysshe Shelley")
    r.page.screenshot(path=os.path.join(SHOTS, "shelley-bust-close.png"))
    card = r.js("() => (document.querySelector('.dss-room-card') || {}).innerText || ''")
    r.expect("A BUST OF PERCY BYSSHE SHELLEY" in card.upper() and "Drag to turn and admire it." in card, "the bust's card does not carry Sam's label and line (%r)" % card[:120])
    # 2026-11-14 (Sam: "I want that audio to loop when you click and examine the statue"): his recording plays while the bust is examined, and stops on stepping back
    r.expect("shelley-bust-loop.m4a" in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read(), "the bust's recording is not linked in the html")
    r.wait_for("() => window.dssAudio.bedPlaying('shelley-bust')", 6000, "the bust's recording to start in its close-up")
    # 2026-11-14 (Sam: "bring the background sound bed right down to a minimum while the bust music runs"): the shop's own beds drop to a twentieth while it plays, and come back
    low = r.js("() => [window.dssAudio.bedLevel('bookshop'), window.dssAudio.bedLevel('soho-wall')]")
    r.expect(low[0] < 0.02 and low[1] < 0.02, "the shop's beds are not turned down while the bust's recording plays (%r)" % (low,))
    pt = [720, 380]   # the middle of the view, clear of the card (the object's own point is its halo, now down on the plinth and under the card in the close-up)
    r.page.mouse.move(pt[0] - 120, pt[1]); r.page.mouse.down()
    for i in range(1, 13):
        r.page.mouse.move(pt[0] - 120 + i * 20, pt[1]); r.page.wait_for_timeout(30)
    # 2026-11-14 (Sam: "when you turn it it produces a little blue smoke as if there is friction")
    SMOKE = "() => { var n = 0; window.__dssRooms['oi'].scene.traverse(function (o) { if (o.name === 'shelley-smoke' && o.visible && o.material.opacity > 0.01) n++; }); return n; }"
    r.expect(r.js(SMOKE) == 0 or True, ""); smoke = r.js(SMOKE)
    r.page.screenshot(path=os.path.join(SHOTS, "shelley-bust-smoke.png"))
    r.expect(smoke >= 3, "turning the bust raised no blue smoke at its foot (%d wisps)" % smoke)
    r.page.mouse.up(); r.page.wait_for_timeout(900)
    turned = r.js(ROT)[0]
    r.expect(abs(turned - home) > 1.5, "a drag across the close-up did not turn the bust (%.2f to %.2f)" % (home, turned))
    r.expect(r.js("([r]) => window.__dssRooms[r].mode()", ["oi"]) == "inspect", "the drag stepped back out of the bust's close-up")
    r.page.screenshot(path=os.path.join(SHOTS, "shelley-bust-turned.png"))
    r.back_click("oi"); r.page.wait_for_timeout(3500)
    r.expect(not r.js("() => window.dssAudio.bedPlaying('shelley-bust')"), "the bust's recording is still playing after stepping back")
    up = r.js("() => [window.dssAudio.bedLevel('bookshop'), window.dssAudio.bedLevel('soho-wall')]")
    r.expect(up[0] > 0.1 and up[1] > low[1] * 10, "the shop's beds did not come back after the bust's close-up (%r)" % (up,))
    r.expect(r.js(SMOKE) == 0, "blue smoke still hangs at the bust after it has come to rest")
    back = r.js(ROT)[0]
    r.expect(abs(back - home) < 0.02, "the bust did not swing home after the close-up (%.2f, home %.2f)" % (back, home))


@check("revo-shout", "2026-11-14 (Sam: \"I also just recorded audio 'Revo!' ... trigger when the naked man runs across the screen, when he is about a third of the way across\"): the runner shouts once on his run, a little over a third of the way along it, and the recording is linked")
def revo_shout(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.expect("revo-shout.m4a" in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read(), "the shout's recording is not linked in the html")
    r.go("Approach Chinese Fish and Chips", wait=3000)
    r.wait_for("() => (window.__dssRunnerDbg || []).some(function (s) { return s.r && s.r.group.visible; })", 20000, "the naked runner to come into the scene")
    early = r.js("() => window.__dssRevoShouts || 0")
    r.expect(early == 0, "he shouted before he was a third of the way across (%d)" % early)
    r.wait_for("() => (window.__dssRunnerDbg || []).some(function (s) { return s.shout; })", 12000, "his shout")
    at = r.js("() => { var s = (window.__dssRunnerDbg || []).filter(function (s) { return s.shout; })[0]; return (s.r.group.position.x + 13) / 26; }")
    r.expect(0.33 <= at <= 0.48, "he shouted %.2f of the way along his run, not a little over a third" % at)
    r.wait_for("() => (window.__dssRunnerDbg || []).some(function (s) { return s.done; })", 15000, "the end of his run")
    r.expect(r.js("() => window.__dssRevoShouts") == 1, "he shouted %r times on one run" % r.js("() => window.__dssRevoShouts"))
    r.expect(r.js("() => window.__dssRevoLast") == "two", "the chippy's long run did not play the whole recording")
    # 2026-11-14 (Sam: "Make it just one revo shout on these shorter scenes"): the barber's and Mister Jimmy's play the first shout alone
    for passage in ("The Barbershop", "Mister Jimmy\u2019s Drug Store"):
        r.go(passage, wait=3000)
        r.wait_for("() => (window.__dssRunnerDbg || []).some(function (s) { return s.shout; })", 25000, "his shout at %s" % passage)
        r.expect(r.js("() => window.__dssRevoLast") == "one", "%s: his short run played both shouts" % passage)
    r.expect("revo-shout-one.m4a" in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read(), "the one-shout recording is not linked in the html")


@check("sound-picks-2026-11-15", "2026-11-15 (Sam, yes to the sound audit's picks, and of the Green Sea piece: \"cut the first 8 seconds off ... and fade in\"): the glass smash is 5 dB down (it clipped), the Coach's floor 5 dB up, and the Green Sea music starts at the piece's 0:08 with a fade, then loops its 24 s without the fade")
def sound_picks_2026_11_15(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    import html as _h, subprocess
    here = os.path.dirname(os.path.abspath(__file__))
    t = _h.unescape(open(os.path.join(here, "Dream Street Shuffle.html"), encoding="utf-8").read())
    for a, b in SWAPS: t = t.replace(a, b)
    m = re.search(r"var wet = ac\.createGain\(\); wet\.gain\.value = ([\d.]+);\s*var dry = ac\.createGain\(\); dry\.gain\.value = ([\d.]+);", t)
    r.expect(m and float(m.group(1)) <= 0.32 and float(m.group(2)) <= 0.49, "the glass smash is back at its clipping level (wet, dry %s)" % (m.groups() if m else None,))
    g = re.search(r"function glassSmash\(\) \{.*?\n  \}\n", t, re.S)
    r.expect(g and "createWaveShaper" in g.group(0) and "ceil.connect(ac.destination)" in g.group(0) and "dry.connect(lim)" in g.group(0) and "wet.connect(lim)" in g.group(0),
             "the glass smash no longer goes through its soft ceiling (it peaked over full scale without it)")
    m = re.search(r"label: 'coach-bar',.{0,400}?\n\s*volume: ([\d.]+)", t, re.S)
    r.expect(m and float(m.group(1)) >= 0.35, "the Coach's floor is back down (volume %s)" % (m.group(1) if m else None))
    m = re.search(r"label: 'green-sea-music',.{0,300}?loopStart: ([\d.]+), loopEnd: ([\d.]+)", t)
    r.expect(m and abs(float(m.group(1)) - 24.0) < 0.05 and abs(float(m.group(2)) - 48.0) < 0.05, "the Green Sea music loops from the old points (%s)" % (m.groups() if m else None,))
    f = os.path.join(here, "green-sea-music.m4a")
    def rms(a, b):
        o = subprocess.run(["ffmpeg", "-nostats", "-v", "info", "-i", f, "-af", "atrim=%s:%s,volumedetect" % (a, b), "-f", "null", "-"], capture_output=True, text=True).stderr
        mm = re.search(r"mean_volume: (-?[\d.]+) dB", o); return float(mm.group(1)) if mm else None
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout or 0)
    r.expect(abs(dur - 48.0) < 0.2, "green-sea-music.m4a is not the 48 s two-copy file (%.2f s)" % dur)
    head, inloop = rms(0, 0.5), rms(24, 24.5)
    r.expect(head is not None and inloop is not None and head < inloop - 12, "the Green Sea music does not fade in, or its loop fades too (first 0.5 s %s dB, loop's first 0.5 s %s dB)" % (head, inloop))


@check("quiet-sounds-raised","2026-11-14 (Sam's verdicts on the sound audit page, \"too quiet\"): seven sounds sat 10 to 21 dB under the music of their own rooms: the vinyl crackle (Lackland), the chair and the glass (Ronnie's), the gust (Himalayas), the gull (Easter Island), the knock on Ronnie's empty table, the stairs at Trisha's")
def quiet_sounds_raised(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    import html as _h
    t = _h.unescape(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read())
    for a, b in SWAPS: t = t.replace(a, b)   # a planted bug is applied to the text read here
    def gain(pat):
        m = re.search(pat, t); return float(m.group(1)) if m else 0
    for what, pat, least in (("the vinyl crackle in Lackland's office", r"'venue-lackland':[^\n]*_tick\(vinylCrackle, ([\d.]+)\)", 2.5), ("the chair scrape at Ronnie's", r"'venue-ronnies':[^\n]*_tick\(chairScrape, ([\d.]+)\)", 4.0),
                             ("the glass at Ronnie's", r"'venue-ronnies':[^\n]*_tick\(glassSetDown, ([\d.]+)\)", 1.5), ("the gust in the Himalayas", r"'himalayan':[^\n]*gust\(false\); \}, ([\d.]+)\)", 1.3),
                             ("the gull on Easter Island", r"'easter':[^\n]*_tick\(gullFar, ([\d.]+)\)", 3.5), ("the knock on Ronnie's empty table", r"SPOT_BOOST = \{[^}]*'an empty table': ([\d.]+)", 1.7),
                             ("the stairs at Trisha's", r"SPOT_BOOST = \{[^}]*'stairs': ([\d.]+)", 2.0)):
        r.expect(gain(pat) >= least, "%s is back at its old level (gain %s, wanted at least %s)" % (what, gain(pat), least))
    # and the gain really is in the sound's path: a boosted sound must reach the speakers through one extra gain node
    r.go("Dean Street", wait=3000)
    res = r.js("""() => { var A = window.dssAudio; if (!A || typeof A.tick !== 'function') return 'no dssAudio.tick';
      var made = [], P = (window.AudioContext || window.webkitAudioContext).prototype, orig = P.createGain;
      P.createGain = function () { var g = orig.call(this); made.push(g); return g; };
      try { A.tick(function () { A.gullFar(); }, 5); } finally { P.createGain = orig; }
      var hit = made.filter(function (g) { return Math.abs(g.gain.value - 5) < 0.01; }).length;
      return hit === 1 ? 'ok' : 'a sound asked for at gain 5 made ' + hit + ' gain nodes at 5 (of ' + made.length + ')'; }""")
    r.expect(res == "ok", res)
    res = r.js("""() => { var A = window.dssAudio, made = [], P = (window.AudioContext || window.webkitAudioContext).prototype, orig = P.createGain;
      P.createGain = function () { var g = orig.call(this); made.push(g); return g; };
      try { A.spotSound('Stairs'); A.spotSound('A counter'); } finally { P.createGain = orig; }
      var a = made.filter(function (g) { return Math.abs(g.gain.value - 2.5) < 0.01; }).length;
      return a === 1 ? 'ok' : 'looking at the stairs made ' + a + ' gain nodes at 2.5'; }""")
    r.expect(res == "ok", res)


@check("nazca-no-steps", "2026-11-14 (Sam, sound audit: \"Why do i have steps here?\"): gravel steps played at random on every Nazca page, the race included, with nobody walking")
def nazca_no_steps(r):
    import html as _h
    t = _h.unescape(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read())
    for a, b in SWAPS: t = t.replace(a, b)   # a planted bug is applied to the text read here
    m = re.search(r"'nazca':\s*\{\s*min:[^\n]*", t)
    r.expect(m is not None, "no random-sound entry for Nazca was found in the build")
    r.expect("gravelSteps" not in m.group(0).split("/*")[0], "Nazca's random sounds include the gravel steps again")
    r.expect("gust(" in m.group(0), "Nazca's random sounds have lost the wind")
    r.go("Dean Street", wait=1500)


@check("pub-calls", "2026-11-14 (Sam: \"The rest of the sounds, non tony can just be part of the general hubbub\"): his odd shouts come now and then in a pub, never in the gents, and the recording is linked; the Tony Adams chant is gone from the coin toss (Sam, later: \"get rid of the stadium chant from the game too\")")
def pub_calls(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    html = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read()
    r.expect("pub-calls.m4a" in html, "the pub shout is not linked in the html")
    r.expect("tony-adams-chant" not in html and "tonyChant" not in html, "the Tony Adams chant is still in the game")
    r.go("Coach and Horses lock", wait=4000)
    r.js("() => { window.__dssPubCalls = 0; window.dssAudio.pubCall(); window.dssAudio.pubCall(); }")
    r.expect(r.js("() => window.__dssPubCalls") == 0, "a pub shout played in the gents")
    r.go("The French", wait=4000)
    r.js("() => { window.__dssPubCalls = 0; window.dssAudio.pubCall(); window.dssAudio.pubCall(); }")
    r.expect(r.js("() => window.__dssPubCalls") == 2, "the pub shout did not play in the French")
    r.expect("'venue-french':      { min: 50, max: 130, fn: function(){ pubCall(); } }" in html.replace("&#39;", "'"), "the French no longer schedules the shout")


@check("harp-alley-theme", "2026-11-14 (Sam: \"it's now in claudework can you add it to the alleyway behind the harp\"): his guitar and bass recording plays on the Harp alley's approach, holds through the meeting, repeats on its 32 bars, and stops on the way out")
def harp_alley_theme(r):
    import html as _h
    root = os.path.dirname(os.path.abspath(__file__))
    t = _h.unescape(open(os.path.join(root, "Dream Street Shuffle.html"), encoding="utf-8").read())
    for a, b in SWAPS: t = t.replace(a, b)   # a planted bug is applied to the text read here
    r.expect(os.path.exists(os.path.join(root, "harp-alley-theme.m4a")), "harp-alley-theme.m4a is not beside the html")
    m = re.search(r"label: 'harp-alley-theme', dataUri: 'harp-alley-theme\.m4a'[^\n]*?loopStart: ([\d.]+), loopEnd: ([\d.]+)", t)
    r.expect(m is not None, "the Harp alley's recording is not registered with its file and loop points")
    bars = float(m.group(2)) - float(m.group(1))
    r.expect(abs(bars - 32 * 4 * 60 / 130.0) < 0.002, "the recording's repeat is %.3f s long, not its 32 bars at 130 (59.077 s)" % bars)
    for name in ["Harp Alley Approach", "The Harp's Alley", "Harp Alley Ask", "Harp Alley Answer", "Harp Alley Standoff", "Harp Alley End"]:
        tag = re.search(r'<tw-passagedata[^>]*name="%s"[^>]*tags="([^"]*)"' % re.escape(name), t)
        r.expect(tag is not None and "harp-alley" in tag.group(1).split(), "%s does not carry the harp-alley tag" % name)
    PLAYING = "() => window.dssAudio.bedPlaying('harp-alley-theme')"
    # a ?start= page is the first of the load, which the passage watcher does not see; hand it the page the way the watcher does
    HAND = "() => window.dssAudio.updateAmbientBedsForPassage(document.querySelector('tw-story > tw-passage'))"
    CLICK = "(t) => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return x.textContent.indexOf(t) >= 0 && !x.closest('.dss-ghost'); })[0]; if (!l) return false; l.click(); return true; }"
    r.go("Dean Street", wait=3000)
    r.js(HAND)
    r.page.wait_for_timeout(1200)
    r.expect(not r.js(PLAYING), "the Harp alley's recording plays on Dean Street")
    r.go("Harp Alley Approach", wait=4000)
    r.js(HAND)
    r.wait_for(PLAYING, 8000, "the recording to start on the alley's approach")
    scratch_passage(r, "T-harp-theme", '(set: $shipCall to "kept")(set: $shipFate to "afloat")(set: $shipResolved to true)(go-to: "The Harp\'s Alley")')
    r.go("T-harp-theme", wait=2500)
    r.js(HAND)
    r.wait_for(PLAYING, 8000, "the recording to start in the alley")
    waits = []
    for link, page in (("Hear him out", "Harp Alley Ask"), ("Give him nothing", "Harp Alley Answer"), ("His hand is in his pocket", "Harp Alley Standoff"), ("Let it lie", "Harp Alley End")):
        # this jump skips the French, so the night's first change of MORALE falls in the alley and the MORALE and SOBRIETY slips come up here; they hold every press until read (2026-11-14 note 7), so read them as a player would
        r.clear_slips()
        t0 = time.time()
        while time.time() - t0 < 8 and r.pn() != page:
            r.expect(r.js(CLICK, link) or r.pn() == page, "no %r link on %r" % (link, r.pn()))
            r.page.wait_for_timeout(900)
        waits.append("%s %.1fs" % (page.replace("Harp Alley ", ""), time.time() - t0))
        r.expect(r.pn() == page, "pressing %r landed on %r, not %r" % (link, r.pn(), page))
        r.expect(r.js(PLAYING), "the recording stopped on %s" % page)
        r.expect(r.js("() => window.dssAudio.bedLevel('harp-alley-theme')") > 0.05, "the recording is all but silent on %s" % page)
    r.clear_slips()
    r.expect(r.js(CLICK, "Back to the street"), "no way back to the street on %r" % r.pn())
    r.page.wait_for_timeout(5000)
    r.expect(r.pn() == "Dean Street", "the way out of the alley landed on %r" % r.pn())
    r.expect(not r.js(PLAYING), "the recording is still playing on Dean Street after the alley")
    r.info = "page turns: " + ", ".join(waits)


STEP_SPY = r"""(function () { window.__spy = { real: [], synth: 0 }; var S = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (w, off, dur) { try { var d = this.buffer ? this.buffer.duration : 0;
      if (d > 6.5 && d < 7.2) window.__spy.real.push([off || 0, dur || 0]);   /* Sam's footsteps clip, 6.87 s */
      if (d > 0.040 && d < 0.050) window.__spy.synth++;                       /* a synthesised flagstone step, a 45 ms burst */
    } catch (e) {} return S.apply(this, arguments); }; })();"""


@check("harp-alley-steps", "2026-11-14 (Sam: \"there should be some clicking footsteps in the alley approach here\", then of the synthesised ones \"these footprints sound awful ... find a better sound from the real life ones I gave you\"): his own recorded footsteps fall on the Harp alley's approach, a few at a time, never the synthesised ones, and not in the meeting")
def harp_alley_steps(r):
    import html as _h
    t = _h.unescape(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read())
    for a, b in SWAPS: t = t.replace(a, b)   # a planted bug is applied to the text read here
    m = re.search(r"'harp-approach':\s*\{[^\n]*", t)
    r.expect(m is not None, "the alley's approach has no timed sound of its own")
    line = m.group(0).split("/*")[0]
    r.expect("alleySteps" in line, "the approach's timed sound is not the recorded footsteps (%s)" % line.strip()[:90])
    r.expect("flagstoneSteps" not in line, "the synthesised flagstone steps are back on the approach")
    tag = re.search(r'<tw-passagedata[^>]*name="Harp Alley Approach"[^>]*tags="([^"]*)"', t)
    r.expect(tag is not None and "harp-approach" in tag.group(1).split(), "the approach does not carry the harp-approach tag")
    r.ctx.add_init_script(STEP_SPY)
    scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Harp Alley Approach", wait=3000)
    r.wait_for("() => window.__spy.real.length >= 1", 14000, "a pass of recorded footsteps on the approach")
    r.page.wait_for_timeout(7000)
    d = r.js("() => window.__spy")
    r.info = "%d passes: %s" % (len(d["real"]), ", ".join("%.1f s from %.1f" % (x[1], x[0]) for x in d["real"]))
    r.expect(d["synth"] == 0, "%d synthesised steps played on the approach" % d["synth"])
    r.expect(all(0.8 < x[1] < 4.0 for x in d["real"]), "a pass is not a few steps long (%r)" % d["real"])
    r.page.get_by_text("INTO THE ALLEY").first.click()
    r.page.wait_for_timeout(3500)
    r.expect(r.pn() == "The Harp's Alley", "INTO THE ALLEY landed on %r" % r.pn())
    n0 = r.js("() => window.__spy.real.length")
    r.page.wait_for_timeout(11000)
    r.expect(r.js("() => window.__spy.real.length") == n0, "footsteps go on falling during the meeting")
    r.page.unroute("**/*")


AC_SPY = r"""(function () { var A = window.AudioContext; if (!A) return; window.__acs = [];
  window.AudioContext = function (o) { var c = o ? new A(o) : new A(); window.__acs.push(c); return c; }; window.AudioContext.prototype = A.prototype; })();"""


@check("approach-press-unlocks-sound", "2026-11-14 (Sam, on the Harp alley's music: \"it should play when you hit the approach not wait till after\"): the 3D approaches are full-screen frames, and a press inside one never unlocked the page's sound, so the alley opened from a link stayed silent until INTO THE ALLEY")
def approach_press_unlocks_sound(r):
    # this browser allows sound without a press, so the lock is put on by hand: the page's audio is suspended, as a browser leaves it on a cold load, and a real press on the view must bring it back
    r.ctx.add_init_script(AC_SPY)
    scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Harp Alley Approach", wait=6000)
    r.expect(r.js("() => typeof window.dssAudio.ctxState === 'function'"), "dssAudio.ctxState is gone")
    r.expect(r.js("() => { var f = document.querySelector('#ha-wrap iframe'); return !!f; }"), "the alley's approach has no frame")
    stuck = 0
    for i in range(3):
        st = r.js("async () => { var a = (window.__acs || []); for (var i = 0; i < a.length; i++) { if (a[i].state === 'running') await a[i].suspend(); } return window.dssAudio.ctxState(); }")
        r.expect(st == "suspended", "could not lock the page's sound for the test (%r)" % st)
        r.page.mouse.click(700 + 20 * i, 300)
        r.page.wait_for_timeout(350)
        if r.js("() => window.dssAudio.ctxState()") != "running": stuck += 1
        r.page.wait_for_timeout(300)
    r.expect(stuck == 0, "a press on the alley view left the page's sound locked (%d of 3 presses)" % stuck)
    r.expect(r.pn() == "Harp Alley Approach", "the presses on the view left the approach (%r)" % r.pn())
    r.page.unroute("**/*")


@check("where-next-alley-road", "2026-11-14 (Sam: \"I want to make it more likely that a player arrives in the alley\", \"Signpost both gaps\"): Where next? names the Green Sea once page 93 is back and the bar is unvisited (not while a key is held), and Cecil Court once PROF. E. LEE is met and its door has reopened")
def where_next_alley_road(r):
    BASE = '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 3 Set")'
    NOKEY = '(set: $keyLighter to "seed")(set: $dreamKey to "")'
    SEA, CECIL, THIRD = "The Green Sea is open now.", "Cecil Court is open again.", "The third pillar is open."
    STATES = [   # the night, the sets on top of the third test start, lines wanted, lines unwanted
        ("page back, bar unvisited, no key", '(set: $metGreenSeaFriend to false)' + NOKEY, [SEA], [CECIL, THIRD]),
        ("page back, bar unvisited, key held", '(set: $metGreenSeaFriend to false)', [THIRD], [SEA, CECIL]),
        ("PROF. E. LEE met, no key", NOKEY, [CECIL], [SEA]),
        ("PROF. E. LEE met, key held", '', [CECIL, THIRD], [SEA]),
        ("the alley done", '(set: $harpMet to true)' + NOKEY, [], [SEA, CECIL]),
    ]
    LINES = "() => { var b = [].filter.call(document.querySelectorAll('.where-next'), function (x) { return !x.closest('.dss-ghost'); })[0]; return b ? b.innerText : ''; }"
    CLICK = "(t) => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return x.textContent.indexOf(t) >= 0 && !x.closest('.dss-ghost'); })[0]; if (!l) return false; l.click(); return true; }"
    HUB = "(t) => [].some.call(document.querySelectorAll('tw-link'), function (x) { return x.textContent.trim() === t && !x.closest('.dss-ghost, .where-next'); })"
    for i, (label, sets, want, unwanted) in enumerate(STATES):
        r.page.unroute("**/*")
        scratch_passage(r, "T-road%d" % i, BASE + sets + '(go-to: "Dean Street")')
        r.go("T-road%d" % i, wait=5500)
        r.expect(r.pn() == "Dean Street", "%s: the start landed on %r" % (label, r.pn()))
        e = r.js("() => [].map.call(document.querySelectorAll('tw-error'), function (x) { return x.textContent.slice(0, 100); }).join(' | ')")
        r.expect(not e, "%s: Harlowe errors: %s" % (label, e))
        box = r.js(LINES)
        for w in want: r.expect(w in box, "%s: Where next? does not say %r (it says %r)" % (label, w, box[:160]))
        for u in unwanted: r.expect(u not in box, "%s: Where next? says %r" % (label, u))
        if i == 0:
            r.expect(r.js(CLICK, SEA), "the Green Sea line cannot be picked"); r.page.wait_for_timeout(1200)
            r.expect("pillars" in (r.js("() => window.dssDirections.get()") or ""), "picking the Green Sea line does not light the way to the Pillars")
            r.expect(r.js(CLICK, "The Pillars"), "no Pillars door on Dean Street"); r.page.wait_for_timeout(3500)
            r.expect(r.pn() == "Maritime interlude", "the Pillars door leads to %r, not the storm and its shore" % r.pn())
            r.expect(r.js("() => [].some.call(document.querySelectorAll('.mar-shore tw-link'), function (x) { return /Seek the shore/.test(x.textContent) && !x.closest('.dss-ghost'); })"), "Seek the shore is not in its gold box on the storm page")
        if i == 2:
            r.expect(r.js(HUB, "Back to Cecil Court"), "the line shows but Dean Street has no Back to Cecil Court door")
            r.expect(r.js(CLICK, CECIL), "the Cecil Court line cannot be picked"); r.page.wait_for_timeout(1200)
            r.expect("cecil" in (r.js("() => window.dssDirections.get()") or ""), "picking the Cecil Court line does not light the way there")
    r.page.unroute("**/*")
    r.page.unroute("**/*")


# ---------------------------------------------------------------- 2026-11-14, Sam's 21 notes of 22:41
def _built():
    import html as _h
    t = _h.unescape(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "Dream Street Shuffle.html"), encoding="utf-8").read())
    for a, b in SWAPS: t = t.replace(a, b)   # a planted bug is applied to the text read here
    return t

N14_BASE = '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 3 Set")'
N14_ERRAND = N14_BASE + '(set: $metGreenSeaFriend to false)(set: $inisToldOfPillars to false)(set: $keyLighter to "seed")(set: $dreamKey to "")(set: $returnedPage to false)'
N14_CLICK = "(t) => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return x.textContent.indexOf(t) >= 0 && !x.closest('.dss-ghost'); })[0]; if (!l) return false; l.click(); return true; }"
N14_PRESS = "(t) => { var e = [].filter.call(document.querySelectorAll('button, .fi-action, tw-link, [role=button]'), function (x) { return x.getClientRects().length && !x.closest('.dss-ghost') && new RegExp(t, 'i').test(x.textContent.trim()); })[0]; if (!e) return false; e.click(); return true; }"


@check("notes-1114-source", "2026-11-14 notes 1, 3, 5, 8, 12, 13, 19 (Sam): the comma before 'either' is cut; the Ginger Light's cat is out of its scene; the French's whole-tone figure is plucked; the beret cat print is matt; stat changes are numbers only; the bronze hand shines; INIS's third-pillar speech types faster")
def notes_1114_source(r):
    t = _built()
    r.expect("credit for her either." in t and "credit for her, either." not in t, "note 1: the comma before 'either' is back in The Night Ahead")
    r.expect(t.count("scene.add(gingerCat);") == 1 and "restore with scene.add(gingerCat); */" in t, "note 3: the Ginger Light's cat is added to its scene again")
    r.expect("function pluck(n, when, amp, ring)" in t, "note 5: the French's whole-tone figure is not the plucked one")
    r.expect("emissiveMap: beretPrint" not in t and "brightness(.94)" in t, "note 8: the beret cat print glows by its own light again, or is back at its old brightness")
    r.expect("className = 'stat-why'" not in t and "className='stat-why'" not in t, "note 12: a stat change names the choice behind it again")
    cc = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cecil-court-3d-static.html"), encoding="utf-8").read()
    for a, b in SWAPS: cc = cc.replace(a, b)
    r.expect("emissive: 0x8a5a26, emissiveIntensity: 0.5" in cc and "PointLight(0xffb070, 2.6, 7.5, 2)" in cc, "note 13: the bronze hand in Cecil Court has lost its own light or its lamp")
    r.expect("cecil-court-3d-static.html?v=20261114a" in t, "note 13: the game still loads the older Cecil Court scene")
    r.expect('class="dss-speech dss-speech-quick" data-speaker="INIS' in t and "classList.contains('dss-speech-quick') ? 0.7 : 1" in t, "note 19: INIS's third-pillar speech is back at the slow pace")
    r.go("Dean Street", wait=1500)


@check("alba-star-flares", "2026-11-14 note 4 (Sam: \"When the alba pip thing lights up in the stats bar it should glow gold a moment. This should happen every time\"): the star of a line just caught flares gold, and it is a star on screen, not one in the after-image of the last page")
def alba_star_flares(r):
    scratch_passage(r, "T-alba", '[[go|LINE 1]]')   # a real page turn, so the page left stands as an after-image when the line lands
    r.go("T-alba", wait=3000)
    r.expect(r.js(N14_CLICK, "go"), "the test link is missing")
    r.wait_for("() => (window.dssAlbaKindled || 0) >= 1", 12000, "the first line's star to be lit")
    st = r.js("() => [].map.call(document.querySelectorAll('.alba-jewel.alba-jewel-kindle'), function (j) { return { ghost: !!j.closest('.dss-ghost'), box: j.getClientRects().length, filled: j.classList.contains('alba-jewel-filled'), anim: getComputedStyle(j).animationName }; })")
    r.expect(len(st) >= 1, "no star is flaring just after the line was caught")
    r.expect(all((not s["ghost"]) and s["box"] and s["filled"] for s in st), "the star that flared is hidden or in the after-image (%r)" % st)
    r.expect(any("alba-jewel-kindle" in s["anim"] for s in st), "the flaring star has no gold flare animation (%r)" % st)
    r.page.unroute("**/*")


@check("stat-slips-hold", "2026-11-14 note 7 (Sam: \"You shouldn't be able to click fast through morale and sobriety slips, they are important to read\"): each of the two slips ignores its paper, its cross and a click elsewhere until it has been up long enough to read")
def stat_slips_hold(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("The French", wait=9000)
    r.expect(r.js(N14_PRESS, "^to the bar$"), "no TO THE BAR button in the French")
    SLIP = "(tag) => { var c = [].filter.call(document.querySelectorAll('#dss-hint-stack .dss-hint-slip:not(.out)'), function (c) { var g = c.querySelector('.dss-hint-tag'); return g && g.textContent === tag; })[0]; return c ? { held: c.classList.contains('dss-hint-held'), typed: c.classList.contains('typed') } : null; }"
    for tag, name in (("1/2", "MORALE"), ("2/2", "SOBRIETY")):
        r.wait_for("(function(){ var f = %s; var s = f(%r); return !!(s && s.typed); })" % (SLIP, tag), 20000, "the %s slip" % name)
        t0 = time.time()
        r.expect(r.js(SLIP, tag)["held"], "the %s slip is not held when it lands" % name)
        r.page.locator("#dss-hint-stack .dss-hint-slip:not(.out) .dss-hint-x").last.click(force=True, timeout=3000)
        r.page.locator("#dss-hint-stack .dss-hint-slip:not(.out) .dss-hint-inner").last.click(force=True, timeout=3000)
        r.page.mouse.click(700, 500)
        r.page.keyboard.press("Escape")
        r.page.wait_for_timeout(500)
        r.expect(r.js(SLIP, tag) is not None, "the %s slip could be clicked away within a second of landing" % name)
        r.wait_for("(function(){ var f = %s; var s = f(%r); return !!(s && !s.held); })" % (SLIP, tag), 9000, "the %s slip to let go" % name)
        held_for = time.time() - t0
        r.expect(held_for >= 2.5, "the %s slip let go after %.1f s; it should hold 3 s or more" % (name, held_for))
        r.page.locator("#dss-hint-stack .dss-hint-slip:not(.out) .dss-hint-x").last.click()
        r.page.wait_for_timeout(700)
        r.expect(r.js(SLIP, tag) is None, "the %s slip did not close once it could be" % name)


@check("lore-not-offered-again", "2026-11-14 note 9 (Sam, the French: \"Because the lore is unmissable here, it shouldn't have a button with an option to see what you just saw again straight away\"): the orange paperback's note still opens by itself on every look (2026-11-11), but its card shows no button for the note")
def lore_not_offered_again(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("The French", wait=9000)
    r.room_ready("fi"); r.clear_slips(); r.clear_lore()
    over = "() => { var o = document.getElementById('dss-lore-overlay'); return !!o && getComputedStyle(o).display !== 'none' && /CHARIOTS/i.test(o.innerText); }"
    SHOWN = "() => { var c = document.querySelector('.dss-room-card[aria-hidden=\"false\"]'); return c ? [].filter.call(c.querySelectorAll('.fi-action'), function (b) { return b.getClientRects().length; }).map(function (b) { return b.textContent.trim(); }) : null; }"
    for look in ("first", "second"):
        r.click_object("fi", "An orange paperback")
        r.wait_for(over, 8000, "the note to open by itself on the %s look" % look)
        r.clear_lore(); r.page.wait_for_timeout(1200)
        btns = r.js(SHOWN)
        if btns is not None:
            r.expect(not any("LORE" in b.upper() or "CHARIOTS" in b.upper() or b == "Go on" for b in btns), "after the %s look the card shows a button for the note just read (%r)" % (look, btns))
        r.page.wait_for_timeout(1300)
        if r.js("() => window.__dssRooms.fi.mode()") == "inspect":
            r.expect(r.js("() => { var b = document.querySelector('.dss-room-card[aria-hidden=\"false\"] .dss-room-back'); return !!(b && b.getClientRects().length); }"), "after the %s look the card has no way back to the room" % look)
            r.back_click("fi"); r.page.wait_for_timeout(2000)
    r.page.unroute("**/*")


@check("glass-panes", "2026-11-14 note 10 (Sam: the lily line and the trail badge \"should be translucent glass panes not the badges they are\"): both are square-cornered, see-through panes, and the trail badge is no longer a disc")
def glass_panes(r):
    PANE = "(sel) => { var e = document.querySelector(sel); if (!e) return null; var c = getComputedStyle(e), b = e.getBoundingClientRect(), al = (c.backgroundImage.match(/rgba\\([^)]*\\)/g) || []).map(function (x) { return parseFloat(x.replace(/.*,/, '')); }); return { radius: parseFloat(c.borderTopLeftRadius), alphas: al, w: Math.round(b.width), h: Math.round(b.height), dir: c.flexDirection }; }"
    # the lily line first, on a fresh night (the trail state below has the Pillars' lily already gathered)
    r.go("Entering The Pillars of Hercules", wait=9000); r.clear_slips(); r.clear_lore()
    r.wait_for("() => !!document.querySelector('.dss-room-lily-hint')", 9000, "the Pillars' lily line")
    lh = r.js(PANE, ".dss-room-lily-hint")
    r.expect(lh["radius"] <= 6, "the lily line is an oval badge again (%r)" % lh)
    r.expect(lh["alphas"] and max(lh["alphas"]) <= 0.5, "the lily line is not see-through (%r)" % lh)
    scratch_passage(r, "T-glass", N14_ERRAND + '(set: $hasMissingPage to false)(go-to: "Dean Street")')
    r.go("T-glass", wait=7000); r.clear_slips()
    r.wait_for("() => !!document.querySelector('.dss-trail-badge')", 6000, "the trail badge")
    tb = r.js(PANE, ".dss-trail-badge")
    r.expect(tb["radius"] <= 6, "the trail badge has round corners again (%r)" % tb)
    r.expect(tb["alphas"] and max(tb["alphas"]) <= 0.5, "the trail badge is not see-through (%r)" % tb)
    r.expect(tb["w"] > tb["h"] * 1.6 and tb["dir"] == "row", "the trail badge is a disc again, not a pane on its side (%r)" % tb)
    r.page.unroute("**/*")


@check("errand-badge", "2026-11-14 notes 15 and 20 (Sam: \"The errand should appear in the same way the path/quests do\"; \"You should be able to click the badge ... the corresponding venue in the menu should flash red\"): INIS's page-93 errand wears the trail badge, to the Pillars and then to Cecil Court, and a press on it flashes that venue in the menu and on the map")
def errand_badge(r):
    BADGE = "() => { var b = document.querySelector('.dss-trail-badge'); return b ? b.innerText.replace(/\\s+/g, ' ').trim() : ''; }"
    for i, (label, sets, want, door, line) in enumerate([("the page to find", '(set: $hasMissingPage to false)', "Next, the Pillars.", "pillars", "Find page 93."), ("the page in the pocket", '(set: $hasMissingPage to true)', "Next, Cecil Court.", "cecil", "Take page 93 back to INIS.")]):
        r.page.unroute("**/*")
        scratch_passage(r, "T-errand%d" % i, N14_ERRAND + sets + '(go-to: "Dean Street")')
        r.go("T-errand%d" % i, wait=7000); r.clear_slips()
        r.wait_for("() => !!document.querySelector('.dss-trail-badge')", 6000, "the errand's badge with %s" % label)
        b = r.js(BADGE)
        r.expect("PAGE 93" in b and want in b, "%s: the badge reads %r" % (label, b))
        r.expect(r.js("() => !!document.querySelector('.dss-trail-badge .dss-compass-hand')"), "%s: the badge has no compass" % label)
        r.page.locator(".dss-trail-badge").first.click()
        r.page.wait_for_timeout(350)
        fl = r.js("() => [].map.call(document.querySelectorAll('.dss-menu-flash'), function (e) { return (e.getAttribute('aria-label') || e.innerText).trim(); })")
        mark = r.js("() => window.dssTrailFlashed || null")
        r.expect(mark and mark["door"] == door and mark["n"] >= 1, "%s: pressing the badge flashed nothing (%r)" % (label, mark))
        r.expect(any(line in f for f in fl), "%s: the Where next? line %r did not flash (%r)" % (label, line, fl))
    r.page.unroute("**/*")
    scratch_passage(r, "T-errand-done", N14_BASE + '(set: $keyLighter to "seed")(set: $dreamKey to "")(go-to: "Dean Street")')
    r.go("T-errand-done", wait=7000); r.clear_slips(); r.page.wait_for_timeout(1500)
    r.expect("PAGE 93" not in r.js(BADGE), "the errand's badge still shows after page 93 is back with INIS")
    r.page.unroute("**/*")


@check("lore-foot-go-on", "2026-11-14 note 16 (Sam, the storm page: \"Seek the shore appears too as the button here, it would be 'go on' the second time\"): a lore note owed to a press no longer wears that press's words on its foot button")
def lore_foot_go_on(r):
    scratch_passage(r, "T-storm", N14_ERRAND + '(set: $hasMissingPage to false)(set: $pillarsVisits to 1)(go-to: "Maritime interlude")')
    r.go("T-storm", wait=7000); r.clear_slips()
    r.expect(r.pn() == "Maritime interlude", "the start landed on %r" % r.pn())
    pt = r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (x) { return /Seek the shore/.test(x.textContent) && !x.closest('.dss-ghost') && x.getClientRects().length; })[0]; if (!l) return null; l.scrollIntoView({ block: 'center' }); var b = l.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
    r.expect(pt, "no Seek the shore on the storm page")
    r.page.mouse.click(pt[0], pt[1])   # a real press: the notes owed to it open first
    labels = []
    for _ in range(4):
        r.wait_for("() => !!document.querySelector('#dss-lore-overlay .dss-lore-on') || ((document.getElementById('dss-pn') || {}).textContent || '').trim() !== 'Maritime interlude'", 8000, "a lore note or the page to turn")
        if r.pn() != "Maritime interlude": break
        labels.append(r.js("() => document.querySelector('#dss-lore-overlay .dss-lore-on').textContent.trim()"))
        r.page.locator("#dss-lore-overlay .dss-lore-on").first.click()
        r.page.wait_for_timeout(1500)
    r.info = "foot buttons: %r" % labels
    r.expect(labels, "no lore note opened on the press")
    r.expect(all(l in ("Go on", "Next note") for l in labels) and labels[-1] == "Go on", "a note's foot button repeats the press's own words, or the last says Next note (%r)" % labels)
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'The coast of Carthage'", 8000, "the press to carry on to Carthage after the notes")
    r.page.unroute("**/*")


@check("where-next-pick-clears-slip", "2026-11-14 note 18 (Sam: \"When you select find p93 from the main list the slip should disappear\"): picking a Where next? line sends off the slip that offers directions to the same door")
def where_next_pick_clears_slip(r):
    scratch_passage(r, "T-pick", N14_ERRAND + '(set: $hasMissingPage to true)(set: $pageReminderShown to false)(go-to: "Dean Street")')
    r.go("T-pick", wait=5000)
    UP = "() => [].some.call(document.querySelectorAll('#dss-hint-stack .dss-hint-slip:not(.out)'), function (c) { return /waiting for it in Cecil Court/.test(c.textContent); })"
    r.wait_for(UP, 20000, "the slip that says page 93 is in your pocket")
    r.expect(r.js(N14_CLICK, "Take page 93 back to INIS."), "no Take page 93 back to INIS. line in Where next?")
    r.page.wait_for_timeout(1500)
    r.expect(not r.js(UP), "the slip stayed up after its line was picked in Where next?")
    r.expect("cecil" in (r.js("() => window.dssDirections.get()") or ""), "the pick did not light the way to Cecil Court")
    r.page.unroute("**/*")


@check("french-done-says-so", "2026-11-14 note 21 (Sam: \"What does this mean when it shows the lilies and an empty box and 'not now'?\"): a French with nothing left says so in a sentence, with no stray haunt marks under it")
def french_done_says_so(r):
    scratch_passage(r, "T-frdone", N14_BASE + '(go-to: "The French")')
    r.go("T-frdone", wait=9000); r.clear_slips(); r.clear_lore()
    v = r.js("() => { var v = document.querySelector('.dss-room-veil.dss-room-veil-on'); if (!v) return null; return { text: v.innerText, marks: [].filter.call(v.querySelectorAll('.hp, .lp'), function (e) { return e.getClientRects().length; }).length }; }")
    r.expect(v is not None, "the French's opening panel did not show")
    r.expect("There is nothing more for you in the French tonight." in v["text"] and "NOT NOW" not in v["text"].upper(), "the panel reads %r" % v["text"][:160])
    r.expect(v["marks"] == 0, "%d stray haunt or lily marks stand under the line" % v["marks"])
    r.page.unroute("**/*")


@check("cecil-cow-at-once", "2026-11-05 note 33 (Sam: \"The cow should fly over the moon straight away then cecil court loads\"): the cow's flight starts as the scene opens, and ENTER CECIL COURT waits for it, fading in at about 7 s (it was 1.5 s, with the cow at 6 s); 2026-11-19 (Sam: \"maybe delay only 4 seconds\"): it now shows at 4 s, fully in by about 5.5 s")
def cecil_cow_at_once(r):
    cc = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cecil-court-3d-static.html"), encoding="utf-8").read()
    for a, b in SWAPS: cc = cc.replace(a, b)
    r.expect(re.search(r"var phase = \(t - cowT0\) % \d+;", cc) and "phase < COW_FLIGHT" in cc, "the cow's flight no longer starts with its clock (a wait before take-off is back)")
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Cecil Court Approach", wait=2500)
    OP = "() => { var b = [].filter.call(document.querySelectorAll('button'), function (x) { return /ENTER CECIL COURT/.test(x.textContent); })[0]; return b ? +getComputedStyle(b).opacity : -1; }"
    r.expect(r.js(OP) >= 0, "no ENTER CECIL COURT button on the approach")
    early = r.js(OP)
    r.expect(early < 0.2, "ENTER CECIL COURT is already showing 2.5 s in (opacity %.2f); it should wait for the cow" % early)
    r.wait_for("(function(){ var f = %s; return f() > 0.8; })" % OP, 4500, "ENTER CECIL COURT to fade in by about 7 s from arriving (it should show at 4 s, not 7)")
    r.page.unroute("**/*")


@check("ham-asks-america", "2026-11-18 note 23 (Sam: \"Still doesn't say 'Have you tried America' like it should\"): the Great Ham's verdict is in the reading again, so the reply \"America, you think of new-found-land.\" answers a question he has asked")
def ham_asks_america(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("The critic's judgement", wait=3000)
    seen = []
    for _ in range(60):
        t = r.js("() => ((document.getElementById('critBookNarrate') || {}).textContent || '').trim()")
        if t and t not in seen: seen.append(t)
        if "America" in t: break
        r.page.wait_for_timeout(250)
    r.info = " / ".join(seen)
    r.expect(any("Have you tried America?" in t for t in seen), "the reading never asks 'Have you tried America?' (it said: %s)" % r.info)
    t = _built()
    r.expect("he sneers, empathetically. \\u2018Have you tried America?\\u2019\";" in t, "the drunk reading lost his America line")


@check("critic-knows-this-run-only", "2026-11-05 note 32 (Sam: 'I know this one' on a first visit): THE GREAT HAM knows the book only from an earlier night of THIS run; a refusal left in the browser by an earlier run counts for nothing")
def critic_knows_this_run_only(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    SLIP = "() => { var s = document.querySelector('#critAftermath .dss-refusal[data-k=\"ham\"]'); return s ? s.textContent : ''; }"
    SEED = "([night, first, n]) => { localStorage.setItem('dssNightNo', String(night)); localStorage.setItem('dssRunFirst', String(first)); localStorage.setItem('dssRefusals', JSON.stringify([{ k: 'ham', who: 'THE GREAT HAM', line: 'Not for me.', n: n }])); }"
    r.go("Dean Street", wait=3000)
    r.js(SEED, [6, 6, 3])        # his refusal is from night 3; this run began on night 6
    r.go("The critic's judgement", wait=5000)
    r.expect(r.js("() => +localStorage.getItem('dssNightNo')") == 6 and r.js("() => +localStorage.getItem('dssRunFirst')") == 6, "the jump moved the night counters, so this check proves nothing")
    slip = r.js(SLIP)
    r.expect(slip, "no slip for THE GREAT HAM on the critic's page")
    r.expect("know this one" not in slip, "he knows the book from an earlier run's refusal (%r)" % slip[:80])
    r.js(SEED, [6, 5, 5])        # the run began on night 5 and he refused it then
    r.go("The critic's judgement", wait=5000)
    slip = r.js(SLIP)
    r.expect("know this one" in slip, "he no longer knows the book on a return night of the same run (%r)" % slip[:80])
    if SWAPS: r.page.unroute("**/*")


@check("beast-window-stays", "2026-11-05 note 34 (Sam: \"I can't click the 'on' for the beast without the popup disappearing\"): the Beast's window in Watkins waits 350 ms after the pointer leaves his name, stays while the pointer is on it, and a click on it pins it and turns to part 2")
def beast_window_stays(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")   # serves the html through SWAPS when a bug is planted
    r.go("Watkins", wait=3000)
    r.clear_lore(); r.clear_slips()
    HIM = "() => { var w = [].filter.call(document.querySelectorAll('.wk-him.wk-bio-link'), function (x) { return !x.closest('.dss-ghost') && x.getClientRects().length; })[0]; if (!w) return null; var b = w.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, op: +getComputedStyle(w).opacity }; }"
    TIP = "() => { var t = document.querySelector('.wk-bio'); if (!t) return null; var b = t.getBoundingClientRect(), c = t.querySelector('.wk-bio-count'); return { x: b.left + b.width / 2, y: b.top + b.height / 2, k: t.dataset.k, pin: t.dataset.pin || '', count: c ? c.textContent.trim() : '' }; }"
    r.wait_for("(function(){ var f = %s; var h = f(); return h && h.op > 0.8; })" % HIM, 45000, "the Beast's name to be written on the page")
    r.page.wait_for_timeout(800)

    def hover():
        for _ in range(6):
            h = r.js(HIM); r.page.mouse.move(h["x"], h["y"], steps=4); r.page.wait_for_timeout(180)
            t = r.js(TIP)
            if t and t["k"] == "him": return t
            r.page.mouse.move(8, 8); r.page.wait_for_timeout(500)
        return None

    t = hover()
    r.expect(t, "hovering the Beast's name opened no window")
    if not t: return
    r.expect(t["count"].startswith("1 /"), "the window did not open on its first part (%r)" % t["count"])
    r.page.mouse.move(8, 8)                      # off the name, nowhere near the window
    r.page.wait_for_timeout(180)
    r.expect(r.js(TIP), "the window shut the moment the pointer left his name (no grace)")
    r.page.wait_for_timeout(700)
    r.expect(not r.js(TIP), "the window stayed open with the pointer away and nothing pinned")
    t = hover()
    r.expect(t, "the window did not open a second time")
    if not t: return
    r.page.mouse.move(t["x"], t["y"], steps=6)   # across the gap onto the window
    r.page.wait_for_timeout(800)
    t = r.js(TIP)
    r.expect(t, "the window shut while the pointer was on it")
    if not t: return
    r.page.mouse.click(t["x"], t["y"])
    r.page.wait_for_timeout(300)
    t = r.js(TIP)
    r.expect(t and t["pin"] == "1" and t["count"].startswith("2 /"), "a click on the window did not pin it and turn to part 2 (%r)" % (t,))
    r.page.mouse.move(8, 8)
    r.page.wait_for_timeout(800)
    r.expect(r.js(TIP), "the pinned window shut when the pointer left it")
    r.page.screenshot(path=os.path.join(SHOTS, "beast-window.png"))
    if SWAPS: r.page.unroute("**/*")


# ---------------------------------------------------------------- the 16 Nov evening fixes (checks added 2026-11-18)
# Those fixes were made in a session that could not reach the Mac's browser, so they went in without checks. One check
# each here, every one proved against its old fault planted in the served html.
@check("doorway-button-on-the-caption", "2026-11-16 playtest (Friction 4): the doorways' 'Step into the doorway.' button sat in a row of its own above the d-pad, its top edge at 901 px of a 1440x900 window, and the page scrolled 20 to 41 px; it rides on the caption row now")
def doorway_button_on_the_caption(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Test Start 2", wait=10000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    r.wait_for("() => !!(window.dssSohoMap && window.dssSohoMap.state)", 10000, "the Soho map")
    BTN = "() => { var b = [].filter.call(document.querySelectorAll('.dss-doorway-btn'), function (e) { return !e.closest('.dss-ghost') && e.getClientRects().length; })[0]; if (!b) return null; var q = b.getBoundingClientRect(), row = document.querySelector('.smb-glyphs'), w = row ? row.getBoundingClientRect() : null; return { top: Math.round(q.top), bottom: Math.round(q.bottom), onRow: !!b.closest('.smb-glyphs'), rowTop: w ? Math.round(w.top) : -1, rowBottom: w ? Math.round(w.bottom) : -1, over: document.scrollingElement.scrollHeight - innerHeight }; }"
    seen = None
    for d in r.js("() => window.dssSohoMap.doors.filter(function (d) { return /^dw/.test(d.id); }).map(function (d) { return [d.c, d.r, d.id]; })"):
        if not r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", d[:2]): continue
        r.page.wait_for_timeout(900)
        seen = r.js(BTN)
        if seen: seen["door"] = d[2]; break
    r.expect(seen, "standing in an open doorway shows no 'Step into the doorway.' button")
    r.info = "%(door)s: button %(top)d to %(bottom)d px, caption row %(rowTop)d to %(rowBottom)d, page over %(over)d" % seen
    r.expect(seen["onRow"], "the button is not on the caption row (it has a row of its own again)")
    r.expect(seen["bottom"] <= 900, "the button's foot is at %d px of a 900 px window" % seen["bottom"])
    r.expect(seen["over"] <= 0, "with the button up the page runs %d px past the window" % seen["over"])


@check("soho-square-any-gate", "2026-11-16 playtest (Friction 8): Soho Square went in only from the hut's own tile, so walking straight up through the south gate passed it with no prompt; coming into the garden through any gate goes in now")
def soho_square_any_gate(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    went = []
    for tile, way in (((36, 10), "up"), ((33, 8), "right"), ((38, 8), "left"), ((36, 5), "down")):
        r.go("Test Start 2", wait=10000)   # the Square's door is not open at the start of a first night
        r.clear_lore(); r.clear_slips(); r.clear_lore()
        r.wait_for("() => !!(window.dssSohoMap && window.dssSohoMap.state)", 10000, "the Soho map")
        r.expect("Soho Square" in r.js(HUB_LINKS), "Soho Square is not open on this Dean Street, so this check proves nothing")
        if not r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", list(tile)): continue   # no gate on this side
        r.page.wait_for_timeout(500)
        r.js("""(way) => { var b = document.querySelector('[data-dir="' + way + '"]'); if (!b) return;
          b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 7, isPrimary: true }));
          setTimeout(function () { b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 7, isPrimary: true })); }, 200); }""", way)
        pn = "Dean Street"
        for _ in range(24):
            r.page.wait_for_timeout(250); pn = r.pn()
            if pn != "Dean Street": break
        at = r.js("() => { var s = window.dssSohoMap && window.dssSohoMap.state; return s ? [s.c, s.r] : null; }") if pn == "Dean Street" else None
        if pn == "Dean Street" and at and 34 <= at[0] <= 37 and 6 <= at[1] <= 9:
            r.expect(False, "one step %s from %s stands in the garden at %s and the Square has not opened" % (way, tile, at))
        if pn != "Dean Street": went.append("%s from %s: %s" % (way, tile, pn))
    r.info = "; ".join(went)
    r.expect(len(went) >= 2, "fewer than two gates could be tried (%s)" % went)


@check("soho-square-things-glow", "2026-11-16 playtest (Friction 7), then 2026-11-19 (Sam: \"The clickable things should have halos like they do elsewhere\"; \"because there are no halos directing I am now stuck here\"): the hut door, the statue and the gate wear the rooms' resting lights, bright enough to find, breathing; the hut door goes dark once it has nothing left (the worm game played)")
def soho_square_things_glow(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    def lights():
        r.wait_for("() => !!(window._dssThreeRegistry && window._dssThreeRegistry['sq-wrap'] && window._dssThreeRegistry['sq-wrap'].scene)", 15000, "the 3D square")
        r.page.mouse.move(5, 5)   # nothing hovered
        r.js("""() => { var sc = window._dssThreeRegistry['sq-wrap'].scene, ms = {}; sc.traverse(function (o) { if (/^sq-rest-/.test(o.name)) ms[o.name.slice(8)] = o; });
          window.__glow = {}; Object.keys(ms).forEach(function (k) { window.__glow[k] = [9, 0, 0]; });
          var t0 = performance.now(); (function tick() { Object.keys(ms).forEach(function (k) { var o = ms[k], g = window.__glow[k], a = o.visible ? o.material.opacity : 0; g[0] = Math.min(g[0], a); g[1] = Math.max(g[1], a); if (o.visible) g[2]++; }); if (performance.now() - t0 < 6000) requestAnimationFrame(tick); })(); }""")
        r.page.wait_for_timeout(6300)
        return r.js("() => window.__glow")
    r.go("Alley: Soho Square", wait=9000); r.clear_lore(); r.clear_slips()
    g = lights()
    r.info = "fresh: %s" % {k: "%.2f-%.2f" % (v[0], v[1]) for k, v in g.items()}
    r.expect(sorted(g) == ["door", "gate", "king"], "the Square's resting lights are %s, expected the door, the statue and the gate" % sorted(g))
    r.expect(all(v[1] >= 0.40 for v in g.values()), "a resting light never rises past 0.40, too faint to find: %s" % r.info)
    scratch_passage(r, "T-sq-played", '(set: $wormPlayed to true)(go-to: "Alley: Soho Square")')
    r.go("T-sq-played", wait=9000); r.clear_lore(); r.clear_slips()
    g2 = lights()
    r.info += "; worm game played: %s" % {k: "%.2f-%.2f" % (v[0], v[1]) for k, v in g2.items()}
    r.expect(g2.get("door", [0, 0])[1] == 0 and g2.get("king", [0, 0])[1] >= 0.40 and g2.get("gate", [0, 0])[1] >= 0.40, "after the worm game the door should be dark and the statue and gate lit: %s" % r.info)


@check("worms-short-phallic-dong", "2026-11-19 (Sam: \"This game goes on for too long. Also the worms aren't comically phallic like they used to be. Also the noise when you clock them should be more of a bass DONG\"): the round is twenty seconds for twelve worms, each worm wears a round head wider than its shaft, and a hit strikes a 62 Hz bell")
def worms_short_phallic_dong(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Soho Square: the gardener’s hut", wait=7000); r.clear_lore(); r.clear_slips()
    r.js("""() => { window.__osc = []; var BAC = window.BaseAudioContext || window.AudioContext, co = BAC.prototype.createOscillator;
      BAC.prototype.createOscillator = function () { var o = co.apply(this, arguments), sv = o.frequency.setValueAtTime.bind(o.frequency); o.frequency.setValueAtTime = function (v, t) { window.__osc.push(Math.round(v)); return sv(v, t); }; return o; }; }""")
    card = r.js("() => document.querySelector('.worm-instructions').innerText")
    r.js("() => { [].forEach.call(document.querySelectorAll('button'), function (e) { if (/Pick up a spade/i.test(e.textContent) && e.offsetParent) e.click(); }); }")
    r.page.wait_for_timeout(800)
    r.js("() => { var w = document.querySelector('.worm-start'); if (w && w.offsetParent) w.click(); }")
    hit = False
    for _ in range(60):
        r.page.wait_for_timeout(150)
        i = r.js("() => [].findIndex.call(document.querySelectorAll('#dss-worm-game .worm-hole'), function (h) { return h.classList.contains('up'); })")
        if i >= 0:
            r.page.locator("#dss-worm-game .worm-hole").nth(i).click(); hit = True; break
    r.page.wait_for_timeout(500)
    osc = r.js("() => window.__osc.slice()")
    head = r.js("""() => { var b = document.querySelector('#dss-worm-game .worm-body'), a = getComputedStyle(b, '::after'), bw = b.getBoundingClientRect().width; return { head: parseFloat(a.height), headW: bw + 2 * Math.abs(parseFloat(a.left)), shaft: bw, band: a.top }; }""")
    r.page.wait_for_timeout(21000)
    st = r.js("() => document.querySelector('.worm-status').textContent")
    r.info = "card %r; hit %s, oscillators %s; head %s; at 22 s: %r" % (card.replace("\n", " "), hit, osc[:8], head, st)
    r.expect("Twenty seconds" in card and "Twelve" in card, "the card does not say twenty seconds and twelve worms: %s" % r.info)
    r.expect(st.strip() != "", "the round had not ended by 22 s: %s" % r.info)
    r.expect(head["head"] >= 30 and head["headW"] > head["shaft"], "the worms have no round head wider than the shaft: %s" % r.info)
    r.expect(hit and 63 in osc and 126 in osc, "a hit did not strike the 62 Hz bell (struck at 63, its octave partial at 126): %s" % r.info)


@check("flower-popup-before-step-back", "2026-11-19 (Sam, playtest at the Pillars: \"The popup should show before the camera moves back to its original position when you take a flower\"): after Always take a flower the camera holds on the close-up while A FLOWER is up, and goes back to the room as it closes")
def flower_popup_before_step_back(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Entering The Pillars of Hercules", wait=10000)
    r.room_ready("pi"); r.clear_slips(); r.clear_lore()
    names = r.js("() => window.__dssRooms['pi'].names()")
    found = None
    for n in names:
        if not r.js("([n]) => !!window.__dssRooms['pi'].point(n)", [n]): continue
        r.click_object("pi", n)
        if r.js("() => [].some.call(document.querySelectorAll('.dss-room-card .fi-action'), function (b) { return /Always take a flower/.test(b.textContent) && b.getClientRects().length; })"):
            found = n; break
        r.back_click("pi"); r.page.wait_for_timeout(1500); r.clear_slips()
    r.expect(found, "no object in the Pillars offers Always take a flower (looked at %s)" % names)
    r.page.locator(".dss-room-card .fi-action", has_text="Always take a flower").first.click()
    r.wait_for("() => !!document.getElementById('dss-lily-overlay')", 4000, "the A FLOWER popup")
    r.page.wait_for_timeout(1800)
    held = r.js("() => window.__dssRooms['pi'].mode()")
    r.page.locator(".dss-lily-close").click()
    r.page.wait_for_timeout(3000)
    after = r.js("() => window.__dssRooms['pi'].mode()")
    r.info = "flower on %r; camera while the popup is up: %s; after it closes: %s" % (found, held, after)
    r.expect(held == "inspect", "the camera left the flower before its popup closed: %s" % r.info)
    r.expect(after == "idle", "the camera did not go back to the room once the popup closed: %s" % r.info)


@check("fi-photographs-clear", "2026-11-19 (Sam, the French: \"'Nothing gold can stay' cuts over the image it should be commenting on\"; \"Swap the man drinking the pint image over so he is immediately to the right of the main image\"): in the Photographs close-up the voices hang below the frames, over none of the three pictures in the middle; his print hangs in frame 6, beside the main photograph")
def fi_photographs_clear(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("The French", wait=10000)
    r.room_ready("fi"); r.clear_slips(); r.clear_lore()
    r.click_object("fi", "Photographs"); r.page.wait_for_timeout(2500); r.clear_slips()
    r.wait_for("() => { var v = document.querySelector('.dss-voice-box'); return v && +getComputedStyle(v).opacity > 0.9; }", 6000, "the voices beside the photographs")
    m = r.js("""() => { var R = window.__dssRooms['fi'], cam = R.camera, pg = null; R.scene.traverse(function (o) { if (!pg && o.children && o.children.length === 8 && o.children.every(function (c) { return c.type === 'Group'; })) pg = o; });
      var cv = R.wrap.querySelector('canvas').getBoundingClientRect(), V = cam.position.constructor;
      function rect(g) { var b = new (window.THREE ? THREE.Box3 : null)(); return b; }
      var out = { frames: [], maps: [] };
      [4, 5, 6].forEach(function (i) { var g = pg.children[i], xs = [], ys = []; g.updateMatrixWorld(true); [[-0.22, -0.28], [0.22, -0.28], [-0.22, 0.28], [0.22, 0.28]].forEach(function (c) { var v = new V(c[0], c[1], 0).applyMatrix4(g.matrixWorld).project(cam); xs.push(cv.left + (v.x + 1) / 2 * cv.width); ys.push(cv.top + (1 - v.y) / 2 * cv.height); });
        out.frames.push([i, Math.min.apply(0, xs), Math.min.apply(0, ys), Math.max.apply(0, xs), Math.max.apply(0, ys)].map(Math.round)); });
      [6, 7].forEach(function (i) { var src = ''; pg.children[i].traverse(function (o) { if (o.material && o.material.map && o.material.map.image) { var im = o.material.map.image; src = src || (im.currentSrc || im.src || (im.toDataURL ? 'canvas' : '?')); } }); out.maps.push([i, String(src).slice(-60), +pg.children[i].scale.x.toFixed(2)]); });
      var vb = document.querySelector('.dss-voice-box').getBoundingClientRect(); out.box = [vb.left, vb.top, vb.right, vb.bottom].map(Math.round); return out; }""")
    r.info = str(m)
    b = m["box"]
    hit = [f[0] for f in m["frames"] if not (b[2] <= f[1] or b[0] >= f[3] or b[3] <= f[2] or b[1] >= f[4])]
    r.expect(not hit, "the voices sit over frame(s) %s: %s" % (hit, r.info))
    r.expect(m["maps"][0][2] > m["maps"][1][2], "frame 6 is not the larger frame his print hangs in: %s" % r.info)


@check("soho-square-is-an-approach", "2026-11-19 (Sam: \"The lead into this part is really weird, it should be just like the others, the 3d render should be an 'approach scene'\"): the Square from the street has the approaches' way back at the top left and the way in as a button at the foot; the back link goes to Dean Street, the button into the hut; no way in once the worm game is played")
def soho_square_is_an_approach(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Alley: Soho Square", wait=9000); r.clear_lore(); r.clear_slips()
    r.wait_for("() => { var b = document.getElementById('sq-enter'); return b && +getComputedStyle(b).opacity > 0.9; }", 6000, "the way-in button")
    m = r.js("""() => { function top(e) { var q = e.getBoundingClientRect(), t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !!t && (t === e || e.contains(t)); }
      var en = document.getElementById('sq-enter'), bk = document.getElementById('sq-back'), qe = en.getBoundingClientRect(), qb = bk.getBoundingClientRect();
      return { enter: en.textContent, enterTop: top(en), enterFoot: Math.round(innerHeight - qe.bottom), back: bk.textContent, backTop: top(bk), backAt: [Math.round(qb.left), Math.round(qb.top)] }; }""")
    r.info = str(m)
    r.expect(m["enterTop"] and m["enterFoot"] < 140 and "GARDENER" in m["enter"], "the way in is not a button at the foot: %s" % m)
    r.expect(m["backTop"] and m["backAt"][0] < 60 and m["backAt"][1] < 60 and "Dean Street" in m["back"], "the way back is not at the top left: %s" % m)
    def arrive(test, what):
        # a slip or lore card that lands after the press holds the page turn until it is read, as for a player
        for i in range(24):
            if r.js(test):
                r.info += " | %s after %d" % (what[-12:], i)
                return
            r.clear_slips(rounds=1); r.clear_lore(rounds=1)
            r.page.wait_for_timeout(500)
        r.wait_for(test, 2000, what)
    r.page.click("#sq-enter")
    arrive("() => /gardener/.test(((document.getElementById('dss-pn') || {}).textContent || ''))", "the button to go into the hut")
    r.go("Alley: Soho Square", wait=9000); r.clear_lore(); r.clear_slips()
    r.wait_for("() => !!document.getElementById('sq-back')", 6000, "the way back")
    r.page.click("#sq-back")
    arrive("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street'", "the way back to go to Dean Street")
    scratch_passage(r, "T-sq-played2", '(set: $wormPlayed to true)(go-to: "Alley: Soho Square")')
    r.go("T-sq-played2", wait=9000); r.clear_lore(); r.clear_slips()
    r.expect(not r.js("() => !!document.getElementById('sq-enter')"), "a way-in button shows after the worm game")


@check("stat-numbers-brief", "2026-11-16 playtest (Looks wrong 1): the +4, +5 and +30 beside the bars lingered about 5 s and rose 46 px, off the top of the window and over the word SOBRIETY; they are gone in 2.6 s within 16 px")
def stat_numbers_brief(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Test Start 2", wait=10000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    r.js("() => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { return !e.closest('.dss-ghost') && e.textContent.trim() === 'Livonia Street'; })[0]; l.click(); }")
    r.wait_for("() => !!document.querySelector('#spew-popup-overlay canvas')", 8000, "the doorway card")
    r.page.wait_for_timeout(1200)
    # every frame: each number's opacity and how far its animation has lifted it
    r.js("""() => { var L = window.__sd = { rows: [] }, t0 = performance.now(); (function tick() { var ds = document.querySelectorAll('#stat-bars-lifted .stat-delta');
      L.rows.push([Math.round(performance.now() - t0)].concat([].map.call(ds, function (d) { var cs = getComputedStyle(d), m = new DOMMatrixReadOnly(cs.transform === 'none' ? '' : cs.transform); return [+(+cs.opacity).toFixed(2), Math.round(m.m42)]; })));
      if (performance.now() - t0 < 16000) requestAnimationFrame(tick); })(); }""")
    box = r.js("() => { var b = document.querySelector('#spew-popup-overlay canvas').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
    r.page.mouse.move(*box); r.page.mouse.down(); r.page.wait_for_timeout(1500); r.page.mouse.up()
    r.wait_for("() => !document.getElementById('spew-popup-overlay')", 15000, "the card to close")
    r.page.wait_for_timeout(7000)
    rows = r.js("() => window.__sd.rows")
    shown = [x for x in rows if len(x) > 1 and any(d[0] > 0.05 for d in x[1:])]
    r.expect(shown, "no stat number showed after the doorway")
    secs = (shown[-1][0] - shown[0][0]) / 1000.0
    rise = -min(d[1] for x in shown for d in x[1:] if d[0] > 0.05)
    r.info = "on show %.1f s, risen %d px" % (secs, rise)
    r.expect(secs <= 3.0, "the numbers stayed %.1f s (2.6 s is the length now; 5.2 s carried them off the top)" % secs)
    r.expect(rise <= 18, "the numbers rose %d px (16 px is the rise now; 46 px took a +30 over SOBRIETY)" % rise)


@check("chamber-line-once", "2026-11-16 playtest (Looks wrong 4): after three missed tries the King's Chamber printed 'AL HUBZ stops the song.' twice, once in the frame and once as the caption")
def chamber_line_once(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("King's Chamber", wait=9000)
    r.clear_lore(); r.clear_slips()
    r.js("() => { var b = document.querySelector('.dss-rules-play'); if (b) b.click(); }"); r.page.wait_for_timeout(1500)
    r.wait_for("() => !!window._harmonyDev", 8000, "the hum game")
    for _ in range(8):   # a tap is let go too soon: three of them end it
        st = r.js("() => window._harmonyDev.state()")
        if st["done"]: break
        r.page.keyboard.down("Space"); r.page.wait_for_timeout(160); r.page.keyboard.up("Space"); r.page.wait_for_timeout(2600)
    st = r.js("() => window._harmonyDev.state()")
    r.expect(st["done"], "three taps did not end the hum (%r)" % st)
    COUNT = "() => [].filter.call(document.querySelectorAll('tw-story *'), function (e) { if (e.closest('.dss-ghost, #dss-hint-stack') || e.children.length || !/AL HUBZ stops the song\\./.test(e.textContent) || !e.getClientRects().length) return false; for (var a = e; a && a.tagName !== 'TW-STORY'; a = a.parentElement) { var cs = getComputedStyle(a); if (cs.visibility === 'hidden' || +cs.opacity < 0.2) return false; } return true; }).length"
    most = 0; least = 9
    for _ in range(12):   # the old second copy came 1.5 s after the end and stayed 4 s
        n = r.js(COUNT); most = max(most, n); least = min(least, n); r.page.wait_for_timeout(300)
    r.info = "the line shows %d time(s)" % most
    r.expect(most >= 1, "'AL HUBZ stops the song.' is not on the page after the third miss")
    r.expect(most <= 1, "'AL HUBZ stops the song.' shows %d times at once" % most)


@check("reclamation-board-at-the-end", "2026-11-16 playtest (Looks wrong 5): the Reclamation's scoreboard still read RELOADING over its end card")
def reclamation_board_at_the_end(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("The Reclamation", wait=9000)
    r.clear_lore(); r.clear_slips()
    r.js("() => { var b = document.querySelector('.dss-rules-play'); if (b) b.click(); }"); r.page.wait_for_timeout(2500)
    r.wait_for("() => !!window._rcDev", 10000, "the Reclamation")
    r.page.locator("#rc-canvas").first.focus()
    for _ in range(12):   # empty the clip: the rifle reloads by itself, or on R
        if r.js("() => window._rcDev.snapshot().reloading"): break
        r.page.keyboard.press("Space"); r.page.wait_for_timeout(350)
        if r.js("() => window._rcDev.snapshot().rounds") == 0: r.page.keyboard.press("r"); r.page.wait_for_timeout(120)
    r.expect(r.js("() => window._rcDev.snapshot().reloading"), "could not get the rifle reloading, so this check proves nothing")
    r.js("() => window._rcDev.lose()")
    r.wait_for("() => { var e = document.getElementById('rc-lose'); return !!e && getComputedStyle(e).display !== 'none'; }", 15000, "the Reclamation's end card")
    r.page.wait_for_timeout(600)
    board = r.js("() => { var b = document.querySelector('.rc-scoreboard'); return b ? b.innerText.replace(/\\s+/g, ' ') : ''; }")
    r.info = "the board at the end: %s" % board[-60:]
    r.expect(board, "no scoreboard on the page")
    r.expect("RELOADING" not in board, "the scoreboard reads RELOADING over the end card")


@check("hold-to-drink-space", "2026-11-16 playtest (for Sam's eye 9, his call delegated): 'Hold to drink' took only a mouse or a finger while the hum and the Climb hold Space; Space holds the glass too")
def hold_to_drink_space(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Dido", wait=7000)
    r.clear_lore(); r.clear_slips()
    r.js("() => window.showDrinkPopup('whisky')")
    r.wait_for("() => !!document.getElementById('drink-popup-overlay')", 6000, "the drink card")
    TXT = "() => { var o = document.getElementById('drink-popup-overlay'); return o ? o.innerText : null; }"
    r.wait_for("() => /Hold to drink/.test((document.getElementById('drink-popup-overlay') || {}).innerText || '')", 8000, "'Hold to drink'")
    r.page.wait_for_timeout(3500)   # the glass fills first
    r.page.keyboard.down("Space"); r.page.wait_for_timeout(900)
    mid = r.js(TXT)
    r.page.wait_for_timeout(5000); r.page.keyboard.up("Space")
    r.expect(mid is None or "Hold to drink" not in mid, "holding Space did not lift the glass ('Hold to drink' still asks)")
    r.wait_for("() => window._drinkPopupOpen !== true", 12000, "the card to close after the drink")
    r.info = "Space drank the glass and the card closed"


@check("ronnies-street-link-band", "2026-11-16 playtest (Friction 5): Ronnie's Drinks scrolls down to the pour, and the fixed '← OUT ONTO THE STREET' sat over the prose; on that page the link wears a band of the panel's dark")
def ronnies_street_link_band(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Ronnie’s Drinks", wait=8000)
    r.clear_lore(); r.clear_slips()
    m = r.js("() => { var l = [].filter.call(document.querySelectorAll('.back-one-link'), function (e) { return !e.closest('.dss-ghost') && e.getClientRects().length; })[0]; if (!l) return null; var cs = getComputedStyle(l); return { bg: cs.backgroundColor, pos: cs.position }; }")
    r.expect(m, "no street link showing on Ronnie's Drinks")
    r.info = "the link: %(pos)s, background %(bg)s" % m
    solid = re.match(r"rgb\(", m["bg"]) or (re.match(r"rgba\(", m["bg"]) and float(m["bg"].rstrip(")").split(",")[-1]) >= 0.97)
    r.expect(solid, "the street link has no band behind it (background %s), so the prose shows through" % m["bg"])


@check("touch-dpad-beside-the-map", "2026-11-16 playtest (Friction 6): on a touch screen as wide as a laptop the Soho map's d-pad sat under the map, 183 px below the fold of Dean Street at 1440x900; it stands beside the map's foot")
def touch_dpad_beside_the_map(r):
    ctx = r.ctx.browser.new_context(viewport={"width": 1440, "height": 900}, has_touch=True, is_mobile=True)
    try:
        page = ctx.new_page()
        errs = []; page.on("pageerror", lambda e: errs.append(str(e)[:200]))
        if SWAPS:
            class _P: pass
            _P.page = page; scratch_passage(_P, "T-nothing", "")
        from urllib.parse import quote
        page.goto("http://127.0.0.1:%d/%s?t=%d&start=%s" % (r.port, HTML, int(time.time()), quote("Dean Street")), timeout=90000)
        page.wait_for_timeout(12000)
        m = page.evaluate("() => { var d = [].filter.call(document.querySelectorAll('.soho-dpad'), function (e) { return !e.closest('.dss-ghost'); })[0], w = document.querySelector('.soho-map-wrap'); if (!d || !w) return null; var b = d.getBoundingClientRect(), q = w.getBoundingClientRect(); return { touch: matchMedia('(hover: none) and (pointer: coarse)').matches, iw: innerWidth, ih: innerHeight, show: getComputedStyle(d).display, top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right), mapRight: Math.round(q.right), mapBottom: Math.round(q.bottom) }; }")
        r.expect(m, "no d-pad or no map on Dean Street")
        r.info = "d-pad %(left)d-%(right)d x %(top)d-%(bottom)d; map ends %(mapRight)d x %(mapBottom)d; window %(iw)dx%(ih)d" % m
        r.expect(m["touch"] and m["iw"] >= 1100, "the browser is not acting as a wide touch screen (%r), so this check proves nothing" % m)
        r.expect(m["show"] != "none", "the d-pad is not shown on a touch screen")
        r.expect(m["bottom"] <= m["ih"], "the d-pad's foot is at %d px of a %d px window" % (m["bottom"], m["ih"]))
        r.expect(m["left"] >= m["mapRight"] - 4, "the d-pad is not beside the map (it starts at %d px, the map ends at %d)" % (m["left"], m["mapRight"]))
        r.expect(m["right"] <= m["iw"], "the d-pad runs off the right edge (%d of %d px)" % (m["right"], m["iw"]))
        r.expect(not errs, "page errors: %s" % errs[:2])
    finally:
        ctx.close()


# ---------------------------------------------------------------- Sam's rulings of 17-18 Nov (built 2026-11-18)
STATS = "() => [].map.call(document.querySelectorAll('#stat-bars-lifted .stat-pct'), function (e) { return parseInt(e.textContent, 10); })"   # [MORALE, SOBRIETY] as the header shows them
NO_HARLOWE_ERROR = "() => [].filter.call(document.querySelectorAll('tw-error'), function (e) { return !e.closest('.dss-ghost'); }).map(function (e) { return e.textContent.slice(0, 120); })"


def press_link(r, text, exact=True):
    """Press a Harlowe link by its words (a JS click, so a parked or hidden link takes it too)."""
    return r.js("([t, ex]) => { var l = [].filter.call(document.querySelectorAll('tw-link'), function (e) { var x = e.textContent.replace(/\\s+/g, ' ').trim(); return !e.closest('.dss-ghost') && (ex ? x === t : x.toLowerCase().indexOf(t.toLowerCase()) >= 0); })[0]; if (l) l.click(); return !!l; }", [text, exact])


@check("night-ahead-says-click", "2026-11-18 (Sam's ruling of 17-18 Nov, \"Yes, good\"): The Night Ahead types for 38 s unless clicked and nothing said a click finishes it; a faint 'Click to finish.' comes in at the foot about 4 s in and goes when the typing ends or is clicked through, on that page alone")
def night_ahead_says_click(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    HINT = "() => { var h = document.querySelector('.tw-skip-hint'); if (!h) return null; var b = h.getBoundingClientRect(); return { t: h.textContent.trim(), op: +(+getComputedStyle(h).opacity).toFixed(2), bottom: Math.round(b.bottom) }; }"
    WAY = "() => { var l = [].filter.call(document.querySelectorAll('.typewriter-page tw-link'), function (e) { return !e.closest('.dss-ghost'); })[0]; return l ? +getComputedStyle(l.closest('tw-expression') || l).opacity : -1; }"
    bad = []
    for W, H in ((1440, 900), (1280, 800)):
        r.page.set_viewport_size({"width": W, "height": H})
        r.go("The Night Ahead", wait=1900)
        early = r.js(HINT)
        if early and early["op"] > 0.05: bad.append("%dx%d: the line is up at once (%r)" % (W, H, early))
        r.page.wait_for_timeout(5200)   # about 7 s in: the line came at 4 s and has faded up
        h = r.js(HINT); over = r.js("() => document.scrollingElement.scrollHeight - innerHeight")
        if not h or h["op"] < 0.5: bad.append("%dx%d: no 'Click to finish.' 7 s into the typing (%r)" % (W, H, h))
        elif h["t"] != "Click to finish.": bad.append("%dx%d: the line reads %r" % (W, H, h["t"]))
        elif h["bottom"] > H: bad.append("%dx%d: the line's foot is at %d px" % (W, H, h["bottom"]))
        if over > 0: bad.append("%dx%d: the page runs %d px past the window" % (W, H, over))
        r.page.mouse.click(40, 320)   # a click on the page finishes the typing
        r.page.wait_for_timeout(1600)
        h = r.js(HINT)
        if h and h["op"] > 0.1: bad.append("%dx%d: the line stays after the click (%r)" % (W, H, h))
        if r.js(WAY) < 0.3: bad.append("%dx%d: the click did not finish the page (the way on is not showing)" % (W, H))
    # left alone, the line goes when the typing ends
    r.page.set_viewport_size({"width": 1440, "height": 900})
    r.go("The Night Ahead", wait=6500)
    r.expect((r.js(HINT) or {}).get("op", 0) > 0.5, "no line on the page left to type itself")
    r.wait_for("(%s)() > 0.3" % WAY, 60000, "the page to finish typing by itself")
    r.page.wait_for_timeout(1500)
    h = r.js(HINT)
    if h and h["op"] > 0.1: bad.append("the line stays after the typing ends (%r)" % h)
    # and no other typewriter page has one (his 2 Nov ruling)
    r.go("Night Ahead Part Two", wait=7500)
    r.expect(r.js("() => !!document.querySelector('.typewriter-page')"), "Night Ahead Part Two is not a typewriter page, so this check proves nothing about the others")
    h = r.js(HINT)
    if h: bad.append("Night Ahead Part Two shows a line too (%r)" % h)
    r.info = "the line comes about 4 s in, goes on a click and when the typing ends; Part Two has none"
    r.expect(not bad, "; ".join(bad))


@check("maltese-thirty-once", "2026-11-18 (Sam's ruling of 17-18 Nov, \"Fix the repeat\"): the Maltese Gangsters page pays SOBRIETY +30, and '← Back' from the Copper's Lair approach returned to it and paid again each time; it pays once a night")
def maltese_thirty_once(r):
    scratch_passage(r, "T-malt", '(set: $sobriety to 40)(set: $prevSobriety to 40)(set: $confidence to 60)(set: $prevConfidence to 60)(set: $metSalvu to false)(set: $statsExplained to true)[[Walk on|Maltese Gangsters]]')
    r.go("T-malt", wait=5000); r.clear_lore(); r.clear_slips()   # a first night's slips hold every press until read
    r.expect(press_link(r, "Walk on"), "the scratch page has no way on")
    seen = []
    for lap in range(2):
        r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Maltese Gangsters'", 12000, "the Maltese Gangsters page")
        r.page.wait_for_timeout(2500); r.clear_lore(); r.clear_slips()
        r.expect(press_link(r, "continue"), "no way on from the Maltese Gangsters page")
        r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Approach Coppers Lair'", 12000, "the Copper's Lair approach")
        r.page.wait_for_timeout(3000); r.clear_lore(); r.clear_slips()
        st = r.js(STATS); r.expect(len(st) == 2, "no stat bars on the Copper's Lair approach (%r)" % st)
        seen.append(st[1])
        if lap == 0: r.expect(press_link(r, "← Back"), "no '← Back' on the Copper's Lair approach")
    r.info = "SOBRIETY 40, then %d after the first knock and %d after going back and knocking again" % (seen[0], seen[1])
    r.expect(not r.js(NO_HARLOWE_ERROR), "a Harlowe error on the page: %s" % r.js(NO_HARLOWE_ERROR))
    r.expect(seen[0] == 70, "the first arrival took SOBRIETY from 40 to %d, not 70" % seen[0])
    r.expect(seen[1] == seen[0], "going back and in again paid a second time: SOBRIETY %d, then %d" % (seen[0], seen[1]))


@check("haircut-once-a-run", "2026-11-18 (Sam's ruling of 17-18 Nov, \"Once a run on haircut\"): the barber's haircut gave MORALE +6 every night; it is once a run, the shave stays once a night, and a fresh BEGIN forgets it")
def haircut_once_a_run(r):
    OFFERS = "() => [].filter.call(document.querySelectorAll('tw-passage tw-link'), function (e) { return !e.closest('.dss-ghost'); }).map(function (e) { return e.textContent.trim(); })"
    PARKED = "() => [].map.call(document.querySelectorAll('#dss-alba-carry tw-link'), function (e) { return e.textContent.trim(); })"
    SET = '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 2 Set")(set: $prevConfidence to $confidence)(set: $prevSobriety to $sobriety)(set: $returns to 6)'
    # 1. the barber on a night whose run has had its haircut: the shave alone
    scratch_passage(r, "T-cut", SET + '(set: $barberCutRun to true)[[Walk on|The Barbershop]]')
    r.go("T-cut", wait=5000); r.expect(press_link(r, "Walk on"), "the scratch page has no way on")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'The Barbershop'", 12000, "the Barbershop")
    r.page.wait_for_timeout(2500); r.clear_lore(); r.clear_slips()
    later = r.js(OFFERS)
    r.expect(not r.js(NO_HARLOWE_ERROR), "a Harlowe error at the barber's: %s" % r.js(NO_HARLOWE_ERROR))
    r.expect("A shave" in later, "no shave offered on a later night of the run (%s)" % later)
    r.expect("A haircut" not in later, "the haircut is offered again on a later night of the same run (%s)" % later)
    r.page.unroute("**/*")
    # 2. a first visit offers both; the haircut is remembered for the run's next night
    scratch_passage(r, "T-cut", SET + '[[Walk on|The Barbershop]]')
    r.go("T-cut", wait=5000); r.js("() => localStorage.removeItem('dssCutHeld')"); r.expect(press_link(r, "Walk on"), "the scratch page has no way on")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'The Barbershop'", 12000, "the Barbershop")
    r.page.wait_for_timeout(2500); r.clear_lore(); r.clear_slips()
    first = r.js(OFFERS)
    r.expect("A haircut" in first and "A shave" in first, "a first visit does not offer both (%s)" % first)
    press_link(r, "A haircut"); r.page.wait_for_timeout(1200)
    press_link(r, "Back to the street")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street'", 12000, "Dean Street")
    r.page.wait_for_timeout(2500)
    r.expect(r.js("() => localStorage.getItem('dssCutHeld')") == "1", "the haircut was not kept for the run's next night (dssCutHeld is %r)" % r.js("() => localStorage.getItem('dssCutHeld')"))
    r.page.unroute("**/*")
    if SWAPS: scratch_passage(r, "T-nothing", "")
    # 3. Another night of the same run brings it back: the parked carry is pressed, and the street's header still holds it
    r.js("() => { localStorage.setItem('dssRunCarry', '1'); localStorage.setItem('dssCutHeld', '1'); }")
    r.go("Start", wait=6000)
    r.expect(r.pn() == "The Night Ahead", "Start did not lead to The Night Ahead (on %s)" % r.pn())
    parked = r.js(PARKED)
    r.expect("cut-carry" not in parked, "the run's haircut was not carried into its next night (still parked: %s)" % parked)
    r.page.mouse.click(40, 320); r.page.wait_for_timeout(2500)
    r.expect(press_link(r, "Step into the night"), "no way on from The Night Ahead")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street'", 15000, "Dean Street")
    r.page.wait_for_timeout(3000)
    r.expect(r.js("() => localStorage.getItem('dssCutHeld')") == "1", "the carried haircut was lost by Dean Street (dssCutHeld is %r)" % r.js("() => localStorage.getItem('dssCutHeld')"))
    # 4. a fresh BEGIN forgets it
    r.js("() => { localStorage.removeItem('dssRunCarry'); localStorage.setItem('dssCutHeld', '1'); }")
    r.go("Start", wait=6000)
    r.expect("cut-carry" in r.js(PARKED), "a fresh BEGIN carried the last run's haircut")
    r.expect(r.js("() => localStorage.getItem('dssCutHeld')") is None, "a fresh BEGIN kept the last run's haircut (dssCutHeld is %r)" % r.js("() => localStorage.getItem('dssCutHeld')"))
    r.info = "later night: %s; first visit: %s; carried by Another night, forgotten by BEGIN" % (later, first)


def doorway_visit(r, link="Livonia Street"):
    """One doorway visit from Dean Street: press its link, hold the card until it closes, and say how the two bars moved and whether their numbers showed."""
    r.clear_lore(); r.clear_slips()
    before = r.js(STATS)
    r.expect(press_link(r, link), "no %r on Dean Street" % link)
    r.wait_for("() => !!document.querySelector('#spew-popup-overlay canvas')", 10000, "the doorway card")
    r.page.wait_for_timeout(900)
    box = r.js("() => { var b = document.querySelector('#spew-popup-overlay canvas').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
    r.page.mouse.move(*box); r.page.mouse.down(); r.page.wait_for_timeout(1500); r.page.mouse.up()
    r.wait_for("() => !document.getElementById('spew-popup-overlay')", 15000, "the card to close")
    shown = 0
    for _ in range(14):   # the numbers come once the card has gone
        r.page.wait_for_timeout(200)
        shown = max(shown, r.js("() => [].filter.call(document.querySelectorAll('#stat-bars-lifted .stat-delta'), function (d) { return +getComputedStyle(d).opacity > 0.4; }).length"))
    r.page.wait_for_timeout(1200)
    after = r.js(STATS)
    return [after[0] - before[0], after[1] - before[1], shown]


@check("doorway-taper", "2026-11-18 (Sam's ruling of 17-18 Nov, \"Do your pick\"): every doorway visit paid MORALE +4 and SOBRIETY +6; each visit before the next venue pays half the one before (4 and 6, 2 and 3, 1 and 1, nothing), and a venue starts it again")
def doorway_taper(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Test Start 2", wait=10000)
    r.clear_lore(); r.clear_slips(); r.clear_lore()
    got = [doorway_visit(r) for _ in range(4)]
    r.expect(not r.js(NO_HARLOWE_ERROR), "a Harlowe error on Dean Street: %s" % r.js(NO_HARLOWE_ERROR))
    r.info = "four visits running: %s" % ", ".join("+%d/+%d (%d numbers shown)" % tuple(g) for g in got)
    r.expect([g[:2] for g in got] == [[4, 6], [2, 3], [1, 1], [0, 0]], "four visits running paid %s, not +4/+6, +2/+3, +1/+1, nothing" % [g[:2] for g in got])
    r.expect(got[0][2] == 2 and got[1][2] == 2 and got[2][2] == 2, "a paying visit showed no numbers by the bars (numbers shown per visit: %s)" % [g[2] for g in got])
    # a venue starts it again
    if SWAPS: r.page.unroute("**/*")
    scratch_passage(r, "T-door", '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 2 Set")(set: $prevConfidence to $confidence)(set: $prevSobriety to $sobriety)(set: $returns to 6)(set: $doorwayRun to 3)[[In|Ronnie’s Drinks]]')
    r.go("T-door", wait=5000); r.expect(press_link(r, "In"), "the scratch page has no way on")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Ronnie’s Drinks'", 12000, "Ronnie's Drinks")
    r.page.wait_for_timeout(3000); r.clear_lore(); r.clear_slips()
    r.expect(press_link(r, "out onto the street", exact=False), "no way out of Ronnie's Drinks (links: %s)" % r.js("() => [].map.call(document.querySelectorAll('tw-link'), function (e) { return e.textContent.trim(); })"))
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street'", 15000, "Dean Street")
    r.page.wait_for_timeout(4000)
    again = doorway_visit(r)
    r.info += "; after a venue: +%d/+%d" % (again[0], again[1])
    r.expect(again[:2] == [4, 6], "the first doorway after a venue paid +%d/+%d, not +4/+6" % (again[0], again[1]))


@check("doorway-press-waits", "2026-11-18 (Sam's playtest, Test Start 4): a second doorway visit seconds after the first gave no gain, no card and no slip. E was dropped without a word when pressed while the walker was still stepping onto the doorway, or while anything was up; the press now waits and goes in (plant: function doorwayAhead(){if(S.entering)return null;|||function doorwayAhead(){if(S.entering||S.moving||busy())return null;)")
def doorway_press_waits(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Test Start 4", wait=10000)
    CARD = "() => !!document.querySelector('#spew-popup-overlay canvas')"
    MAP = "() => !!(window.dssSohoMap && window.dssSohoMap.state && window.dssSohoMap.state.alive && typeof window.__dssSohoTeleport === 'function')"

    def hold_card():
        r.page.wait_for_timeout(900)
        box = r.js("() => { var b = document.querySelector('#spew-popup-overlay canvas').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }")
        r.page.mouse.move(*box); r.page.mouse.down(); r.page.wait_for_timeout(1500); r.page.mouse.up()
        r.wait_for("() => !document.getElementById('spew-popup-overlay')", 15000, "the card to close")
        r.wait_for(MAP, 10000, "the Soho map back after the card")

    def step_on_and_press(visit):
        """From the tile beside the Livonia Street doorway, step onto it and press E at once, as a player does while the walker is still moving."""
        r.clear_lore(); r.clear_slips()
        r.wait_for(MAP, 15000, "the Soho map")
        r.expect(r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", [5, 10]), "the tile beside the Livonia Street doorway is not walkable")
        r.page.wait_for_timeout(600)
        r.page.keyboard.press("ArrowLeft")
        moving = r.js("() => !!window.dssSohoMap.state.moving")
        r.page.keyboard.press("e")
        r.expect(moving, "the %s visit: the walker had finished the step before E, so this visit proves nothing" % visit)
        r.wait_for(CARD, 5000, "the doorway card after E pressed mid-step (%s visit)" % visit)
        hold_card()

    step_on_and_press("first")
    step_on_and_press("second")   # Sam's case: seconds after the first card has gone
    # with something up (a stand-in for the gold wheel after a haunt), standing in the doorway: the press waits, then goes in
    r.clear_lore(); r.clear_slips()
    r.wait_for(MAP, 15000, "the Soho map")
    r.expect(r.js("([c, rr]) => window.__dssSohoTeleport(c, rr)", [4, 10]), "the Livonia Street doorway's tile is not walkable")
    r.page.wait_for_timeout(700)
    r.js("() => { var o = document.createElement('div'); o.id = 'dss-gate-flash'; o.style.cssText = 'position:fixed;left:0;top:0;width:10px;height:10px;pointer-events:none'; document.body.appendChild(o); }")
    r.page.wait_for_timeout(300)
    r.page.keyboard.press("e")
    r.page.wait_for_timeout(1500)
    held = r.js("() => { var b = [].filter.call(document.querySelectorAll('.dss-doorway-btn'), function (e) { return !e.closest('.dss-ghost') && e.getClientRects().length; })[0]; return { card: !!document.getElementById('spew-popup-overlay'), btn: b ? (b.style.opacity || '1') : null, want: !!window.dssSohoMap.state.doorWant }; }")
    r.expect(not held["card"], "the doorway went in over something that was up")
    r.expect(held["want"], "E in the doorway while something was up was dropped (nothing held it)")
    r.expect(held["btn"] is not None and abs(float(held["btn"]) - 0.5) < 0.01, "the doorway button is %r while the press waits (wanted shown and dimmed to .5)" % held["btn"])
    r.js("() => document.getElementById('dss-gate-flash').remove()")
    r.wait_for(CARD, 4000, "the doorway card once nothing was up")
    hold_card()
    r.info = "E mid-step went in twice running; E under an overlay waited (button %s) and went in when it cleared" % held["btn"]


@check("oi-globe-bar", "2026-11-18 (Sam: O'Flatterly's globe is a globe bar, \"so you can zoom in on it\", and \"when you open it you would be able to pour a dram of whisky\"): looking at it opens the lid; its card pours one dram a night, which costs sobriety and plays the whisky card; stepping back closes the lid (plants: k.byText(['Pour a dram'])|||k.byText(['No dram']) and globeWant = on ? 1 : 0;|||globeWant = 0;)")
def oi_globe_bar(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("O'Flatterly's shop", wait=10000)
    r.room_ready("oi")
    G = "() => window._dssOiGlobe ? { open: window._dssOiGlobe.open(), rx: window._dssOiGlobe.lid.rotation.x } : null"
    g0 = r.js(G)
    r.expect(g0, "no globe bar in the shop (window._dssOiGlobe)")
    r.expect(g0["open"] < 0.05, "the lid is open before anyone looks (%r)" % g0)
    r.click_object("oi", "A globe"); r.page.wait_for_timeout(1200)
    g1 = r.js(G)
    r.expect(g1["open"] > 0.95 and g1["rx"] < -1.8, "looking at the globe did not open its lid (%r)" % g1)
    LIDS = "() => window.__dssGlobeLids || 0"
    r.expect(r.js(LIDS) == 1, "the lid opened with %d plays of Sam's lid sound, not one (2026-11-19, \"Bar opening\")" % r.js(LIDS))
    r.expect("Pour a dram" in r.card_buttons(), "the globe's card has no 'Pour a dram' (buttons: %r)" % r.card_buttons())
    before = r.js(STATS)
    r.page.locator(".fi-action:visible", has_text="Pour a dram").first.click()
    r.wait_for("() => /Hold to drink/.test((document.getElementById('drink-popup-overlay') || {}).innerText || '')", 15000, "the whisky card's 'Hold to drink'")
    r.page.wait_for_timeout(3500)   # the glass fills first
    r.page.keyboard.down("Space"); r.page.wait_for_timeout(6000); r.page.keyboard.up("Space")
    r.wait_for("() => window._drinkPopupOpen !== true", 12000, "the whisky card to close after the drink")
    after = r.js(STATS)
    r.expect(after[1] < before[1], "the dram cost no sobriety (%r, then %r)" % (before, after))
    r.room_ready("oi")
    r.click_object("oi", "A globe"); r.page.wait_for_timeout(1200)
    r.expect("Pour a dram" not in r.card_buttons(), "a second dram is offered the same night (buttons: %r)" % r.card_buttons())
    r.back_click("oi"); r.page.wait_for_timeout(2500)
    g2 = r.js(G)
    r.expect(g2["open"] < 0.05, "stepping back did not close the lid (%r)" % g2)
    r.expect(r.js(LIDS) == 2, "the lid sound played %d times over two openings and a closing (once per opening, never on closing)" % r.js(LIDS))
    r.info = "lid opened to %.2f rad on the look, with Sam's lid sound once per opening; a dram took sobriety %d to %d; none offered after; the lid closed" % (g1["rx"], before[1], after[1])


@check("portal-button-wait", "2026-11-18 (Sam's ruling of 17-18 Nov, \"Middle way\"): the Third Pillar Portal shows nothing to press for about 10 s; the first crossing of a run keeps that, a later crossing in the same run shows its button after about 3 s")
def portal_button_wait(r):
    BTN = "() => { var b = [].filter.call(document.querySelectorAll('div'), function (e) { return /^(MAKE YOUR OFFERING|STEP THROUGH|BACK TO THE PILLARS)$/.test(e.textContent.trim()) && e.style.position === 'fixed'; })[0]; return b ? { t: b.textContent.trim(), on: b.style.opacity === '1' } : null; }"
    scratch_passage(r, "T-portal", '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 3 Set")(set: $returns to 12)[[Walk on|Third Pillar Portal]]')

    def crossing(run):
        r.go("T-portal", wait=4000)
        r.js("([n]) => localStorage.setItem('dssRunFirst', n)", [run])
        r.expect(press_link(r, "Walk on"), "the scratch page has no way on")
        r.wait_for("(%s)() !== null" % BTN, 30000, "the portal's button to be made")
        t0 = time.time(); b = r.js(BTN)
        while not b["on"] and time.time() - t0 < 12:
            r.page.wait_for_timeout(100); b = r.js(BTN)
        return b["t"], time.time() - t0

    t1, w1 = crossing("7"); t2, w2 = crossing("7"); t3, w3 = crossing("8")
    r.info = "%s: %.1f s on the run's first crossing, %.1f s on its second, %.1f s on a new run's first (each then fades in over 2 s)" % (t1, w1, w2, w3)
    r.expect(t1 != "BACK TO THE PILLARS", "the scratch state does not open the crossing, so this check proves nothing")
    r.expect(6.3 <= w1 <= 8.2, "the first crossing's button started in after %.1f s, not about 7.2" % w1)
    r.expect(w2 <= 1.9, "a later crossing in the same run still waits %.1f s for its button" % w2)
    r.expect(6.3 <= w3 <= 8.2, "a new run's first crossing waited %.1f s, not about 7.2" % w3)


def touch_page(r, passage="Dean Street", wait=12000):
    """A second page that acts as a touch screen as wide as a laptop (the checks' own page has a mouse)."""
    ctx = r.ctx.browser.new_context(viewport={"width": 1440, "height": 900}, has_touch=True, is_mobile=True)
    page = ctx.new_page()
    if SWAPS:
        class _P: pass
        _P.page = page; scratch_passage(_P, "T-nothing", "")
    from urllib.parse import quote
    page.goto("http://127.0.0.1:%d/%s?t=%d&start=%s" % (r.port, HTML, int(time.time()), quote(passage)), timeout=90000)
    page.wait_for_timeout(wait)
    return ctx, page


@check("touch-caption-no-below", "2026-11-18 (Sam's ruling of 17-18 Nov, \"Your pick\"): the touch caption said 'Use the arrows below to walk' while on a wide touch screen the arrows stand beside the map; it says 'Use the arrows to walk.'")
def touch_caption_no_below(r):
    ctx, page = touch_page(r, wait=9000)
    try:
        cap = ""
        for _ in range(20):
            cap = page.evaluate("() => { var n = [].filter.call(document.querySelectorAll('.smb-note'), function (e) { return !e.closest('.dss-ghost'); })[0]; return n ? n.textContent.trim() : ''; }")
            if cap: break
            page.wait_for_timeout(500)
        r.info = "the caption: %s" % cap
        r.expect(page.evaluate("() => matchMedia('(hover: none) and (pointer: coarse)').matches"), "the browser is not acting as a touch screen, so this check proves nothing")
        r.expect(cap == "Use the arrows to walk. Stop on a lit step, or tap a door’s name, to go in.", "the first-walk caption on a touch screen reads %r" % cap)
    finally:
        ctx.close()


# ---------------------------------------------------------------- the Climb (2026-11-18), played through its own test hooks (window._hcDev: snapshot, warp)
CLIMB = """() => { function up(id) { var e = document.getElementById(id); return !!e && getComputedStyle(e).display !== 'none'; } var s = window._hcDev.snapshot();
  return { s: s.s, u: s.u, dy: s.y - s.ground, w: s.width, slips: s.slips, prints: s.prints, whirl: s.whirl, fin: s.finished, gr: s.grounded, gust: s.gust, wind: s.wind, ending: s.ending,
    hud: (document.getElementById('hc-hud') || {}).textContent || '', hudH: (document.getElementById('hc-hud') || {}).offsetHeight || 0, ban: (document.getElementById('hc-banner') || {}).textContent || '',
    card: !!document.querySelector('.dss-ease-card'), lose: up('hc-lose'), win: up('hc-win'), over: document.scrollingElement.scrollHeight - innerHeight }; }"""


def climb_start(r):
    r.go("The Climb", wait=8000)
    r.expect(r.js("() => !!window._hcDev"), "the Climb's test hooks are missing (the dev flag is off), so it cannot be played here")
    r.js("() => { var b = document.querySelector('.dss-rules-play'); if (b) b.click(); }"); r.page.wait_for_timeout(1300)
    r.page.locator("#hc-canvas").first.focus()
    r.page.keyboard.press("ArrowRight"); r.page.wait_for_timeout(300)   # any key starts the climb


def climb_settle(r):
    """Wait out a rescue; a fresh climb when the slips are nearly spent (the fourth ends it)."""
    for _ in range(60):
        if not r.js(CLIMB)["whirl"]: break
        r.page.wait_for_timeout(100)
    m = r.js(CLIMB)
    if m["slips"] >= 3 or m["fin"]: climb_start(r)


@check("climb-lost-on-slips", "2026-11-16 playtest (Friction 1 and 2, Looks wrong 2): a climber stuck on the mountain never saw TRY AGAIN / MOVE ON, because the climb was judged only at the summit; a held up-arrow stood still after 'SAFE AT THE FLAGS'; and 'THE WIND KEEPS YOU' showed on a fall in calm air")
def climb_lost_on_slips(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    climb_start(r)
    kb = r.page.keyboard; kb.down("ArrowUp")
    t0 = time.time(); prev = r.js(CLIMB); falls = []; downs = 0; held = None; left = False; left_until = 0; end = prev
    while time.time() - t0 < 150:
        m = r.js(CLIMB); now = time.time() - t0
        if m["whirl"] and not prev["whirl"]:
            falls.append((m["ban"], m["gust"], m["wind"]))
            if left: kb.up("ArrowLeft"); left = False
        if prev["whirl"] and not m["whirl"]:
            downs += 1
            if downs == 1 and not m["fin"]: held = [m["s"], m["s"], now]            # where he was set down, the furthest since, when
            if downs == 2 and not m["fin"]: kb.down("ArrowLeft"); left = True; left_until = now + 4   # off the side while the rescue's calm holds
        if held and now - held[2] <= 3.2: held[1] = max(held[1], m["s"])
        if held and now - held[2] > 3.2 and held[1] - held[0] < 1.0: end = m; break   # the held arrow was dropped: he will stand here for good
        if left and now > left_until: kb.up("ArrowLeft"); left = False
        end = m
        if m["fin"] or m["slips"] >= 6: break
        prev = m; r.page.wait_for_timeout(110)
    kb.up("ArrowUp")
    if left: kb.up("ArrowLeft")
    r.page.wait_for_timeout(900); end = r.js(CLIMB)
    calm = [f for f in falls if f[1] != "blowing" and abs(f[2]) < 0.3]
    windy = [f for f in falls if f[1] == "blowing" or abs(f[2]) > 0.6]
    r.info = "%d slips in %.0f s; set down at %s and walked on to %s with the arrow held; falls: %s" % (end["slips"], time.time() - t0, held and round(held[0], 1), held and round(held[1], 1), "; ".join("%s (gust %s, wind %.2f)" % f for f in falls))
    r.expect(held is not None, "the climber never fell, so nothing was judged")
    r.expect(held[1] - held[0] >= 1.0, "after SAFE AT THE FLAGS the held up-arrow did nothing: set down at %.1f, still at %.1f three seconds on" % (held[0], held[1]))
    r.expect(end["fin"] and end["card"], "slips reached %d and no TRY AGAIN / MOVE ON card came" % end["slips"])
    r.expect(end["slips"] == 4, "the card came at %d slips, not at the fourth (one past the three allowed)" % end["slips"])
    r.expect(end["lose"] and not end["win"], "a climb lost on slips does not show the losing way on alone (lose %s, win %s)" % (end["lose"], end["win"]))
    r.expect(calm, "no fall happened in calm air, so the SWEPT BACK wording was not judged")
    r.expect(all(f[0] == "SWEPT BACK" for f in calm), "a fall in calm air said %r" % [f[0] for f in calm if f[0] != "SWEPT BACK"][:1])
    r.expect(all("THE WIND KEEPS YOU" in f[0] for f in windy), "a fall in wind said %r" % [f[0] for f in windy if "THE WIND KEEPS YOU" not in f[0]][:1])


@check("climb-side-is-a-fall", "2026-11-18 (Sam, playing the Climb by hand: \"I was able to walk quite far off the path before it noticed\"): a walker who stepped off the side of the path did not fall; he walked on air until three units past the edge")
def climb_side_is_a_fall(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    climb_start(r)
    kb = r.page.keyboard; notes = []; bad = []
    for key in ("ArrowLeft", "ArrowRight"):
        climb_settle(r)
        r.js("() => window._hcDev.warp(110)"); r.page.wait_for_timeout(80)
        m0 = r.js(CLIMB); kb.down(key); t0 = time.time(); far = 0; low = 0; off = None; slip = None
        while time.time() - t0 < 5:
            m = r.js(CLIMB)
            if m["whirl"] or m["slips"] > m0["slips"]: slip = time.time(); break
            beyond = abs(m["u"]) - m["w"] / 2
            if beyond > 0 and off is None: off = time.time()
            far = max(far, beyond); low = min(low, m["dy"])
            r.page.wait_for_timeout(20)
        kb.up(key)
        notes.append("%s: %.1f past the edge, %.1f below the snow, the slip %.2f s after leaving the path" % (key, far, -low, (slip or 0) - (off or 0)))
        if slip is None or off is None: bad.append("%s: walking off the side for 5 s was never a slip" % key)
        elif low > -0.6: bad.append("%s: he walked on air, %.1f units past the edge, never lower than %.2f below the snow" % (key, far, -low))
        elif far > 2.5: bad.append("%s: he was %.1f units past the edge before it was a fall" % (key, far))
    # and the path itself still holds a walker: a gap's lip stops him, standing, with no slip
    climb_settle(r); r.js("() => window._hcDev.warp(27)"); m0 = r.js(CLIMB); kb.down("ArrowUp"); r.page.wait_for_timeout(1500); kb.up("ArrowUp"); m = r.js(CLIMB)
    if not (29.9 < m["s"] < 30.0 and m["gr"] and m["slips"] == m0["slips"]): bad.append("the first gap's lip no longer stops a walker (at %.2f, on the ground %s, slips +%d)" % (m["s"], m["gr"], m["slips"] - m0["slips"]))
    r.info = "; ".join(notes)
    r.expect(not bad, "; ".join(bad))


@check("climb-gap-is-a-fall", "2026-11-18 (Sam, playing the Climb by hand: \"I jumped down one of the gaps and it didn't register that as a fall\"): a jump that came down inside a gap carried on under the far lip and fell on beneath the mountain, 50 units down, with no slip")
def climb_gap_is_a_fall(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    climb_start(r)
    kb = r.page.keyboard; notes = []; bad = []
    for lip in (74, 151, 410):
        # set him down half a unit inside the gap, at the lip's height, walking on: where a jump that fell short comes down. (Hops timed by hand were tried
        # first: the same hop went in or over from one run to the next, so the place is set and the fall is watched.)
        climb_settle(r)
        kb.down("ArrowUp"); r.js("([a]) => window._hcDev.warp(a)", [lip + 0.5]); m0 = r.js(CLIMB); t0 = time.time(); low = 0; slip = False; m = m0
        while time.time() - t0 < 2.6:
            m = r.js(CLIMB)
            if m["whirl"] or m["slips"] > m0["slips"]: slip = True; break
            low = min(low, m["dy"]); r.page.wait_for_timeout(15)
        kb.up("ArrowUp")
        notes.append("in the gap at %d: %s, %.1f below at the lowest" % (lip, "a slip after %.2f s" % (time.time() - t0) if slip else "NO slip", -low))
        if not slip: bad.append("coming down in the gap at %d was not a fall: 2.6 s on he is %.1f below the snow at %.1f with no slip" % (lip, -low, m["s"]))
        elif low < -3.5: bad.append("the fall into the gap at %d went %.1f below the snow before it counted" % (lip, -low))
    over = None
    for _ in range(4):   # a full jump still makes it (the wind can take one; four tries)
        climb_settle(r)
        r.js("() => window._hcDev.warp(72.2)"); r.page.wait_for_timeout(80); m0 = r.js(CLIMB)
        kb.down("ArrowUp"); kb.down("Space"); r.page.wait_for_timeout(700); kb.up("Space"); r.page.wait_for_timeout(900); kb.up("ArrowUp"); m = r.js(CLIMB)
        if m["s"] > 75.5 and m["gr"] and m["slips"] == m0["slips"] and not m["whirl"]: over = m["s"]; break
    notes.append("a held jump from 1.8 back: %s" % ("across to %.1f" % over if over else "never across in four tries"))
    if not over: bad.append("a held jump over the gap at 74 did not land in four tries")
    r.info = "; ".join(notes)
    r.expect(not bad, "; ".join(bad))


@check("climb-bonus-on-slips", "2026-11-18 (Sam, playing the Climb: \"The 'prints' following part of this is redundant now\"; the trail stays: \"Yes, keep trail\"): the PRINTS count is retired; the HUD and the card no longer name it and the bonus is judged on slips alone")
def climb_bonus_on_slips(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("The Climb", wait=8000)
    words = r.js("() => document.body.innerText.replace(/\\s+/g, ' ')")
    r.expect("Keep at most 3 slips for the bonus." in words, "the card does not say 'Keep at most 3 slips for the bonus.'")
    r.expect("footprints with" not in words and not r.js("() => !!document.querySelector('.hc-need-p')"), "the card still asks for a number of footprints")
    r.expect("FOLLOW THE BLUE FOOTPRINTS" in words, "the card lost FOLLOW THE BLUE FOOTPRINTS, which stays")
    climb_start(r)
    kb = r.page.keyboard; kb.down("ArrowUp"); huds = []; hs = []; over = 0
    for _ in range(25):
        m = r.js(CLIMB); huds.append(m["hud"]); over = max(over, m["over"])
        if m["hudH"]: hs.append(m["hudH"])
        r.page.wait_for_timeout(120)
    kb.up("ArrowUp")
    r.expect(any("SLIPS 0 / 3" in h and "BREATH" in h for h in huds), "the strip shows no SLIPS and BREATH while climbing (%r)" % huds[-1])
    r.expect(not any("PRINTS" in h for h in huds), "the strip still counts PRINTS (%r)" % [h for h in huds if "PRINTS" in h][0][:80] if any("PRINTS" in h for h in huds) else "")
    r.expect(hs and max(hs) - min(hs) <= 1, "the strip changed height while climbing (%s px)" % sorted(set(hs)))
    r.expect(over <= 0, "the page ran %d px past the window while climbing" % over)
    r.expect(r.js("() => window._hcDev.snapshot().activePrints") > 0, "no blue prints are laid on the snow: the trail has gone with the count")
    # the summit with no slips and fewer than ten prints: the bonus all the same
    climb_start(r)
    kb.press("e"); r.page.wait_for_timeout(300)   # the test key: set down nine units under the summit
    kb.down("ArrowUp"); m = r.js(CLIMB); t0 = time.time()
    while time.time() - t0 < 40 and not m["fin"]:
        r.page.wait_for_timeout(250); m = r.js(CLIMB)
    kb.up("ArrowUp"); r.page.wait_for_timeout(600); m = r.js(CLIMB)
    r.info = "the summit with %d slips and %d prints: %s" % (m["slips"], m["prints"], "the bonus" if m["win"] else "no bonus")
    r.expect(m["fin"], "the climber did not reach the summit from nine units under it (at %.1f, slips %d)" % (m["s"], m["slips"]))
    r.expect(m["slips"] <= 3 and m["prints"] < 10, "this run had %d slips and %d prints, so it does not show the bonus is judged on slips alone" % (m["slips"], m["prints"]))
    r.expect(m["win"] and not m["lose"], "a summit with %d slips and %d prints did not win the bonus" % (m["slips"], m["prints"]))


@check("airport-pub-drawn-together", "2026-11-18 (Sam, the Airport Pub at 44 fps: \"Yes, cut them\"): the pub drew 1,449 separate objects a frame and carried twelve point lights; its still furniture is joined into a few meshes (dssBatchStatic) and the two troffer lights are gone, their wash kept as a faint glow on the concourse floor. 2026-11-19 (Sam: \"Airport Pub\"): five more lights went (the three track spots, the back-bar spot, the shelf strip), 10 to 13 ms a frame headless down to about 5.5; spots cost the most")
def airport_pub_drawn_together(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Airport Pub", wait=12000)
    r.clear_lore(); r.clear_slips()
    m = r.js("""() => new Promise(function (res) { var R = window._dssThreeRegistry && window._dssThreeRegistry['ap-wrap']; if (!R) return res(null);
      var pts = 0, spots = 0, shadows = 0, floor = null; R.scene.traverse(function (o) { if (o.isPointLight && o.visible) pts++; if (o.isSpotLight && o.visible) { spots++; if (o.castShadow) shadows++; }
        if (o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 90 && o.getWorldPosition(new THREE.Vector3()).y < 1) floor = o; });
      var n = 0, t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res({ batch: window._dssApBatch || null, calls: R.renderer.info.render.calls, pts: pts, spots: spots, shadows: shadows, glow: floor ? floor.material.emissive.getHex() : -1, fps: Math.round(n / 3) }); })(); })""")
    r.expect(m, "the Airport Pub's 3D scene did not come up")
    r.info = "%s still meshes joined into %s; %d draw calls a frame; %d point lights, %d spots (%d shadowed); %d fps here" % ((m["batch"] or {}).get("joined"), (m["batch"] or {}).get("meshes"), m["calls"], m["pts"], m["spots"], m["shadows"], m["fps"])
    r.expect(m["batch"] and m["batch"]["joined"] >= 800, "the pub's still furniture is not joined: %s" % m["batch"])
    r.expect(m["calls"] <= 800, "the pub draws %d objects a frame (it was 1,449 unjoined, about 620 joined)" % m["calls"])
    r.expect(m["pts"] <= 9, "the pub has %d point lights; nine since the shelf strip went" % m["pts"])
    r.expect(m["spots"] <= 3, "the pub has %d spot lights; the three threshold downlights are enough, and every spot over them cost about a millisecond a frame" % m["spots"])
    r.expect(m["shadows"] == 2, "the threshold's two shadowed downlights are %d now (both stay: dropping one gained nothing)" % m["shadows"])
    r.expect(m["glow"] > 0, "the concourse floor has lost the glow that stands in for the troffer lights")
    r.expect(r.js("() => typeof window.__apOpenBookLore === 'function'"), "the booth's book went with the joining")


# 2026-11-19 (Sam: "Carry on with the 3D pass"): four approaches joined their still meshes with dssBatchStatic, as the Airport Pub did.
# Measured headless at 1440x900, render + readPixels, unjoined then joined, the pictures the same bar grain and per-load randomness:
# the French 14.1 to 6.3 ms (924 to 271 draws), Centre Point 12.6 to 3.6 ms (2,478 to 307), Ronnie's 7.2 to 6.0 ms (597 to 404),
# the chippy 14.8 to 14.2 ms (819 to 359; it is bound by its 17 point lights, not its draws). Each check fails if the joining stops.
BATCHED = [
    ("french", "Approach The French", "fh-wrap", "_dssFhBatch", 700, 500, "the flags, the sign, the walker, the reflection and the breathing window glass are left out"),
    ("chippy", "Approach Chinese Fish and Chips", "fc-wrap", "_dssFcBatch", 600, 550, "the sign, the woman in the window, the strip lights, the neon, the fly-killer, the crate and the queue are left out"),
    ("centre-point", "Approach Centre Point", "cp-wrap", "_dssCpBatch", 2200, 700, "the tower's window cells, three boxes each; the neon ladder, its rails and the aviation light are left out"),
    ("ronnies", "Approach Ronnie Scott's", "rs-wrap", "_dssRsBatch", 350, 500, "the heavens, the moons, the puddles, the Cosmogramma sign and every lit window are left out"),
    # then (Sam: "Now do the Coach approach"): 11.1 to 8.4 ms (497 to 249 draws); on the burning night 13.9 to 8.1 ms
    ("coach", "Approach The Coach", "ch-wrap", "_dssChBatch", 230, 380, "the silhouettes in the windows are left out, and on the burning night each fading pane"),
]


def _batched_check(slug, passage, wrap, key, joined_min, calls_max, what):
    def run(r):
        if SWAPS: scratch_passage(r, "T-nothing", "")
        r.go(passage, wait=12000)
        r.clear_lore(); r.clear_slips()
        m = r.js("""([wrap, key]) => { var R = window._dssThreeRegistry && window._dssThreeRegistry[wrap]; if (!R) return null;
          R.renderer.info.autoReset = true; R.renderer.render(R.scene, R.camera);
          return { batch: window[key] || null, calls: R.renderer.info.render.calls }; }""", [wrap, key])
        r.expect(m, "%s's 3D scene (%s) did not come up" % (passage, wrap))
        b = m["batch"] or {}
        r.info = "%s still meshes joined into %s; %d draw calls a frame" % (b.get("joined"), b.get("meshes"), m["calls"])
        r.expect(b.get("joined", 0) >= joined_min, "%s's still meshes are not joined (%r; %s)" % (passage, m["batch"], what))
        r.expect(m["calls"] <= calls_max, "%s draws %d objects a frame (about %d joined)" % (passage, m["calls"], calls_max * 2 // 3))
    check("drawn-together-" + slug, "2026-11-19 (Sam: \"Carry on with the 3D pass\"): %s joins its still meshes (dssBatchStatic); %s" % (passage, what))(run)


for _b in BATCHED: _batched_check(*_b)


@check("chippy-light-budget", "2026-11-19 (Sam: \"Yes, the chippy lights\"): the chippy's street carried 17 point lights (about 13 ms a frame headless, against about 5.5 at 13); the brothel window's red, her modelling light, the blue neon's and the lantern's went, soft glows standing in where their light showed")
def chippy_light_budget(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Approach Chinese Fish and Chips", wait=12000)
    r.clear_lore(); r.clear_slips()
    m = r.js("""() => { var R = window._dssThreeRegistry && window._dssThreeRegistry['fc-wrap']; if (!R) return null; var n = 0, G = window._dssFcGlows || {}, inScene = 0;
      R.scene.traverse(function (o) { if (o.isPointLight && o.visible) n++; });
      Object.keys(G).forEach(function (k) { for (var p = G[k]; p; p = p.parent) if (p === R.scene) { inScene++; break; } });
      return { pts: n, glows: Object.keys(G).length, inScene: inScene }; }""")
    r.expect(m, "the chippy's 3D scene (fc-wrap) did not come up")
    r.info = "%d point lights; %d stand-in glows in the scene" % (m["pts"], m["inScene"])
    r.expect(m["pts"] <= 13, "the chippy's street has %d point lights; at 13 a frame costs less than half what it did at 17" % m["pts"])
    r.expect(m["glows"] == 3 and m["inScene"] == 3, "the stand-in glows for the lights that went are missing (%d made, %d in the scene: the brothel window, the lantern's wall and pavement)" % (m["glows"], m["inScene"]))


CU_SIGHT = r"""([name]) => { var R = window.__dssRooms.cu, cam = R.camera, s = R.spot(name), T = window.THREE, box = new T.Box3().setFromObject(s.root), c = box.getCenter(new T.Vector3()), h = box.max.y - box.min.y;
  var own = new Set(); s.root.traverse(function (o) { own.add(o); }); var rc = new T.Raycaster(); rc.camera = cam; var clear = 0, n = 0, from = cam.getWorldPosition(new T.Vector3());
  [0.3, 0.45, 0.6, 0.75, 0.9].forEach(function (f) { var p = new T.Vector3(c.x, box.min.y + h * f, c.z), d = p.clone().sub(from), dist = d.length(); rc.set(from, d.normalize()); n++;
    var hit = rc.intersectObjects(R.scene.children, true).filter(function (x) { var o = x.object, m = o.material; return o.isMesh && !own.has(o) && o.visible && m && m.visible !== false && !m.transparent && (!m.opacity || m.opacity >= 1); })[0];
    if (!hit || hit.distance > dist - 0.08) clear++; });
  function sx(v) { return (v.clone().project(cam).x + 1) / 2 * innerWidth; }
  return { clear: clear, n: n, x: Math.round(sx(new T.Vector3(c.x, box.min.y + h * 0.6, c.z))), post: Math.round(sx(new T.Vector3(-1.2, box.min.y + h * 0.6, 1.5))), w: innerWidth }; }"""


@check("cellar-closeups-framed", "2026-11-19 (Sam: \"Yes, 1 to 3\"): COPPER's close-up had the steel post standing straight through him; ASHTON's showed her back behind a chair with the dog taking the frame; the dog's white coat was the brightest thing in the cellar")
def cellar_closeups_framed(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Turn to Copper"); r.room_ready("cu")
    r.wait_for("() => { var d = window._dssCellarDog, n = 0; if (d) d.traverse(function (m) { if (m.isMesh) n++; }); return n >= 5; }", 15000, "the dog")
    tone = r.js("() => { var t = []; window._dssCellarDog.traverse(function (m) { if (m.isMesh && m.material && m.material.vertexColors) t.push(m.material.color.r); }); return Math.max.apply(0, t); }")
    r.click_object("cu", "COPPER"); r.page.wait_for_timeout(600)
    cu = r.js(CU_SIGHT, ["COPPER"])
    r.back_click("cu"); r.page.wait_for_timeout(800); r.clear_lore(); r.clear_slips()
    r.wait_for("() => window.__dssRooms.cu.mode() === 'idle'", 8000, "the camera back from COPPER")
    r.click_object("cu", "ASHTON GRANGER"); r.page.wait_for_timeout(600)
    ash = r.js(CU_SIGHT, ["ASHTON GRANGER"])
    r.info = "COPPER at x %d, the post at %d; ASHTON %d of %d sight lines clear, at x %d; the dog's coat at %.2f" % (cu["x"], cu["post"], ash["clear"], ash["n"], ash["x"], tone)
    r.expect(abs(cu["x"] - cu["post"]) >= 90, "in COPPER's close-up the steel post stands %d px from him (it ran straight through him)" % abs(cu["x"] - cu["post"]))
    r.expect(cu["clear"] >= 4, "COPPER is hidden in his close-up (%d of %d sight lines clear)" % (cu["clear"], cu["n"]))
    r.expect(ash["clear"] >= 4, "ASHTON is hidden behind something in her close-up (%d of %d sight lines clear; it was a chair back)" % (ash["clear"], ash["n"]))
    r.expect(ash["w"] * 0.3 <= ash["x"] <= ash["w"] * 0.7, "ASHTON is not in the middle of her close-up (x %d of %d)" % (ash["x"], ash["w"]))
    r.expect(tone <= 0.85, "the dog's coat is back at %.2f of its colours; its white was the brightest thing in the cellar" % tone)


@check("tarot-gpt-deck", "2026-11-19 (Sam: \"Put the new tarot cards into the game\", then \"more like el greco\", \"more visible brushwork\"): SHANA's cards draw his GPT deck, treated by tools_tarot_treat.py into tarot/*.jpg, faces and back, with no hand-drawn SVG left")
def tarot_gpt_deck(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    faces = len(re.findall(r"tarot-art2(?:&#39;|&#x27;|')\s+src=(?:&#39;|&#x27;|')tarot/[a-z-]+\.jpg", html))
    old = len(re.findall(r"tarot-art2(?:&#39;|&#x27;|') aria-hidden", html))
    names = ["the-fool", "the-magician", "the-high-priestess", "the-empress", "the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit", "wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance", "the-devil", "the-tower", "the-star", "the-moon", "the-sun", "judgement", "the-world", "back"]
    missing = [n for n in names if not os.path.exists(os.path.join(ROOT, "tarot", n + ".jpg"))]
    r.go("Shana Reads", wait=6000); r.clear_lore(); r.clear_slips()
    r.wait_for("() => document.querySelectorAll('#tarot-spread .card-front-face img.tarot-art2').length === 3", 10000, "three cards in SHANA's spread")
    r.wait_for("() => [].every.call(document.querySelectorAll('#tarot-spread img'), function (i) { return i.complete; })", 10000, "the card pictures to load")
    m = r.js("""() => { var f = [].map.call(document.querySelectorAll('#tarot-spread .card-front-face img.tarot-art2'), function (i) { return i.naturalWidth + ' ' + i.getAttribute('src'); }),
        b = [].map.call(document.querySelectorAll('#tarot-spread .card-back-face img.tarot-back-img'), function (i) { return i.naturalWidth; }),
        svg = document.querySelectorAll('#tarot-spread .card-front-face svg, #tarot-spread .card-back-face svg').length,
        c = document.querySelector('#tc-1'), w = c ? c.getBoundingClientRect().width : 0; return { f: f, b: b, svg: svg, w: w }; }""")
    r.page.locator("#tc-1").click(); r.page.wait_for_timeout(1500)
    shown = r.js("() => { var c = document.querySelector('#tc-1'), i = c && c.querySelector('.card-front-face img'), q = i && i.getBoundingClientRect(); return { flipped: c && c.classList.contains('flipped'), w: q ? Math.round(q.width) : 0 }; }")
    r.info = "%d face entries in the html (%d old SVG); spread %s; backs %s; card %d px wide, flipped face %s" % (faces, old, m["f"], m["b"], m["w"], shown)
    r.expect(not missing, "tarot/ is missing %s" % missing)
    r.expect(faces >= 42 and old == 0, "the two art maps (Shana Reads, Shana Looks Again) hold %d picture faces and %d old SVG faces; 21 pictures each, no SVG" % (faces, old))
    r.expect(all(s.split(" ")[0] == "330" for s in m["f"]), "a face in SHANA's spread did not load: %s" % m["f"])
    r.expect(len(m["b"]) == 3 and all(w == 330 for w in m["b"]), "a card back in SHANA's spread did not load: %s" % m["b"])
    r.expect(m["svg"] == 0, "SHANA's spread still draws %d SVG card faces or backs" % m["svg"])
    r.expect(shown["flipped"] and shown["w"] >= 60, "the first card's picture did not show once turned: %s" % shown)


@check("shana-reads-fits", "2026-11-19 (Sam: \"just fix\" Shana Reads scrolling once all three cards turned; \"get rid of the 'where you've come from' etc from all the cards\"; on the Hanged Man \"it should say 'found' not 'find'\" and \"the text above the card is cutting into the card itself\"): at 1280x800, with the longest meaning and name on all three cards, the page does not scroll; no position line under a card; a turned card under the pointer stays below its label; the second look's link reads 'You found the Hanged Man.'")
def shana_reads_fits(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    html = open(os.path.join(ROOT, "Dream Street Shuffle.html"), encoding="utf-8").read()
    found, find = html.count("You found the Hanged Man."), html.count("You find the Hanged Man.")
    r.page.set_viewport_size({"width": 1280, "height": 800})
    r.go("Shana Reads", wait=6000); r.clear_lore(); r.clear_slips()
    r.wait_for("() => document.querySelectorAll('#tarot-spread .tarot-card').length === 3", 10000, "three cards in SHANA's spread")
    for i in (1, 2, 3):
        c = r.js("([i]) => { var q = document.getElementById('tc-' + i).getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2]; }", [i])
        r.page.mouse.click(c[0], c[1]); r.page.wait_for_timeout(2300)
    r.wait_for("() => { var c = document.getElementById('tarot-continue'); return c && c.style.display !== 'none'; }", 5000, "the way on after the third card")
    pos = r.js("() => document.querySelectorAll('.tarot-meaning-pos').length")
    lift = r.js("() => { var c = document.getElementById('tc-3'), l = c.parentElement.querySelector('.tarot-position'); return [Math.round(c.getBoundingClientRect().top), Math.round(l.getBoundingClientRect().bottom)]; }")
    r.js("() => { document.querySelectorAll('.tarot-meaning-text').forEach(function (e) { e.textContent = 'Endings and their trailing beginnings; the transmutation of being; paid passage.'; }); document.querySelectorAll('#tarot-spread .tarot-card-label').forEach(function (e) { e.textContent = 'The High Priestess'; }); }")
    r.page.mouse.move(5, 5); r.page.wait_for_timeout(2500)
    over = r.js("() => document.scrollingElement.scrollHeight - innerHeight")
    r.info = "1280x800 worst case: %d px past the window; position lines %d; FUTURE card top %d under the pointer, its label's foot %d; 'found' %d, 'find' %d" % (over, pos, lift[0], lift[1], found, find)
    r.expect(over <= 0, "Shana Reads scrolls %d px at 1280x800 once the cards turn: %s" % (over, r.info))
    r.expect(pos == 0, "a position line (Where you've come from...) is back under a card: %s" % r.info)
    r.expect(lift[0] >= lift[1], "the turned card under the pointer rises into its FUTURE label: %s" % r.info)
    r.expect(found >= 1 and find == 0, "the second look's link no longer reads 'You found the Hanged Man.': %s" % r.info)


@check("oi-shelves-lit","2026-11-19 (Sam, playtest: O'Flatterly's Shelves close-up had a bare dark wall over its left half): the close-up comes in nearer on the cat prints and the books, and a brass picture light over the prints lights them and the side wall")
def oi_shelves_lit(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("O'Flatterly's shop", wait=10000)
    r.room_ready("oi"); r.clear_slips(); r.clear_lore()
    r.click_object("oi", "Shelves"); r.page.wait_for_timeout(3500)
    lum = r.js("""() => { var g = window._dssThreeRegistry['oi-wrap'], R = g.renderer, gl = R.getContext(); R.render(g.scene, g.camera);
      var w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(4), out = [];
      for (var i = 1; i < 8; i++) for (var j = 1; j < 8; j++) { gl.readPixels(Math.round(w * 0.5 * i / 8), Math.round(h * j / 8), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); out.push(0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]); }
      out.sort(function (a, b) { return a - b; }); return [out[Math.floor(out.length / 2)], out.reduce(function (a, b) { return a + b; }, 0) / out.length]; }""")
    r.info = "left half of the Shelves close-up: median %.0f, mean %.0f (0-255)" % (lum[0], lum[1])
    r.expect(lum[0] >= 40, "the Shelves close-up's left half is dark again (median %.0f of 255): %s" % (lum[0], r.info))


@check("voices-clear-of-slip", "2026-11-19 (Sam, playtest: on a first look the VOICES slip sat over the right end of the PRIME/OLDBOY box): with a slip on screen beside it, the box goes to the object's other side")
def voices_clear_of_slip(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("O'Flatterly's shop", wait=10000)
    r.room_ready("oi"); r.clear_slips(); r.clear_lore()
    r.click_object("oi", "Shelves"); r.page.wait_for_timeout(5000)
    got = r.js("""() => { var b = document.querySelector('.dss-voice-box'), s = document.querySelector('#dss-hint-stack .dss-hint-voices'); if (!b || !s) return null;
      var p = b.getBoundingClientRect(), q = s.getBoundingClientRect(); return {box: [p.left|0, p.top|0, p.right|0, p.bottom|0], slip: [q.left|0, q.top|0, q.right|0, q.bottom|0], op: +getComputedStyle(b).opacity}; }""")
    r.expect(got is not None, "no PRIME/OLDBOY box and VOICES slip on the first look at the Shelves (the check needs both)")
    b, q = got["box"], got["slip"]
    over = max(0, min(b[2], q[2]) - max(b[0], q[0])) * max(0, min(b[3], q[3]) - max(b[1], q[1]))
    r.info = "box %s, VOICES slip %s" % (b, q)
    r.expect(over == 0, "the VOICES slip covers part of the PRIME/OLDBOY box (%d px square): %s" % (over, r.info))


@check("oflatterly-room-cost", "2026-11-19 (the 3D smoothness pass, O'Flatterly's shop): the shop drew 1,477 objects a frame (8.3 ms headless), some 1,300 of them books with their own colour-shifting materials; the still books are drawn as instances (one draw for each shape, look and parent) with each book's colour still turning, and the other still meshes are joined except every clickable object, the globe, the bell and the bust (4.65 ms, 314 draws, the same picture)")
def oflatterly_room_cost(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("O'Flatterly's shop"); r.room_ready("oi"); r.clear_slips(); r.clear_lore()
    r.wait_for("() => !!window._dssOiBatch", 15000, "the shop's books and still meshes to be joined")
    m = r.js("""() => { var R = window._dssThreeRegistry && window._dssThreeRegistry['oi-wrap']; if (!R) return null; var ims = [], left = 0;
      R.scene.traverse(function (o) { if (o.isInstancedMesh && o.name === 'oi-books') { ims.push(o); var p = o.parent; while (p && p.parent && p.parent !== R.scene) p = p.parent; if (o.parent && o.parent.isGroup && o.parent.parent === R.scene && o.parent.rotation.y > 1.5) left += o.count; } });
      R.renderer.render(R.scene, R.camera); return { books: window._dssOiBooks || null, batch: window._dssOiBatch, calls: R.renderer.info.render.calls, ims: ims.length, left: left, names: window.__dssRooms.oi.names() }; }""")
    r.expect(m, "the shop (oi-wrap) did not come up")
    r.info = "%s books in %s instanced draws (%d on the left shelves); %s still meshes joined into %s; %d draw calls" % ((m["books"] or {}).get("books"), (m["books"] or {}).get("draws"), m["left"], m["batch"].get("joined"), m["batch"].get("meshes"), m["calls"])
    r.expect(m["books"] and not m["books"].get("error") and m["books"]["books"] >= 1000 and m["books"]["draws"] <= 80, "the shop's books are not drawn as instances: %s" % m["books"])
    r.expect(m["left"] >= 200, "the left shelves' books are not under the shelves' own group, so a click on them would miss the Shelves (%d)" % m["left"])
    r.expect(m["batch"]["joined"] >= 150, "the shop's still meshes are not joined: %s" % m["batch"])
    r.expect(m["calls"] <= 400, "the shop draws %d objects a frame (1,477 before, 314 after)" % m["calls"])
    for nm in ("INIS O’FLATTERLY", "Shelves", "A glass case", "A globe", "A door", "A bust of Percy Bysshe Shelley"):
        r.expect(nm in m["names"], "the joining took a clickable object with it: %s missing from %s" % (nm, m["names"]))
    # the books still change colour, each its own way: an instance's colour follows its book's own material, and moves
    COL = """() => { var R = window._dssThreeRegistry['oi-wrap'], out = []; R.scene.traverse(function (o) { if (o.isInstancedMesh && o.name === 'oi-books' && out.length < 40) { var c = new THREE.Color(); for (var i = 0; i < o.count && out.length < 40; i += 7) { o.getColorAt(i, c); out.push([c.r, c.g, c.b]); } } }); return out; }"""
    a_ = r.js(COL); r.page.wait_for_timeout(2500); b_ = r.js(COL)
    moved = sum(1 for x, y in zip(a_, b_) if sum(abs(p - q) for p, q in zip(x, y)) > 0.01)
    spread = len(set(tuple(round(v, 2) for v in x) for x in b_))
    r.expect(moved >= len(a_) // 3, "the instanced books' colours are not turning (%d of %d moved in 2.5 s)" % (moved, len(a_)))
    r.expect(spread >= len(b_) // 3, "the instanced books have all gone one colour (%d colours in %d books)" % (spread, len(b_)))
    r.click_object("oi", "Shelves")
    r.expect(r.js("([r]) => window.__dssRooms[r].mode()", ["oi"]) == "inspect", "the Shelves' close-up did not open")


@check("ronnies-room-cost","2026-11-19 (Sam: \"Ronnie Scott's\"): the room cost 10.4 to 10.6 ms a frame headless; the stage spot's shadow (it drew only a sliver on one lamp shade) and the near right table's light went, and its still meshes are joined except every clickable object, the mirror and the stage cone")
def ronnies_room_cost(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Ronnie Scott's"); r.room_ready("ri")
    m = r.js("""() => { var R = window._dssThreeRegistry && window._dssThreeRegistry['ri-wrap']; if (!R) return null; var pts = 0, sh = 0;
      R.scene.traverse(function (o) { if (!o.visible || !o.isLight) return; if (o.isPointLight) pts++; if (o.castShadow) sh++; });
      R.renderer.render(R.scene, R.camera); return { pts: pts, shadows: sh, batch: window._dssRiBatch || null, calls: R.renderer.info.render.calls, names: window.__dssRooms.ri.names() }; }""")
    r.expect(m, "Ronnie's room (ri-wrap) did not come up")
    r.info = "%d point lights, %d shadowed; %s still meshes joined into %s; %d draw calls" % (m["pts"], m["shadows"], (m["batch"] or {}).get("joined"), (m["batch"] or {}).get("meshes"), m["calls"])
    r.expect(m["shadows"] == 0, "a light in Ronnie's casts a shadow again (%d); the stage spot's drew nothing you could see and cost about 2.5 ms a frame" % m["shadows"])
    r.expect(m["pts"] <= 11, "Ronnie's has %d point lights; eleven since the near right table's went" % m["pts"])
    r.expect(m["batch"] and m["batch"]["joined"] >= 300, "Ronnie's still meshes are not joined: %s" % m["batch"])
    r.expect(m["calls"] <= 560, "Ronnie's draws %d objects a frame (681 unjoined, about 500 joined)" % m["calls"])
    r.expect("The Stage" in m["names"] and "A door" in m["names"], "the joining took a clickable object with it: %s" % m["names"])


@check("lackland-light-budget", "2026-11-19 (Sam: \"Lackland's approach\"): Lackland's street carried 14 point lights and five shadowed lights (11 to 14 ms a frame headless, against 4.4 to 6 after); the buzzer's, the two second-floor windows' and the fanlight's lights went, and the far lamp and the faint moon stopped casting shadows, none of which showed")
def lackland_light_budget(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Approach Lacklands Office", wait=12000)
    r.clear_lore(); r.clear_slips()
    m = r.js("""() => { var R = window._dssThreeRegistry && window._dssThreeRegistry['lo-wrap']; if (!R) return null; var n = 0, sh = 0, moon = 0;
      R.scene.traverse(function (o) { if (!o.visible || !o.isLight) return; if (o.isPointLight) n++; if (o.castShadow) sh++; if (o.isDirectionalLight && o.castShadow) moon++; });
      return { pts: n, shadows: sh, moon: moon }; }""")
    r.expect(m, "Lackland's 3D scene (lo-wrap) did not come up")
    r.info = "%d point lights; %d lights casting shadows" % (m["pts"], m["shadows"])
    r.expect(m["pts"] <= 10, "Lackland's street has %d point lights; at 10 a frame costs about half what it did at 14" % m["pts"])
    r.expect(m["shadows"] <= 3 and m["moon"] == 0, "Lackland's street has %d lights casting shadows (the moon's among them: %s); three are enough, the far lamp's and the moon's drew nothing" % (m["shadows"], bool(m["moon"])))


@check("drawn-together-coach-burns", "2026-11-19 (Sam: \"Now do the Coach approach\"): on the night the Coach burns, its still meshes are joined too, but each window pane stays its own mesh in the scene, so the panes still fail one by one")
def coach_burns_drawn_together(r):
    scratch_passage(r, "T-burn", '(set: $coachBurnt to true)(go-to: "The Coach Burns")')
    r.go("T-burn", wait=7000)
    m = r.js("""() => { var R = window._dssThreeRegistry && window._dssThreeRegistry['ch-wrap']; if (!R) return null; var panes = window._dssChFirePanes || [];
      var inScene = panes.filter(function (o) { for (var p = o; p; p = p.parent) if (p === R.scene) return true; return false; }).length;
      return { batch: window._dssChBatch || null, panes: panes.length, inScene: inScene, lit: panes.filter(function (o) { return o.material.emissive && o.material.emissive.getHex() === 0xa47852; }).length }; }""")
    r.expect(m, "the burning Coach's 3D scene (ch-wrap) did not come up")
    r.info = "%s still meshes joined into %s; %d fire panes, %d still in the scene" % ((m["batch"] or {}).get("joined"), (m["batch"] or {}).get("meshes"), m["panes"], m["inScene"])
    r.expect((m["batch"] or {}).get("joined", 0) >= 220, "the burning Coach's still meshes are not joined (%r)" % m["batch"])
    r.expect(m["panes"] >= 5 and m["inScene"] == m["panes"] and m["lit"] == m["panes"], "the burning night's window panes were joined away or lost their fire glow (%d panes, %d in the scene, %d lit)" % (m["panes"], m["inScene"], m["lit"]))


@check("climb-whirl-is-snow", "2026-11-18 (Sam, the Climb's whirlwind drawn as large glossy white balls: \"Redraw\"): the rescue's whirlwind is blown snow, hundreds of soft flecks that fade in and out, not 44 shaded spheres")
def climb_whirl_is_snow(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    climb_start(r)
    W = """() => { var sc = window._hcDev.scene, balls = 0, g = null; sc.traverse(function (o) { if (o.isInstancedMesh && o.visible && o.geometry && o.geometry.type === 'SphereGeometry' && o.count === 44) balls++;
        if (o.isGroup && o.children.length === 3 && o.children.every(function (c) { return c.isPoints; })) g = o; });
      if (!g) return { balls: balls, group: false };
      var n = 0, lit = 0, lo = 1e9, hi = -1e9, alpha = true; g.children.forEach(function (c) { var p = c.geometry.attributes.position, col = c.geometry.attributes.color; if (!col || col.itemSize !== 4) { alpha = false; return; }
        n += p.count; for (var i = 0; i < p.count; i++) if (col.getW(i) > 0.3) { lit++; var y = p.getY(i); if (y < lo) lo = y; if (y > hi) hi = y; } });
      return { balls: balls, group: true, vis: g.visible, n: n, lit: lit, tall: lit ? hi - lo : 0, alpha: alpha }; }"""
    r.js("() => window._hcDev.warp(110)"); r.page.wait_for_timeout(120)
    kb = r.page.keyboard; kb.down("ArrowRight"); t0 = time.time()
    while time.time() - t0 < 6 and not r.js(CLIMB)["whirl"]: r.page.wait_for_timeout(40)
    kb.up("ArrowRight")
    r.expect(r.js(CLIMB)["whirl"], "walking off the side never brought the whirlwind")
    r.page.wait_for_timeout(500); m = r.js(W)
    r.expect(m["balls"] == 0, "the whirlwind is the 44 glossy spheres again")
    r.expect(m["group"] and m["vis"], "the whirlwind's snow is not on show during the rescue: %s" % m)
    r.expect(m["alpha"] and m["n"] >= 600, "the whirlwind has %d flecks (it should be over 600, each with its own fade)" % m.get("n", 0))
    r.expect(m["lit"] >= 200 and m["tall"] >= 2.0, "mid-rescue only %d flecks show, over %.1f units of height" % (m["lit"], m["tall"]))
    for _ in range(60):
        if not r.js(CLIMB)["whirl"]: break
        r.page.wait_for_timeout(100)
    r.page.wait_for_timeout(200)
    r.expect(not r.js(W)["vis"], "the whirlwind's snow stays on show after he is set down")
    r.info = "%d flecks, %d showing mid-rescue over %.1f units of height; gone at the set-down" % (m["n"], m["lit"], m["tall"])


@check("french-bar-is-wood", "2026-11-18 (Sam, the playtest's 'flat pale rectangles' on the French's bar front and 'big pale ripples' on its top: \"Fix both\"): the panels are the bar's dark wood on brass back plates, and the top's grain runs along the bar at its own scale")
def french_bar_is_wood(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("The French"); r.room_ready("fi")
    m = r.js("""() => { var sc = window._dssThreeRegistry['fi-wrap'].scene, panels = [], plates = 0, top = null;
      function dims(o, a, b, c) { var p = o.geometry && o.geometry.type === 'BoxGeometry' && o.geometry.parameters; return !!p && Math.abs(p.width - a) < 1e-3 && Math.abs(p.height - b) < 1e-3 && (c == null || Math.abs(p.depth - c) < 1e-3); }
      sc.traverse(function (o) { if (!o.isMesh) return; if (dims(o, 0.02, 0.62, 0.5)) panels.push(o); if (dims(o, 0.016, 0.644, 0.524) && o.material.metalness > 0.5) plates++; if (dims(o, 0.78, 0.06)) top = o; });
      function lum(tex) { if (!tex || !tex.image) return -1; var c = document.createElement('canvas'); c.width = c.height = 32; var x = c.getContext('2d'); x.drawImage(tex.image, 0, 0, 32, 32); var d = x.getImageData(0, 0, 32, 32).data, s = 0; for (var i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; return s / (d.length / 4); }
      var t = top && top.material.map;
      return { panels: panels.length, plates: plates, lum: panels.length ? Math.round(lum(panels[0].material.map)) : -1, top: !!top, rep: t ? [t.repeat.x, t.repeat.y] : null, rot: t ? t.rotation : null, env: top ? top.material.envMapIntensity : null }; }""")
    r.info = "%d panels on %d brass plates, panel wood at brightness %s of 255; the top's grain repeats %s, turned %s" % (m["panels"], m["plates"], m["lum"], m["rep"] and [round(v, 2) for v in m["rep"]], m["rot"] and round(m["rot"], 2))
    r.expect(m["panels"] >= 4 and m["top"], "the bar's panels or its top were not found (%d panels)" % m["panels"])
    r.expect(0 <= m["lum"] < 75, "the bar's panels are pale again (brightness %s of 255; the dark wood is about 40, the old cream about 200)" % m["lum"])
    r.expect(m["plates"] == m["panels"], "%d of the %d panels have a brass edge" % (m["plates"], m["panels"]))
    r.expect(m["rep"] and m["rep"][1] >= 2 and abs(m["rot"] - math.pi / 2) < 0.02, "the top's grain is stretched over the whole bar again (repeat %s, turned %s)" % (m["rep"], m["rot"]))
    r.expect(m["env"] <= 0.45, "the top's varnish reflects at %.2f (calmed to 0.4)" % m["env"])


@check("rooms-start-at-the-header", "2026-11-18 (Sam, the playtest's grey strip under the header above every 3D room: \"Remove it\"): every room began 44 px under the header's foot and the page column's panel showed in the gap; each room now starts at the header's foot, still ends at the foot of the window, and the page does not scroll")
def rooms_start_at_the_header(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    bad = []; seen = []
    for room, passage in ROOMS + [("cx", "Approach Coppers Lair")]:
        r.go(passage)
        if room == "cx":
            r.wait_for("() => !!document.getElementById('cx-wrap')", 15000, "the Copper's Lair approach")
            r.page.wait_for_timeout(2500)
        else:
            r.room_ready(room)
        r.page.wait_for_timeout(800)
        m = r.js("([id]) => { var w = document.getElementById(id + '-wrap'), h = document.getElementById('stat-bars-lifted'); if (!w || !h) return null; var a = w.getBoundingClientRect(), b = h.getBoundingClientRect(); return [Math.round(a.top), Math.round(b.bottom), Math.round(a.bottom), window.innerHeight, document.documentElement.scrollHeight]; }", [room])
        if not m:
            bad.append("%s: no room or no header" % room); continue
        seen.append("%s %d" % (room, m[0] - m[1]))
        if abs(m[0] - m[1]) > 3: bad.append("%s starts %d px under the header's foot" % (room, m[0] - m[1]))
        if m[2] < m[3] - 6: bad.append("%s ends at %d of %d" % (room, m[2], m[3]))
        if m[4] > m[3] + 1: bad.append("%s scrolls (%d of %d)" % (room, m[4], m[3]))
    r.info = "px between the header's foot and the room: " + ", ".join(seen)
    r.expect(not bad, "; ".join(bad))


@check("white-ending-by-play", "2026-11-18 (never played before: 'the White page reached by play' stood under Not covered in three handoffs): with the poem whole, Alba Complete's photograph is pocketed and put away, Traveller, wake! leads through Dawn Approach White to the White page, and PLUS. ULTRA. to the Dawn, with no error, no blank view and no scroll")
def white_ending_by_play(r):
    scratch_passage(r, "T-white", '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 3 Set")(set: $crossedThreshold to true)(set: $sawThirdPillar to true)(set: $keyLighter to "spent")(set: $dreamKey to "")(set: $worldsVisited to (a: "himalayas"))(set: $mantraComplete to true)(set: $alba to $alba + (a: $alba2, $alba3))(set: $sawJeffrey to true)(set: $lacklandRead to true)(set: $hasTrishaMatchbook to true)(set: $hasMatches to true)(set: $metShana to true)(set: $hadChippy to true)(set: $tookLily1 to true)(set: $lilyCount to 5)(set: $drinksTonight to 10)(set: $confidence to 48)(set: $sobriety to 40)(set: $prevConfidence to $confidence)(set: $prevSobriety to $sobriety)(set: $returns to 17)(go-to: "Alba Complete")')
    r.go("T-white", wait=9000)
    PHOTO = "() => { var p = document.getElementById('dss-photo-pop'); if (!p || !p.getClientRects().length || getComputedStyle(p).visibility === 'hidden' || +getComputedStyle(p).opacity < 0.05) return null; var h = p.querySelector('.dss-photo-pop-hint'); if (!h) return null; var b = h.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }"
    seen, bad, taken = [], [], set()
    for step in range(12):
        r.clear_lore(); r.clear_slips()
        pn = r.pn()
        if pn not in seen:
            seen.append(pn)
            for b in blank_canvases(r): bad.append("%s: %s" % (pn, b))
        over = r.js("() => (document.scrollingElement || document.documentElement).scrollHeight - innerHeight")
        if over > 4: bad.append("%s: scrolls %d px" % (pn, over))
        if pn == "Dawn": break
        fresh, waited = [], 0
        while waited < 25 and r.pn() == pn:
            at = r.js(PHOTO)
            if at: r.page.mouse.click(at[0], at[1]); r.page.wait_for_timeout(1800); continue   # the photograph: pocket it, then put it away, as its own line says
            fresh = [o for o in r.js(CLICKABLES) if (pn, o["t"]) not in taken and not re.search(r"NOTEBOOK|^NOTE$|skip|testing", o["t"], re.I)]
            if fresh: break
            r.page.wait_for_timeout(2000); waited += 1
        if r.pn() != pn: continue
        if not fresh: bad.append("%s: no way on in %d s" % (pn, waited * 2)); break
        taken.add((pn, fresh[0]["t"])); r.page.mouse.click(fresh[0]["x"], fresh[0]["y"]); r.page.wait_for_timeout(4000)
    r.info = "walked: " + " > ".join(seen)
    r.expect(not bad, "; ".join(dict.fromkeys(bad)))
    r.expect(seen == ["Alba Complete", "Dawn Approach White", "White page", "Dawn"], "the White ending went %s" % " > ".join(seen))



def walk_by_play(r, start, stop, pages=12, skip=r"NOTEBOOK|^NOTE$|skip|testing|LORE"):
    """Press the first untaken way on, page by page, as a player would, until the page named stop; returns (pages seen, problems)."""
    seen, bad, tries = [], [], {}
    for step in range(pages * 3):
        r.clear_lore(); r.clear_slips()
        pn = r.pn()
        if pn not in seen:
            seen.append(pn)
            for b in blank_canvases(r): bad.append("%s: %s" % (pn, b))
        over = r.js("() => (document.scrollingElement || document.documentElement).scrollHeight - innerHeight")
        if over > 4: bad.append("%s: scrolls %d px" % (pn, over))
        if pn == stop: break
        fresh, waited = [], 0
        while waited < 25 and r.pn() == pn:
            fresh = [o for o in r.js(CLICKABLES) if tries.get((pn, o["t"]), 0) < 3 and not re.search(skip, o["t"], re.I)]
            if fresh: break
            r.page.wait_for_timeout(2000); waited += 1
        if r.pn() != pn: continue
        if not fresh: bad.append("%s: no way on in %d s" % (pn, waited * 2)); break
        # a press while a page is still typing only sets the words down, so a link that did not turn the page gets up to three presses
        k = (pn, fresh[0]["t"]); tries[k] = tries.get(k, 0) + 1; r.page.mouse.click(fresh[0]["x"], fresh[0]["y"]); r.page.wait_for_timeout(4000)
    return seen, bad


@check("fetch-by-play", "2026-11-20 (never played before: 'The Fetch reached by play' stood under Not covered): with the poem whole, LINE 3's Soho! goes to Things turn up, The dawn is coming to the Fetch, and Follow him to Approach Centre Point; with the night not yet lived he is a glimpse whose Not yet goes back to Dean Street; no error, no blank view, no scroll")
def fetch_by_play(r):
    BASE = '(display: "Night Resets")(display: "Key Guards")(display: "Test Start 3 Set")(set: $sawJeffrey to true)(set: $lacklandRead to true)(set: $metShana to true)(set: $hadChippy to true)(set: $drinksTonight to 8)(set: $confidence to 55)(set: $sobriety to 45)(set: $prevConfidence to $confidence)(set: $prevSobriety to $sobriety)(set: $returns to 12)'
    scratch_passage(r, "T-fetch", BASE + '(set: $alba to $alba + (a: $alba2))(set: $tookLily1 to true)(set: $lilyCount to 3)(go-to: "LINE 3")')
    r.go("T-fetch", wait=9000)
    seen, bad = walk_by_play(r, "LINE 3", "Approach Centre Point")
    r.info = "walked: " + " > ".join(seen)
    r.expect(not bad, "; ".join(dict.fromkeys(bad)))
    r.expect(seen[:4] == ["LINE 3", "Things turn up", "The Fetch", "Approach Centre Point"], "the road to the Fetch went %s" % " > ".join(seen))
    scratch_passage(r, "T-fetch-glimpse", BASE + '(set: $lilyCount to 0)(set: $fetchGlimpsed to false)(go-to: "The Fetch")')
    r.go("T-fetch-glimpse", wait=9000)
    glimpse = r.js("() => [[].some.call(document.querySelectorAll('.fetch-owed'), function (e) { return !e.closest('.dss-ghost'); }), [].some.call(document.querySelectorAll('tw-link'), function (l) { return /Follow him/.test(l.textContent); })]")
    r.expect(glimpse[0] and not glimpse[1], "with no flowers he is not a glimpse (owed tally %r, Follow him %r)" % tuple(glimpse))
    seen2, bad2 = walk_by_play(r, "The Fetch", "Dean Street", pages=4)
    r.info += " | glimpse: " + " > ".join(seen2)
    r.expect(not bad2, "; ".join(dict.fromkeys(bad2)))
    r.expect(seen2[:2] == ["The Fetch", "Dean Street"], "the glimpse went %s" % " > ".join(seen2))

@check("bateman-approach", "2026-11-20 (Sam: \"an approach scene for meeting the man on the street before i joyride\"; \"build the street dry, no sound, approach only for now\"): Bateman Street opens as a 3D approach that draws, fits the page and has no pools on the ground; its one button, WALK ON at the foot, goes back to Dean Street; the passage's own link stays hidden")
def bateman_approach(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Bateman Street", wait=9000); r.clear_lore(); r.clear_slips()
    r.wait_for("() => { var b = document.querySelector('#bs-wrap button'); return b && b.getClientRects().length; }", 9000, "the Bateman Street scene and its button")
    r.page.wait_for_timeout(1500)
    blank = blank_canvases(r)
    r.expect(not blank, "; ".join(blank))
    m = r.js("""() => { var w = document.getElementById('bs-wrap'), b = [].filter.call(w.querySelectorAll('button'), function (x) { return x.textContent === 'WALK ON'; })[0] || w.querySelector('button'), q = b.getBoundingClientRect(), t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      var links = [].filter.call(document.querySelectorAll('tw-story > tw-passage:not(.dss-ghost) tw-link'), function (l) { return l.getClientRects().length; }).length;
      return { label: b.textContent, top: !!t && (t === b || b.contains(t)), foot: Math.round(innerHeight - q.bottom), pools: w.getAttribute('data-pools'), links: links, over: document.scrollingElement.scrollHeight - innerHeight }; }""")
    r.info = str(m)
    r.expect(m["pools"] is None, "the street has %s pools on the ground; Sam asked for it dry" % m["pools"])
    r.expect(m["label"] == "WALK ON" and m["top"] and m["foot"] < 140, "WALK ON is not the button at the foot: %s" % m)
    r.expect(m["links"] == 0, "%d passage links show beside the scene" % m["links"])
    r.expect(m["over"] <= 2, "the page scrolls by %d px" % m["over"])
    r.page.click("#bs-wrap button:has-text('WALK ON')")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street'", 12000, "WALK ON to go back to Dean Street")


@check("joyride-from-bateman", "2026-11-20 (Sam: \"Yes, wire it here\"): GET IN on Bateman Street opens the ride in the passenger seat (no second kerbside scene), the ride draws, a left into Frith Street and getting out at Ronnie's hands the stop back, and Walk on puts the player on Dean Street at Ronnie's door with the ride gone")
def joyride_from_bateman(r):
    if SWAPS: scratch_passage(r, "T-nothing", "")
    r.go("Bateman Street", wait=9000); r.clear_lore(); r.clear_slips()
    r.wait_for("() => [].some.call(document.querySelectorAll('#bs-wrap button'), function (b) { return b.textContent === 'GET IN' && b.getClientRects().length; })", 9000, "a GET IN button on Bateman Street")
    r.page.click("#bs-wrap button:has-text('GET IN')")
    r.wait_for("() => !!document.getElementById('jr-frame')", 15000, "the ride's frame")
    def ride():
        return next((f for f in r.page.frames if "soho-joyride" in f.url), None)
    t0 = time.time(); fr = None
    while time.time() - t0 < 40:
        fr = ride()
        if fr and fr.evaluate("() => !!window.__joyride"): break
        r.page.wait_for_timeout(400)
    r.expect(fr is not None, "the ride page did not load in its frame")
    st = fr.evaluate("() => window.__joyride.state()")
    r.expect(st["mode"] == "inside", "the ride did not open in the passenger seat (mode %s, choices %s)" % (st["mode"], st["choices"]))
    r.expect(r.pn() == "Soho Joyride", "the page under the ride is %r" % r.pn())
    r.page.wait_for_timeout(2500)
    blank = blank_canvases(r)
    seen = fr.evaluate("() => { var c = document.getElementById('view'); return c ? [c.width, c.height] : null; }")
    r.expect(seen and seen[0] > 300, "the ride has no view (%s)" % seen)
    import io
    from PIL import Image, ImageStat
    sd = ImageStat.Stat(Image.open(io.BytesIO(r.page.screenshot())).convert("L")).stddev[0]
    r.expect(sd > 6, "the ride's view is flat (spread %.1f)" % sd)
    trail = []
    t0 = time.time()
    while time.time() - t0 < 120:
        st = fr.evaluate("() => window.__joyride.state()"); ch = st["choices"]
        if ch:
            if "Walk on" in ch: break
            want = next((i for i, c in enumerate(ch) if c.startswith("Left into Frith") or c.startswith("Get out at Ronnie")), None)
            if want is None:
                # on the move the only offer is to pull over early: sit tight until he reaches the stop
                r.expect(ch == ["Ask him to pull over"], "no way to Ronnie's among %s" % ch)
            else:
                trail.append(ch[want]); fr.evaluate("(i) => window.__joyride.choose(i)", want)
        r.page.wait_for_timeout(1500)
    r.info = " > ".join(trail)
    r.expect("Walk on" in fr.evaluate("() => window.__joyride.state().choices"), "the ride never offered Walk on (%s)" % r.info)
    r.expect(r.js("() => document.getElementById('jr-frame').getAttribute('data-exit')") == "ronnies", "the game did not hear the stop")
    fr.click("#actions button")
    r.wait_for("() => ((document.getElementById('dss-pn') || {}).textContent || '').trim() === 'Dean Street' && !document.getElementById('jr-frame')", 15000, "Walk on to go back to Dean Street and the ride to go")
    r.expect(r.js("() => sessionStorage.getItem('dssMapLast')") == "ronnies", "the player is not at Ronnie's door")


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
