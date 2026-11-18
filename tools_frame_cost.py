"""What each 3D scene costs a frame, worst first (2026-11-18, queued for after the full regression).

Opens every page that holds a 3D scene in the same muted headless browser as tools_regress.py, lets it settle,
then for four seconds counts frames, frame gaps and the WebGL draw calls the page makes (a hook on
drawElements/drawArrays, so the ten rooms count as well as the _dssThreeRegistry scenes). Lights are read
from _dssThreeRegistry where a scene is registered there.

  ~/.dss-regress/venv/bin/python -u tools_frame_cost.py            all of them (about 10 minutes)
  ~/.dss-regress/venv/bin/python -u tools_frame_cost.py french     names containing "french"
  ... --out frame-cost.json                                         also write the numbers

Never beside tools_regress.py or another headless job: they share the GPU and the numbers lie.
Headless runs on this Mac's GPU, so a tester's laptop is slower; use the ranking, not the fps, to choose.
The Airport Pub reads about 85 draws a frame, 61 fps, since dssBatchStatic (1,449 and 43 before).
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tools_regress as T  # noqa: E402  (main() only runs under __name__ == "__main__")
from playwright.sync_api import sync_playwright  # noqa: E402

PASSAGES = [
    # pages with a room container (xx-container)
    "Title", "Airport Pub", "Alley: Soho Square", "Approach Centre Point", "Approach Chinese Fish and Chips",
    "Approach Coppers Lair", "Approach Lacklands Office", "Approach O'Flatterly", "Approach Ronnie Scott's",
    "Approach The Coach", "Approach The Colony Room", "Approach The French", "Approach The Ginger Light",
    "Approach The Pillars", "Approach Trisha's", "Bourchier Street: The Car Park", "Chinese Fish and Chips",
    "Coach and Horses bar", "Coach and Horses lock", "Easter Island Shore", "Entering The Pillars of Hercules",
    "Lackland's Back Room", "Martin Lackland's Office", "Mister Jimmy’s Drug Store", "Nazca Approach",
    "O'Flatterly's shop", "Pyramid Mouth", "Ronnie Scott's", "Soho Hut Burns", "Soho Square: the hut",
    "The Barbershop", "The Coach Burns", "The Colony Room", "The French", "The Plain of Chebar",
    "Third Pillar Portal", "Trisha's", "Turn to Copper", "Waiting outside the chippy",
    # the games with a renderer of their own (measured as they open, under the rules card if it is up)
    "Nazca Race", "The Climb", "The Reclamation", "Trisha's Beer Mats",
]

GLHOOK = r"""(function () { var C = window.__glc = { calls: 0 };
  function wrap(P) { if (!P) return; ['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced'].forEach(function (n) {
    var f = P.prototype[n]; if (!f) return; P.prototype[n] = function () { C.calls++; return f.apply(this, arguments); }; }); }
  wrap(window.WebGLRenderingContext); wrap(window.WebGL2RenderingContext); })();"""

MEASURE = r"""() => new Promise(function (res) {
  var C = window.__glc || { calls: 0 }, c0 = C.calls, n = 0, gaps = [], t0 = performance.now(), last = t0;
  (function f() { var now = performance.now(); if (n) gaps.push(now - last); last = now; n++;
    if (now - t0 < 4000) return requestAnimationFrame(f);
    gaps.sort(function (a, b) { return a - b; });
    var pts = 0, spots = 0, shadows = 0, scenes = [];
    try { var reg = window._dssThreeRegistry || {}; Object.keys(reg).forEach(function (k) { var R = reg[k];
      if (!R || !R.renderer || !R.renderer.domElement || !R.renderer.domElement.isConnected) return; scenes.push(k);
      R.scene.traverse(function (o) { if (!o.visible) return; if (o.isPointLight) pts++; if (o.isSpotLight) spots++; if (o.isLight && o.castShadow) shadows++; }); }); } catch (e) {}
    res({ fps: Math.round((n - 1) / ((now - t0) / 1000)), med: +gaps[Math.floor(gaps.length / 2)].toFixed(1),
          p95: +gaps[Math.floor(gaps.length * 0.95)].toFixed(1), calls: Math.round((C.calls - c0) / Math.max(1, n - 1)),
          canvases: document.querySelectorAll('canvas').length, scenes: scenes, pts: pts, spots: spots, shadows: shadows,
          pn: ((document.getElementById('dss-pn') || {}).textContent || '').trim() }); })(); })"""


def main(argv):
    out = None
    if "--out" in argv:
        i = argv.index("--out"); out = argv[i + 1]; argv = argv[:i] + argv[i + 2:]
    want = [a.lower() for a in argv]
    names = [p for p in PASSAGES if not want or any(w in p.lower() for w in want)]
    srv = T.serve(); port = srv.server_address[1]
    rows = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=T.chrome_path(), headless=True, args=T.FLAGS)
        for name in names:
            r = T.Run(browser, port, "cost:" + name)
            r.ctx.add_init_script(GLHOOK)
            row = {"passage": name}
            try:
                r.go(name, wait=10000)
                try: r.clear_lore(); r.clear_slips()
                except Exception: pass
                r.page.wait_for_timeout(1500)
                row.update(r.js(MEASURE))
            except Exception as e:
                row["error"] = str(e)[:160]
            row["pageerrors"] = r.errors[:3]
            rows.append(row)
            print("%-36s %s" % (name, row.get("error") or "%3d fps  med %5.1f ms  p95 %5.1f ms  %5d draws  %d pt / %d spot / %d shadow  %s" % (
                row["fps"], row["med"], row["p95"], row["calls"], row["pts"], row["spots"], row["shadows"], ",".join(row["scenes"]) or "(room)")), flush=True)
            try: r.ctx.close()
            except Exception: pass
        browser.close()
    srv.shutdown()
    ok = [x for x in rows if "fps" in x]
    print("\nworst first (p95 frame gap, then draws):")
    for x in sorted(ok, key=lambda x: (-x["p95"], -x["calls"])):
        print("  %-36s p95 %5.1f ms  %3d fps  %5d draws  %d point lights" % (x["passage"], x["p95"], x["fps"], x["calls"], x["pts"]))
    if out:
        with open(out, "w") as f: json.dump(rows, f, indent=1)


if __name__ == "__main__":
    main(sys.argv[1:])
