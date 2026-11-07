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
import functools, glob, http.server, os, socketserver, sys, threading, time, traceback
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
    def room_ready(self, room):
        self.wait_for("() => !!(window.__dssRooms && window.__dssRooms['%s'])" % room, 15000, "the %s room" % room)
        # the room's opening words: press its onward button if it is up
        for _ in range(3):
            btn = self.page.locator(".dss-room-dismiss:visible")
            if btn.count():
                btn.first.click()
                self.page.wait_for_timeout(1400)
            else:
                break
        self.wait_for("() => window.__dssRooms['%s'].mode() === 'idle'" % room, 8000, "the room camera to settle")
        self.clear_slips()

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
    r.press("Continue")
    r.wait_for("() => !!document.querySelector('#dss-lore-overlay')", 5000, "the Chariots lore card")
    r.expect("Chariots" in r.js("() => document.querySelector('#dss-lore-overlay').textContent"), "the lore card is not Chariots of the Gods?")
    r.js("() => window.dssInlineHint('REGRESSION TEST SLIP, TYPED AFTER THE LORE CARD CLOSES', { now: true })")
    r.page.wait_for_timeout(3000)
    typed = r.js("() => [].map.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent; }).join('|')")
    r.expect("REGRESSION" not in typed, "the slip typed itself out under the lore card")
    r.page.keyboard.press("Escape")
    r.wait_for("() => !document.querySelector('#dss-lore-overlay')", 4000, "the lore card to close")
    r.wait_for("() => [].some.call(document.querySelectorAll('.dss-hint-type'), function (e) { return e.textContent.indexOf('REGRESSION') >= 0; })", 8000, "the slip to type once the lore card closed")


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
    r.expect(res == "5/5", "the SORTIR notice is hidden from the door close-up (%s points seen)" % res)


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
    r.expect(1200 <= gap <= 2400, "the smash came %d ms after the popup closed (want about 1500)" % gap)
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
  var to = new T.Vector3().fromArray(sp.tgt), d = to.clone().sub(cam), L = d.length(); d.normalize();
  var vis = []; R.scene.traverse(function (m) { if (!m.isMesh) return; var q = m; while (q && q.visible) q = q.parent; if (q) return;
    var mt = Array.isArray(m.material) ? m.material[0] : m.material; if (!mt || mt.transparent || mt.depthWrite === false || mt.blending === T.AdditiveBlending) return; vis.push(m); });
  var h = new T.Raycaster(cam, d, 0, L).intersectObjects(vis, false);
  for (var i = 0; i < h.length; i++) { var o = h[i].object, own = false, q = o; while (q) { if (q === sp.root) { own = true; break; } q = q.parent; }
    if (own) return ''; if (h[i].distance < L - 0.08) { var p = o.geometry && o.geometry.parameters, dims = p ? Object.keys(p).filter(function (k) { return typeof p[k] === 'number' && !/Segments/.test(k); }).map(function (k) { return +p[k].toFixed(2); }).join('x') : '';
      return o.geometry.type.replace('Geometry', '') + ' ' + dims + ' at ' + h[i].distance.toFixed(2) + ' m of ' + L.toFixed(2); } }
  return ''; }"""


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
            r.clear_slips()
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
            blk = r.js(BLOCKED, [room, name])
            if blk:
                bad.append("%s: hidden in its close-up behind %s" % (name, blk))
            r.js("([room]) => window.__dssRooms[room].back()", [room])
            r.page.wait_for_timeout(2200)
        r.expect(not bad, "; ".join(bad))
    return fn


for _room, _passage in ROOMS:
    check("room-" + _room, "every object in %s opens, has a card, and is not hidden in its close-up" % _passage)(room_check(_room, _passage))


# ---------------------------------------------------------------- main
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
        browser.close()
    srv.shutdown()
    print("%d of %d passed in %.0f s%s" % (len(todo) - failed, len(todo), time.time() - t_all, "" if not failed else "; screenshots in " + SHOTS))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
