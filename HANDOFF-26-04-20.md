# Dream Street Shuffle — Handoff Note
**Date:** 20 April 2026
**Primary file this session:** `oxford-street-from-centre-point-3d-static.html` (the 3D approach render)
**Also touched:** `Dream Street Shuffle.twee` → built via `python3 sync_html.py`

---

## What was done this session

### 1. 3D Oxford Street render — shipped to production quality
The `oxford-street-from-centre-point-3d-static.html` scene (Centre Point rooftop, looking west down Oxford Street at dawn, 1973) went through a long alignment + feel pass.

**Alignment bugs fixed**
- Z-axis sign error in the street-local → world-space position formulas. With `STREET_ANGLE = 0.06`, the zebra crossings, street lamps, shop fronts and lamp arms were being placed on an anti-diagonal (combining near-end X with far-end Z) instead of along the street.
- Correct formula derived: `pz = cz2 - sinA * side - cosA * (along - STREET_LEN/2)` (was `+ sinA * side + cosA * ...`). Applied in `addZebraCrossing`, `addStreetLamp` (base + arm/head/bulb/halo), and `addShopFront`.
- Shop fronts were at 90° to the road. Fixed: `rotation.y = STREET_ANGLE - sign(side) * Math.PI/2` so the window box's +Z face actually points onto the road.
- Lamp arm/head rotation sign corrected (`STREET_ANGLE`, not `-STREET_ANGLE`).

**London-ness pass**
- Building grid extended from `gx [-90,90], gz [-220,42]` to `gx [-140,140], gz [-600,42]` so the roofscape fills the full street length.
- Height distribution rewritten for London 1973. Near-Oxford-Street cells get a commercial-block distribution (including 8% landmark slabs 16–23m — Selfridges/M&S-scale); off-street cells are dominantly 2–3 storey terrace with occasional larger blocks. Distance-based skip rate and height caps so far-off cells thin and flatten into fog naturally.
- Removed the far-distance silhouette ring (220 boxes at 220–560m) — horizon now dissolves into fog instead of hitting a hard silhouette band.

**Final polish requested by Dr Quill**
- `STREET_WIDTH` 14 → 10 (thinner road).
- Lamp bulb emissive 1.8 → 3.4 intensity, warmer amber; halo sprite scale 3.2 → 5.2; halo texture gradient hot-core bumped from 0.55 → 0.92 opacity. Lamps now punch through the fog.
- Morning stars: canvas-drawn star field expanded from 14 faint stars in the top 18% of sky to 70 stars in the top 42%. ~10% are "morning star" brights with a soft radial bloom.

### 2. Integrated into the game's ending flow
Dr Quill wanted the 3D scene to appear after clicking "Go!" at the end, hold for a few seconds, then fade to the existing White page / Black page.

**Two new passages** added to `Dream Street Shuffle.twee`:
- `Dawn Approach White` (tag: `dawn-approach dawn-approach-white`)
- `Dawn Approach Black` (tag: `dawn-approach dawn-approach-black`)

Each embeds the 3D render as a full-viewport iframe (`<iframe src="oxford-street-from-centre-point-3d-static.html">`), holds it clear for ~4 seconds, then fades to white/black over ~3 seconds via CSS keyframe animation, then `(after: 7s)[(go-to: "White page")]` (or Black).

**Redirected the Go! links:**
- `:: Alba Complete` → `[[Go!|Dawn Approach White]]`
- `:: Alba Incomplete` → `[[Go!|Dawn Approach Black]]`

The original `White page` / `Black page` passages are unchanged — `EXPLICIT. LIBER. EST.` → `PLUS. ULTRA.` → `Dawn` still runs as before, just with the 3D approach prepended.

**CSS** added to `:: UserStylesheet` (end of file): `.dawn-approach` (fixed fullscreen overlay at z-index 9999 with a sky-indigo background to prevent a white flash during iframe load), `.dawn-approach-iframe`, `.dawn-approach-overlay-white/-black` with `dawnFadeWhite` / `dawnFadeBlack` keyframes (hold transparent for 55% of 7s, fade to solid over remaining 45%).

Sync ran: 160 passages written to the compiled HTML.

---

## Pending / open work

### Iframe-loading UX
The 3D scene takes a second or two to initialise Three.js on slower machines. Right now the `.dawn-approach` container has a `#0a1428` sky-indigo background as a placeholder — this should prevent a white flash but may read as a dark pause. If it feels jarring on Dr Quill's machine, options: (a) preload the iframe on the previous passage (Alba Complete/Incomplete) via a hidden iframe that's then revealed, or (b) add a subtle loading fade-in on the render itself.

### Timing
Set to 7 seconds total (4s hold + 3s fade). Dr Quill may want to tweak — adjust `(after: 7s)` in both passages and the `7s` duration in the `.dawn-approach-overlay-white/-black` CSS rules.

### No interaction on the 3D scene
The render is static (no OrbitControls) so the user can't accidentally rotate it. If Dr Quill ever wants to make it interactive, the iframe should also get `pointer-events: none` removed and focus/interaction-trap handling added.

### Z-sign fix — small residual side-offset errors
The lamp arm/head/bulb/halo side offsets were fixed for the Z axis. The X formulas also technically have a side-offset dependence on sin(θ), but the errors there are under 5cm and invisible. Not worth touching.

---

## How to test
1. Run `./start_game_server.sh` (or `python3 -m http.server 8765`).
2. Open `http://localhost:8765/Dream%20Street%20Shuffle.html`.
3. Either play through to an ending, or use Twine's passage jumper to go straight to `Dawn Approach White` or `Dawn Approach Black`.
4. Standalone preview of the render itself: `http://localhost:8765/oxford-street-from-centre-point-3d-static.html`.
