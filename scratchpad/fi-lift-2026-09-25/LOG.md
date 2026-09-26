# Inside the French — graphics lift

Completed on `claude/scene-closeups-pe93vp`. No git commands or rebase; **no commits created**, following the project rules. Seven incremental `.patch` files preserve the requested order, and replay exactly from the initial source to the final source. All changes are already present in the working .twee; do not apply these patches again on top of it. Sam can commit using GitHub Desktop.

Only the Inside the French IIFE changed in the game source. `python3 sync_html.py` generated the HTML. The compiled HTML was never read by the assistant; the browser loaded it normally for tests.

- [x] Materials: layered mahogany grain and worn varnish, aged paint, worn carpet pile, warm procedural environment reflections on brass and bottle glass, a real planar mirror with tarnished edges.
- [x] Light: ACES exposure 0.55, globe-led falloff, warm ceiling/counter/floor pools, visible soft glow, weaker fill, soft stool contact shadows. Static shadow maps avoid six redundant renders each frame.
- [x] Frieze: 4096×384 procedural sepia head-and-shoulder studies, varied ink contours, hair, hats, glasses and hatching, cream mounts and fine black frames.
- [x] Photographs: portraits and groups, faded tonal modelling, silvered edges, scratches and fine grain. The deliberate pale frame is unchanged.
- [x] Atmosphere: faint lamp haze, soft light-catching dust, slow small lamp fluctuations. Three pale figures unchanged, including their opacity and breathing.
- [x] Hover: an uneven warm bloom over the object, no outlined ring. Picking, halo placement and hotspot roots retained.
- [x] Phone: original camera retained; telephone and bar are in frame at 390×780. Mipmaps and modest anisotropic filtering soften distant fine detail and prevent shimmer.
- [x] Syntax, desktop, phone, reduced-motion, runtime and preservation checks.

## Before and after, by stage

Each before is the preceding completed stage. These are full browser screenshots, not mockups.

| Stage | Before | After |
|---|---|---|
| 1. Materials | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/00-baseline/2-the_telephone.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/01-materials/2-the_telephone.png>) |
| 2. Light | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/01-materials/0-room.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/02-light/0-room.png>) |
| 3. Frieze | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/02-light/1-the_photographs.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/03-frieze/1-the_photographs.png>) |
| 4. Photographs | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/03-frieze/1-the_photographs.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/04-photographs/1-the_photographs.png>) |
| 5. Atmosphere | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/04-photographs/0-room.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/05-atmosphere/0-room.png>) |
| 6. Hover bloom | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/05-atmosphere/5-hover-the_glass_on_the_bar.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/06-hover/5-hover-the_glass_on_the_bar.png>) |
| 7. Phone filtering / framing | [Before](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/07-phone/phone-0-room.png>) | [After](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/07-phone-after/phone-0-room.png>) |

Overall: [original room](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/00-baseline/0-room.png>) · [finished room](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/09-final/0-room.png>) · [finished phone view](</Users/samquill/Claude work/Dream Street Shuffle - Game Files/scratchpad/fi-lift-2026-09-25/07-phone-after/phone-0-room.png>).

## Verification

`node --check` passed on the extracted full UserScript before every sync. The repository was served with `python3 -m http.server 8777` from its root.

The supplied `fi_shot.py` ran from `scratchpad/audit-2026-09-16` at 1280×900, 390×780, and 1280×900 reduced motion. All four close-up cards opened and stepped back; TO THE BAR landed on The French; zero JS errors. Every stage has its own screenshots and text results here.

**Portrait test limitation:** the original portrait camera puts the blue door at x≈523 in a 390px viewport. The supplied script uses a synthetic out-of-viewport pointer event to open that card. This verifies the card mechanism but does not prove that the door is reachable through an ordinary tap in portrait. That framing predates this work and was preserved. The telephone (x≈17) and bar are inside the viewport, as requested, and were additionally exercised with in-viewport touch pointer events. No hotspot or idle camera values changed.

The separate runtime check exercised touch on the telephone, returning, direct bar entry (independent of the button), disposal of geometry/materials/textures, removal of the registry entry and loss of the WebGL context. It also tested a device scale factor of 3: desktop remained capped at 1.5; phone at 1.25.

Measured on Apple M2 / Chrome ANGLE Metal, from wrapper construction through the first completed main render: **481ms desktop; 356ms phone**. These are laptop measurements, not measurements on physical phone hardware. Desktop idle: 251 draw calls / 9,030 triangles. Phone: 215 calls / 7,476 triangles. The reflection uses a 1024px desktop / 512px phone render target, refreshed on viewpoint changes; no new vendor files or post-processing passes. Its render target is released via the existing scene geometry disposal path.

Reduced-motion camera, lights, dust positions and sprite opacities remained byte-for-byte stable across sampled frames. The original screenshot harness set the preference after navigation; the local adapter sets it before navigation so `fiStill` is genuinely active at construction.

Runtime checks found **zero page JS errors, zero console errors and zero WebGL errors**. Safari was not run.

## Preservation

`preservation.json` records exact comparisons against the initial source: all text outside the IIFE, HOTSPOTS, card text and pink styling, beginTween, pick, pointer handlers, curtain/goIn, TO THE BAR and hint, ghost code, camera values, the pale frame, fiWrap.dataset.cam, pixel-ratio caps and teardown are unchanged. Materials, texture generation, light/atmosphere rendering and the halo's visual material are the intended edits.

## Local test setup

Playwright is installed in `/tmp/dss-fi-venv`; the installed Google Chrome is used. `run-local.py` adapts only the harness's Linux paths and reduced-motion initialization in memory, then runs the original fi_shot.py unchanged. `verify-runtime.py` contains the extra performance, motion, touch and disposal checks. The original harness and test files were not edited. The old unresponsive local server was restarted on the requested port.

Synced, commit when ready.
