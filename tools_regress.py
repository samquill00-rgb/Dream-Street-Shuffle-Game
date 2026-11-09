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


@check("trail-badge-shows", "2026-11-09 earlier note 34: no sign in the bottom left of which trail you were on")
def _(r):
    r.go("Dean Street", wait=5000)
    r.expect(not r.js("() => !!document.querySelector('.dss-trail-badge')"), "a trail badge shows before any trail is begun")
    r.js("() => { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { x.setAttribute('data-trails', 'true'); x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; f(); setInterval(f, 100); localStorage.setItem('dssVoicesSeen', JSON.stringify(['ci/A piano'])); }")
    r.page.wait_for_timeout(1500)
    t = r.js("() => { var t = document.querySelector('.dss-trail-badge'); if (!t) return ''; var b = t.getBoundingClientRect(); return (b.right <= innerWidth && b.right > innerWidth - 420 && b.top > 60 && b.top < 320 ? 'in ' : 'out ') + t.textContent; }")
    r.expect(t.startswith("in ") and "THE HIMALAYAS TRAIL" in t and "Pillars of Hercules" in t, "the trail badge is missing, wrong or off its corner (%r)" % t)


@check("trail-picks-up-part-way", "2026-11-09 Sam: a trail can be picked up at any step (the cellar starts two of them)")
def _(r):
    r.go("Dean Street", wait=5000)
    r.js("() => { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { x.setAttribute('data-trails', 'true'); x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; f(); setInterval(f, 100); localStorage.setItem('dssVoicesSeen', JSON.stringify(['pi/A lattice window'])); }")
    r.page.wait_for_timeout(1500)
    t = r.js("() => { var t = document.querySelector('.dss-trail-badge'); return t ? t.textContent : ''; }")
    r.expect("THE HIMALAYAS TRAIL" in t and "French" in t, "seeing only the trail's middle step lit no badge for its last (%r)" % t)


@check("trishas-trail-door", "2026-11-09 Sam: the Nazca trail needs a way past Trisha's bouncers without the matchbook")
def _(r):
    r.page.add_init_script("(function () { var f = function () { document.querySelectorAll('#dss-voice-state').forEach(function (x) { if (x.getAttribute('data-trails') !== 'true') x.setAttribute('data-trails', 'true'); if (x.getAttribute('data-lying') !== 'lighter cocaine ticket slip eye') x.setAttribute('data-lying', 'lighter cocaine ticket slip eye'); }); }; new MutationObserver(f).observe(document, { subtree: true, childList: true, attributes: true }); })();")
    r.go("Dean Street", wait=3000)
    r.js("() => localStorage.setItem('dssVoicesSeen', JSON.stringify([]))")
    r.go("Failure: Trisha's", wait=4000)
    t = r.js("() => document.querySelector('tw-story').innerText")
    r.expect("They do not know you." in t, "off the trail, the doorman no longer refuses (%r)" % t[:200])
    r.js("() => localStorage.setItem('dssVoicesSeen', JSON.stringify(['cu/A bulb']))")
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


@check("gents-letters-solve", "2026-11-09 note 32: the gents door's jumbled letters swap by clicks, turn gold in place, open the way out, and stay solved")
def _(r):
    r.go("Coach and Horses lock", wait=5000)
    r.clear_lore(); r.clear_slips()
    r.page.locator("text=/steady yourself/i").first.click(); r.page.wait_for_timeout(2500)
    want = "JEFFREYBERNARDISUNWELL"
    tiles = r.page.locator(".gents-letters:not(.dss-ghost *) .gl-tile")
    r.expect(tiles.count() == len(want), "the gents door has %d letters, not %d" % (tiles.count(), len(want)))
    r.expect(not r.js("() => !!document.querySelector('.gents-exit.gents-open:not(.dss-ghost *)')"), "the way out shows before the letters are sorted")
    off = r.js("() => [].filter.call(document.querySelectorAll('.gents-letters:not(.dss-ghost *) .gl-tile'), function (b) { var q = b.getBoundingClientRect(); return q.top < 0 || q.bottom > innerHeight || q.left < 0 || q.right > innerWidth; }).length")
    r.expect(off == 0, "%d of the letters are off screen at 1440x900" % off)
    for i in range(len(want)):   # sort like a player: pick the wrong letter, then one further on that belongs here
        cur = "".join(tiles.nth(k).inner_text() for k in range(len(want)))
        if cur[i] == want[i]: continue
        j = next(k for k in range(i + 1, len(want)) if cur[k] == want[i] and cur[k] != want[k])
        tiles.nth(i).click(); tiles.nth(j).click(); r.page.wait_for_timeout(120)
    r.page.wait_for_timeout(800)
    r.expect(r.js("() => !!document.querySelector('.gents-exit.gents-open:not(.dss-ghost *)')"), "the way out did not show once JEFFREY BERNARD IS UNWELL read true")
    gold = r.js("() => document.querySelectorAll('.gents-letters:not(.dss-ghost *) .gl-tile.gl-right').length")
    r.expect(gold == len(want), "only %d letters are gold when solved" % gold)


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
    r.js("() => { var b = [].filter.call(document.querySelectorAll('.book-pitch'), function (x) { return !x.closest('.dss-ghost'); })[0]; var h = b.closest('tw-expression') || b; h.parentNode.insertBefore(h.cloneNode(true), h); document.querySelector('tw-story').classList.remove('dss-hub-tight'); window._passageGen = (window._passageGen || 0) + 1000; window.dispatchEvent(new Event('resize')); }")
    r.page.wait_for_timeout(1200)
    loose = r.js("() => document.scrollingElement.scrollHeight")
    r.page.wait_for_timeout(4000)
    tight = r.js("() => document.scrollingElement.scrollHeight")
    r.info = "%d boxes: %d px before tightening, %d after (tight mode %s)" % (n + 1, loose, tight, r.js("() => document.querySelector('tw-story').classList.contains('dss-hub-tight')"))
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
    res = r.js("() => { var im = document.querySelector('.dss-interval-stairs-art img'); return im && im.naturalWidth > 0 && /interval-stairwell\\.jpg/.test(im.src) ? 'ok' : 'the stairwell render did not load'; }")
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
