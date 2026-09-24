## Polish loop 2026-09-23 — pass 7, spectral touches

Sam's rule: beauty here is spectral, the trace, the ghost, the memory. Five touches, each its own commit with before/after in the project files `polish-loop/`: the Dean Street title and the title screen carry two faint offset after-images of themselves inside their glow keyframes (shadow counts must match in both keyframes or the copies blur); the memory-photo prose has a ghost-ink double; the tile-map walker leaves pale 2×2 footprints that fade over ~7s (`S.trail`, drawn just before the walker's light); and **the after-image of the passage just left** (UserScript "THE AFTER-IMAGE": a clone of the departing `tw-passage` inside `tw-story`, inert, animations frozen, 0.95s fade and 7px lift, off under reduced motion, `window.DSS_AFTERIMAGE = false` switches it off). The notebook has two of its own: the map's ink shows mirrored and faint (8.5%) through the paper of every other tab (a data-URI background built once from the map SVG by the layout script), and the page lingers and fades when the notebook closes (same after-image script; the pentangle-reveal and layout scripts now look up `tw-dialog .nb-page` so they never catch a ghost). Tried and dropped as invisible: a lingering link hover glow, a warm afterglow at the map doorway just left, a walker reflection. Regression after all of it: every route and the phone sweep re-run, nothing new broken.

## Polish loop 2026-09-23 — pass 4, every route played

`scratchpad/polish-loop-2026-09-23/routes.py` walks the five dream worlds (win / lose / turn back), the complete and incomplete nights, Alt-Dawn and every minigame outcome, at 1212 and at 390 with reduced motion: no broken links, dead state, tw-errors or JS errors anywhere. Fight, waltz, cards and worm exits use their own ids (`go-fight-*`, `waltz-up/down`, `.cards-payment [data-outcome]`, `.worm-payment`) so the walker's generic `-win/-lose` forcing does not reach them; those were walked by hand and are clean.

## Polish loop 2026-09-23 — pass 6, consistency

`html` now carries the night colour (#0a0908; white on the white-page ending via `:has()`) so Safari's overscroll bounce is not white. `buildCaScene` (the coast of Carthage; not the Colony approach as last night's log said) got the reduced-motion hold every other scene already had.

## Polish loop 2026-09-23 — pass 1, overlapping text

Full overlap/spill/clip sweep at 1212 and 390 (`scratchpad/polish-loop-2026-09-23/overlap_sweep.py`). Three fixes: the Fetch Window SVG caption group closed too early (lines ran off the pane, same fault as Fetch Street last night); the ten one-line-cssText scene ENTER buttons now nowrap with `min()`-eased padding/spacing so they stop wrapping on phones; Lackland's approach caption on one line so it clears the button. Everything else flagged was a modal or scene covering content by design.

## Polish loop 2026-09-23 — pass 5, signposts inside the panes

`.glass-pane`, `.ending-pane` and `.back-to-night-glow` came off the signpost script's SKIP list, so The Fetch's "Follow him" / "Not yet. Back to the night." and the Alba pages' "Traveller, wake!" / "Traveller, sleep!" now match the other passage links. White page and Black page ("PLUS. ULTRA.") deliberately still skipped: bare typographic endings.

## Polish loop 2026-09-23 — pass 3, the pink placeholders cut to the docs' versions

The short pink placeholders from the six second-edition dream-loop documents (cuts.py in the project files) are now in the game in place of the long ones, 50 groups across 38 passages, pink class kept. Script `scratchpad/polish-loop-2026-09-23/apply_cuts.py`. The Mountain, The Cave and Himalayan Return already had Sam's prose; Nazca Race, Pyramid Run and The Climb have no pink prose on screen (the docs show intro paragraphs the game never had; not added).

## Polish loop 2026-09-23 — pass 2, notebook map positions

Branch `claude/polish-loop-2026-09-23-dkhohi` (four-hour loop Sam approved 04:31 UTC; log in the project files, `polish-loop/Polish loop log 2026-09-23.md`, copy in `scratchpad/polish-loop-2026-09-23/LOG.md`). Eight notebook-map markers moved to match the Dean Street tile map's DOORS table: Chippy to Dean Street north (was Wardour), Trisha's to the west side of Greek below Bateman (was east side above it), the Ginger Light to the Dean/Old Compton corner (was the Bateman crossing), and small pavement-side nudges for Colony, Lackland's, the French, the Coach and the Pillars. The five-lily pentangle now runs through the five doors where the lilies are actually gathered (Chippy, Pillars, Ronnie's, Colony, French; Sam's call, 16:45 UTC), the ring at five redraws the lilies there and the single markers stand down at five; lopsided by design. Reshaped 18:20 UTC at Sam's ask: Trisha's is now up beside the Pillars on the west side of Greek Street (476,188) and, after a second ask at 18:30, Ronnie's back on Frith's west kerb (340,450) with the Colony dot set just inside its block (208,420); the tile map's Trisha's door was then moved to match (c39,r13, west side of Greek opposite the Pillars, 19:20 UTC) and the notebook's LBRP verse box dropped 34 units so the French lily reads above it (it now covers the Shaftesbury Avenue label while the verse shows). The Lackland's approach caption says Wardour Street while both maps say Frith: not changed.

## Centre Point ending chain — review pass, 2026-09-23

Sam asked to look at the final scene (follow the fetch to Centre Point) as a player sees it. Chain: Towards Dawn → The Fetch → Approach Centre Point → Alba Complete/Incomplete → Dawn Approach White/Black → White/Black page → Dawn. Played end to end in headless Chromium at 1280 and 390 wide, with reduced motion, on both routes: 0 tw-errors, 0 game JS errors, no horizontal overflow. Screenshots in project files `centre-point-review/`.

Fixed on branch `claude/centre-point-scene-9jo9fx`: (1) Fetch Street SVG — the caption group `<g ... text-anchor="middle">` was closed immediately, so the three timed captions lost their centring, italic, size and colour and ran off the right edge; the `</g>` now sits after the captions. (2) Centre Point `CLIMB IT` button wrapped to two lines on phones (fixed element at left:50% shrinks to half the viewport) — `white-space:nowrap` on both the real and the WebGL-fallback button. (3) The "Every man and every woman is a star." caps line was wider than a 390px screen — under 480px it drops to 11px / 0.1em spacing. Words untouched.

Not changed, for Sam's call: the Fetch SVG's SMIL animation and the 15s link gate ignore prefers-reduced-motion (the approach scenes hold still); the astral reveal likewise; the tower scene has none of the polish-loop ground light; the chain's links sit in containers tonight's signposted-choice restyle skips (`.glass-pane`, `.ending-pane`, white/black/dawn-approach tags). Dawn Approach's Oxford Street iframe is the heaviest moment in the game (a full three.js scene inside an iframe); under software GL here it blocked the page for ~15s, so its timings were not measurable in this sandbox.

## House of Cards — remove card chooser, 2026-09-23

Removed the Choose a card dropdown and its option-building/listener code at Sam's request. Players grab cards directly on the canvas; movable bases, tilt controls and Cancel adjustment remain. Rules no longer mention a menu. Existing base/revision browser checks now select cards by clicking their drawn bodies. Source synced; no git commands.

## House of Cards — movable feet, 2026-09-23

Sam clarified that card bases must move, not just their angles. Every placed card now stores its own foot position independently of lean: ground feet use table coordinates; upper feet use coordinates along their supporting bridge. Moving/tilting one half of an A-frame no longer silently moves its partner's foot. Suggested starting positions remain, but the player can override them.

Drag the visible ring at the foot to slide its base. Releasing a base drag leaves a preview so the angle can still be adjusted before Place/Set card. Base arrow buttons and Shift + arrows move it in 2-unit steps. Works for new and previously placed cards; free readjustment, cancel, pointer-cancel and pending-new-card position preservation all remain. Upper feet stay on their supporting surface. Pair tips must meet within `CONTACT_TOL=[18,15,12]` canvas units; bridges must remain within 18 units of their supporting tips. Invalid edits remain cancellable previews. All new instructions stay in the passage's draft div.

Verified desktop and 390px touch in Chrome: actual base drags, independent angle control, persisted positions, free edits to either paired foot, partner foot remaining fixed, invalid separation/cancel, touch cancellation restoring the foot, no overflow, teardown, and a complete winning 15-card house on shifted ground and upper-storey bases. Zero Harlowe/JS errors. Passage script parses; only House of Cards source changed. Evidence: `scratchpad/house-cards-2026-09-23/base-verify.cjs`, `base-results.json`, desktop/phone screenshots. Synced; no git commands.

## House of Cards play-test revisions — 2026-09-23

Sam asked for thinner cards, much less disturbance and the ability to move placed cards. Cards are now 5px thick instead of 14px in the 600px canvas coordinates, with lighter borders/shadows and smaller suit marks. Ordinary angular nudges are now 0.2–0.8 degrees (plus the existing small storey multiplier), damage `[.018,.023,.028]`, final damage `.12`, with a gentler canvas shake and 1.5s quiet after placement. No placement changes earlier cards' stored angles. The table stays steady while a pointer is held or a placed card is being adjusted.

Tap a placed card or choose it in the labelled selector to edit its angle; drag/release, arrows/Space or Set card confirms. Adjustments spend no cards and do not count as falls. Invalid edits remain previews, so the player can correct them or cancel; Escape also cancels. Pointer cancellation restores the selected card's committed angle. A meaningful successful adjustment recalculates that card's stability; simply selecting it does not. Supported cards follow preview geometry and return on cancellation. All 15 cards down now enables **Face the roar** instead of immediately starting the final tremor, leaving time to repair the whole house. Once chosen, the warned final roar and existing outcomes run normally.

Verified local Chrome desktop and 390px touch: thin-card selection, drag and keyboard edits, free repairs, invalid-edit cancellation, unchanged existing geometry on ordinary placement, reduced tremor angles, upper bridge adjustment with the house intact, explicit final test and distinction return, touch cancel, no overflow and teardown. Zero Harlowe/JS errors. Only the House of Cards passage changed; other source passages match the pre-revision snapshot. Evidence: `scratchpad/house-cards-2026-09-23/revision-verify.cjs`, `revision-results.json`, desktop/phone screenshots. Synced; no git commands.

## House of Cards at The Green Sea — 2026-09-23

Implemented locally on `codex/green-sea-house-of-cards` (created through GitHub Desktop; no git commands, commit or push). New optional `Green Sea House of Cards [green-sea]` passage sits beside LINE 2, whose only change is the requested pink entry link. Original prose, Listen/sobriety gate, alba variables and exits are unchanged. Sam resolved the brief's arithmetic: **15 structural cards (12 leaning + 3 bridges), deck 18 = three spares**. Rewards retain the requested Gents defaults: first completed round only, `$statGain` with 8/12 and the inventory note; loss settles the once-flag without reward. Thus from morale 70 the existing formula yields 75/77, not 78/82. `$houseCardsPlayed` resets in StoryInit and Start. All new player-facing text is within draft divs.

**Knobs, at the top of the passage script:** `IDEAL=70` degrees; `LEAN_TOL=[15,12,9]` by storey, with hard 55–85-degree limits; `MATCH_TOL=[12,9,6]`; `BRIDGE_TOL=[7,5]` around level. Initial stability is `1-.85*normalizedError`. `DAMAGE=[.035,.045,.055]`, multiplied by `.85+nudge/8` per roar; `FINAL_DAMAGE=.16`. Angle nudge is random ±1–4 degrees, scaled by `1+level*.08`. `INTERVAL=[8,6.8,5.6]` seconds plus 0–0.8 jitter; warning one second before, final roar 1.2 seconds after completion. `DECK=18`; no hard countdown loss (only exhausted cards/incomplete house or final collapse). A considered run takes about a minute. Support dependencies cascade upward; lower missing cards are offered for repairs, no spent cards are refunded. Mouse/touch drag rotates, release/tap places; arrows step 2 degrees, Space places; on-screen buttons also available. Silent roars preserve the cafe bed; no new assets or retro music tag.

**Verified in local Chrome/Playwright:** rules popup/emblem, drag/release and keyboard placement, natural ~55-second no-fall completion through periodic/final tremors, win/loss and automatic return to LINE 2, 8/12 reward notes with the existing stat formula, no repeat reward (including loss then win), support cascade leaving another pair intact, completed-house failure in final roar, 150-second Harlowe escape, 390px touch drag/tap/cancel, reduced-motion flash, 1.5 pixel cap, no horizontal scroll, testing-skip teardown. Zero Harlowe/JS errors. Full UserScript and new passage script pass Node syntax checks; compiled passage/tag confirmed with targeted grep. Evidence and reusable verifier: `scratchpad/house-cards-2026-09-23/`. `CARDS_QUICK=1` skips the long dwell; `CARDS_EXTRA=1` checks final collapse/escape only. The initial long-run assertion expected linear +12, exposed the existing stat formula, and was corrected; game reward code already matched the brief.

Dev only: `_houseCardsDev.snapshot()`, `.angle(n)`, `.place()`, `.roar()` and `(skip — testing)`; skip leaves reward eligibility untouched. Listener/observer/RAF cleanup runs when the passage disconnects. Reward stays visible 2.8s before auto-return, with a working visible return link if automatic navigation fails. Synced, commit when ready.

**STATE 2026-09-23, 04:40 UTC — the Third Pillar water fix (20s) lives on branch `claude/third-pillar-water-fvnwma`, one commit off main (43d2513, after Sam merged 20r and the signposted links), pushed, NOT on main. Sam merges it in GitHub Desktop. If the html conflicts on merge, take either side and re-run `python3 sync_html.py`; the twee is the truth.**

**STATE 2026-09-23, 04:10 UTC — the last six of Astra's approach scenes (20r) live on branch `claude/approach-scenes-finish-w8g6va`, pushed, NOT on main; started from main at 23ec574 (the Dean Street map Safari fix). Sam merges it in GitHub Desktop. If the html conflicts on merge, take either side and re-run `python3 sync_html.py`; the twee is the truth. Astra's list is now complete.**

**STATE 2026-09-22, 05:00 UTC — the overnight polish loop (20q) lives on branch `claude/project-thread-fqjdg9`, pushed, NOT on main. Sam merges it in GitHub Desktop when he wakes. If the html conflicts with main on merge, take either side and re-run `python3 sync_html.py`; the twee is the truth. Ten of Astra's sixteen approach scenes are done there; the list resumes at buildTPScene.**


**STATE 2026-09-22 — everything below 20a–20p is on `main` and pushed (last: Astra's first two approach-scene retouches, verified here, 20p; sixteen scenes remain in its list). No feature branches in use: commit to main, pull first because Sam runs other assistants on main between turns. .html synced; every code change verified in a real browser (recipe in 18e, harness and verify scripts in `scratchpad/audit-2026-09-16/`).**


**STATE 2026-09-22 — everything below 20a–20p is on `main` and pushed (last: Astra's first two approach-scene retouches, verified here, 20p; sixteen scenes remain in its list). No feature branches in use: commit to main, pull first because Sam runs other assistants on main between turns. .html synced; every code change verified in a real browser (recipe in 18e, harness and verify scripts in `scratchpad/audit-2026-09-16/`).**


### Coach plumbing transition — 2026-09-22
- Refined the SVG in Coach and Horses lock: larger framing, thinner verdigris/amber pipe seams, fewer spray particles and cheaper glow/grime filters, slower counter-rotation, travelling wet highlights, one bead receding against the flow, softer porcelain dissolve. Reduced-motion uses a short plain fade. Crash trigger, sound, travel timing, prose and links preserved. Synced; SVG parsing and full UserScript syntax check passed; no browser preview. Approach queue still resumes at buildPHScene.



### Approach graphics — first two scenes, 2026-09-22
- **buildFHScene / French House:** slow doorway breath, light-catching sash glass, broken amber reflection in the existing road patch, 24 faint motes (one rises against the rest), quieter green fairy; one additional draw. Lower pixel-ratio cap; motion freezes for reduced-motion preference.
- **buildCHScene / Coach and Horses:** gentler asynchronous lamps, glossier red paint/glass/brass, smoke without depth-writing, existing puddles catch broken window colour and an ember reflection that anticipates the smoker; no additional draws. Corrected wet-map alpha, slower local grain refresh, reduced-motion handling and lower pixel cap.
- **Scope / validation:** only these two scene functions changed; labels, links, prose, games and shared helpers untouched. Each scene synced and full UserScript passed Node --check before its own commit (f4a9624, Coach commit immediately after). Used bundled Node because node is not on PATH. No browser run; judge brightness and effect visibility in play.
- **Left, in order:** buildPHScene, buildCLScene, buildRSScene, buildTSScene, buildGLScene, buildCPScene, buildOFScene, buildFcScene, buildLOScene, buildCRScene, buildTPScene, buildapScene, buildnzScene, buildeiScene, buildpyScene, buildpcScene. Stopped after two scenes to keep within the requested partial-budget pass. Next: Pillars, then Colony; read only each named function, one scene per sync/syntax-check/commit. Retain the existing shared film-grade layer; no added post passes.



**STATE 2026-09-22 — everything below 20a–20p is on `main` and pushed (last: Astra's first two approach-scene retouches, verified here, 20p; sixteen scenes remain in its list). No feature branches in use: commit to main, pull first because Sam runs other assistants on main between turns. .html synced; every code change verified in a real browser (recipe in 18e, harness and verify scripts in `scratchpad/audit-2026-09-16/`).**


### Dream-game retunes — 2026-09-22
- **Nazca Race:** braking now overrides boost; advance bend/slick cues, item-specific instructions and position-appropriate pickups; gentler rival pace with a standing start, no close-range slick drops; true-width road rims. Gold wake batched into one draw, bounded discarded hazard geometry, smaller shadows/pixel budget and no phone bloom.
- **Pyramid Run:** this passage is 2D, not three.js. Fixed keyboard length typo; fixed-step physics, wider jump buffer/coyote window, surface-crossing landings, measured shorter snake hops with matching wider visible heads, brief rescue pause, persistent pit/duck/scarab/sand cues. Wider, slower torch pools, gentler darkness, light-catching motes and moving Gallery shafts.
- **The Reclamation:** drones spawn closer, move more steadily and are easier to see; paced waves capped at five live machines, smaller spirit hit regions and greater spirit separation, dead machines excluded from shots; extinguished rig lamps stay out. Softer glare/sway, target-specific HUD and reload countdown, touch drag aims without firing. Ground mesh aligned to collision height; broken horizontal moon reflection, specular sea with fewer vertices/updates and gentler bloom.
- **Left:** all exit links/targets, win variables, dev skip links, prose outside the games, scoring thresholds, route identities and endings. Each game synced and committed before the next.
- **Verification / next:** system Python has no Playwright; skipped reclamation_verify.py exactly as requested. No repeated play or wider audit. Next: run that script with Playwright available, then judge Nazca bends/braking, snake-head hops and touch aiming on a phone. Gameplay and rendering remain browser-unverified.


**Read in this order:** 20p (Astra's approach-scene graphics pass, two scenes done, list of the rest), 20o (Astra's three dream-game retunes + verification), 20n (Astra's Climb retune + verification), 20m (beauty pass, visual only), 20l (The Reclamation rebuilt in 3D), 20k (all dream minigames compulsory), 20j (The Climb pass 3: wind, whirlwind, avalanches, plateaus), 20i (Climb pass 2), then 20a–20h (the audit and its fixes).

**Open, all Sam's call, none started:**
1. Play and judge: The Climb's wind strength and avalanche visibility (knobs named in 20j); The Reclamation's drone range, glare and the ten-count (knobs in 20l); the beauty pass on a phone (if it stutters, drop the two screen-blend layers first, 20m).
2. Pink placeholder prose everywhere, and the prose queries left unfixed from the 2026-09-16 read (leeching, dutchy, merly, brisket, "like time but not but", "Seeing clockwise", "of she who", Colony Rooms, Ben Ali, Billy Piper).
3. Still from 18f: the Yeti "Into the cave" question, venue sides on the scrolling map, the bed listen-through, the alley passages.
4. Nothing reads `$easterReclaimWon` or `$himalayaClimbWon` downstream yet; both are set on a win if Sam wants the worlds to remember.

### 20a — WHAT WAS CHECKED
- **Static:** 230 passages, 0 duplicates, 0 missing link targets (every `[[ ]]`, `(go-to:)`, `(display:)`, `(link-goto:)` literal resolves), 122 script blocks pass `node --check`, stylesheet braces balance, no orphan passages, every referenced asset file (5 char PNGs, 3 standalone 3D html scenes, 27 audio beds) exists on disk. The committed .html was rebuilt from the .twee and matched byte-for-byte apart from blank lines (see 20b.3).
- **Every-passage render sweep:** all 206 playable passages rendered under a rich late-night seed -> **0 tw-errors on all 206**, 0 game JS errors. Only three passages have no links (Dawn, Dawn Approach White/Black) and all three auto-advance or end, as designed.
- **The Codex mechanics fixtures (12) re-run + 6 new key-routing ones:** all pass. Each of the five keys opens its own world; no key -> no portal; before the page quest -> no portal; eye alone -> turned back, eye after four -> Chebar; a second unfinished world in the same night opens; a completed world's key vanishes from its venue (French: 1 offer -> 0 with the himalayas gift); an unfinished spent key re-seeds on Dean Street; the synthesis link is display:none until five gifts and visible at five; Red/Inis/Lackland/critic reopen for unacknowledged discoveries; sobriety recovery clears $coachUrgent.
- **Four random walkers, 480 clicks from a natural Title start:** 0 tw-errors, 0 JS errors, no dead ends, no stuck states; between them they walked 60-odd distinct passages (French cycle, Colony, Pillars, Lackland, alleys, gents, phone box, car park).
- **Phone width (390px):** Dean Street, French, Pillars, chippy, Airport Pub: no horizontal scroll, column 351px, map 325px below the lamp.
- **Reload mid-night:** Harlowe's session restore puts you back on the passage you were on; the `auto` save slot is written from hub visit 2 ($returns >= 1) and CONTINUE loads it.

### 20b — WHAT WAS WRONG (all fixed, synced)
1. **A stray backslash printed at the top of EVERY screen in the game, Title included.** The Codex session's new `Dream Progress` [system] passage ended with a trailing backslash, and it is (display:)-ed as the very first line of the header: exactly the 18b.2 bug, rule already in this file, reintroduced two days later. Visible on the phone screenshot as the first character above the title. Backslash removed. **Re-run the trailing-backslash scan after every batch of system passages** (`static_audit.py` in the scratchpad does it).
2. `Start` ended its $liverReturnTo line with a DOUBLE backslash; harmless because Start (go-to:)s away at once, but the first one was literal text. Cut to one.
3. **The .html carried 328,133 blank lines** (6.18MB -> 5.85MB). `sync_html.py` strips the old tw-passagedata elements but left the newline between each, so every sync added ~230 blank lines to the storydata block, forever. Now collapsed in the cleanup step. Content otherwise byte-identical.

### 20e — THE DAWN DOOR WAITS FOR A VENUE (Sam: "Hide Head towards dawn until the first venue has been visited")
The hub dock's `[[Head towards dawn|Towards Dawn]]` is now `(if: $enteredVenue is true)[...]`. `$enteredVenue` is set in the header the first time a passage tagged `venue-*` renders (the eleven tags the header's exit-link block already lists) or one of the three untagged interiors: Chinese Fish and Chips, At the Corner of Dean Street and Greek Street (the Ginger Light), Maltese Gangsters. Approaching a door and turning back does NOT count (approaches are tagged `outdoor`). Reset to false in both init passages (new-game rule of 2026-09-13); old mid-night saves without the flag get `$returns >= 2`. With no link and no greyed span the Centre Point tile draws shut and its plate is absent, exactly like an unknown venue. Verified live: first visit no link/no plate; approach Ginger Light and turn back, still none; enter the Ginger Light and return, link and plate present; seeded French then exit, present; old save with the flag missing and returns 8, present; header parses on Dawn, Title, chippy, Airport Pub, portal, phone box, alley with 0 tw-errors. NB `Towards Dawn` itself is unchanged and still reachable by (go-to:) from the collapse funnel etc. if anything sends you there.

### 20f — "FORGET COMPLETED DREAMS" TESTING TOOL (Sam: "add a way to wipe completed dream worlds for testing")
In the DEBUG PANEL (backtick key; needs `window.DSS_DEV`, which is automatic on localhost and switched on for GitHub Pages by opening the game URL with `?dev=1` once, remembered in localStorage) under the "Dreams completed" readout: `⌫ Forget completed dreams (every key opens its world again)`. Confirms, then clears `dssLifetimeGifts` AND the legacy `dssLifetimeWorlds` list, and sets the readout to none. Dream Progress re-reads the store on the next passage: a key that was "spent" for a completed world re-seeds on Dean Street (Dream Progress's existing else-if) and its venue offers it again. Worlds completed THIS night come back from `$worldsVisited`, so for a truly clean first night start a new game after wiping. Verified live: gifts himalayas+nazca → readout lists them, keys spent, French offers none; click → store null, readout none; exit to Dean Street → keyLighter/keyCocaine back to seed, completed empty; To The French → lighter offer printed, 0 tw-errors. This restores what Codex removed, but honestly named (it forgets completion, not just a cycle list).

### 20g — VISUAL PASS ON THE 3D SCENES (first time any remote session could see them; Sam: "Fix them all")
All 21 inline scenes plus the Oxford Street iframe screenshotted at 1280×900 under software WebGL (`--use-gl=angle --use-angle=swiftshader`, ~9s settle each). 16 were fine. Six fixes, each re-rendered and checked:
1. **Ronnie Scott's** — the white COSMOGRAMMA side board (x=2.93) hung in front of the neon hero sign (x=0.5, y 3.6–4.8) from the camera at y=1.7 looking up, hiding OPEN NIGHTLY. Board and its backing strip dropped y 2.94 → 2.6. Neon now fully clear.
2. **Trisha's awning lettering** — `awningFace` was at y=4.75, ABOVE the top of the frame from the camera at y=2.6, so "Trisha's / Est. 1839" was never on screen and the dome read as a black blob; also nothing lit it. Moved to y=4.18 z=1.48 on the dome's front and given `emissiveMap` (0.7) like the fanlight. Reads now.
3. **Trisha's cat** under the centred TRISHA'S button — `tsCat` x −0.66 → −0.94, nearer the lantern; clear of the button.
4. **Easter Island foreground blown to white** — the hard one. NOT the moon, back-fill, foam, haze sprites, shadow map, sea or albedo (each tested as a variant build served from the scratchpad; the whole set of screenshots is in `scratchpad/variants/` locally, not committed). All lights off → black, so it was lighting; MeshLambertMaterial → correct. Cause: MeshStandardMaterial's specular/multi-scatter term at the grazing view along the stones under the night ambient (and it got WORSE with a rougher map). Beach is now `MeshLambertMaterial({map: basaltTex, color: 0xaab4c4})`; `basaltRough` still feeds the pools/boulders. Foam opacities restored to the original after a needless halving. Sam then asked for the sea toned down too: `seaMat` is now MeshLambertMaterial as well (map, colour and emissive kept); the moon road sprite and the glints carry the shine, and the water near the camera is dark with the wake and the road visible.
5. **O'Flatterly caption** — `ofLoc` alpha 0.25 → 0.55 plus a dark text-shadow; the only approach whose pavement is lit.
6. **Pyramid Mouth** — exposure 0.72 → 0.88, ambient and hemisphere 0.62 → 0.78 (scoped to the pyramid block; the Chebar scene has the same exposure line, do not global-replace). Face reads, night kept.
Recipe for next time: `scratchpad/audit-2026-09-16/` harness + the `scenes.py` loop; to isolate a rendering cause, write variant html files with one change each into a scratch folder symlinked to `vendor/` and the audio, serve on a second port, screenshot the same crop.

### 20h — THE EARLY LESSONS SPACED OUT + A FAVICON (Sam: "Do the instruction slip spacing and the favicon")
Before: the 900-character MORALE/SOBRIETY primer inside the first venue, then on hub visit 2 the open-night slip AND the ledger tip AND the door-marks hint all fell due on one screen, queued nose to tail (18a.3's "density" problem). Now, per 18a.3's advice, spaced and not swapped:
- **Breathing space in the queue** (`__dssHintNext`): after a LONG slip (>400 chars, i.e. the primer) the next slip waits until 30s have passed since it left (`__dssHintLastEnd`/`__dssHintLastLong`, set in `finish`). Short slips impose no gap, so a place-bound nudge ("leave what you are carrying here") is never carried to the wrong screen. Verified live: after a long slip a short one is held at 2.5s and shows at 31s; after a short slip the next shows at once.
- **One hub lesson per visit:** open night stays on visit 2 (`$returns >= 2`); the ledger tip now needs `$returns >= 3` as well as `$hauntExplained`; the door-marks hint needs `$returns >= 4` (was 2). Each keeps its own condition and once-flag. Verified live with all three unshown: visit 2 shows open night only; visit 3 adds the ledger; visit 4 adds door marks. NB the door-marks hint sits inside `(if: $metRed is true)[...]` in Dean Street — a test seed without `$metRed` never reaches it (cost me a round).
- **Favicon:** `sync_html.py` now writes a marker-wrapped inline SVG `<link rel="icon">` after the title (dark rounded square, gold lamp glow). The favicon.ico 404 is gone.
18f.5 (nudges under 400 chars are click-through and their hold scales with length) is unchanged.

### 20i — THE 3D CLIMB, PASS 2 (taking up where Astra/ChatGPT stopped, 2026-09-16)
Astra's pass 1 (its own notes are at the END of this file: "Himalayas climb — 3D pass 1" and the three sections after it) is sound: renders, plays, dev E, both exits, teardown all verified here again. Its promised separate `HANDOFF_CLAUDE.md` never reached the repo because `HANDOFF*.md` is gitignored (only HANDOFF.md itself is force-tracked); if Sam has it on the Mac it is worth a read but nothing here depended on it. Pass 2 added, all inside The Climb's script and marked PASS 2 in the passage comment:
- **Bloom + film grade.** Canvas-sized `EffectComposer` + `UnrealBloomPass` (strength .26, radius .5, threshold .95, so only the blue prints, flag colours and yeti eyes bloom), sized in `resize()`, disposed in `cleanup()`. Skipped under 600px wide. `window.dssFilmGrade(frame)` vignette+grain on `.hc-frame`; cover z-index 6 and banner 5 keep them above it; the overlays are removed on teardown (verified 4 → 0).
- **Snowfall.** One `THREE.Points` cloud of 1300 soft round sprites in a 44×26×44 box that travels with the camera, wrapping at the edges; any flake within 2 units of the lens is thrown back to the top. Reduced motion: the cloud is static and moves with the camera.
- **Gusts.** `gust` state machine: idle → warning 1.4s (flurries lean hard to the side and the wind bed rises, `eng.update(gustOn)`) → blowing 1.2s (u += dir×2.4 grounded, ×3.2 airborne; lateral speed is 4.6 so leaning against it wins) → idle, next in 9–17s. Exempt: ladders, the bridge, a running avalanche, the ending, and the stretch before the first flag. A gust caught mid-exemption cancels. Under reduced motion the banner says GUST FROM THE LEFT/RIGHT instead. Verified: a still climber drifts 2.9 units and does not fall (first version pushed 5.4 and always did).
- **Night into dawn.** `dawn = (s-30)/(LENGTH-60)` smoothstepped; background, fog, hemisphere sky/ground and sun colours lerp from NIGHT to DAWN, the sun swings east and down. Intensities are held constant on purpose: ramping them plus bloom blew the shelf out to a white sheet mid-route.
- **Dev only:** `window._hcDev.warp(s)` and `window._hcDev.gust(dir)`; snapshot now reports gust phase, dawn and whether bloom is on.
Verified in Chromium (software GL): night at s=2, mid at 200, bridge at 160, high at 300, dawn at 425 screenshotted; forced gust; dev E then the wordless ending → LOSE with few prints and → WIN after collecting prints; The Cave reached with the canvas and overlays gone; The Mountain and The Cave clean; phone 390px no bloom, no horizontal scroll; 0 tw-errors, 0 JS errors; all 122 script blocks parse. Draw calls ~66 desktop. Left for Sam to judge by playing: gust frequency (9–17s) and strength, snow density, the dawn colours, and whether the 8-second wordless ending is the right length.

### 20j — THE 3D CLIMB, PASS 3: THE WIND IS THE FIGHT (Sam, 2026-09-16: "it is mostly really easy, you just hold forward")
Sam's four notes after playing pass 2, all in `:: The Climb`, applied by `scratchpad/audit-2026-09-16/climb_pass3_patch.py` (exact-match replacements) plus a rebalance after the first browser run.
- **Wind as the main antagonist.** `wind={strength,target,timer}`: every 2.4–6s a new target, 20% calm otherwise .6–1.6 units/s with a random side, eased in over ~1s; `windMul = (before first flag ? .45 : 1) × (1 + dawn×.35) × (plateau windMul or 1)`. Gusts every 4–9s: 1.4s warning (flurries lean, wind bed rises) then 1.5s adding ±2 on top. `u += push × (grounded ? 1 : 1.3) × dt` unless climbing a ladder or on the bridge; chanting plants you. Lateral speed is 4.6, so on a ridge the worst gust is just holdable; on a plateau it is not, which is the point. HUD shows `WIND ◀◀` / `▶` / `· calm` / `GUST COMING`; the climber leans into the wind (`rotation.z`).
- **Whirlwind sweep-back.** `respawn()` no longer teleports: `whirl` lifts the climber from where they fell (arc `sin(t·π)×5.5` high), spins them with a 44-sphere helix (`whirlMesh`), flails the limbs and sets them down at the last flags (`setDown()`), 1.3–2.8s depending on distance, banner "SWEPT BACK · THE WIND KEEPS YOU". Still one slip. `setDown()` resets the cornice and re-arms the avalanche you were swept out of. Fall test is now `(!supported && y<ground-1.6) || |u| > width/2+3`.
- **Four avalanches, long warning.** `COULOIRS=[[84,96],[248,262],[352,365],[396,408]]`. Entering `C[0]-30` starts a 4s warning: banner "THE SLOPE IS GOING · BE READY TO JUMP", camera tremble, the front visible 42 units above the couloir and creeping at 5/s. Then it runs at 18/s; "JUMP" fires 0.55s before it reaches you, measured against your closing speed (walking into it or standing still get the same window; a jump is 0.84s of air). Hit = front passes you while `y-ground<.6` → whirlwind back. The slide ends only once it has passed you (`front < s-6`), so waiting at the trigger point does not dodge it. `avalanche.done` stops repeats; a sweep-back re-arms that couloir.
- **Wide, windy plateaus.** `PLATEAUS=[[52,62,2.8,1.7],[231,240,2.6,1.6],[299,308,3.0,1.9],[368,378,2.6,1.7]]` = [from,to,widthMul,windMul], with 3-unit ramps in `width(at)`. First numbers (windMul 2.2–2.6) blew a standing climber off the 52–62 plateau in 2.5s with no gust, so they came down; widths went up.
- **Dev only:** `_hcDev.shove(du)`, `_hcDev.avalanche()` (starts the next couloir's warning), `_hcDev.calm(on)` (locks the wind at zero, for testing anything else). Snapshot adds wind, whirl, width, plateau.
- **Watch for:** the front is far up the slope during the warning and can sit behind a ladder cliff (it was, on the 84–96 couloir); if Sam says he cannot see it coming, lower the start (`C[1]+42`) or fatten the spheres. Note the forward key is ↑/W; → is a sidestep (I tested with → first and walked off the ridge, which is not a wind bug).
Verified in Chromium (software GL): real wind drift on the 70 ridge with no input; plateau width 14.1 at s=57; shove(9) at s=75 → whirl → set down at the flags with slips+1; natural avalanche at the 52–62 plateau hit a standing climber → "AVALANCHE · SWEPT BACK"; walking into the same couloir and jumping on the JUMP cue cleared it (no slip); dev E → ending → "Into the cave" → The Cave with 0 canvases, `_hcDev` gone; phone 390px; 0 JS errors; 122 script blocks parse. Verify script: `scratchpad/audit-2026-09-16/climb_pass3_verify.py` (needs `harness.py` beside it and a server on 8777).

### 20k — EVERY DREAM-WORLD MINIGAME IS NOW COMPULSORY (Sam, 2026-09-16: "I want it so you have to play the mini game like you do with the other minigames")
Sam thought the Easter Island shooter was lost. It was not: `:: The Reclamation` (Addendum 21, in his own 2026-09-13 "updates" commit) was reachable only by a third link under the two ordinary choices in `Among the Moai`, so a player taking "Approach the sixth" never saw it. Fixed: the rifle link now comes first and "Approach the sixth" is gone; the only ways on are the rifle (→ game → "Stand before the sixth" → The Listening Moai) or "Walk on past it" (turn-back, as before). Audit of the other worlds, verified in the browser: The Ridge → Nazca Race only; Descending Corridor → Pyramid Run only; The Mountain → The Climb only; Chebar has no minigame (Storm → Creatures → Wheel). Turn-backs sit before the game in Himalaya/Nazca/Easter and after it in Pyramid; untouched. Dev "(skip — testing)" links remain dev-only.
- **Prose:** the revolutionary's closing line now makes the rifle the condition ("Get past the machines and you can go and answer it." He is already holding the rifle out.) — Sam chose it from two drafts.

### 20l — THE RECLAMATION REBUILT IN 3D (Sam, 2026-09-17: "the game itself is rubbish. I bet you can make a much better version of it that matches the level of the other minigames")
The 2D canvas shooter in `:: The Reclamation` is replaced by a three.js first-person night shoot on the same scaffold as The Climb (cover with Begin, Pause/Expand, banner, HUD, touch pad, bloom + film grade, procedural audio, MutationObserver teardown, `rc-` CSS block replacing the old `.reclamation-frame` rules; `.reclamation-invite` kept for the link in Among the Moai). Passage variables: `$easterReclaim` (entered), new `$easterReclaimWon` (declared false in StoryInit, set by the win exit); nothing downstream reads either yet.
- **The place.** You stand at a low stone wall on the ahu with six moai beside you, backs to the sea, the moon rising over the water on the right through the game (`moonRise`, faster on a win), stars (`fog:false` or they vanish), a lumpy volcanic slope with boulders and a paler quarry road winding down it, red occupation lamps on poles along the quarry rim.
- **Controls.** Pointer moves a DOM reticle (`#rc-reticle`) and the camera yaws/pitches with the aim; click, tap or Space fires; arrows nudge the aim; R reloads; five rounds a clip with a .42s bolt and a 1.5s reload. The camera breathes (`sway`), so distant shots drift; a lit rig triples the sway and fades in a `#rc-glare` overlay until you shoot its lamp out.
- **Waves.** `WAVES`: 4 drones; 2 rigs + 3 drones; crawler + 3 drones + rig (14 machines; next wave when the road is clear or after 26s). Drone 1 hit, rig 2 (lamp then rig), crawler 3. Anything reaching `WALL_Z` counts "at the wall". Win at 10 silenced; lose at 3 spirits or 3 at the wall; if all 14 are spawned and dead it resolves on the count.
- **Spirits.** Four turquoise figures drift the field and now and then attend a machine, hovering BESIDE it (first draft put them in front and the very first shot hit one). A hit spirit flares, is told off on the banner, drops out of `hitMeshes` for 3.5s and returns elsewhere.
- **Endings.** 3.6s after the end banner the HUD carries the closing line (win: "The man lowers the rifle. Behind him, the sixth moai opens its eye."; spirits: "The spirits turn their faces away..."; wall: "The lights reach the platform...") and `#rc-win` / `#rc-lose` shows "Stand before the sixth"; the draw loop no longer overwrites that line.
- **Dev only:** `_rcDev.snapshot()/win()/lose()/spawn(kind)/aimAt(mesh)/fire()/machines()/spirits()`; E silences every live machine; "(skip reclamation — testing)" link.
- **Watch for (Sam to judge by playing):** drones are small at 130 units and only really shootable from ~60; the crawler is slow on purpose (3.4/s from -104); the glare wedge is deliberately rude. Tuning knobs are the `WAVES` table, `speed` per kind in `spawn()`, `swayAmp` in `draw()`.
Verified in Chromium (software GL): boot, cover, wave banner, dev-aimed shot silences a drone, clip empties into RELOADING and refills, spirit hit counts and banners, spawned rig lights (glare 1, HUD GLARE, overlay .55), lamp out then rig down, crawler at the wall, dev E to 10 → win → link → The Listening Moai with 0 canvases and `_rcDev` gone; three spirit hits → lose ending; phone 390px no bloom, no horizontal scroll; 0 JS errors; script parses. Verify script: `scratchpad/audit-2026-09-16/reclamation_verify.py`.

### 20s — THIRD PILLAR WATER: THE WHITE ROAD SOFTENED, THE GOLD REFLECTION BACK (Sam, 2026-09-23 04:00 UTC: "things that I can knock out with you before the loop")
Branch `claude/third-pillar-water-fvnwma` off main 43d2513 (20r already merged). One function touched, `buildTPScene`. His prose, verse, pink lines, links, variables, endings and audio untouched.

- **Cause, measured live, not guessed:** a trial script (`tp_trial.py`) loads the portal in full mode, then changes lights and the water material through `window._dssThreeRegistry['tp-wrap']` and counts saturated pixels in the strip under the plinth. Roughening the water (0.17 → 0.3/0.4/0.5) made the strip *wider*, not dimmer: the lobe spreads but still clips, and at 0.5 the whole floor reads as lit grey concrete. Halving the rim light did nothing visible either, because the strip was clipped by well over 2×. Setting the rim light to 0 removed 87% of it; the rest was the cyan uplight's mirror. Geometry is the real cause: the rim light sat at 25° elevation, and a directional light's mirror in a flat floor lands where the camera's view drops at that same angle, which is the bottom edge of this frame (camera 2.6 high, 55° FOV, looking level).
- **Fix:** `rimLight.position` y 4.2 → 6.5 (36° elevation), so the mirror falls below the frame; the blue edge on the broken columns is unchanged, the capital takes a touch more light from above. `cyanLight.position` y 0.9 → 1.4 and its intensity `(0.6 + 2.0 × growth)` → `(0.36 + 1.2 × growth)`, so its mirror is no longer a white blob in front of the plinth. Water material left at roughness 0.17 / metalness 0.6, on the evidence above. The gold reflection from 20r (`tpRefl`, 1.5 × 6.2 additive plane at z 4.3, opacity `pr × (0.26 + 0.06 sin)`, width breathing) is back after the whirlpool block, with its two animate lines after `seam.material.opacity`. `tp-reflection-removed.js` is now history, kept for the record.
- **Verified:** `node --check` clean, html synced (`tpRefl` present). `tp_verify.py`: full mode at 1280×900 (9s), 390×780 (scrollWidth 390) and under reduced motion (2.5s): 1 canvas, 0 errors, STEP THROUGH visible, rim light at (0, 6.5, −9), cyan at (0, 1.4, 0) intensity 1.56, reflection plane live at (0, 0.04, 4.3) opacity 0.2–0.29. Screenshots `polish-loop/pass8-thirdpillar-before.png` (a copy of 20r's after), `-after.png`, `-phone.png`, `-reduced.png`. A soft warm streak remains at the very bottom edge under the button: that is the reflection's own root plus the cyan lobe's shoulder, and it is no longer clipped. Software GL, so judge the final warmth on a real screen.
- **Tools:** `tp_trial.py <outdir> '<json list of trials>'` (keys: rough, metal, color, rim, rimx/rimy/rimz, cyany, lights {amb,cool,rim,gold,cyan} as scale factors, hideFloor, hideWhirl, refl, reflOp, exposure, info); `tp_verify.py` (the three-mode render above). Both need `python3 -m http.server 8777` in the repo root, `pip install playwright pillow`, Chromium at `/opt/pw-browsers/chromium-1194`.
- **Still open from 20q:** Ronnie's bar arena halo, spindrift light on The Climb, heat shimmer on the Nazca road, the README tidy.

### 20r — ASTRA'S LIST FINISHED: THE LAST SIX APPROACH SCENES, ON A BRANCH (Sam, 2026-09-23 03:07 UTC: "take over me making-beautiful where it left off")
Branch `claude/approach-scenes-finish-w8g6va` off main (23ec574). Same recipe as 20q per scene: one additive draw of the venue's light on the ground, pixel-ratio cap 2 → 1.5, a reduced-motion hold; `node --check` on the whole UserScript, `sync_html.py`, headless Chromium (software GL) at 1280×900, 390×780 and under `prefers-reduced-motion`. His prose, verse, pink lines, links, variables, endings and audio untouched. Before/after screenshots in the project files `polish-loop/pass7-*-before.png` / `-after.png`, plus `pass7-thirdpillar-reduced.png`.

- **buildTPScene / Third Pillar Portal:** pixel cap 1.5. Reduced motion (`tpStill`) **jumps to the settled end** instead of holding the start: `t` pinned at 9s, `dt` 0 (column risen, spout calm, no spin), and the STEP THROUGH / BACK TO THE PILLARS button fades in after 0.9s instead of 7.2/4.2s. Verified with `$inisToldOfPillars` true and `$dreamKey` "lighter": full mode, pillar at y 0 at 2.5s under reduced motion, button visible, 0 errors. **A gold reflection of the column in the rainwater was built, verified in the scene graph, and removed again:** it lies in the strip between the plinth and the bottom of the frame, and that strip is already clipped to white by a **pre-existing hotspot** (present in the before screenshot and in dim mode). Traced by toggling objects live: it disappears when the cyan rim `DirectionalLight` (0x8ac8dc, from (0,4.2,−9)) is switched off, survives switching off the cyan and gold point lights and hiding the whirlpool, veils and sprays, and survives water roughness up to 0.5 (only at 0.6/metalness 0.4 does it shrink, at the cost of lighting the whole floor blue). It is the rim light's specular road on the glossy water (roughness 0.17, metalness 0.6) blown out by ACES + bloom. **Sam's call:** leave it as the blue road, or soften it (a rougher water, or a lower rim light with the pillars' blue edge kept some other way). If softened, the gold reflection is worth putting back (the removed block is saved as `scratchpad/polish-loop-2026-09-22/tp-reflection-removed.js`).
- **buildapScene / Airport Pub:** the sign's light on the polished concourse tile in front of the bay: one additive 11.4×3 plane (x −4.8→6.6, z 0.3→3.3, y 0.015), warm under THE ENLIGHTENMENT, a red pool under the BAR · RESTAURANT neon, fading from the frontage and cut by the grout (tiles are 1.125 units here); opacity 0.075 + 0.035 × the neon's buzz. Reduced motion (`apStill`): `t` pinned at 5s, `dt` 0 (pendants, bunting, drinkers, departures board settle), the dead tube's flicker and the neon buzz skipped, fog still.
- **buildnzScene / Nazca Approach:** the cantina's light on the dust of the porch: one additive 9.2×4.2 plane inside the cantina group (local z 3.6→7.8, y 0.035), pools from the window, the door and the bare bulb, broken by the packed dirt; opacity (0.035 + on × 0.085) × the bulb's flicker, so it warms up with the bulb over the first half minute. Reduced motion (`nzStill`): `t` pinned at 30s (bulb fully on), dust and mist still.
- **buildeiScene / Easter Island Shore:** the ember's light on the wet basalt round its ring of stones: one additive 2.8×2.8 plane laid to the beach's slope (rotation order ZXY, tilted atan 0.16), the seven stones cut out of it; opacity 0.13 breathing with `emberLight`. Reduced motion (`eiStill`): `t` pinned at 12s, the boat, fog and pipe smoke hold. Note the ember sits low right, by the near moai's platform, and is small under software GL; judge on a real screen.
- **buildpyScene / Pyramid Mouth:** the mouth's light spilling down the courses below the sill: one additive 8×14 plane laid to the face's slope (rotation −(π/2 − atan(H/B))), centred 4.1 below the sill and 1 unit proud of the nominal face so the stepped courses do not swallow it, cut by the course joints; opacity 0.2 breathing with the inner light. Reduced motion (`pyStill`): `t` pinned at 6s, sand haze still.
- **buildpcScene / The Plain of Chebar:** the bruise caught in the wet mud: one additive 5×44 streak laid along the line from the camera towards the glow in the north (rotation order YXZ), amber at its heart, violet at its edges, banded by the mud; opacity 0.045 + 0.075 × br. It is very faint on the pale plain under software GL. Reduced motion (`pcStill`): `t` pinned at 4s, `dt` 0, haze and streamers hold.
- **Verified:** `node --check` clean after every scene; html synced (`apSheen`, `nzPorch`, `emberPool`, `mouthSpill`, `pcSheen` all present in the compiled file); every scene 1 canvas, 0 JS errors, 0 failed requests at 1280×900 and 390×780 (scrollWidth 390), 0 errors under reduced motion; each new mesh confirmed live through `window._dssThreeRegistry['xx-wrap'].scene` (position, opacity, additive, visible). Same caveat as 20q on judging the sheens: software GL is soft and small.
- **Tools:** `scratchpad/polish-loop-2026-09-22/scene_check.py "<passage>" <wrap-id> <tag>` runs the three modes and the registry probe; `tp_full.py` seeds the key and the unlocked flag for the Third Pillar; `fnpatch.py <function>` applies exact-once replacements inside one named `build…Scene` function so shared lines (the pixel cap) are never touched elsewhere.
- **Still open from 20q:** Ronnie's bar arena halo, spindrift light on The Climb, heat shimmer on the Nazca road, the README tidy; and the Third Pillar hotspot above.

### 20q — OVERNIGHT POLISH LOOP FROM THE CHAIR, ON A BRANCH (Sam, 2026-09-22 01:21 UTC: "runs for one hour then pauses for one hour, then runs for two more hours, just going over this game and perfecting it and making it as beautiful and functional as you can from the chair"; then "Now. Branch. Yes. No" = start now, on a branch, git allowed, preview-links item excluded; then "I am going to bed. Carry on from the chair")
Six timed passes on `claude/project-thread-fqjdg9` (01:22–02:00, quiet hour, 03:21–05:20 UTC). Plan in the project files ("Polish loop plan.md"); the full running log with every check is `scratchpad/polish-loop-2026-09-22/LOG.md` (its entry timestamps drift a few minutes late against the real clock). Screenshots in the project files under `polish-loop/`. Every pass: edit the twee only, `node --check` on the whole UserScript, `sync_html.py`, render in headless Chromium (software GL) at 1280×900 and 390×780 and under `prefers-reduced-motion`, one commit, push. His prose, verse, pink lines, passage names, links, variables, endings and audio untouched throughout.

- **Pass 1, the chair and the sweep (nothing to fix):** static audit clean (226 passages, 0 duplicates/orphans/script errors); UserScript 43,845 lines parses; main's html was in sync (re-sync gave zero diff); render sweep of all 206 story passages found 0 `tw-error`, 0 stray macro text, 0 real JS errors. `sweep.py` now writes its results beside itself (or to `$SWEEP_OUT`) and documents the two sandbox artefacts (AAC/MP3 decode error; harness init script inside the three iframe scenes).
- **Pass 2, Astra's dream-game retunes verified live (nothing to fix):** Reclamation full run (drone, clip/reload, spirit banner, rig glare → lamp → head, crawler at the wall, ten-silenced win with teardown to The Listening Moai, three-spirit lose, phone 390); Nazca and Pyramid smoke (start, HUD, teardown). Screenshots `pass2-*.png`.
- **Pass 3, phone sweep at 390px (one real fix):** new `scratchpad/audit-2026-09-16/phone_sweep.py` lists elements whose box crosses the right edge (scrollWidth is useless here: `html` and `tw-story` hide x-overflow). The one real overflow, on all 185 passages with the notebook header: the phone stat-bar grid gave the bar 124px but its footprint is 176px (36px filter tip at `left:-36px` + 140px barrel), so the barrel ran under the percentage and 11px off a 390px phone. CSS-only fix in the existing phone block: bar column 176px, gap 5px, header lily 112px. Before/after: `pass3-before/after-statbar-phone.png`. Deliberate bleeds left alone: ending vines, dawn mist bands, the tilted memory photo.
- **Passes 4–6, Astra's approach-scene list, ten scenes, one commit each, same recipe per scene:** one extra additive draw of the venue's light lying on the wet ground (a canvas-textured plane, no new lights, no post passes), pixel-ratio cap 2 → 1.5, and a reduced-motion hold (`xxStill`: the loop's `t` is pinned so lamps/neon/camera settle, fog/steam/particle loops and random flickers are skipped). Each mesh was confirmed live through `window._dssThreeRegistry['xx-wrap'].scene`. Done, in Astra's order: **Pillars** (window sheet on the flags, breathes with `pubGlow`), **Copper's Lair** (bulb in the puddle, shivers when a drip-ring crosses), **Ronnie Scott's** (neon in the pavement, red pooling to green), **Trisha's** (lantern in the water by the step, flickers with the lamp; the cat's clock is frozen under reduced motion), **Ginger Light** (lantern core on the hero puddle), **Centre Point** (no wet ground in frame: a blue haze sprite at the ladder foot, follows `ladderBaseGlow`), **O'Flatterly's** (amber on the court), **Chinese Fish and Chips** (amber on the flags with a fly-killer blue fleck), **Lackland's Office** (the red first-floor window on the raised pavement, follows the working light; note the raised pavement is 0.12 high, so anything on it sits at y 0.125), **Colony Room** (the two amber windows and the green one on the pavement, follows `colPulse`). Before/after screenshots `pass4-*`, `pass5*-*`, `pass6-*` (software GL: the sheens are soft and small; judge on a real GPU/phone).
- **Naming, corrected in the log:** `buildCLScene` is the Copper's Lair cellar (Astra's note called it "Colony"); `buildCRScene` is the Colony Room approach; `buildCaScene` is the Carthage shore, not on Astra's list and untouched.
- **Remaining of Astra's list, in order:** buildTPScene, buildapScene, buildnzScene, buildeiScene, buildpyScene, buildpcScene. **buildTPScene (Third Pillar) is not a street scene:** it is a timed birth sequence driven by `growth`, with its own water-floor sheens already; pinning `t` for reduced motion would stop the column rising, so the reduced-motion treatment there should jump to the settled end state rather than hold the start. Left for a pass with time to design that.
- **Queue items not reached:** beauty-pass leftovers from 20m (Ronnie's bar arena halo, spindrift light on The Climb, heat shimmer on the Nazca road) and the README tidy.
- **Tools added:** `scene_shot.py "<passage>" out.png [secs]` (screenshot of a scene canvas' parent, reports errors), `phone_sweep.py`; scratch templates for the registry probe and the phone/reduced-motion check are described in the log. `scratchpad/audit-2026-09-16/.gitignore` now hides `climb/`, `reclaim/` and the phone sweep results.
- **Merging:** the branch is 16 commits ahead of main at 05:05 UTC (266dbf6 … fd3c902: twelve polish commits, the handoff, the README). Merge in GitHub Desktop; if `Dream Street Shuffle.html` conflicts, resolve by re-running `python3 sync_html.py` after the merge and committing the result. Nothing else on the branch touches files other assistants edit except the twee's UserScript functions named above and the phone CSS block.

### 20p — ASTRA'S APPROACH-SCENE GRAPHICS PASS, TWO SCENES, VERIFIED HERE (2026-09-22)
Prompt: the eighteen three.js approach scenes in `:: UserScript`, one per commit, Soho first, with a `node --check` before every commit (the rule added after 20o's missing quote). Astra did two and stopped on budget. Its note, verbatim:

- **Verified live (software GL):** `Approach The French` and `Approach The Coach` both render after BEGIN, one/two canvases, wrap present, 0 JS errors, 0 console errors; phone 390 no overflow; static audit clean; html in sync. Screenshots at 7s and 11s: the French has lit sash windows, breathing lamp and a wet-street reflection; the Coach has glossy red paint, two asynchronous lamps, smoke and puddles carrying window colour. Not judged on a real GPU here.
- **Its syntax check worked:** both commits passed `node --check` on its side and here.
- **Remaining, in Astra's order (give it the same prompt with the table trimmed to these):** buildPHScene, buildCLScene, buildRSScene, buildTSScene, buildGLScene, buildCPScene, buildOFScene, buildFcScene, buildLOScene, buildCRScene, buildTPScene, buildapScene, buildnzScene, buildeiScene, buildpyScene, buildpcScene. Line numbers in the 20p prompt shift by roughly +50 after these two commits; tell it to search the function name rather than trust a line.

### 20o — ASTRA'S NAZCA / PYRAMID / RECLAMATION RETUNES, VERIFIED HERE (2026-09-22)
Four commits from Astra (one per game plus a note), 289 changed twee lines, browser-unverified on its side. Its note, verbatim:

- **BROKEN ON ARRIVAL, fixed here:** Astra's Reclamation HUD line had a missing quote (`'SILENCED +silenced+'`), so the whole game script failed to parse. The rifle screen would have shown its cover and done nothing, with no exit for a player (the skip link is dev-only). One character fixed; `node --check` and the static audit are clean again. Lesson for the next Astra prompt: tell it to run `node --check` on the script it edited, since it cannot run a browser.
- **Reclamation, verified live after the fix:** boot, wave banner, drones now spawn at about -100 and are shootable sooner, spirit hit and banners, rig glare (softer: overlay .2, HUD "GLARE · SHOOT THE LAMP"), lamp out then rig down ("LAMP OUT · ONE MORE HIT TO THE HEAD"), crawler at the wall, dev E to 10 → win → "Stand before the sixth" → The Listening Moai with 0 canvases; three spirit hits → lose; target hint in the HUD ("SPIRIT · DO NOT FIRE"); phone 390 clean; 0 JS errors. Note for the verify script: Astra's shot buffer drops a queued shot while the bolt is cycling, so rapid dev `fire()` calls no longer empty a clip in five calls; the script's reload step reads 1 round left, which is the new behaviour, not a bug.
- **Nazca Race, smoke-tested live:** loads, "Start race", accelerate/steer/space for 10s with no errors, HUD reads speed/lap/recovery, skip link and teardown to The Centre — Nazca clean (0 canvases), phone 390 no overflow, no bloom under 600px. Not driven to a finish here.
- **Pyramid Run, smoke-tested live:** loads, "Enter the dark", nine jumps over 8s with no errors, HUD MARKS/STUMBLES, teardown clean, phone 390 no overflow. Not run to the Gallery here.
- **Scripts:** `scratchpad/audit-2026-09-16/nazca_pyramid_smoke.py` (the smoke above), `reclamation_verify.py` (full Reclamation run).
- **Sam to judge by playing:** Nazca bends and braking against the rival; Pyramid snake-head hops and torch pools; Reclamation drone range, glare and the five-live-machine cap.

### 20n — ASTRA'S CLIMB RETUNE, VERIFIED HERE (2026-09-22)
Sam gave Astra (ChatGPT) a lean prompt to make the jumps fair and the climb beautiful. It committed two changes to `:: The Climb` (85 changed lines) but could not run a browser (no Playwright there), so this session pulled, verified and tightened one thing. Astra's own note, verbatim:
    ### Climb fairness and light — 2026-09-22
    - Changed only The Climb: visible blue gap lips and persistent gap/step/avalanche HUD cues; cornice jump cue moved to its lip, collapse begins on contact; avalanche starts closer, stays ahead during warning, and cues against actual closing speed. Wind capped below steering speed, gentler airborne, sheltered during avalanches. Rescue returns no farther uphill than the fall, resets wind, provides shelter until movement plus 1.8 seconds of grace, restores the local footprint trail, and only saves supported checkpoint landings.
    - Beauty: faint moving interference on specular snow, slowly travelling sunlight, cool-to-warm coloured flakes; fewer particles (650 phone / 1100 desktop), one added draw for gap rims, no added post-processing pass; snow texture disposed at teardown.
    - Left: route tables, jump strength/gravity, breath, scoring, cave ending and all prose outside the game. HTML synced with sync_html.py.
    - Verification blocked before browser launch: requested climb_pass3_verify.py attempted with system Python, retried with bundled Python; both lack playwright. No repeated play or broader audit. Next: install/provide Playwright and run that verification, then Sam judges gap readability, cornice timing and snow light on a phone. Browser/shader behaviour is not yet verified.
- **Verified live (software GL, 0 JS errors, phone 390 clean):** the blue gap lips draw (one LineSegments, no extra draw pass); the HUD hazard line reads GAP AHEAD / STEP UP / AVALANCHE APPROACHING / JUMP · HOLD SPACE; the avalanche warning lasts ~6s with the front held at least 18 units ahead, then "JUMP · HOLD SPACE" and a hit for a standing climber; the jump-on-cue window is fine at 0, 150, 250 and 350ms of delay (all cleared); the whirlwind lands you no farther uphill than you fell, at a supported spot, with "SAFE AT THE FLAGS · TAKE YOUR TIME", wind zeroed and a rescue grace with no gusts or avalanche triggers; the Phong snow with the sheen shader compiles and reads as moving light; flakes cool-to-warm toward dawn.
- **Tightened here (the one real gap):** Astra's cornice broke .42s after contact, and at full walking speed (8.4/s) you crossed the 3-unit shelf in .36s, so a runner who ignored "CORNICE · HOLD JUMP + ↑" stepped over the hole and the cue was a lie. Now the banner fires 3.5 units out (was 1.6), the shelf breaks .3s after contact, and when it breaks with someone standing on it they drop with it (`grounded=false; y=ground-1.7`, which trips the fall check the same frame). Verified: walk through → FELL at 228.1; jump on the cue → CLEARED; jump 250ms late → CLEARED.
- **Housekeeping:** Astra had committed two `__pycache__/*.pyc` files from the harness; removed, and `__pycache__/` + `*.pyc` added to `.gitignore`.
- **Watch for:** the cornice is now the strictest jump on the route. If Sam finds it mean, `.3` → `.36` in the break timer is the knob. The verify script `climb_pass3_verify.py` still runs but its whirl/avalanche sequencing assumes pass-3 timings; `climb_astra_verify.py` beside it is the one that matches this build.

### 20m — BEAUTY PASS (Sam, 2026-09-17: "make as much of the game as beautiful as possible. Shimmering, strange, delicate." Visual only; no text touched, his or pink)
Everything lives in one block at the END of `:: UserStylesheet` headed BEAUTY PASS, plus one JS addition to `window.dssFilmGrade` and one line in The Reclamation. Every animation is slow, faint and screened/additive, and the block ends with a `prefers-reduced-motion` rule that stops all of them.
- **Arrival.** `passageFadeIn` now rises 8px and settles over .9s with a soft curve (same .55s delay the cleanup passes need). The existing fade-lock script still clears the animation once it has played, so a probe after arrival reads `none`; that is expected.
- **Links.** The underline draws itself from the left (`background-size` 0→100% over .55s) instead of the old border snapping on; the glow swells over .7s. Hover and keyboard focus both.
- **Title.** `.game-title` breathes its glow over 11s.
- **Notebook bar.** `.stat-bars::after` (z-index -1, screen blend) carries a band of light across the brass every 24s.
- **Hub.** The two gutter washes breathe out of phase (13s); the Dean Street lamp's glow rect pulses like a gas mantle (6.5s); four motes drift up the edges of the column over 46s (`tw-story[tags~="hub"] tw-passage::before`, fixed, pointer-events none). `.map-here-pulse` gets `filter:url(#dss-gild)` (first use of the gild filter anywhere).
- **Venues.** `tw-story[tags*="venue-"]::before`: a fixed warm haze, screened, drifting over 26s. All ten venue tags match.
- **Dream worlds.** `tw-story[tags~="dream"]::before`: a fixed tint that drifts over 22s, coloured per world by `--dss-dream-tint` (himalayan blue, nazca ochre, easter turquoise, pyramid gold, ezekiel violet, sanctum/synthesis bone).
- **2D games.** `.pp-arena::after` breathes a little light down from the brass rule (9s); the pong, waltz, cow and fight canvases carry a slow halo (`dssEdgeGlow`, 8s).
- **3D scenes and games.** `dssFilmGrade` appends a third layer `.dss-shimmer`: two soft lights (warm and cold) drifting across the frame over 31s, screened at 5–9%. That reaches all 21 callers at once: every approach render, the Nazca Race, the Pyramid Run, The Climb, The Reclamation. In The Reclamation the moon's path on the water now flickers (`shine` opacity in `draw()`).
- **Looked at and left alone:** the pentangle tracer (already has drop-shadows), the 51 `dss-ink` users (fine), venue-lackland/cecilcourt's own pseudo-elements (untouched; mine are on `tw-story`, theirs on `tw-passage`), napkin canvas (a glow would fight the paper).
- **Watch for:** `mix-blend-mode: screen` layers over the whole viewport on venues and dream worlds; if a phone stutters, drop those two rules first. The hub motes are `position: fixed` inside `tw-passage`, which briefly has a transform during arrival; they ride with it for .9s, then sit on the viewport.
Verified in Chromium: computed animation names live on the hub (gutters, motes, lamp, title), The French (haze, screen blend, link underline), Foothills (tint var + drift), PP Pong (arena + canvas), Nazca Approach (`.dss-shimmer` present and animating); reduced-motion emulation reads `none` for haze and sheen; phone 390px Dean Street and The French with no horizontal scroll; 0 JS errors on twelve screens; CSS braces balance. Before/after shots were taken with `scratchpad/audit-2026-09-16/beauty_shots.py`. Next hour: a per-scene touch inside the three.js games themselves (spindrift catching light on The Climb, heat shimmer on the Nazca road), and the Ronnie's bar arena which has no canvas halo yet.

### 20c — NOT BUGS, BUT WORTH KNOWING
- **DONE, same day (20d): three.js is now VENDORED.** Sam: "Vendor three.min.js beside the html so the 3D scenes work offline." `vendor/three/` holds three.min.js r128 plus the ten add-ons (npm three@0.128.0, the non-module `examples/js` builds), with a README. All 44 CDN references in the .twee (19 core loaders, 2 copies of `dssPostScriptURLs`, the Alba Complete preload, comments) and the 7 in each of the three iframe scenes now point at `vendor/three/...`. Verified live with software WebGL: Ginger Light, Pillars, Centre Point (in-passage) and Cecil Court, Green Sea, Oxford Street (iframe) all report THREE r128 + EffectComposer + UnrealBloomPass present, one canvas each, 0 errors, 0 failed requests; the Ginger Light screenshot shows the full scene. **Upgrading three.js now means replacing the files in vendor/three/ together, core and add-ons at the same version.** The ~34 preview/prototype html files in the folder still use the CDNs; the game never loads them. The paragraph below is the pre-fix note, kept for the record.
- (pre-fix note) **three.js and its post-processing come from two CDNs** (cdnjs for the core, jsdelivr for bloom/bokeh). Blocked in this sandbox, so the 3D scenes could not be seen here; the in-passage scenes are guarded (nothing throws in the game page), but the three standalone iframe scenes (oxford-street, cecil-court, green-sea -3d-static.html) load the core with a bare script tag and throw "THREE is not defined" inside the iframe when it is unreachable. A player behind an ad-blocker or offline gets an empty canvas on Dawn Approach, Cecil Court Approach and Green Sea Approach; prose and links unaffected. If that matters, vendor three.min.js beside the html.
- **DONE, see 20f.** (pre-fix note) **Completed dream worlds live in localStorage (dssLifetimeGifts) and survive "Play again" by design.** There is no in-game way to clear them any more (the debug tool was removed by Codex). For a fresh run in the same browser: localStorage.removeItem('dssLifetimeGifts') in the console, or a private window.
- **DONE, see 20e.** (pre-fix note) **"Head towards dawn" is the first link on the very first Dean Street visit**, so a new player can reach THE END in six clicks (dawn -> confirm -> the doppelganger -> Dawn). The confirm screen guards it; whether it should be offered before any venue is a design call for Sam.
- The only 404 on any load is favicon.ico.
- Still Sam's from 18f: the Yeti "Into the cave" question, the venue sides on the scrolling map, the bed listen-through, the alley passages and every pink line.

---

**STATE 2026-09-15 (later) — SECOND PLAYTHROUGH ROUND, three notes. Committed on branch `claude/serene-johnson-cyc68y`; .html synced; all code verified in a real browser (recipe in 18e).**

### 19a — KEYS WAIT FOR THE PAGE QUEST
Sam (second pass): keys gated on "returned the page and completed the quest", and they come from the venues, not from Inis. All FIVE seed offers are `(if: $inisToldOfPillars is true and $keyX is "seed")` — French lighter, chippy ticket, Coach slip, Lackland eye, Trisha's cocaine. `$inisToldOfPillars` is set in `O'Flatterly's Gift`, reachable only from `Return the page`, so it IS "quest complete". Key Guards now guards that flag for old saves. A first-pass `$metInis` (gate on the introduction) was tried and removed the same day; nothing references it. Verified: fresh jump to The French → 0 `.dss-key-offer`; with the flag true → the lighter offer prints.

### 19b — STASH SLIP ONLY WHEN CARRYING
Sam saw "You can leave what you are carrying here" on the French 3D approach with nothing to leave. `Key Stash Here` prints its link only when `$dreamKey` is set, so the one-time slip in `Stash Point` is now `(if: $shownStashTip is not true and $dreamKey is not "")`. Verified: empty-handed approach → no `#wtw-stash-msg`; carrying the lighter → slip + "Leave the brass lighter here" together, 0 tw-errors.

### 19c — PHONE BOX (question answered, NO code; Sam accepts the trade)
When you can ring: `$hasCoin` (Donkey, hub visit 2) AND `$refusedCalls > 0` AND not `$refusedDualRing`. Otherwise the box gives one of three dead-end lines. Cost: the coin, so no coin-flip at the Colony two doors (`coinGate` reads `.dss-coin-flag`). Gain: `$refusedCalls − 1`, which nothing reads except the `(if: $refusedCalls is 2)` Fetch-window omen at the moment of a refusal — so mechanically the call buys almost nothing, and Aoife's answer is still a PLACEHOLDER. Sam: not attached to the Colony flip — coin in pocket flips, no coin just click, which is already what `coinGate` does (returns before installing when `.dss-coin-flag` is not 1). No change. The map tile `phonebox` is `label:''`/event (smudge) and the hub dock link is gated on `$hasCoin` only.

---

**STATE 2026-09-15 — PLAYTHROUGH NOTES ROUND. Everything below is COMMITTED AND PUSHED to `main` (head `80c462b`); the working tree is clean and the .html is synced. Eight commits this session.** Sam gave eleven notes from a playthrough; ten were code, one was a question. All ten are done and, unlike previous sessions, MOST ARE VERIFIED IN A REAL BROWSER — see "Running the game from the chair" below, which is the single most useful thing to carry forward.

### 18a — THE ELEVEN NOTES (`41902ac`, plus follow-ups)
1. **HUB MISALIGNED / LAMP CUT OFF.** `.dss-night-choice` is a `clear:both` div under the date strap that is EMPTY unless all three alba are caught. `findContentBottom()` breaks at the first cleared element, so it stopped there and sized the lamp to ~250px — head and bracket, cut off above the pole — and every line below the short float ran full width across the lamp's gutter. Fixed three ways: the div only renders when `_towerReady`, it no longer clears, and the measurement skips zero-height elements BEFORE testing clear. Verified: lamp 1110px ending 2px past the last line.
2. **FIRST INSTRUCTION SLIP TOO EARLY.** `dssInlineHint` had its own queue but never called `dssOverlayBusy()`, so the night's primer typed itself out beside the coin overlay while the Donkey was still spinning. It now waits for any hard overlay (coin/matches/cig/eat/key), capped at ~40s.
3. **(Sam's question, answered, no code.)** The MORALE/SOBRIETY primer fires on your first haunt, inside your first venue; the open-night instruction fires on hub visit 2. So the measures always come first. Advice given: leave the order (the primer lands when the bars actually move; "walking costs nothing" answers a question you have not yet asked; and it already says "Neither one can end the night"). The real problem is DENSITY — two abstract slips inside ~90 seconds, one of them ~900 characters. **If Sam wants a change here, space them, do not swap them.**
4. **GLASS SMASH.** Was counted off `drinkpopup:closed` (+1.8s +1.5s) and landed ~3.1s AFTER THE DEBT had already bloomed. New `dss:boxreveal` event fires at the instant collection boxes fade in; the smash rides it. Old cue kept as a fallback for replays where no box appears.
5. **JOHN ST JOHN.** `char-john` was only on The Empty Glass, the third beat. Added to The Stranger at the French and His round.
6. **DOOR MARKS — and a much older bug, see 18b.**
7. **LILIES.** `.lily-taken` had three CSS rules and a click handler written for it and NOTHING EVER APPLIED THE CLASS, so a gathered flower re-rendered identical to a live one, still captioned "always take a flower". Applied on gather; kept pokeable so the lilyBlock/lilyBlip feedback survives.
8. **PISS DOORWAYS.** The four map doorways were `label:'' , event:true` — no label, no caption, a 0.22-alpha smudge. New `sign:true` flag opts an event tile back into the label pass with a quiet "A doorway" plate and a doorway's worth of light; unsigned alleys keep the smudge (those ARE meant to be stumbled into). The low-sobriety nudge said "You should have gone to the gents earlier" — there is no gents on Dean Street — now "Find a doorway."; its other branch said the same thing when you HAD already had a breather, cut to the chippy line.
9. **ALLEY STASHES.** `Key Stash Here` only prints its offer when you are already CARRYING something, so an empty-handed player never learned the mechanic existed. One-time teaching slip added to `Stash Point` (all fourteen sites). The eleven alley exits now read "Back to the street" — Sam's own phrase, already used in eighteen places — instead of "Back to Dean Street". Phone Box and LINE 3 deliberately left alone.
10. **BIRDSONG.** `Towards Dawn` held the chorus at 0.55 unconditionally, and that screen is reachable FROM THE FIRST HUB by walking to the top of Dean Street — so exploring the north edge on lap one put a spring morning into the middle of the night. Now gated on `$nightPhase >= 3`. The three real dawn passages are unchanged.
11. **YETI.** Both climb exits read "Into the cave" (win keeps its `(link:)` because it still sets `$himalayaClimbWon`). **Sam may only have wanted the win exit — ask.**

### 18b — REAL BUGS FOUND WHILE VERIFYING (these are the valuable ones)
1. **`glyphsAfter()` HAD ALWAYS RETURNED EMPTY (`5e21be1`).** It walked `link.nextSibling` — but Harlowe wraps every link in its own `<tw-expression>`, so the tw-link has NO siblings, and the pips are not siblings of the wrapper either; they sit further along INSIDE the same branch hook. So the ledger marks never rendered on the map OR in the caption bar, only in the docked list, which is parked off-screen. **That is the actual reason Sam could not see "the small marks beside each door".** Rewritten to work by document position: the branch hook the anchor sits in, then every pip that follows this anchor and precedes the next. Anchor is a `tw-link` for an open door and a `.greyed-out` span for a shut one. `span.op` added to the selector, which the old list missed. Verified: 12 plates, 6 carrying marks, French `◇◆◇` with only haunt1 caught (correct — it carries haunt4/1/2), Colony `◆◆❁`, Pillars `△◇✧`, Cecil `◇☆`, chippy `❁`, no collisions.
2. **SIX STRAY BACKSLASHES PRINTING IN THE PROSE (`9497e95`).** A trailing `\` is Harlowe's line-continuation; on a passage's LAST line there is no break to eat (sync writes the body without a trailing newline) so Harlowe prints it. Six `[system]` passages ended that way and all six are `(display:)`-ed inline, so each emitted a stray mark everywhere it was used: Stash Point (all 14 stash sites), Key Drop Here, Key Set Held, Key Sites, Spend Held Key, Eat Shelleys Liver. All from the Phase 2 keys batch. Pre-existing. **RULE: a passage's last line must be BARE — no trailing backslash.** Worth re-running the scan after any batch of new system passages.
3. **`findContentBottom()` MEASURED THE CLEARED BLOCK'S ANCESTORS (`da7ea3c`).** It stops at the first block that clears the float, but Harlowe nests passage content in tw-hooks and one of them encloses BOTH the prose and the map container — that hook's box includes the map, so the "content bottom" tracked the lamp's height one-for-one (with the lamp at 20000px it returned 20592). Wrappers straddling the cleared block are now skipped. This is why iterating the lamp sizing to convergence ran away; do not try that again without reading the comment there.

### 18c — LAMP HALO (`d9ba9c2` → `2411a49` → reverted in `5e21be1`)
The halo was a 240-wide rect inside a 145-wide SVG with `overflow:hidden`, its gradient still well above zero opacity at both clip edges — sliced flat on each side, reading as a lit BOX behind the lantern. Re-aimed in user-space coordinates so it reaches zero INSIDE the clip on every side. Sam then asked for softer and wider, got it (`2411a49`), and **rejected it as "too much"**; reverted to the `d9ba9c2` version, which is what is live. **Current values: `cx=85 cy=80 r=58`, `gradientTransform="matrix(1,0,0,1.37,0,-29.6)"`, rect `0,0,145x164`, stops 0.7/0.35/0.12/0.** 145px is the hard ceiling on width — `overflow:hidden` must stay (it is what stops the pole, drawn to y=9999, running off the page), so a halo that fades at both edges can be at most the box width and only if centred on the box. Centred on the lantern OR as wide as the box, not both.

### 18d — MAP AT TABLET WIDTHS, AND THE 600px DEAD STRIP (`1af4bc6`, `da7ea3c`)
1. Beside the lamp the map gives up a FIXED 178px, so as the column narrows the map pays every pixel: measured 544 at 1440, 379 at 1024, **256 at 820 (an iPad upright)**, 184 at 700. The breakpoint that drops the gutter was 640px — it only ever caught phones. **Now 1100px**, the narrowest viewport that still leaves the map its 416px native size (26 tiles × 16px) beside the lamp. After: 544 / 544 / 672 / 672 / 634 / 572 across 1280→700.
2. `sizeLamp()` had its OWN hardcoded `matchMedia('(max-width: 640px)')` — a second copy of the number. It now reads the computed `clear` off `#soho-map-container`, so the breakpoint lives only in the stylesheet. **Do not reintroduce a number in the JS.**
3. **The 600px dead strip was `tw-story`'s padding, not the sizing logic.** Harlowe's default is `padding: 5% 20%`, and 20% of a small number is still 20%: at a 600px viewport it took 240px and left a 360px column — NARROWER than the 504px the same page gets at 560px, where Harlowe's own small-screen rule drops to a flat 5%. The column hit its minimum in the MIDDLE of the range. With a 145px lamp floated into that, there was no room for a line of the title beside it, and a line box that cannot fit beside a float DROPS BELOW IT — so the title fell past the foot of the pole and took the date, prose and map with it, leaving the lamp alone above an ~800px strip. Gutter is now `min(5%, 96px)` (5% being what Harlowe itself falls back to, so the narrow end is unchanged at 560px). **A first attempt used `min(20%, 96px)` and made the phone case worse — 560px went from a 504 column to 368. Measure both ends of the range before shipping a gutter change.** Desktop moves 12px and nothing else does.

### 18e — RUNNING THE GAME FROM THE CHAIR (do this; it changes what is possible)
Previous sessions shipped unverified. This one did not, and the recipe is cheap:
```
pip install playwright                      # browsers are ALREADY at /opt/pw-browsers
python3 -m http.server 8777                 # from the project folder; the html needs http, not file://
```
Launch with an EXPLICIT path — the pip playwright wants a newer build than the image has:
`pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")`
- **Jump to any passage** with `...Shuffle.html#dss-debug-jump=<URL-encoded passage name>`. It lands you there, though Dean Street often redirects into an Aoife memory first — click the first `tw-link` a few times until `#dean-lamp-svg` (or whatever you need) exists.
- **To reach a LATE-NIGHT state**, build a SCRATCH COPY of the html with an extra `<tw-passagedata>` injected before `</tw-storydata>` that `(set:)`s the variables and `(go-to: "Dean Street")`, then debug-jump to it. Harlowe exposes no global API (`window.Harlowe` is undefined), so this is the only way in. **Write the scratch file to /tmp, never the project folder.** The state that lights 12 door plates is in commit `5e21be1`'s message trail; `$hauntExplained`, `$metRed`, `$returns>=2` and `$sawAoifeReflection`/`$sawAoifeMemory2` true (to skip the hub's redirect guards) are the key ones.
- **Syntax-check before syncing**: extract the `:: UserScript` passage to a file and `node --check` it; count braces in `:: UserStylesheet`. Caught nothing this session but costs seconds.
- **Never `Read` the .html.** Verify with `grep` on the compiled file — remembering the passage bodies are HTML-ESCAPED there (`&quot;`, `&lt;`), so grep the escaped form.

### 18f — STILL OPEN / NEXT
1. **ALL FOUR NOW VERIFIED LIVE (2026-09-15, same session).** Nothing from this round is unseen.
   - **Glass smash (18a.4):** at The Empty Glass, hold-to-drink through, `dss:boxreveal` fired at 10664ms and `glassSmash` at 10784ms — **120ms after the box appears**, exactly as designed, where the old cue put it ~3100ms late.
   - **Lily spent-state (18a.7):** at the chippy, `tw-hook[name=lily1]` goes `lily-taken` false→**true**; the `::after` caption ("✦ always take a flower ✦") goes `display:block`→**none**; prompt animation `lilyPulse`→**none**; icon `lilyBreath, lilyInvite`→**lilyBreath** (invite gone); the glimpse line prints and `lilyChime` fires.
   - **Birdsong gate (18a.10):** at Towards Dawn with `$nightPhase` 0, `setBirdLevel(0)` is called at 451ms. Before the fix this was an unconditional 0.55.
   - **Yeti exit (18a.11):** both `#hc-win` and `#hc-lose` render real `tw-link`s reading **"Into the cave"**.
   **Test notes for whoever verifies next:** the chippy raises TWO hard overlays before you can touch the lily (`#match-overlay`, then `#dss-key-overlay` twice) — clear them in a loop on `#coin-overlay,#match-overlay,#cig-overlay,#eat-overlay,#dss-key-overlay,#dss-quest-overlay,#drink-popup-overlay,#spew-popup-overlay` before doing anything. And **Playwright's `.click()` never settles on a lily**: `lilyBreath` scales it forever so the actionability check never sees it "stable". Dispatch `new MouseEvent('click',{bubbles:true})` on `.lily-prompt` instead — both Harlowe's `(click-replace:)` and the petal listener are delegated, so a bubbling synthetic click exercises the real path. To catch audio calls, wrap them from an `add_init_script` that traps the ASSIGNMENT of `window.dssAudio` with a defineProperty setter; hooking after load misses the early calls.
2. **Sam's to write:** the stash hint is still a UI note in a placeholder voice, cut to one sentence at his instruction — "You can leave what you are carrying here; an alley will keep it, a bin by a venue door might not." (97 chars, 6.7s on screen). Also the 10 alley passages and every pink line remain his.
3. **Ask him:** whether the Yeti "Into the cave" was meant for the win exit only.
4. **Carried over from 2026-09-12 and still open:** venue sides on the scrolling map ("the French is on the wrong side of the road" — his corrections never given), his listen-through of all the beds, and music for the dream worlds under the beds.
5. **Slip lengths are a live design issue.** `dssInlineHint` treats <400 chars as a short nudge (click-through, UNDISMISSABLE) and ≥400 as long (clickable to dismiss), while the hold scales with length. A ~240-char slip therefore gets the undismissable treatment with an 18-second duration — the worst of both. Keep nudges to one sentence or push them well past 400.

### 18g — HOUSEKEEPING
- **`HANDOFF*.md` is gitignored, which makes it USELESS for a remote session** — a fresh container clones from GitHub and never sees it. This file is now FORCE-ADDED and committed so it actually travels. If Sam wants it back out of the repo: `git rm --cached HANDOFF.md`.
- Sam works from GitHub Desktop on his Mac. Remote sessions must commit and push or the work is lost with the container; he authorised git for that reason this session. **He does not want a PR unless he asks.**
- A two-part zip backup (44MB total, split for a 30MB upload limit) was sent to him on 2026-09-15: source + build + 27 audio + 5 char PNGs + docs. `licensed-originals/` (~66MB, replaced by generated beds) deliberately excluded.

### 19d — PLACEHOLDER TRIM (rebuilt on top of main after another session's "New changes"/"petals update")
Sam: the pink draft "babbles on a bit"; reduce slightly, keep the fun, bullets if better. Fifteen `claude-draft` blocks over ~200 words (all in the five dream worlds: Airport Pub, The Cave, Centre Nazca, Easter Shore, Among the Moai, Listening Moai, Glyph, Pyramid Mouth, Descending Corridor, Grand Gallery, King's Chamber, Chebar, Storm, Four Living Creatures, Wheel) cut 10–15% each, no detail or dialogue dropped. One bullet list: the Airport Pub departures board (`<ul>` inside the draft div). The other ~134 pink blocks untouched. Longest remaining: Among the Moai (~370) and Chebar (~355) if he wants a second pass. LESSON: Sam runs other AIs on main between turns — fetch main and rebuild the branch on it before pushing, or the merge conflicts.

---

**CURRENT OVERRIDE — 2026-09-12: OPEN NIGHT SHIPPED.** Sam has removed the turn-limit design. Exploration no longer drains condition; no visit budget or forced dawn. Discovery-based night phases and a voluntary Head towards dawn choice replace the clock. Earlier turn-budget/refund/penalty notes below are historical and superseded. See the final “Open night overhaul” addendum for implementation and verification.

**STATE 2026-09-12 (mid-session; Sam works through the night and is continuing after a usage reset).** Everything below is synced to the .html and uncommitted. Today: key states split (spent/stolen/traded); the stolen NOTEBOOK loop (Bourchier Street joint choice → car park theft; recover from the Charing Cross Road fence for a pocket key, or win it at Percy's pong table); the dream-world cast recast as Sam's friends (India=John, Nazca=Joe Gallagher as the black-car driver, Easter=Costa as the revolutionary, Pyramid=Al Hubz, Ezekiel=anonymous prophet + Nicole reading); ALL licensed ambience beds replaced by generated ones plus seven new beds (five worlds, Colony, Trisha's) via tools_make_beds.py; the map audit done in full (fronts, constable + drunk, windows dimming, edge lures, player light). STILL OPEN: venue sides on the scrolling map (Sam: "the French is on the wrong side of the road"; his corrections not yet given); Sam's listen-through of all beds; the 10 alley passages and every new pink line are his to write. Next three: (1) venue sides once Sam gives them (DOORS c/fc/fr + notebook plan markers), (2) listen-through fixes to bed levels, (3) music for the dream worlds under the beds (Sam's).


**SHIPPED + synced + verified live (debug-jump walks, consoles clean, 0 tw-errors):**
1. **WINS REFUND A LAP**: Waltz Result Up, Fight Victory, Fight Victory Perfect, PP Victory, Bar Canvas Win, Cow ride success each do `(set: $returns to (max: 1, $returns - 1))(set: $wonTurnCue to true)` and (except the waltz redirect) show `<div class="inventory-note">GAME WON | TURN +1</div>` before the score plate. Hub got a once-only WON-TURN word ("A won game gives a turn of the night back. The one you just won has already been counted.") mirroring the lost-turn block; verified popping at the hub after Fight Victory → Standing → Colony Room Door → Dean Street (queued behind coin + turns tip by the serializer, as designed). Dream-world minigame wins (Nazca/Pyramid/Climb) deliberately NOT refunded — crossings already cost a lap; refund-on-win there would make a won crossing free (a nice trade if Sam wants it; one line each at the centres).
2. **COW FAIL COSTS A LAP**: `(set: $returns to $returns + 1)(set: $lostTurnCue to true)` in Cow ride fail — the ride now matches the other five performance games. NB it can remove The Fetch's "Not yet" option at the dawn boundary; correct consequence.
3. **PRICED PORTAL CROSSING**: the five hidden roll links in Third Pillar Portal are now `(link: "<world>-go")[(set: $returns to $returns + 1)(set: $crossingTurnCue to true)(go-to: ...)]` (text unchanged so the roll script + 3D `tp` button still match). Hub got a once-only CROSSING word ("Crossing the third pillar costs a turn of the night. The crossing you have just made has already been counted."). `$wonTurnCue`/`$crossingTurnCue` initialised in StoryInit (last line still bare).
4. **REAL PRE-EXISTING BUG FOUND + FIXED: the portal never navigated.** Harlowe's link handler drops clicks on a tw-link with NO LAYOUT BOX — the roll div was `display:none`, so `targetLink.click()` (from the passage's "Step through" AND the 3D button) silently did nothing; the `[[Back to the Pillars]]` fallback had the same fault. The roll div is now parked off-screen (`position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none`, aria-hidden, links tabindex -1 in the roll script). The fallback stays display-toggled because it becomes VISIBLE when used. Verified: Step through → Pyramid Mouth / Nazca Approach, TURNS dropped by one each time. Memory: `project_harlowe_hidden_link_clicks.md`. **Grep for other JS-clicked links inside display:none containers before trusting them.**
5. Verification notes: the pane stayed `document.hidden` all session (fronting did not clear it); navigation still worked via `.click()` on links inside the LAST `tw-passage`. Once-only tips persist through the autosave — wipe localStorage before re-testing a tip.

### 17b — QUICK WINS 3, 4, 5 (same session, Sam: "let's do the other three")
1. **PILLARS OPEN FROM THE START**: the `$visited's French is true` clause was dropped from all five Pillars branches in the Dean Street hub (comment above the first). Verified by a REAL walk from BEGIN (wiped save): the first hub with doors now lists "To The French" AND "To The Pillars of Hercules", 0 tw-errors. Consequence to know: the stats primer still fires on the first French entry, so a Pillars-first player meets it one venue later.
2. **SOBRIETY GATE ON THE GREEN SEA LINE**: LINE 2's "Listen" is wrapped `(if: $sobriety < 30)` → pink draft ("...the words go under the roar. You are too far gone to hold them. Whatever he said, it was not for tonight.") + [[Wake from this dream|Dean Street]], no $alba2; `(else:)` → the original block untouched. Threshold 30 = Shana's Devil line (one-number dial). The price is real: sober up on Dean Street (doorway/chippy) and cross again — the hub's Pillars link already stays open until $alba2 is caught. Sober path verified live (revelation box prints the line, "Then." present). **Drunk branch NOT seen live** (can't set sobriety from outside; same macro shapes as the sober branch). Sam: rework the pink line.
3. **REFUSALS COST A LAP**: the six "I'm not here" links (Lily ×5 venues, Aoife at the Pillars) now add `(set: $returns to $returns + 1)(set: $refusedTurnCue to true)` after the $refusedCalls increment; "Turn and leave" on the dual ring untouched (it already ends the night). Hub got a once-only REFUSED word ("Pretending you are not here costs a turn of the night. The call you just refused has already been counted."); `$refusedTurnCue` in StoryInit. Verified live on the real walk: Pillars first visit → "I'm not here" → barman aftermath → Back to Dean Street: TURNS 14 → 12 (lap + refusal), tip popped. NB the Aoife ring re-offers on every Pillars entry, so repeat refusals keep charging — that is the design; it also pulls the Lily/dual-ring timers (`$returns - $...ReturnsAt`) forward by a lap per refusal.
4. **All six quick wins from the assessment are now shipped.** Balance is untested by a human: 16 laps with refunds on wins, charges on cow-fail/refusals/crossings/drunk-listen. Sam's playthrough is the tuning pass; `$nightLength` 16 is the one dial if the night runs long or short.
5. Observation, not actioned: on a fresh save the Pillars entry lists a "Perform the synthesis" tw-link in the DOM (expected hidden by CSS at <5 gifts per Addendum 14 — worth one glance that it is not visible).

### 17c — THE "OTHER IMPROVEMENTS" ROUND (same session, Sam: "go onto the other improvements")
1. **AUDIO OUT OF THE HTML**: `sync_html.py` gained `AUDIO_MODE` ("link" default / "embed"). Link mode writes URL-encoded RELATIVE paths to the 21 audio files (they stay at the project root, no moves, no git churn) into the same placeholders; the loaders already `fetch()` whatever string sits there, so no audio code changed. **html 63.6 MB → 4.7 MB.** Consequences: (a) the html no longer plays audio from file:// (fetch cannot read relative files) — preview server or GitHub Pages only; (b) beds still decode lazily, so a `<link rel="prefetch">` warm-up for every real URL fires 4s after boot (UserScript, after the mini data-URI globals; skips data:/__DSS_ strings) — verified 21 prefetch links on the title; (c) every future commit adds ~5 MB not ~64 MB. CLAUDE.md updated (the "3MB / embedded" lines were stale). **Sam: the live site needs the audio files pushed alongside the html (they are already in the repo root if tracked — check GitHub Desktop shows no untracked audio); Cmd/Ctrl+Shift+R once after deploy.**
2. **REPO SIZE (15 GB .git)**: nothing I can run (no git). Recipe for Sam when he wants it: the history holds ~250 copies of a 60 MB html. `git filter-repo --path "Dream Street Shuffle.html" --invert-paths` would purge it (then re-add the current html), or simpler: start a fresh repo from the working tree and re-point the Pages site. BACKUP-*.html/.twee are already gitignored; if any were committed before the ignore, `git rm --cached` them.
3. **DEV FLAG OPT-IN**: `window.DSS_DEV` is no longer hard-coded true. Now: localhost → on; `?dev=1` in the URL → on and remembered in localStorage (`dssDev`) until `?dev=0`; plain visit to the live site → OFF. Gates the backtick panel, the three dream-game skip links, the climb's 'e' summit key, the Pillars `phvisit` override. The hash-jump boot hook stays ungated (needs a hand-typed URL). **Sam: on www.samquill.com append `?dev=1` once to get the backtick menu back.**
4. **REDUCED MOTION (audit A3/R1 critical)**: stylesheet tail now has `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }` — the 65 infinite decorative loops run one cycle and settle; one-shot reveals keep their timing (nothing waiting on animationend breaks). 3D scenes are rAF-driven and untouched (a JS `matchMedia` damping of camera drift is the next step if wanted).
5. **MODAL SEMANTICS (audit A3 high)**: `wordToTheWisePopup` + `venueHintPopup` boxes are `role="dialog" aria-modal="true" aria-label="A word to the wise" tabindex="-1"`, take focus on open and hand it back on dismiss (Esc/click); coin + matchbook overlays in the hub got role/aria-label. Stats modal already had it. Verified live: activeElement is the dialog while open, Esc dismisses. EatPopup and the cigarette popup NOT touched.
6. Verified on the new build: fresh boot → title → Night Ahead → Dean Street, 0 tw-errors, console clean, dssAudio alive, DSS_DEV true on localhost.
7. "Perform the synthesis" IS in the DOM at the Pillars entry on a real fresh walk (seen in the 17b refusal test). Addendum 14 says it is display:none at <5 gifts, so DOM-present-but-hidden is the documented state; not eyeballed this session — one glance from Sam that it is not visible.

### 17d — THE SOHO MAP (Sam: "a map you can walk around, like the early Pokémon Game Boy games, to get between venues" — house palette, little moving legs, arrow keys, walking costs nothing)
1. **Built as a VIEW over the Dean Street hub, not a replacement.** The hub carries `<div id="soho-map-container"></div>` (top level, right under the date strap, above the lamp SVG + intro prose). The engine (`// ====== SOHO MAP` in the UserScript, just above the DEBUG menu; `window.dssSohoMap`) uses the 300ms-watcher lifecycle, builds a 26×16-tile canvas (16px tiles, 416×256, CSS-scaled, pixelated), then **scans the hub's rendered `tw-link`s and `.greyed-out` spans** and matches them to doors by regex (`DOORS[].rx`). Lit door = a link exists; walking into it `link.click()`s after a 280ms fade. Grey = dark door, bump shows the bracket label as a sentence ("Need a word."). So every unlock/grey/funnel rule stays in Harlowe and the list beneath remains the fallback (dimmed to 0.72 via `tw-passage.soho-map-on`, choice-box links stay bright).
2. **Geography**: Dean St (cols 7-8), Frith (13-14), Greek (19-20) run N-S; Old Compton (rows 11-12) E-W; pavements flank each. Doors: French (5,8), Colony (10,5), Doorway (5,3), Chippy (10,14), Ronnie's (11,6), Lackland's (16,3), Coach (17,9), Pillars (17,1), Trisha's (22,4); spots: Ginger Light lamp corner (9,10) [Dean/Old Compton], Cecil Court alley mouth (25,13) at the east edge, Centre Point = walking off the top of Dean St (The Fetch / "Give up on the night"). Lamps at 9 corners (the ginger one orange), radial glow layer with flicker, lit windows on open doors, edge vignette, a passer-by silhouette crossing Old Compton every 16-34s.
3. **Player**: 12×16 procedural sprite, no face (hat brim shadow — house rule), 3 walk frames (left/right leg lift), 4 facings (left = flipped right), grid-stepped 9 frames/tile, holds repeat. Keys: arrows + WASD (arrows preventDefault'd only when the map takes the input; overlays/inputs → `busy()` → keys fall through). A tapped key steps immediately (keydown), not on the next frame. Touch: a 3×3 d-pad renders under the canvas on coarse pointers only. Spawn: outside the last door used (`sessionStorage.dssMapLast`, cleared on read), else mid Dean St (7,9). Caption bar: street name, or the facing door's name + its ledger glyph HTML copied from the link's trailing spans; grey label / "Not tonight." for shut doors; one-time hint ("Use the arrow keys to walk. Walk into a door to go in.", `localStorage.dssMapHintSeen`).
4. **Layout**: `.soho-map-wrap` breaks out of the text column (width min(148%, 100vw-2.5rem), max 832px, centred via left:50%/translateX).
5. **Verified live on real walks** (0 tw-errors throughout): lap-1 hub → only the ginger corner active → stepping onto it fired "See who's there" → Ginger Light approach; second hub → French + Pillars lit, spawned outside the ginger corner, arrows do NOT scroll the page (scrollY delta 0), facing the French door captions "THE FRENCH", walking in → the French approach scene, `dssMapLast=french`. NOT yet seen: grey-door bump captions, the north exit, the alley mouth, the d-pad on a real phone, the dimmed list's look (Sam's eyes).
6. **Open design questions for Sam**: does the map eventually REPLACE the list (then the greyed labels want map-side treatment); should the 3D approach scene stay as the door moment or be absorbed; Centre Point as a skyline drawing above the map.

### 17e — REPO PACKED (Sam-authorised git, option 1) + SOHO MAP ROUND 2
1. **`git gc --prune=now` (pack.window 20) run with Sam's explicit permission**: .git 15 GB → **483 MB** (3,961 objects into one 470 MB pack; 59 half-written tmp objects cleared). No history rewritten, nothing pushed. The repo had NEVER been packed (0 packs, 4,040 loose objects, 465 of them 38-44 MB html builds). Safe to commit again. Option 2 (purge old builds from history + force-push) remains Sam's call if GitHub ever complains.
2. **Map round 2 (Sam: "left of the street lamp; get rid of the click list; label the doors, make them much clearer, light from each door in its own colour")**:
   - Container moved to right after the floated `#dean-lamp-svg` line (so it sits LEFT of the lamp; the title now falls below the map). `.soho-map-wrap` is `display:flow-root` (a BFC beside a float takes the remaining width) and extends LEFT into the page margin (`margin-left: min(0, calc((100% - 100vw)/2 + 1.5rem))`) so it is not squeezed to the 230px the column leaves beside the lamp; on ≤640px it clears below the lamp.
   - The hub's link hooks (outermost `tw-hook` by ANCESTRY walk — Harlowe nests hooks and wraps content in tw-transition-container, so `tw-passage > tw-hook` matched nothing) get `.soho-hub-dock`: off-screen, 1px box, opacity 0 — layout box KEPT so `link.click()` still works. The list is gone from view; the map (and its labels) are the way in.
   - **HTML door labels** (`.soho-door-label`, Playfair small caps ~10.7px, dark pill, border + glow in the door's colour, `--door-col/--door-glow`) float over the ROAD beside each door; open = lit + clickable (= enter), grey = dim + label note, shut = near-dark. Anchors in `init()` (per-side rule + overrides for north/cecil/ginger/chippy).
   - **Door light colours** (`DOORS[].col`): French claret, Colony absinthe green, Doorway pale blue-grey, Chippy warm yellow, Ronnie's violet-blue, Lackland's amber, Coach brass-orange, Pillars sea blue, Trisha's pink, Cecil violet, Ginger orange, Centre Point dawn rose. Each open door: coloured windows, lit doorway interior, fanlight, a halo on the facade and a POOL on the pavement in front (grey doors keep a 0.16 trace). Doorsteps drawn on the pavement tiles.
   - Caption bar shows a guided choice's text as the standing note (e.g. "The dawn is coming.") when the hub is in funnel mode; label clicks on shut doors flash the reason for ~3s.
   - **Sam's scroll bug ("drops to the bottom when I press down")**: arrows now `preventDefault` whenever the map is alive and focus is not in a text field, BEFORE the busy() check — a popup used to make busy() true and the key fell through to the browser. Verified: ArrowDown with a popup up → scrollY unchanged.
3. Verified live (this build): 12 labels, French + Pillars open on the second hub, arrows never scroll. See the batch result below this line in the session for the docked-list + label-click confirmation.

### 17f — MAP ROUND 3 (Sam: "below the date, longer, fit the window; doors clearer, I can see the names but not the doors")
1. **Placement**: container is back under the date strap (`scene-location` + date line), `.soho-map-wrap` clears the lamp float and breaks out of the column: `width: min(96vw, 1180px, calc((100vh - 230px) * 26/22))` centred (left:50%/translateX) — fills the window by width AND is capped so the whole map fits the window height. Title/lamp stay above, prose below.
2. **Taller grid**: 26×22 tiles (was 26×16). Bateman Street (rows 5-6) and Old Compton (rows 15-16) cross Dean/Frith/Greek; pavements rows 4,7,14,17. Doors re-laid: Doorway (5,2), Trisha's (22,2) top block; Colony (10,9), Lackland's (16,10) middle; French (5,11), Ronnie's (11,12), Coach (17,12) lower-middle; Chippy (10,18) south of Old Compton; Ginger corner (9,14); Cecil alley (25,17); Pillars (17,1). 12 lamps. Spawn (7,12). streetName() knows Bateman.
3. **Doors drawn to read as doors**: cream frame filling the tile from the pavement side, interior in a PALE tint of the door colour (`lighten(col, 0.42)`) with a white core and a fanlight, an awning band along the street edge in the colour, doorstep on the pavement; **the neighbouring facade tiles along the frontage take the door's light** (windows tinted) so an open venue reads as a lit building; pavement pool alpha 0.82, halo r30. Labels sit 2.6 tiles into the road beside the door (not over the step). Shut doors: unlabelled dark fronts (names would spoil unlocks); grey doors keep the dim label.
4. **Player visibility**: lighter coat palette + a soft moonlight halo under the figure (no face still).
5. Ambient: more warm windows (0.74 threshold), vignette 0.45.
6. Verified live: map 527×446 in the 726-wide pane (height-capped), 0 tw-errors, French + Pillars lit, walk from spawn to the French door captions correctly. Screenshot eyeballed: doors now legible. **Sam: the phone d-pad, Bateman-block doors (Colony/Lackland's/Trisha's/Doorway) and the north/alley exits are unseen on this grid.**

### 17g — PHASE 2 KEYS SHIPPED ("one pocket, one key"; Sam: "what more can you do from the chair", 39% budget)
1. **System passages** (appended at the end of the twee, all `[system]`): `Key Guards` (old-save guards for $dreamKey/$keyPick/$keyX/$keyNames), `Key Set Held` ($keyPick → its var "held", $dreamKey), `Key Drop Here` (the held key's var ← `(passage:)'s name`, pocket emptied), `Key Take <id>` ×5 (the literal id sits INSIDE the (link:) hook so several offers on one page cannot cross; Pocket if empty, else "Leave the X here and take the Y"), `Resting Keys` (offers back any key whose var equals this passage's name). StoryInit: `$keyPick`, `$keyNames` datamap (cocaine "bag of cocaine", ticket "chippy order ticket", slip "betting slip", lighter "brass lighter", eye "glass eye").
2. **Seeds** (pink, appended at the END of each venue passage, guarded `$keyX is "seed"`, followed by `(display: "Resting Keys")`): The French → lighter; Trisha's → cocaine; Chinese Fish and Chips → ticket; Coach and Horses bar → slip; Martin Lackland's Office → eye.
3. **Portal**: `#dss-pt-key` span prints $dreamKey; JS steers to `DSS_KEY_WORLDS[key]` if unseen THIS playthrough (overrides lifetime variety), unhides the pink `#dss-pt-steer` line ("The X in your pocket has gone warm. It knows the way."); otherwise the roll as before (fallback respects a steerable key). Each hidden world link now also spends the matching key (`$keyX to "spent"`, pocket emptied); a key to an already-seen world stays in the pocket.
4. **Notebook**: after the coin item — "In your pocket: X" and "The X, left at <passage>" lines.
5. **Verified live** (real walk to hub 2, then debug jumps — NB in-passage link (set:)s only persist if a REAL link renders another passage before the next jump; the autosave is header-side): French shows the lighter offer → Pocket → "Approach" saves it; Trisha's shows the swap link → swap → Back to Dean Street; Trisha's again shows "The brass lighter is where you left it" + "Leave the bag of cocaine here and take the brass lighter"; Portal: key span "cocaine", steer line shown, Step through → Nazca Approach, TURNS 14 → 12 (crossing + hub lap). 0 tw-errors throughout.
6. **Not built / open**: notebook charm-slot ART (text lines only); alba 2 attend-moments in the world centres (phase-2 item 3); Soho-responds weaves (item 4); mantra syllable cue; the 2-crossing cap was not touched. Sam: rework the five pink pickups + the steer line.

### 17h — ALBA 2 IN ALL FIVE CENTRES + MANTRA CUE WIRED (phase-2 items 3 and 6)
1. **Alba 2 attend-moments** (pink, `(unless: $alba contains $alba2)`) inserted just before each centre's return link, in the world's register: The Cave "Attend to the petal"; The Centre — Nazca "Follow the line"; The Glyph "Read the glyph"; King's Chamber "Keep the proportion"; The Wheel "Meet her eyes". Each is a quiet (link:) that grants $alba2 with the same revelation-box + THE SECOND LINE OF THREE furniture as the Green Sea. The Green Sea road is unchanged (and still sobriety-gated). Alba gates downstream are source-agnostic, so no endgame rewiring.
2. **Mantra Syllable Cue** now `(display:)`ed at all 13 haunt boxes (appended to each "of 12 caught" line, inside the same hook) — the Nth haunt caught fades in the Nth syllable.
3. See the batch below for the live checks (Nazca attend link + a haunt site's cue).
4. Remaining phase-2 items: Soho-responds weaves into current main passages (critic $mantraComplete, Lackland $nazcaTracing, Dean Street links); notebook gift OBJECTS/CHANT/22 paths; hexagram map reveal + real Alt-Dawn body (Sam's prose).

### 17i — MAP AESTHETIC PASS (Sam: "what about aesthetically?")
1. **Sky band**: `SKY = 3` rows of night above the grid (canvas H = (ROWS+SKY)*T = 400; base/glow/sprites drawn under a `translate(0, SKY*T)`; labels offset by SKY; CSS aspect 26/25). `drawSky()`: gradient, 26 seeded stars, a crescent moon top-right, jagged far roofs along the sky's foot, and **CENTRE POINT** — the honeycomb tower (2×2 lit cells on a 4px grid) standing over Dean Street's north exit; when the dawn/Fetch is offered the tower's windows go dawn-rose with a glow behind it (the old north glow strip is gone). Centre Point label sits in the sky.
2. **Wet-road reflections**: `smear()` in buildGlow — broken vertical 1px dashes of a light's colour on ROAD tiles only, under every lamp (all four neighbours) and beyond every open door's pavement.
3. **Life**: up to 9 warm windows blink dark for ~1s on staggered 11s cycles (`WIN_BLINK`, registered in drawFacade); up to 4 chimneys (`CHIMNEYS`, registered in drawRoof) trail 5-particle smoke wisps.
4. **Frame**: double gold hairline (1px 0.45 + 5px-offset 0.3) over the dark mat.
5. Verified live: renders, 0 tw-errors, console clean; screenshot eyeballed (tower, moon, smears, lit doors). Registers reset per build (`WIN_BLINK.length = 0` in buildBase).
7. **WHERE THE VENUE MEETS THE STREET (Sam)**: per open door a `.soho-door-spill` (a fan of the door's light, `clip-path` trapezoid + `mix-blend-mode: screen`, rotated per facing via `--rot`, sized in `cqw` on the stage which is `container-type: inline-size`; grey doors get a faint static one) and a `.soho-door-chev` (❮ on the pavement tile, rotated to point into the door, nudging in on a 1.1s loop). Seen live: 3 open doors → 3 fans, 3 chevrons.
8. **SCROLL-JUMP, STILL REPORTED BY SAM, NEVER REPRODUCED HERE**: keys are on document capture with preventDefault before busy(); pane tests show 0px scroll in every state. Added a belt-and-braces pin: any movement key records scrollY and tick() restores it for 40 frames. Diagnostics to ask Sam: browser, keyboard vs clicking, whether the figure moves at all when it jumps. If the figure does NOT move, the map's listeners are not attached on his build (stale cache or an init exception — check console for '[sohoMap]').
6. **DOORWAY MARKERS (Sam: "still not obviously doors")**: every open/grey door (and the Cecil alley) gets a `.soho-door-mark` DOM overlay — an inline SVG arched doorway (dark frame, cream stroke, interior gradient white→door colour, fanlight bars, knob, step, a lamp dot when open) sized 1.5 tiles wide over the door tile, drop-shadow glow in the door colour, 3.2s breathe on open ones; the label now sits DIRECTLY ABOVE the marker (lty = r − 1.35) instead of out in the road. Shut doors get nothing (still unlabelled). Eyeballed: reads as a door at pane size.

**Commit now = the .twee, the .html, sync_html.py, CLAUDE.md.**

**Commit = 2 files (.twee + .html), uncommitted — Sam commits via GitHub Desktop.**

## ⚠ ADDENDUM 14 (2026-08-21) — V2 DREAM-WORLDS PORT ONTO MAIN, PHASE 1 (foundation SHIPPED + verified)

**Context:** Sam wants more routes (Deus Ex conversation). Decision: develop the shelved v2-expansion. IFComp ruled out (2026 intent deadline passed; he's self-promoting — no AI-content constraints apply). **Read-only git on the branch was Sam-approved this session** (still NEVER add/commit/push).

**Design locked with Sam this session (do not relitigate):**
1. **Five pocket-keys steer the third-pillar crossing**: bag of cocaine→Nazca (lines), Chinese chippy order ticket→Easter Island (script), betting slip→Pyramid (number/odds-as-proportions), lighter→Himalayas/Cave (flame), **glass eye**→Ezekiel (vision; his favourite). NEW objects, deliberately collectable-or-not; NOT the existing trophies (he rejected keying coin/liver/napkin — "they get those anyway").
2. **One pocket, one key.** Picking up a second offers a swap; the left-behind key RESTS WHERE YOU SWAPPED IT (notebook records where; re-fetchable — deposit/retrieve was his explicit ask). The crossing CONSUMES the key. No key → pure roll among unseen worlds (never lock content behind item luck).
3. **No destination menu ever** (nobody chooses their dreams); the choice lives in which object you hold. Diegetic steer via carried gift = banked for later, not phase 1.
4. **Crossings cost a lap** (+1 $returns + $lostTurnCue, the priced-crossing pattern) — keep $nightLength 16, retune after his playthrough if tight.
5. **Alba 2 latent in ALL FIVE world centres** — surfacing in each world's register (petal/line/proportion/glyph/face-among-eyes), earned by a quiet ATTEND-style choice (the Green Sea "Listen" pattern), NOT auto-granted with the gift — keeps the Carthage road honest. **Alba 3 stays single-road forever** (the calls chain is sacred). Alba gates are source-agnostic ($alba contains — lines 40279/40417 pre-port), so no endgame rewiring.

**Phase 1 SHIPPED to main .twee + synced (186 passages, was 146):**
- 40 branch passages appended verbatim: 5 world arcs (5 pass. each + Turn-Backs (none for Ezekiel, by design) + Returns), Third Pillar Portal, Dream to Dean, Sanctum ×2, The Synthesis, Alt-Dawn (stub → v1 Dawn), Red Recognises the Name, Benito Recognises the Wheel, Mantra Syllable Cue, Deco Divider. **"French drink" passage deliberately NOT ported** (predates drink-spiral economy; park for Sam).
- UserScript: worlds/gifts lifetime-localStorage helpers (dssLoadLifetimeWorlds/dssMarkWorldSeen/dssAddLifetimeGift etc., keys `dssWorldsSeenCycle`/`dssLifetimeGifts`) + NEW `window.DSS_KEY_WORLDS` map, inserted at UserScript top.
- StoryInit: full v2 var block + NEW key vars ($dreamKey="" ; $keyCocaine/Ticket/Slip/Lighter/Eye="seed"|"held"|<passage name>|"spent"). **GOTCHA (bit tonight): StoryInit is [startup] — a trailing `\` on its last line renders a literal "\" above the title.** Last line must end bare.
- CSS re-added/ported: .claude-draft (pink) + .pillar.centre/first-sight + world-reveal keyframes + hexagram + .mantra-cue + .nb-paths (inserted above the old ".claude-draft styles removed" comment, ~line 45116 pre-port).
- Entering The Pillars of Hercules: gold third-pillar SVG woven after the right pillar (renders inside .pillars-scene via tw-hook; `.pillars-scene tw-hook {display:block;position:static}` ported with it); step-through/spent/synthesis tail appended at passage end **with old-save guards** ($worldsVisited array-guard, $inisToldOfPillars boolean-guard).
- O'Flatterly's Gift: Inis third-pillar tip-off (pink) before "[[Back to Dean Street|After Cecil Court]]", boolean-guarded.
- `v2-prose-AS-WRITTEN.docx` + `v2-prose-REWRITE.docx` pulled off the branch into the project root for Sam's voice pass.

**Verified live (real links, consoles clean, zero tw-errors):** full Himalayan arc Airport Pub→Cave, "Say the mantra"→mandala SVG reveal→dssMarkWorldSeen fired (cycle+gifts=["himalayas"])→Return→Dean Street with clock ticking; fresh save shows 2 pillars only/no leak; Gift tip-off renders pink (#ff3aa8 computed); real walk opening→French→hub→Pillars→Aoife call→venue shows critic fork + "Step through the third pillar" coexisting; synthesis link correctly display:none at <5 gifts. NOT visually eyeballed: the gold pillar itself at full render (preview pane scroll/fixed-header capture kept scrambling — DOM verified correct; **Sam should look at the Pillars venue first visit**).

**PHASE 2 QUEUE (next session, in order):**
1. **Rewrite Third Pillar Portal** for key logic: read $dreamKey (DOM-bridge span like the existing visited-span), steer via DSS_KEY_WORLDS, consume key ($dreamKey="", $keyX="spent" — needs a (set:)-on-link, not JS), +1 turn on crossing, fallback roll among unseen, keep 2-crossing cap.
2. **Seed the five pickups** (spread across playstyles): cocaine→Trisha's, order ticket→Chinese Fish and Chips, betting slip→Coach bar (Bernard territory), lighter→The French, glass eye→Lackland's (back room or office). Pickup = quiet link; swap offer when already carrying; deposited key re-fetchable at swap site. All pickup prose PINK. Notebook charm slot (single-slot display).
3. **Alba 2 attend-moments** in the five centres (guarded `(unless: $alba contains $alba2)`), pink drafts, per-world register.
4. **Soho-responds weaves into CURRENT main passages** (branch versions diverged — weave by hand): critic $mantraComplete branch, Lackland $nazcaTracing branch, Dean Street links for Inis notebook/Red-under-the-lamp/Word-from-the-French.
5. **Notebook**: gift OBJECTS entries, CHANT (mantra) section, 22 Hebrew paths, charm slot — main's builder moved (~44925 pre-port); port carefully.
6. **Mantra syllable cue** (display: "Mantra Syllable Cue") at the 12 haunt-collection sites.
7. Hexagram map reveal + real Alt-Dawn body (Sam's prose) — still unbuilt (was unbuilt on branch too).
8. Old-save guard audit over every new $var read; audio beds for world tags someday.
9. Sam: pairings sanity-check in play, prose docx pass, and the parked French drink ruling.

**Testing this session:** stale `python -m http.server 8732` from an old session reused for preview (it serves the project dir; preview config `dss` port-conflicts against it — reuse, don't kill). Debug-jump artifacts as documented (half-init, stale duplicates, TURNS misreport); backgrounded pane freezes transitions (front the tab, force opacity, or reload fronted).

### 14b — THE PORTAL 3D SCENE (same night, Sam: "make the 3D render for the portal pillar")
**Sam's brief: the third pillar GROWS AS A WHIRLPOOL/WATERSPOUT out of the rainwaters. Blue and gold.** Built as a full-screen 3D scene on the **Third Pillar Portal** passage (`tp-` prefix, standard lifecycle: `tp-container` div in the passage / `tp-wrap` / `_dssDisposeWrap`, inserted in UserScript just above the Centre Point scene).
1. **The birth (one-shot ~7s):** dark flooded void (FogExp2, film grade, bloom 0.55) → whirlpool wakes in the black rainwater (single disc, all spiral art baked into ONE canvas — arms + dark eye + froth; BLOBS not rings) → waterspout climbs out of the eye (3 nested open cylinders, additive spiral-streak textures at different spins/scroll speeds, geometry translated so origin = base and scale.y grows) → **the gold column rises inside the spout** (fluted canvas-tex shaft, emissive+PointLight ramp, decay 2 range 38) → veils thin to a turning water-skin around the standing column, whirlpool keeps circling, gold motes rise. loreUnravel fires as the gold breaks the surface. STEP THROUGH button (of-btn styling) fades in at 7.2s.
2. **Dim mode** (empty pool = "nothing opens tonight"): scene detects no `#dss-portal-action tw-link` at build → spout falters at ~40% and sinks back, gold barely glimmers, button = BACK TO THE PILLARS at 4.2s → clicks the hidden fallback link. **NOT live-tested** (needs 4 lifetime + 1 in-run world; logic mirrors the branch-tested fallback).
3. The scene's button clicks the roll-script's generated link — so the **phase-2 key-logic rewrite of the roll leaves the 3D untouched** (same contract: produce a tw-link in #dss-portal-action).
4. **Review hook:** `localStorage.setItem('dssTpSpeed','0.3')` (or `window.DSS_TP_SPEED`) = slow-motion birth; timeline scales, spins/particles stay real-time; **REMEMBER TO CLEAR** (cleared tonight). NB the preview pane sometimes skips reloads on navigate (old closure keeps running — flags set via console then miss); force with `location.href` + fresh `?v=`.
5. Verified live at full rate + slow-mo: whirlpool wake, mid-rise (capital clearing the veils), settled state, button, consoles clean. Palette tuned once (cyan uplight 0.6+2.0g, veils base 0.62/0.46/0.38, water roughness 0.17/metalness 0.6, exposure 0.68) — first cut read too black for the blue-and-gold brief.
6. **THREE BLUE POSTS PASS (Sam: "all three pillars a bit more blue — there are three blue posts and I should use that")**: the portal scene is now a deliberate Three Blue Posts signature (joins the den handkerchiefs + Carthage colonnade — never remove). Stone base #3e5570 with blue mottle + spectral cyan emissive (0x16344a, 0.22); coolDir recoloured 0x4a86a8 0.75; **cyan rim DirectionalLight (0x8ac8dc) from behind at (0,4.2,-9), intensity 0.78** (0.95 ran white-hot on the stone crowns) — edges all three pillars in blue while the gold face survives. Verified live: broken pair unmistakably blue, gold column blue-crowned.

### 14c — THE NAZCA RACE REBUILT (Sam: "find my old NASCAR lines driving game and build it again better")
1. **Found it in `stash@{0}` on v2-expansion** (GitHub Desktop stash, 2026-05-15 session "Nazca race minigame..."): a 1191-line per-pixel canvas Mode-7 build Sam abandoned as rubbish (his own notes flag the messy start view, unreadable barriers, warped painted text — all inherent Mode-7-in-JS pains). Original passage saved at scratchpad `nazca_race_original.twee` this session; the stash itself is UNTOUCHED (never popped/dropped).
2. **Rebuilt as `:: Nazca Race` on main** (187 passages now): kept HIS design verbatim — hummingbird 6-bezier track (BIRD_PATH constants), TRACK_WIDTH 140, weighted steering (buildup/return/momentum constants ported), on/off-track speeds 3.8/1.2, spinout (1s, 1.5 rotations) when >1.6× off the line (now respawns ON the line facing forward), 2 laps, faceless black car on the perfect line at **his exact 0.0010 pace (~17s/lap, "joy-ride")** with corner easing, his intro prose (pink) and "Two laps. The line is the line."
3. **Rendering is now three.js in the in-passage canvas** (720×450, CSS-scaled): the pampa is ONE baked 2048×1200 canvas texture on a ground plane = mode-7 done by the GPU (pale cleared line + dark swept berm + start checker + faint decor glyphs: spiral, rays), sky dome, ridge cones on the horizon, his 3 arches (NAZCA banner at start), cairns at high-curvature corners (visual, no collision — barriers-as-walls abandoned deliberately, the desert has no walls; spinout is the boundary), low-poly cars with blob shadows, wheel dust (heavier off-line), **condor shadow gliding over the pampa every 16-34s** (living element), gold hummingbird minimap with both car dots.
4. **Wiring**: The Ridge → "[[Down to the centre, where a car is waiting|Nazca Race]]" → win = (link:) setting `$nazcaRaceWon` → Centre; lose = plain link → Centre (non-blocking, his design). Centre pays a quiet **MORALE +8** if won ($statGain, guarded). `$nazcaRaceWon` in StoryInit. Dev-gated skip link (shows under `window.DSS_DEV`). Touch = cow-ride pattern (hold to accelerate, left/right thirds steer). blur clears inputs (stick hygiene).
5. **Verified live** (first cut): renders + drives (chase cam with lag, dust, HUD lap/position), countdown 3-2-1-GO, full race run to a LOSS → span reveal → link → lands at the Centre, 0 tw-errors, console clean. **Caught + fixed: opponent pace was 16.67× too fast** (double time-unit conversion — od must be `oppSpeedT * ease * dt` with dt in 16.67ms frames). NOT yet verified: a human WIN (needs real steering — Sam's job and pleasure); win span's (link:)+(set:) is standard Harlowe. Watchdog dispose on passage exit (500ms interval, full material/geometry teardown).
6. **SHOWCASE PASS (Sam: "uncontrollable mechanics, boring track, low-grade graphics — do the graphics improvement you did elsewhere")** — full passage-script rewrite, same night:
   - **Light/grade**: golden hour — LOW sun (dir light at y150), REAL long shadows (2048 PCFSoft map, frustum follows the player each frame), hemisphere bounce, canvas-sized bloom composer (dssMakeComposer is window-sized and would smear — built the EffectComposer by hand at 720×450), dssFilmGrade on the new `.nazca-race-frame` wrapper, sun-disc glare sprite (additive), banded dusk sky with baked cirrus.
   - **Pampa bake up-gunned** (3072×1800): desert-varnish bands, one-direction wind streaks, cracked-earth patches, rock fields, THREE dead-straight ceremonial lines crossing the plain (the track drives over them), decor glyphs (spiral, rays, a small condor), worn racing groove inside the cleared line, berm shading.
   - **Cars rebuilt**: hood/boot/cabin/raked windscreen + rear glass/chrome bumpers/hubcapped spinning wheels; player wears a **"93" door roundel** (Page 93 — was "73" until Sam corrected it); body roll on steering, squat on speed, judder shake off-line. **The black car raises NO dust** (the dream telling on it) and never casts a number.
   - **THE GOLD WAKE**: driving the line lights it — additive gold segments (260-pool) laid every ~10 units on-track, bright then settling to a steady ember; lap 2 chases the glyph you lit on lap 1. Minimap echoes it (driven arc burns brighter in the gold ink; leather-backed rounded plate).
   - **Living pampa**: 3 dust devils wandering far off (translucent spiral cylinders), condor shadow kept.
   - **Feel pass (the "uncontrollable" fix)**: steering attack 0.0055→0.016 (~3×), return 0.011→0.022, saturating steer-scale (0.55+0.45·min(1,v/2.6) — his scaled UP with speed = twitchy at max), gentle drift (motion heading lags the nose, lagK 0.20/frame), off-track is a soft scrub not a wall (bleed ×0.972/frame toward cap 1.4 + judder), speed-FOV 62→71.
   - **Verification status**: builds clean (0 tw-errors, 0 console errors — constructors, shaders, textures, composer all ran). The preview pane went document.hidden at the end of the session (Sam's focus on chat) so the v2 loop was NOT seen painting — **first thing next session or Sam's first click: watch one lap** (rotations/wake/devils/FOV are the unwatched code). Feel verdict is Sam's hands, not a screenshot.
7. **SAM'S PLAYTEST FIXES + THE CIRCUIT (v3, same night)** — he played it and reported: steering REVERSED, track "even simpler"/boring/hard to follow:
   - **Steering was mirrored** (objective bug): my port kept his angle math but the three.js screen basis is opposite-handed to his Mode-7 projection — left/right input assignments swapped (and body-roll sign with them). If any future port shows inverted steering, THIS is why: `x += -sin(a)` + camera-behind means LEFT must build NEGATIVE steerVelocity.
   - **The "even simpler" haze**: golden-hour exposure pushed pale sand over the bloom threshold — whole-frame bloom wash = detail loss. Bloom 0.34/0.55/0.78 → 0.2/0.4/0.92, exposure 0.86, deeper varnish ground, berm 0.8 alpha.
   - **THE HUMMINGBIRD CIRCUIT** replaces the six-bezier blob (his old track was always a gentle oval; he asked for "longer, more interesting"): closed Catmull-Rom through 31 hand-laid waypoints — along the back → over the head → the BEAK straight flat-out into the tip HAIRPIN → throat → SOUTH-WING sweeper → belly run → TAIL-FEATHER hairpin → NORTH-WING sweep home. **Lap 5248 units (~2× the old loop), player flat-out ~23s, opponent 0.00054 (~31s/lap)** — geometry machine-checked: min far-leg gap 110 (the beak hairpin's own neck; everything else ≥135 vs width 100). Second tail feather + the eye baked as ground DECOR (not driven) for glyph fidelity; minimap now draws the true circuit.
   - **Readability ("hard to follow")**: camera up 24→30, back 52→62, looks 80 ahead, FOV base 60; fog pushed out 620/1500; cleared-edge STONE ROWS baked along both edges (the real lines are stone-edged — also distance cues); pale-tipped HAIRPIN STAKES auto-placed on the outside of corners with CURVE>0.16; cairns rescaled for the 372-point line; wake spacing 16u/pool 340 to cover the long lap.
   - Ridge ring pushed to 1320/1500, sky 2100, shadow frustum 380. All builds clean; **pane stayed hidden — Sam's lap is the verification.** Tuning dials if he reports: oppSpeedT (difficulty), TRACK_WIDTH 100 (forgiveness), steerBuildup (response).
8. **Sam: "so much better" but "steering too reactive, easy to go off"** → steerBuildup 0.016→0.010, steer cap now SHRINKS with speed (`0.95 - 0.45·min(1, v/3.8)` — agile in hairpins, stable on the beak straight; the old formula GREW with speed = hair-trigger straights), drift smoothing lagK 0.20→0.16. These three lines are THE feel dials for this game.
9. Second feel step (still hot): steerBuildup 0.0075, maxSteerVel 0.052→0.046. **The door roundel is 93 now, not 73** (Sam's call — Page 93; the date was my guess, the page is his meaning).
10. **Beak hairpin was "rough for the first bend" (Sam)** → RUN-OFF BULGE at the tip: per-point width factor `WF[]` (apex = easternmost CL point, cosine taper over ±26 samples, peak 1.6×), honoured by isOnTrack + the spinout threshold AND baked into the ground art (tapered per-segment strokes over the tip). The widened tip doubles as the glyph's beak-point.
11. **THE BEDTIME ROUND (Sam: drift + white sand + "total freedom", then he slept; final waking word: "Make it read NAZCAR")** — all shipped, synced:
   - **DRIFT**: hold a hard turn at speed (>60% speed, >62% steer) and the tail steps out (heading-lag drops to pow(0.945,dt), nose over-rotates ×1.5 visually, deeper body roll, heavy side dust); hold the slide >850ms and release for a **gold-spark mini-turbo** (boost +0.85). No scrub while sliding — drifting is the fast way round.
   - **WHITE SAND**: gypsum drifts auto-seeded on the straights (CURVE<0.012, ≥14-sample gaps, ~15 patches weaving lanes), each = white decal + 3 little dunes; drive over → HOOVERED (particles rush INTO the car's tail), boost +0.6 (shared boost pool, cap 1.5, +1.35 max speed), engine blips; **respawn every lap**.
   - **Free-rein extras**: 3 START LIGHTS on the NAZCAR arch beam (amber-amber-amber with the countdown, all green at GO, dim after); **engine sound** — scene-local WebAudio (saw+square through a lowpass, pitch/filter ride speed, drift growl), gated per-frame on `dssAudio.isMuted()`, resumed on the start gesture, killed on dispose; the black car **leans into corners** (curvature cross-product); **WIN FLARE** — crossing the line flares the whole gold wake (exp decay 2.2s) and the full bird pulses gold on the minimap (only YOUR car was ever drawing); minimap gained the decor feather + eye + LAP n/2 tag. **The banner reads N A Z C A R** (his call, sent from the pillow).
   - **VERIFIED OVERNIGHT BY HEADLESS HARNESS** (the pane stayed hidden, so the engine was extracted from the twee and run in JavaScriptCore with stubbed DOM/THREE/WebAudio, simulated clock + synthetic keys — harness at scratchpad `harness.js`/`driver.js`, reusable pattern for any canvas minigame):
     · LOSE run: 16,000 frames, **0 errors**, countdown 3-2-1-GO at cadence, HUD position flips, black car crosses at ~72s, lose span revealed.
     · WIN run (opponent crippled in the test copy only): 2 full laps by the blind driver, LAP 2 rollover (proving patch respawn), "YOU CROSS FIRST." + win span + flare path executed for 100s+ after, **0 errors**. 36 drift turbos, 207 sand grains hoovered across both laps.
     · **REAL BUG FOUND + FIXED by the harness**: the drift trigger compared |steerVelocity| against `maxSteerVel*0.62`, but the speed-stable cap tops out at 50% of maxSteerVel at full speed — drift was UNREACHABLE at racing speed. Now `> capV*0.8` (relative to the live cap). Synced.
   - Still only Sam can judge: pixels (bloom level, NAZCAR banner, sand dune look) and feel. **Morning list: one real lap — try a drift (hold a hard turn ~1s at speed, release), hoover a sand patch, listen to the engine (and the mute), win it.**
   - Token note: Sam offered 30% of usage for free-rein work; the round came in far under — no padding for its own sake.
12. **THE MARIO ROUND (Sam, one last waking instruction: "make this work as much like mario cart as possible", 1hr + 23%)** — all shipped, synced, and headless-verified (0 errors across 100k+ simulated frames, both outcomes):
   - **STAGED DRIFT**: slide >850ms = blue stage (+0.6 boost), >1800ms = gold stage (+1.2); charge sparks stream off the rear DURING the slide in the stage colour; release pays out. (The trigger is `capV*0.8` — relative to the live speed-scaled cap; the harness caught that an absolute threshold made drift unreachable at speed.)
   - **ITEMS**: 9 gold octahedron boxes in Mario rows of 3 (t 0.12/0.5/0.82, 5s respawn), one item carried, shown in a leather roundel top-left of the canvas. **Leaf** (mushroom) = instant boost 1.3 + green sparks; **stone** (green shell) = straight-flying shot, stuns the black car 1.3s; **condor** (red shell) = the condor's shadow homes onto the black car over 2.2s; **slick** (banana) = dropped behind, spins the player / stuns the opponent, max 4 live. **Space throws; middle-third tap throws on touch.** Accelerate is ↑/W/touch-hold only now (Space reassigned).
   - **RUBBER-BAND AI**: opp pace × `clamp(1 + (playerLapsT - oppLapsT)*0.55, 0.82, 1.2)` — hustles when behind, coasts when ahead (lose-run sim stretched 72→86s: races stay close). **The black car plays too**: when leading it drops its own slick on the line every 20-34s.
   - **FINAL LAP** banner + double blip at the last lap rollover; overtake blips both ways; boost = +5 FOV kick + gold exhaust sparks.
   - Verified via the jsc harness (updated for the round): lose run 16k frames + win run 90k frames, 0 errors, FINAL LAP fired, item blips 6/34, staged-drift sparks in the hundreds, sand + boxes + hazards all exercised. Sam's morning judgement: pixels + feel + whether the item balance amuses (dials: box row count/positions, item odds in the `roll2` line, stun 1300ms, band 0.55/0.82/1.2).

**Commit = 2 files (.twee + .html), uncommitted; plus 2 NEW untracked docx (v2-prose-*.docx) — Sam commits via GitHub Desktop.**

---

## ⚠ ADDENDUM 16 (2026-08-22) — THE CLIMB (Sam's yeti brainstorm: "I like all of this. Please build")
1. **New passage `:: The Climb` [dream himalayan]** (189 passages): The Mountain → "[[After him, up through the snowline|The Climb]]" → win/lose spans both → The Cave. Win = `$himalayaClimbWon` (slips ≤ 3 AND prints ≥ 16 — BOTH DIALS UNPLAYTESTED BY A HUMAN) → silent stat is not silent: MORALE +8 + note inside the Cave's "Say the mantra" block. **Sam's Cave dialogue untouched** — the optional "You kept my steps" line was NOT added; his to write.
2. **Vertical climber, all brainstorm elements in**: deterministic ledge route (LCG seed 93, ~54 ledges to SUMMIT 4600); THE YETI rubber-banded ~250 above (never catchable — he stops when the mountain ends), pauses and looks down at random; **FOOTPRINTS** — he drops glowing blue prints on every ledge he crosses, snow fills them over 9s, stepping in them is the collectible (follow in his steps); **BREATH** thins with altitude — empty breath SLOWS you but never weakens the jump (no soft-locks) — **holding ↓ CHANTS the six Airport-Pub syllables** (gold syllables float, vapour rings, breath refills 3×); gusts telegraphed by the flurry angle + the scarf; cornices crumble 0.45s after touch, regrow 5s; **prayer-flag checkpoints** every 8th ledge (respawn points; falls below high-water −520 = slip + respawn); ONE couloir set-piece at 2600 ("THE SLOPE LETS GO." + 13 dodgeable chunks).
3. **The ending is WORDLESS** (Sam's staging): at the summit the shape stops at the cave mouth, the snow quiets to 16%, the wind gain drops, he TURNS — two slate glints, 2.4s beat, loreUnravel — then goes in; spans reveal after. The recognition belongs to the Cave prose.
4. **Audio**: wind (looped noise through bandpass, swells in gusts, hushes at the turn), chant hum 108Hz, print-tick — all scene-local WebAudio gated per-frame on dssAudio.isMuted(), resumed on first input, killed on dispose.
5. **Harness-verified** (hc_harness/hc_driver in scratchpad; AudioContext stub grew createBuffer/BufferSource, ctx2d grew scale): churn run 20k frames (gusts + chant + breath + avalanche + prints + yeti) 0 errors; finish run reaches the summit, plays the look-back, reveals the span, 0 errors. Diagnostic delight: the bot's early jump-release cut its apex to 99.9px under a 100px target — the JUMPCUT dial proving itself.
6. **Minigame ledger now**: Nazca RACES, Pyramid RUNS, Himalayas CLIMBS, Easter listens (unbuilt), Ezekiel is SEIZED (gameless by design) — the decrescendo of agency agreed with Sam. Sam's list: play the climb (breath drain 0.018+0.05·alt, print threshold 16, slip threshold 3, gust force 130 are the dials), judge the yeti silhouette + the look-back timing, decide the Cave line.
7. **SAM'S FIRST-PLAY ROUND (same morning, all five items shipped + verified)**:
   - **THE FREEZE-AND-FLASH BUG**: the fall threshold (maxY−520) was TIGHTER than the flag spacing (~680) — respawning at the flag still counted as falling → slip+respawn every frame. Now a slip needs airborne + vy < −520 (real falling speed; a one-row hop-down peaks ~−428) + 90 below the checkpoint flag; respawn grounds you → loop impossible. **If a future climber "freezes and flashes", check threshold-vs-checkpoint-spacing first.**
   - **MULTIPLE ROUTES**: row-based generation — rows carry one ledge (junction, x260-410) or two strands (L x110-285, R x420-605); flags sit at junctions; cornices only on two-ledge rows (a crumble never blocks the only path). **The yeti takes ONE strand** (keeps his side 75%, crosses 25%) and prints mark HIS route only — following him is now a choice made at every junction. Zone widths vs reach 175 guarantee reachability by construction; audited: 54 rows, 0 unreachable ledges.
   - **PRINTS BOLD**: were drawn UNDER the ledge snow caps (ordering) — now drawn after ledges, bigger (7.5px pads), rimmed, brighter glow.
   - **SNOWBALLS**: ambient single falls every 3.5-6.5s above y200 (reuse the chunk system, capped 50 live); the couloir avalanche unchanged at 2600 (Sam never reached it — the bug ate his run).
   - **UPDRAFT CATCH-UP**: when >380 below your high point, prayer-flag ledges show rising shimmer and a jump from them launches at vy 660 (~4 rows) — the mountain gives back what it took.
   - Harness re-verified both modes 0 errors after all of it; live in Sam's Chrome at ?v=climb3.
8. **SECOND PLAY ROUND (six items: rescue-wind, hit consequences, unreachable summit, too long, invisible slope, scarf-read-as-limb)**:
   - **WIND RESCUE replaces teleport-respawn**: a real fall now plays out — you drop visibly (~0.55s), the wind CATCHES you (swirl arcs), arrests the fall, and carries you on an eased arc back to your checkpoint flag (upward streak lines while carried). Costs a slip. Input locked during; invuln through it.
   - **Hits have teeth**: every snowball/avalanche hit = TUMBLE 0.55s (no input, body spins) + knocked off the ledge — near edges that cascades into a fall and the wind rescue = lost height. Plus the 3-slip win gate.
   - **SUMMIT WAS UNREACHABLE** (Sam: "the highest step is too low") — the bridge loop's exit arithmetic left up to a 163px gap under a 133px jump. Now a UNIFORM CHAIN: remaining height divided into equal steps ≤92 by construction. Audited: max vertical gap anywhere 95.4 vs apex 133. **LESSON (bit twice tonight): never trust while-loop exit arithmetic for reachability; divide the gap into N equal steps instead.**
   - **Shorter**: SUMMIT 4600→3300. **THE SLOPE is a PLACE now**: ly 1500-2300 is a 45° single-stair switchback (up-right to the wall, back up-left), gates flagged both ends, wind-scoured darker ledges, avalanche fires at entry + snowball rate triples inside (1.3-2.7s).
   - **BODIES REDRAWN**: player = head on a neck, shouldered coat, two swinging arms, two legs with knees (run/jump/chant poses), scarf now THIN two-tone cloth, long and waving (was read as a limb); yeti = dome head sunk in heavy shoulders, two long arms to the knees, two thick legs, stride bob, fur rim + wind-caught tufts.
   - **Undeclared-var purge**: runPhase/runLean/landPuff were implicit globals (worked by accident, crashed the harness) — declared; landPuff also never decayed. NOTE: the pyramid engine declares identical names — climb-side anchors must include climb-unique context lines.
   - Harness both modes 0 errors; live at ?v=climb4.
10. **FOURTH ROUND (Sam's last-things list)**: **the log is now REQUIRED** — the ladder is the only way onto the ravine's LEFT bank (bank sits 150 above the top stair, apex is 133), the switchback stairs leave from the FAR side (first stair x610, gap from the left bank 190 > reach 175) — the log must be walked; **the ending is two entries now**: yeti swallowed by 5.1s, then THE PLAYER auto-walks slowly into the cave 5.2-7.4s (same stoop/shrink/fade treatment, walking legs via forced runPhase), spans at 7.8s; **one print per platform** (centre, catch radius 30/16, win threshold prints ≥16→10 to match the halved supply); **boot-grip**: ground vx response dt·16 vs air dt·7 (was flat 10 — the "slides easily"), gust ground-shove 0.35→0.22. Harness both modes 0 errors (finish now 8.2s — both entries playing). Live at ?v=climb6.
9. **THIRD ROUND (cave walk-in, slope variety, Tibetan skyline)**: the yeti now WALKS INTO the cave at the end (stoops +5px, shrinks ×0.7, x drifts 300→342, swallowed at goneK 0.72; end at 5.6s); **THE SLOPE v2** = authored mountaineer's passage: 4 stairs up-right → LADDER (hold ↑ to climb, ↓ to descend, rails centre you; exits onto the top platform) → a **lashed LOG over a ravine** (plank ledge, crevasse walls drawn below) → 4 switchback stairs → second ladder → top gate; **background peaks are Tibetan now**: ridgelined summits with snow faces, PRAYER-FLAG GARLANDS strung pass-to-pass (8 faded lungta flags per line), a chorten on the pk-2 shoulder; **DEV KEY 'e'** (DSS_DEV only) teleports to SUMMIT−120 for ending checks. Another accidental global caught by the harness (`touching`, hidden behind a short-circuit — the two driver profiles disagree on held keys, which is exactly why both exist). Demoed LIVE in Sam's Chrome: blind-scripted the last ledges, summit reached, full walk-in played, lose span revealed. Ladder mechanic is code-verified + geometry-authored but NOT yet human-played — **Sam: play THE SLOPE start to finish.**

## ⚠ ADDENDUM 15 (2026-08-22, morning) — THE PYRAMID RUN (Sam: "a mario style platformer where you travel through tunnels into the pyramid" → "Yes, sounds lovely!")
1. **New passage `:: Pyramid Run` [dream pyramid]** (188 passages now), wired: Descending Corridor → "[[Down, into the dark, at a run|Pyramid Run]]" → win/lose spans both → Grand Gallery (fail-forward); win = `$pyramidRunWon` (stumbles ≤ 3 AND glyphs ≥ 4) → **MORALE +8 at King's Chamber** (mirrors the race's nod at the Centre). `$pyramidRunWon` in StoryInit.
2. **Engine: 2D canvas side-scroller with the bar-game's Sam-approved Mario dials ported verbatim** (gravity 600, jump −400, jump-cut 0.55, falling gravity ×1.8, coyote 90ms, buffer 120ms, pace 1.45/0.62, base 200). Three acts over 5200px: descending corridor (floor steps DOWN, 3 pits, 3 lintels to duck, 3 scarabs, 3 sand columns, torch checkpoints), **THE BALL at x2000** (rolling stone, rubber-banded 236±, must hold →; **it can be JUMPED** — vertical check; it seals the corridor at 3400 with a slam), **Grand Gallery ascent** (five 32px corbelled risers that are WALLS demanding real jumps, light growing to a gold flood).
3. **Collectibles**: 7 φ resonance glyphs (gold spirals glowing through the dark; several over pits and in the ball's runway — risk-priced). Darkness system: radial dark between torch pools (max 0.66), fades with `galleryLight`. Player is a dark-coat SILHOUETTE (house rule: never depict the player) with run-cycle legs, lean, duck squash, invuln blink.
4. **Mercy valves** (found by the harness's zero-input run): 3 falls into the same pit → **sand fills it** ("The pyramid is bored of you."); walled at a riser 5s → teach banner ("Hold ↑ to jump higher."), 12s → auto-lift ("The stone lifts you, unimpressed."). Both verified firing.
5. **Harness-verified** (2D variant of the jsc harness — pyr_harness/pyr_driver in scratchpad): jumper mode finishes in ~22s/5 stumbles (lose), zero-input mode finishes ~127s via both mercy paths, **0 errors both**. TWO REAL BUGS CAUGHT PRE-SAM: (a) the floor-snap silently teleported the runner UP the gallery risers — no jumping needed (un-Mario); risers are now true walls; (b) the ball hit you even mid-jump — now jumpable. Live page renders (passage + corridor art seen in the pane before it went document.hidden again).
6. **Sam's morning list for the Run**: play it — judge the corridor art in motion (torch flicker, darkness, ball), the glyph placements, win threshold (stumbles ≤3 / glyphs ≥4 — both one-number dials), and whether ~25-40s length suits. All prose pink. Dream-world minigame ledger: Nazca = the race, Pyramid = the run; Himalayas/Easter open (mantra-rhythm and moai-memory pitched, no ruling); **Ezekiel deliberately gameless (the vision seizes you) — agreed with Sam 2026-08-22.**

> **State at handoff (2026-07-30, overnight — Sam asleep, the big Fable session):** ADDENDA 13–13g cover it all. In one night: cosmicSewerSuck stretched to 5.6s; the gents-replay edge diagnosed (back-button only, left by ruling); **COACH APPROACH RENOVATED** (toolkit skins, lit gas lamps via AdditiveBlending, the drinker outside); **LACKLAND'S RETEXTURED** (+ Lackland himself at the working window, page turns); **GINGER LIGHT polished** (visible lit rooms, glazed band on the dead wall); Pillars kerb-line CONFIRMED dead at full rate; **WALTZ deep pass** (visible Cecil Court, waltzing shadow pair in 3/4, gilt medallions); **PONG's tabletop became a pub table**; **BAR-GAME CARRY IS CLASSIC MARIO** (variable jump, asymmetric gravity, coyote+buffer, pace control, native touch); **SKETCH THE PAINTER pimped** (napkin materiality, felt-tip ink both engines, stroke-by-stroke reveal); **STATS BAR reworked** (powder line + SVG rolled note, pencil-jotting percentages, lily-bell Alba marks, bigger labels; OPUS-gold regression caught and fixed with `:not(.bar-opus)`). Fight/cow left at standard by assessment; CP left deliberately. **Commit = 2 files: .twee + .html — NOT yet committed; Sam commits via GitHub Desktop when he wakes.**

> **▶ NEEDS SAM'S EYES (morning list):**
> 1. **The full human-paced playthrough** — still the most valuable item, now carrying everything above.
> 2. **Coach approach renovation** — his first look; give the drinker's ember 15s.
> 3. **Waltz** — watch one run hands-off, then play one.
> 4. **Carry-phase Mario feel** — jump-cut factor 0.55 and fall gravity 1.8x are one-number dials; test hold-jump on his PHONE (native touch is new and only code-verified).
> 5. **Stats bar** — powder line, rolled note, bells, jotted numerals; plus Lackland's red windows and the Sketch reveal.
> 6. Ears-check: the 5.6s cosmicSewerSuck against the drain travel on a real crash run.

## ⚠ ADDENDUM 13 (2026-07-29, evening) — SFX stretch + GL/LO/CP audit + COACH APPROACH RENOVATED
1. **cosmicSewerSuck now 5.6s** (was 3.5): `DUR = 5.6` (~line 3030); whoosh/rumble ramps scale off DUR automatically; bubble pops re-spread `[0.5, 1.4, 2.4, 3.5]` (4 pops); splash moved to `DUR * 0.82` ≈ 4.59s so it lands on the travel's froth punch-through (3.6–4.6s window). NOT yet ears-checked (needs a real crash run with sound).
2. **Gents-replay edge RESOLVED BY DIAGNOSIS (no code change)**: there is NO forward link back into the lock — the bar's only roads are the cow scene and the ring blocks, and `_dualRing` requires `$hadDualRing is false` (impossible post-crash). The replay only fires via BACK-navigation from the bar re-rendering the lock with `$crashedAfterDualRing` still set (it's cleared by Retch). Sam's ruling implied leave it: it's a back-button artifact, not a road.
3. **GL/LO/CP audit shortlist (report given to Sam; NOT actioned)**:
   - **GL (decent)**: warm lit windows + swaying drinker silhouettes exist in code but read nearly invisible (warmGlass emissive 0.10–0.14) — boost or accept as deliberate dark; the near right-side wall is a black void for a third of the frame (could take one faint detail); living element is ambient only (chimney smoke + silhouettes), no discrete creature. NO RAIN (vetoed).
   - **LO (weakest)**: facade/neighbour materials predate the toolkit — flat MeshStandard colors (darkStucco/sootBrick/darkBrick/redBrick/greyStone/whiteStone ~line 22 of its material block), reads clean/plastic vs reviewed scenes; the upstairs red-light window is a FLAT saturated pane vs the Pillars "dressed room tinted red" standard; living = working-light flicker + window silhouettes (ambient only). Ground-floor net-curtain windows fine. Retexture candidate when Sam wants.
   - **CP (strong, leave)**: constellation web reveal (drama-then-fade) over the honeycomb tower + snow + CLIMB IT — deliberate abstraction, consoles clean, no action needed.
4. **COACH APPROACH RENOVATED** (kept layout/lifecycle/banner; renovated skins + light + life):
   - Toolkit materials wired through the EXISTING variable names (creamWall/darkCream→weathered stucco, blueBrick/redBrick→grimy brick, roadMat→grimy road, pavementMat + the kerb-level paveMat→paving slabs) so all downstream geometry reskinned without touching it. Custom `chRedPaintMat()` — painted-timber red with board joints, chips, rising street-grime, cornice soot — for redFacade/brightRed.
   - **Streetlamps = toolkit createVictorianGasLamp** ×3 (same spots), decay 2 dist 30 int 2.2, organic per-lamp mantle flicker in animate.
   - **THE LANTERN-GLOW SAGA (three findings, remember these)**: (a) the toolkit lantern's L/R panes are single-sided planes with INWARD normals — from a three-quarter camera the head reads unlit; fix = material.side DoubleSide via traverse. (b) CH's mid-height fog sprite layer at 0.15–0.30 opacity stacked 3–4 deep in the camera corridor and washed the head to grey — now 0.07–0.15. (c) THE REAL KEY: the halo/core sprites use normal alpha blending — over a dark scene a near lamp spreads its light over 10× the pixels and mutes; **fix = THREE.AdditiveBlending on the glow sprites** (+0.25 opacity, plus a solid emissive core box seated in the cage). Verified lit from the real camera. Consider the same additive treatment if any other scene's lamp reads dead.
   - **Upper windows now DRESSED** (makeDressedWindow via addWin lit param; 3 lit of 14) — the old build lit every pane with warmGlass, flattening the storey. Dead `.tap` addUpperWindow function removed.
   - **pubGlow1/2 moved OUTSIDE the facades** (they were buried inside the building mass, facing the facade BACKS — same family as project_buried_plane_bug); now int 2.6/2.4 decay 2 + animate loop updated to match (gotcha: the loop overwrites constructor intensities every frame — change BOTH).
   - **Coach lanterns** flanking the door (brass cage + emissive core + 0.55 lights, gentle waver) + **hooded shop lamps** ×2 over the Romilly fascia.
   - **LIVING ELEMENT: the drinker outside** — canvas-silhouette regular (flat cap, coat, pint at the hip, cigarette hand up) leaning on the Greek St wall at (0.55, 1.11, -4.35); cigarette EMBER sprite flares on an irregular 7–14s drag cycle; 3 recycling smoke wisps rise off it. `userData.noShadow` guard added to enableChSceneShadows (a textured plane otherwise casts a solid RECTANGLE shadow).
   - wetRoad sheen got a radial alphaMap (its 20×20 plane edge was a hard straight line across the tarmac); exposure 0.55→0.62; warmGlass emissive 0.55→0.8.
   - Verified live: lamps lit, textures reading, ENTER routes to the lock with no spurious drain travel, console clean. Sam has NOT reviewed the renovation yet — his pass is the next step, and the drinker/ember needs a long look (flare cycle is slow).
5. Shelved by Sam tonight: `$completedSetlist` hardening (debug-jump-only artifact — real players can't hit it; keep debug for testing, gate `DSS_DEV` before release as already planned) and the `$refusedCalls` Dawn line (declined outright).
6. **Uncommitted: .twee + .html** (everything earlier was committed as of tonight's session start).

### 13b — same evening, the initiative round (Sam: "take the initiative and fix things")
1. **LO RETEXTURED**: all the flat facade/neighbour materials swapped to toolkit (creamStucco/darkStucco/whiteStone→makeWeatheredStucco; sootBrick/darkBrick/redBrick→makeGrimyBrick, with fallbacks). **Both red-light windows are now DRESSED ROOMS tinted red** (`redRoomTex` ~line 22610: drapes bunched at the edges, shaded lamp burning low off-centre, pelmet shadow, glass grime — MeshBasicMaterial, the Pillars standard); the red PointLights kept. Verified live: reads as a real room now.
2. **LO LIVING ELEMENT: Lackland at the working window** (2.2, 5.5 — first floor right): seated silhouette bowed over the desk (anglepoise hint at left), breath cycle, and a pale PAGE that lifts/flips every 16–26s (O'Flatterly dealer pattern; state machine `loPageState` in animate, dt-driven `loLastT`). Sits behind the existing wFlicker1F working-light so the silhouette breathes in and out of visibility. NB LO sets castShadow per-mesh (no blanket traversal) so the figure planes are shadow-safe without a guard.
3. **GL POLISH**: warmGlass pulse base 0.10→0.34 (the lit rooms + swaying drinker silhouettes were invisible — the audit's top GL nit), winGlow1/2 raised (0.42/0.28 base); the near-black east shopfront got a proud glazed band (0.02 thick at x=3.93, NEVER buried — the shopfront face is at 3.955) + stall riser that catch the ginger wash. Verified live: the terrace reads occupied, the right mass has a readable surface. NO RAIN (standing veto).
4. **PILLARS KERB-LINE CONFIRMED DEAD at full rate** (the Addendum 6 §3/7 §5 open verify): watched the flood to ~90s live — pool, gutter tongue and chop all end in ragged blob edges; no straight terminator anywhere. Item closed; nothing to fix.
5. All verified in preview (?v=n cache-busts), consoles clean throughout. **Commit remains 2 files: .twee + .html.**

### 13c — THE MINIGAME ROUND (same evening; Sam: "do that to each of the minigames")
Recon of all five first; effort went where the gap was. **Mechanics/scoring/timing untouched everywhere — drawing only.**
1. **WALTZ (the never-sharpened one) — full atmosphere pass**, respecting its design ("the dance is the point, not the score" — no score UI added):
   - **Cecil Court made visible**: dark terrace wall wedges converge on the vanishing point; **lit shop windows scroll past in world time** and take the colour of the pool they cast — the coloured pools finally have sources. Windows use scrollTime (decelerate with the ground at the end — world-fixed, correct).
   - **The waltzing pair as SHADOWS**: two long soft shadows cast up the street from behind you, swaying in 3/4 (bar-phase sine + 3-beat lift) — the dance embodied without breaking the first-person walk or adding characters.
   - **Gilt medallion notes** (parchment radial + gold rim + inner ring; missed marks smudge to a spread chalk ghost at 0.14 alpha); **target rings breathe in 3/4** (deeper swell on the ONE); **dead-on hits (≤80ms) earn a trailing second ripple + 16 sparks** (quiet acknowledgement, no text). NB drawRipples got an `age < 0` guard for the trailing ring.
   - **Verified end-to-end live**: full 32s play with hits, ended, auto-routed to Approach O'Flatterly (the hidden-link nav worked even debug-jumped).
2. **PONG — the tabletop became a table**: pre-rendered `_felt` canvas (felt mottle, pale wear at both paddle ends, TWO DRINK RINGS + a cigarette burn — a Soho back room), real boundary markings, hanging-lamp pool (radial warm), net shadow thrown right, **ball trail** (7-frame comet, cleared on serve) + **cast shadow** under the ball (it rides above the baize). Paddles/glow untouched. Verified live mid-match + one full match ran to DEFEAT and routed clean.
3. **FIGHT / COW / BAR — assessed at standard, deliberately left alone**: fight verified live tonight (practice rounds, Copper art, cues all healthy); bar had its showcase pass 3 days ago (12c/d); cow sharpened twice recently. No changes — gilding risk without reward.
4. Consoles clean throughout. Commit still 2 files.

### 13j — LAST-MINUTES TICKS (session close)
1. Napkin popup engine: could not launch live on the fresh test save (needs the napkin flag) — but it shares the verified `inkSegment` code and the UserScript parsed clean all night. Residual risk: minimal; Sam's "Work on it" click is the true test.
2. **Pong verified at 375px**: scales clean, BALL TRAIL confirmed rendering mid-flight, softened drink rings read right, score plate intact.
3. Session ends with consoles clean everywhere touched. **Commit = the same 2 files.** Goodnight from Fable.

### 13i — THE THIRD OVERNIGHT FOUR (Sam: "be ambitious")
1. **Notebook regression-checked + napkin Effect verified**: no leakage from tonight's shared-CSS changes (the notebook's typewriter styling is independent); the saved napkin renders in EFFECTS with full new texture (deckle/folds/wine ring) + "Work on it" intact.
2. **FIGHT ARENA BACKGROUND PASS** (drawing only, in FightGame.draw() before drawCopper): the cellar is a ROOM now — hanging bare bulb on a cord at W*0.32 that swings idly and KICKS with every landed hit (`_swayAmp` fed by shakeMag, decays 0.985/frame; its light pool sways with it), damp stains on the brick, floor band + skirting line, corner vignette, and **THE RAT watching from the bottom-right skirting** (slinks out/back on a slow sin cycle, tail curls, one amber eye pin — continuity with the approach scene's rat). Verified mid-fight live.
3. **Fresh-boot functional walk of the opening**: cleared storage → title ("by Three Blue Posts") → BEGIN → night intro (header live, +70 deltas, 15 TURNS LEFT — correct off-by-one) → Approach The Ginger Light (NB: the opening's first beat is the Ginger Light, so THE GINGER CAT greets the player in scene one) → Red / LINE 1 prose intact. Consoles clean the whole walk.
4. **Memory bank**: three new project memories — additive-blending glow fix, the napkin's dual engines, the Mario carry dials — indexed in MEMORY.md for future sessions.

### 13h — THE SECOND OVERNIGHT FOUR (Sam: "repeat the last process")
1. **THE GINGER CAT** — the Ginger Light's living element at last: seated ginger silhouette beside the phone box (Trisha's-cat manners: breath, jointed-tail sweeps, slow head turns between street and box, amber eyes that blink out; dark ear/tail-tip accents). Built after the phoneGlowLight block; animated before the WARM GLASS PULSE section. Verified rendering in the lamp pool.
2. **Waltz world-sync bug fixed**: drawPools used raw `elapsedMs()` while the cobbles/windows use `scrollTimeAt` — in the final 2s deceleration the pools slid past a stopped world. Pools now ride scroll time. Verified live, console clean.
3. **Carry input-stick hygiene**: window `blur` clears jumpHeld (via `_playerJumpRelease`), speedHold, and duck — alt-tab mid-hold no longer leaves controls stuck.
4. **Coach shadow cost capped**: only the near lamp (7,4) casts shadows; the two far gas lamps skip their point-shadow maps (moon still casts). `createLamp(x, z, castsShadow)`.

### 13g — THE OVERNIGHT FOUR (Sam asleep; his pre-sleep list)
1. **Native touch for the carry phase**: touchstart/touchend/touchcancel on the bar canvas mirror the mouse handlers for BOTH phases (pour hold + carry hold-jump/jump-cut), preventDefault kills synthetic-mouse latency — the cow-ride pattern. Code-verified only; needs a real phone thumb.
2. **OPUS REGRESSION CAUGHT + FIXED**: the new powder-line fill selector out-specified `.bar-opus` — at 12/12 haunts the morale bar would have gone chalk-white instead of gold. Fixed with `.bar-fill:not(.bar-opus)`; verified live by class injection (powder for normal, gold escapes).
3. **Cosmetic dials**: napkin deckle thinned (r 1.1+*2.1, was 1.5+*3.2 — postage-stamp read gone, verified); pong drink rings dropped to 0.065 alpha.
4. This consolidation. All synced; consoles clean; commit still the same 2 files.

### 13f — SKETCH THE PAINTER PIMPED (Sam: "it's simple atm") + stat-label size bump
1. **Napkin materiality** (shared `drawNapkinBase()` — factored out of drawBackground/drawCleanNapkin): quilted emboss dot lattice, quartered fold creases with soft shading, a WINE RING bottom-right (the glass was here first), deckled/pinked edge (fixed `deckle[]` wobble table so Clear/Undo redraws keep the same edge). The canvas sits tilted -1.3° on the table and straightens as the frame lands (`.napkin-framed` → rotate(0)).
2. **Felt-tip ink**: `inkSegment()` = faint 2.3× halo soak under the solid core (no halo for the eraser); line width rides pen speed (slow = heavier, fast flicks = lighter; ×0.75–1.3), recorded PER POINT so undo/replay keep the exact character. Pen-nib cursor (SVG data URI, hotspot at the tip).
3. **THE REVEAL**: on Done the ghost vanishes and the sketch REDRAWS ITSELF stroke by stroke on the clean napkin (`animateReplay`, ~0.9–2.2s scaled to stroke count, `document.body.contains(canvas)` nav guard), THEN the frame lands + camera shutter + localStorage save (save now happens AFTER the redraw so the notebook PNG is complete). Fade/nav timings unchanged after that.
4. **BOTH engines upgraded**: the passage (~42986) AND the notebook "Work on it" popup (UserScript ~4400s) share the same ink; the popup paints over the saved PNG so consistency holds. NB the two engines are near-duplicate code — anchor edits by `updateButtonStates` (passage) vs `updateButtons` (popup).
5. Verified live end-to-end with synthetic strokes: texture renders (tilt, deckle, ring), Done → animated redraw → frame → shutter → fade → lands on Sam's "You slide the napkin across the table." passage. Console clean.
6. Also this stretch: **stat-labels bumped** (MORALE/SOBRIETY 0.65em→0.8em, label column 68→80px, margin 14→6px — Sam: "a bit too small"), verified desktop + mobile.

### 13e — BAR-GAME CARRY PHASE GOES CLASSIC MARIO (Sam: "work a bit like classic mario")
All in the carry phase of `window.BarGame` (~lines 4934-5760); pour phase, wobble/lives economy, obstacle spawns and collision rules untouched.
1. **Variable jump height**: tap = ~34px hop, hold = full ~95px jump (`_playerJumpRelease` jump-cuts velY×0.55 while rising; keydown guards `e.repeat`). Mouse taps and holds behave identically (mouseup/mouseleave release).
2. **Asymmetric gravity**: falling gravity = 1.8× rising — floats at the peak, lands with weight.
3. **Coyote time (90ms)** + **jump buffer (120ms)**: late jumps after walking off a step still fire; a press just before touchdown fires on landing.
4. **Ledge walk-offs**: a terrain step DOWN now drops you into the air (was an instant snap-teleport to the lower ground); coyote covers the late jump.
5. **Pace control**: hold RIGHT/D = 1.45× scroll, LEFT/A = 0.62×; `runLean` smooths a forward/back sprite lean (0.16 rad max in `_drawPlayer`). Design note: hanging back over a WIDE gap can make it unclearable (airtime ~1.09s vs crossing time) — intended Mario logic, you must run at the big gaps; the pit bounce-out already handles failure.
6. Balance verified numerically in live harness (forced `phase='carry'` after `startBarGame()`): tap 34px still clears low obstacles (collision counts you airborne at >15px); full-jump airtime clears max-width gaps at all normal speeds.
7. Teaching updated, full sentences, no em dashes: pre-bar plate control lines ("↑ Jump, and hold it for a higher jump · ↓ Duck" / "Hold → to hurry · hold ← to hang back · Mind the gaps") + the carryWait "Get ready" screen.

### 13d — STATS BAR round (Sam approved items 1-3 of 4 proposed; item 4 "ledger panel" skipped)
1. **Morale is no longer a second cigarette**: the row had inherited the cigarette's paper fill, ash base AND the ember + smoke wisp (generic `.bar-fill::after/::before`). Now scoped `.stat-row:first-of-type` overrides: granular chalk-white powder line (speckle radials + alpha-faded top/bottom edges) on a smoked-glass strip (dark mirror with a diagonal sheen); ember + smoke `display:none` on morale — they belong to SOBRIETY only. The rolled-banknote tip untouched.
2. **Percentages are pencil jottings**: `.stat-pct` → graphite (#a89f8c), Georgia italic, `rotate(-3.5deg)`, 0.9 opacity. The gain/loss flashes and the danger-red `!important` override still land on top. OPUS colour path untouched.
3. **ALBA diamonds → lily-of-the-valley bells**: `.alba-jewel` is now a data-URI SVG bell (scalloped hem, stem hook) — hollow ink outline uncaught (0.7 opacity), ivory-gold filled + `alba-bell-breathe` drop-shadow glow when caught. Class names unchanged (the wheel-reveal JS at ~13344 that toggles them is untouched); old `alba-jewel-breathe` keyframes fully replaced, 0 stale refs. Ties the Alba to the header lily + Dawn sprig.
4. Verified live: hub at desktop + 375px mobile (all rows fit, nothing clipped), filled-bell state test-injected via JS and confirmed glowing. **The header lily untouched (standing rule).** Commit still 2 files.
5. **Rolled banknote redrawn as SVG** (Sam: "make it look more like a note"): the `.stat-row:first-of-type .stat-bar::before` gradient blob replaced with a data-URI SVG — coil spiral visible at the open left end, engraved print lines, red portrait band + oval frame hint, diagonal wrap seam, drop-shadow instead of box-shadow. Verified at the hub.

## ⚠ ADDENDUM 12 (2026-07-23, late evening) — DRAIN TRAVEL REBUILT + Coach split + SOUND IS BACK ON
1. **SOUND IS ON**: `DSS_SOUND_OFF = false` (~line 333). Mute persists via localStorage `dssMuted2` — the sticky toggle is live. NB `cosmicSewerSuck` is ~3.5s vs the now-5.6s travel; consider lengthening the SFX (Sam's call).
2. **The drain-travel animation (coach-plumbing-intro) fully rebuilt as a SMIL one-shot** (~5.6s, was a broken 3.6s CSS build): suck (drain grate recedes 0–0.9s) → barrel (14 pipe-joint rings, wall specks, droplets, sloshing pool, 0.75–4.3s) → **kaleidoscope held beat** (pastel petal wheel + counter-ribbons, 1.7–3.4s) → surface-break (light through water, caustics, bubbles, meniscus sweep, froth punch-through 3.6–4.6s) → porcelain bloom (bowl opens concentrically, screen bg blooms white in sync via the fade keyframes, 4.55–5.3s). All SMIL — the old CSS-on-SVG transform-origin bugs are structurally gone. Self-removes at 6.1s. Registered in `dssOverlayBusy` AND the stat-delta `up()` list (was in neither — popups could fire over it).
3. **THE GATE WAS WRONG AND IS FIXED (Sam's correction)**: the travel plays on the **dual-ring crash arrival** (`$crashedAfterDualRing is true`, cleared by Retch) — the second phone call hurls you through the plumbing. It is NOT a first-visit-ever effect; `$seenCoachPipe` deleted everywhere (that once-flag was being consumed wrongly and the animation never played). **Verified live on the real crash path** (porcelain bloom screenshotted mid-flight). Known edge (Sam aware): re-entering the gents from the bar before Retching replays the travel.
4. **Coach passage split (Sam's request)**: "Coach and Horses lock" = the CUBICLE (intro, come-to prose, Retch variants, crisis sleep-here) → link "[[You gather your limbs to the bar.|Coach and Horses bar]]" → NEW passage **"Coach and Horses bar"** [venue-coach] (ring temps recomputed at its top, Lily/dual-ring blocks, Bernard cow scene, haunt, Ride link). Call-returns still land at the lock. 142 passages now.
5. Bernard quote fix (Sam): closing mark after "way out." removed (speech continues across the paragraph).
6. **Testing gotchas confirmed hard this session**: the preview pane serves STALE builds on plain reloads (?v=n busts the fetch; the boot hook then hides the query from the URL — it still worked); debug-jump sessions half-init and double-render (the jump replaces Start's content with a (go-to:)) — test via real link navigation. To see the travel: jump "The dual ring", wait out the 40s crash (or Hang up at 28s).
7. Uncommitted with the rest: .twee + .html (+ the two statics from Addendum 11).

### 12c — RONNIE SCOTT'S BAR GAME PIMPED (2026-07-24 small hours, Sam: "pimp it up")
**POUR PHASE (was the weakest visual in the game — flat sprite bottle, no stream, floating glasses):** now a real bar. Back-bar shelf with ten ranked bottle silhouettes + mirror glow + brass shelf edge; spotlight cone breathing on the working glass; mahogany counter (grain + brass top edge) that EVERY glass actually sits on (per-type gy offsets: tulip 230 / copper 269.7 / rocks 282.7 — the transform scales about (gx,230), bases meet counter y=372); liquor-tinted reflection pool under the glass. The bottle rests on the counter and LIFTS+TIPS over the glass while pouring (pourStream-eased pivot+rotation); a proper arced stream (liquor-coloured core + pale highlight + wobble) lands with a splash crown; spray drops + Mule bubbles now spawn at the real surface (`this._surfY`, set each frame — the old bubbles drew OFF-CANVAS, never visible). Target band: gold-etched centre line + flanking chevrons + brighter pass/perfect zones. NEW: overfill spill (rivulets down the glass + spreading counter puddle, `this.spill`) and a perfect-pour gold ring flourish (`this.perfectRing`). Completed-drinks sidebar restyled walnut+gold.
**CARRY PHASE:** HUD rebuilt (rounded panel at 10,10 — the old one clipped at the canvas edge; lost glasses show red X); glass-loss now kicks (screenShake 1.6/1.3 + red hitFlash vignette); landing dust puff (frame-level airborne→grounded detect, `_wasAirborne`); ground shadow under the player.
**Testing gotcha:** the arena only renders when `(if: $completedSetlist is false)` — debug-jump half-init can leave it 0 ≠ false → NO game in the passage. Test harness: inject sob-data-bar/pre-bar/bar-round-display/bar-canvas/bar-narrative/bar-end stubs + `startBarGame()` (worked perfectly). Consider the `not (... is true)`-style hardening for $completedSetlist someday.

### 12d — carry-phase mechanics round (Sam's bug report + "I trust you")
1. **Rubber-duck BONK bug (Sam caught it)**: the duck+stagger only fired on `isHigh && playerJumping` — plain forgetting to duck took the silent wobble path. Now ANY high-obstacle hit = bounce-back 100px + stagger 0.9s + the duck (verified live — screenshotted mid-BONK). Gameplay note: standing hits no longer ghost through under invuln; you retry the obstacle. Wobble economy unchanged.
2. **Pit rebuilt for feel**: depth 62→88 (visibly swallowed), bottom-impact screenShake 1.0 (was audio-only), bottom beat 0.06→0.12s, kick -560→-640, player alpha-fades toward black with depth (in _drawPlayer), and on exit the scroll advances to the FAR LIP of the gap (`obs.x + obs.width - 94`, killing the invisible-floor walk) + landPuff scramble dust. Verified: gap.hit set, far-lip advance applied, no console errors.
3. Sam's prose: "The pianist has a long and sculpted face..." (was "There is a pianist with...") and "Says Moe:" (was "Says one:").

### 12b — same evening, later (all Sam-approved "Love it!")
1. **Travel slowed to ~5.6s** (was 4.2): rings 1.15s each over a longer window, 4 streak passes, kaleidoscope held 1.7–3.4s; fade 5.6s; self-removal 6.1s. **Born-opaque fix**: the overlay's 0%-opacity fade-in let the cubicle flash through before the pipes — it now starts fully opaque.
2. **Dual-ring closing lines fixed twice** (Sam): the two Salley Gardens lines are speaker-formatted AND alternate — "…as the grass grows on the weirs," = YOU (lily-phone-you), "But I was young and foolish." = LILY (lily-phone-her). Lily gets the last word.
3. **Retch is a side-action**: all three cubicle Retch links wrapped in `.gents-side-action` (centred, italic Crimson, sage #9aa08a, ⟡ marks via ::before/::after) — reads as a thing you might do, not a road. CSS lives after the coachPlumbFade keyframes.
4. **SpewPopup art rebuilt** (mechanics untouched: hold/auto-finish/audio/teardown): 2x backing store (320×400 @ 160×200 CSS, setTransform scale 2). GENTS = tiled wall + dado + high-cistern chain + shaded porcelain bowl + solid kneeling silhouette w/ retch-lurch + stream ripples + fouling water. DOORWAY = real doorway at last (was absurdly the same toilet bowl): brick jambs, boarded recess, step, lamp side-light, coated figure from behind, stream to the door foot, climbing wet mark, spreading shimmering puddle + street-bound trickle at high level, steam wisps. Mode-aware particle spawns + `this.ripples`. NB there are TWO identical `_draw() { var c = this.ctx, W = 160...` headers in the twee (another popup shares it) — anchor edits via the unique `window.showSpewPopup` end-marker and rindex backwards.

## ⚠ ADDENDUM 11 (2026-07-23, evening session) — queue items 1+2 done + window dressing everywhere
1. **Storm-door weather ladder shipped** (post-critic Pillars block, Sam's prose): base line (visits ≤2) → "Outside, the flood is serious, hard to parse..." (3–4) → "Lamps are going out all over Soho..." (5) → catch-all for ALL visits 6+: "'Water, water everywhere. Another drop to drink.'" (Sam's ruling: the Coleridge line is its own tier, NOT attached to tier 3). `$pillarsVisits` init moved ABOVE the ladder.
2. **Percy wager line shipped** (Watch the decider): taking "Put a score on it" now renders, under the £20 DOWN note: "Percy Ritson looks at the note, then at Jack. 'Now it's sport.'" Verified live (NB: real clicks on the link are swallowed in a debug-jumped copy — the documented artifact; synthetic click proved the macro).
3. **Window dressing applied to every scene that lacked it** (Sam's note "apply window dressing to all parts"): Coach neighbour buildings (12 panes → makeDressedWindow, one lit each), Chippy non-brothel upper sashes (5 panes), cecil-court-3d-static.html (local port of the painter — iframes can't reach dssScene; ~16% lit), green-sea-3d-static.html (Mediterranean idiom: lace half-curtains + oil-lamp amber, NOT London drapes; taverna ground floor warm, one lamp per side building). Checked + left alone deliberately: Centre Point honeycomb, Oxford Street dawn (own systems), Copper/Trisha (no windows). All four verified rendering, consoles clean.
4. **Commit = FOUR files**: .twee + .html + cecil-court-3d-static.html + green-sea-3d-static.html.
5. Queue remainder: Sam's full human-paced playthrough (item 3, his run).

## ⚠ ADDENDUM 10 (2026-07-23, last) — THE GREEN SEA PASS + final O'Flatterly touch
1. **The Green Sea approach** (`green-sea-3d-static.html` — a SEPARATE FILE, not built by sync; MUST be committed alongside the .twee/.html pair; the iframe src now cache-busts with Date.now()) got its full pass, all Sam-directed:
   - **Dusk**: mauve sky (0x453050), low gold raking sun (-9,7,13), violet ambient, lanterns doubled to primary, warm doorLeak light at the threshold.
   - **The trippy blobs KEPT AND AMPLIFIED (Sam's explicit direction — never botanise them)**: the original plantSprites carried sway params that were NEVER WIRED into the loop — now wired (float/bob/opacity shimmer) + 9 loose drifter blobs crossing the court + **sea-light caustics** breathing on the whitewash (3 additive shimmer bands — the beach present as light).
   - **Sea-worn textures**: walls (flaked patches, salt bloom, rising damp, cracks — makeSeawornTex), floor (stains/wear/grit), sign (salt streaks, paint flakes, worn border, damp corners).
   - **Furniture rebuilt**: slatted ladder-back bistro chairs (raked rear posts, splayed legs) + pedestal tables with lip rims and 3 splayed feet — the old box-slab furniture is gone.
   - **LIVING ELEMENT: cat chases mouse** in a figure-8 round the court — mouse leads, cat runs the same parametric line 0.5 behind; speed = max(0, sin(t·0.33+1)·0.9+0.45) gives bursts + stand-offs (mouse trembles, cat sits, tail sweeps); **fluffy 6-sphere tail w/ lighter tip**; they **hop the kerb onto the pavement platform** (chaseY: platform top y=0.1, kerb z=4.2, smoothstep + hop bump) instead of clipping into its side.
   - **Door**: the ajar/hanging experiment was REVERTED (Sam: it loses the decoration) — both studded leaves closed as designed.
2. **O'Flatterly final touch**: the fascia apostrophe in O'FLATTERLY is **flipped 180° (a teardrop)** — drawn per-glyph with save/translate(x,30)/rotate(π). Sam: "perfect". The name weeps over its own door.
3. GIFs for sharing in ~/Downloads: `trishas-entrance-cat.gif`, `the-green-sea-dusk.gif` (1fps samples).
4. Sam committed mid-evening; everything after (jeopardy round tail, bookshop, Green Sea, teardrop) may still need a commit — check GitHub Desktop.

> **▶ SAM'S QUEUE (updated 2026-07-24):**
> 1. ~~Storm-door weather variants~~ **DONE** (Addendum 11 §1 — four-tier ladder incl. the 'Water, water everywhere' catch-all).
> 2. ~~Jack/Percy acknowledging the score~~ **DONE** (Addendum 11 §2 — Percy: "Now it's sport.").
> 3. **THE FULL HUMAN-PACED PLAYTHROUGH** — still unwalked since the Dawn Clock; now carries the drink spiral, pong wager, priced crossing, refusal economy, AND the new drain-travel/Coach-split/bar-game changes on top of the 16-turn maths. His run; the most valuable remaining item.
> 4. Open offers on the table: lengthen `cosmicSewerSuck` to cover the 5.6s travel; drain-travel replays if you re-enter the gents before Retching (Sam aware, unruled); Green Sea lace opacity if it reads too bright.

## ⚠ ADDENDUM 9 (2026-07-23, late) — O'FLATTERLY'S BOOKSHOP FRONT (the last naked venue dressed)
1. **New 3D approach scene** "Approach O'Flatterly" (UserScript, `of-` prefix, standard lifecycle) — **Marchpane at 16 Cecil Court is the reference** (Sam supplied the photo). Night court: racing-green timber front on grimy London-stock brick (toolkit makeGrimyBrick), gold letterspaced fascia **I. O'FLATTERLY / DEALER IN BOOKS / 92-94** both ends (Sam's number), green scalloped awning over the window only (stained canvas), glazed door LEFT blazing amber, window packed with shaded/leaning book spines + lying stacks + composed prints, bench of three crates of browsing stock, hanging I.O'F monogram sign (swings; monogram slightly crowded — OPEN NIT), worn dark cobble setts + studded coal plates, dust film on all glass, full-front mottled filth + paint chips, drips down the fascia. Button: "ENTER O'FLATTERLY'S"; caption "CECIL COURT, WC2".
2. **Living element: the dealer himself** behind the door glass — silhouette at the counter, never looks up, pale page turns every 16-26s, breath + head-settle. **The interior amber PULSES strongly** (Sam's direction): MeshBasic interiors don't respond to light — the pulse is driven by scaling the backdrop materials' color per frame (ofDoorBack/ofDisplay setScalar), plus the point lights.
3. **Routing**: ALL FOUR waltz exits (onward div, timeout bail, Result Up, Result Down) + the hub's "Return the page" now pass through the front; it forwards by state (`$hasMissingPage and not $returnedPage` → introduction, else → shop). The page-return road previously teleported hub→interior with no transition — the front repairs that. Interior "Great Ham sent me" link untouched. Post-quest the shop closes off as before.
4. Interior opening line changed (Sam): "The sign reads: I. O'FLATTERLY, dealer in books." → "This is I. O'FLATTERLY, dealer in books." (the 3D sign now does the showing).
5. GOTCHAS this build: a full-height door BOX hid the interior (glazed doors need stile/rail construction with an open aperture); bay wall strips between door/window/pilasters are easy to forget (the "weird gap"); cobble textures read as bathroom tiles unless setts are small (repeat 10×6.5) and dark (tone 58-84).

## ⚠ ADDENDUM 8 (2026-07-23) — FLOOD ESCALATION EXTRAS + THE JEOPARDY ROUND
1. **Flood escalation shipped and TUNED with Sam** (base system in ADDENDUM 7 §4c... actually §4c below): plus this round: **surface CHOP** (12 drifting glint-patch blobs churning the pool; count 4×(visit−1) capped 12, violence scales uncapped), **quicker lightning** (first strike 0.14s, second 0.26s — "they linger too long" fixed), **a streetlamp dies per return** (`phDoomLamps`: pavement lamps at visits 2+3, the big foreground lamp at 4, the pub's own lanterns at 5+6 — by deep visits the street is lit by windows + lightning alone; killed via traverse — panes darkened, halos hidden, `userData.dead` guards BOTH flicker loops or they resurrect). **GOTCHA**: the preview pane STRIPS query strings AND the boot hook replaceState-wipes the whole URL → `?phvisit=` never survives there; testing override = `localStorage dssPhVisitOverride` (dev-gated behind `window.DSS_DEV`; REMEMBER TO CLEAR — was cleared this session).
2. **THE JEOPARDY ROUND (Sam picked 3 of 4; the doorway-doze banked for later):**
   - **Pong wager**: "Put a score on it" (his naming, £20) in Watch the decider → `$pongStake`; PP Victory +20 morale ("£20 WON" note), PP Defeat −12 ON TOP of the existing lost turn. Timeout-concede settles too.
   - **Drink spiral**: ALL TEN drink links (3 pubs ×3 + the Stranger's round) now cost `8 + $drinksRound*5` sobriety and give `5 + $drinksRound*2` morale, `$drinksRound` resets on every Dean Street render — the price climbs glass-by-glass within a round, taught by the rising numbers alone (no prose needed).
   - **Priced crossing**: `$pillarsVisits` counter (increments in the real-entry charge block only — drink-returns excluded by the resume guard); from visit 3, 'I can walk on water' with sobriety <40 → +1 turn, −8 morale, `$stumbledCrossing` → Sam's shore line ("...haul yourself up on the shore like a regular Bond girl.") renders once at Carthage shore.
   - Banked ideas NOT built: doorway-doze (turn-for-sobriety press-your-luck).
3. **Debug-jump caveat learned**: jumped passages can render a STALE duplicate whose links swallow clicks without executing — verify interactions via the live copy or real navigation; stat-header changes are the ground truth.
4. Uncommitted beyond Sam's last commit: flood extras + jeopardy round + stumble line.

## ⚠ ADDENDUM 7 (2026-07-22) — THE CHOICE ROUND: real choices restored + THE CALLS ARE NOW THE SPINE
**All built with Dr Quill writing the prose live in chat; everything verified rendering; 138 passages.**
1. **Restored Pillars fork**: "Maritime interlude" now ALWAYS offers both [[Yes→Approach The Pillars]] and [[Seek the shore→The coast of Carthage]]. Early crossing verified safe: Green Sea/LINE 2 gated behind `$visitedPyre and $returnedPage` at Carthage shore; The Interval self-guards (fires early = Lily-stairs beat early, accepted).
2. **Pillars post-critic block** (was a "no more business" dead end): keeps that line, then Sam's weather line (runoff topping the KERB, lapping the threshold) → three-way choice: [[Get a drink at the bar→Which drink at the Pillars?]] / [['I can walk on water'→The coast of Carthage]] (the STORM DOOR — direct crossing, pub+shore in ONE lap, Sam ruled the bundling fine) / [[Back to Dean Street]]. NEW passage "Which drink at the Pillars?": **Stout/Porter/Mild**, house numbers (sob −8, mor +5), `$lastDrink` feeds popup+fight-dimming; popup got stout/porter/mild configs (dark liquors, cream heads; pint-branch conditions extended ×2); `$resumingFromCall to true` before the go-to return SKIPS the pub's per-entry −9 charge (verified single-charge live).
3. **Not-now deferrals** (cost-free, re-offer preserved): Watkins ("Not tonight. Back to Dean Street."), Stranger at the French ("Not now."→The French), Approach Shana ("Not yet."→Trisha's — **`$metShana` moved from Approach Shana render-time into "Shana Reads"** so declining doesn't close Trisha's on the hub), critic ("Not tonight."→Dean Street). NOT added at Chippy ("You're eating at the counter" prose contradicts) or Lackland's office (handover prose) — Sam may rewrite those someday.
4. **THE CALLS — refusable, and the verified win-gate chain**: Aoife answered → unlocks Lily ring (`$hadPhoneCall`) → answered → unlocks dual ring (`$hadLilyCall1`) → answered → crash → Coach crisis → cow → **LINE 3 grants alba3** → `_towerReady` → Alba Complete/White page. **The win state is unreachable without answering all three.**
   - **Aoife (Pillars, forced redirect REMOVED — now a body-ring choice)**: Accept (−9) / "I'm not here" (−4/instance, re-rings every Pillars entry; barman aftermath: "…wishes he wasn't paid to be part of this game. 'Not seen him,'…"). Hook `|aoifering>` + (replace:).
   - **Lily (×5 venues, identical blocks)**: ring text now "A phone rings, the barman answers it, then looks you in the eye and mouths, 'Lily'." (Sam: repeats verbatim on re-offers — the knowing lives in the barman, could be anyone ringing). Accept (−6) / "I'm not here" (−3; aftermath: "What would Lily want with you? You couldn't speak to her now, you are not ready.").
   - **Dual ring (×5)**: Accept (−7 → crash chain) / **"Turn and leave"** = THE FAIL-FORWARD: sets `$refusedDualRing`, → The Fetch (pitying grin) with **"Not yet. Back to the night." SUPPRESSED** (`not ($refusedDualRing is true)` — Harlowe warns on `is not true` after `and`, use `not (...)`) → Centre Point → Alba Incomplete → Black page. Refusable forever (Sam's ruling — facing up must be CHOSEN, no forced third ring).
   - **`$refusedCalls`** increments on every decline (inline num-guards for old saves; init in StoryInit + reset block). **NOTE (2026-07-23): the Dawn-spectrum prose was ABANDONED — the Dawn is numbers-only now (all .claude-draft branches removed by Sam; orphan CSS cleaned).** The counter is currently DORMANT — kept because it's free; candidate use: a cold "CALLS REFUSED: n" line in the Dawn's numeric record, Sam's call, unprompted.
4b. **THE FETCH APPARATUS (2026-07-22/23, all Sam-directed, all verified live):**
   - **The window glimpse** (passage "Fetch Window SVG", displayed in all 6 decline aftermaths when `$refusedCalls is 2`): leaded diamond lattice (Pillars spectral #8ac8dc language, tinted red/green cells), white mist, thin-man silhouette (NOT a roundhead — oval head/neck/sloped shoulders), thin pale lips on an irregular 1.7s mumble loop, 2.8s fade-in, caption folded INTO the SVG (fades at 3s): "At the window, a man with your face has stopped to stare in at you. He mouths, unmistakably: 'How many times do you want to pretend you aren't here?'" — NB "you aren't HERE" (echoes the "I'm not here" declines) and "At" not "Through".
   - **The street meeting** (passage "Fetch Street SVG", displayed at the top of "The Fetch"): ~20s one-shot, SMIL only, flattened line. Choreography: mist world + Centre Point slab + converging kerbs + one warm lamp; walk-in 0.8–6.8s (nested rigs: translate/scale/bob/turn/tilt; wet reflection travels under him); mutter from 1.6s THROUGH the lean; **lean 7.4s** (before the grin — Sam's beat); mutter dies 8.6; **the lips themselves morph into the smile** 8.9–10.5 (paths, not a new line; stroke widens); held to 11.9; **smile withdrawn back to resting lips** 11.9–12.9 (the mask going back on); turn (scaleX collapse) 13.0; recession to the tower 13.7–20 (front fog re-swallows, begin 14.2). Figure ALWAYS near-solid dark (opacity ≥0.8, blur 1.5) — distance is done with the two-plane fog (behind-band constant; front veil thins on approach — the front band once painted OVER him = "white band" bug).
   - **Timed captions in the street SVG** (his final text): "You see yourself walking to meet you." (2s) / "It looks at you with a shit-eating grin" (9.2s) / "then turns away and heads towards Centre Point." (13.4s) at y 266/282/298, viewBox 300×306. The passage's plain-prose copy of the line was REMOVED (lives only in the SVG + aria-label).
   - **Links gated behind the moment**: the haunt-12 box + [[Follow him]] + Not-yet block sit in `<div id="fetch-reveal" style="display:none">`, revealed with a 1.4s fade at t=15s by inline script. GOTCHA: do NOT guard with `window._passageGen` (it increments AFTER inline scripts run → the check always cancels); guard with `document.body.contains(el)` instead.
4c. **FLOOD ESCALATION BUILT (2026-07-23, the banked design)**: the flood never resets between Pillars visits. Closure vars in the PH scene IIFE (`phVisit/phCarryT/phThisT/phLeftAt`) — each visit's elapsed scene-time banks on dispose, PLUS the flood rises while you're away (wall-clock × 0.4, capped 80s/absence). The whole flood is t-driven, so carrying the clock fast-forwards pool/gutter/pavement-sheet for free. **Visit 2+**: crown agitation scales (amp ×1.45/visit, cap ×2.35), rim surge amplitude scales (×1.35/visit, cap ×1.7), and two slow blob-ripples work off the drain (BLOBS not rings — rings = straight lines at this camera). **Visit 3+**: lightning — double-strike profile every 12-30s (cool ambient spike + fog/sky colour flash + all water surfaces silvered via emissive), thunderClap scheduled ~1s later (honours the hard mute). **GOTCHA (shipped + caught)**: setting a material's `emissive` colour without zeroing `emissiveIntensity` (default 1!) silvered ALL water on every visit — always set intensity 0 at build when the effect drives it per-frame. **Testing**: `?phvisit=N` URL param overrides the visit count AND seeds a grown flood (v2→40s, v3→160s carry). Reload falls back to visit 1 (accepted). NOT yet paired with sound (DSS_SOUND_OFF) — when audio returns, the thunder is already wired.
5. Line-fix from 7-19 confirmed-ish: wetPave overhang was the "kerb line" (see ADDENDUM 6 §3); Sam not fully re-verified at full rate — worth one glance.
6. Uncommitted: all of the above — commit via GitHub Desktop.

## ⚠ ADDENDUM 6 (2026-07-19 evening) — living elements + the Pillars flood saga
1. **Living elements now in EVERY 3D scene**: Trisha's = seated black cat on the lower step (silhouette; tail/ears/head-turns/breath/blink; amber eye-glow only when facing streetward; blink logic throttle-safe). Copper's Lair = rat with waypoint routes (wall runs + dash under the sofa + re-emergence; leaky state machine), metronomic ceiling drip into the puddle (3.4s, pure function of t), and the Copper SMOKES (ember at hand rises to mouth, flares, arm silhouette moves — raise 1.3s/lower 1.5s per Sam — smoke reuses the haze tex). Chippy = woman in the red brothel window (dress-shaped ShapeGeometry silhouette + hair-fall; steps up to the glass in 0.85s, watches 12-21s, one lean w/ hand on glass; dims the red light while present) + fly-killer random crackle (single/40% double-flash every 8-22s; the visible FLY was removed — unreadable at that distance).
2. **Pillars flood rebuilt end-to-end**: vertex-driven spread (96-pt rims, integer-harmonic noise), endless linear growth, radial boundary clamps (smooth kerb/road blend, per-vertex ragged limits, scalloped kerb bays), LEAKY ratchet (advance-only ±3%/s ebb = lapping), gutter-biased masks (radiates from the drain, slowest toward camera), deep source pool (SMALL+ROUND+CAPPED — an elongated version reintroduced the straight-line bug) + welling crown at the grate, pavement sheet from t=150s creeping to the pub door, repair patches deleted from the road tex, all road-facing lights decay-2/double-range.
3. **THE LINE SAGA — root cause found LAST**: `wetPave` sheen was PlaneGeometry(30,**4**) at z 2 → overhung the kerb 0.5 onto the road at y 0.08; the flood (y 0.02) slid UNDER the overhang and stopped dead at its straight edge. Fixed (depth 3). Five earlier "fixes" were real improvements but not the cause: 26-pt polygon rims, uniform-scale ellipse edges, component-wise clamps (→ rectangle pool), flat-top masks, light range terminators. Memories updated: `project_light_range_terminator.md` + `project_buried_plane_bug.md`. **Sam has NOT yet confirmed the fix at full rate — verify with him first thing.**
4. **BANKED DESIGN (Sam, 2026-07-19) — flood escalates across visits, build AFTER the line is confirmed dead + after Wednesday (usage reset)**: the flood NEVER resets between visits. JS-side `phVisitCount` at scene init (NB save/reload resets JS state → falls back to visit 1; acceptable cosmetically, or harden later via `(set:)` + DOM-bridge). Visit 2: opens already-flooded (fast-forward G + reach arrays), crown agitated, slow ripples (CAUTION: rings at this camera read as straight lines — the old ripple ring was removed for exactly this; prototype carefully). Visit 3: lightning (sky flash silvering all water — will spotlight any residual line artefact, test), bigger surface movement, pavement sheet already at the door. Ties into storm dream → Carthage.
5. Also fixed at the Pillars: sandwich board rebuilt as true A-frame ON the pavement (old build: separate face plane buried 7.5cm); hanging sign on a real projecting bracket + pivot, ~60° base angle w/ pendulum swing + wind twist.
5b. **BANKED PLAN (Sam, 2026-07-19) — the "choice debt" audit + restoring real choices.** Sam: the game has too few genuine choices now (e.g. the old critic-vs-Carthage fork on entering the Pillars). Source finding: that fork STILL half-exists at "Maritime interlude" — both links live but the flag conditions (`$metCritic`, `$tookLily2`) mean they almost never show together; "Entering The Pillars of Hercules" dead-ends at "You've no more business here" once the chain is done. Plan: (1) run a **choice-debt audit** — walk every venue's routing, list each fork collapsed into flag-rails (auto-redirects, single-link passes, dead-end ejects), with restore cost + dependencies; Sam picks which to reopen. (2) Item one = the Pillars threshold fork (critic vs shore). Safety rules established: choices may DEFER/SKIP but never ADD required steps (dawn-clock slack is 4-6 laps); respect chain deps (critic → Cecil Court + page knowledge; early shore needs either dependency-free Carthage or a new early-shore beat = SAM'S prose); lap-counted phone calls fire on Pillars entries (forks must not dodge rings forever); old-save guards on new flags. Key design insight: the Dawn Clock makes restored choices REAL (each fork now spends a finite lap) — this is why now is the right time.
6. Trisha's GIF clip for sharing: `~/Downloads/trishas-entrance-cat.gif` (1fps — offer a QuickTime screen-record for a smooth one).
7. **Uncommitted**: all of the above (.twee + .html) — Sam commits via GitHub Desktop.

## ⚠ ADDENDUM 4 (2026-07-18, final) — the bug hunt (2 adversarial audits + live playthrough probes)
**Fixed this round (all verified live):**
1. **DrinkPopup deadlock (worst find)**: no nav teardown + `_drinkPopupOpen` only cleared on a COMPLETED drink → browser-Back mid-popup stranded an id-less overlay and locked `dssOverlayBusy()` true for the whole night (silently killing every hint/teaching/modal). Fixed: drink overlay has an id, a **central sweep at every passage transition** (in the `_passageGen++` observer) removes stranded soft overlays (`drink/venue-hint/word-wise/wtw/cig/napkin`) and resets the drink flag. Reproduced the strand live before+after — sweep works.
2. **wordToTheWisePopup dropped colliding wise-words** (and the once-flags are consumed at render → lesson lost forever). Now it QUEUES (700ms retry while on-passage). Residual known gap: navigate/close within the defer window still loses a tip (flag persisted true) — cosmetic, accepted; fixing properly needs display-time flag commit which Harlowe-from-JS can't do.
3. **"Give up. Sleep here." was DEAD** — `Coach and Horses lock` sets `$coachUrgent to false` at the top, and the link's `(if: $coachUrgent is true)` later in the body could never pass. Restored via `_wasCoachUrgent` captured before the reset. (How long dead is unknown — possibly since the crisis rework.)
4. **The Fetch old-save gap**: cow→LINE 3→Fetch arrives without Dean Street's `$nightLength` heal → the "Not yet. Back to the night." gate misbehaved on old saves. Healed at the Fetch top + guard hardened.
5. **Spew overlay** got an id + busy-list entry (soft popups no longer stack over the retch/piss hold). `_hideStats` extended with `Fight Victory Perfect / Cecil Court Waltz / Ride Jeffrey Bernard's cow / Cow ride success / Cow ride fail` (no more save-scumming the waltz/cow; consistent with pong/fight).
**Verified SAFE by the audits (don't re-chase):** the clock at the 15/16/17 boundary under save/reload (header-saves-before-body makes the increment idempotent); coin/match item grants under dropped popups; ambient audio re-arming on resume; endgame unresumable mid-cinematic; `_lastFightScore` confirmed write-only.
**Live playthrough (real night from BEGIN, through the French):** intro → LINE 1 → naming → coin → turns tip → stats modal → French, clock 15→14 correct, resume-across-rebuild clean. NOT yet walked: Pillars→…→Dawn at human pace — still the top next-session job.
**Cosmetic remainders — CLEARED (next afternoon):** the rising-number `up()` list now includes all overlay ids (word-wise/liver/napkin/drink/spew); the cigarette popup defers via `dssDeferIfBusy` like the soft overlays; the napkin popup closes on Escape (self-removing handler). All three verified live. No known open popup-system issues.

## ⚠ ADDENDUM 3 (2026-07-18, last) — the "admin" round
1. **DAWN SPECTRUM IS BUILT**: the Dawn passage now shades the ending by the night's shape — six mutually exclusive branches after the alba block (complete+rich+unbeaten / complete+scraped-at-the-bell / complete+beaten / complete plain / incomplete+beaten / incomplete+empty(≤3 haunts) / incomplete plain). **Every line is a pink `.claude-draft` placeholder for Dr Quill's rewrite**; the branch structure is permanent. Verified live (beaten+incomplete branch renders in pink).
2. **A2 Aoife memory VERIFIED FIRING** live for the first time (lap-6 hub return with the right flags redirects to "Aoife memory 2"). Long-open audit item closed.
3. **Mute now persists** (localStorage `dssMuted2`) — dormant under the hard-off flag; flipping `DSS_SOUND_OFF` later yields a sticky toggle, killing the "keeps turning back on" complaint for good.
4. **Dead code removed**: FightGame `_winCount`/`_roundDotsHTML` + stale comments, the orphaned `.dawn-summary*` CSS, and `$sawAoifeMemory4` everywhere. Build verified: 0 references remain.
5. **Mobile spot-pass**: rules plate, header row, hub verified clean at 375px.
6. **Still open (honest)**: a full human-paced proving playthrough of the 16-turn night has NOT been walked end-to-end; the climax math from source constants says the dual-ring chain completes by ~lap 8–10 and a completionist run needs ~10–12, leaving 4–6 slack — but nothing beats a real run. First thing worth doing next session.

## ⚠ ADDENDUM 2 (2026-07-18, latest) — beauty & fun round (autonomous, per Dr Quill's brief)
1. **Rules popups are Art-Nouveau plates**: the shared `showRules` builder now adds four mirrored corner vine-and-bracket engravings (hairline gold, 0.42 opacity) + a per-game emblem above the title — fight bell, paddle-and-ball, horned cow head, falling diamond-notes (`DSS_RULES_EMBLEMS`, keyed by opts.key). CSS block "RULES-PLATE ORNAMENT". Modelled on the pre-bar plate.
2. **The Ripley's Wheel is explorable in hold mode**: each caught gate carries an invisible touch-disc (`.dwm-gate-hit`, r=52); tapping it flares that haunt's name + alchemical work centre-stage over Sol (`.dwm-flare`, 0.25s in / 1.7s hold / 0.9s out — drama-then-fade). Clicking anywhere else still dismisses. Verified live with 8 haunts.
3. **Pong carry-spin**: the paddle's frame velocity (`pPadVel`) skews returns (`ball.dy += pPadVel*0.35`, dy clamped ±7) — hitting on the slide curves the ball; craft over reflexes.
4. **Cow near-miss sparks**: an obstacle crossing the player's row within 26px of contact (no hit) throws a brief gold spark streak beside the cow (+ a whoosh, silent under the hard mute). Checked once per obstacle (`nearChecked`).

## ⚠ ADDENDUM (2026-07-18, later) — sound is HARD-MUTED + three autonomous fixes
1. **ALL SOUND IS OFF** at Dr Quill's request (his mute kept un-muting across reloads — mute was per-session by design). One flag: `DSS_SOUND_OFF = true` next to `var _muted` in dssAudio (~line 325). While true, `setMuted` refuses to unmute; every path honours it (SFX `_play`, music startGain, beds at `_startBed`/`setMuted`, cow+pong HTML-audio watchers). **Flip that one flag to restore audio** — and when restoring, consider making mute persist (localStorage) so his complaint doesn't return.
2. **Cow honesty bias**: 25% of narrow spawns seek the rider's free lane (idle no longer wins by luck); fairness engine untouched. Plus hygiene: the cow rAF loop stops when the canvas leaves the DOM; `winSparks` cleared on RIDE AGAIN.
3. **Dev gate**: `window.DSS_DEV = true` beside the backtick keydown (~debug panel code). Set false for release to kill the debug menu. The hash-jump boot hook (injected by sync_html.py) is deliberately ungated — hand-typed URLs only, and it's the session test harness.

# HANDOFF — 2026-07-18 — The Dawn Clock session (jeopardy, Dawn screen, minigame sharpening)

Started with a full mechanics-and-story assessment (three parallel audits; no regressions found; the Jeopardy doc's diagnoses all CONFIRMED in source — minigame outcomes were cosmetic, stats couldn't bottom out, night was infinite). Then built, with Dr Quill approving each step:

## 1. The Dawn Clock (the keystone)
- **`$nightLength` = 16** in StoryInit AND Start (the one tuning knob). Dean Street derives `_lapsLeft` / `_dawnHere` after the `$returns` increment; every venue link now also carries `_dawnHere is false`; at zero the hub offers only "The dawn is coming" → **The Fetch** (works with incomplete alba → Alba Incomplete — "the dawn will come regardless"). The Fetch's "Not yet. Back to the night." is gated `$returns < $nightLength`. Old saves heal `$nightLength` in Dean Street's back-fill block; a save already past 16 returns meets the dawn on its next hub visit (accepted).
- **Coach crisis (`$coachUrgent`) takes precedence over the dawn** — it is still the road to LINE 3; "scraped it at the bell" emerges naturally.
- The **diegetic layer (sky washes + beat lines + lost-time cue) was built, then fully REMOVED at Dr Quill's request** — the clock is numeric-only now. Zero remnants (`dss-sky-wash`, `lostTimeCue` all gone).

## 2. The TURNS readout (header)
- Shares the ALBA row: `ALBA ◆◆◆ 0/3   12 TURNS LEFT` — no label, the count wears the stat-label Playfair style itself. Amber at ≤3 (`night-low`), ember at 1 (`night-last`), "THE DAWN IS HERE." at 0. Guarded `(if: $nightLength is a number...)` for unhealed old saves.
- **Off-by-one handled:** header renders before the body increments `$returns`, so on Dean Street the readout subtracts the lap being spent now.
- Layout: `.alba-strip` is `repeat(4, max-content)` (desktop + mobile); `.alba-jewels` shed its old fixed `width:140px; margin-left:36px` via `.stat-bars .alba-strip .alba-jewels` override; `.stat-bars .alba-strip .stat-label { min-width: 0 }` (must outrank the later 62px rule). `.back-one-link` top 143→158px (mobile 128→142). Verified desktop + 375px mobile.

## 3. Minigame time stakes
Losses at **pong, waltz, bar, fight** each cost one extra `$returns` (set in PP Defeat / Waltz Result Down / Bar Canvas Lose / Fight Defeat). Wins free. Cow excluded (climax; both outcomes yield LINE 3 by design).

## 4. Dawn screen rebuilt (was "a school report")
- HAUNTS/FLOWERS tally **deleted** (orphan CSS `.dawn-summary*` remains, harmless). In its place at 12s: the **five-bell lily sprig** (new passage `Dawn Lily Sprig` — bell art duplicated from Build Notebook because `_bell` is passage-local; star only at 5 flowers) + a **gold wheel emblem** that re-summons the Ripley's Wheel in new **hold mode** — `dssOpusReveal(hold)`: no auto-fade, click/Esc/Enter dismisses, pointer-events enabled. Play again at 16s. All reveals via the guarded-setTimeout pattern, not `(after:)`. Emblem is clickable through the petal storm (verified by hit-test).

## 5. Boxing sharpened (`window.FightGame`)
- **Input:** `touchstart` (kills tap latency) + keyboard (← → dodge, ↓/Space block, ↑ counter; document-level listener, removed at endGame + self-removing when canvas leaves DOM). Keys line added to the rules popup.
- **Impact:** camera kick on hits taken (CAUGHT 7 / TRADE 5 / GRAZE 2.5 / ABSORBED 2, ~340ms decay, oversized bg fill); bar **damage-ghosts** (slow-trailing bright wake) + border flash.
- **Counter window now visible:** the COUNTER ellipse warms during the live 0.50–0.82 window in real exchanges (dimmed by drink, like the dodge cue).
- **KO:** Copper **falls** (hinged at his feet, ~700ms ease-in, body-thud at 650ms), the label waits for him to land, and a **big cartoon K.O.!** slams in (starburst, cream-gold, double outline, overshoot → slow throb; Dr Quill's request). `loop()` runs past gameOver via `_loopUntil` (+6s).
- The DODGE/COUNTER/BLOCK table above the canvas is **removed** (popup-only rule).

## 6. Cow ride sharpened
- **Real bug fixed:** the 35s Harlowe bail link bloomed a fail link under WINNING riders (a ride runs ~48s). Then generalised: **all four canvas bails now 150s** (pong was 70, waltz 45 — whose link even skips the result passage — fight 80), because the timers count from passage render and every game sits behind a popup the player can dwell on.
- **Audio leak fixed:** music + hoofbeat ticker survived any exit that bypassed `navigate()` — a MutationObserver on the canvas leaving the DOM now tears both down (this is what Dr Quill heard galloping in the background).
- SFX: thud on hits, punch+thunder on the throw, bright chord on the win (gallop given 2.5s then quieted). Car-horn telegraph when a wide vehicle (cab/Uber) spawns. Input parity: lane-flash + whoosh on keys/click/touch alike; debounce 120→90ms; lane lerp 0.18→0.24. Title-phase input now enters practice (was skipping it into the real game).
- Pacing: speed tiers raised to `[2.0, 2.6, 3.3, 4.1, 5.1, 6.3, 7.8, 9.4]` (opening had ~21s of low threat; peak unchanged). Win: gold spark stream during the gallop-out, warm flash, glowing YOU RODE IT.
- **Noted, not actioned:** one fully-idle run WON untouched (right lane); a second idle run lost fast. Variance, not an exploit — optional spawn-bias toward the player's lane if passivity should be reliably punished (Dr Quill: "no urgency").

## 7. Pong + bar + instructions rule
- Pong: paddle-hit clink (`vialClink`), point flash (cool white you / red them), win chord / defeat thud. (Its AI was already sound.)
- Bar game: already the best-sounded; only instruction cleanup.
- **Popup-only instructions everywhere:** fight table, pong + cow crib lines, waltz idle hint, cow canvas-title instructions, bar in-game pour line + carry key-reminder all removed; goal info moved INTO popups ("You have three lives…" cow; keys line fight). Micro-prompts ("Hold to piss/retch/eat", "Press and hold.") kept — they are the bare minimum.

## 8. Prose rules (MEMORY: `feedback_no_truncation_no_emdash.md`)
All four minigame popups rewritten: **no em dashes** (colons after bold labels, commas, "and") and **no truncated sentences** ("You have three lives.", never "Three lives." — "It smacks of AI"). Applies to all future AI copy; his prose untouchable.

## 9. Verified / closed
- Waltz middle-score routing is FINE (hidden `waltz-onward` neutral link exists) — the last open audit question, closed.
- All builds verified in preview after each change; console clean throughout. Passage count 141 (140 + Dawn Lily Sprig).

## Outstanding (none blocking)
1. **Dawn spectrum** (endings branch on haunts/time/beaten — needs Dr Quill's prose; skeleton offer stands).
2. **Waltz** sharpening — parked, "least important".
3. Cow idle spawn-bias — his call.
4. Music to compose: painting minigame (*Sketch the Painter*), tarot (*Shana Reads*). Audio ears-checks (Dido 0.40, Lackland seam, carthage-melody, waltz stat feel).
5. Pre-commercial: gate the debug menu (backtick listener + DBG Complete/Matchbook); Soho field recordings (`FIELD-RECORDING-CAPTURE-LIST.md`).
6. `v2-expansion` branch: "new prose drafts" (2026-05-14) sit unmerged — ask whether superseded (memory `project_branch_status.md`).

## Carried over (unchanged reference)
- **Endgame chain:** hub `_towerReady` (or `_dawnHere`) → The Fetch → Approach Centre Point → Alba Complete/Incomplete → Dawn Approach White/Black → White/Black page → Dawn.
- **Stats:** mood system, no death; endings don't read them; asymptotic `$statGain/$statLoss` (StoryInit ~line 126).
- **Ambient beds:** `registerAmbientBed` tag-driven, continuous; procedural `_ambient` slot separate.
- **Tester link:** https://www.samquill.com/Dream-Street-Shuffle-Game/Dream%20Street%20Shuffle.html (hard-refresh on first load).

---

## ADDENDUM 5 — 3D scene review completed with Sam + Carthage majesty pass (2026-07-18/19)

Sam reviewed each scene live in the preview pane (localhost:8732, `#dss-debug-jump=<passage>` + `?v=n` cache-bust). Server: `python3 -m http.server 8732` from the game folder (restart if the pane loses it).

### Scenes blessed this round (in review order)
- **Colony (CR)**: Mr Punch window = real newsagent (cig gantry, magazines, papers, taped cards; two-line fascia via `:` split in buildShopfront). Gawain's = greengrocer (crates/scale/jars) + **hanging Green Knight pub sign** (perpendicular, swinging, own lamp, blood-red neck stump). Minotaur deli = **taxidermy minotaur** in window (bull head, longhorns, halo). Dressed upper sashes; road textured+rotated 90°.
- **Ronnie Scott's (RS)**: strong slab pavement (rsPaveTex + apron clone), grimy tarmac road + kerbs + drain + more/bigger puddles; brick facade (toolkit); shopfront developed (panelled boards, bills window, photo wall, panelled door + brass + porthole, two lit posters, entrance mat); single full-width steep awning (z-fight two-plane sandwich replaced by solid slab; narrowed so Cosmogramma side sign clears); side sign deliberate **electric flicker** (animate dims material color; the original z-fight flicker is fixed); satellites + shooting stars; **sky wheels** (skyGroup rot 0.015, planetGroup 0.008 — planets lag stars); windows dressed WITH flashing-from-within kept (litGlassMats now dims color not opacity).
- **French House (FH)**: real flags (shaped sagging tricolores + dirt); door moved to x=-1.1 (was ON the -0.5 pilaster — "cut in half"); painted pub interiors + rescued buried drinker silhouettes; half-height glazing (top-half-of-drinkers, real-pub style); dressed upper windows everywhere incl. neighbours (their glass was buried in frames — moved to 0.085/0.035); bricks/stucco/slabs/tarmac all textured; PARIS/ESSEX shopfronts dressed (KEEP as-is per Sam); **Green Fairy** absinthe moth orbiting centre lamp (small, very fluttery — tuned twice).
- **Pillars (PH)**: stucco/brick neighbours, strong slabs (phPaveTex + apron), road re-oriented (was 8-wide pointing at camera!) + grimy; everything dirtier (plaster soot/nicotine/damp boosted); red-light windows = dressed rooms tinted red; natural foliage swag (sprite clumps + strands); painted Victorian pub interiors (pumps, drinkers, etched frost band); **THE FLOOD** — two sources only (drain blob-pool + passage: wells up INSIDE alley → fan-tongue with rounded front across pavement → gutter pool), ~40s full, blob geometry (phBlobGeo/phFanGeo — NO ellipses/rings, they read as sweeping lines). Sam: flood is lead-in to the storm dream → Carthage. He plans to revisit ("I can do so much with them now").
- **Carthage coast (Ca)** — full majesty pass: sun path on water (animated glints, rides tide), dusk cloud bands + burning horizon, crepuscular rays, sea sparkles, **departing ship** (4-min crossing, fades, returns "as dreams do"), pink ringed planet (rings upright Uranus-style, pale) **with 3 orbiting moons**, crescent moon boosted + moved right (+earthshine), fireflies, rim light; hill = scrubland (repeat tex + gullies/rocks); palms rebuilt as **geometry fronds** (makeFrondGeo/makeFrondMat, lit, + dead skirt); grass rebuilt as **geometry blades** (dryGrassMats, rooted); foliage dusk-dimmed (sprites are UNLIT — that was the plastic look); shoreline: 15 shore rocks + froth collars, foam-band textures (makeFoamBandTex) on all wash lines + churn animation, finer spray, rolling wave crests ×3, mirror-wet sand band, staggered foam arcs, sand/wet-sand textures; shore ruin walls textured (ruinStoneTex); rubble textured (rubbleTex — was pale confetti); pots tumbled onto sand (upright ones read as weird crescents); broken columns end in **sheared fracture caps** (chunks removed — "stones on top" weird); **cattle skull** on the (10,-3) stub (skullColumn.userData.topY; bone emissive to stay pale); **THREE BLUE POSTS** = left colonnade trio painted decayed blue (blueColumnMat, emissive 0.2) — HIS PUBLISHING NAME SIGNATURE. Never remove.

### Toolkit additions (window.dssScene)
- `makeDressedWindow(lit, style, colIdx)` → MeshBasicMaterial; style 0 drapes / 1 half blind / 2 nets; used across RS/CR/LO/PH/GL/FH(local twin makeUpperWindowTex).
- Buried-plane bug fixed EVERYWHERE (see memory `project_buried_plane_bug.md`): 7 roads raised to y=0.004; apron pattern (pubPave/paveMat2) is the real pavement in RS/PH/FH.

### Still to do / next session
1. **Ginger Light (GL)**: textures applied + verified render, but NOT reviewed with Sam scene-by-scene. Same for **Lackland (LO)** and **Centre Point (CP)** (both smoke-tested healthy).
2. **The Coach (CH)**: STILL PARKED for detailed rebuild (roads fixed only).
3. Iframe scenes untouched: green-sea, cecil-court, oxford-street statics.
4. Sam wants to revisit the Pillars flood ("not quite perfect") and generally push scenes further — he sees the new ceiling.
5. Every reviewed scene now has a living element: Colony (swinging sign), Ronnie's (wheeling sky/satellites/flicker), French (Green Fairy), Pillars (flood), Carthage (ship/moons/surf/fireflies). Trisha's/Chippy/Copper predate this convention — candidates for one each.
6. Full human-paced playthrough still pending (Sam will do it).
7. Uncommitted: all of the above is in the .twee + .html — Sam to commit via GitHub Desktop.

Muted: DSS_SOUND_OFF still true.

### ADDENDUM 5b — the Carthage flashing saga: full diagnosis + recipe (2026-07-19)

Sam chased intermittent sandy-brown flashing across the shore/arch band. It was FIVE stacked causes; all fixed in Ca. **Recipe for other outdoor scenes if flashing appears:**
1. **Transparent sort-flipping**: drifting haze/fog planes + layered shore transparencies re-sort per frame → pin `renderOrder` on ALL big transparent layers (haze=50, shore stack 2..9). Symptom: whole bands "jump between layers".
2. **Tide-crossing**: animated water planes rising through static overlays → make every overlay ride the tide at fixed offsets; never let an opaque plane cross a transparent one.
3. **Coplanar geometry**: voussoir/moulding segments interpenetrating → stagger alternate segments ±0.01 in depth. (See memory `project_buried_plane_bug.md` for the whole family.)
4. **Shadow churn**: shadow map re-rendered every frame with moving casters → `renderer.shadowMap.autoUpdate=false; needsUpdate=true` once after scene assembly (static sun ⇒ static shadows). Also raise frustum size so its edge-seams ("light cones" Sam spotted — his diagnosis cracked it) sit outside all visible geometry.
5. **THE ROOT: near-horizontal shadow sun.** A directional light at height 4 (dir ~10:1 horizontal) smears every shadow texel into long stripes; their boundaries roam with any bias/frustum change. **Fix = two-sun rig**: visual sun stays low (castShadow=false, keeps the raking light/rim), plus `shadowSun` at the same azimuth hoisted high (y=30) that owns castShadow with a tight frustum (±55/40, far 160, 4096 map, bias -0.0012, normalBias 0.08). Both share the sunset-breathing pulse (0.9/0.6 split of the old 1.5).

Also this morning: crescent moved right + brightened + earthshine; planet paled/pink, rings upright, 3 orbiting moons; ship reflection + moon glint on sea; sunlit-sand patches → soft radial; driftwood bedded; foam arcs end-faded; grass = geometry blades; rubble textured; pots tumbled; fracture caps instead of chunk-topped stubs; cattle skull on the (10,-3) stub; left-headland spray removed (was inside the hill volume); crests confined to open water; logarithmicDepthBuffer on the Ca renderer.

### ADDENDUM 5c — Cinematic post-processing rollout (2026-08-20)

Ported the Oliver Twist "Fagin's den" pipeline (that project taught it: EffectComposer + UnrealBloom + BokehPass from three r128 examples/js CDN) to ALL 13 DSS 3D scenes.
- Shared helpers at top of UserScript: `window.dssPostScriptURLs` (10 jsdelivr scripts), `dssLoadPost(done)` (sequential, offline-tolerant), `dssMakeComposer(scene,camera,renderer,opts)`, `dssFilmGrade(wrapEl)` (vignette+grain divs in the scene wrap).
- Every scene init wraps its build call in `dssLoadPost`; every render call routed `dssComposerLocal ? composer.render() : renderer.render(...)`. CP scene uses cpScene/cpRenderer/cpCamera names. A 13th scene discovered: buildOFScene = O'Flatterly's Bookshop ('of-wrap').
- Carthage keeps its own inline composer (focus 14) + moons now coloured (gold/ice-blue/sea-green).
- **Bokeh is opt-in** (`opts.bokeh`) — it re-renders the whole scene for depth and the big street scenes are draw-call heavy; only interiors CL (focus 6, bloom 0.55/thr 0.3) and OF (focus 5, bloom 0.5/0.35) carry it. Interior bloom thresholds LOW so lone bulbs halo (CL's bulb needed thr 0.3).
- Composer deliberately at CSS resolution (no setPixelRatio) — full retina ×3 passes tanks fps.
- No gamma pass anywhere: DSS scenes were authored under linear output; parity preserved.
- Verified by screenshot: Ca ✓ RS ✓ (neon blooms) CL ✓ (bulb halos). Late fps readings of 2fps were the PREVIEW PANE squeezed to 280px and throttling — not game perf; re-verify in a normal-size window. Sam should eyeball every scene; per-scene bloom/focus tunable in the opts table at each `_dssBindScene` line.

---

## Addendum 6 — Cinematic pass completed game-wide (2026-08-20 session)

Everything below is in the .twee, synced, and verified live. Sam approved each stage.

### Post pipeline (bloom composer + film grade) — full coverage
- All 13 inline 3D scenes (previous session) PLUS the three JS-injected iframe scenes:
  - `oxford-street-from-centre-point-3d-static.html` (dawn vista): composer + grade, threshold 0.8 keeps the smog sky out of bloom. Colour parity A/B-verified.
  - `cecil-court-3d-static.html`: composer + grade.
  - `green-sea-3d-static.html`: **film grade ONLY — bloom deliberately removed** (bright pastel scene; even strength 0.14/threshold 0.93 milked the facade — comment in the file explains, don't re-add).
- Five minigames (pong/waltz/fight/cow/bar): vignette+grain wrapper + contrast lift via a watcher in UserScript (`dssMinigameCanvases` interval; wrappers use fit-content vs fill-parent branch on inline width:100%).
- Pipes entrance (`coach-plumbing-intro`, plays when $crashedAfterDualRing): deep tunnel vignette + grain via same watcher.
- Body-function popups (drink / spew gents+doorway / eat / liver): per-canvas grade via same watcher (`popupHosts` list). Napkin sketch canvases deliberately excluded (drawing surface stays clean).

### Napkin sketch = watercolour (`window.dssWatercolourKit`)
Offscreen scratch canvas per stroke → composited multiply @0.8 → real wash layering (crossings darken, grain shows through, light-over-dark stays dark). Soak halo, edge pooling, granulation, wet-tip spatter trailing the brush (flicks throw more). Eraser stays opaque. BOTH engines (passage + notebook popup) run through the one kit; reveal animation restructured per-stroke (sIdx). Verified: draw, undo replay, Done reveal → Napkin Portrait.

### Ritual/reveal animations upgraded (drama-then-fade preserved)
- Map pentagram casting: star TRACES itself (pathLength=100 dashoffset) + bright tracer head (dasharray 2.5/97.5), gold drop-shadow glow, bells bloom in trace order (nth-child delays), LBRP lines materialise one by one. 5s total.
- Notebook lily-pentangle star: same trace treatment in its hold window.
- Ripley's Wheel: gates light CLOCKWISE (inline animation-delay per gate 3.0+i*0.14s), ouroboros rails self-inscribe (dwm-rail trace 3.4s) then flesh (scales/head/tail in .dwm-serpent-flesh) materialises at 5s, breath from 6s, Sol pulse now flares gold.
- Dawn petal storm: 3 depth planes (near 22% big/blur1.3/fast ×1.7, far 22% small/dim/slow ×0.55) — CSS bokeh.

### SVG FX toolkit (`#dss-svgfx` defs injected by UserScript)
Filters: `dss-ink` (waver+fibre displacement), `dss-ink-fine`, `dss-gild`, `dss-gild-strong`, `dss-paper`. Opt-in via filter="url(#…)".
**Validated rule (Sam's verdicts): ink anything OLD/WEATHERED/ORGANIC; spare crisp lettering, item cards (matchbox = "not improved"), ritual geometry, UI chrome, header lily (never), per-frame-animated elements (perf).**
Inked so far: collectible lily (+petal mote, nb lily rows, dawn sprig — stars excluded), gents tiles BOTH bands, chippy tube ×2, fetch street+window (captions spared — his prose text stays crisp), carthage pyre ×2, page-emerge, colony fans ×10, pillars+lattice ×10, all decorative rules (dawn/phone/french/ronnies/cecil/dst-an-top). Skipped + why: Green Sea banners (pastel-clean identity), ending vines (full-screen per-frame recompute), Aoife mp-bg (photos, hers), Trisha neon, inventory cards.

### Stat header rework (background + header lily untouched)
- MORALE: powder line slimmed to 6px granular line (margin-top 4), tapering tail, stray grains on the smoked glass, ghost slimmed to match. Rolled note kept.
- SOBRIETY: cigarette slimmed to 11px (filter tip + ember rescaled to match, filter = 11px too), detailed paper (grain specks, wrap seams, double gold brand ring, lipstick, scorch ring at burn line). Grey ash REVERTED to dark shadow (Sam: covered the pct). Alba bells: 2px nudge tried and REVERTED (Sam: wrong).
- **Bug fixed**: .stat-pct was painted OVER by the fill at high stats (fill z-index 1, pct unpositioned) → pct now position:relative z-index:2 + dark halo text-shadow; verified legible at 100% on both bars.

### Open threads
- Pillars flood "not quite perfect" — Sam wants to revisit.
- Tarot cards: possible dss-ink demo-first candidate (his call, never blanket-apply).
- GL/LO/CP/OF scenes never individually reviewed with Sam; Coach parked.
- Everything uncommitted; Sam commits via GitHub Desktop. Local server on :8732 may still be running (bo0znifd2).


---

### Addendum 3 — Regression sweep of the older mechanics (2026-09-11, Fable 5.1 chair-task; HANDOFF item 1)

Played on the served build (localhost:8732) in the Browser pane. Result: **no regressions found**; one small phone-copy fix shipped.

- **(a) Ronnie Scott's bar game — PASS.** Pour phase scores all three drinks (perfect/close/miss bands intact). Carry phase: a scripted bot run from the carry start reached the finish at 7000 px in 39.6 s with 3/3 glasses, 15 obstacles, all three obstacle art sets (styles 1–3 = floor / bar top / stage) plus a floor pit, high (duck) and low (jump) obstacles, and the finish spotlight. The retuned Mario dials (jump-cut 0.55, fall 1.8x, coyote/buffer) are already wired into `_playerJump`/`_updateCarry`; a full-hold jump is ~1.16 s ≈ 230 px at base pace against pits of 80–140 px and the combo spacing of 410–500 px, so geometry still clears. Rubber-duck BONK and the mallards render; the jazz-abyss music notes rise from the pit. `Bar Canvas Win` fires from `_resultCarry` (SIGNED, SEALED, DELIVERED; sobriety −13; turn refunded). Lose passage read in source (turn +1, `$completedSetlist` set); not played. Gotcha for future sweeps: a second entry to Ronnie's after a win shows the venue-exhausted text — wipe localStorage first.
- **(b) Cecil Court Approach iframe — PASS.** `cecil-court-3d-static.html` loads from the served build (200), THREE present inside the frame, ENTER CECIL COURT button appears and navigates to `Cecil Court`. Also 200 on the live www.samquill.com build.
- **(c) Password + notebook coin-flip — PASS.** Real walk BEGIN → Step into the night → hub, notebook opens (tabs FINDS/EFFECTS/LILIES/POEM/DREAMS/MAP). Then `DBG Complete` jump (state carried; the notebook DID open after this jump — 2d's "dead notebook" applies to raw jumps with no prior autosave). Coin: FINDS → Toss it → `flipCoinPopup` auto-toss, scrim + result ("Heads."), fades. Password: Lackland's Office → Linger → back door; wrong word gives "That's not it." and clears; notebook DEPLOY closes the dialog, whispers Valletta, lands in `Lackland's backroom` (venue-lackland-back). No console errors.
- **(d) Astral reveal at Centre Point — PASS.** Fires ~2.4 s after arrival over the 3D scene, holds, fades; `#dss-astral-modal` removes itself; CLIMB IT link remains.
- **(e) Side-screen cigarette + jazz-abyss notes — PASS.** Notebook "Smoke one" → next passage render spawns `#side-cig` bottom-right with ember; notes seen in (a).
- **(f) Soho map phone d-pad — PASS, one fix.** Under 375×812 touch emulation the `.soho-dpad` renders (grid), all four buttons step the walker (c/r/px/py change, facing updates), map fits the width. Steps are blocked while a word-to-the-wise popup is up (`busy()`), by design. **Fixed:** the first-visit caption said "Use the arrow keys to walk, or click a door." on touch devices; it now reads "Use the arrows below to walk, or tap a door." when `(hover: none) and (pointer: coarse)` matches (twee line ~4373, `refreshBar`). Synced.
- **Loose ends — RULED, DELETED 2026-09-11 (Sam: "you can probably delete both"):** `:: Deco Divider` (2.3 KB SVG ornament, no `(display:)` anywhere, no `.deco-divider` CSS either) — place it or delete it; `:: Dream to Dean` (196-char stub, no incoming link, sets `$visitedCarthage`) — dead since the dream worlds got their own returns.
- Observations, not bugs: after 12 haunts the stat labels become OPUS/STATE (intentional, header line ~46336). The three hub teaching popups re-fire after every debug-jump reload because the jump restores the save from before their once-flags were written; on a real walk they show once.

### Addendum 4 — Item 2 rulings round (2026-09-11)

- Review page for the unruled art: scratchpad `rulings.html` served on **:8734** (the `scratch` launch config now points at THIS session's scratchpad on 8734 — 8733 was held by another chat). Sections 1–8 = tarot faces, Hanged Man pink lines, pressed lilies, coin faces, notebook plan (live only), venue/dawn rules, phone rules, map street life (live only).
- **Sam ruled: redo Death's horse, the Chariot's sphinxes, the Devil.** DONE: all three redrawn in scratchpad `cards.html` (the JS draft page; `newcards.js` holds the source blocks) and spliced into `_art2` in BOTH Shana Reads and Shana Looks Again (the splice regex matches the one-line `"Death", "<svg class='tarot-art2'…</svg>",` entries; both copies replaced). Death: slender pale horse walking left, arched neck, lowered head, mane, tail, four legs in stride; black-armoured rider with a visor, one leg down the flank; black banner with the white five-petal rose; sun between the towers over the river; fallen crown and sceptre. Chariot: two couchant sphinxes (lion bodies, forepaws out, squared nemes with stripes and lappets, oval faces), black and white; wheels behind them; the car now carries the winged disc and lingam-yoni; a crescent-epauletted charioteer with the wand. Devil: great bat wings, black cube throne with the iron ring, seated shaggy plum body with folded goat legs, goat head with beard and slit eyes, ram-spiral horns, inverted pentagram on the brow, raised open right hand, torch held downward in the left, the chained pair with small horns and tails. Extraction path (no node on this Mac): load cards.html in the Browser pane, read `CARDS[k]` with the class/aria attrs prefixed, write to `cards-out.json`, splice with Python. Verified: Shana Reads renders 0 tw-errors after sync. Still unruled: everything else on the list (lilies, coin faces, plan, rules, phone rules, street life, the four pink lines).

- **Sam (2026-09-11): skip the pink lines.** He will do ALL the `.claude-draft` pink redrafting himself when in a mood to write; don't raise them again as open items. Death's horse got a second pass the same night (wedge head, mane, hooves) after Sam's 'still a weird blob'.

- **LILIES LAID FLAT (Sam, 2026-09-11: 'you wouldn't stick them in a notebook to press at weird angles').** Both rows (Build Notebook + Dawn Lily Sprig) AND the 0%/100% frames of `nb-lily-pent-1..5`: the five bells now stand upright (rotate 0) in one even row, stem tops on one line — translate (40,34) (95,34) (150,34) (205,34) (260,34), scales unchanged (0.821/0.893/1/0.857/0.714). Tapes at (x−0.8s, y−9s) rotate 0; stains under each bell at (x, y+22s) rx24 ry36. Verified on a Dawn Lily Sprig jump: 5 bells, 0 tw-errors; pentangle animation forced with `.nb-lily-pentangle` still gathers to the star and returns to the row. Note: the static five-gathered star on the Dawn sprig now sits behind bells 2–4 rather than between scattered flowers — left as is, faint. scratchpad `lily.html` is now stale (still the scattered layout).

- **Dawn sprig star moved below the row (Sam, 2026-09-11).** Dawn Lily Sprig only: viewBox 0 0 300 135 → 0 0 300 200, the static five-gathered pentagram now centred (150,150) r46 (points 150,104 177,187.2 106.3,135.8 193.8,135.8 123,187.2), clear of the bells. Notebook row + its animated star untouched. Verified on the jump, 0 errors.

- **RONNIE'S RULE = GIANT STEPS (Sam, 2026-09-11: 'those two quavers seem a bit lame… more notes vaguely suggesting the melody for Giant Steps').** `:: Ronnies Rule SVG h14` (name kept; it is (display:)ed at the top/bottom of Ronnie Scott's, Bar Canvas Win/Lose, The Set) is now viewBox 0 0 600 30, `xMidYMid slice`, `.ronnies-rule` height 14→30px: the blue rule breaks for a five-line staff fragment (x196–404) carrying the head's first two bars as notation — F#5 D5 | B4 G4 | Bb4 B4 | A4 D5 — open minim heads with sharp/flat, the last pair as beamed quavers, bar lines. FOUND + FIXED on the way: the rule's own gradients (`rnG2`/`rnGd2`) were objectBoundingBox on zero-height lines, so the blue rule had never painted in Chrome — now `gradientUnits='userSpaceOnUse' x1=0 x2=600` (same bug as the dawn rules, 2y). Verified live at Ronnie Scott's, 0 errors; review page rebuilt (`scratchpad/build_rulings.py` is the rebuild script now).

- **Sam ruled (2026-09-11): the rest of the rules are fine, KEEP** — French h24 + h60, Cecil shelf, Trisha's strip, the three dawn rules. Still unruled from item 2: coin faces, notebook plan, phone rules; map street life parked by Sam.

- **Sam ruled (2026-09-11): coin faces fine, KEEP.** Remaining unruled: notebook plan, phone rules (map street life parked).

- **Sam ruled (2026-09-11): phone rules fine, KEEP.** Only the notebook plan remains unruled from item 2 (map street life parked).

- **Sam ruled (2026-09-11): notebook plan fine, KEEP. Item 2 is CLOSED.** Summary of the round: Chariot/Death/Devil redrawn; lilies laid flat + Dawn star moved below; Ronnie's rule = Giant Steps staff; everything else kept; pink lines are Sam's; map street life parked (not ruled, not rejected).

### Addendum 5 — Item 4 audit (2026-09-11)

Audit of the phase-2 queue against the .twee (item 4's summary line had gone stale):
- **Soho-responds weaves: BUILT.** All five gift flags fire a `(go-to:)` once-only branch + a `.dss-dream-residue` line at the right Soho site: critic ($mantraComplete → The Critic Hears the Mantra, ~44782), Lackland ($nazcaTracing → Lackland Recognises the Tracing, ~42743), Red at the corner ($easterGlyph → Red Recognises the Name, ~40412), O'Flatterly's shop ($pyramidNumber → Inis Recognises the Proportion, ~41271), Spanish Artist ($ezekielVision → Benito Recognises the Wheel, ~44905).
- **Hexagram reveal: BUILT** in The Synthesis (~56051). **Alt-Dawn: pink stub, Sam's prose** (unchanged).
- **Notebook DREAMS tab:** ledger of five worlds + echoes existed; the THREAD column was a hard-coded '—'. **Shipped tonight:** thread shows the gift once earned (`_tH.._tZ`: the mantra / the tracing / the glyph / the proportion / the vision); **CHANT section** added under the ledger — the 12-syllable `.nb-mantra-row` (same CSS the Cave uses), Nth syllable `heard` when `$haunts's length >= N`, else a silent dot; caption 'One syllable for each haunt caught.'; old-save guards for `$mantra`/`$haunts`. Verified live after a DBG Complete jump: DREAMS tab renders, 12/12 syllables lit, 0 tw-errors. The thread text was NOT exercised by state (DBG Complete sets no gift flags) — same `(cond:)` pattern as the working `_dH` row classes.
- **22 Hebrew paths: NOT built — needs Sam.** `.nb-paths-row` / `.nb-path-letter` CSS exists; no milestone→letter mapping exists anywhere on main and the branch builder can't be read without git. 22 = ? (12 haunts + 5 lilies + 3 alba + 2 = coin/page? or the tree's 22 paths between the 10 sefirot venues). Ask before building. Charm slot stays text lines (pocket + resting keys) — Sam has not asked for art.
- **Bigger moves (time-windowed venues, ending switchboard, Easter Island's game, stronger first five minutes): NOT green-lit, not touched.**

### Addendum 6 — Item 5 housekeeping (2026-09-11)

- **Audio restored.** UserScript line ~461 `var DSS_SOUND_OFF = false` (was Sam's temporary hard mute from 09-11). The setMuted/localStorage path is back to normal (`dssMuted2` honoured again). Verified on a Dean Street jump: `dssAudio.isMuted()` → false, 0 console errors, the linked beds are being fetched. Real music start still needs a real user gesture, as before.
- **Git history purge — NOT done (never run git; force-push is Sam's call).** Repo is 544 MB on disk after the 09-01 gc; the old ~60 MB html builds are still in history. If Sam wants option 2, the steps (his terminal, not mine): install `git-filter-repo` (`brew install git-filter-repo`), fresh clone, `git filter-repo --path 'Dream Street Shuffle.html' --invert-paths` (or `--strip-blobs-bigger-than 20M` to keep the current html but drop the fat old blobs), re-add the remote, `git push --force --all` + `--tags`, then every other clone (GitHub Pages is fine — it rebuilds from the branch) must re-clone. Alternative that keeps history: do nothing; 544 MB is workable.
- **22 Hebrew paths (from item 4): Sam — 'I think we got rid of the 22? or maybe they came back with the dream worlds. Let's think about it another time.'** Parked; don't raise unprompted.

### Addendum 7 — Soho map fixes: labels, narrow layout, REAL-SOHO doors on both maps, Romilly band (2026-09-11)

Sam: "This map is a mess now" (labels piled up on the Bateman block at ~480px); then "make the square a bit longer on the vertical"; then "the doors are often in the wrong places… it doesn't match the map (real world or in game)". Ruling: **REAL SOHO is the reference; the pentangle may go slightly lopsided but must not be a mess.**
1. **Hub labels**: `.soho-door-label` font is `clamp(7.5px, 2.5cqw, 0.66em)` (the stage is a size container), and a `settleLabels()` pass after the labels are built (and on resize) pushes the UPPER of any two overlapping labels up until none overlap (never down onto its door). 0 overlaps at 406px and at pane width.
2. **Narrow-layout void FIXED**: below 640px the wrap `clear`s the floated `#dean-lamp-svg`, and `sizeLamp()` sized the lamp to the whole passage → the map dropped below a 2400px lamp. `sizeLamp` now measures to the top of `#soho-map-container` on the narrow layout (`measure()`), so the lamp keeps the title company and the map follows at once.
3. **Romilly Street band**: ROWS 22→30; `ROAD_ROWS` +23,24; `PAVE_ROWS` +22,25; centre-line dashes on row 24; `streetName` returns ROMILLY STREET for rows 22–25; four lamps added on the band; CSS max-width aspect 26/25 → 26/33; canvas is now 416×528.
4. **Hub doors (real Soho)**: coach → c17 r21 (Greek's west side at the Old Compton/Romilly block, entered from col 18); trishas → c22 r8 (Greek's east side just south of Bateman, entered from col 21); chippy → c5 r2 (west of Dean, north — where the plan's Wardour-side chippy points); doorway → c5 r19 (west of Dean, south of Old Compton); cecil → spot c25 r25 on Romilly's south pavement (label at 23.6,23.6). French/Colony/Ronnie's/Lackland's/Pillars/Ginger/North unchanged.
5. **Notebook plan (Build Notebook ~46436–46463) + Dawn Approach White/Black overlays (~40533/40542)**: the two cross-street LABELS were swapped into the real order (Bateman y374 north, Old Compton y523 south — only the text changed, the roads didn't move). **Star point moved: Coach (490,460) → (490,560)** (south of Old Compton, Romilly corner) in all polygons + lily groups (plan pentagram, tracer, dawn overlays ×2) — this is the 'slightly lopsided' Sam accepted; **Trisha's (470,200) → (494,200)** (east side of Greek) likewise. Non-star markers: Ronnie's → (340,450) Frith between the cross streets; Colony → (232,420) Dean opposite the French; Pillars → (486,228) Greek's WEST side; Lackland's → (364,430) Frith east side (agrees with the hub); Chippy stays (100,250) — it is a star point. Trisha's label now anchored left of its marker (was running off the right edge); the Coach's label sits BELOW its marker (clear of the LBRP panel). Verified live: hub 0 errors/0 overlaps; MAP tab renders, the forced `.nb-map-pentangle` reveal traces the new star with bells at all five points; Dawn Approach White overlay shows the same star over Oxford Street, 0 errors.
6. LBRP panel nudged 14px down (rect y 528→542, text 540/558/576/594 → 554/572/590/608) so it clears the OLD COMPTON STREET label and stops short of SHAFTESBURY AVENUE (Sam, same night). Pigeons/cat/cab untouched.

### Addendum 8 — Overnight beauty run (2026-09-11, started 06:49, hard stop 08:19)

**Cycle 1 — mini-game rules cards bled the passage through (Cellar fight, cow ride).** Survey of venues from debug jumps (French, Colony, Pillars, Fetch, Coach, Chippy, Interval, Set, Pong, Fight, Cow). The shared `.dss-rules-overlay` (rules cards + the HAUNTS explainer) carried `backdrop-filter: blur(2px)`; in the pane's Chromium the blurred backdrop painted OVER the opaque card so the prose under it read through the rules. Removed the blur (scrim 0.82→0.86 to compensate). Verified: Cellar card clean immediately after the change; cow card clean once the tab was fronted. Caveat: the pane reported `document.hidden` true for stretches of this run (rAF-driven fades arrive late), so the cow's first bad shot may have been partly that; the blur removal is harmless either way. Other backdrop-filter users left alone (.stat-bars, .lily-window, .tarot-reading-body, .phone-ringing) — none showed the fault.

**Cycle 2 — bar game result screen restaged.** `BarGame._drawResult` (~9097) was a black canvas with a lime headline, three stars and a caption. Now: the club with the lights down — warm back wall, stage boards with a gold lip, a single spot cone from above pooling on the stage, four smoke wisps drifting through the beam, the TRAY set down in the light with the drinks that survived drawn by `_drawGlass` from `completedDrinks` (rings on the tray where the lost ones stood), and the words in gold with a soft glow: a letterspaced strap ('THE TRAY REACHES THE STAGE' / 'THE TRAY COMES UP EMPTY'), 'N OF 3 DELIVERED', the stars, the old captions unchanged. Verified by forcing the result phase on a live game (3/3 drawn correctly; the loop kept it live). No copy changes to the win/lose passages.

**Cycle 3 — mini-game feedback off the palette.** The bar game's five uses of lime `#4CFF00` / tomato `#FF6B6B` (pour feedback 'Perfect pour.' / 'Too much.', the completed-drink star, the `_resultCarry` narrative lines) → house gold `#e8c060` / soft claret `#d8846a`. `.pp-result-win` (mint #aaffaa glow) / `.pp-result-lose` (pink) — shared by the fight (DOWN / STANDING / PERFECT SCORE), pong (DEFEAT / VICTORY) and bar (SIGNED, SEALED, DELIVERED) banners — now gold `#f0dca0` with a gold glow and letterspacing 0.12em, lose = ash claret `#d8a090`. Verified on Bar Canvas Win (gold banner) and Lose (no banner there; prose only, left alone).

**Cycle 4 — Lackland's office given its own light.** The one venue interior that was prose on plain dark (after a full 3D approach). CSS only, keyed on the passage tag (`tw-passage[tags~="venue-lackland"]`, `isolation: isolate`, pseudo-elements at z-index −1 so nothing in the prose changed): `::before` = the green banker's-lamp pool from the top-left (breathes on a 7s cycle) + a warm amber from the amp at the right + a faint green-black wash at the top; `::after` = a data-URI record (grooves, green label, one highlight) turning at 33 rpm (1.82s/rev) at the right margin, opacity 0.42, `prefers-reduced-motion` stops the spin. Applies to the Office, Back Door and the Recognises-the-Tracing branch (same tag). Verified: pseudo-elements computed, 0 tw-errors, screenshot reads as a lit room. The Garrard image sits at top: 11em so it clears the sticky header.

**Cycle 5 — Cecil Court lit.** O'Flatterly's shop (and Watkins, the quest/gift pages, the street page under its shelf rule) were prose on plain dark. CSS keyed on `tw-passage[tags~="venue-cecilcourt"]` (same pattern as cycle 4): `::before` = the late shop window's scrumpy amber from the top right (9s breathe) + a faint warm lift top-left + blue-grey fog rising from the foot; `::after` = a repeating data-URI of eight soft book-dust motes, masked to the window's light, drifting upward on a 38s loop (reduced-motion stops it). Verified on O'Flatterly's shop and Cecil Court: pseudo-elements computed, 0 tw-errors, the amber reads under the prose. Note for the reader of console logs in the pane: the two 'no passage "The Pillars of Hercules"' errors are from MY mistyped jump early in the run (the venue is 'Entering The Pillars of Hercules'); not a game fault.

**Cycle 6 — phone: d-pad dressed, and a hub-title void fixed.** (a) `.soho-dpad button`: radial brass-dark ground, hairline gold border + offset outline (the notebook-tab register), inset lip, gold glow on the glyph; `:active` warms and glows. (b) FOUND on the 375px pass: the hub title `<h1 class="game-title">` had an inline `font-size:2.2em`; beside the floated lamp the word SHUFFLE could not fit the column, dropped BELOW the lamp, and the lamp/sizeLamp loop grew the title block to ~690px of void. The inline size moved into `.game-title` CSS and a `@media (max-width: 640px)` rule scales it `clamp(1.4em, 7vw, 2.6em)`; at 375px the title is 85px tall, lamp 350, map at 357px from the passage top (was 940). The h1 markup lost only its style attribute; the words are untouched.

**Cycle 7 — tarot spread clipped on phones.** At 375px the three `.tarot-card`s (`clamp(96px, 29vw, 150px)`, `flex-shrink:0`) overflowed the Trisha frame and were cut off left and right (PAST/FUTURE half-hidden). `.tarot-slot` is now `flex:1 1 0; min-width:0; max-width:150px`, `.tarot-card { width:100% }`, spread gap `clamp(10px, 3vw, 16px)`; the lone second-look card keeps its own `clamp(150px, 56vw, 230px)` via `.tarot-spread-one .tarot-slot { flex:0 0 auto; max-width:none }`. Verified at 375: three cards inside the frame, flip + label + meaning work; desktop cap unchanged at 150px.

**Cycle 8 — the two doors drawn.** The Colony Room Door (the Left/Right knock the Donkey decides) was prose on plain dark. An inline ink plate (`.two-doors-plate`, `#dss-ink-fine` filter, hairline gold on the house dark) now sits above the prose: brick courses, two identical arched doors with fanlights, four panels, a ring knocker and a step each, the kerb line beneath, a faint moon-glow over the wall. Deliberately identical so the plate spoils nothing. Verified: renders, 0 tw-errors, Left/Right/Toss the Donkey untouched. Prose untouched. Systemic ideas looked at and LEFT: tw-link already has hover/focus glow; a rise-in on `passageFadeIn` was rejected because a transform on tw-passage would make it the containing block for fixed-position descendants (3D wraps, overlays).

**Cycle 9 — Lackland's backroom lit.** `tw-passage[tags~="venue-lackland-back"]` (Back Room, Watch the decider, PP Victory/Defeat): `::before` = a cool white-green strip-light fall from the top centre with a slow stepped flicker (never off; 5.5s cycle, reduced-motion stops it) + the green of the table rising faint from the foot. Verified on Lackland's Back Room and PP Victory (gold banner from cycle 3 also confirmed), 0 tw-errors.

**Cycle 10 — the Coach and Horses lit.** `tw-passage[tags~="venue-coach"]:not([tags~="venue-gents"])::before`: gantry/optics amber from the top left (8s breathe), mahogany warmth down the right, a line of brass-rail light at the foot. The gents (tiles) explicitly excluded and confirmed untouched. Verified on Coach and Horses bar, 0 tw-errors.

**Cycle 11 — The Interval lit.** `tw-passage[tags~="interval-radio"]::before`: red carpet worn thin rising from the foot, the brass banister's warm line down the right edge, the spare radio's amber dial low on the left breathing on a 6s cycle. Verified on a fresh-state jump (the passage redirects to the hub once the night has started, so wipe storage to see it), 0 tw-errors. Survey note: every venue interior now carries its own light (French/Chippy/Trisha's/Pillars/Colony/Ronnie's/gents had scenes already; Lackland's office + backroom, Cecil Court, the Coach and the Interval got theirs tonight).

Check: Dawn Approach Black carries the moved star — later CONFIRMED BY EYE with the tab fronted: overlay at opacity 1, `.iframe-ready` set, the five bells on the new points over Oxford Street, 0 tw-errors.

Checks after the CSS round: (i) the rules card raised from a tagged passage (Cecil Court Waltz) is body-level and stacks above the header — `isolation: isolate` on the tagged passages confines nothing that matters; grep confirms no fixed-position markup inside any tagged passage. (ii) Hub at 1100px: map beside the lamp (424×538, height-capped), 9 labels, 0 overlaps, 0 errors.

**Sound: hard-muted again overnight (Sam, mid-run: 'Please turn the sound onto mute, you are keeping me awake').** The pane's game tab was muted at once (`dssAudio.setMuted(true)`, `dssMuted2=1`), then `DSS_SOUND_OFF` set back to `true` (line ~461) and synced; tab reloaded onto the muted build, `isMuted()` true, no audio elements playing. Item 5's 'audio restored' is therefore reverted: flip the flag to false when Sam wants sound back. Cycle 8 follow-up: the two-doors SVG had `height='auto'` as an attribute (Chrome logs 'Expected length'); moved to the style attribute, verified clean.

**Cycle 12 — the pavement pages.** New tag `street-night` on eight plain transit passages (Colony Member, After Cecil Court, Failure: Trisha's, and the five dream-world Returns — header tags only, prose untouched) with one shared wash: a far sodium lamp high on the right (11s breathe), the wet pavement's cool sheen at the foot. No rain (Ginger Light veto respected everywhere). Verified on Colony Member and Failure: Trisha's, 0 tw-errors, muted.

**Cycle 13 — a shooting star over Soho.** Map engine: `S.meteor`/`S.meteorNext` (first after 40–100s, then every 45–120s); a one-second streak (24–34 frames, 2.2–3.4px/frame right, 0.5–0.9 down) drawn in the sky band before the SKY translate, ivory line with a white head, fading over its life, never below the roofs. Verified live by forcing `state.meteorNext = 0`: spawns, travels ~110px, expires, reschedules (next 57s); tick running at ~50fps; 0 tw-errors.

Check at 375px after the CSS round: no horizontal overflow on Lackland's Office (the record hangs at right:-0.4em inside the passage), The Colony Room Door (doors plate scales), O'Flatterly's shop — `scrollWidth` = viewport on all three.

**Error sweep (raw debug jumps, 13 passages):** the five 3D approaches (French, Coach, Pillars, Lackland's, Copper's Lair — canvases present) and Copper confronts, Shana's Verdict, His round, The Empty Glass, LINE 2, Maltese Gangsters, No more, O'Flatterly's quest: 0 tw-errors each; the console carries only the four stale messages from earlier in the run (my mistyped jump ×2, the since-fixed svg height ×2). Nothing new.

**Cycle 14 — last of the off-palette feedback.** Inline mint/pink in JS: the fight's end labels (KNOCKOUT / STANDING / DOWN, ~12935/12940), the fight's call-out colour (~13035), the pong DEFEAT label (~40272) and their glows → gold `#f0dca0` / ash claret `#d8a090`, glows `rgba(232,196,110,…)` / `rgba(200,110,90,…)`. Zero `#aaffaa` / `#ffaaaa` left in the twee.

Final real-walk smoke after all changes: BEGIN → Night Ahead → hub → notebook (six tabs) → See who's there: 0 tw-errors, muted.

**Cycle 15 — Centre Point's windows go out as the night runs down.** `drawSky` reads the turns left off the header text ('N TURNS LEFT', DOM bridge — Harlowe state isn't exposed) and sets the dark threshold `0.70 + (1 − left/16) × 0.26`: ~30% of the honeycomb lit with the whole night ahead, ~4% on the last turn; the dawn-offered state (north door open) still lights it dawn-rose. `window.__dssSkyTurnsLeft` exposes the read for testing. Verified: 14 and 13 read back correctly on two states, 0 tw-errors. The base is rebuilt on every hub render, so the tower dims lap by lap.

**Cycle 16 — a cloud across the moon.** Map engine: `S.cloud`/`S.cloudNext` (first after 50–140s, then every 90–210s): three overlapping night-dark ellipses with a faint lit upper rim drift in from the right at 0.06–0.11px/frame across the moon's height and out to the left (about two minutes to cross), drawn per frame in the sky band after the meteor. Verified by forcing `state.cloudNext = 0`: spawns at x=454, drifts, 0 tw-errors.

**Cycle 17 — the doors answer the hand.** On The Colony Room Door, hovering or focusing the Left / Right link lights that door's fanlight (`.two-doors-plate.lit-left #td-left .td-fan` → gold at 0.42 with a soft glow, 0.45s ease); a small passage-local script toggles the class on mouseenter/leave and focus/blur. Verified: class toggles, left fanlight fill 0.42 vs right 0.10, clears on leave, 0 tw-errors. The DBG-Complete state redirects past this page (`$metDavy`), so test it on a fresh save.

**Cycle 18 — the typewriter stains settle.** `.typewriter-page::after` (the wine ring + burns layer, all typewriter pages except Night Ahead's own inline ring) now arrives a beat behind the paper: `twStainSettle` 1.9s from opacity 0 / scale 1.035 (origin at the ring) to rest, 0.35s delay, reduced-motion off. Verified on The dark pass: animation running at load, settled at opacity 1 / identity after 2.6s, 0 tw-errors.

**Cycle 19 — the far roofs go dark with the tower.** The turns-left read in `drawSky` moved above the roof loop; the far roofs now carry small attic lights (`seeded(c,11,17)` above `0.55 + (1 − nightFrac) × 0.4`, dull gold 2×2) that thin out as the night runs down alongside Centre Point's windows. Verified on the hub: read = 15, map alive, canvas present, 0 tw-errors, no new console messages.

Phone pass (375px) after cycles 10–19: Coach and Horses bar, Cecil Court (HAUNTS explainer opaque — the backdrop fix holds on phone too), Lackland's Back Room — no horizontal overflow, 0 tw-errors each.

**Cycle 20 — keyboard focus rings on the new buttons.** `.soho-dpad button`, `.nb-tab`, `.nb-inv-btn` and `#bar-start-btn` joined the shared gold `:focus-visible` rule (~55346) so a keyboard user never gets the browser's blue ring on the house palette. Programmatic `focus()` in the pane doesn't trigger `:focus-visible` (the button's own decorative outline showed instead), so this one is verified by the rule, not by eye.

Looked at and left: the cow ride's end (`drawEnd` ~44402) already has gold sparks, a warm flash and gold type — at standard. Final smoke #2 on a fresh save: BEGIN → Night Ahead → hub → NOTEBOOK → MAP tab renders → close: 0 tw-errors, muted, sky read 15 (only the Ginger Light is open on lap 1, as designed).

Phone check: the Dawn ending at 375px — astral wheel, sprig and the star below it render, no horizontal overflow, 0 tw-errors.

**Cycle 21 — the Giant Steps notation breathes.** The notes group in `:: Ronnies Rule SVG h14` is `.rn-notes`, easing 0.78→1→0.78 over 6s (reduced-motion off). Verified live on Ronnie Scott's: animation running, 0 tw-errors, muted.

Looked at and left: LINE 2 (Green Sea bar arches), LINE 2 Oxford (the polaroid), LINE 3 (the dawn-sky panel) — all carry their own scene.

Looked at and left: The Synthesis (pink prose, the hexagram arrives after the fifth gift — Sam's). Pane parked on the muted title with storage wiped.

The meteor and cloud (cycles 13/16) are verified by state, not by eye: at the pane's width the map is ~230px wide and the sky band ~18px, below what a screenshot resolves. Sam should watch the sky for a minute at desktop width.

Run ended 07:46: 21 cycles, all synced (198 passages in the html), pane parked on the muted title with storage wiped (`isMuted()` true, nothing playing). Uncommitted — Sam commits via GitHub Desktop.


### Addendum 9 — SOUND PASS (2026-09-11 morning; Sam: 'do the same to sounds and add sounds where more could be used'; build stays HARD-MUTED until he's ready to listen)

**Test rig:** `scratchpad/make_silent_build.py` writes `scratchpad/silent.html` (served on :8734): the real html with `DSS_SOUND_OFF=false` and a prelude that routes every AudioContext through a gain of 0 and mutes media elements — the whole audio graph runs, nothing reaches the speakers. Rebuild it after every sync. Verify by wrapping the EXPORTED `window.dssAudio.*` entries with counters (internal closure calls, e.g. doorMap's `dssAudio[fn]`, are invisible to a grep for `dssAudio.fn(` — several 'orphan' sounds were in fact in use).

**Cycle 1 — the walk, the doors, the cellar.** (i) Map footsteps: `dssAudio.mapFootstep()` (new; `footstep('cobble')` via a `_noDuckNext` flag so the hub theme isn't pumped, rate-limited to one per 160ms) fires when a step lands in the map tick. (ii) Cellar drips: new generic `startTagTicks(tags)` scheduler in the audio system (`TAG_TICKS` table; cleared and re-armed on every passage change; `tagTickCount()` for tests) — `venue-cellar` drips every 5–12s. Armed from the passage hook next to the beds updater. (iii) `street-night` pages now count as outdoor for the procedural traffic bed. (iv) Venue doors already fire on ENTERING a venue (hook doorMap: Trisha's swing-bell, Ronnie's curtain, French/Colony creak) — my map-click doors were removed as doubles; the chippy (no venue tag) rings its shop bell from the map. FIXED a gap: `venue-pillars` was in doorMap but missing from the VENUES list, so the Pillars door never sounded; added. Verified in the silent build: 2 steps counted on a 3-tile walk, French click → creak ×1 (before the move), cellar `tagTickCount()` = 1 with 13s clean, Pillars now registers as `_currentVenue`, 0 errors throughout.

**Cycle 2 — beds audit, no change.** The Coach bar DOES have a bed: `coach-bar` (the-coach-night-ambience) is registered with no tags on purpose and started by hand by the SpewPopup after the gents intro so it never collides with the gents bed. Outdoor/pavement pages get the procedural traffic bed (drips + horns); dream worlds get the wind; every other venue has its tag bed. Left alone.

**Cycle 3 — map street life.** New in the audio system (all un-ducked, self-contained noise helper `_noiseBuf`): `mapCab()` — a 6.8s brown-noise engine pass under a 240Hz lowpass with a thin 2.2kHz tyre hiss, swelling to 0.075 and away; `mapPigeons()` — seven 82ms wing-beats of bandpassed noise decaying over 0.7s, one per scatter (900ms rate limit); `mapMatch()` — the existing `matchStrike` without the duck. Hooks: cab spawn, pigeon scatter, the passer-by's pause under a lamp. Verified in the silent build by forcing each trigger: cab ×1, pigeons ×1, match ×1, context running, 0 errors.

**Cycle 4 — hand sounds.** New un-ducked SFX: `cardTurn()` (a 75ms paper snap, bandpassed noise + a 140→70Hz thump) on `dssFlipCard` in both Shana Reads and Shana Looks Again; `tabTick()` (a 40ms index-card tick) on every notebook tab change; `coinPocket()` (a 3.1kHz ping into a lowpassed cloth thud) on the pavement coin's 'Pocket it'. Verified in the silent build: card ×1 on a real flip, tab ×1 on a real tab click, coin ×1, 0 errors.

**Cycle 5 — ping pong plays.** Pong's paddle hits used `vialClink` (a glass sound that ducked the pongmini loop on every hit). New un-ducked `pongTock()` (celluloid on a bat: 30ms noise click + a 1.15–1.27kHz sine falling to 0.7× over 55ms) on both paddles, `pongWall()` (lower, softer) on the top and bottom edges, `pongPoint(won)` (two triangle notes: 880→1320 for you, 440→330 against) at `pointEnd`. Verified in the silent build over nine seconds of play: tock ×1, wall ×1, point ×2, 0 errors.

**LISTENING CHECKLIST FOR SAM (the build is still hard-muted — say the word and I flip `DSS_SOUND_OFF` to false, or do it yourself at UserScript ~461):**
1. Hub: walk with the arrows — cobble steps under the theme, the theme must NOT pump. Wait a minute: a cab crossing Old Compton (low engine swell + tyre hiss, occasional horn), pigeons scattering when you walk at them (wing beats), a passer-by stopping under a lamp (match strike).
2. Walk into the Pillars: a pub-door creak should now sound on entry (it never did before). Trisha's: swing door + brass bell. Ronnie's: the velvet curtain. The chippy: the shop bell from the map click.
3. Cellar (Maltese Gangsters / Standing / Beaten): a drip every 5–12s under the pump bed.
4. Pavement pages (Davy outside, the dream Returns): the distant-traffic bed should run there now, as on the other outdoor pages.
5. Trisha's tarot: a paper snap per card turned. Notebook: a tick per tab. The pavement coin: a ping and a cloth thud on 'Pocket it'.
6. Ping pong: tock on the bats, softer tock on the edges, a two-note point; the loop should hold steady under them.
7. LEVELS, your ear not mine: the beds sit at 0.16–0.50 (French 0.16, Cecil 0.18, cellar 0.18, Colony/Trisha's 0.20, Pillars 0.20, gents 0.22, mini-games 0.22, Interval 0.28, Ronnie's 0.30, Lackland 0.30, piano 0.30, pyre 0.40, Carthage shore 0.50). The new SFX sit at 0.045–0.12 peak. Tell me what's too loud or too shy and I'll retune in one pass.
Not touched: the waltz's own AudioContext (scene-local), the cow's dodge/moo/hoof set, the fight's punches, the bar game's pours (all already sound); the licensed placeholder beds (your replacements later).


### Addendum 10 — SCROLLING SOHO: the big map, the camera, the edges, the alleys (2026-09-11)

Sam: "like the early Pokémon games the map moved with you… walk the whole of Soho… surprises… multiple doors to piss in… mugged if you take a wrong turn." Rulings: world 52×44 (my recommendation, twice the old size each way); obvious alleys where they really are + hidden ones towards the edges and in Soho Square; at the edge you walk off and come back a moment later.

**Engine (UserScript `// ====== SOHO MAP`, rewritten in place; the old block was 49.8 KB, the new 54 KB; source kept at scratchpad `sohomap_v2.js`):**
- World `COLS=52, ROWS=44`, view `VC=26, VR=26` + the 3-row sky; canvas 416×464; base + glow canvases are world-sized (832×704) and blitted at `-cam`. CSS aspect 26/29, `.soho-map-stage` now `overflow:hidden`.
- Streets from `roadAt()`/`TILE[][]`: Oxford St (rows 1-2) along the top, Shaftesbury Ave (41-42) along the bottom, Wardour (5-6), Dean (17-18), Frith (29-30), Greek (41-42), Charing Cross Rd (49-50); Manette (8-9, Greek→CX), Bateman (15-16, Wardour→Greek), Old Compton (27-28, Wardour→CX), Romilly (35-36, Dean→CX); Soho Square = ring road 32..39×4..11 round a railed garden (`G` tiles, walkable). Pavements are every tile orthogonally adjacent to a road. Alleys (`A` tiles, walkable, darker flags): St Anne's Court r20, Meard St r23, Bourchier St r32 (all cols 8-15), Richmond Buildings r12 (20-27), Bateman's Buildings r24 (32-39), Walker's Court r31 (0-3, runs off the west edge), Greek Court r39 (44-47). `streetName()` names all of them.
- Doors at their real Soho spots (world tiles): French (15,25) west side of Dean; Colony (20,24) east side; Ronnie's (27,23) west side of Frith; Lackland's (32,21) east side; Coach (39,33) west side of Greek by Romilly; Pillars (44,11) at Greek/Manette; Trisha's (44,19) east side of Greek below Bateman; chippy (15,6); doorway (15,30); spots: Ginger Light (19,26) Dean/Old Compton corner, Cecil Court (51,38) the mouth on Charing Cross Rd, Centre Point = the north exit at (17,0) onto Oxford St. 33 lamps.
- Camera: `S.cam` lerps (0.16) to centre the figure, clamped to the world; HTML overlays (labels, doorway marks, spill, chevrons) carry world px in `data-wx/wy` and are re-placed every frame the camera moves (`placeOverlays`), hidden when off-view; `settleLabels` (no-overlap) runs when the camera comes to rest, via a per-label `data-dy`.
- Sky: drawn per frame; stars/moon fixed, far roofs drift at a third of camera speed, Centre Point tower over Dean's head at half speed; the turns-left window logic kept.
- EDGE BEAT: stepping off the world from a walkable edge tile → `S.edge`: 20 frames out (1.7 tiles beyond the edge, clipped by the view), a pause, a turn to face back at frame 40, 20 frames back; input ignored meanwhile; footsteps at both ends. The north exit (Oxford St, cols 17-18) still goes to Centre Point.
- Street life re-scoped to the view: walkers spawn at the view's edges on full-length pavement rows (0,3,26,29,40,43); the cab runs Old Compton rows 27/28 across the whole world (its sound only when in view); pigeons relocate within the view; the cat picks lamps within 14 tiles.
- Spawn: outside the last door used, else Dean Street (17,22).

**Alleys and corners (10 event spots, `event:true` doors, no label/mark; obvious ones get a faint pool when live, `hidden:true` ones show nothing):** meard (11,23), stannes (11,20), bourchier (11,32), richmond (23,12), batemans (35,24), walkers (2,31), greekcourt (45,39); hidden: square (35,7) the garden's centre, foyles (51,5) Charing Cross Rd, oxfordend (51,0) the NE corner. Each fires ONCE a night: the hub carries a docked `<div class="soho-alley-links">` of `(unless: $alleys contains "id")[[[Name|Alley: Name]]]` links the map reads like doors; walking onto the tile clicks the link. New passages `:: Alley: <Name>` ×10, tagged `street-night`, ALL PINK DRAFTS for Sam, each sets `$alleys` + `$alleyReturn` and returns to Dean Street; **the hub's lap increment is now guarded** (`(if: $alleyReturn is true)[…](else:)[(set: $returns to $returns + 1)]`) so a wrong turn costs no lap. Effects (placeholders, retune freely): Meard +5 morale (a record upstairs); St Anne's Court +8 sobriety (a doorway to piss in); Bourchier Street MUGGED — takes the pocket key if held (its var → "spent"), else −12 morale; Richmond Buildings +2 (a cat at a dead end); Bateman's Buildings +3 (a drunk wants a light; branches on $hasMatches); Walker's Court −4 (turned away); Greek Court +6 sobriety (a second gents); Soho Square +8 (the locked garden, the king's statue, a bench); Charing Cross Road +3 (Foyles dark); Oxford Street's wrong end MUGGED as Bourchier. Old-save guards on `$alleys`.
- Verified in the silent build: world renders 0 errors; camera 72→104 walking east; Walker's Court named in the bar; edge beat at (0,31) → px −27, turn, back to 0 facing right; Meard, St Anne's, Richmond all fire their passage (pink), return to the hub with the link gone and the figure on the alley tile, and the turn count on the alley pages stays at 7 across visits (the hub shows one fewer by its own display rule).
- FOR SAM: the mugging cost was my guess (pocket key, else −12 morale) — retune; the pink lines are yours; the notebook plan still shows the compressed layout (same fudge, fine); the phone d-pad still works (checked below).

Phone (375px): the view fills the column (312×348), sky band with moon and tower, Richmond Buildings named in the bar with the figure inside it, the square's garden in view, labels and doorway marks placed, d-pad live, no horizontal overflow, 0 errors.


**Venue sides, as placed on the scrolling map (for Sam to correct):** French — Dean, WEST (he says wrong: east, just north of Old Compton); Colony — Dean, east; Ronnie's — Frith, WEST (probably wrong: east, opposite Bar Italia); Pillars — Greek, east at Manette (the arch is on the east side); Coach — Greek, west at Romilly (unsure); Trisha's — Greek, east below Bateman (unsure); Ginger Light — Dean/Old Compton east corner (fictional); Lackland's — Frith east (fictional); chippy — Dean west, north (fictional); doorway — Dean west, south of Old Compton (fictional); Cecil Court mouth — east edge of Charing Cross Rd, south; Centre Point exit — top of Dean onto Oxford St.

### Addendum 11 (2026-09-12): key states split

- Mugging outcomes (Alley: Bourchier Street, Alley: Oxford Street End) now set the taken key to `"stolen"` instead of `"spent"`. The five third-pillar crossings still set `"spent"`. Key Guards comment lists all five states. Nothing reads either state yet; Sam is inventing recovery routes per key.
- Venue side corrections on the scrolling map are parked (his table of sides is in the PAUSED HERE note above).

### Addendum 12 (2026-09-12): the stolen notebook (Sam's own story)

- New state `$notebook`: "held" | "stolen". Guarded in Key Guards and in the header; init at the top with the key vars.
- Alley: Bourchier Street now takes the NOTEBOOK first (sets "stolen", `NOTEBOOK TAKEN` note); the pocket key / morale branches only run if the notebook is already gone. Oxford Street still takes the key.
- While stolen: header NOTEBOOK is a struck-through non-link (`.notebook-gone`, title explains), the alba-hint reads "Your notebook is gone, and the poem with it.", and Approach Centre Point routes to Alba Incomplete even with all three lines (the poem is in the notebook).
- Recovery: Watch the decider (Lackland's back room) shows the notebook on the table when stolen (Percy found it, does not know it is yours) and sets `$notebookStake`. PP Victory hands it back (`$notebook to "held"`, OBJECT RECOVERED box); PP Defeat leaves it there, retry allowed on a later lap. All new copy is pink for Sam.
- Fixed: Key Guards ended with a trailing `\` that printed a literal backslash wherever it was displayed mid-passage (pong room, alleys).
- Verified live on :8735 (muted): theft, header lock, hint, pong table text, forced win, header link back on Dean Street.
- MAIN recovery (Sam's own story): the fence on Charing Cross Road. Alley: Charing Cross Road shows a man with a holdall outside Foyles while `$notebook is "stolen"`; with a pocket key the link "Trade the <key> for the notebook" sets that key to `"traded"` (new state), empties the pocket and hands the notebook back; with an empty pocket he tells you it will keep. The hub link stays open while stolen even after the spot has been visited (`$alleys` add is now idempotent). The pong table is the second route. Verified live: empty-pocket refusal, cocaine trade, header link back, hint cleared, link closes again.
- (later, same day) Bourchier Street is now a CHOICE, from Sam's own story: three in a doorway, one offers a joint "round the corner where the law don't bother". `Go with him` → `Bourchier Street: The Car Park` (underground car park off Brewer Street): steals the notebook if held (else a friendly nothing). The thief's line names the Charing Cross Road fence outside Foyles; that is the only hint (item 1 of the two proposed; the map mark was not built). `Stay where you are` → `Bourchier Street: The Doorway`: the old key/morale mugging. Both new passages are `street-night`, both link back to Dean Street; `$alleys`/`$alleyReturn` are set on the parent so the alley closes after one visit either way. Nobody can be mugged twice by the same gang (each wrong turn is one-shot via `$alleys`). Verified live on a cleared save (localStorage AND sessionStorage "Saved Session" must both be cleared for a fresh state): theft + hint, empty-pocket car park, doorway key mugging, hub lock afterwards.
- Pyramid: the slate-eyed glimpse in the King's Chamber granite is CUT. The pyramid now belongs to The Bard, Al Hubz (a one-line pink placeholder sits where the glimpse was; Sam writes him). The slate figure remains in the Airport Pub / Cave / Nazca centre / listening moai; Sam will name him (he is a real friend, NOT John St. John, whose slate eyes at the French are currently the only Soho tell; needs a new tell or a Soho appearance once named).
- Al Hubz now threads the whole pyramid: heard humming below in the Descending Corridor, hum with the shape of words at the top of the Grand Gallery, met in the King's Chamber (all pink placeholders). The slate-eyed figure is confined to the India (Himalayan) world: his tells are cut from the Nazca sketcher ("You have never met him") and the listening moai (eye now just "Open") and the prophet on the Plain of Chebar (was "His eye ... is slate"; now a man you have not met yet). Nazca, Easter Island and Ezekiel figures are now OTHER people for Sam to cast. "You know whose name it is" in The Glyph is left as-is (pink) for him to point at the new Easter figure.
- Nazca centre rewritten (pink): the sketcher is gone. The figure now kneels by a cairn made of blank pages, tearing empty leaves from his notebook and throwing them so they land exactly; the one that lands perfectly is yours and carries the bird with you as the dot. He is the DRIVER OF THE BLACK CAR from the Nazca Race: the car sits parked at the centre, no dust on it, with a won/lost line keyed to $nazcaRaceWon. Based on Sam's friend Joe Gallagher; Sam will name him. Gift link "Take the tracing" unchanged.


### Addendum 13 (2026-09-12): Himalaya climb visual + play pass

Sam requested both visuals and play improvements. Completed and synced; see `HANDOFF-climb-work.md` for details and verification. New mountain art, separate touch controls, pause/fullscreen, fairer footprints/breath, touched checkpoints, reliable ladders, repaired yeti/cave ending. Narrative untouched. All 42 route transitions pass physics checks; both endings and real-game desktop/phone layout checked. No commits made. Sam’s next step: play the revised ascent, especially the ravine.
- Easter Island rewritten (pink, all four passages): a revolutionary force has taken the island at moonrise "in the name of the ancestors" (white sign painted on the moai, the rocks, his cap). The figure is a balaclava'd pipe-smoking fighter in the Subcomandante Marcos mould, based on Sam's friend Costa; he meets you between the fifth and sixth moai, stands behind you while the moai speaks, and says the word is the name they fight under. The Glyph: the rubbing is that sign; "you know whose name it is now. It is not his." Sam will name him. Mechanics untouched (MORALE -6, rubbing links, alba attend, turn-back).
- Ezekiel: the prophet is UNIDENTIFIED by ruling (line now "It is nobody's face"); the woman among the eyes on the wheel rims (alba-2 attend moment in The Wheel) is to be based on Sam's old friend Nicole: from the north of England, studious, slightly neurotic, a very brilliant mind. He writes her.
- Dream-world cast summary: India = Sam's friend John (slate eyes, name TBC); Nazca = black-car driver / page-cairn thrower (Joe Gallagher, name TBC); Easter Island = revolutionary with pipe (Costa, name TBC); Pyramid = The Bard, Al Hubz; Ezekiel = anonymous prophet + the woman (Nicole, name TBC).
- Nicole's figure now appears earlier in the Ezekiel world (pink): reading cross-legged on the Plain of Chebar with a pencil and three stone-weighted books ("I've been at it since Tuesday"); pencil-in-pencil-out as the storm comes; on her feet holding the book and looking straight at the four when the prophet is on his face. Pays off at the wheel as the face among the eyes.
- India world, Sam's friend John (stoic; a lawyer who left the law to seek enlightenment): Soho remnant = the orange Chariots of the Gods paperback face down on the bar at The French, red biro underlining showing through, nobody owning it (pink, always visible, sits just above the lighter offer). The Cave recognition now carries the lawyer's habit: he writes the six syllables exactly and reads them back to check you have each one; "the one thing he did not leave behind". John St. John keeps his slate eyes at the French (separate character). Name TBC.


### Addendum 14 (2026-09-12): Pyramid Run visual and play pass

Sam chose the proposed pyramid overhaul after the Himalaya work and said “Yes do it.” Completed and synced; no git commands. Prose, continuation links and the original bonus (4 marks, <=3 stumbles; morale at King's Chamber) preserved.

- Visuals: distinct descending corridor / stone pursuit / tall Grand Gallery; corbelled courses, incised jambs, larger recessed guardians, separate gallery limestone courses, bright final doorway, revised rim-lit coat silhouette and running pose, clearer pit lips and lintel duck cues, stone carving and dust, phase/progress display. Canvas 720x540; responsive frame, clear start/rules card, independent touch buttons, pause and fullscreen.
- Play: game-clock timing freezes hazards on pause/tab blur; input cleanup and keyboard focus restoration; more forgiving buffer/coyote; actual airborne collisions against risers and lintels; grounded torch respawn resets pursuing stone behind player; gallery checkpoints added. First scarab patrol shortened away from the next pit; second moved out from under a duck-only lintel into Gallery. Stone radius 53, warning before spawn, chase camera looks farther back and chase pace keeps the stone visible. Grounded arrival followed by a 2.2s quiet Gallery reveal, then existing result and link; fullscreen exits to reveal continuation.
- Audio: scene-local filtered stone rumble, low impact, resonant mark tones. Starts on user gesture, respects master mute, pauses and disposes. Listening balance remains for Sam's ears.
- Verified in an extracted-source browser fixture: complete input-driven run 20.16s, 5 marks, 1 stumble (bonus); no-input mercy run reaches end at127.6s with all three pits filled; duck clearance and jumping lintel collision; pit recovery; both endings; pause clock/focus; simultaneous phone hurry+duck; fullscreen exits at result. Zero JS errors. Real compiled game checked at localhost:8735 for desktop + 375px phone: zero JS/tw-errors and no horizontal overflow. This is simulated play, not a human difficulty verdict.
- Reproducible checks in scratchpad/pyramid-review/: build_fixture.py, browser_checks.cjs, mercy_fullscreen_checks.cjs. Fixture hooks are confined to the generated temporary test page, not shipped in the story.
- Next: Sam plays the pyramid, preferably expanded, and judges darkness, chase pressure and sound balance. All changes uncommitted.


### Addendum 15 (2026-09-12): Pyramid Run creature extension

User asked for a longer, more imaginative continuation: a snake pit crossed via hopping on snake heads, a Nile crocodile whose mouth opens and shuts, and a worshipped cat. Added after the stone chase: Temple Cat at 3600; snake well 3760–4360 with four animated cobra-head platforms and sand mercy; crocodile gate 4610–4820 with timed jaw, tunnel transit and light checkpoint; extended final Gallery/world end to 6900. Existing prose, reward and links untouched. Synced. Source syntax check passes. Luna delegation could not run because account usage was exhausted; this was completed in the parent thread. Full browser rerun was unavailable after that account limit; prior fixture and a manual source audit remain available in `scratchpad/pyramid-review/`.


### Addendum 16 (2026-09-12): Pyramid Run creatures continued

The user asked to continue the Pyramid Run with a longer, more imaginative stretch: a snake pit crossed by hopping on snake heads, a Nile crocodile with opening/closing jaws, and a worshipped cat. Added and synced: Temple Cat encounter at x3600 (hold down to greet; then cat leads and reveals an extra hidden resonance mark), snake well x3760–4360 with four animated cobra heads as the safe platforms plus three-fall sand mercy, crocodile gate x4610–4820 with cycling upper jaw, wait/enter cue, tunnel transit and new torch checkpoint, and extended Living Gods/Grand Gallery to world end 6900. Added local stone/mark audio hooks, dust, warnings and phase labels. Existing prose, variables and links preserved. Source syntax check passes; game opened in local browser at the Pyramid Run start with zero reported JS/twine errors. Full browser simulation could not rerun because the account usage limit also blocked elevated browser launch; do not overclaim human playtest. All changes uncommitted.


### Addendum 17 (2026-09-12): Cow Ride visual pass

User asked to improve the Cow Ride and, if possible, continue with Luna. Luna was unavailable because the account usage limit was exhausted, so the parent completed the work. Added a responsive framed arcade cabinet, route strap (Dean → Frith → Poland), moonlit Soho roofline with lit chimneys, and a rhythmic hoof-dust / tail animation. Existing dodge rules, timing, scoring, controls, prose and variables preserved. Source syntax checked; synced; opened the rebuilt live passage and exercised the keyboard controls with zero reported errors. Full automated replay was unavailable after the usage limit; human 40-second difficulty audit remains for Sam.

### Addendum 13 (2026-09-12): licensed ambience beds replaced with generated ones

- Sam ruled against on-site recordings ("won't be as precise as generated sounds"). All nine licensed field-recording beds are now SYNTHESISED (noise shaping in the frequency domain + sine partials + FFT reverb; nothing sampled): the-french-pub-ambience.mp3, the-pillars-pub-ambience.m4a, the-coach-night-ambience.m4a, the-quiet-cafe-ambience.m4a, the-gents-coach-toilet.mp3, the-cellar-pump-ambience.m4a, the-carthage-cicadas-ambience.m4a, the-green-sea-cafe-ambience.m4a, the-soho-dawn-ambience.m4a. Same filenames, so AUDIO_EMBEDS and the .twee bed table are untouched.
- Generator: `tools_make_beds.py` (project root; needs numpy + ffmpeg; `python make_beds.py <outdir> [bed_fn ...]`). 72 s seamless loops (3 s equal-power crossfade of tail into head, events wrap the seam), stereo, AAC 128k via aac_at / MP3 128k via lame. Each bed is loudness-matched to its licensed original (TARGET_LUFS table, measured with ebur128) so nothing in the .twee needed retuning. Verified on :8735: all beds fetch 200, no console errors.
- Originals moved (not deleted) to `licensed-originals/` (plus the unused the-ronnies-jazz-ambience.m4a, the .ogg/.wav sources and the cicadas backup). They still ship to GitHub Pages while in the repo; deleting them from the repo is Sam's call.
- What each bed contains: French = murmur + glass clinks + laughs + chair + bottle on zinc; Pillars = rowdier murmur + till + door; Coach night = biggest crowd + raised voice; quiet cafe = sparse murmur + fridge hum + cups/spoons + clock tick + coffee steam; gents = extractor fan + pub through the wall + drips + one flush and cistern refill, tiled reverb; cellar = cooler hum + cold air + drips + pump chug cycles (14 s on / 12 s off) + pipe knock; cicadas = 14 individuals at their own pulse rates + dry wind + far shimmer; green sea = sea wash (9.5 s swells with foam hiss on the crest) + wind + faint cafe + two far gulls; Soho dawn = traffic rumble + five car passes + blackbird phrases + small birds + pigeon coo + one milk-float rattle.
- SOUND AUDIT (for Sam's ruling): (1) the five dream worlds all share one generic wind (windFarnell) across 31 passages: they could each have a generated bed (Himalaya wind + prayer flags, Nazca heat + insects, Easter sea + wind, Pyramid stone quiet + hum, Ezekiel river + rising storm); (2) Colony and Trisha's share the quiet-cafe bed, could diverge; (3) the chippy, the alleys / car park, and the fence have no bed beyond traffic; (4) unused procedural SFX: fireFarnell, doorThud, doorSwingBell, pageShuffle, footstep, strike, ambientDream, phoneRing (phoneBell is used); (5) coach-bar bed is only hand-started (tags {}).
### Addendum 18 — Ronnie’s bar game groove pass (2026-09-12)
- Luna was unavailable again because the account usage limit was reached; the primary agent completed this pass.
- Ronnie’s bar canvas now sits in a dedicated velvet-and-brass club frame, with responsive spacing on narrow screens.
- Carry phase now seeds floating musical groove notes in the safe spaces between hazards. Catching three notes completes a phrase, restores one spilled drink (up to three), clears tray wobble and grants a short invulnerability window. A small groove meter and pickup feedback are drawn in the HUD.
- Source of truth edited in `Dream Street Shuffle.twee`; compiled output synced with `python3 sync_html.py`.
- Verification: sync completed and the compiled Ronnie passage still carries `venue-ronnies`; live preview was already available through the local browser, but full automated Playwright replay remains blocked by the account usage limit.
- (later) Seven MORE generated beds, per Sam's ruling on the audit (items 1, 2, 5):
  - Dream worlds, one each, matched on the world tag: `the-himalaya-ambience.m4a` (thin gusty wind + whistle + prayer-flag flutter + one far snow rumble), `the-nazca-ambience.m4a` (dry wind + heat hiss + crickets + a Cessna crossing once), `the-easter-island-ambience.m4a` (big slow night swells + wind + surf booms on basalt + run-off), `the-pyramid-ambience.m4a` (54 Hz pressure hum + stone ticks in a 4 s reverb + a held hummed note three times, the Bard under your note), `the-ezekiel-ambience.m4a` (river + wind that circles the listener over 37 s + thunder three times, each nearer + amber shimmer). Registered as world-himalaya/nazca/easter/pyramid/ezekiel (tags himalayan/nazca/easter/pyramid/ezekiel). The passage hook now calls ambientOff() instead of windFarnell() on those passages; sanctum/synthesis/pyre dream passages keep the old behaviour. Sam may write music for the worlds; these are room tone under it.
  - quiet-cafe bed REMOVED (file deleted, embed dropped) and split: `the-colony-ambience.m4a` (bright small room: murmur, ice, cackles, lighter clicks) on venue-colony; `the-trishas-ambience.m4a` (basement: electrics hum, few voices, bottles, footsteps overhead) on venue-trishas.
  - coach-bar bed now tag-matched on venue-coach with a new `notTags: { 'venue-gents': 1 }` (added to _bedShouldPlay) so it plays in Coach and Horses bar but never during the cubicle intro; the SpewPopup hand-start is unchanged.
  - All seven are NEW files: they must be committed for GitHub Pages. Verified on :8735: himalaya + colony fetch 200 on their passages; no new console errors (the two "Cubicle" errors in the pane log are from my own bad debug jump earlier).
### Addendum 19 — Pong sweet-spot pass (2026-09-12)
- Luna was unavailable because the account usage limit was reached; the primary agent completed this pass.
- Pong now rewards centre-of-paddle returns with a three-hit sweet-spot phrase. Completing it fires a faster “house special” return with a brief gold table flare and hit sparks; the phrase resets when the opponent returns or a point ends.
- A compact in-canvas cue tells the player how to build the phrase without changing the existing wager, opponent, or first-to-five structure.
- Source of truth edited in `Dream Street Shuffle.twee`; compiled output synced with `python3 sync_html.py`.
- Verification: pong passage script extracted and passed `deno check`; sync completed. Full automated replay remains blocked by the account usage limit.
### Addendum 20 — remaining minigames polish (2026-09-12)
- Waltz: dead-on three-step runs now build a visible CLEAN STEPS chain, with a warm acknowledgement that resets when a note is missed. Existing timing, scoring buckets and outcomes remain unchanged.
- Cellar fight: consecutive clean dodges/counters now appear as a CLEAN CHAIN call on the fight board, making skilled play legible without changing damage or verdict rules.
- Source synced with `python3 sync_html.py`; full UserScript passed `deno check`.
- Full automated replay remains limited by the account usage cap; no git commands run.
### Addendum 21 — Easter Island: The Reclamation (2026-09-12)
- Added a new `The Reclamation` canvas minigame between Among the Moai and The Listening Moai. The revolutionary hands you the rifle; the player aims and fires at moving occupation machinery and survey marks while avoiding the luminous ancestral spirits.
- Three waves / twelve targets: silence ten machines to win, or disturb three spirits and the man lowers the rifle. Mouse, touch and a wide reticle support the same accessible input pattern as the other canvas games.
- Distinct visual language: volcanic dusk, distant moai silhouettes, red occupation lamps, turquoise spirits, brass reticle and a compact progress readout.
- Added a separate link from Among the Moai so the player can choose to stand with the revolution, while the existing direct approach to the sixth moai remains.
- Source synced with `python3 sync_html.py`; the new game script passes `deno check`; compiled passage confirmed by targeted grep. No git commands run.
### Addendum 22 — opening walk-in (2026-09-12)
- Luna was unavailable due to the account usage limit; the primary agent completed the pass.
- Added `The Walk In` between `Name Your Book` and `Dean Street`. It is a short atmospheric threshold before the map: lit facades, a swinging lamp pool, a passing cab, wet road reflections, a faint Lily signal, and the existing morning-song direction.
- The scene respects the opening prose: the rain has stopped. There is no falling rain, only puddles, sheen, mist-light and one gutter drip.
- `Name Your Book` now enters the walk-in before opening the full hub map. Source synced with `python3 sync_html.py`; passage count is 212.

### Addendum 23 — visual ending switchboard (2026-09-12)
- Added a silent five-signal visual strip to both `White page` and `Black page`. The signals light or dim from existing play state (lilies, haunts, alba lines, human encounters, confidence) so the final black/white choice carries the night's texture without summary prose or a score.
- The ending structure and black/white pages are unchanged; this is atmospheric visual consequence only.
- Source synced with `python3 sync_html.py`; no git commands run.

### Addendum 24 — ending vine return (2026-09-12)
- Restored a fuller botanical presence around the ending switchboard: the existing four corner vines now reach farther into the page, with slightly richer strokes and a slower, more deliberate growth sequence.
- Black/white pages and their prose remain unchanged. Source synced with `python3 sync_html.py`.

### Addendum 25 — 3D render lighting pass (2026-09-12)
- Adjusted the Oxford Street, Ronnie's, and Green Sea renders: improved lower-frame readability, lifted Ronnie's night exposure without flattening its colour, and reduced the Green Sea's blossom/film veil around the entrance.
- Next pass: Cecil Court, the Pillars, and the French House received restrained exposure/ambient lifts; their scene-specific lighting remains intact.
- Methodical follow-on pass: Coach & Horses, Chinese Fish & Chips, and Lackland's Office received small exposure/ambient lifts after visual inspection showed their focal facades were sinking into darkness.
- These are standalone render files; no Twee sync was needed. No git commands run.

### Addendum 26 — 3D render lighting pass continued (2026-09-12)
- Adjusted Colony Room, Copper's Lair, and the Dean Street corner with restrained exposure and ambient lifts so their doors, signs and street planes remain legible.
- Centre Point also received a small lift; the historical Carthage coast render and saved/prototype files remain untouched pending a separate visual review.

### Addendum 14 (2026-09-12): the map's buildings get faces

- Map engine: new `FRONTS` table + `drawFronts()` (called in buildBase after the doors/steps, before lamps) and `drawFrontGlow()` (in buildGlow). Each venue's frontage (up to two facade tiles either side of its door, via `frontageTiles`) is redrawn with a front you can read without the label; `faceTile()` rotates the tile so every front is drawn with the street at the bottom. Fronts: Ronnie's magenta neon panels (dark when shut) with a pink pavement pool; the French's tricolour on a bracket + red-curtained window; the Colony's green-lit windows, brass plaque and dustbin; the doorway's red-shaded window and bell push; the chippy's wide lit window with fish fascia (dim unless open); the Coach's frosted pub windows, hanging lantern sign and awning; the Pillars' stone columns with a lantern; Trisha's basement railings and pink bulb; Lackland's green lamp window and brass plate. Landmarks off the door list: Foyles' lit window with book spines along the east edge (col 51, rows 2-8, door gap at the spot row 5) with a warm pool; the Tudor hut in Soho Square garden (36-37,7); St Anne's tower with clock and green copper bulb at (8-9,37-39). `drawFacade` also tints facades per block (warm red-brick blocks, painted-grey blocks) so districts differ.
- Dev hook: `window.__dssSohoTeleport(c, r)` drops the walker on any walkable tile with the camera snapped; used for inspection captures. Capturing the map in the pane: the tab reports hidden so rAF stalls; take a (tiny) screenshot action after a teleport to force a frame, then read the stage canvas. Inspection captures were POSTed to a throwaway local receiver (scratchpad recv.py, now stopped).
- Verified by capture at 2x: all fronts, the hut, the tower, Foyles' spines. No new console errors.
- Not done from the audit (Sam's call): street life (policeman / drunk wanting a light / taxi), windows going dark with the turns, a pull toward the hidden edge spots, a stronger lamp pool on the player.

### Addendum 15 (2026-09-12): street life on the map, the constable and the drunk

- Hub → map state bridge: Dean Street now prints two hidden spans `.dss-hub-flag[data-k=matches]` (1/0 from $hasMatches) and `[data-k=key]` ($dreamKey) just before the alley dock; the engine reads them with `hubFlag(k)`. Extend this rather than trying to read Harlowe from JS.
- Constable (`S.cop`, navy coat + helmet drawn over the sprite): spawns every ~30-60 s on a visible pavement row (LIFE_ROWS adds Bateman and Romilly to the passer-by's rows), walks his beat at 0.3 px/frame. If the player has stood still for 7 s (`S.still` > 420) on his row band and within reach, he walks over, stops a pace off and moves you on (note flash "A CONSTABLE"); with cocaine in the pocket the line is the longer look. Then a 60 s cooldown. No stat cost (map cannot write Harlowe state; make it a docked link + passage if a cost is ever wanted).
- Drunk (`S.drunk`, brown coat): staggers along a pavement row with a sinusoidal wobble, random pauses and turn-backs. If he reaches the player on his row he stops and asks for a light: with matches the note is the gentleman line + mapMatch flare; without, he tells you what he thinks. 45 s cooldown, once per drunk.
- Lines live in `STREET_LINES` in the engine (Sam's to rewrite; UI notes, not passage prose).
- Dev hooks: `window.__dssSohoLife(near)` forces both spawns (near=true drops the drunk beside the player); `window.__dssSohoTeleport(c, r)`. Verified live: constable approach + "Move along", drunk ask with matches=0 line. Remaining audit items: windows going dark with the turns, the pull toward the hidden edges, a stronger lamp pool on the player.

### Addendum 16 (2026-09-12): Soho goes to bed

- Map engine: `drawFacade` now records every ordinary warm-lit window tile in `WARM_WINS` with a seeded bedtime u in [0,1). Each frame `draw()` reads `window.__dssSkyTurnsLeft` (the sky already reads "N TURNS LEFT" from the stat bar) and paints dark every recorded window whose u < (1 - turnsLeft/16) * 0.92, view-clipped. So the first lap has every window lit and the last laps leave only a handful, while the venue fronts (FRONTS) and the tiles lit by an open door keep their own light. Nothing is rebuilt; it is an overlay on the static base.
- Verified by capture: same view at 15 turns left vs 2 turns left (`.night-cell` text edited in the DOM to fake the late night).
- Remaining audit items: a pull toward the hidden edge spots; a stronger lamp pool on the player.

### Addendum 17 (2026-09-12): the pull toward the hidden edges

- Each lure shows only while its hidden spot is still `open` (unvisited this night):
  - Soho Square: `S.sqcat`, a second cat sitting on the south railing of the garden (35,10). When the player is within 13 tiles it gets up and walks north into the garden and sits by the hut; if the player wanders more than 16 tiles off it goes back to the railing.
  - Charing Cross Road / Foyles: `S.porter`, a warm lamp that drifts up and down behind the book spines once the player is within 9 tiles of the door (someone inside after hours). If the notebook is stolen (new hub flag `data-k="notebook"`), the fence stands on the Foyles step instead, with his holdall open.
  - Oxford Street end: a lone figure under the corner at (50,0), facing away, a cigarette flare every four seconds.
- Verified by capture: the cat in the garden with the player at the ring road, then back on the railing from the far corner; the corner figure at the top-right. The porter's lamp is a 2 px dot and needs a closer look in Chrome.
- Remaining audit item: a stronger lamp pool on the player.

### Addendum 18 (2026-09-12): the walker's own light

- In draw(), before the sprite: a warm amber pool on the pavement under his feet (ellipse, radius breathing 0.85-1.0 on a 38-frame sine), a shadow ellipse thrown AWAY from the nearest lamp within 6 tiles (up to 3 px offset, stretched a little with the offset), and the pale halo widened to 17 px at 0.32 alpha. Verified by capture beside the Ginger Light lamp: pool + shadow + halo.
- All five map-audit items are now done (fronts, street life, windows dimming, edge lures, player light). Map dev hooks for future sessions: `__dssSohoTeleport(c, r)`, `__dssSohoLife(near)`.
- (last four minutes) The Pillars of Hercules ARCH across Manette Street: two stone piers on the pavements at rows 7-10 by the Greek Street end (cols 43-46), a span over the road with a lamp hung in the middle and a warm halo. Drawn in drawFronts, lit in drawFrontGlow. Captured; check it in Chrome at full size.

### Addendum 27 — 3D render lighting pass, standalone scenes (2026-09-12)
- Finished the remaining standalone renders with small scene-specific exposure/ambient lifts (toneMappingExposure / AmbientLight intensity): French House 0.55→0.64 / 0.25→0.31; Dean Street prototype 0.85→0.90 / 0.35→0.40; Greek Street 0.80→0.86 / 0.30→0.35; Greek Street North (Pillars) 0.80→0.86 / 0.30→0.35; Greek Street South (Coach) 0.75→0.82 / 0.30→0.35.
- Carthage coast was already at the target values (0.92 / 0.36) when checked, so it was left as found.
- All six inspected in the pane after editing: focal facades and doors read more clearly, palettes and nocturnal/historical mood intact, no console errors.
- Standalone render files only; no Twee sync, no `SAVED-*` backups touched, no git commands run.

### Addendum 28 — dream-world entry renders begin: The Enlightenment (2026-09-12)
- Dr Quill agreed the five dream-world entry passages (Airport Pub, Nazca Approach, Easter Island Shore, Pyramid Mouth, Plain of Chebar) should get 3D approach renders like the Soho venues; the portal is already 3D and three worlds end in a 3D/canvas set piece, so the entries were the visually flat link.
- The airport pub is now named **The Enlightenment** (his name, 2026-09-12). Register: timeless dream, the modern airport Wetherspoon as the shared reference, not 1973.
- `airport-pub-3d-static.html`: a FIXED offset shot in the format of the other `-static` files (no drag; he ruled the look-around pointless with nothing to look at, and asked for the detail level of the Soho renders). Camera on the concourse tiles to the right of the bay looking across and in, like his first reference: near mesh-cage pier at the right edge, riveted steel fascia with THE ENLIGHTENMENT in warm lit letters running off the left and BAR · RESTAURANT in red neon, gooseneck lamps over the sign, bunting on a string, exposed ducting and a spot track under the joists, boards centre and a swirly airport-pub carpet on the booth side (the prose has a carpet), pendants over dressed tables (pints, tea-lights, menus), dark seated silhouettes that shift, booths with brass wall lamps, the nearest booth table holding the orange-spined paperback and a napkin, a high table with stools by the pier, the bar with pump clips, till glow, a lit fridge, three shelves of bottles under a mirror, a glass rack, four clocks (LONDON / DELHI / KATHMANDU / CAIRO) and a TV on the back wall showing a departures board whose rows scramble and re-settle (DELHI / LIMA / HANGA ROA / CAIRO / BABYLON, one per world). Concourse: reflective tiles, troffers with one tired flickering tube, a duct, a security dome, a yellow gates sign hanging just off the right edge (it crowded the neon when in frame), a bin and an abandoned trolley in the foreground, an A-board, a green fire-exit sign further along the wall. All lettering is scene dressing and his to change.
- Not yet wired into the twee. Next: decide whether the entry render sits above the pink prose the way the Soho approaches do, then Easter Island Shore as the second (night, one moai, moonlit basalt).
- No git commands run, no sync needed.

### Addendum 29 — the five dream-world entry renders (2026-09-12, run 04:23–04:55 BST)
Standalone render prototypes only. No twee edits, no sync, no git, no `SAVED-*` / `BACKUP-*` touched. All five open from the dss-game preview (port 8732) at 1600x900 with an empty console. Same skeleton as the Soho `-static` files: three.js r128 from cdnjs, fixed camera (no drag), location label bottom + caps stamp top-right, click-to-enter alert stub with tooltip, resize handler, fog sprite layers, additive halo on every light source, slow ambient loop, exposure 0.68–0.78.

- **`airport-pub-3d-static.html` (The Enlightenment)** — reworked, not rebuilt. Exposure 0.92→0.74, scene fog 6–27, ambient/hemisphere/concourse fill cut so the tiles (now darker, glossier) only light up in the three fascia spot pools at the threshold, two of which cast shadows. Camera widened (fov 64, from 6.8,1.8,6.6 looking at -1.4,2,-6) so the concourse runs off to the LEFT along the terminal wall into the haze: shuttered units, columns, wall lamps with halos, seating islands, a far bulkhead. Fog: cool ground haze and mid haze the length of the concourse, warm haze under the sign, a little smoke-haze inside the bay. Halos added on every troffer light, the fire-exit sign, the booth wall lamps, the till, the fridge, the back-bar shelf lights, the TV, the spot-track heads, plus two big warm halos on the fascia lettering. Fascia detail: angle-iron edging top and bottom with rivet rows, seam plates with rivets every panel, a conduit with junction boxes feeding the letters, a drip stain, a peeling sticker. Cages: base plate, corner brackets, a padlocked chain, a tag, cable-tie tails. The yellow gates sign is pushed back out of frame (it crowded the neon again). Tooltip no longer shows before the mouse has moved.
- **`easter-island-shore-3d-static.html` (Easter Island Shore)** — night. Waterline along z at x=0, sea to the left, lumpy basalt beach rising to the right (vertex-displaced plane, wet cobble texture with a roughness map, metalness so the moon catches it). Moon low over the sea with two halos, a moon road (additive streak) and 90 shimmering glints on the swell (vertex-animated sea). Foam lines breathing up the stones, pools in the hollows, boulders, shingle, kelp, driftwood. The boat's wake: a V of additive foam sprites running out to a small dark hull with one spark of a lamp, creeping away. One moai at the top of the beach facing the sea, on an ahu, with the white mark on its chest (a spiral with a bar and a drip, not a letter); five more on the rise behind with their backs to the sea, one fallen face-down. The only warm source is an ember ring at the near moai's foot (breathing point light + halo). Pipe smoke: warm sprites rising near the camera. Fog: sea mist, stone haze, a cold band on the rise, moon mist.
- **`pyramid-mouth-3d-static.html` (Pyramid Mouth)** — last light. Pyramid centred on the origin (B=115, H=73), 74 courses each a ring of four long boxes with a block-joint texture, so the courses read as courses; loose casing stones on the lower ledges. Camera at the foot near the east corner looking up the south face: apex out of frame, the mouth a small dark square halfway up, off-centre left. The mouth is a real recess (BackSide box) cut through the courses with a gabled relieving stone, lintel, jambs, a worn sill, a dust spill down the face, rubble at the lip, and a warm light deep inside plus one outside on the gable, with halos: it is the one lit thing. The sun is down behind the north-west shoulder so the whole face sits in its own shadow under sky light; its afterglow leaks over the left shoulder as a big noFog halo. A scuffed climb of patches and loose stone runs up from the foot. Ground: sand with drifts against the base, tumbled blocks, a rope on iron posts, a tin NO CLIMBING / ENTRANCE sign, tyre tracks, Cairo as a band of warm halos far left. Dust in the air that does not move: 260 still motes. Fog: sand haze, a cool dusk band across the face, warm haze at the mouth.
- **`nazca-approach-3d-static.html` (Nazca Approach)** — DUSK. Coast road running away down -z, the Pacific on the right below a low bluff with surf at its foot, the sun (three noFog halos, sky rotated to match) going down into it with its road across the water. Cantina on the left verge facing the road: rendered block with a blue band and skirting, cracked plaster texture, a wooden door with brass handle, a window with a warm room and a half-drawn red curtain and folded shutters, CANTINA faded on the render, a CERVEZA FRIA tin sign, a corrugated tin awning on four poles with ribs, a string of dead bulbs along its edge, and THE bulb on a flex that warms up over the first half minute then breathes with a tired flicker (light + two halos). The Cessna propeller (two blades, yellow tips, hub and spinner) leans against the wall by the window. Porch: plastic chairs, a table with two bottles, crates of empties, a blue drum, a broom, a water butt, a gas bottle; water tank and bent aerial on the roof; forecourt with the bus's tyre marks and a leaning NAZCA bus-stop plate. Power line poles with sagging wires recede down the road; rusty crash barrier on the sea side; stones and scrub on the verges; dark hills far left. Heat shimmer: 40 pale sprites wavering low over the road. Fog: dust haze over the road, a blue band on the pampa, sea mist under the sun, warm haze at the cantina. Sun is low from ahead-right so shadows come long toward the camera.
- **`plain-of-chebar-3d-static.html` (The Plain of Chebar)** — overcast, bleached. A cracked-plate alluvium texture (polygonal crack net, salt crust) on a gently lumpy plain; the river is dug into the plain itself (trough profile in the vertex function) running from the left foreground away to the north-west, with pale rippling water, a skin of light on it, wet mud margins, dead reeds in clumps, a snag and driftwood. The stone fifty yards off (SX 9, SZ -38), right of centre, with a lesser stone half sunk beside it and the ground worn pale around them. Salt pans, small pale stones, curled plates, a dead tamarisk far right, an old bank line on the horizon. The bruise in the north: a violet-brown stain low in the sky texture with a sick amber glow behind it, plus three slow-breathing sprites (kept small; suggested, not shown). Wind from no direction: every haze sprite has its own drift direction that reverses on its own timer, and low dust streamers cross the ground on random headings and fade. No figures.
- Left for later passes (deliberately not built): figures, the paperback, the napkin, the bootprints, the cartridge, the guide, the bus, the woman with the books. All lettering is scene dressing (caps, minimal) and his to change.
- Look at first: (1) the Enlightenment's new wider camera — it shows the concourse receding but is a step further off the bay than the agreed shot; (2) whether the Chebar bruise is now too faint to register at all; (3) the near moai's chest mark — it is a spiral and a bar, so no alphabet, but check it reads as paint rather than a symbol; (4) the pyramid at full size on a bright screen, since it lives at the dark end of the exposure band on purpose.
- Pane gotcha this run: the Write hook opens each new html as a file:// tab, which hides the Browser pane and stalls screenshots; close that tab and reopen the http://localhost:8732 URL with preview_start before inspecting.
- Run: started 04:23 BST, all five verified by 04:55. Commit when ready.

### Addendum 30 — pink prose pass over the five dream worlds (2026-09-12, run 16:16–16:38 BST)
Sam's standing rule that pink `.claude-draft` lines are his to redraft was **suspended for this run only** at his explicit instruction: "work over every pink block in the five dream worlds and rewrite it as a fuller draft." Every rewrite stayed inside its `.claude-draft` wrapper, so all of it is still pink and still greppable. No non-pink text was touched. No link target, macro, tag, variable or `<br>` was changed. No git commands. No `SAVED-*` / `BACKUP-*` files touched.

**Counts held exactly, before and after: 306 `[[` links, 147 `claude-draft` occurrences.** `python3 sync_html.py` run twice (mid-pass and final); 212 passages written; three rewritten sentences and two passage tags confirmed present in the compiled html by grep (the html was never read).

#### What was rewritten, world by world
Worked in the order he asked, finishing each world before starting the next.

- **Nazca** — `Nazca Approach`, `Walking the Pampa`, `The Ridge`, `Nazca Race` (intro), `The Centre — Nazca` (main block, closing line, alba-2 attend line), `Nazca Return`, `Nazca Turn-Back`. Worked in: the lines legible only from height, the hummingbird plus the curled tail and the many legs further off, the "runway" that nothing has landed on, the two-stones-wide construction done by hand, the pampa's silence as absence rather than quiet, a small distant figure working the ground with a broom, and the pages that *missed* the cairn having fallen in a shape you would need height to read.
- **Easter Island** — `Easter Island Shore`, `Among the Moai`, `The Listening Moai`, `The Glyph` (main block, closing line, alba-2 line), `Easter Island Return`, `Easter Island Turn-Back`. Worked in: Hotu Matu'a's arrival by sea echoed in the boat with no fisherman, the empty skyline and an island that used itself up, the unaccounted four miles from the quarry and the answer that they walked, the birdman year at the cliff given to Costa as the best constitution he has heard of, Make-make as the name that was given rather than worked out, and rongorongo as boards that went for firewood on a treeless island with the last readers shipped off, leaving one sign cut inside a mouth where nothing could burn it.
- **Pyramid** — `Pyramid Mouth`, `Descending Corridor`, `Grand Gallery`, `Pyramid Run` (intro), `King's Chamber` (main block, closing line, alba-2 line), `Pyramid Return`, `Pyramid Turn-Back`. Worked in: Herodotus's guide as a man reciting the hundred thousand men, the radishes and the daughter in the voice of someone never once asked how he knows; the stripped casing carted off to build Cairo; the descending corridor's wrong turn into the unfinished pit room and the block out of true behind it; the Duat named only as the country you cross between sunset and morning; the seven corbelled courses, the cubit felt through the boots, the five relieving chambers stacked over the room that counts; granite from five hundred miles south, the sarcophagus too wide for the door, and nobody ever found in it.
- **Ezekiel** — `The Plain of Chebar`, `Storm from the North`, `Four Living Creatures`, `The Wheel` (main block, closing line, alba-2 line), `Ezekiel Return`. Worked in: Chebar as irrigated exile country rather than wilderness; the wind acquiring a direction, and that direction being north; fire going back on itself inside the cloud; the four faces, the folded wings, the burnished-brass edge, and the noise of great waters with a crowd under it; the wheels that lift with the creatures with nothing between them doing the joining; and the scroll eaten without hurrying and said to be sweet, with Nicole writing it down and then putting her hand over her mouth.
- **Himalayas** — `Airport Pub`, `The Road to India`, `Foothills`, `The Mountain`, `The Climb` (intro), `The Cave` (main block, mantra block, mandala line, alba-2 line), `Himalayan Return`, `Himalayan Turn-Back`. The pub is now named **The Enlightenment** in the prose, with the riveted fascia, the swirl carpet, the four clocks and the scrambling departures board (DELHI / LIMA / HANGA ROA / CAIRO and one with no airport), matching the render. John is written as the lawyer who left: the ruled red-biro underlining, the small upright hand with the breaks marked, the set hours, the two corrections he will not let go, "being very good at a thing is not a reason to go on doing it", and a hand put flat on the stone. The slate eyes stay here, as agreed, and only here.
- **Portal and Synthesis** — `Third Pillar Portal` (main block, fallback block, the key-steer cue with its `(print:)` macro preserved verbatim) and `The Synthesis` (opening block, all five gift lines, the Solomon's Seal block). The Synthesis opening now says plainly why the five gifts are five different *kinds* of object, and each gift line reaches back to the world it came from.

Threaded the **orange paperback** through all five worlds, since it was only in the Himalayas before: face-down and swollen on the boat's thwart at Rapa Nui; in the coat pocket at the pyramid with an aerial photograph in the middle pages; and at the bottom of Nicole's stack on the Chebar plain, doing the work of a brick, read and decided about.

#### Pink left deliberately untouched, and why
- `The Sanctum`, `The Sanctum — Sitting`, `Alt-Dawn` — the sixth world and the ending. These are the book, the kettle, "Go home now" and **Aoife**, which he is writing himself (2026-06-05 ruling). Not in his list for this run either.
- `Red Recognises the Name`, `Benito Recognises the Wheel`, `The Critic Hears the Mantra`, `Lackland Recognises the Tracing`, `Inis Recognises the Proportion` — Soho-side payoffs in established Soho character voices (Red, Benito, the Great Ham, Lackland, Inis). Outside the five worlds and the riskiest place to put a drafted voice.
- `Key Take cocaine / ticket / slip / lighter / eye` and `Resting Keys` — terse system copy that renders in five different venues. Expanding it would read as bloat five times over. Left as found.
- All the pink blocks that contain nothing but a `[[link]]` — nothing there to write.
- The `link.className = 'claude-draft'` line in the portal JS is code, not prose.

#### Voice constraints observed
No em dashes anywhere in the new prose; also removed the one pre-existing prose em dash inside a pink block in `The Glyph`. No description of the protagonist and no face given to them. In-game placeholder names left exactly as found (Al Hubz named, the Nazca driver and Costa and Nicole all still unnamed in-game). On the read-back I cut three constructions that had drifted toward paradox or pattern (a "both at once", a "cannot be drawn and which you draw anyway", and a repeated "it will keep") and fixed two idiom slips.

#### Live verification (pane, port 8735, hard-muted, `?dev=1`, backtick debug jump)
Zero `tw-error` and an empty console across every passage checked. Confirmed rendering pink at `rgb(255,58,168)`. Clicked all the way through: `The Synthesis` fires all five nested gift hooks in order and the hexagram SVG lands; all four world-centre reveals plus `The Cave` fire their reveal link, item box, gift SVG and the alba-2 attend moment; `Third Pillar Portal` still carries all five roll links and its fallback; `Airport Pub` keeps its conditional half-mantra item box; `Nazca Race` still builds its canvas beside the new intro.

#### Read first
1. The Enlightenment's departures board and four clocks in `Airport Pub` are scene dressing lifted from the render and are yours to change; the fifth destination is left unnamed on purpose.
2. Costa's two speeches in `Among the Moai` are the longest thing added this run, and the only place where a character is given a political argument rather than a line.
3. `The Wheel` now contains the eaten scroll. It is the one piece of the Ezekiel material that was absent before, and it is the beat most likely to be too much.
4. `The Plain of Chebar` gives Nicole a short exchange ("Constantly. But not about that."). She is written as the brief describes her and is still unnamed in-game.

Run: started 16:16 BST, all five worlds plus the portal and Synthesis rewritten by 16:29, verified live and re-synced by 16:38.

synced, commit when ready

### Addendum 31 — the third pillar now opens on a key; the pocket-key gets a real notebook entry (2026-09-12)
Both from Sam's play session: "the Pillars isn't open enough. You go once then it doesn't open again" and "you never actually seem to get the object keys in your notebook, you collect one or swap one and nothing changes."

**What the source actually said.** The portal was gated `(if: $inisToldOfPillars is true and ($worldsVisited's length < 2))`, with an else-branch reading "Twice across is enough." `$worldsVisited` is appended only at the five world centres and is never seeded from the lifetime list, so the count was honest: it closed after **two completed worlds**, not one. The night is 16 laps and a crossing costs 1, so laps were never the constraint. Keys did not affect whether the column opened at all, only which world the roll picked, which is why collecting and swapping felt inert. The roll JS was fine throughout: it already drops the lifetime exclusion when that would empty the pool.

**Fix 1 — the key is now the ticket (Sam's choice).** `Entering The Pillars of Hercules` now reads `(if: $inisToldOfPillars is true and $dreamKey is not "" and ($worldsVisited's length < 5))`. Carrying a pocket-key opens the column and names the key in the prose; the crossing spends it, as the hidden world links in `Third Pillar Portal` already did. So a night self-limits at five crossings, because there are five keys and each is consumed by the crossing that uses it, and each of the five keys is now spendable. *(This first read "five crossings at one lap each out of sixteen". The lap half is void after the open-night rework — see the correction in Addendum 34 — but unlike the doorways the third pillar is unaffected in practice, because key consumption limits it on its own.)* `(display: "Key Guards")` added at the top of that block so old saves are guarded before `$dreamKey` and `$keyNames` are read. Three branches now: open (key in pocket), "you have been everywhere it goes" (all five done, which only exists to stop the column opening onto an empty pool and dead-ending in the portal's fallback), and a new shut branch for empty pockets. The shut branch is the only place the player is told what the column wants, so it says so in the fiction: "It wants paying, and your pockets are empty. Something small and particular, picked up somewhere else tonight and carried in here." All three are `.claude-draft` pink and Sam's to redraft. `claude-draft` count 147 -> 148 for the new branch; `[[` links unchanged at 306.

**Fix 2 — the notebook entry was never broken, it was invisible.** `◈ In your pocket: <name>` did render correctly, but on the EFFECTS tab (the notebook opens on FINDS), as one unillustrated text line, glued straight under the coin with no divider above, and with no greyed placeholder when the pocket was empty, so there was no slot to notice filling. It now gets a proper house-style entry: a divider above, the heading `◈ In Your Pocket`, a drawn SVG per key, and a caption naming the object and where it came from. Five new one-line SVGs, double-quoted throughout with no apostrophes since they sit inside Harlowe single-quoted string concatenation: the cocaine wrap folded from a racing paper, the chippy ticket with its grease thumbprints, the betting slip with a wet ring through it, the brass lighter (which carries the JT SQ signature on its body), and the glass eye. When the pocket is empty it shows `○ Nothing in your pocket` in the locked style. New `.nb-inv-keyobj` rule in the stylesheet, 104px wide with the same drop-shadow as the other objects.

**Verified live** on a real play path at port 8732, not by debug jump: carrying the brass lighter opened the column and named it; the crossing showed the steer cue, spent the key and landed on the Airport Pub (correct world for the lighter); the notebook then showed `○ Nothing in your pocket`; returning to the Pillars with empty pockets showed the shut branch and no crossing link. Zero `tw-error` at every step. Note for future sessions: debug-jumping back to the Pillars restored a pre-crossing autosave and made the key reappear, which is the known autosave quirk and not a fault in the gate.

**Worth a look.** Inis's tip-off speech still says "Most nights you'll only see the two", which fits the new rule better than the old one, but he never tells you that you need to be carrying something. The shut branch is currently the only place that is explained. If you want Inis to say it, that line is yours.

synced, commit when ready

### Addendum 32 — the pocket-keys are now a popup decision, not a line under the links (2026-09-12)
Sam, after playing: "I don't like how they are introduced/displayed. At my last play they were often hidden below the link, and therefore a player is highly likely to miss them. I think when you encounter a pocket key it should be a popup with a clear decision about where they take it in exchange for anything you possess or to leave it."

**What was wrong.** Each of the five key venues rendered the offer as a pink line plus a `(link:)` sitting after the venue's own links, at the bottom of the passage. Easy to scroll past, and the swap case was a single link buried in the same place.

**Shape of the fix.** The offer is still authored in Harlowe exactly as before, but the whole thing is now wrapped in `<div class="dss-key-offer" data-key="..." data-kind="seed|rest">` and parked off-screen by CSS. It is moved out of the viewport rather than `display:none` because Harlowe drops `.click()` on a link with no layout box (the portal-roll bug of 2026-09-01); `pointer-events:none` keeps the player from ever reaching it by hand. A new `window.dssKeyPopup` then raises it as a tactile decision in the existing coin/match pickup style.

- Wrapped all ten offer sites: five seeds (chippy ticket, Coach betting slip, Lackland glass eye, French brass lighter, Trisha's cocaine) and the five resting offers in `Resting Keys`.
- The trigger lives once in `Resting Keys`, which is already displayed at the end of all five key venues, so no per-venue script was needed.
- Buttons are built one per parked `tw-link`, wearing that link's own wording, so the swap case reads "Leave the betting slip here and take the glass eye" with no new copy invented. Plus "Leave it" / "Leave them" to decline.
- Clicking a button clicks the parked Harlowe hook. That hook replaces itself in place off-screen, so its confirmation prose ("It goes in your pocket...", "You set the one down where the other was...") is read back out of the parked container and shown in the popup, with an `inventory-note` naming the key and the twelve `item-mote` sparks the match pickup uses. Nothing is lost behind the curtain.
- If a venue holds more than one offer (a seed plus a key you left there earlier) each gets its own panel with its own art, under one shared decline button.
- The art is **extracted from the notebook entry at build time** by the edit script rather than retyped, so the popup and the EFFECTS page can never drift apart.

**Registered with the popup serializer**, per the standing rule for any new overlay: `#dss-key-overlay` is now in `window.dssOverlayBusy`, in the rising-number `up()` check that gates the stat-delta animation, and in the match overlay's own `othersBusy()` list, so soft nudges queue behind it and it never lands on top of another overlay.

**Two things found while testing.** `window._passageGen` is incremented *after* a passage's own scripts run, so the usual `var gen = window._passageGen` guard inside a passage script never matches at fire time and silently killed the first version of the trigger. The trigger now fires unguarded and `dssKeyPopup` does its own dedup. Second, dismissing the popup sets `window._dssKeyPopupSeenGen` so an in-passage re-render does not bring it straight back; it returns on the next visit.

**Verified live** at port 8732: auto-opens on entering the Coach with the slip art, the pink blurb and "Pocket the betting slip"; taking it swaps the popup to the confirmation with "THE BETTING SLIP · POCKETED"; auto-opens again at the chippy; multi-offer and swap-wording cases checked by injecting synthetic parked offers, which produced two panels, two pieces of art, both swap labels verbatim and one shared "Leave them"; dismiss-then-recall correctly does not reopen. Zero `tw-error` throughout. `[[` links unchanged at 306, all ten offers wrapped.

**Note for future sessions.** The Browser pane screenshots this overlay as though the page behind it were undimmed. It is not: the overlay hit-tests on top at full viewport with `rgba(0,0,0,0.82)`, the same rule the coin and match pickups use. Do not "fix" the backdrop on the strength of a screenshot.

**Header approved.** The popup's header reads "⟡ WITHIN REACH ⟡" and Sam has signed it off ("I like within reach, it does the job"), so leave it alone. The blurbs are still the original pink prose, now shown in the popup instead of the passage.

synced, commit when ready

### Addendum 33 — stashes: bins by the venue doors, hiding places in the alleys (2026-09-12)
Sam: "When you gather an item, if you give up another item, that item should be retrievable without going through the whole venue again. There should be like a hiding place, maybe a bin by the door of each venue and also a few other places around the map which you can stash object, or where they are stored if you abandon them to take another."

His two rulings when asked: stash spots are **the five venue-door bins plus the alleys**, and **alley hiding places are safe while the venue bins are public and can be turned over**.

**Where the bins are.** Each of the five key venues already had an `[outdoor]` approach passage, which is literally the pavement outside its door, so that is the bin: `Approach Chinese Fish and Chips`, `Approach The Coach`, `Approach Lacklands Office`, `Approach The French`, `Approach Trisha's`. `$binOf` in `Key Guards` maps venue to bin. Swapping *inside* a venue now leaves the old key outside it, so you collect it in passing instead of walking the room again.

**Nine alleys, not ten.** Every alley is a hiding place except **Bourchier Street**, which is left out on purpose: it is the mugging fork, not a place you would leave anything. Each has its own spot, named in `$stashLabel` so the notebook can say where a thing actually is: behind the loose brick in Meard Street, on the ledge over the doorway in St Anne's Court, under the lifted flagstone in Bateman's Buildings, in the phone box at the Oxford Street end, and so on.

**New system passages.** `Stash Point` is the single line that makes any passage a stash site; it is displayed at the five bins and the nine alleys (14 sites) and bundles three things: `Raided Bins` (the reveal), `Resting Keys` (pick a key back up, which raises the existing popup), and `Key Stash Here` (the voluntary "Leave the X here"). `Key Sites` rebuilds `$stashSites`, the list of passages currently holding something, which the hub reads.

**Raiding.** `Key Drop Here` rolls one in three when the destination is a bin and stores the key as `"raid:<bin>"`. The player finds out only on coming back for it, in `Raided Bins`. Alleys never roll. The notebook strips the prefix, so a doomed key still reads as being in the bin until you go and look, which is the point.

**Hub.** A visited alley normally drops off the hub list. It now stays listed while it is holding something of yours, and disappears again once you collect it. Verified in real play: stashed the slip in Meard Street, went back to Dean Street, Meard Street was still listed, went back in, took it, and it dropped off again.

**Two Harlowe traps hit, both worth remembering.**
1. `(if: $x is not "a" and $x is not "b" and not ($list contains $x))` throws "This use of `is not` and `and` is grammatically ambiguous". The second test has to be nested in its own `(unless:)` rather than chained.
2. **`not` binds across a following `or`.** `(if: not ($alleys contains "walkers") or ($stashSites contains "..."))` parses as `not (A or B)` and was silently always false. Put `not (...)` **last**: `(if: (B) or not (A))`. The codebase's own pre-existing Charing Cross line already used that order, which is what gave it away.

**Also fixed in passing:** the notebook's stash test let `"stolen"` and `"traded"` through, so a mugged key would have displayed as "left at stolen". Those are now excluded.

**Verified live, all by real navigation rather than debug jumps** (the debug jump kept restoring a pre-change autosave and is not to be trusted for this): swapping inside Trisha's put the slip "in the bin outside Trisha's" in the notebook; the voluntary stash link appears at both bins and alleys and empties the pocket; the hub re-listed and then un-listed Meard Street; returning to Meard Street raised the popup reading "The betting slip is where you left it." with the slip art and "Pocket the betting slip"; taking it restored the pocket. Zero `tw-error` throughout. 216 passages, `[[` links unchanged at 306, 14 stash points wired.

**Not yet seen fire:** the raid note itself, since it is a one-in-three roll and none of the test deposits rolled it. The code path runs at every stash site without error and is a plain `(if:)` plus a pink line, but it has not been observed in play.

**Yours.** The fourteen hiding-place names in `$stashLabel` and the two pink lines (the stash confirmation and the raided-bin note) are drafted and pink.

synced, commit when ready

### Addendum 34 — four more doorways, always open (2026-09-12)
Sam: "can we add multiple doorways that you can piss or retch in, maybe 4 over the map in addition to the one already and they should always be open. But keep the prompt to piss as it is."

**The prompt is untouched.** All four fire the same `showSpewPopupSafe('doorway', 300)` as `A Doorway on Dean Street`. `SpewPopup` and its two modes were not edited.

**Where.** Sam chose one per quarter: **Livonia Street** (north-west), **Diadem Court** (north-east, off Dean Street), **Ham Yard** (south-west), **Romilly Street** (south-east). Four new passages `Doorway: <street>`, modelled line for line on the Dean Street doorway: `$hadBreather`, morale +12, sobriety +8 with food or +18 without, the popup, then `(go-to: "Dean Street")`.

**Always open, with no `$hadBreather` gate.** ~~This fell out of the economy that was already there: an alley return sets `$alleyReturn` and is free, a doorway does a plain `(go-to:)` and so spends one of the sixteen turns, and that lap cost was the limiter. Verified in play, 14 turns left before and 13 after.~~ **The reasoning is void — see the correction below.**

> **CORRECTION (2026-09-12, after the open-night rework).** These doorways were built an hour before Sam shipped the open night, and the justification for leaving them ungated died with it. Per the OPEN NIGHT SHIPPED override at the top of this file, and commit `7a3c494`: `$nightLength` is gone from the .twee entirely, along with both its `(unless: ... is a number)` guards; `$returns` survives only as soft thresholds (`>= 3` nudges, `>= 5` Aoife memories); there is no dawn gate and no `_dawnHere`. The stat bar reads "Before midnight / After midnight / Small hours / Dawn awaits" with the tooltip **"The night deepens through discoveries. There is no time limit."**
>
> So **the four doorways now have no limiter of any kind.** A player can use one over and over for morale +12 and sobriety +8/+18 at no cost at all. The mechanism works exactly as built and exactly as asked — "always open" was the explicit instruction and it is honoured — but nothing now stops it being farmed.
>
> **RESOLVED, same day.** Sam's ruling: *"they aren't a big deal, you should just be able to piss when you like and regain a small amount of stats most times."* So no gate was added. Instead all four doorways were retuned:
>
> - the gain dropped from morale +12 / sobriety +8-18 to **morale +4 / sobriety +6** (as `$statGain` arguments, which are proportional to the headroom left, so this is roughly +2/+4 when you are flagging and +1/+1 when you are not);
> - **one visit in four gives nothing** — `(if: (random: 1, 4) > 1)[…]` — you went, there was not much in it;
> - `(set: $hadBreather to true)` was **removed** from all four, so a doorway no longer quietly consumes the bigger one-off relief still waiting at `A Doorway on Dean Street`.
>
> Measured over 16 consecutive visits from a fresh 70/70 game: 6 misses (a 1-in-4 rate would predict ~4, well inside variance), hits running +2/+4 early and tapering to +1/+1, ending at 86/91. So it climbs slowly if you spam it and is never worth farming, without any rule forbidding it. Zero `tw-error`. The same note is stamped into all four `Doorway:` passages in the .twee.
>
> **FOLLOW-UP, same day: the Dean Street doorway now matches too.** Sam: *"make the Dean Street one match the others"*, and then the reason — *"the idea is that it teaches you what the doorways are for."*
>
> That reframes it. `A Doorway on Dean Street` is the **teaching doorway**: it is the one the hub offers you by name, through the two `$hadBreather`-gated "Step into a doorway" nudges, when you are flagging. Its old morale +12 / sobriety +8-18 was therefore teaching the wrong lesson — no doorway you find afterwards is worth anything close to that, so the tutorial was overselling the very mechanic it exists to explain. It now uses the identical line to the other four: `(if: (random: 1, 4) > 1)[…, 4)…, 6)]`.
>
> **The teaching structure is deliberately unchanged.** Both nudges are still gated on `$hadBreather`, so the prompt appears until you have used a doorway and then retires — the lesson has landed and the four out on the map take over. For that to work, `(set: $hadBreather to true)` was **restored** to all four map doorways; it had been removed only to stop them eating a big one-off that no longer exists.
>
> End state: **five doorways, one formula.** Verified — all five carry the identical relief line, all five set `$hadBreather`, both nudges still gated, and the retuned Dean Street passage fires its prompt, applies a small gain and bounces to the hub with zero `tw-error`. The remaining `$statGain … 12` calls in the file are drinks and food, not doorways.

**On the map.** Four new `DOORS` entries beside the alleys, in the existing doorway blue `[150,168,200]`, `label:''` with `spot:true, event:true` so you walk onto the tile and it fires, the same as an alley. Tiles were chosen against the map's own grid rules rather than by eye, and each was then checked by re-implementing `roadAt`/`alleyAt`/`tileAt` in the page and asserting the result: Livonia `c4,r10`, Diadem `c19,r10`, Ham Yard `c2,r40`, Romilly `c37,r34`. All four come out `P` (pavement) with an `R` road tile to enter from, so all are walkable and reachable. Hub links are unconditional, which is what keeps their map status `open`.

**Verified live:** all four listed on the hub, Livonia and Romilly both walked, the spew popup fired on return (correctly queued behind a coin pickup that landed at the same moment, so the overlay serializer is doing its job), stats applied, a turn spent, map renders, console clean, zero `tw-error`. 220 passages; `[[` links 306 to 310, the four new hub links.

**Worth knowing.** A stale `$alleyReturn` from earlier alley testing made the first turn-cost check read 14 to 14 and look like a bug. It is not: the flag is consumed by the next Dean Street render. If a turn ever fails to be spent, suspect that flag before suspecting the passage.

**Yours.** The four doorways carry no prose at all, deliberately, because the Dean Street one does not either. If you want each to feel like its own street, a line in each is the place for it.

synced, commit when ready

### Soho Square — Whack-a-Worm and mock-Tudor hut (2026-09-12, Codex)
Sam authorised a non-explicit whack-a-mole game with giant earthworms entering the underground gents through holes in the tiles. His exact outcomes: **GLORY!** and **LA PETITE MORT!**. Also requested the central hut's mock-Tudor façade.

Implemented in the Twee and synced (222 passages). `Soho Square Gents` contains a self-contained six-hole game: click/tap or keys 1–6, 30 active seconds, increasingly frequent worms, scrubbing-brush hit flash, quiet procedural hit/miss sounds. Pauses when tab hidden; removes frame/input/audio resources on exit. 18 hits wins +8 morale; 28 hits wins +12. `$wormPlayed` settles the first completed round (including a loss); revisits are practice. No turn refund/penalty for this small optional game. Existing creative prose unchanged; new introductory prose is pink draft.

`Alley: Soho Square` now displays `Soho Hut Art` and links down to the gents. The hub Square link stays available for practice/stashes, and the existing bench +8 is guarded by `$squareBenchTaken` to prevent repeated collection. The scrolling map's existing hut now has a cream gable, dark bargeboards, diagonal beams and leaded windows. New inline SVG shows the hut and descending steps. Keep that SVG on ONE LINE: Harlowe inserts BRs into multiline SVG, breaking its rendering.

Verified in isolated Chromium against localhost: full timed rounds scoring 0/20/35 produced correct loss/win/distinction and +8/+12 messages, no tw-errors; real navigation back to Square and down again showed practice. Desktop and 390px mobile layouts inspected; hut rendering inspected after fixing SVG line breaks. Harlowe BRs inside the game grids are explicitly hidden. Reward links are off-screen (NOT display:none) until activated, then unused links hidden, to preserve Harlowe programmatic clicks. Timing was accelerated in browser verification; human difficulty tuning remains Sam's playthrough. Test scripts/screenshots in /tmp only. No git commands run.

### Addendum 35 — the knock on Salvu's door (2026-09-12)
Sam, from playthrough notes: "When you knock on the door to get to Slavu's lair it doesn't sound like a knock at all, can we improve that?"

**Why it did not read as a knock.** `doorKnock` in `window.dssAudio` built each rap from a 40ms noise burst put through a **bandpass at 380Hz with Q 4.5**, which threw away everything that makes a knock legible, plus a single 110→70Hz sine. So there was no crack at the top and only one resonance underneath: a tick with a hum, not knuckles on a door.

**Rebuilt** around what actually carries a knock: a broadband knuckle crack, lowpassed at 2.7kHz and highpassed at 200Hz so it is wood rather than a stick on tile; the panel answering on **three modes at once** (94 / 151 / 237 Hz) with the lowest hanging longest; a short 62→44Hz thud through the frame; and a quiet bandpassed noise tail so the rap lands on something with a cellar behind it. Each rap also gets its own `vary` (pitch and weight) and `hit` (how hard it landed), so three raps are no longer one rap three times.

**Measured rather than asserted**, since I cannot listen. Both the old and the new DSP were rendered through an `OfflineAudioContext` in the page and compared:

| | attack | decay to 1% | peak |
|---|---|---|---|
| old | 7.3 ms | 100 ms | 0.169 |
| new | 2.8 ms | 212 ms | 0.443 |

Faster transient, twice the ring, and 2.6x the level. That is the difference between a tick and a rap. Peak 0.443 leaves plenty of headroom; raps are 190ms apart against a 212ms decay so only the tails overlap.

**Verified in the passage:** `Maltese Gangsters`, the `copperKnockBtn`, three clicks, counter went ○ ○ ○ to ● ● ●, button disabled, the creak and reveal followed, no JS errors and no `tw-error`.

**Gotcha worth remembering:** `_play()` short-circuits when muted, so calling a sound while the game is muted proves nothing about whether it works. My first "no throw" test was worthless for that reason. Unmute before testing audio.

Nothing else in the audio system was touched; `doorKnock` is still the only definition and is still exported on `dssAudio`.

synced, commit when ready

### Addendum 36 — the walk-in moved to the front, where it was meant to be (2026-09-12)
Sam: "Order at the start is wrong. So I inserted a little introductory passage which was supposed to lead you in. It appears between the first alba and the return to dean street now. it should appear straight after the first click to enter the game."

The passage is **`The Walk In`** (the opening-walk scene, Addendum 22).

**How it was wired.** `Start` went straight to `The Night Ahead`, and the walk-in was hanging off the end of the book-naming branch instead: `LINE 1` (the first alba, from Red) → `Night Ahead Part Two` → `Name Your Book` → **`The Walk In`** → `Dean Street`. So it played about an hour into the night, right after the first alba, exactly as he described. The giveaway was that `Name Your Book`'s own link already reads **"Back to Dean Street."** while actually routing to the walk-in, which is the signature of a passage inserted one step too far down the chain.

**Four changes, all rewiring, no prose touched.**
1. `Start` now does `(go-to: "The Walk In")` instead of `(go-to: "The Night Ahead")`. `Start` is a silent setup passage, so the walk-in is the first thing the player sees after the first click.
2. `The Walk In` hands on with `[[Enter the night|The Night Ahead]]` instead of straight to `Dean Street`. His link text is untouched; only the target moved.
3. `Name Your Book` now does `(go-to: "Dean Street")`, which is what its link already claimed to do.
4. `"The Walk In"` added to `_hideStats`, so the stat bar stays hidden on it the way it already does on Title, Start, The Night Ahead and Name Your Book. It did not need this when the passage sat mid-game; it does now that it is an opening page.

**New order:** Title → BEGIN → (Start, silent) → **The Walk In** → The Night Ahead → Dean Street. The later branch is now LINE 1 → Night Ahead Part Two → Name Your Book → Dean Street.

**Verified by walking it:** from the Title, one click lands on the walk-in with the stat bar hidden; "Enter the night" goes to the typewriter page; "Step into the night" reaches the hub. Separately, `Name Your Book` → "Back to Dean Street." now lands on the hub and no longer on the walk-in. Zero `tw-error` throughout.

**Note for whoever reads counts.** Passage and `[[` link totals drifted upward during this session (222→224 passages, 310→314 links) with no edit of mine accounting for it. That is not a fault: **Sam was editing the .twee at the same time** — `Soho Hut Art`, `Soho Square Gents`, `Night Progress` and `Towards Dawn` all appeared mid-session. `sync_html.py` only ever reads the .twee, so it is not the culprit. Every edit here re-reads the file immediately before writing, so nothing of his was clobbered, but do not treat global counts as a regression check while he has the file open.

synced, commit when ready

### Open night overhaul — no turn limit (2026-09-12, Codex)
Sam requested an overhaul of the turn limiter to suit the walkable open world, explicitly allowing its complete removal.

**Design now shipped:** exploration has no time budget. No deadline, forced dawn from hub visits, passive hub morale/sobriety loss, game turn rewards/penalties, refusal time charges, or portal time charges. Existing condition changes from decisions/games/drinks, story gates, pocket-key consumption, and deliberate final-call refusal remain. `$returns` survives ONLY as the backwards-compatible, monotonic story visit counter for introductions, coin and phone-call spacing: its sole increment is in Dean Street, with the existing alley-return exemption. Old `$nightLength` values in saves are ignored (no source references remain).

**Night Progress** derives `$nightPhase` from collected story milestones, monotonically: 0 Before midnight; 1 After midnight at 4 haunts / 1 Alba line / an existing after-midnight flag; 2 Small hours at 8 haunts / 2 Alba lines; 3 Dawn awaits at all 3 lines. It updates the existing date/midnight cue. Header displays the phase. Map sky and ordinary windows follow this discovery-based depth, with some ordinary windows always lit and venue lights retaining their existing logic. No elapsed-time or visit-count dependency. Important: `$nightAlbaCount` is a derived STORY variable because a temp variable set inside `(display:)` is not reliably accessible to the caller on direct arrival; this was caught and fixed during tests.

**Voluntary ending:** Head towards dawn is visible immediately below the map, outside its parked navigation hooks, even before Red. New `Towards Dawn` shows Alba/flower/haunt totals, makes incomplete-ending and stolen-notebook consequences explicit, and offers Go towards dawn → The Fetch or Keep exploring → Dean Street. The latter sets alleyReturn so merely checking the ending does not advance phone pacing. The Fetch's original return prose remains; its Not yet option now stays available at any visit count, even with all collections complete. Explicit `$refusedDualRing` still intentionally removes that retreat. All original endings are retained. Completing the poem also no longer closes The French's return link.

**Other consequences:** Shana's once-per-game second reading costs 4 morale, not a turn; finding the Hanged Man retains its existing +6 morale. Her existing prose remains verbatim; a new small UI note names the actual morale stake. Existing draft line "The night is shorter for it" is now metaphorical; Sam can rephrase it if desired. Old time tutorial/popups and TURN ±1 notices are removed. A once-only, serialized open-night tutorial works for fresh and older saves. Initial phase/tutorial reset occurs in both StoryInit and Start.

**Verification:** isolated test build under /tmp (test passages never added to the actual game). Old save with 199 visits and a stale 16-turn budget entered Dean Street at 200, with normal map/links and 70/70 condition. Twenty voluntary-dawn detours preserved 70/70 and the initial phase. All four milestone phases checked. Complete and incomplete Fetch both retained their return choice. Stolen notebook warning checked after fixing display-temp scoping. Lily and dual calls appeared with their existing spacing; refusal, fight win/loss and Shana did not alter the visit counter. Low-sobriety late-game fixture retained the Coach recovery route. No tw-errors in these cases. Final header, map and mobile dawn-choice screen visually inspected. Actual build: 224 passages, two additions, none removed. No remaining nightLength/dawnHere/lapsLeft/turns-left/turn-reward references; exactly one returns increment. No git commands run.

Synced, commit when ready. Human playthrough remains the test of the new pacing and difficulty; phase thresholds are atmosphere only and need no deadline balancing.

### Addendum 37 — the opening funnel restored, and the new-game resets that were never happening (2026-09-13)
Sam, on his staged opening: *"the first time you land on the map you have to go to the ginger light, it's the only option... On the first return only the french and the pillars should open and it should grow out from there."* And, when I claimed it was broken: *"I thought that wasn't broken."*

**He was right twice, and I was wrong twice. Recorded so nobody re-derives my mistakes.**
1. I reported that ~20 hub links needed gating on the first lap. They do not. The entire "Where now?" block is wrapped in **`(if: $metRed is true)`**, so the first landing already offered only the corner. I had been reading each link's guard in isolation without noticing the conditional enclosing all of them.
2. I reported the Chippy as an always-on venue link. It is not. Every Chippy link is **nested inside the nudge chain** (liver tip / "You seem hungry" / the gents nudge), so it only ever opens on a prompt — exactly as he wanted.

**The one thing genuinely outside the funnel** was the alley and doorway dock, which sat on the line immediately *above* the `(if: $metRed is true)` wrapper and so rendered from the first landing: nine alleys plus five doorways crowding the corner. The alleys have been outside it since 2026-09-11; **the four new doorways were mine from the night before**, dropped into that same dock, which is what made it obvious. Fixed by moving only the dock inside the wrapper. The `dss-hub-flag` spans and `(display: "Key Sites")` stay outside, because the map reads them on every hub render.

Verified by walking a fresh game: **first landing** = "See who's there" plus his "Head towards dawn", nothing else. **First return** = To The French, To The Pillars of Hercules, plus the alleys and doorways (he approved those arriving at this point). No Chippy, no Colony, no Trisha's, no Ronnie's. Zero `tw-error`.

**The bug that fell out of testing it: a new game was never resetting most of its state.**
A fresh game opened with Meard Street and Walker's Court already walked — the two alleys I had walked while testing stashes. `$alleys` was declared only by `(unless: ... is an array)` type-guards, which fire the first time a variable is created and therefore **never** on a replay in the same browser. An audit of `Start` found the same hole in thirteen variables. The alleys were the least of it:

- **the five pocket-keys** — left `"spent"` from a previous night, so a replay could begin with no keys at all, which shuts the third pillar for the whole night;
- **`$notebook`** — left `"stolen"` or `"traded"`, so you start without a notebook;
- **`$worldsVisited`** — left full, which shuts the pillar on its own `< 5` guard;
- plus `$alleyReturn`, `$dreamKey`, `$keyPick`, `$stashSites`, `$notebookStake`.

`Start` now resets all of them. `$hadBreather`, `$hasCoin`, `$haunts`, `$metRed`, `$returns` and `$nightPhase` were always reset correctly and are untouched.

**A Harlowe trap worth remembering, which cost two test cycles here.** The first version of this block failed silently: the resets did not run and **no error appeared**. The cause was the explanatory comment above them, which contained example macro syntax. **Harlowe parses macros inside HTML comments**, so a macro written as illustration inside `<!-- -->` is executed, and a malformed one swallows everything after it without complaint. The comment is now written in plain prose and carries a warning to that effect. If a block of sets ever appears to do nothing, check the comment above it before checking the sets.

Also noticed while reading the values: `$alleys` accumulates duplicates (`[square,walkers,walkers,meard,meard]`) because each alley does a bare `(set: $alleys to it + (a: "x"))` with no contains-check — only Charing Cross guards with `(unless: $alleys contains "foyles")`. Harmless today, since every read is a `contains`. Not fixed, not asked for.

synced, commit when ready

### Addendum 38 — the way out becomes a place on the map (2026-09-13)
Sam, once he'd worked out what "Head towards dawn" was: *"there should be an exit at the edge of the map which is towards Centre point. That's the way out of the game and the night. It should warn you that you will lose (I'll write the prose) if you try to take it before you have the whole ALBA, but it should be there."*

**The map was already built for this and the door had simply never opened.** `DOORS` carries a `north` entry at **c17, r0** — the top edge of the map, in Dean Street's own column, labelled CENTRE POINT, `spot:true`. Its matcher was `rx:/dawn is coming|Give up on the night/i`. The hub link says "Head towards dawn", so it never matched: the only thing that ever opened that tile was the morale-collapse link "Give up on the night", which needs `$confidence <= 5`.

**Two changes.**
1. `[[Head towards dawn|Towards Dawn]]` moved off the visible hub and parked in a dock div, so it is no longer a line of text on Dean Street. The `_towerReady` message ("The poem is complete. Stay as long as you like.") stays visible where it was.
2. The `north` door's matcher is now `/Head towards dawn|dawn is coming|Give up on the night/i`.

The exit is therefore a place you walk to at the top of the map, always present, with `Towards Dawn` doing the warning before you commit. That passage already shows ALBA/FLOWERS/HAUNTS and warns on an unfinished poem or a missing notebook; **the prose there is Sam's to write.**

**A CSS gotcha worth recording.** `.soho-hub-dock` does NOT park anything on its own. The only rule is `tw-passage.soho-map-on tw-hook.soho-hub-dock`, which needs a **tw-hook**, not a div — the alley dock is parked by the map JS adding that class to hooks it has already scanned (`scan.hooks.forEach(...)`), not by the class being in the markup. Putting the class on a plain div left the link fully visible. It is now parked by explicit inline style, the same shape the portal roll uses: off-screen with a real layout box, because Harlowe drops `.click()` on a link with no box.

**Verified:** the link renders, is scannable, and sits at x −9757 with a live 17px box; no visible text links remain on the hub; the `north` DOORS entry reads back from `window.dssSohoMap` at c17/r0 with the new regex; zero `tw-error`.

**NOT verified, and it needs a human:** that the north tile actually lights and fires in play. The Browser pane's synthetic key events do not reach the map canvas — the walker sat at c17/r22 through 130 Up presses — and the live door statuses are not exposed (`dssSohoMap.doors` is the static DOORS array; `.state` is walker state only). Both necessary conditions are confirmed in the data, but someone should walk to the top of the map once and check the exit fires.

**The tip is gone, not rewritten.** I had flagged that the open-night word-to-the-wise still said *"When you want to finish, choose Head towards dawn below the map"*, and assumed it wanted repointing at the north edge. Sam: *"No, I don't want them to know about head towards the dawn. They shouldn't be tipped towards it. If they discover it so be it, but it's mad to tell them how to quit the game from the very start."* So that sentence was deleted rather than corrected. The rest of his tip stands unchanged.

**The exit is now unadvertised everywhere.** The only remaining occurrences of the phrase in the .twee are the map's `north` matcher, the off-screen link the map scans, a code comment, and the `<h2>` inside `Towards Dawn` itself — which you only see once you have arrived. Nothing tells the player it exists. Verified on the hub: the tip renders without the sentence, and there are zero visible text links.

synced, commit when ready

### Addendum 39 — the cow moos when it swerves (2026-09-13)
Sam: *"When the cow moves left or right on the cow game it should make a moo noise instead of the noise it makes now."*

Lane changes were calling `dssAudio.dodgeWhoosh()`. They now call a new `dssAudio.cowMooShort()`.

**Why not the existing `cowMoo()`.** There already is one, and it is 1.2s long and already in use as the ride's ambience, firing on a random 5-to-12-second timer. A swerve can fire every 90ms (the keyboard throttle), so reusing it would have stacked a herd of overlapping 1.2s moos on top of the ambience. `cowMooShort` is the same animal clipped: sawtooth 205 to 150Hz, 7Hz vibrato, lowpass 820, **331ms** long and peaking at **0.076** against the ambient moo's **1121ms** and **0.103**. Each one gets a small random pitch scatter so repeated swerves are not one sample on a loop.

**Four call sites changed**, all of them lane changes: the two keyboard branches (`playerLane--` / `playerLane++`) and the click and touch handlers. All three input routes stay identical to each other, which was the original intent of the code there.

**Deliberately left alone:** the near-miss `dodgeWhoosh` at the obstacle-passing check. That one is a genuine whoosh of something going past, not a move, so it keeps its whoosh. The `hoofBeat` gallop and the ambient `cowMoo` are untouched. `dodgeWhoosh` itself is unchanged and still used by two other games.

**Verified in the game**, instrumenting `dssAudio` and swerving six times: six `cowMooShort` calls, zero `dodgeWhoosh`, hoofbeats still running underneath and one ambient `cowMoo` in the same window. Zero `tw-error`. Note that `_play()` short-circuits when muted, so this was tested unmuted; testing audio muted proves nothing.

synced, commit when ready

### Addendum 40 — the Donkey coin's portrait re-framed (2026-09-13)
Sam, with a screenshot: *"You see how the coin here is sort of misaligned with its border? Can you fix that for all appearances of the coin?"*

**What was actually wrong: the coin was two coins.** `coin-heads.svg` is a 400x400 vector coin — body, rings, and the SEX ANTONIUS / NUMBEX ADAMUS lettering on a `ring` path at r=156 — with a raster portrait clipped into it at `circle cx=200 cy=200 r=136`. But the embedded PNG is **not a portrait, it is a whole finished coin**: its own rim, its own lettering band, its own face. It was placed at `x=22 y=22 width=356 height=356`, which scales it by 0.89, so the PNG's own lettering ring landed at about r=139 in SVG units, against a clip at r=136. The clip was cutting the PNG **three units inside its own border**, so a sliver of the raster coin's rim showed as a second, not-quite-concentric arc inside the vector one. That mismatched inner arc is what reads as the portrait being off-centre. Nothing was actually off-centre: measured radially, the SVG's geometry is symmetric to the pixel and the image box is centred on 200,200.

**Fix:** the image is now `x='-25' y='-25' width='450' height='450'`. Scaling it past the clip pushes the raster coin's own rim and lettering outside r=136 entirely, so only its face shows and the vector frame is the only border in the picture.

**Sam chose the framing off a rendered comparison sheet** (356 as-is, 410, 450 side by side in the real `.coin-overlay-disc` styling). He first said 356, then changed to 450: *"it's funnier if it's more difficult to work out the face: one for the real Anseral fans."* So the larger crop is a deliberate choice, not just a technical fix. Do not "restore" the smaller framing.

**All appearances covered by the one asset.** `__DSS_COIN_HEADS_DATA_URI__` is used in four places and they all take the change together: the notebook EFFECTS entry, the JS that swaps `src` on the notebook flip, `.coin-overlay-disc .cp-heads` (the pickup popup and the Colony-doors coin gate), and the `.coin-heads` rule. `coin-tails.svg` needed nothing — it is pure vector with no raster. `coin-toss-preview.html` is a standalone dev preview still pointing at the superseded `coin-heads.png` and was left alone.

**Verified in the game after sync:** the notebook coin renders with the face filling the field and concentric with the milled edge, no competing inner ring; the `flipCoinPopup` overlay renders the same asset correctly. Zero `tw-error`. All scratch files (`coin-check-TEMP.html`, `coin-var-*-TEMP.svg`) removed.

**Method note for next time.** Three rounds of pixel measurement on the PNG were a dead end — texture detection caught the lettering, colour separation failed because the portrait is a gold duotone with no skin hue, and a radial edge-fit was biased by the dark hair at the top of the head. What settled it in one step was rendering candidates side by side in the real CSS and looking. For a framing question, render and look first.

synced, commit when ready

### Addendum 41 — soft-lock: declining a phone call sealed you inside the modal (2026-09-13)
Sam, playing: *"I got stuck on one of the popups when I turned down a phonecall."*

**Real bug, five instances.** `.phone-ringing` is not inline prose, it is `position: fixed` — a centred modal — and `tw-story:has(.phone-ringing)::before` lays a full-screen scrim over the page that **catches clicks**. Declining a call runs `(replace: ?lilyring)[...]`, which swaps the text *inside* that modal and leaves the modal and its scrim standing. Where the replacement offered no link, the player was sealed in with nothing clickable anywhere on screen. Only a browser Back or a reload got you out.

Affected, all five carrying byte-identical markup: **Coach and Horses bar**, **Entering The Pillars of Hercules**, **Ronnie Scott's**, **The Colony Room**, **The French** — all of them the Lily ring.

**Why the Aoife call was fine.** Its decline already ended `...(display: "Fetch Window SVG")</div>]\n[[Back to Dean Street|Dean Street]]]]]</div>]`. The five Lily branches were missing exactly that one line. Fixed by giving them the same exit, so the pattern is now uniform.

**Why not simply dismiss the popup and stay in the venue.** `_lilyRing` is `$lilyCount >= 1 and $hadLilyCall1 is false and $hadPhoneCall is true and ($returns - $phoneCallReturnsAt) >= 1`, and declining sets **none** of those. Any fix that re-rendered the venue would have re-rung the phone immediately, incrementing `$refusedCalls` each time and marching the player into the Fetch omen through a loop they could not leave. Leaving to Dean Street breaks the cycle cleanly, and she rings again next visit, which is the intended behaviour.

**Verified:** all five decline branches in the compiled html now carry a "Back to Dean Street" exit, none without. `[[` links 314 to 319, the five new exits. I could not trigger a live Lily ring to watch it — the ring needs a specific state (a lily gathered, the Aoife call already taken, and at least one lap since) that the debug Complete tool does not produce — so this is verified structurally against the working Aoife branch rather than by playing it.

**Sam is play-testing from `PLAYTEST.html`**, a frozen copy of the build served off the same port, so edits and syncs do not disturb a session in progress. Refreshed after this fix.

synced, commit when ready

### Addendum 42 — the phone box (2026-09-13)
Sam's idea, from noticing the K6 modelled in the Ginger Light render: *"I quite like the idea that you can ring her... if you turned down a phone call then regretted it, you could ring her back and undo the damage."* And on the coin: *"once you use it for the colony room doors it's just sitting there and you can, if you want, decide to spend this valuable coin to call Aoife."*

**Why it fits.** Every phone in this game rings AT you; you take it or you say you are not here. You can never ring out. And the Donkey coin had exactly one use (the flip at the Colony Room Door) against a pickup line that promises **"You'll want it later"** and was never paid off. The box uses both.

**New passage `The Phone Box`.** Spending the coin buys back **one refused call**: `$refusedCalls` comes down by one, so the Fetch omen that appears at two refusals recedes. Four states:
- no coin: nothing to put in it;
- `$refusedDualRing is true`: **the box cannot help.** That refusal sends you to The Fetch and rewrites the hub, and it stays unrecoverable by design;
- a coin and at least one refusal: the offer, and the spend;
- a coin and nothing to take back: she will be asleep, and the daughter with her.

**The trade is real.** Spending the Donkey here means not having it to flip at the Colony doors. That is deliberate and it is now enforced, because of the next item.

**The coin gate can finally see the coin.** `window.coinGate` is plain JS and Harlowe state is not exposed to it, so it never checked `$hasCoin` — you could flip a coin you had never found, and would still have been able to flip one you had spent. `The Colony Room Door` now prints `$hasCoin` into a hidden `.dss-coin-flag` span and `coinGate` reads it. **No coin means no gate at all: you pick a door yourself.** That is the graceful fallback for arriving before `$returns is 2`, and the consequence of spending the coin at the box.

**Where it lives.** A parked hub link (shown only while `$hasCoin is true`) plus a `DOORS` entry at **c19, r24** — the pavement beside the Ginger Light corner, where the K6 actually stands, verified walkable ('P', entered from the Dean Street road at c18). Same pattern as the doorways: invisible as text, a place on the map.

**A problem worth recording.** The K6 is modelled in the *Approach The Ginger Light* render, which since the opening-funnel work is reachable only on the very first landing, before you have refused anything or found the coin. So the box could not live there and be usable. It is its own map location instead, on the same corner.

**AOIFE'S LINES ARE NOT WRITTEN.** The passage carries a clearly-marked `PLACEHOLDER` where she answers. Everything around it is scene-setting (the box, the coin, the dialling); none of it is her, and none of it should be taken as a draft of her. Sam writes her himself (see `project_aoife_underwritten`).

**Verified:** passage renders with no errors in the coin-but-no-refusals state; hub link present and parked off-screen with no visible text links added; map door reads back from `dssSohoMap` at c19/r24 with its matcher. **Not verified live:** the spend itself and the `$refusedCalls > 0` branch, because the save had `$hadPhoneCall` already true so no call would ring to refuse. The branch is a plain if/else-if chain and compiles clean, but nobody has watched the coin go in.

synced, commit when ready

### Addendum 43 — character line drawings as background presence: Red (2026-09-13)
Sam has generated single-line ink portraits of the cast and dislikes the corner monograms. After trying a few framings his own idea won: *"We have a black background. Maybe these single line drawings can become part of the background in which against the black?"*

**Red is wired as a prototype.** One CSS rule, no JavaScript, sigils untouched. It uses the mechanism the venues already use — `tw-passage[tags~="venue-french"]` tints a passage by tag — so `tw-passage[tags~="char-red"]` needs nothing new. It applies automatically to his three passages: `At the Corner of Dean Street and Greek Street`, `LINE 1`, `You speak to the poet`.

**Two dead ends worth recording, because both will recur with the other twelve.**
1. **A ::before with `filter: invert(1)` + `mix-blend-mode: screen` rendered completely invisibly.** Filter and mix-blend-mode each open a stacking context, and at `z-index:-1` the layer ended up behind `tw-story`'s **opaque** gradient. Computed styles all looked correct (403x1159 at left -91px), which is what made it confusing. Do not reach for blend modes here.
2. **`opacity` cannot be used to knock the art back**, because on the element it fades the prose too.

**What works.** The art was converted on disk to **line-on-transparent** (warm ink `#e8d6b4`, alpha taken from the darkness of the original line, paper noise below 14 clipped to zero, line firmed 1.25x): 1144x1375, 1.7MB RGB in, 691KB RGBA out. Then two background layers on the passage — the drawing underneath, and a flat scrim of the page's own ground on top:

```
background-image: linear-gradient(rgba(10,9,8,0.86), rgba(10,9,8,0.86)), url('char-red.png');
background-position: center, left -16% center;
background-size: cover, auto 96%;
```

**The scrim alpha is the dial.** 0.86 is where it landed: the beret, one eye and the jaw read out of the dark, the lamp sits over it, and the prose is unaffected. Higher = fainter. Size and horizontal position are the other two dials.

**Linked, not embedded.** `char-red.png` sits beside the .html and is referenced relatively, like the audio. Thirteen of these inside the build would be absurd, and linking means an image can be swapped without a rebuild. **Do not add them to `IMAGE_EMBEDS`.**

**For the other twelve:** the source files are in `Claude work/` one level up (`The great Ham.png`, `John st john line.png`, `Clive james.png`, `John St John.png`, `Jeremy Reed Image.png` so far). Each needs the same on-disk conversion to line-on-transparent, then one CSS rule. The conversion script is inline in this session's history; it decodes and re-encodes PNG with zlib and needs no Pillow, which is not installed and cannot be pip-installed here (PEP 668).

**The drawing is FIXED to the viewport** (`background-attachment: scroll, fixed` — scrim scrolls, art does not). Sam's idea, and it solved the framing problem outright: the portrait no longer depends on how tall the passage is, so a long scene and a short one look identical, and he simply stands there while the lamp and the prose scroll up over him.

Two traps that came with it, both recorded because they will recur:
- With `fixed`, the layer is positioned against the **viewport** but still **clipped to the passage box**. A `left 2%` position therefore put him beside the text column and all you saw was a sliver of hair. **Centre it**: the passage is itself centred with a max-width, so `center` keeps the two aligned at any window width with no arithmetic on the gutter.
- Percentage sizes also resolve against the viewport under `fixed`, which is what makes the framing stable. Current values: `auto 96%` desktop, `auto 80%` under 720px.
- iOS Safari ignores `background-attachment: fixed` and falls back to scroll. That degrades to roughly the old behaviour rather than breaking.

**Red's likeness was regenerated.** The first drawing was, in Sam's words, "clearly Percy Shelley in a beret"; he supplied a photograph of the real poet and produced `New RED POET.png`, which carries the fringe, the hooded eyes, the cravat and the beret pushed back. Converted and installed as `char-red.png` (1145x1374, 373KB). **I cannot draw or regenerate these** — no image generation is available in this session — so every likeness has to come from Sam; my side is conversion, placement and tuning.

**Five faces wired (2026-09-13, 02:15).** Each is one line of CSS plus a converted PNG beside the .html; all shared behaviour (scrim, fixed attachment, centring, sizing) lives in one rule above them.

| character | tag | source drawing |
|---|---|---|
| Red, the poet | `char-red` | New RED POET.png |
| John St John | `char-john` | John st john line.png |
| The Great Ham | `char-ham` | The great Ham.png *(re-converted from Sam's 02:08 re-save)* |
| The novelist | `char-novelist` | Noevlist.png |
| Davy Merkin | `char-davy` | Australian.png |

**Two mapping traps, both resolved by asking rather than guessing.**
- **The novelist had no `char-` tag at all** — alone among the cast, `The novelist` and `Approach the novelist` were tagged `venue-french` only, so there was nothing for the CSS to key off. `char-novelist` added to both. He has no sigil registry entry either, which is harmless: `update()` guards with `if (registry[id])`, so no corner mark appears for him.
- **"Clive the Australian" is Davy Merkin.** The drawing arrived as `Australian.png`, but the words "Australian" and "Clive" appear **nowhere** in the .twee. Sam identified him as the drinking man at the Colony Room bar, which is `char-davy`; the file was renamed to `char-davy.png` to match the tag. Confirmed correct by his own prose in that scene: *"The accent is Anglo-Antipodean… it strays audibly at its burnt edges into an outback."*

**Not line drawings:** `Clive james.png` and `John St John.png` are watercolours — full colour, tonal, on painted grounds. They will NOT survive the line-on-transparent conversion (alpha-from-darkness turns a painting into a solid mass) and are presumably references rather than assets.

**The converter is saved at `/tmp/linify.py`** — decodes and re-encodes PNG with zlib, no Pillow (which is not installed and cannot be pip-installed here, PEP 668). Usage: `python3 /tmp/linify.py <source> <dest>`. Ink `#e8d6b4`, alpha from line darkness, noise below 14 clipped, line firmed 1.25x.

**Still open:** whether the corner monograms stay once characters have faces. Deliberately not touched — that decision is better made with something to compare against, and there are now five to compare.

synced, commit when ready

### Addendum 44 — monograms retired; Red out of the poem (2026-09-13)
Sam, once he had five faces to compare against: *"Get rid of the monograms. Also No red in the poem, that is separate."*

**The corner sigils are gone.** They were the gold cartouche plus emblem plus hand-drawn initial in the bottom-left, raised per passage from `char-<id>` tags. With the line-drawing portraits doing the work behind the prose, an abstract badge beside a face was redundant.

Retired rather than deleted: the call in the navigation handler is now `if (false && window.dssSigils)`, and `#dss-sigil-corner` carries `display: none !important`. The whole module above it — the 13-entry `CHARS` table, the `_L` monogram paths, the cartouche/emblem builders, the fade and stacking logic — is untouched and simply never invoked. Flipping that `false` and dropping the `display:none` brings it all back. Roughly 100 lines of hand-drawn SVG letterforms that took real work; not worth destroying at 2am on a preference that might swing back.

Verified: `#dss-sigil-corner` is never even created now (`ensureCorner()` lives inside the `update()` that no longer runs), and `.dss-sigil` count is 0 in character scenes that previously showed one.

**Red is out of the poem.** `LINE 1` carried `char-red`, so his portrait was appearing behind the alba. That scene is its own thing. The tag is removed from `LINE 1` only; he still appears in `At the Corner of Dean Street and Greek Street` and `You speak to the poet`. Verified: `LINE 1` now renders with no tags at all and no background art, and the alba text is unchanged.

**Note:** `char-` tags now have exactly one consumer, the portrait CSS. Nothing else in the build reads them. So adding or removing a `char-` tag is purely a question of whether that character's face should appear in that scene.

synced, commit when ready

### Addendum 45 — sigil code deleted outright (2026-09-13)
Sam: *"delete the sigil code properly."* Addendum 44 had retired the monograms behind an `if (false && …)` and a `display:none`; they are now gone from the source.

**150 lines removed across three sites**, cut back-to-front so the line numbers stayed valid, with every boundary asserted before cutting:
- **107 lines** — the whole sigil module in the UserScript: the `// ====== CHARACTER SIGILS ======` IIFE, the 13-entry `CHARS` table, the `_L` hand-drawn monogram paths, the gradient/frame/emblem builders, `ensureCorner`, the fade-in/fade-out `update()`, and the `window.dssSigils` export.
- **17 lines** — the call site in the navigation handler, including the `[data-sigil]` scan that let a passage declare a character inline.
- **26 lines** — the stylesheet block: `#dss-sigil-corner`, `.dss-sigil`, `.dss-sigil-in`, the `svg` rule and `@keyframes dssSigilBreathe`.

**Verified after rebuild:** zero occurrences of `dssSigils`, `dss-sigil`, `dssSigilBreathe` or `CHARACTER SIGILS` anywhere in the .twee **or** the compiled .html; `window.dssSigils` is `undefined` at runtime; `dssAudio`, `dssSohoMap` and `dssKeyPopup` all still alive; 225 passages written, 229 headers, 321 links; console clean; zero `tw-error` in Davy Merkin, PP Pong and on load. All three seams inspected by eye — the JS block now runs straight from the drink handler into `// ====== SOHO MAP`, the navigation handler from the tags parse into `if (window.dssAudio)`, and the CSS from the typewriter-paper rule into `.cellar-scene`.

**The last residue went too**, on Sam's say-so: `PP Pong` carried `(if: $opponent is "Jack Curtis")[<span data-sigil="jack"></span>](else-if: …)[<span data-sigil="percy"></span>]`, which declared the current opponent to the retired system. Removed. **`<span id="pp-data-opponent">` on the same line was kept** — it is live, and the Pong script reads it 20 lines later (`var opponent = (document.getElementById('pp-data-opponent') || {}).textContent || 'Opponent';`). Verified after rebuild: zero `data-sigil` in the .twee or the .html, `pp-data-opponent` still present twice (the span and its reader), PP Pong renders its canvas with no `tw-error` and a clean console.

*(On a debug jump into PP Pong that span reads empty, because `$opponent` is only set coming through Lackland's back room. The script's `|| 'Opponent'` fallback covers it. Pre-existing behaviour, not a consequence of this edit.)*

**A backup of the pre-deletion .twee is at `/tmp/twee-before-sigil-delete.twee`** for the rest of this machine's uptime. After that, the monogram artwork exists only in git history — the last commit containing it is whatever precedes this one.

synced, commit when ready

### Addendum 46 — autonomous mechanics run (2026-09-13, started 02:43 BST, 2.5 hours)
Sam asleep. Focus: mechanics, not aesthetics. No prose changes; pink `.claude-draft` lines untouched. No git. No `SAVED-*` / `BACKUP-*`. Game hard-muted for all live testing.

**Baseline at 02:43:** 229 passages, 321 `[[` links, 158 `claude-draft`, 3643 KB.

**This addendum is written incrementally** — every completed item is synced, logged here and copied to `PLAYTEST.html` before the next begins, so an abrupt stop at any point leaves a coherent build and an accurate record. Entries below are in the order they were done.

#### Log

**1. SOFT-LOCK SWEEP — clean, no new instances (02:43–02:56).** Nothing changed; this is a negative result, recorded so it need not be redone.

Three checks, each narrowing on the class that produced tonight's five-instance bug:
- **Passages with no exit at all:** 3 candidates, all legitimate — `StoryInit` (startup), `Dawn` (the ending), and `None of us likes it!`, which was a false positive: it exits via `(link-goto:)` with a *computed* label (`"Put //" + (text: $bookTitle) + "//…"`), which a naive regex misses. Worth knowing: **any sweep for exits must handle computed `(link-goto:)`** or it will report phantom dead ends.
- **Passages whose every exit is conditional:** 14 candidates, narrowed to 8 once hooks opened by `(link:)` (always clickable) were distinguished from hooks opened by `(if:)` (possibly never shown). All 8 — `Approach Centre Point`, `Failure: Trisha's`, both `Fight Victory` passages, `Shana Looks Again`, `LINE 2`, `LINE 3`, `Carthage shore` — carry a matching `(else:)`, so a branch always fires. Safe.
- **The actual failure mode from tonight** was not a missing exit but a *fixed overlay with a click-catching scrim* whose content could reach a state with no link inside it. Swept the stylesheet for all 26 `position: fixed` classes and cross-referenced against passage markup. **`.phone-ringing` is the only passage-rendered fixed overlay with a full-page scrim**, and it is the one already fixed in all five venues. The only other passage-rendered fixed overlay, `.coach-plumbing-intro`, is harmless: `pointer-events: none`, a 5.6s fade, and an explicit `removeChild` at 6100ms.

Tooling written for this and reused by later sweeps: `/tmp/dss_parse.py` (passage/tag/link parser) and `/tmp/hookscan.py` (walks a body tracking *which macro opened each hook*, so a nav inside `(if:)` is distinguished from one inside `(link:)`).

### Sweep 2 — new-game resets (done)

**The bug.** `[[BEGIN|Start]]` on the Title is a plain passage link. There is no
`(restart:)` anywhere in the file (count: 0). So StoryInit does **not** run again
on a new game, and every variable that StoryInit declared and play then latched
`true` carried straight into the next playthrough.

Verified empirically rather than assumed: a probe printed at the Title after a
completed run read `lilyCount=5`, proving state survives the walk back to the
Title intact. (A second probe reading `mantraComplete=false` was a debug-jump
artefact, not evidence against this — see `project_debug_jump_autosave`. Debug
jumps restore the autosave, so they cannot be used to test persistence.)

**Effect on a replay before the fix:** the whole v2 dream layer (all five world
centres, both mantra halves, the third-pillar crossing, every `*Recognised` and
`*ResidueSeen` flag), all three minigame win flags, and a dozen one-off stat
gains began the second night already completed and already spent.

**Fixed.** 31 variables added to the NEW-GAME RESETS block in `Start`, each set
to its exact StoryInit value:

- dream layer: `$critEndorsed` `$crossedThreshold` `$easterGlyph`
  `$easterResidueSeen` `$ezekielResidueSeen` `$ezekielVision`
  `$himalayaResidueSeen` `$nazcaResidueSeen` `$nazcaTracing` `$pyramidNumber`
  `$pyramidResidueSeen` `$inisRecognised` `$inisToldOfPillars`
  `$lacklandRecognised` `$redRecognised` `$spanishArtistRecognised`
  `$mantraComplete` `$mantraHalf1` `$mantraHalf2` `$sawHexagram`
  `$sawThirdPillar` `$tonightsWorld`
- minigames: `$himalayaClimbWon` `$nazcaRaceWon` `$pyramidRunWon`
- constant data restored to pristine order: `$mantra`, `$keyNames`,
  `$haunt1`–`$haunt12`

Plus six one-way latches that were **never initialised anywhere at all**, not
even in StoryInit — they only ever got written the moment play consumed them:
`$easterReclaim` `$hangedManLooked` `$shownLedgerTip` `$squareBenchTaken`
`$stumbledCrossing` `$wormPlayed`. On a replay the Soho Square bench gain, the
worm-game gain, the ledger tip and Shana's second look all stayed consumed.
`$prevConfidence`/`$prevSobriety` also reset to 70 so the first stat-bar delta
of a new night animates from the right place.

**Deliberately left alone** (self-healing, no bug): `$binOf` and `$stashLabel`
rebuild themselves behind an `(unless: ... is a datamap)` guard; `$nightAlbaCount`
is recomputed from zero every time it is read.

**Verified:** clean load, storage cleared, BEGIN clicked. Zero `tw-error`s, and
the passage advanced to The Walk In. Since the `(go-to:)` at the foot of `Start`
sits after the new block, arriving at The Walk In proves all 27 inserted lines
executed.

Both temporary debug probes (`resetprobe` on Dean Street, `titleprobe` on the
Title) have been removed. Zero occurrences remain in the file.

### Sweep 3 — unreachable content (done, one fix)

Scanned every link form (`[[x]]`, `[[x|Y]]`, `[[x->Y]]`, `[[Y<-x]]`, `(go-to:)`,
`(display:)`, `(link-goto:)`, `(link-reveal-goto:)`, `(redirect:)`) against the
passage list.

**Broken targets: 1 real.** `Fetch Street SVG` carried `[[Follow him]]` — a bare
link with no target, and no passage of that name exists. It sat inside an HTML
comment describing the animation, which is exactly the construction that bit us
in `Start`: Harlowe parses inside HTML comments. Reworded to plain prose, no
brackets. Zero occurrences remain.

Everything else the first scan flagged was a false positive worth recording so
the next pass does not re-chase it:
- `UserScript` is a bare-JS passage with no `<script>` wrapper, so its nested
  array literals `[[1,2],[3,4]]` read as Twine links. Strip script passages by
  name, not just by tag.
- `(link-goto: label, target)` puts the **label first**. A naive "first quoted
  string" scan reports labels as broken targets, and a "last quoted string" scan
  breaks when an argument contains a nested macro such as
  `(link-goto: "Put //" + (text: $bookTitle) + "// on the table", "The critic's judgement")`,
  because the regex stops at the inner `)`.

**Orphans: 0 real.** `Title` has no inbound because it is the engine's start
passage (`"start": "Title"` in StoryData). `The critic's judgement` looked
orphaned only because of the nested-macro regex fault above; it is reached from
the guided link in `None of us likes it!`. The `DBG *` passages are debug-menu
only.

**Hard dead ends: 0 real.** All 16 link-free passages are art or system
fragments pulled in with `(display:)`.

### Sweep 4 — variables read but never set, set but never read (done, no fixes)

**Read but never set: 0 real.** `$albaN`, `$hauntN`, `$tookLilyN` and `$stat` all
appear only inside comments as generic placeholders standing for a family
(`$haunt1`–`$haunt12`) or as example syntax.

**Set but never read: 10 genuine dead writes.** `$albaRevealed` `$cigReturnTo`
`$crossedThreshold` `$drankAtFrench` `$easterReclaim` `$mantraHalf2` `$oppScore`
`$ppScore` `$sawHexagram` `$sawInvertedPentangle`. Each is written during play
and read by nothing anywhere in the file. They are harmless, and I have **not**
removed them: deciding whether `$crossedThreshold` or `$drankAtFrench` was meant
to gate something is a design call, not a correctness one. They are listed here
as a question, below.

`$mantraHalf1` is the one that is read, but only by its own
`(if: $mantraHalf1 is false)` once-only guard around the HALF A MANTRA item box.
So both halves are vestigial bookkeeping: `$mantraComplete`, set in `The Cave`,
is the flag that actually gates the Himalayas ledger, the residue mark and the
critic's endorsement.

### Sweep 5 — Harlowe grammar landmines (done, one fix, and it was the big one)

**Found a live, player-reachable error on the endgame gate.** Walking the game
from a clean start and clicking through, `Approach Centre Point` threw:

> This use of "is not" and "and" is grammatically ambiguous.

The line was the gate that decides which ending the player gets:

```
(if: $notebook is not "stolen" and ($alba contains $alba1) and ($alba contains $alba2) and ($alba contains $alba3))[ ... Alba Complete ... ](else:)[ ... Alba Incomplete ... ]
```

Because the `(if:)` errored rather than evaluating, a player who reached Centre
Point saw a Harlowe error where the ending should be. Fixed by moving the
`is not` clause to the end and parenthesising it. `and` is commutative, so the
condition is semantically identical:

```
(if: ($alba contains $alba1) and ($alba contains $alba2) and ($alba contains $alba3) and ($notebook is not "stolen"))[
```

**Verified live:** clean load, walked the same route, zero `tw-error`s, and the
passage now resolves to an ending and runs on to "Traveller, sleep!" and the
endless-knot close.

This is the same failure class as the `Entering The Pillars of Hercules` gate
earlier tonight. The rule, now confirmed twice: **in a chain of `and`s, an
`is not` comparison must come last and be wrapped in its own parentheses.**
`(if: $matchesLeft is not a number or $matchesLeft <= 0)` on Dean Street is
*not* an instance of this and parses fine, because `is not a` is a type check
rather than a value comparison. Left alone.

**Macros inside HTML comments: 10 comment blocks contain macro-shaped text**
(`Dawn`, `Dean Street` x3, `Fetch Window SVG`, `header header` x2, `The Cave`,
`Mantra Syllable Cue`, `Resting Keys`). None of them currently break anything,
and `header header` runs on every passage in the game, so if that one were
executing we would know instantly. The distinction that matters: the `Start`
comment that broke the resets held a **complete, valid** macro call, whereas
these hold fragments such as `(if:`, `(set:)` or `(display:)` with no arguments.
Left alone, but they are a standing hazard: anyone completing one of those
fragments while editing a comment will silently break the passage below it.

### Sweep 6 — soft-locks (done, no fixes; one risk flagged)

Method: find every passage whose exits are **all** nested inside a conditional
hook, then subtract the ones that are safe anyway. 20 passages had only nested
exits, but the safety net is `header header`: it draws "← BACK" on every passage
**except** the 161 names in `_hideStats`. So the only real risk is a passage that
is both header-suppressed and has no unconditional exit.

That leaves two, and both turn out to be fine: `Dawn Approach White` and
`Dawn Approach Black` each carry a single `(after: 16s)[(go-to: "White page")]`.
The game advances itself; there is no link because the player is not meant to
click one.

**Flagged, not fixed.** Per `project_preview_tab_backgrounded`, a hidden tab
stalls Harlowe's `(after:)` while plain `setTimeout` keeps running. If a player
switches away during the 16-second dawn cinematic, the auto-advance may not fire,
and these two passages have no link and no header, so there is nothing to click
on return. In real Chrome a background tab throttles timers rather than stopping
them, so this is most likely a delay rather than a lock, and it was the preview
pane where we actually saw `(after:)` die. That is why I have not touched it:
the cheap robust fix (an off-screen-parked link plus a `setTimeout` that clicks
it as a fallback) would be invisible, but it puts belt-and-braces machinery into
the climax of the game on an unproven premise, and that is your call rather than
mine. A 30-second human test settles it: start the dawn sequence, switch tabs for
half a minute, switch back, and see whether it has moved on.

The other 18 are all genuinely safe: `Approach Centre Point`, `Fight Victory` and
`Fight Victory Perfect` have `(else:)` branches carrying an exit, and the rest
(`Coach and Horses bar`, `Ronnie Scott's`, `The Colony Room`, `Lily phone call 1`,
`The dual ring`, `Build Notebook`, the five `Key Take *` passages and
`Key Stash Here`) all keep the header, so "← BACK" is always there.

### Sweep 7 — stat arithmetic (done, no fixes; one question with numbers)

134 stat writes go through `($statGain:)` / `($statLoss:)`. 33 do not, and 19 of
those are legitimate: the StoryInit and `Start` initialisers, the `DBG Complete`
setup, the 0/100 clamps in `Dean Street` and `header header`, and the deliberate
hard sets in `The dual ring`.

The remaining **14 are raw arithmetic, and all 14 are in the v2 dream worlds** —
added during the expansion without going through the macros:

- losses: `The Mountain` (-12 sobriety, -9 confidence), `Walking the Pampa` (-6),
  `The Ridge` (-4), `The Listening Moai` (-6), `Descending Corridor` (-4),
  `Grand Gallery` (-5), `Storm from the North` (-5), `Four Living Creatures` (-8)
- gains: the five recognition beats — `Red Recognises the Name` (+10),
  `Benito Recognises the Wheel` (+14), `The Critic Hears the Mantra` (+10),
  `Lackland Recognises the Tracing` (+10), `Inis Recognises the Proportion` (+10)

**This is not a correctness bug.** `header header` clamps both stats to 0–100 on
every render, so nothing can go negative or over 100 for more than a frame. I
have changed nothing.

It is a **feel** difference, which is yours to rule on. The macros are
proportional to headroom; raw arithmetic is flat. Concretely:

- At sobriety 20, `($statLoss: 20, 12)` costs about 5 and leaves 15. Raw `- 12`
  leaves 8. The raw version is roughly twice as punishing when you are already
  in trouble, and it has no floor protection.
- At confidence 90, `($statGain: 90, 10)` gives about +2, to 92. Raw `+ 10`
  takes you to 100. The raw version is far more generous when you are already
  flying, and the five recognition beats together can lift a middling night
  straight to the ceiling.

So the dream worlds currently punish harder at the bottom and reward harder at
the top than the rest of the game. If you want them to match Soho, the change is
mechanical: swap each to the macro form with the same number. If you want the
dream worlds to hit differently on purpose, leave them. Say which and it is a
ten-minute job.

### Sweep 8 — Soho map doors vs hub links (done, no bugs)

The map has 28 entries in `DOORS`, each matching a rendered `tw-link` by regex.
A stale regex would mean a dead tile; a missing entry would mean a venue absent
from the map. Checked every regex against every link label Dean Street can emit.

All 28 resolve. A first static pass appeared to show 10 doors with no matching
link (`phonebox`, `meard`, `stannes`, `bourchier`, `richmond`, `batemans`,
`walkers`, `greekcourt`, `foyles`, `oxfordend`) but that was my own scanner: when
a link is the first thing inside a conditional hook the source reads
`)[[[Meard Street|Alley: Meard Street]]`, and a naive `[[...]]` regex swallows the
hook's opening bracket, producing the label `[Meard Street`, which of course fails
`^Meard Street$`.

Confirmed live rather than by argument: walked a clean game to Dean Street and
read the rendered labels straight off the DOM. No label carries a leading
bracket, so the anchored regexes match as intended. Noting the artefact here so
the next pass does not re-chase it.

Incidentally confirmed while there: on the first visit only `Head towards dawn`
and `See who's there` are in the dock, both parked off-screen, so the player is
not tipped towards the exit from the map. That is the behaviour you asked for.

### Note on testing while muted

The mute flag lives in `localStorage` under `dssMuted2`, so a plain
`localStorage.clear()` — which is how you force a clean new game for testing —
**wipes the mute**. Session restore also uses `sessionStorage`, so both need
clearing to actually reach the Title. The safe reset for unattended work is:

```
localStorage.clear(); sessionStorage.clear(); localStorage.setItem('dssMuted2','1');
```

then reload. Verified: `dssAudio.isMuted()` reads true through the reload and all
the way into Dean Street.

### Sweep 9 — pocket keys and the stash system (done, no bugs; one comment corrected)

This is the newest code in the game and no human has played it, so I traced the
whole state machine rather than spot-checking.

**The five key variables are coherent.** Each of `$keyCocaine` `$keyTicket`
`$keySlip` `$keyLighter` `$keyEye` holds one of `seed`, `held`, `spent`,
`stolen`, `traded`, or the name of the passage it is lying in. Every value that
is written is tested for somewhere, and every value tested for is written
somewhere. No orphan states.

**The retrieval loop is closed.** 14 stash sites: 9 alley hiding places and 5
bins. Every bin in `$binOf` resolves to a real approach passage, and all 14 sites
are themselves stash sites, so a key can always be picked up where it was put
down. `Key Drop Here` ends with `(display: "Key Sites")`, so `$stashSites` is
rebuilt at the moment of the drop, and the Dean Street dock keeps an alley in the
list while it holds a key even after that alley has been used once. That is the
retrieve path and it is wired correctly.

`Resting Keys` does not read `$stashSites` at all; it tests
`$keyCocaine is (passage:)'s name` directly, so the offer to pick a key back up
cannot go stale.

**Bourchier Street looked like a bug and is not.** It is the only one of the ten
alleys whose dock guard lacks the `$stashSites` escape, which would strand a key
left there. It cannot be stranded, because Bourchier Street is not a stash site:
it has no `Stash Point`. It is the mugging alley, dark red on the map. Not being
able to hide anything in it is right.

**`Key Sites` uses the correct long form** of the negated chain
(`$k is not "a" and $k is not "b" ...`, repeating the variable), which is exactly
what Harlowe's own error message prescribes. That is why it does not throw the
way the Centre Point gate did.

**One comment corrected.** The note at the top of `Key Drop Here` claimed that
setting a key down inside a venue leaves it in the bin by that venue's door. It
cannot: the drop is only ever offered by `Key Stash Here`, which only appears via
`Stash Point`, and no venue interior is a stash site. The remap is harmless
defensive code, so I left it, but the comment now says what actually happens
instead of describing a path that does not exist.

### Sweep 10 — venue opening progression (done, no bugs)

I did not re-derive the design here: the gradual-opening rework is yours and you
signed it off, so I only checked the mechanical question, which is whether any
venue can be permanently shut because its guard can never become true.

None can. All 23 flags that gate the Dean Street venue links — `$coachUrgent`,
`$metCritic`, `$knowsRonnies`, `$knowsLackland`, `$knowsCopperSecret`,
`$knowsCecilCourt`, `$hasTrishaMatchbook`, `$hadPhoneCall`, `$hadChippy`,
`$completedSetlist`, `$returnedPage`, `$hasMissingPage`, `$metShana`,
`$hauntExplained`, `$lilyHintShown`, `$metRed`, `$hadBreather`,
`$knowsAboutPage` and `$tookLily1`–`5` — are set true somewhere in ordinary play,
not only in `DBG Complete`.

Confirming the shape of it: the progression is driven entirely by story flags,
not by a turn counter, which is consistent with `$nightLength` having been
removed. The Pillars opens on `$metCritic is false`, so it is available early;
the French opens once the coach-urgent funnel clears; everything else hangs off
learning about it first.

### Sweep 11 — the ALBA and the notebook (done, no bugs)

The win condition is the one thing that must not be breakable, so I traced both
halves of it.

**Alba acquisition matches the design.** `$alba1` comes from `LINE 1` only.
`$alba2` has six routes: `LINE 2` plus all five dream-world centres (`The Cave`,
`The Centre — Nazca`, `The Glyph`, `King's Chamber`, `The Wheel`). `$alba3` comes
from `LINE 3` only. That is exactly "alba 2 findable in all five world centres,
alba 3 stays single-road".

**Nothing can wipe a collected line.** Seven passages contain
`(set: $alba to (a:))`, which empties it, and five of those are ordinary play
passages — `Dean Street`, `The Interval`, `header header`, `Build Notebook`,
`Night Progress`. All five are guarded `(unless: $alba is an array)`, so they only
ever fire as a type self-heal and never against a populated list. The two
unguarded ones are StoryInit and `Start`, which is correct.

**The notebook cannot be permanently lost.** It is taken in exactly one place,
`Bourchier Street: The Car Park`, which is the mugging alley, and there are two
independent ways back:
- `Alley: Charing Cross Road`. The Dean Street dock guard for that alley is
  `$notebook is "stolen" or ($stashSites contains ...) or not ($alleys contains "foyles")`,
  so losing the notebook specifically reopens Foyles to let you get it back. That
  is a nice piece of design and it is wired correctly.
- `PP Victory`, if you staked it, via `$notebookStake`.

The `(set: $notebook to "held")` lines in `header header` and `Key Guards` are
both `(unless: $notebook is a string)` type self-heals, so they do not undo the
theft on the next render. `header header` also draws the "notebook gone"
indicator while it is missing.

So there is no state in which the game becomes unwinnable.

### Sweep 12 — minigame outcome bridges (done, no bugs, and one standing belief disproved)

Every minigame reports its result the same way: a hidden span wrapping a Twine
link, which the game's JS clicks when the round ends. If those clicks were being
dropped, a player would finish PP Pong or the bar canvas and simply sit there.

Twelve such bridges exist. Nine of them park the link with `display:none`:
`#pp-go-win`, `#pp-go-lose`, `#bar-win-link`, `#bar-lose-link`, `#go-copper-yes`,
`#go-copper-no`, `#go-lackland-yes`, `#salvuGoLink`, `#dss-portal-fallback`.
Three park it off-screen instead: `#dss-portal-roll`, `#reclaim-exit`,
`#dss-portal-action`. None of the nine un-hides before clicking.

By the rule we have been carrying since the portal bug — that Harlowe drops
clicks on a link with no layout box — all nine should be broken. They are not,
and PP Pong plainly works, so I tested the rule itself instead of trusting it.

**Result: the rule is wrong.** On a live Dean Street I took a real `tw-link`, set
its containing `tw-hook` to `display:none`, confirmed it had no layout box
(`offsetParent === null` and `getClientRects().length === 0`), and clicked it
programmatically. It navigated, `hub` to `outdoor`. A scripted `.click()`
dispatches a bubbling event whatever the layout, and Harlowe's delegated handler
catches it.

So all twelve bridges are sound and **none of them should be "fixed"**. I have
corrected the project memory that carried the wrong rule, because it was the kind
of belief that causes someone to rewrite nine working things.

Whatever broke the Third Pillar Portal's hidden links on 2026-09-01, it was not
`display:none`. The likelier cause is the link not yet being in the DOM when the
click fired. Off-screen parking remains a good pattern and the three that use it
should stay as they are.

### Sweep 13 — full graph reachability (done, no bugs; one thing to confirm is intentional)

Built the whole link graph (every `[[ ]]` form plus `(go-to:)`, `(display:)`,
`(link-goto:)`, `(link-reveal-goto:)`, with the header's links treated as
available everywhere) and asked of every passage: can the player still get back
to Dean Street from here?

47 cannot, and 46 of those are correct:
- the ending chain, which is one-way by design: `Approach Centre Point` into
  `Alba Complete` / `Alba Incomplete`, into `Dawn Approach White` / `Black`, into
  `White page` / `Black page`, into `Dawn`. Also `No more`.
- art and system fragments that are `(display:)`ed into a host and never
  navigated to: the rule SVGs, `Lily SVG`, `Tarot Card Back`, `Soho Hut Art`,
  `Dawn Lily Sprig`, `Ending Vines SVG`, `Night Progress`, `Mantra Syllable Cue`,
  and the whole `Key *` / `Stash Point` family.

**Two looked stranded and are not.** `Lily phone call 1` and `Eat Shelleys Liver`
appear to have no exit at all, because their exits are
`(link-goto: "Hang up.", $lilyCallReturn)` and `(link-goto: "·", $liverReturnTo)`
— the destination is a variable, which a static graph cannot follow. Both
variables are set at every call site, are initialised in **both** StoryInit and
`Start`, and default to `"Dean Street"`. So even if a call site ever forgot to
set one, the player lands on the hub rather than a dead link. That is the right
way round and worth keeping.

**One to confirm is deliberate.** `The Synthesis` is a one-way commit to an
ending: `The Synthesis` into `The Sanctum` into `The Sanctum — Sitting` into
`Alt-Dawn` into `Dawn`, with no route back to Soho. It is entered from a single
choice-box link, `[[Perform the synthesis]]`, so it reads as an intentional
alternate ending for the esoteric layer rather than something a player wanders
into. Flagging it only because it is the one place in the game where a single
click ends the night without saying so, and the warning-before-you-leave idea you
described for the Centre Point exit would apply here too if you wanted it.

### Sweep 14 — hook brackets and an automated error crawl (done, no bugs)

**Hook brackets: every passage balances.** Harlowe hooks are `[ ]` and one
unbalanced bracket silently swallows everything after it, which matters here
because some Dean Street lines are thousands of characters long. Checked all 229
passages with scripts, styles, SVG, comments, strings and Twine links discounted.
Zero imbalances.

(A first pass reported 11 imbalances, all negative, Dean Street at −26. Same
`)[[[` artefact as Sweep 8: a link that opens a hook reads as `[` + `[[`, and a
lazy `\[\[.*?\]\]` swallows the hook bracket. Matching links as `\[\[[^\[\]]*\]\]`
fixes it and everything balances. Third time this construct has produced a false
positive tonight, hence the repeated notes.)

**Automated error crawl: 80 steps, 41 distinct passages, zero `tw-error`s.**
A random walk from a clean start, ignoring BACK and NOTEBOOK so it explores
rather than pacing. It reached the Colony, Trisha's, the Pillars threshold,
Ronnie Scott's, Lackland's office, Foyles, Soho Square, Greek Court, Richmond
Buildings, the phone box, the Fetch, Carthage and a PP Pong victory.

This is the same method that turned up the Centre Point endgame error earlier,
so a clean run over this much of the game is meaningful evidence rather than
just an absence of news.

It also exercised the stash system in live play, hitting both
"Leave the bag of cocaine here" and, later, "The bag of cocaine is where you left
it." That is the drop and the retrieve offer both rendering under real
conditions, which is the part of Sweep 9 that static analysis could not prove.

### Verification of the Sweep 2 reset fix (proved on a dirty state)

Earlier I could only show that the new reset block *executes*. That is weaker
than showing it *clears real progress*, so I proved the whole thing with a
temporary probe printing five of the newly-reset variables, then removed it.

The run, in the exact shape a returning player produces:

| stage | probe |
| --- | --- |
| fresh game, arrived at Dean Street | `bench:false | worm:false | ledger:false | mantra:false | world:` |
| after walking into Soho Square | `bench:true | ...` |
| reload to the Title, then **BEGIN**, then back to Dean Street | `bench:false | ...` |

`$squareBenchTaken` is one of the six flags that were never initialised anywhere
in the file, so before tonight it would have stayed `true` into the second night
and the Soho Square bench would have been silently spent. It now clears.

Worth recording about the Title, because it shaped the test: the reload that gets
you there must clear `sessionStorage` only. Harlowe's own session restore lives
there, so clearing it returns you to the Title with both **BEGIN** and
**CONTINUE WHERE I LEFT OFF** offered, which is the real returning-player choice.
Clearing `localStorage` as well throws away the save (and the mute).

The probe has been removed. Zero occurrences of `resetcheck`, `resetprobe`,
`titleprobe` or `dss-probe` remain in the file, and the game reloads clean with
no `tw-error`s.

### Sweep 15 — the v2 dream layer, live (done, no errors)

The random crawl never reached the dream worlds, because they need the portal,
and `DBG Complete` is not a way in: it sets all five lilies taken, which
correctly suppresses the venue links and drops you at the end of the night.

So I jumped straight into the newest content instead, using the debug jump
(`#dss-debug-jump=<passage>` in the URL, which is all the debug panel's `jumpTo`
does — no dev flag needed). Eight passages, each loaded cold and checked for
`tw-error`:

| passage | result |
| --- | --- |
| The Cave | clean, offers "Say the mantra" |
| The Centre — Nazca | clean |
| The Glyph | clean |
| King's Chamber | clean |
| The Wheel | clean |
| Third Pillar Portal | clean |
| The Synthesis | clean |
| Airport Pub | clean |

Zero errors across all eight, so all five world centres, the portal, the
synthesis and the mantra's first half render correctly.

Note for whoever reads a jumped `Third Pillar Portal` next: its rendered text
comes back as "himalayas-go nazca-go easter-go pyramid-go ezekiel-go". That is
the off-screen-parked link list, not breakage — `innerText` still reports
off-screen elements. The 3D scene draws over it in normal play.

### Sweep 16 — the two sketch engines and the audio mute (done, no bugs)

**The napkin sketch's two engines are still in step.** The passage engine
(`updateButtonStates`) and the notebook popup engine (`updateButtons`) both carry
undo, clear, done, stroke history, touch handling, `toDataURL` and the audio
hooks, and **both draw through the same shared `window.dssWatercolourKit`**, so
there is no drawing-layer divergence. The standing advice to edit both when
changing one still holds.

**The game is genuinely silent, not just flagged silent.** Worth recording
because the overnight rule depends on it. On the Title and again on Dean Street,
where the music auto-triggers on the `hub` tag, there are **zero** `audio` or
`video` elements in the document at all, nothing playing, and no live
AudioContext. The mute stops the music player before it ever creates an element,
so it is not a case of something playing at volume zero.

---

## Addendum 46 — summary of the mechanics run

Twenty-two sweeps over the mechanics of the game rather than its look, plus two
open items closed by playing them. Everything below is in the .twee and synced;
`PLAYTEST.html` is refreshed.

### What was actually broken, and is now fixed

**1. The endgame gate threw an error instead of giving you an ending.**
`Approach Centre Point` decided between `Alba Complete` and `Alba Incomplete`
with a condition Harlowe refuses to parse (`is not` followed by `and`). A player
who walked to Centre Point got a red Harlowe error where the ending should be.
Reordered so the `is not` clause comes last and is parenthesised. Verified live:
the route now resolves and runs on into "Traveller, sleep!".

**2. A second playthrough began with the game already half-played.**
`BEGIN` on the Title is a plain link and nothing calls `(restart:)`, so StoryInit
never runs again. 31 variables that StoryInit declared, and 6 more that were never
declared anywhere, carried their `true` values straight into the next night: the
whole v2 dream layer, all three minigame wins, and a dozen one-off stat gains.
All 37 now reset in `Start`. Proved on a dirty state, not just in principle —
walked into Soho Square to set a flag, came back to the Title, pressed BEGIN, and
watched it clear.

**3. A broken link inside a comment.** `Fetch Street SVG` carried
`[[Follow him]]`, pointing at a passage that does not exist, inside an HTML
comment — the construction that silently broke the resets in `Start`. Reworded.

**4. A comment that described a path that does not exist**, at the top of
`Key Drop Here`. Corrected to say what the code actually does.

### What I checked and found sound

Unreachable content and broken targets; dead ends; variables read-but-never-set
and set-but-never-read; soft-locks; stat arithmetic; the Soho map's 28 door
regexes; the venue-opening progression; the pocket-key and stash system end to
end; the ALBA and the notebook; full graph reachability; hook-bracket balance;
the minigame outcome bridges; the two sketch engines; and the whole v2 dream
layer live, one passage at a time.

Three things back this up, all with zero Harlowe errors: a random 80-step walk
over 41 distinct passages; a second, coverage-biased crawl of 182 steps over 88
distinct passages that played a complete night through to the Dawn; and a cold
load of all five dream-world centres plus the portal, the synthesis and the
Airport Pub. The same crawl method is what turned up the endgame bug, so clean
results from it mean something. Both endings were then verified explicitly, the
winning one for the first time.

### One belief of mine that turned out to be wrong

I have been carrying a rule that Harlowe drops clicks on links with no layout
box, dating from the portal bug. Nine of the game's twelve minigame bridges park
their link with `display:none` and would all be broken if that were true, and
they are not. I tested it directly: a `tw-link` with `offsetParent === null` and
no client rects still navigates when clicked from script. **The rule is false**,
the nine bridges are fine, and none of them should be "fixed". The project memory
has been corrected, because that belief was the kind that makes someone rewrite
nine working things.

### Decisions left to you (I did not make them)

1. **The dream worlds use flat stat arithmetic** where the rest of the game uses
   the proportional macros. Not a bug, stats are clamped. But at sobriety 20 a
   raw `-12` leaves 8 where the macro would leave 15, and the five recognition
   beats can lift a middling night straight to 100. Match Soho, or keep the
   dream worlds harsher at the bottom and richer at the top? Ten minutes either
   way.
2. **Ten variables are written and never read**, including `$crossedThreshold`,
   `$drankAtFrench` and `$sawHexagram`. Harmless. Were any meant to gate
   something?
3. **`The Synthesis` is a one-way commit to an ending** from a single
   choice-box link, with no route back to Soho. Almost certainly deliberate, but
   it is the one place a single click ends the night without warning, and the
   warning you described for the Centre Point exit would suit it.
4. **The two dawn-approach passages rely on `(after: 16s)`** with no link and no
   header. If the tab is hidden the auto-advance may stall. Likely a delay rather
   than a lock in real Chrome. A 30-second human test settles it: start the dawn
   sequence, switch tabs, come back.

### Two open items closed by playing them

- **The north-edge map tile fires.** Walked the map to Centre Point; it triggers,
  shows the "the night ends when you choose" warning, and lets you back out.
- **The pocket-key complaint is resolved.** Keys are offered as a popup with a
  clear decision, and a held key appears in the notebook under "In Your Pocket",
  named and drawn. The full stash round-trip — take, stash in an alley, leave,
  come back, retrieve — was played end to end and works.

### Still yours to write

Aoife's lines for the phone box, the warning prose in `Towards Dawn`, and the
drawings for the remaining characters.

The north-edge map tile is no longer on this list: I walked the map to it and it
fires correctly, warns, and lets you back out. See Sweep 18 below.

### Housekeeping

Both temporary debug probes from earlier are gone, and so is the one I added to
prove the reset fix. Zero occurrences of `resetprobe`, `titleprobe`, `resetcheck`
or `dss-probe` remain. The game is hard-muted and verified silent: on Dean Street,
where the music triggers, there are no audio elements in the document at all.
No git commands were run.

**Testing note that cost me time, so it is written down:** the mute lives in
`localStorage` under `dssMuted2`, and Harlowe's session restore lives in
`sessionStorage`. A clean new game needs both cleared, which wipes the mute, so
the safe reset is `localStorage.clear(); sessionStorage.clear();
localStorage.setItem('dssMuted2','1')` then reload. To reach the Title with the
save intact, clear `sessionStorage` only. And any passage can be loaded directly
with `#dss-debug-jump=<name>` in the URL, which is all the debug panel does.

### Sweep 17 — macro-name typos (done, no bugs, and the comment hazard is narrower than feared)

Every macro name used anywhere in the game, checked against Harlowe's vocabulary.
Only four came back unrecognised and all four are fine:

- `(dm-names:)` is a real macro.
- `(loadgame:)` and `(savegame:)` are real: Harlowe ignores hyphens and case in
  macro names, so they resolve to `(load-game:)` and `(save-game:)`.
- `(Sam:` is not a macro at all. It appears four times inside comments, quoting
  you — two in JS comments, and two in **HTML** comments, in
  `Entering The Pillars of Hercules` and `Nazca Race`.

The last one mattered, because macros inside HTML comments do execute — that is
what broke the resets in `Start`. If `(Sam: "the Pillars isn't open enough")`
were being parsed as a macro call, it would throw "unknown macro" on a venue
passage.

It does not. Cold-loaded both passages: zero errors, and the `(Sam:` text does
not leak into the rendered page either.

**So the comment hazard is narrower than I wrote it up in Sweep 5.** Harlowe only
executes *recognised* macro names inside an HTML comment; an arbitrary
parenthesised word is left alone. That is why quoting you in a comment is safe,
and why the `Start` comment was not — it contained a real `(set:)`. The rule to
keep is: never put a **real macro name** followed by a colon inside a comment.

The only two custom macros in the game are `$statGain` and `$statLoss`.

### Sweep 18 — the north-edge map tile (partly closed, honestly)

This was on the open list as "nobody has yet watched the north-edge map tile
actually fire". I got it two thirds of the way closed.

**Confirmed:** the mechanism resolves. Sweep 8 showed the `north` door's regex
(`/Head towards dawn|dawn is coming|Give up on the night/i`) matches the label
Dean Street actually renders, with no stray bracket. And the tile is genuinely
drawn: the map exposes `window.dssSohoMap`, whose `state` carries the walker's
position, so I moved the walker to the north edge and sampled the canvas. The
Centre Point door colour then appears at the top of the map (y=17), 88 pixels of
it, where before it was nowhere near the top edge.

The first attempt at this was misleading and is worth recording so nobody repeats
it: sampling the canvas from a normal Dean Street view finds that colour only in
a small blob around x≈170, y≈290, nothing at the top. That is not the door. The
map is a scrolling viewport centred on the walker, so the north edge is simply
off-screen until you travel there.

**Still not confirmed:** that stepping onto the tile navigates. Drawing the door
and resolving its regex are not the same as the step firing the link, and I moved
the walker by setting its coordinates rather than walking it, so I have not seen
the transition happen. That last part still wants a human at the keyboard walking
north, or a keyboard-driven walk on the map.

#### Sweep 18, resolved: the north-edge tile fires correctly

I can close this properly. It works.

Walked the map walker from its start at column 17, row 22 straight up to row 0,
which is the Centre Point tile, and the door fired. The correction to what I
wrote a moment ago: my first reading said it did **not** navigate, because I
sampled the passage immediately on arrival and was still on Dean Street. Walking
onto a `spot` door starts an entering animation (`S.entering`), so the navigation
lands a beat later. It had fired by the next check.

What the player gets is exactly the edge exit you specified:

> Head towards dawn. The night ends when you choose. You can keep exploring, or
> go to Centre Point with what you have found.

with **Go towards dawn** and **Keep exploring**. I took "Keep exploring" and it
returned cleanly to Dean Street with the map intact and zero errors. So the exit
is real, it warns before it takes you, and it is escapable.

**How to drive the map from script, since this cost me several attempts.**
Neither synthetic `KeyboardEvent`s nor real arrow keys moved the walker: the
handler is `document`-level with capture and looks fine, but the keys did not
reach it and the page did not scroll either. What does work is the hidden d-pad —
`document.querySelector('[data-dir="up"]')` and its `down`/`left`/`right`
siblings — driven with `pointerdown` then `pointerup`. Holding produces
continuous movement, so a 300ms hold covers about two tiles.

Also worth knowing: `window.dssSohoMap.state` goes **null** when the map is not
on screen, so re-read it through a function rather than caching the object, or
the next passage throws a null dereference.

Incidental confirmation along the way: the coin popup fires on the hub as
designed, offers a toss and then "Pocket it", and the phone box link appears on
Dean Street once `$hasCoin` is set. That whole chain works.

### Sweep 19 — second error crawl, and both endings verified

**Second crawl, biased toward links it had not tried yet: 182 steps, 88 distinct
passages, 106 distinct links, zero `tw-error`s.** It ran until it played a
complete night and came to rest at the Dawn. Between the two crawls and the cold
loads, that is a large share of the player-facing game exercised without a single
Harlowe error.

**Both endings now confirmed, which matters because the endgame fix had only ever
been tested on one side.** The gate I rewrote decides between `Alba Complete` and
`Alba Incomplete`, and every crawl had landed on the incomplete branch. The
complete branch is the win state, and before tonight it could not be reached at
all without throwing.

So I forced it: built a night, jumped to `DBG Complete` to hold all three alba
lines with the notebook intact, then walked out through "Head towards dawn", "Go
towards dawn", the Fetch, and "Follow him" into `Approach Centre Point`.

| state | branch | zero errors |
| --- | --- | --- |
| alba incomplete | "Traveller, **sleep!**" | yes |
| all three lines held | "Traveller, **wake!**" | yes |

Both run on into the Dawn and the closing line, "And the English call it
everywhere, as I hear, the endless knot." The condition routes correctly in both
directions.

### Sweep 20 — the pocket-key complaint, closed (no bugs)

Your original note was: *"you never actually seem to get the object keys in your
notebook, you collect one or swap one and nothing changes"*, and later that the
keys were *"often hidden below the link"*. I played the whole loop to check it
properly rather than trusting the code.

Walked a night, jumped into `The French`, and the brass lighter is offered as a
**popup**, not as text under a link: "⟡ WITHIN REACH ⟡", the hand-drawn lighter
with the JT/SQ initials on it, the blurb, and two clear buttons, "Pocket the
brass lighter" and "Leave it".

Taking it transitions the same popup to a confirmation — "It goes in your pocket.
One pocket, one thing; that is the rule tonight. THE BRASS LIGHTER · POCKETED" —
with a single "Good" to dismiss. It dismisses cleanly and the overlay is removed
from the document.

The notebook then shows it. EFFECTS reads:

> ◈ A 'Donkey' Coin … ◈ **In Your Pocket** … The brass lighter, from the bar at
> The French.

and the 104px hand-drawn key SVG renders there properly: `display:block`,
`visibility:visible`, opacity 1, no hidden ancestor, laid out at 104×155 and
inside the viewport. So the key is both named and drawn.

Two things worth knowing for future checks of the notebook:

- `offsetParent` is **null** for elements inside the notebook because it is a
  fixed overlay, so it is a useless visibility test there. Use
  `getBoundingClientRect` plus a walk up the ancestors checking `display`,
  `visibility` and `opacity`, which is what I did.
- The key inventory lives on the **EFFECTS** tab; the notebook opens on FINDS, so
  anything checking it has to switch tabs first.

Incidentally visible in the same panel: the Donkey coin now sits properly inside
its dotted border, which is the 450 sizing you picked.

### Sweep 21 — the stash round-trip, played end to end (works)

The stash system is the thing you asked for most recently and no human had played
it, so I played the whole loop rather than reasoning about it.

1. Arrived at `The French`. The brass lighter is offered as a popup with
   "Pocket the brass lighter" / "Leave it".
2. Pocketed it. The popup turned to its confirmation, dismissed cleanly, and the
   notebook's EFFECTS tab showed it under **In Your Pocket** with its drawing.
3. Walked to `Alley: Meard Street`. The offer **"Leave the brass lighter here"**
   was there. Left it.
4. Back on Dean Street, **Meard Street was still listed** even though it is now a
   used alley. That is the `$stashSites` escape in the dock guard doing exactly
   its job: an alley stays reachable while it is holding something of yours.
5. Went back in. The offer returned as `data-kind="rest"` — "The brass lighter is
   where you left it" — and "Pocket the brass lighter" took it back.

Zero errors throughout. Drop, keep, return and retrieve all work.

**One thing that cost me half an hour and is worth knowing: `← BACK` in the
header is `(link-undo:)`, a real Harlowe undo.** It rewinds *variables*, not just
the passage. I pocketed the lighter, pressed BACK to leave the venue, and then
found no stash offer anywhere — because the undo had put the lighter back on the
bar. Nothing was broken. But it is worth being aware that a player who picks
something up and then uses BACK loses it again, which is standard Twine behaviour
and may be exactly what you want, but is the sort of thing that reads as a bug
when a tester reports it. Not a change I would make without you saying so.

Also worth noting for testing: a passage entered by debug jump can be a dead end
that only BACK escapes, because you arrive without the context that normally
supplies the exit. `The French` reached that way offers only "Approach". That is
an artefact of jumping, not a real dead end — Sweep 13 confirmed it is reachable
and escapable in normal play.

### Sweep 22 — can a minigame trap you? (done, no bugs)

Minigames are the one place a player could be stranded: several are in
`_hideStats`, so they have no header and no "← BACK", and if the game stalled
there would be nothing to click.

Only two are in that position with no escape link that avoids winning:
**PP Pong** and **Fight starts**. (`Nazca Race`, `Pyramid Run` and `The Climb`
keep the header, so they always have BACK. `Soho Square Gents` has "Back up to
the Square" and `Cecil Court Waltz` has "Slip out into Cecil Court".)

So I tested the worst case on PP Pong: started the match and then **touched
nothing at all**.

It resolves itself. The opponent took the five points, the score ran to
"YOU 0 · OPPONENT 1" and on, and the game exited on its own to **DEFEAT**, where
Percy Ritson tosses you the Trisha's matchbook and offers "Back to Dean Street".
Zero errors.

Two useful things fall out of that:

- **You cannot be trapped by being unable to play.** Losing by doing nothing is a
  complete, exiting outcome.
- **Losing does not block progression** — the defeat still hands over the
  matchbook, which is what sets `$hasTrishaMatchbook` and opens Trisha's.

It also confirms Sweep 12 in live play from the other direction: `#pp-go-lose` is
one of the `display:none` bridges, and it fired by itself under real conditions.

`Fight starts` is the same shape and almost certainly behaves the same way, but I
did not sit through a fight to prove it.

---

## Addendum 47 — BACK removed, venue street-exit added (2026-09-13)

At your instruction: "when you go into a venue there can be an 'Exit to the
street' option, but not a back."

### Why it mattered

`← BACK` was `(link-undo:)`, a real Harlowe undo. It rewound **variables**, not
just the passage, which quietly undercut most of the night's economy: it undid a
drink, a spent coin, a lost fight, and — the one that decided it — a pocket-key
swap. The stash system exists precisely so that giving something up is
recoverable *by walking back for it*. An undo button made that system pointless.

### What changed

**1. The header.** `(link-undo: "← BACK")` is gone. In its place, on venue
passages only, is `[[← Exit to the street|Dean Street]]`. It sits inside the same
`(unless: _backHide contains (passage:)'s name)` wrapper and the same
`_hideStats` suppression, so it can never appear anywhere BACK did not. The test
is an explicit list of the eleven `venue-*` tags rather than a prefix match or a
determiner, deliberately: after last night's grammar landmines I wanted no new
syntax in the header, which runs on every passage in the game.

61 passages gain the exit — every room of the French, the Colony, Ronnie's, the
Coach, Trisha's, Cecil Court, Lackland's, the Pillars, the cellar and the gents.
Any future passage tagged with a venue tag gets it automatically.

**2. The thirteen approach passages.** These each had their own
`<div class="approach-back">(link-undo: "← BACK")</div>`, and on an approach that
undo was the *only* way to decide not to go in. Removing it would have forced the
player through the door. They are now real links:

- the eleven `[outdoor]` approaches → `[[← Back to Dean Street|Dean Street]]`
- `Approach Coppers Lair` → `[[← Back|Maltese Gangsters]]`, where it is entered from
- `Green Sea Approach` → `[[← Back|Carthage shore]]`, likewise

**3.** A stale JS comment that named `(link-undo:)` was corrected. The guard it
describes is still needed: the `·` link finder must still skip the first
`tw-link`, which is now the `← Back` link.

### Nothing was stranded

Worth recording because it changed the plan. My soft-lock scan had flagged seven
passages as depending on BACK, but three of those — `Failure: Trisha's`, `LINE 2`
and `Shana Looks Again` — turned out to be exhaustive `(if:)/(else:)` pairs where
**both** branches carry an exit. The scan cannot tell an exhaustive if/else from
an open-ended chain. So removing BACK stranded nobody, and the street exit is
purely the design change you asked for rather than a soft-lock patch.

### Verified live

- Dean Street: no BACK, and no exit link either, which is right — the hub is not
  a venue.
- `Approach The French`: shows "← Back to Dean Street" and "·". You can still
  decline to go in.
- Inside `The French`: "← Exit to the street" in the header, no BACK.
- **The point of the whole change:** pocketed the brass lighter, left via
  "← Exit to the street", landed on Dean Street, and the lighter was **still in
  the pocket**. Under the old BACK it would have been back on the bar.
- Crawl of 76 steps over 36 passages: zero errors, and the only dead end reached
  was the Dawn, which is the ending and is meant to be one.

### Correction to Sweep 6, and the phone-call question (2026-09-13)

Sam asked whether a soft-lock he hit "on one of the popups when I turned down a
phone call" is fixed. Checking it exposed a **fault in my Sweep 6 method**, which
is worth recording so it is not trusted blindly.

**The fault:** Sweep 6 decided a passage was safe if it was not in `_hideStats`,
on the grounds that it would then show "← BACK". That is wrong. The header also
wraps BACK in `(unless: _backHide contains (passage:)'s name)`, and `_backHide`
holds 21 names. Any passage in `_backHide` never showed BACK at all, so Sweep 6
marked several as "safe (BACK in header)" that had no such protection —
`Lily phone call 1` and `The dual ring` among them. Any future soft-lock audit
must check **both** lists.

**The phone-decline lock is fixed.** There are six places the Lily phone can ring
— `Coach and Horses bar`, `Entering The Pillars of Hercules` (twice),
`Ronnie Scott's`, `The Colony Room` and `The French`. Declining runs
`(replace: ?lilyring)`, drops the second-refusal `glass-pane` with the Fetch
window if `$refusedCalls is 2`, and all six now end with
`[[Back to Dean Street|Dean Street]]`. Confirmed on every one of the six.

The `.glass-pane` itself is not a trap: it is `position: relative`, 500px,
sitting in the normal flow, so it never covers the exit link.

**What remains, and is by design:** accepting a call puts you on a passage with
**no link whatsoever** for a while — `Lily phone call 1` shows "Hang up." only
after 15s and auto-exits at 28s; `The dual ring` shows it at 28s and auto-exits
at 40s. Neither has a header. So for those seconds there is genuinely nothing to
click, which reads exactly like being stuck.

I tested the worst case, since `(after:)` is the macro we know can stall in a
hidden tab: loaded `Lily phone call 1`, confirmed zero links, backgrounded the
tab for 40 seconds, came back. **It had escaped on its own.** So the auto-exit
holds and this is not a lock. It is a long silent wait by design, not a bug, and
I have changed nothing.

Also worth noting: both phone passages are in `_backHide`, so they never had a
BACK link. Removing BACK in Addendum 47 did not make any of this worse.

### Phone-call hold times shortened (2026-09-13)

Both calls hold you with no link on screen until a timer reveals "Hang up.".
Sam judged the waits too long. Changed at his instruction:

| passage | "Hang up." appears | automatic exit |
| --- | --- | --- |
| `Lily phone call 1` | 15s → **8s** | 28s, unchanged |
| `The dual ring` | 28s → **15s** | 40s, unchanged |

Only the reveal timers moved. The automatic exits are untouched, so the safety
net that gets a player off the call is exactly as it was, and the window in which
you can choose to hang up is now wider in both cases — 20s on Lily's call, 25s on
the dual ring. On the dual ring, hanging up is still what sets
`$crashedAfterDualRing` and drops sobriety to 8 and confidence to 18, so the
consequence of the beat is unchanged; it just arrives sooner.

Verified live on both: the link appears at the new time and no `tw-error`s.

### Addendum 48 — the alba can no longer be collected out of order (2026-09-13)

**The complaint:** you could be handed the final line of the poem before the
second, and the scene announced it as the last line, which made no sense.

**The cause was one missing check.** `LINE 3` has exactly one way in — the cow
ride, from both of its outcomes ("Listen" if you stay on, "Look up." if you are
thrown) — and neither asked whether you held line 2 yet. Meanwhile line 2 has six
sources (the Green Sea, plus all five dream-world centres). The two were entirely
unsynchronised.

Two things were already right and did not need touching: the poem never
*displays* out of order (the notebook and the Dawn both render `$alba1/2/3` in
poem order, each simply checking whether you hold it), and `LINE 3` only declares
"THE ALBA IS COMPLETE" when you genuinely hold lines 1 and 2.

**The fix, in one line.** The cow question and the ride link are now gated:

```
(if: ($alba contains $alba1) and ($alba contains $alba2) and ($cowRideDone is false))[What will you do with his cow?
...
[[Ride the beast|Ride Jeffrey Bernard's cow]]]]
```

So the cow is only offered when line 3 can actually *be* the last line, and only
once. No prose was written or changed: an early visit simply ends at "he's
disappeared to a timeshare on the seacoast of Bohemia", and the cow is not
mentioned again until you are ready for it.

**Two wrong turns on the way, recorded so they are not repeated.**

1. I first proposed gating the whole Coach with a `$coachUrgent` override for the
   crisis. Sam spotted that the override reopens the hole — enter the Coach on the
   crisis with one line and you can ride the cow, which is the original bug. A
   gate with an override is not a gate.
2. I then believed the cow was a one-shot beat and that gating it risked losing
   line 3 forever. That was wrong. Checking hook depths: the
   `(if: not ($haunts contains $haunt3))` gate wraps **only** the HAUNT COLLECTED
   box. The cow question and the ride link sit outside it, in the branch that
   runs whenever you are at the Coach and no phone rings, so the offer **recurs
   on every visit**. That is what makes gating the link safe and the venue gate
   unnecessary.

**Verified live, with a temporary probe that has since been removed.** Two real
states observed at the Coach:

| state | `contains $alba1` | `contains $alba2` | `$cowRideDone` | gate | result |
| --- | --- | --- | --- | --- | --- |
| line 1 only | true | false | false | false | hidden, waiting for line 2 |
| full alba, already ridden | true | **true** | true | false | hidden by the new re-ride guard |

Every component of the condition is therefore proven to evaluate correctly on
real state, including the `$alba contains $alba2` half, and the conjunction
behaves in both observed cases. The Jeffrey scene, the betting-slip key and the
street exit are all intact, with zero `tw-error`s.

The `$cowRideDone` half also closes a smaller pre-existing quirk: the ride had no
guard, so you could ride twice and append line 3 to `$alba` twice. Harmless,
since the display tests whether you hold a line rather than counting, but it is
tidy now.

---

## Addendum 49 — the explaining popups cut back (2026-09-13)

Sam: "All the popups are too much (the ones that explain the rules of the game).
It needs to be simplified in order to take the new complexity of the whole game",
and on the minigame cards: "you are confronted with a lot of text which sort of
ruins the flow".

A first night could throw **ten** explanatory popups at you, each one stopping
the game until dismissed, on top of the tactile ones.

### Minigame cards: 14 lines of instruction down to 5

All four go through one shared builder, `dssShowMinigameRules`, so only the
`lines:` each game passes needed changing. Emblems, the Art-Nouveau corner
ornament and the Play button are untouched — it was the text that broke the
flow, not the art.

| card | was | now |
| --- | --- | --- |
| PING PONG | 3 lines | "Move the paddle with your mouse or finger. First to five points wins." |
| CECIL COURT WALTZ | 3 lines | "Press ← ↓ → or A S D as each note reaches the line." |
| THE CELLAR | 5 lines | one line for the three moves, one for the keys |
| JEFFREY BERNARD'S COW | 3 lines | "Use ← → or click LEFT, MID and RIGHT to change lane. You have three lives." |

The rule was: keep only what a player cannot work out by looking. Objectives the
game shows you anyway ("Don't let the ball get past you", "Empty his bar for a
knockout") are gone; controls stay.

### Seven nudges: no longer popups at all

The "⟡ A WORD TO THE WISE ⟡" full-screen overlay is gone. The same words now
appear as a quiet gold italic line under the ALBA strip, `.wtw-inline`, in the
same voice as the existing `.liver-hint`. Nothing blocks, so the queueing and
`dssDeferIfBusy` dance those popups needed is gone with them.

This was one function, `wordToTheWisePopup`, so it demoted six nudges at a
stroke: the open-night tip, the ledger tip, the liver tip and the three morale
warnings. Both it and `venueHintPopup` now call a shared `window.dssInlineHint`.

The **venue hint** also carried a five-row legend of the door marks (◆◇ ▲△ ✦✧
★☆ ❀❁). That is **dropped, not moved**, because the notebook's `.nb-key` block
already carries the same ten glyphs, permanently and on demand. The line now
points there instead.

`showWordToTheWise` is defined but never called anywhere — dead code, left alone.

**Verified live:** nudges render as inline lines under the ALBA strip, fading in;
`#wtw-overlay`, `#venue-hint-overlay` and `#word-wise-overlay` are never built;
zero `tw-error`s. The open-night tip was observed firing on its own natural
trigger, not just when called by hand.

**One thing to watch:** if two or more nudges fire on the same render they stack,
and three at once looks tight in the header band. They are one-per-night each so
it should be rare, and stacking is deliberate — replacing would lose a lesson,
since the `$shown*` flags are consumed at render.

### The two rule primers, merged

Sam: "Merge them whole and I'll trim it myself later." So every sentence is kept
verbatim; none of his prose was cut.

There is now one card, `window.dssShowPrimer`, titled **MORALE, SOBRIETY &
HAUNTS** (the old title named only half its contents). It carries the four stats
paragraphs followed by the haunts paragraph and "Collect more haunts to unlock
the map."

It is raised by whichever trigger comes first — the first drink at the French
(`$visited's French is false`) or the first haunt caught (`$haunts's length is
1`) — and guarded by a new `$primerShown` so it can only ever appear once.
`$hauntExplained` and `$statsExplained` are still set exactly as before, which
matters: `$hauntExplained` alone is read in 40 places.

13 call sites were rewired (12 haunt sites, 1 stats site) and
`dssShowHauntsModal` now has no callers at all.

`$primerShown` is declared in **both** StoryInit and the `Start` reset block. Per
Sweep 2, StoryInit does not run again on a new game, so a flag in only one place
would survive into a second playthrough and suppress the primer for ever.

**One thing I dropped, and it is chrome not prose:** the old haunts card had an
"↑ Saved to your notebook" arrow pointing at the haunt you had just caught. In a
merged card that can fire at a drink instead, it would be pointing at nothing, so
it is gone. Say the word if you want it back conditionally.

**Verified in natural play.** Walked a fresh game to The French. The brass-lighter
key popup came up first and the primer correctly **deferred behind it**; the
moment the key was dismissed the primer appeared, one card, right title, both
texts present, zero errors. A haunt was then caught later in the same night and
the primer did **not** reappear.

Worth recording, because it cost me four false negatives: this is very hard to
observe by scripted clicking. The primer fires on a 1200–1600ms timer and has a
navigation-safety observer that tears it down if the passage changes, so any
crawler that clicks faster than that sees nothing and wrongly concludes it is
broken. Test it by stopping still and waiting.

### Addendum 50 — leaving a venue puts you outside its door (2026-09-13)

Sam: "When you leave a venue you should arrive outside the door, not teleport to
dean street."

The header exit added in Addendum 47 went to `Dean Street` for every venue. It
now returns you to that venue's own approach passage, so you step out of the door
you came in by and the street is still where you left it.

| tag | exit lands on |
| --- | --- |
| venue-french | Approach The French |
| venue-colony | Approach The Colony Room |
| venue-ronnies | Approach Ronnie Scott's |
| venue-coach, venue-gents | Approach The Coach |
| venue-trishas | Approach Trisha's |
| venue-lackland, venue-lackland-back | Approach Lacklands Office |
| venue-cecilcourt | Cecil Court Approach |
| venue-pillars | Approach The Pillars |
| venue-cellar | Approach Coppers Lair |

Built as an `(if:)/(else-if:)` chain in the header setting a temp `_exitTo`, then
`(link-goto: "← Exit to the street", _exitTo)`. The link only renders
`(unless: _exitTo is "")`, so non-venue passages show nothing, exactly as before,
and no `is not` comparison appears anywhere in it.

From the approach you are one click from the street ("← Back to Dean Street") or
one click back inside ("·"), so nothing got further away.

**Verified live on six venues** — the French, the Colony, the Coach's gents,
Lackland's back room, the Pillars and the cellar. Every one showed the exit link
and landed on its own approach, none teleported to the hub, zero `tw-error`s.

**Checked for side effects.** The French counts its visits through
`$frenchApproached`, which is set on the approach and consumed on entry, so I
wanted to be sure bouncing in and out did not inflate `_fc` and unlock the bar
drink early. It does not: you always pass through the approach either way, so the
count per re-entry is exactly as before.

One genuine consequence, flagged rather than changed: you can now bounce between
a venue and its door without touching Dean Street, so `$returns` climbs more
slowly than it used to. That only delays the `$returns >= 2` nudges slightly. It
is a pacing effect, not a fault, and it is inherent in what was asked for.

### Addendum 51 — walking the map is no longer "returning to Dean Street" (2026-09-13)

Sam: "'return to dean street' should be when you return to the page, not walk on
the street in the little map."

`$returns` increments on every render of `Dean Street` unless `$alleyReturn` is
set, which is the flag that says "you only stepped onto a map tile". All ten
alleys set it. **The tiles added since did not**, so they were counting as full
returns to the hub:

- `Doorway: Livonia Street`, `Doorway: Diadem Court`, `Doorway: Ham Yard`,
  `Doorway: Romilly Street` (added 2026-09-12)
- `A Doorway on Dean Street` (the teaching doorway)
- `The Phone Box` (added 2026-09-13)

So stopping to piss in a doorway advanced the night exactly as much as coming
back from a venue. All six now set `(set: $alleyReturn to true)`, matching the
alleys. `Soho Square Gents` deliberately does not need it: it is only reachable
through `Alley: Soho Square`, which already sets the flag, and the flag survives
until the next Dean Street render.

**Verified with a temporary probe on the increment itself, since `$nightPhase` is
driven by haunts and alba lines rather than returns and is therefore useless as a
proxy:**

| trip | `$returns` |
| --- | --- |
| two doorway round-trips | 2 → 2 |
| two alley round-trips | 2 → 2 |
| into the French, out of the door, back to the hub | 2 → **3** |

Probe removed; zero `dss-probe` occurrences remain.

This also settles the pacing question left open at the end of Addendum 50:
bouncing between a venue and its own door does not count, and should not. Only
arriving back on the Dean Street page does.

### Addendum 52 — the coin's rim sat askew from its face (2026-09-13)

Sam: "The coin is still misaligned when you collect it. The border is askew from
the face."

**It was not the artwork.** The earlier fix to `coin-heads.svg` (the `<image>`
re-framed to x/y −25, 450×450 in a 400×400 viewBox) is correct and centred. This
was a CSS layout bug in the collect popup only.

**The cause, measured rather than guessed.** `.coin-overlay-disc .cp-face` is
`position: absolute` with `top: 0`, but it was inheriting a default
**`margin-top: 13.44px`**. A margin displaces an absolutely positioned box even
when `top` is set. The milled rim is the disc's own `::before` at `inset: -4px`,
anchored to the disc, so the rim stayed put while both faces dropped 13.44px
inside it. Measured before the fix: disc at y=144.8, face at y=158.3, a 13.5px
drop with no transform on either.

**The fix:** `inset: 0; margin: 0;` on `.cp-face`.

**Verified:** face-to-disc offset is now exactly `{dx: 0, dy: 0}`, on the heads
face, through the flip animation, and on the tails face (which carries
`rotateX(180deg)`). Screenshots before and after confirm the gold rim is now even
the whole way round. Zero `tw-error`s.

**The notebook's coin was never affected** and has not been touched: it is built
from a different set of elements (`.nb-coin-3d`, `.nb-coin-edge`,
`.nb-coin-face`, `.nb-coin-img`), all of which already share a centre.

Worth remembering as a pattern: `position: absolute` does not immunise an element
against an inherited margin. If a thing is offset from a rim, ring or frame that
is drawn as a sibling or pseudo-element, compare their bounding boxes and check
the margin before suspecting the artwork.

### Addendum 53 — the lighter now reads "Property of PDR" (2026-09-13)

Sam: "The lighter you find for the cigs reads JT SQ, engraved on it... that's from
a different project, JT isnt a cowriter on this one. It should read, 'Property of
PDR' (it's an in joke, easter egg)."

The JT/SQ monogram is the **Oliver Twist** game's makers' signature (James Toole
and Sam Quill) and had leaked into this one. It appeared in exactly two places,
both the same lighter SVG: `window.DSS_KEY_ART` for the key popup, and the
notebook inventory art. Nothing else in DSS carried it. Both are changed; zero
occurrences of "JT SQ" remain.

**Set as two engraved lines**, because it will not fit on one. The lighter body's
inner panel spans x 20.5 to 49.5 in a 70x104 viewBox, so 29 units wide. "Property
of PDR" at the old size (6.4 with 1.1 letter-spacing) would need roughly 64. So:

- "Property of" at font-size 4.4, letter-spacing 0.15
- "PDR" at the original 6.4 / 1.1, sitting under it as the punchline

Same colour and family as the old engraving, so it reads as the same tool-stamp.

**Measured, not eyeballed:** "Property of" renders x 23.3 to 46.9 and "PDR" x 26.8
to 43.2, both comfortably inside the 20.5–49.5 panel. No overflow, zero errors.

Two memories updated so this does not get undone or repeated: the JT/SQ note is
now explicitly scoped to Oliver Twist with a warning not to let it into DSS, and
the engraving is recorded as deliberate and never to be "corrected", with the
warning that its SVG exists in two copies.

**Superseded the same day:** the engraving is now **Property of J. St John**, and
the lighter is drawn as a Zippo. See below.

### Addendum 54 — the lighter is now a Zippo, engraved to J. St John (2026-09-13)

Sam: "Can you make it look more like a zippo lighter? And change the engraving to
'Property of J. St John'."

Engraving changed in both copies of the SVG (key popup art and notebook
inventory art). It reads "Property of" on one line and "J. St John" beneath, both
inside the engraved panel (x 21.6 to 48.4); measured at x 23.3–46.9 and
22.1–47.9, so no overflow.

**The drawing was rebuilt.** The old art was a generic brass case with a flint
wheel sitting on top of the lid and a pale wick, which read as a flask more than
a lighter.

**First attempt was wrong and is worth recording.** I drew an *open* Zippo with
the lid flipped back on a `rotate(-128)`, plus a chimney with slots and a flame.
At icon size the rotated lid read as a detached wing rather than a hinged lid. An
open lid needs foreshortening to be legible and there is not enough room for it
here. Reverted to closed.

**What it is now:** a closed Zippo. Case and lid 32 x 50 units in the 70x104
viewBox, which is the real 36x56mm proportion (1.56); lid a shade under a third;
a seam line with a bright lip above it; and a **hinge barrel on the left of the
seam**, which is the single detail that makes it read as a Zippo rather than any
brass case. Brushed-brass gradients kept from the original, plus polish
highlights on lid and case and a base stamp line.

**Checked at all three sizes it actually appears at** — 104px in the notebook,
172px in the popup, and large. The silhouette reads at the smallest; the
engraving is legibly faint at popup size, which is right for an engraving.

Note for anyone previewing an inventory SVG by cloning it into the page: both
copies define the same gradient ids, so a clone shown while the original is still
in the DOM renders with dead fills. Remove or replace the original first. That
cost me one confusing screenshot.

### Addendum 55 — brightness audit of the Soho 3D scenes (2026-09-13)

Sam: "Maybe the 3D scenes are a bit dark (the soho ones; check them)."

Measured rather than eyeballed. Each approach was loaded, given ~5s to render,
and its WebGL canvas sampled for mean luminance (0-255), the share of near-black
pixels and the share of genuinely lit ones.

| scene | mean | % below 20 | % above 60 |
| --- | --- | --- | --- |
| Trisha's | **2.9** | 95.6 | 0.9 |
| The Ginger Light | **5.4** | 96.0 | **0.2** |
| The Pillars | 10.4 | 83.5 | 1.5 |
| The French | 11.2 | 84.3 | 0.2 |
| Ronnie Scott's | 12.5 | 76.5 | 1.9 |
| The Colony Room | 17.5 | 76.9 | 7.2 |
| Chinese Fish and Chips | 22.8 | 64.5 | 8.4 |
| The Coach | 25.1 | 61.0 | 15.0 |
| Lackland's Office | 25.6 | 52.4 | 8.8 |
| O'Flatterly | 35.4 | 64.3 | 20.6 |
| Coppers Lair | 35.8 | 59.8 | 18.9 |

**He is right, and the interesting part is the spread: 12x between the darkest
and the brightest.** The pack sits around 10-25. Two sit far below it.

**1. The Ginger Light has a black right third.** Scanning the frame in ten
vertical bands, left to right: 3.3, 4.2, 5.2, 9.5, 13.1, 8.6, 7.2, **2.0, 1.7,
2.1**. The lamp lights the middle properly, then the right 30% falls off a hard
edge to near-black. That is a region, not a falloff, and it is what drags the
scene to the bottom of the table. Worth looking at as possible geometry rather
than lighting: compare `project_buried_plane_bug` and
`project_backface_hidden_wrong_geometry`.

**2. Trisha's is a composition problem more than a lighting one.** The scene
itself reads — door, number 57, the lamp, the cat on the step — but the camera is
pulled back far enough that ~96% of the frame is empty black around a small lit
doorway.

**Cecil Court is the reference for what right looks like** and was nearly missed:
it is an **iframe** (`cc-approach` holding `cecil-court-3d-static.html`), not an
inline canvas, so the container scan and the luminance sampler both skipped it.
Visually it is the best-lit scene in the game: bookshop windows, a red moon, a
legible street.

**Method note, so nobody trusts a wrong number later:** sampling an iframe's
canvas from the parent document returns all zeros, because the parent's
`requestAnimationFrame` is not synced to the iframe's draw. Cecil Court measured
"mean 0" and is in fact the brightest scene there is. For iframe scenes, judge by
screenshot only.

**Nothing changed yet.** How dark the night should be is Sam's call, and lifting
everything globally would flatten a look that is deliberate. The targeted change
I would recommend is to bring only the two outliers up to sit with the pack, and
to treat the Ginger Light's right third as a separate question.

### Addendum 56 — the two dark outliers lifted; the Ginger Light is NOT a geometry fault

Sam: "Do both, and check the ginger light isn't a geometry fault."

#### The Ginger Light: not geometry, and not lighting either

Exposed the scene temporarily and raycast a grid across the frame from the
camera, per `project_backface_hidden_wrong_geometry` (probe, do not reason from
transforms). Findings, in the order I got them wrong:

1. I first blamed a `sideWall` plane at x=4.01 next to a camera at x=4.00. **That
   was the French House scene, not this one** — the anchor I matched
   (`camera.lookAt(-0.5, 5.2, 0)`) belongs to `fhCanvas`. The Ginger Light is
   `initGingerLight()` at line 16591, camera at (6.5, 2.2, 8).
2. Then a `CylinderGeometry` 3.1 units from the camera on the right looked like
   the culprit. It is a lamp post, but at radius 0.06-0.1 it covers about 5% of
   the frame width, nowhere near the third that was dark.
3. Raycasting *all* hits on both sides showed **identical geometry left and
   right** — the same stack of haze sprites, then geometry at ~7 units. So
   nothing is occluding and nothing is mis-rotated. **Not a geometry fault.**

The real cause: **most of the dark area is not surface at all, it is empty
frame.** `scene.background` and the fog were both `0x08080e`. No light can lift
background, which is why raising the ambient from 0.2 to 0.34 and the
directional from 0.08 to 0.26 moved the mean by about 0.4 — I confirmed those
values were live in the running scene before concluding the edit had failed.

**The lever was the background and fog colour**, raised to `0x15151f`:

| | before | after |
| --- | --- | --- |
| mean luminance | 5.4 | **11.1** |
| % near-black | 96.0 | 84.8 |
| bands, left to right | 3.3 / 4.2 / 9.5 / 2.0 / 2.1 | 7.5 / 13.4 / 20.4 / 11.1 / 3.0 |

That puts it in the pack beside the Pillars (10.4) and the French (11.2). The
brick, the phone box and the pavement all read now, and it still looks like
night. The ambient and directional lifts were kept; they do no harm.

#### Trisha's: lifted, but it is a composition, not a setting

Trisha's is the opposite case — its darkness *is* unlit geometry, not void (the
background colour alone would measure about 17, and the frame measures far
below that). So ambient was the right lever, and it was starting from nothing:
`0x060510` at 0.22, with a "moon" of `0x1a1830` at 0.10, both effectively black.

Raised to `0x171530` at 0.68, moon to `0x2b2850` at 0.24, background and fog to
`0x121019` (and the wrapper div to match, or the edges band).

| | before | after |
| --- | --- | --- |
| mean luminance | 2.9 | **5.6** |
| % near-black | 95.6 | 93.4 |

**Honest result: it has nearly doubled but it is still the darkest scene in the
game.** The last big ambient jump (0.42 to 0.68) bought only 0.4, so the lever is
exhausted. The reason is compositional: it is a tight shot of one doorway lit by
one lantern, with a lot of unlit brick and empty pavement around it. Getting it
to 10+ means re-lighting or pulling the camera in, which is a bigger aesthetic
decision than was asked for. The brick texture, the number 57 and the cat on the
step all read now, where before they barely did.

Temporary scene probe removed; zero occurrences remain.

### Addendum 57 — Trisha's camera pulled in (2026-09-13)

Sam: "Pull the camera in on Trisha's."

`camera.position.set(-0.6, 2.6, 7.4)` to `(-0.45, 2.6, 5.2)`. The lookAt is
unchanged at (0, 2.55, 0), which was deliberately set to a near-level gaze to
keep the verticals straight, so moving only the distance preserves that.

This did what the lighting could not. The scene's problem was never really
brightness, it was that a third of the frame was unlit brick and empty pavement
around a small lit doorway. Filling the frame with the lit part fixes the measure
and the composition at once:

| Trisha's | mean | % near-black | % lit |
| --- | --- | --- | --- |
| original | 2.9 | 95.6 | 0.9 |
| after the light lift | 5.6 | 93.4 | 1.3 |
| **after pulling the camera in** | **9.6** | **84.9** | **4.0** |

Lit pixels are up more than four times on the original, and it now sits at the
bottom edge of the pack rather than far below it (the Pillars 10.4, the French
11.2). It is still the darkest Soho approach, which seems right for a basement
door on Greek Street.

**Checked for clipping, since pulling in can push things out of frame:** all
three links are on screen and in the viewport (← Back to Dean Street, the "·"
entry at y=299, NOTEBOOK), the TRISHA'S entry button sits over the doorstep, and
the "GREEK STREET, SOHO" caption ends at y=819 in an 837 viewport. The brick, the
number 57, the lamp, the awning and the cat all read.

### Addendum 58 — the French and the Pillars given the same treatment (2026-09-13)

Sam: "Now do the same for the Pillars and the French."

Both had the same three faults as the other two: a near-black `scene.background`
and matching fog that no light can lift, a token ambient, and a camera parked
well back at z=16.

| | background + fog | ambient | camera |
| --- | --- | --- | --- |
| The French | `0x050508` to `0x121218` | `0x121225` @0.18 to `0x1a1a30` @0.34 | z 16 to 11.5, x 4.0 to 3.0 |
| The Pillars | `0x0a0a12` to `0x16161f` | `0x1a1a2a` @0.2 to `0x22223a` @0.34, hemisphere 0.08 to 0.16 | z 16 to 11.5, x 0 to 2.1 |

| scene | mean | % near-black | % lit |
| --- | --- | --- | --- |
| The French, before | 11.2 | 84.3 | 0.2 |
| **The French, after** | **19.3** | **64.5** | **5.4** |
| The Pillars, before | 10.4 | 83.5 | 1.5 |
| **The Pillars, after** | **19.3** | **65.4** | **5.7** |

Both now sit mid-pack, above the Colony (17.5) and near the Chippy (22.8). The
French House sign, the tricolour bunting, RICARD and the PARIS shop next door all
read; so do the Pillars' timber framing, window boxes and the No7 sign.

**Pulling in caused one regression, which is worth recording as a rule.** At
z=11.5 with the camera dead centre at x=0, a foreground post ran straight down
the middle of the Pillars and cut the "PILLARS OF HERCULES" sign in half. It was
harmless at z=16 and only became obtrusive once the camera moved closer.
Offsetting the camera sideways to x=2.1 put it out of frame and improved the
composition as well, since the two lamp posts now frame the shot.

**So: when pulling a camera in, re-check for foreground geometry.** What reads as
depth at distance becomes an obstruction up close.

**Two checks worth noting.** `0x050508` is used by **two** scenes, the French and
the Coach and Horses, so a global string replace would have silently re-lit the
Coach as well. All nine edits were made by line number instead, and the Coach's
background and fog are confirmed unchanged at `0x050508`.

And the Pillars' "GO TO THE PILLARS" button looked to have vanished after the
camera move. It had not: it was on screen at y=729 the whole time and simply too
small to read in a 0.75-scale screenshot. Check the DOM rect before believing a
scaled screenshot about small UI.

### Independent Codex mechanics audit — 2026-09-13

Sam requested an independent check of Opus's work and the whole game's mechanics/structure. See `MECHANICS-AUDIT-2026-09-13.md` for nine actionable findings, reproductions, source anchors and proposed fixes. Game source and compiled output are unchanged; no git commands run.

Priority: missing Coach return after the new cow ordering gate; Pillars closing with line two despite unfinished dream business; new street exits abandoning Shana/Ronnie/Davy/painter encounter rewards; complete-alba crisis hiding its own Coach recovery route; Dawn Play again clearing permanent gifts. Further: closed venues blocking outside stashes, pong notebook rematch blocked, dream recognition scenes lacking return paths, Colony agent wrongly tagged French.

Evidence: 229 source headers and 292 literal links checked (no missing targets), 113 executable JS blocks parse, 29 build assets present, 17 isolated seeded browser scenarios plus an actual replay-storage test. Details and limitations in the report; reproducible harnesses/results under `scratchpad/mechanics-audit-2026-09-13/`. No claim of a complete minigame/visual/audio playtest. These are findings for a fixing pass, not changes already shipped.

### Addendum 59 — the remaining Soho scenes (2026-09-13)

Sam: "Do the rest of them too."

Judged per scene rather than blanket-applied, because after the earlier work the
pack sits around 19-26 and pushing an already-bright scene would flatten it.
"At standard, leave alone" was a valid answer for four of the seven.

**Changed:**

| scene | what it needed | before | after |
| --- | --- | --- | --- |
| Ronnie Scott's | bg/fog `0x0a0a12` to `0x16161f`; **no ambient existed**, added `0x1c1c30` @0.34 | 12.5 | 15.5 |
| The Colony Room | bg/fog `0x08060a` to `0x131018`; ambient `0x080815` @0.18 to `0x15152a` @0.32 | 17.5 | 19.7 |
| Chinese Fish and Chips | bg/fog `0x080810` to `0x101019`; **no ambient existed**, added `0x18182a` @0.26; camera z 14 to 10.5 | 22.8 | **29.1** |

Two of these scenes had **no AmbientLight at all**, only point lights, which is
exactly why anything beyond a lamp's reach fell to pure black. That is now three
scenes found with the same omission (Ronnie's, the Chippy, and earlier the French
and Pillars had only token ambients).

**Left alone, and confirmed unchanged within measurement noise**, which also
proves the line-scoped edits did not leak into neighbours:

| scene | before | after |
| --- | --- | --- |
| The Coach | 25.1 | 25.7 |
| Lackland's Office | 25.6 | 26.1 |
| O'Flatterly | 35.4 | 35.0 |
| Coppers Lair | 35.8 | 35.6 |

The Coach and Coppers Lair both carry comments from earlier deliberate tuning
("was 0.20 — the corner was reading as void"), so they had already had this
treatment. Cecil Court is the iframe scene and is the brightest in the game.

**Ronnie's was left at 15.5 on purpose.** It is the lowest of the changed set but
its light is *even*: left half 12.1, right half 15.1, sky 11.8, pavement 12.4,
shopfront 15.0. No dead regions. That is a different condition from the scenes
that were 96% black around one lit spot, and the neon, the COSMOGRAMM sign and
the pavement all read. Brightening further would mostly brighten the night sky.

**The whole Soho set, before and after:**

| scene | was | now |
| --- | --- | --- |
| Trisha's | 2.9 | 9.6 |
| The Ginger Light | 5.4 | 11.1 |
| The Pillars | 10.4 | 19.3 |
| The French | 11.2 | 19.3 |
| Ronnie Scott's | 12.5 | 15.5 |
| The Colony Room | 17.5 | 19.7 |
| Chinese Fish and Chips | 22.8 | 29.1 |
| The Coach | 25.1 | 25.7 |
| Lackland's Office | 25.6 | 26.1 |
| O'Flatterly | 35.4 | 35.0 |
| Coppers Lair | 35.8 | 35.6 |

The spread was 12x from darkest to brightest; it is now 3.7x, and the bottom of
the range has moved from 2.9 to 9.6. Nothing at the bright end was touched.

**Entry buttons checked on every changed scene** after the camera moves, since
pulling in can push UI out of frame. All present: ENTER THE CHIPPY at y=736, GO
TO THE PILLARS at y=729, and the rest. Twice I thought a button had vanished and
twice it was on screen and simply too small to read in a scaled screenshot —
check the DOM rect, not the picture.

---

## Addendum 60 — acting on the independent Codex audit (2026-09-13)

Sam had Codex audit the build after my work. Nine mechanics findings, several of
them caused by my own recent changes. Each was **verified against the source
before touching anything** rather than taken on trust.

### Fixed and verified (6 of 9)

**#9 — the Colony agent exited to the French. Mine.** `Talk to the intimidating
agent` is reached from `Colony drink` and `The Colony Room`, but was tagged
`venue-french`. My venue-tag exit rule therefore put the player outside the wrong
pub. Worse than the exit: that tag also drives the **French's pub ambience, door
sound and CSS**, so you heard the wrong pub while standing in the Colony.
Retagged `venue-colony`. Verified: the exit now lands on `cr-container`, the
Colony's approach.

**#5 — Play again destroyed permanent things.** The Dawn's "Play again" button
called `localStorage.clear()`, which wipes `dss_napkin` (the player's own napkin
drawing) and `dssMuted2` (the mute preference), not just the save. The correct
targeted pattern already existed in the debug wipe at line 5307. Replaced.
Verified by seeding all three keys and running the handler body: save removed,
napkin and mute survive. Written without any `<` character so nothing depends on
entity decoding inside an inline handler.

**#1 and #4 — the Coach. Partly mine.** Both Coach links on Dean Street require
the `$coachUrgent` collapse; there is no ordinary route to the Coach at all. That
was survivable until I gated the cow on holding lines one and two, which made
**the last line of the poem depend on drinking yourself into a crisis**. And #4
on top: line 103 was `$coachUrgent is true and _towerReady is false`, so a
completed poem plus a collapse removed even the crisis route, since the only
other Coach link needs `$metRed is false`, long past by then.
- #4: dropped `and _towerReady is false`, so the recovery route survives a
  finished poem.
- #1: added a Coach link that opens exactly while the cow can be ridden
  (`$coachUrgent is false and both lines held and $cowRideDone is false`) and
  closes once it has been.

Verified with a temporary probe: `urgent:false | a1:true | a2:true | ridden:true
| whole:false` — three terms true, the only blocker the intended one. Probe removed.

**#2 — line two could close the Pillars.** The post-critic branch was gated
`not ($alba contains $alba2)`, so picking up line two shut the Pillars even with
unvisited dream worlds and a key in pocket. Now also stays open while
`$inisToldOfPillars is true and $worldsVisited's length < 5`. The `not()` is
placed **last** in the or-chain, per the parsing rule that bit us before.

**#6 — stashed keys stranded when a venue closes. Mine.** The ten alleys already
keep themselves reachable while holding a key; the five bins did not, so a key
left in a bin outside a venue that later closed was unreachable. Added the same
escape for all five, labelled to match the map's door regexes so the right door
lights.

**#7 — losing at pong closed the rematch.** On defeat `$notebookStake` is
consumed while `$notebook` stays `"stolen"`, and `Watch the decider` re-offers
the stake — but only if Lackland's is still reachable, and its hub link closes on
`$haunts contains $haunt5`. Lackland's now stays open while the notebook is
stolen. (The notebook was never unrecoverable: Charing Cross Road reopens for it.
This restores the *pong* route.)

**Also hardened while in there:** Dean Street reads `$stashSites` and
`$worldsVisited` in its dock guards without the defensive `is an array` checks it
uses for `$alba` and `$alleys`. Under a debug jump that produced eight
"The number 0 cannot contain any values" errors. Both now self-heal alongside the
others. Not reachable in normal play, but free to fix.

### Not yet done (3 of 9)

- **#3** — the street exits can abandon unfinished rewards from Shana, Ronnie's,
  Davy and the painter.
- **#8** — several dream recognition scenes lack a route back to the character
  after the gift.

**#3 is now done** — Sam ruled: suppress the exit while a reward is pending. See
below. **#8 is still open** and wants the same ruling applied to the dream
recognition scenes, which I have not touched.

### Regression check

Clean opening walk plus a 54-step crawl over 25 distinct passages: **zero
`tw-error`s**, no spurious bin links before anything is stashed, hub links
correct.

### Addendum 61 — #3: the street exit is suppressed while a reward is pending

Sam's ruling: "Suppress the exit while a reward is pending."

Four passages hold a reward one click ahead, and the header exit let the player
walk out past it. All four are now in `_backHide`, which is the mechanism that
already suppresses the header link:

| passage | reward one click ahead | forward route it keeps |
| --- | --- | --- |
| The Painter's Gaze | the napkin sketch, and the painting | "Sketch him on a napkin" |
| The Set | `$completedSetlist`, via After the music | "Back to Dean Street" |
| Shana Reads | the Hanged Man reading | two choices |
| Davy Merkin | `$knowsLackland`, `$knowsCopperSecret` | "Listen" |

**Verified on all four:** the street exit is gone, the forward route remains,
zero errors. Suppression cannot strand anyone because each keeps its own link.

**`Sketch the Painter` was deliberately left alone**, and this is the judgement
worth recording. Leaving it mid-sketch does abandon the painting, so by the rule
it should be suppressed. But its only link is a hidden `nav` fired by the **Done
button, which starts `disabled` and only enables once you have drawn something**.
Suppressing the exit there would strand any player who opens the napkin and
draws nothing. Between abandoning a reward and being unable to leave at all, the
second is worse, so the exit stays. Say if you would rather it were suppressed
and the Done button always enabled instead.

### A crawler artefact worth not chasing twice

The regression crawl reported *"I can't find a save slot named 'auto'"* at the
Title. That is **not player-reachable**: the CONTINUE link lives inside
`<div id="dss-continue-wrap" style="display:none">` and is only revealed when a
save exists. Confirmed on a fresh install: wrap is `display:none`, the link has
no layout box, a player cannot click it, and the Title renders with zero errors.

The crawler hit it because, as established earlier today, **Harlowe honours
programmatic clicks on `display:none` links** — which is exactly why that rule
matters. Any future crawler should filter to links with a layout box, or it will
keep finding this ghost.

### Addendum 62 — #8: the recognition scenes no longer teleport you to the hub

Sam: "Yes, do the same for #8."

It turned out to be the same fault as Addendum 50, in a different place. All five
dream recognition scenes ended by dumping the player on **Dean Street**, so the
gift was collected and the character was gone, with no way back into the room.

One of them was outright lying: `Inis Recognises the Proportion` offered
**"Back into Cecil Court"** and sent you to the hub.

Each is now pointed at what its own label already promises, so **none of Sam's
link prose had to change**:

| scene | its label | now lands on |
| --- | --- | --- |
| Benito Recognises the Wheel | "Leave him to the light" | The French |
| Inis Recognises the Proportion | "Back into Cecil Court" | Cecil Court |
| Lackland Recognises the Tracing | "Leave the office" | Approach Lacklands Office |
| The Critic Hears the Mantra | "Leave him to his papers" | Entering The Pillars of Hercules |
| Red Recognises the Name | "Walk on" | Dean Street, unchanged |

Two judgements in that table worth naming. **Lackland goes to the approach, not
the office**, because the label says "leave the office" and putting the player
back inside it would contradict the words. **Red is left alone**: he is an
outdoor encounter on the corner, so walking on to the street is already right.

**Verified by walking all five**: each lands where the table says (confirmed by
passage text, and by `lo-container` for Lackland's approach), none lands on the
hub except Red, zero `tw-error`s. Link-target sweep over the whole file confirms
no broken literal targets.

### Status of the Codex audit: all nine addressed

| # | finding | outcome |
| --- | --- | --- |
| 1 | no normal route back to the Coach | fixed — Coach opens while the cow is rideable |
| 2 | line two closed the Pillars | fixed — stays open while worlds remain |
| 3 | street exits abandoned pending rewards | fixed — exit suppressed on four mid-beat passages |
| 4 | complete poem hid the Coach recovery | fixed — `_towerReady` no longer suppresses it |
| 5 | Play again wiped permanent gifts | fixed — targeted save wipe only |
| 6 | stored keys unreachable when a venue closed | fixed — bins get the alleys' escape |
| 7 | losing at pong closed the rematch | fixed — Lackland's stays open while the notebook is stolen |
| 8 | recognition scenes had no route back | fixed — each returns where its label says |
| 9 | Colony agent tagged as the French | fixed — retagged, which also corrects his pub ambience |

Three of the nine were mine (3, 6, 9) and two more (1, 4) were latent faults that
my cow gate turned into real ones. One deliberate exception stands:
`Sketch the Painter` keeps its street exit, because its Done button starts
disabled and suppressing the exit would strand a player who draws nothing.

### Addendum 63 — you could not start a new game once a save existed (2026-09-13)

Sam, on opening the playtest build: "It says 'continue where I left off', even
after a hard refresh."

**The Continue gate itself was telling the truth.** It requires a localStorage
key containing "Saved Game", "auto" and the IFID, with real content, so it only
appears when a genuine auto-save exists. A hard refresh does not clear
localStorage, so a save from an earlier play survives it. That part is correct.

**The bug was the line after it:** on finding a save it also ran
`beginw.style.display = 'none'`. So a returning player was shown **only**
"CONTINUE WHERE I LEFT OFF" and had no way to start a new night at all.

That is worse than an inconvenience. **Loading a save skips `Start`**, and `Start`
is where all 37 new-game resets live (Addendum 46). So a player with an old save
was forced into continuing pre-fix state, with no route to a clean game — which
is exactly the position Sam was in opening tonight's build.

**Fix:** BEGIN is never hidden. Continue is still revealed prominently when a
save exists; both are offered.

**Verified in both states:**

| state | BEGIN | CONTINUE |
| --- | --- | --- |
| fresh browser, no save | visible | hidden |
| save present | **visible** | visible |

Zero errors in both. Reproduced the returning-player case by seeding a
correctly-shaped save key rather than waiting for one to accrue.

### Addendum 64 — "The Walk In" deleted (2026-09-13)

Sam: "this recently inserted screen before the typewriter and after begin is
rubbish and redundant. I made a bad call with that. Can you delete it please?"

Removed the passage `The Walk In` — the short interstitial with the star row,
"DEAN STREET · 23 NOVEMBER 1973", and "The city has left a light on for you.
Somewhere ahead, a morning song is waiting to be found."

It sat between `Start` and the typewriter page `The Night Ahead`, and had exactly
one inbound, `Start`'s own `(go-to:)`, so nothing else pointed at it.

Done in four parts:
1. The passage block deleted (229 passages to 228).
2. `Start` now goes straight to `The Night Ahead`.
3. `"The Walk In"` removed from `_hideStats`.
4. Its 22 lines of dead CSS removed (`.opening-walk*`, `.opening-star`,
   `.opening-lamp*`, `.opening-road*`, and the `openingTwinkle` / `openingLamp`
   keyframes). Zero references to any of it remain, and the stylesheet's braces
   still balance at 2249 each.

**The opening is now: BEGIN → The Night Ahead (the typewriter) → Dean Street.**
Verified end to end, zero errors, no broken link targets anywhere in the file.

**A note to stop making the same mistake.** On first check this looked broken:
the passage reported `innerText` of `"\"` with no links, and stayed that way for
eight seconds. It was fine. `The Night Ahead` is a `.typewriter-page` that
reveals its text progressively, and `innerText` does not report text that has not
been revealed yet. Reading the DOM instead showed `DIV.typewriter-page` present
and the prose already in it; the link appeared 1.5s later.

That is the **third** time today a timed reveal has been mistaken for breakage
(the Fetch, the merged primer, and now this). The rule: before concluding a
passage is broken, check `innerHTML` and the child elements, not `innerText`, and
wait at least two seconds.

### Addendum 65 — matches moved to the Pillars; the lighter now lights a cigarette (2026-09-13)

Sam: "You collect the lighter and then immediately after the matches, in the
french. They have different functions but close together they seem weird. Can we
make it so you find the matches in the Pillars and while you have the lighter you
can use it to light a cig if you have cigs" — and, clarifying, **not** when you
do not have it.

**1. The matches moved.** The find is a Dean Street overlay gated on having
visited a venue, so only the gate changed: `$visited's French` to
`$visited's Pillars`. The lighter is still found in the French, so the two are
now a venue apart instead of back to back.

No prose was touched. The popup already reads "On the way out you swipe a box of
matches from a newly-empty table", which is true of any pub.

Note `$visited's Pillars` is set inside `Entering The Pillars of Hercules`, the
interior — not the interlude or the approach. So the matches arrive on the first
return to Dean Street after actually going in, which is the same rhythm the
French had.

**2. The lighter lights a cigarette while you hold it.** The notebook's cigarette
branch now tests `$keyLighter is "held"` **first**:

| lighter | matches | what the notebook offers |
| --- | --- | --- |
| not held | none | "You need to find matches." |
| **held** | none | **"Smoke one"** |
| held | some | "Smoke one" — and it spends **no match** |
| stashed, spent, traded or stolen | none | back to "You need to find matches." |

Checking the lighter first means it is preferred while you have it, so it saves
your matches, and because it tests `is "held"` specifically it stops working the
instant the lighter leaves your pocket by any route — put in a bin, swapped for
another key, spent on a crossing, or taken in Bourchier Street. That is the part
Sam corrected me on and it is the part the state machine already made easy.

**Verified live, all four states**, by actually pocketing the lighter at the
French, then stashing it in the bin outside and re-reading the notebook. Also
verified the move end to end in a natural playthrough: after visiting the French
no match overlay appears; after coming out of the Pillars it does. Zero errors.

### Addendum 66 — the green fairy's lamp restored at the French (2026-09-13)

Sam: "When you approach the pillars now, the beautiful streetlamp with the
absinthe fairy flying around it has disappeared. I think this is maybe because it
zoomed in past that. Could you restore it?"

**He was right about the cause and it was the French, not the Pillars.** The
green fairy lives only in `initFrenchHouse`: a sprite orbiting (3, 4.5, 12), with
its own emerald PointLight. In Addendum 58 I pulled the French camera from
z=16 in to z=11.5 — **putting the lamp at z=12 behind the lens**. Exactly the
mistake I warned about in that same addendum after the Pillars post, and then
made again one scene over.

Camera restored to its original `(4.0, 4.2, 16)`. The lighting changes are kept:
they came from the background, fog and ambient, not the camera.

**Verified the fairy is actually back**, not just the lamp: exposed the scene and
read the sprite directly — position (3.14, 4.63, 12.09), `visible: true`,
opacity 0.77, projecting to NDC (0.05, 0.03), which is dead centre of frame.
Probe removed afterwards.

**A measurement trap worth recording.** My first two pixel sweeps reported zero
green and I nearly concluded she was gone. Both detectors were wrong. She is a
*pale* luminous green — body `rgba(230,255,235)`, halo `rgba(190,255,210)` — and
she flies in front of a bright warm lantern, so the blend leaves red at or above
green. Do not look for saturated green; read the scene graph instead.

**Brightness after the trade:**

| French | mean |
| --- | --- |
| original | 11.2 |
| with the pulled-in camera | 19.3 |
| camera restored | 15.3 |
| ambient nudged 0.34 → 0.46 to compensate | **15.8** |

So the shot Sam likes is back and the scene is still half again brighter than it
was. The remaining gap to 19.3 was the closer framing, which is not worth the
lamp.

**Standing lesson, now twice proven in one session:** pulling a camera in cuts
things out of the *back* of a scene as well as crowding the front. Check what
sits between the old and new camera positions before moving one.

---

## Addendum 67 — street labels, the spawn tile, and a false alarm about the opening (2026-09-13)

**1. "Back to Dean Street" inside venues → "Back to the street".**
Seventeen links reading exactly `[[Back to Dean Street|Dean Street]]` sat inside
venue-tagged passages, where the player is indoors and the exit puts him back
outside the door, not on the hub. Each was repointed to that venue's own approach
passage and relabelled:

- Approach The Colony Room ×4
- Approach The French ×3
- Approach The Pillars ×3
- Approach Lacklands Office ×2
- Approach Ronnie Scott's ×2
- Approach Trisha's ×2
- Approach The Coach ×1

Deliberately **not** touched: alleys, doorways and the approach passages
themselves, which genuinely do return to the hub and should keep saying Dean
Street; and the distinctive prose exits ("Not tonight. Back to Dean Street.",
"Try Dean Street again", "I'll look for it", "Leave the French", "Not tonight.")
which are his lines, not UI chrome. Verified: no broken targets, alleys unchanged.

**2. The opening spawn moved one block north.**
`var spawnC = 17, spawnR = 22` → `spawnR = 14` (twee ~line 4737). Dean Street is
columns 17–18; the block boundary going north is the Bateman Street crossing at
rows 15–16, so r14 is the first tile of the next block up. There is already a
streetlamp at c16,r14, so he arrives under a light, still facing south with the
venue block laid out below him. Verified live: `dssSohoMap.state` reads
`{c:17, r:14, facing:"down"}` on a fresh session.

**3. False alarm — the opening was never broken.**
Earlier in the session BEGIN appeared to stall on `Start`, rendering
`<tw-open-button goto="" label="GO">` and never reaching `The Night Ahead`. Two
things were true and both were misread:

- `tw-open-button[goto]` is **Harlowe's own hidden debug affordance** for a
  `(go-to:)` (`tw-open-button[goto]{display:none}` in the engine CSS; it only
  becomes visible under `.debug-mode`). Its presence is normal, not a symptom.
- The real cause was `document.hidden === true` — the Browser pane tab was
  backgrounded, which stalls rAF, which stalls the passage transition, which
  leaves the `(go-to:)` waiting. Measured: **10+ seconds** before it fired.
  With the pane fronted and a frame forced, BEGIN → The Night Ahead is instant.

The two literal backslashes at the end of `(set: $liverReturnTo to "Dean Street")\\`
are pre-existing in every backup and harmless (they print one stray `\` that is
invisible against the page). Left alone.

**Lesson, now the fourth time this trap has been sprung this session:** before
diagnosing a Harlowe timing or reveal bug from the pane, check `document.hidden`.
A hidden tab breaks transitions, `(after:)`, and anything rAF-driven, and it looks
exactly like broken game logic. See `project_preview_tab_backgrounded`.

**4. Re-verified while in there:** with `localStorage` cleared,
`#dss-continue-wrap` computes to `display:none` on the Title — the
"CONTINUE WHERE I LEFT OFF" gate from Addendum 62 still holds.

---

## Addendum 68 — four notes from the playthrough (2026-09-13)

**1. Prose below the links.**
Audited every passage for prose that renders *alongside* the links but *after*
them (a scanner that ignores prose parked inside deferred `(link:)`/`(click:)`
hooks, and prose inside `.dss-key-offer`, which is off-screen by CSS and read
into the WITHIN REACH popup). Almost everything flagged was a false positive.
Two were real, and both were v2 material appended at the bottom of a venue:

- **The French** — the orange-paperback paragraph (the India-world remnant) sat
  under the whole venue link block. Moved above it.
- **Entering The Pillars of Hercules** — the entire third-pillar block (the
  column prose, "Step through the third pillar", and the lifetime-gift synthesis
  link) sat below "Get a drink", "I can walk on water" and "Back to the street".
  Moved to just after the Hobson verse, which puts it above the links in *every*
  branch of that passage without duplicating it into each one. The trailing
  `</div>` was deliberately left where it was so the div balance is unchanged.

New `.prose-tilde` class marks the seam: a centred `~`, sandstone, letter-spaced,
0.7 opacity. In the Pillars it is wrapped in `(if: $inisToldOfPillars is true)`
so it never appears over an empty block, and the synthesis div carries its own
(that block can show with `$inisToldOfPillars` false, on lifetime gifts alone).

**2. The coin now tosses once on pickup.**
`maxToss` 2 → 1 and `sequence` `[false,true]` → `[false]`. The "Toss again"
branch is gone; after the single toss, "Pocket it" is revealed as the primary
button and the overlay waits for it (the old 1800ms auto-fade is gone too, so
the player is never rushed). Verified live: one toss, result "Tails.", the toss
button stays hidden, "Pocket it" comes up primary. The notebook's own coin is a
different engine (`window.flipCoinPopup` → `showCoinModal`, `maxToss: 1`) and was
not touched, so tossing again there still works.

**3. Soho Square is lit on the map.**
`hidden:true` dropped from the `square` door, so it takes the same faint warm
pool as Meard Street and the other alley mouths. That is the map-level signpost
for the gents (Soho Square → "Down to the gents" → whack-a-worm). Verified by
sampling the map canvas: the door tile reads 45.6/44.4/31.6 against 20.8/27.9/21.4
for the garden beside it — warm and about twice as bright.

**Gotcha for next time:** the glow layer is a canvas built ONCE per render by
`buildGlow()`. Toggling `d.hidden` at runtime changes nothing, so an A/B test
that flips the flag live will always read "no difference". Compare against a
neighbouring tile instead, or rebuild.

**4. "After midnight" from the off — a real bug.**
`Night Progress` advanced to phase 1 on `$nightAlbaCount >= 1`. Alba 1 comes from
LINE 1, which is reached straight off the first Dean Street visit (Red is on the
corner with no gate but `$metRed is false`), so the header flipped to "After
midnight" within a couple of clicks — and `$afterMidnight` latches, which also
turned the date over to 24.11.73. The haunt thresholds were not the problem and
no haunt is double-counted (all 13 addition sites are guarded by
`(if: not ($haunts contains …))`).

Shifted the alba ladder up one rung, leaving the haunt counts alone:

- phase 1 "After midnight": `$haunts's length >= 4 or $nightAlbaCount >= 2`
- phase 2 "Small hours":    `$haunts's length >= 8 or $nightAlbaCount >= 3`
- phase 3 "Dawn awaits":    `$nightAlbaCount >= 3` (unchanged)

Verified live: alba 1 collected, header reads ALBA 1/3 and **Before midnight**.
The Coach gents scene still sets `$afterMidnight` directly, which is the intended
story beat where midnight actually passes.

---

## Addendum 69 — nine notes from the playthrough (2026-09-13)

**1. A haunt now arrives with a flare.** New `hauntBloom` keyframes: the box
blooms gold (30px core, 74px halo) within 0.3s of landing and settles back to
its resting shadow over 2.4s. The reveal JS adds `.haunt-bloom` at the moment it
fades the box back in, and strips the class at 2.6s; the final keyframe matches
`.haunt-box`'s own `box-shadow`, so the handover is invisible. Honours
`prefers-reduced-motion`. Only haunts bloom — items, pages and revelations still
just fade, as before.

**2. Gathered lilies appear on the notebook map.** Each lily now marks the venue
it came from, reusing the `_bell` glyph the pentangle already uses, at
`scale(0.58)` and lifted clear of the node: Chippy (100,250), Pillars (486,228),
Ronnie Scott's (340,450), Colony (232,420), the French (230,470). At five lilies
the Chippy and the French marks stand down, because the pentangle blooms its own
bells at those two points and they would otherwise double up.

**3. `NOTEBOOK))))))))))))` — found and fixed.** Twelve lines in the CHANT block
of `Build Notebook` read
`(set: _nb to _nb + (cond: …, '…', '…')))` — one `)` too many each. Harlowe
printed the twelve orphans as text, and because the header link is
`(link-repeat:)`, every notebook opening appended another twelve. Reproduced
(12, then 24, then 36…), removed the surplus paren from all twelve lines, and
confirmed the label stays clean across repeated opens.

**4. Carthage is now a second-visit offer.** The whole
`'I can walk on water'` block is wrapped in `(if: $pillarsVisits >= 2)`.
`$pillarsVisits` only increments on a real entry (not on `$resumingFromCall`),
so a phone call does not buy a visit.

**5. The worm takes a sad trombone.** A hit is now one short brassy blat: a
sawtooth through a lowpass, held a beat at Bb3 then sliding down a minor third,
with an 11Hz wobble fading in on the tail, under half a second so a fast run of
hits doesn't smear. Verified the graph builds (sawtooth + sine LFO + biquad).
The miss sound is untouched. **The worm game also respects the mute button now** —
it had its own AudioContext and ignored it completely.

**6. The matchbook moved into the Pillars.** It was firing on the hub, gated on
having visited the Pillars, so it could be pocketed walking out of the Ginger
Light. It now lives in `Entering The Pillars of Hercules` under a plain
`(if: $hasMatches is false)`. Verified: the overlay comes up inside the pub.

**7. The mute button is reachable everywhere.** It was never missing from the
DOM — it was being buried. Harlowe's own dialog backdrop is `z-index: 999996`,
so the notebook covered it, and the rules and primer cards (99990) covered it
too. Raised to `999999` and given a MutationObserver that re-attaches it if
anything ever removes it. Verified clickable with the notebook dialog open.

**8. The primer fades in.** The scrim always faded, but the card did not fade on
its own. It now starts at opacity 0, `translateY(14px) scale(0.985)`, and comes
up over 0.62s after a 0.1s beat; the scrim's fade went 0.28s → 0.5s. The reveal
uses a double rAF with a 140ms timeout fallback, because a backgrounded tab
stalls rAF and would otherwise leave the card invisible. Applies to all three
`.dss-rules-overlay` modals, and honours `prefers-reduced-motion`.

**9. 'Back to the street' goes back to the street.** Reversing Addendum 47 at
Sam's word ("I made an error in my instructions"). All 17 venue exits and all 11
header-exit targets now land on `Dean Street` — the hub page with the walkable
map — instead of the venue's 3D approach. The labels stay as they are: "Back to
the street" in the body, "← Exit to the street" in the header. The approach
scenes are still reached the intended way, by walking the map to a door.
Verified: leaving the Pillars lands on `hub` with `#soho-map-container` present.

---

## Addendum 70 — four from the playthrough (2026-09-13)

**1. The phone box was standing on the Colony's doorstep.** The Colony Room's
door is at map tile (20,24) and you enter it from the pavement at (19,24). The
phone box was a `spot` door occupying (19,24) — the very tile you have to stand
on to reach the Colony — so walking to the Colony fired the phone box every
time. Moved the box two tiles north to (19,22), still on the Dean Street
pavement, clear of the Colony, the Ginger Light corner and the lamps.

**2. The blue box round the lily at the Pillars.** Harlowe's own styling. A
`(click:)` on a hook containing block content becomes an
`.enchantment-clickblock`, and the engine paints
`box-shadow: inset 0 0 0 .5vmax` in `rgba(65,105,225,.5)` — royal blue, deep sky
blue on hover. The Chippy's lily escapes it because that hook is inline and
becomes an `enchantment-link` instead. Overrode the engine rule: no box at rest,
and a faint gold breath (`inset 0 0 22px rgba(226,186,96,0.16)`) on hover so the
lily still reads as touchable. Verified at the Pillars: `::after` now computes to
`box-shadow: none`, `color: transparent`.

**3. 'A doorway' no longer dresses as a venue.** It was the only non-event door
without a venue behind it, so it was getting the full treatment: a lit door icon,
a light spill across the pavement, a beckoning chevron, a coloured frontage on
the block, a 30px halo and a glowing name plate. New `quiet: true` flag on that
door now: drops the icon, the spill and the chevron entirely; leaves the building
front unlit; cuts the halo to 16px and the light to 28%; and gives the label a
`soho-door-quiet` class — grey-blue, 0.72 opacity, smaller, no glow, hairline
border. Verified the flag reaches the map and the two label styles side by side.
**Not** seen in situ: the doorway link only opens under the low-morale nudge, so
the live look on the map is unconfirmed — worth a glance next playthrough.

**4. The dead column on the hub.** Two bugs stacked.

The Dean Street lamp sizes itself to the bottom of the last visible content.
`findContentBottom` measured relative to the PASSAGE top, but the lamp starts
213px below that, so the pole always overshot by 213px. Worse, `.dss-night-choice`
and `.dss-thread-cue` carry `clear: both`, so they were pushed below the
overshooting pole — which raised the content bottom, which grew the pole, which
pushed them further down. The page settled at 2782px with roughly 1200px of
nothing but lamp.

Fixed both: the measurement now stops at the first cleared block (it and
everything after it sits below the float by definition, and is none of the lamp's
business), and the height subtracts the lamp's own offset from the passage top.
Pass 2 also gained a timeout fallback, since rAF stalls in a backgrounded tab.

Measured on the hub: lamp 1976px → 789px, ending level with the map instead of
1200px past it; the thread cue moved from 2220 to 1033; page height 2782 → 1595.

---

## Addendum 71 — re-audit of the 'Dean Street' exit labels (2026-09-13)

Swept all 59 links whose label mentions Dean Street or the street, against the
passage's tags and the link's actual target. Two were genuinely wrong — both
inside a venue, both promising Dean Street from indoors:

- **The Set** `[venue-ronnies]` — `[[Back to Dean Street|After the music]]` →
  "Back to the street". You are still in Ronnie Scott's when the set ends.
- **O'Flatterly's Gift** `[venue-cecilcourt]` — `[[Back to Dean Street|After
  Cecil Court]]` → "Back to the street". Doubly wrong: indoors, and Cecil Court
  is off Charing Cross Road, not Dean Street.

Both targets are outdoor typewriter interstitials that land on Dean Street, so
the destination was honest; only the label was off.

**Deliberately left alone** (checked, not wrong):

- **The cellar three** — `Standing`, `Beaten`, `St. John's Word` `[venue-cellar]`
  say Dean Street but go to `The dark pass`. The prose has already walked him
  out: "you push out onto Dean Street", "You surface to Dean Street." The label
  matches the fiction and `The dark pass` lands on the hub.
- **`Watkins`** — "Not tonight. Back to Dean Street." — a written refusal line,
  not UI chrome. **Worth a look from Sam**: it is in Cecil Court, so strictly it
  names the wrong street, but it is his line to change, not mine.
- **`The critic's judgement`** — "Try Dean Street again" — his line.
- **Approaches and alleys** — all say "Back to Dean Street" and all go there.
  Correct: you are already outdoors on the street.
- **`LINE 3`** — untagged vision passage; "Back to Dean Street" is right.
- **Dream returns** — labelled plain "Dean Street"; correct.

Every remaining "Back to the street" label now targets `Dean Street` directly.

---

## Addendum 72 — Greek Street corrected against the real street (2026-09-13)

Sam supplied a Google Maps screenshot of Soho with pins on Trisha's, Ronnie
Scott's, the Coach and Horses, the French House and The Little Scarlet Door
("about where the Pillars used to be"), plus the note that the Pillars stood on
the Greek Street / Manette Street corner, at the arch, on the same side as the
Scarlet Door.

**Changed on the walkable hub map** (Greek Street is c41-42: west kerb c40 /
west buildings c39, east kerb c43 / east buildings c44):

- **Trisha's** — was on the EAST side of Greek (door c44,r19). It is on the
  **west** side (57 Greek Street). Now door c39,r19, entered from c40,r19.
- **The Coach and Horses** — was on the WEST side (door c39,r33). It is on the
  **east** side, on the Romilly Street corner, which is itself east of Greek.
  Now door c44,r33, entered from c43,r33.

**Checked and left alone:**

- **The Pillars** was already right: east side of Greek, door c44,r11 — the
  first building south of the Manette Street arch. Moving it one north to r10
  looked correct on paper but broke it: Manette runs at r8-9, so every tile at
  r10 east of Greek is kerb, not building. Same trap caught the Coach at r34
  (Romilly is r35-36). **Rule for anyone moving a door: a tile orthogonally
  adjacent to a road is always pavement, so the corner building is two rows off
  the cross-street, not one.** Verified every door afterwards by re-running the
  map's own tile rules: all 27 sit on a building (or a walkable spot) with a
  walkable approach.
- **Ronnie Scott's** — already correct, west side of Frith Street (47 Frith St).
- The lamp at c43,r34 stayed put; the Coach's door at r33 clears it.

**Still open — two things I would not decide alone:**

1. **The notebook map draws Trisha's NORTH of the Pillars** (Trisha's 494,200;
   Pillars 486,228), which is backwards — Manette Street is far north of 57
   Greek Street. Fixing it properly means moving Trisha's south, and Trisha's is
   one of the five pentangle anchors (`points='280,70 490,560 100,250 494,200
   230,470'`), so the star changes shape. Sam's call. Moving only the Pillars
   north is possible but it would crowd the GREEK STREET label at y=160.
2. **Dean Street sides.** The game has the French on the west side (door c15)
   and the Colony on the east (door c20). 49 and 41 Dean Street are both odd
   numbers, so in reality they are on the same side. The screenshot pins only
   the French. Needs Sam to say which side both belong on.

---

## Addendum 73 — Trisha's moved, the pentangle redrawn (2026-09-13)

On the notebook plan Trisha's was drawn NORTH of the Pillars, which is backwards:
the Pillars stood at the Manette Street arch, right at the top of Greek Street,
and Trisha's (57 Greek Street) is well south of it.

- **Trisha's** `494,200` → `494,262` — south of the Pillars, still north of
  Bateman Street.
- **The Pillars** `486,228` → `486,205` — up to the top of Greek Street, at the
  arch.

The pentangle geometry exists in **three** places and all three were updated, so
the star stays consistent: the notebook map (`map-pentagram` + `map-pent-tracer`
+ `map-pent-lilies`), **Dawn Approach White** and **Dawn Approach Black** (`_pv`,
polygon + `pent-lily`). The gathered-lily mark for lily 2 moved with the Pillars
node.

**The star is still a true pentagram.** Checked by computing the angular ring
round the centroid — Chippy → Centre Point → Trisha's → Coach → French — and the
draw order steps two points each time, five times over, which is the definition.
The apex (Centre Point) has not moved.

It also reads *better* than before: the left arm (Chippy) sits at y=250 and the
right arm was at y=200, so the old star was tilted; at y=262 the two arms are
nearly level. Confirmed on the Dawn Approach over the rooftops — a clean,
slightly lopsided five-pointed star, which is the house rule.

Positions now agree between the walkable map and the notebook plan: on Greek
Street, north to south, the Pillars (at Manette) → Trisha's → the Coach and
Horses (at Romilly).

---

## Addendum 74 — Dean Street: the Colony crosses the road (2026-09-13)

Sam's ruling: the French (49 Dean St) and the Colony (41 Dean St) are both on the
**west** side. The French was already there (door c15,r25). The Colony moved from
the east side (door c20,r24) to **c15,r22**, entered from c16,r22 — three tiles
north of the French, since 41 is north of 49.

Dean Street's four now all sit west: the chippy (c15,r6), the Colony (c15,r22),
the French (c15,r25), the teaching doorway (c15,r30). Re-ran the map's own tile
rules over all 27 doors afterwards: no bad tiles, no two doors sharing a tile.

**Honest note on the screenshot.** Sam asked me to confirm the side from the
Google Maps image. I could not. Measuring the pin against the street-label
centrelines put the French House 28px **east** of Dean Street — but the same
method put it 63px **south** of Old Compton Street, which is certainly wrong
(the French is a few doors north of that junction). The cross-checks landed
correctly (Ronnie's -12px west of Frith, Trisha's -18px west of Greek), so the
method is not broken, but it is not good enough at this resolution to settle a
question of one street's width. Went with Sam's call. If the sides ever come up
again, a photograph or a street-number check beats reading pins off a rotated
map.

---

## Addendum 75 — the hub nudges removed (2026-09-13)

Sam: "I don't like the 'Go where the light is already on.' type prompts. Can you
get rid of those, people will work it out."

Deleted the whole `.dss-thread-cue` block from Dean Street — all four states of
it, not just the first:

- `$returns <= 1` — "Go where the light is already on."
- poem incomplete — "The morning still has lines missing."
- fewer than 12 haunts — "The night is not finished marking you."
- otherwise — "Go towards the morning."

All the styling was inline on that one div, so nothing is left behind in the
stylesheet. The map now runs straight into the Dean Street prose; the page came
down again from 1595px to 1454px, because that div was the second of the two
`clear: both` blocks under the lamp.

**Left in place, same neighbourhood, different register — flag if he wants them
gone too:**

- `.dss-night-choice` — "The poem is complete. Stay as long as you like." Not a
  nudge; it tells you the ending has opened and that there is no rush.
- `.alba-hint` in the header — "One line is caught. Two more still to find." A
  status readout under the ALBA counter rather than an instruction.

---

## Addendum 76 — Cecil Court: opened early, and a thread of light to it (2026-09-13)

Sam wanted players in Cecil Court early, and couldn't see how they'd find it.

**1. The haunt box was already promising it.** THE REFUSAL — the novelist at the
French, one of the first beats in the game — carries
`<div class="haunt-opens">You know Cecil Court very well.</div>`. Every other
`haunt-opens` line announces a place the haunt unlocks, but the hub gates Cecil
Court on `$knowsCecilCourt`, which was set in exactly one place in play: `The
critic's judgement`, after the Pillars and the Great Ham. So the game told the
player they knew Cecil Court and then kept it shut for another half-hour.

`(set: $knowsCecilCourt to true)` now sits with the haunt in `The novelist`, and
the two back-fill lines (Dean Street + the header) were widened from
`$metCritic is true` to `$metCritic is true or ($haunts is an array and $haunts
contains $haunt2)` so existing saves that already hold THE REFUSAL get it too.

Verified: collect THE REFUSAL, walk back out, and the hub offers **"Visit the
antiquarian in Cecil Court"** with no critic involved. The critic's referral is
untouched and still the better introduction — he names Inis, the haunt box
doesn't.

**2. The thread of light.** Cecil Court's door is at c51,r38, off the bottom-right
corner of a 26-tile view — never on screen from anywhere the player starts. While
the court is open, the map now lays a line of its own violet light
(`[180,138,224]`, the court's colour) along the pavement from the player's feet
towards it, with a pulse running away down the route. Drawn in world space under
the street life, `globalCompositeOperation = 'lighter'`, view-culled.

The route is a breadth-first search over `walkable()`, cached and recomputed only
when the player changes tile, so it costs nothing per frame and always leads from
wherever they are. It needs no words, which is what Sam wanted after Addendum 75.

**It puts itself away on its own**, because it keys off `doors.cecil.status`,
which the map derives from the hub link: open while the visit is the thing to do,
**grey** (thread off) while Page 93 is still to be found, and gone once the page
is returned. So it guides the first trip and then stops.

Verified live: a 59-tile route found from the spawn; path tiles sample
50.7/49.1/62.3 against 39.5/40.5/48.4 for the pavement beside them — about 28%
brighter and violet-leaning, and visibly running to the lit Cecil Court mouth.

---

## Addendum 77 — Carthage had a second door (2026-09-14)

Sam: "I was able to go straight to Carthage from my first visit to the Pillars.
I thought it was meant to be gated."

He was right, and the gate from Addendum 69 was in the wrong place — or rather,
in only one of two places. It went on the in-pub link
(`'I can walk on water'`, now `$pillarsVisits >= 2`). But the hub does not link
to the pub directly: `[[To The Pillars of Hercules|Maritime interlude]]`. The
interlude — the storm, NE PLUS ULTRA — is a fork, and its second branch
`[[Seek the shore|The coast of Carthage]]` went straight to Carthage with no
gate at all, on the very first trip.

**Worth knowing before touching it again:** that fork is deliberate. Its comment
reads "RESTORED FORK (2026-07-22): both destinations always on offer — press on
to the pub, or answer NE PLUS ULTRA and cross early. Early crossing is safe:
Green Sea/LINE 2 is gated behind the page quest at Carthage shore, and The
Interval self-guards. The lap is the price." So someone put it back on purpose.
I have narrowed it on Sam's word; the original comment is kept above mine and
deleting one `(if:)` restores it exactly.

**Now:** the sea-road appears once he has been inside the Pillars once
(`$pillarsVisits >= 1` at the interlude). That lines up with the pub link's own
gate at `>= 2`, because the counter increments on entering: first trip you go to
the pub, and from the second trip both routes are open together.

The prose still stands on its own with one branch — NE PLUS ULTRA, "Do you keep
going?", "Yes" is a complete beat; the shore was always the other answer.

Verified: first visit offers only "Yes" and no shore line; after one visit inside,
both "Yes" and "Seek the shore" are back, with the italic line above it.

---

## Addendum 78 — playthrough notes, part one (2026-09-14)

**Done:**

**3. After the Great Ham** — `[[Try Dean Street again|Dean Street]]` →
`[[Leave the pub.|Dean Street]]`.

**5. The phone box is now a phone box.** It was an `event` door, and event doors
draw a faint pool and no label, so it was an unmarked patch of red light on the
pavement. There is now a K2 box drawn on its tile in `buildBase` — red frame,
domed crown with a gold sign, glazed panes — drawn **always**, because it is
street furniture and should be visible before you have a coin, and lit from the
inside (plus a halo and a stronger pool) only when the hub is offering it.

**2. The Pillars camera** — tilted, not retreated. The drain and its pool sit at
`(2.2, 0, 6.4)`; the old framing (`pos 2.1,3.5,11.5`, `lookAt 0,5,0`) pointed
*up* the facade at +7°, putting the flood ~42° below the camera axis and well
outside a 55° frame, so the whole flood mechanic was playing out off screen. Now
`pos 2.1,3.9,12.0`, `lookAt 0,2.6,2.5`: axis −7.6°, flood 27° below it, inside
the frame's bottom edge, with the sign and the timber frontage still in shot.
**Do not fix this by pulling the camera back** — the fog is near 5 / far 40 and
the facade goes flat long before the road arrives. Tilt, don't retreat.

**Investigated, not changed — needs Sam:**

**4b. The gents.** Checked live: `[[Back up to the Square|Alley: Soho Square]]`
does land on the Square (the king on his plinth, the hut, the way back to Dean
Street). The likeliest cause of "the first screen of that little minigame" is
that the Square page leads with the Soho Hut Art and "Down to the gents" — so
coming back up looks like the game's front door. Easy fix once confirmed: show
the hut and the way down only before you have played.
The lighter prompt is the stash mechanic: `Alley: Soho Square` carries
`(display: "Stash Point")`, which every stash site does, and it offers to leave
whatever pocket-key you are carrying. It can come off the Square in one line.
Could not reproduce the stray `//` — zero in the Square, the gents, or any of
the Stash Point displays, with and without a key.

**1 + 6. The Pillars.** Deferred together, because the matchbook's home depends
on the phase model. The structure Sam describes is *nearly* what is coded: the
hub reopens the Pillars only when `$knowsAboutPage` is true, which Inis sets in
Cecil Court. The leak is `$metCritic`: it is set inside `Talk to the critic`, so
a player who enters the Pillars and does not talk to the Ham leaves it false, the
first branch stays open, and they can go back in again and again — collecting the
Aoife call, the Lily call and the dual ring in quick succession.

**4. Quests as modals** — needs to know which quests.

---

## Addendum 79 — quests are modals now (2026-09-14)

Sam: "The quests should be modal pop ups not just part of the page… atm it's just
the page hunt from Cecil Court, but I might add more." Built as a **pattern**, not
a one-off, using the idiom the pocket-keys already proved: park the thing in the
passage, raise it as a popup.

**To add a quest anywhere, that is the whole job:**

```
<div class="dss-quest-offer" data-go="I'll look for it">
<div class="dss-quest-title">PAGE 93</div>
<div class="dss-quest-body">…the quest…</div>
</div>
<script>(function(){setTimeout(function(){if(window.dssQuestPopup)window.dssQuestPopup();},1500);})();</script>

[[I'll look for it|Dean Street]]
```

`.dss-quest-offer` is parked off-screen by CSS. `window.dssQuestPopup()` reads the
title, body and optional `.dss-quest-art`, raises a card, and its button clicks
the passage link named by `data-go`. An optional `.dss-quest-art` block is
supported for future quests that want an object on the card.

**Two things it gets right on purpose:**

- **It cannot strand the player.** The passage keeps its own visible link, so
  Escape or a click on the scrim closes the card and leaves the way out on the
  page. Only the card's button navigates.
- **It queues.** `#dss-quest-overlay` is registered with `dssOverlayBusy`, so it
  defers behind the drink/coin/key overlays rather than fighting them, and the
  1500ms delay lets the haunt ceremony in that passage (THE FEEDING) finish
  first.

Dressed as the primer card — the same gradient, gold border, offset outline and
shadow — ID-qualified because `.coin-overlay-box` comes later in the sheet and
would otherwise cap it at 320px. Fades in like the other cards, and honours
`prefers-reduced-motion`.

Verified: card reads ⟡ QUEST ⟡ / PAGE 93 / the body / I'LL LOOK FOR IT; the
button lands on the hub; the passage link survives underneath.

---

## Addendum 80 — the Pillars in three phases (2026-09-14)

Sam handed me the call on this. Built as:

**Phase 1 — the critic.** The pub is open while `$metCritic` is false, and holds
the Aoife call and the Ham and nothing else. No drink, no sea-road from inside,
no matchbox. The call and the critic land on the **same visit**: accepting the
call returns through `$resumingFromCall`, which does not count a visit, so you
hang up and the Ham is there. Refusing still rings again next time, as designed.

**Phase 2 — shut to the pub, open to the sea.** Once the critic is met, the
storm drops `[[Yes|Approach The Pillars]]` and offers only `[[Seek the shore]]`.
The hub keeps a Pillars link, so the street still leads there — it just leads
past the door.

**Phase 3 — the portal.** `$inisToldOfPillars` (set by `O'Flatterly's Gift`,
i.e. page 93 **returned**, not merely Inis met) restores "Yes" and the hub's
open link. Sam confirmed this was his intent once he re-read it: reopening and
becoming the portal are the same beat. The hub branch was rekeyed from
`$knowsAboutPage` to `$inisToldOfPillars` accordingly.

**The three-calls leak is closed twice over.** The Lily ring and the dual ring
now require `_pillarsOpen` (`$metCritic is true`), so they cannot be farmed by
bouncing in and out before meeting the Ham; and after the Ham the pub is shut
anyway. Both calls still live at the French and the Coach, so nothing is lost.

**The matchbox moved to the Chippy.** It cannot sit in a phased pub — phase 1 is
the critic, phase 2 has no pub, phase 3 is far too late for something that lights
cigarettes all night. A counter you eat at is the natural home, it is early, and
Trisha's matchbook stays the other, better-dressed source. **This overrides Sam's
"find the matches in the Pillars" from 2026-09-13** — flagged to him.

**Verified live, whole chain:** phase 1 storm offers only "Yes"; pub offers only
the call; hang up and the Ham is there; the judgement ends on "Leave the pub.";
phase 2 storm offers only "Seek the shore"; after `O'Flatterly's Gift`, phase 3
storm offers "Yes" and "Seek the shore". Zero `tw-error`s throughout.

**Worth keeping in view:** line two of the poem exists only in the five dream
worlds, which are only reachable through the portal. So Cecil Court and page 93
are now the sole road to a complete alba. That was already true; the phases make
it load-bearing. A player who skips Inis still finishes the night, on the other
ending.

---

## Addendum 81 — the French moves, a second path, the pocket key surfaces (2026-09-14)

**1. The French crossed the road and went south.** Hub map: door c15,r25 (west of
Dean, north of Old Compton) → **c20,r30**, entered from c19,r30 — east side,
south of Old Compton. This also matches the measurement I took off Sam's Google
screenshot on 2026-09-13, which read east and south; I had discounted it then
because it disagreed with his own call at the time.

The notebook plan followed, and the French is a **pentangle anchor**, so all
eleven occurrences moved together: `230,470` → `248,566` (three node variants,
the gathered-lily mark, three pentagram polygons, the notebook tracer, three
pent-lily groups). Star re-checked by the angular-ring test — ring is
Chippy → Centre Point → Trisha's → Coach → French and the draw order still steps
two each time, so it is still a true pentagram. **Note this puts the French
opposite the Colony again**, reversing half of Addendum 74; Sam asked only about
the French, so the Colony stayed west.

**2.** The cellar approach button now reads **ANNOUNCE YOURSELF IN COPPER'S LAIR**.

**3. A second pavement path, to Ronnie Scott's.** The agent's
`[[You remember that Ronnie Scott's is open and close.|Approach Ronnie Scott's]]`
teleport is gone; you leave the Colony and the street leads you instead.

The Cecil Court thread from Addendum 76 is now a **table**, so a path is a row:

```
var THREADS = [
  { id: 'cecil',   flag: 'thread-cecil',   col: [180, 138, 224] },   // violet
  { id: 'ronnies', flag: 'thread-ronnies', col: [92, 146, 232] }     // blue
];
```

Two things had to change to generalise it. Routes are now cached **per
destination**, not globally. And a real door's own tile is not walkable, so the
search leads to `fc,fr` — the pavement you enter from — where a `spot` door like
Cecil still leads to `c,r`.

Each row is gated on a **hub flag**, a small string Dean Street prints for the
map (`hubFlag()` existed and nothing had ever emitted one — `hubFlag('notebook')`
was reading `''` forever, which is why the Foyles fence never appeared; that is
now emitted too). Ronnie's path lights while `$knowsRonnies` is true and the
player has not been in, and puts itself away on arrival.

Verified on the live map: route tiles sample 51.8/60.1/79.4 and 56.9/68.1/92.2 —
blue-dominant — against 39.7/40.7/48.4 for the pavement beside them, and plainly
a different colour from Cecil's violet.

**4. The pocket key is in the header.** A `.pocket-cell` in the ALBA strip naming
what is in the pocket — `⚲ BRASS LIGHTER` — so it is visible everywhere instead
of only in the notebook inventory. **Harlowe has no `'s uppercase`** (it errored
loudly); the CSS `text-transform` does that job. `$dreamKey` is only committed by
`Key Guards` on the **next** render after a key is pocketed, so the cell appears
when you step out of the venue, not the instant you take it.

---

## Addendum 82 — the pocket key lands on its world (2026-09-14)

Sam went looking for the pocket key under **DREAMS** and didn't find it. It was
in the notebook all along, under **EFFECTS** — "◈ In Your Pocket", the object
drawn, and a caption naming it and where it came from ("The brass lighter, from
the bar at The French"). The tab is called EFFECTS, not Inventory, which is
probably why it was missed.

But his instinct was the better design: the key **is** the ticket to one
particular world (`DSS_KEY_WORLDS`: lighter→Himalayas, cocaine→Nazca,
ticket→Easter, slip→Pyramid, eye→Ezekiel), so the dream ledger is where that
connection belongs.

The ledger row for the world your key opens now carries a line under it:

```
☸ HIMALAYAS          —          THE CRITIC
    ⚲ brass lighter, in your pocket
⌁ NAZCA              —          LACKLAND
```

**Only the key in hand is shown.** Naming all five pairings would hand the player
the whole map of key to world; showing just the one you carry answers "what is
this for" without spoiling the other four, which are still something to find out.

Implementation: five temp vars (`_kH/_kN/_kE/_kP/_kZ`), one per world, all empty
but the matching one, spliced into each row before its closing `</div>`. The row
is a four-column grid, so `.dream-ledger-key` takes `grid-column: 1 / -1` and
reads as a note under the world rather than a fifth column.

The EFFECTS entry stays — that is the inventory record, with the art and the
provenance. DREAMS says what it opens; EFFECTS says what it is. The header cell
from Addendum 81 says only that you have one at all, which is the bit you need
while walking about.

---

## Addendum 83 — Ezekiel is the last world (2026-09-14)

Sam asked whether Ezekiel should be something more final. Looking at the five
side by side, the game was already half-saying yes:

| world | passages | prose | set-piece | turn-back |
|---|---|---|---|---|
| Himalayas | 8 | ~15.0k | The Climb | yes |
| Pyramid | 7 | ~12.3k | Pyramid Run | yes |
| Nazca | 7 | ~10.0k | Nazca Race | yes |
| Easter | 7 | ~9.5k | — | yes |
| **Ezekiel** | **5** | **~8.5k** | **—** | **no** |

The other four all offer a refusal at the centre ("Turn back", "Walk on past
it", "Turn around, you've seen enough"). **Ezekiel has none** — at the Wheel
there is only "Come back". And thematically it is not a site at all: the other
four are places the book points at; Ezekiel is the vision the argument is built
on. The glass eye and "wheels full of eyes round about" were already paired.

**My first proposal was wrong and Sam corrected it.** I suggested making it the
fifth crossing of a night. But the portal excludes lifetime-visited worlds
*before* per-night ones — variation across replays is the spine of the feature,
and a night is not meant to hold all five. Gating to "fifth in a night" would
have buried the world almost entirely.

**Built instead on the lifetime axis.** In `Third Pillar Portal`:

```js
var FINAL = "ezekiel";
var seen = lifetime.concat(visited);
var finalReady = all.every(function(w) { return w === FINAL || seen.indexOf(w) >= 0; });
function allowed(w) { return w !== FINAL || finalReady; }
```

`allowed()` filters both the primary pool and the drop-lifetime fallback, so
Ezekiel is simply not in the roll until the other four have been walked — across
playthroughs, or within one night if a player manages four.

**The glass eye had to be handled or it would have defeated the gate**, because a
held key overrides lifetime variety and steers straight to its world. Both
`steerPre` and `steer` now drop to null when they point at Ezekiel before it is
due, so the eye travels as an ordinary key. It is **not** spent by a crossing to
another world (only the matching key is consumed), so it keeps for the night it
is good for.

**Tested the logic across seven lifetimes** — night one with the eye rolls among
the four; three lifetime + the eye still excludes it; four lifetime gives a pool
of exactly Ezekiel; three lifetime plus the fourth walked that night opens it;
all five lifetime returns everything to the roll for replays. No state reaches
the fallback dead-end. Live: both a fresh lifetime and a four-world lifetime
build a working "Step through" with zero errors, and the four-world one lands on
`dream ezekiel` — "A river you have never named…".

**Sam is adding hints across the game that a night cannot hold every world**, so
players know to play again — which is what makes this gate readable rather than
arbitrary.

---

## Addendum 84 — one crossing a night, and the key decides (2026-09-14)

**CORRECTION to Addenda 80 and 83.** I twice told Sam that line two of the poem
exists only in the five dream worlds. It does not. `LINE 2 [green-sea]` grants
`$alba2` as well, reached Carthage shore → Green Sea Approach → LINE 2. So there
are **two** roads to line two. The larger claim held — the Green Sea is gated on
`$visitedPyre is true and $returnedPage is true`, so both roads still run through
Cecil Court and page 93 — but "only in the dream worlds" was wrong.

**One crossing a night.** The column now wants `$worldsVisited's length < 1`. Its
second branch was rekeyed from `>= 5` to `>= 1` and redrafted: "it will not take
you twice in a night." The worlds are 9–15k words apiece; one is a night's worth,
and the cap is what makes the five-night shape real rather than hoped for.

**The key decides the world. The roll is gone.** `Third Pillar Portal` used to
pick from a pool with the key merely steering. Now the pocket-key names the world
and nothing else does, so which world you get is something the player chose in
Soho. Three ways it can come to nothing, each with its own turn-back and each
carrying its own way out (verified — no soft-lock):

- **no key** → the existing fallback
- **its world already walked** → `#dss-portal-seen`, "You have been down this one"
- **the eye before its time** → `#dss-portal-notyet`, "The column will not take the eye. Not yet"

"Already walked" is measured **across playthroughs**, not the night. Each key is
good once ever: five keys, five worlds, five nights, and the way to see a new one
is to carry a different key. This makes Sam's planned "come back" hints point at
a real rule.

**Decision table exercised** across eight lifetimes: night one with the lighter
crosses to Himalayas; night one with the eye is turned back "not yet"; night two
with the lighter is turned back "already been" while the cocaine crosses to
Nazca; four done plus the eye crosses to Ezekiel; four done plus the lighter is
turned back; all five done turns every key back; no key falls back.

**Consequence worth weighing:** once all five are walked in a lifetime, the third
pillar never opens again — every key turns you back. The Synthesis is then the
remaining dream-world content. If Sam would rather the worlds stay re-walkable
after a complete set, that is one line in the "already walked" test.

**Not verified live:** an actual crossing with a key in hand. `$dreamKey` does not
survive a debug jump on a save with `$returns < 1`, because the autosave is not
written at all below that threshold (see `project_debug_jump_autosave`). The
no-key path, the three turn-backs and their exits were verified in the running
game with zero `tw-error`s.

---

## Addendum 85 — the worlds stay walkable (2026-09-14)

Sam: the worlds should stay walkable after a complete set, and there should be
one last return to the Pillars.

**Both were already true, and my first attempt at it was dead code.** I added an
`allWalked` escape to the "already been" test — but `dssMarkWorldSeen()` **empties
the lifetime worlds list the moment it reaches five**:

```js
if (lifetime.length >= window.DSS_WORLDS_ALL.length) lifetime = [];
```

So the saved list can never hold five, `allWalked` could never be true, and the
reopening it was meant to provide was already happening by cycle reset. Removed
it and wrote the real mechanism into the comment instead.

**Walked the whole cycle through the real bookkeeping:**

```
himalayas -> worlds=[himalayas]                       gifts=1
nazca     -> worlds=[himalayas|nazca]                 gifts=2
easter    -> worlds=[himalayas|nazca|easter]          gifts=3
pyramid   -> worlds=[himalayas|nazca|easter|pyramid]  gifts=4
ezekiel   -> worlds=[]                                gifts=5
```

The fifth world wipes the **worlds** list, so every road opens again and the next
cycle starts with Ezekiel last once more (`finalReady` back to false, the lighter
crossing again — both confirmed). The **gifts** list never resets, which is what
makes the last return survive the wipe.

**The one last return to the Pillars is the Synthesis**, and it is keyed to the
permanent gifts list, not the resettable worlds list. Verified live: with five
gifts banked, `Entering The Pillars of Hercules` reveals `#dss-synthesis-link`
with "Perform the synthesis", zero errors.

So the full shape is now: five nights, one world each, Ezekiel last; then the
Pillars one final time for the ritual; and afterwards the worlds are open again
for another lifetime, with the ritual already earned.

---

## Addendum 86 — why the third pillar stayed shut (2026-09-14)

Sam returned page 93, pocketed the lighter, went to the Pillars and got no
crossing. The column's condition is
`$inisToldOfPillars is true and $dreamKey is not "" and $worldsVisited's length < 1`,
and the failing term was **`$inisToldOfPillars`**.

`Return the page` is tagged `venue-cecilcourt`, so it carries the header's
"← Exit to the street". Its only body link is
`[['You don't know the good that you've done'|O'Flatterly's Gift]]`, and
**`O'Flatterly's Gift` is where everything actually happens**: Shelley's liver,
THE DELIVERY, `$returnedPage`, and `(set: $inisToldOfPillars to true)` — the
third-pillar tip-off. Take the header exit instead and the page is gone and none
of it is set. Irrecoverably: you cannot hand the page over twice.

Added `"Return the page"` to `_backHide`. Verified: the passage now renders with
NOTEBOOK only in the header and the single way on in the body.

**This is a class, not a one-off, and I widened it.** The header exit went onto
every venue-tagged passage in Addendum 47. Audited: **30** venue passages have a
single body link and no `_backHide` entry. Most are harmless — their one link
*is* "Back to the street", so the header does the same thing. The ones where the
single link goes *deeper*, so leaving costs the payoff:

| passage | its one way on | what bailing costs |
|---|---|---|
| **Return the page** | O'Flatterly's Gift | **FIXED** — liver, haunt, third pillar |
| Give him the painting | After the painter | the painting is already handed over |
| Bar Canvas Win / Lose | The Set | THE HEAD (haunt 7) |
| Shana's Verdict | After Shana | the reading is spent |
| Copper Word Accepted | Fight starts | committed to the fight |
| Stand your ground | Fight starts | committed to the fight |
| Benito's Hour | The Painter's Gaze | mid-scene |
| Approach the novelist | The novelist | THE REFUSAL — and Cecil Court with it |
| Talk to the Artists | The Spanish Artist | recoverable (he is still there) |
| Cecil Court | Watkins | leaving the court is legitimate |
| Martin Lackland's Office | Back Door | leaving after the verdict is legitimate |
| O'Flatterly's shop | introduction | recoverable |
| Lackland's Back Room | Watch the decider | recoverable |

**Not fixed unilaterally**, because suppressing an exit removes a player choice
and that is Sam's call (see `feedback_preserve_choices`). My recommendation is to
close the top six — the ones where something has already been handed over or
played and only the payoff is outstanding — and leave the rest, where walking out
is a legitimate thing to do.

---

## Addendum 87 — the mid-beat exits closed (2026-09-14)

Sam's ruling: close the six. Added to `_backHide` alongside `Return the page`:

| passage | its way on | what bailing used to cost |
|---|---|---|
| Give him the painting | Step out. | the painting is already handed over |
| Bar Canvas Win | Listen | THE HEAD (haunt 7) |
| Bar Canvas Lose | Listen | THE HEAD (haunt 7) |
| Shana's Verdict | Take the manuscript | the reading is spent |
| Copper Word Accepted | Brace yourself | committed to the fight |
| Stand your ground | All right, then. | committed to the fight |
| Approach the novelist | Nothing / Everything | THE REFUSAL, and Cecil Court with it |

Checked before writing that every one still has its own way on in the body, so
suppressing the header exit cannot strand anyone. `_backHide` removes only the
exit; NOTEBOOK stays. Spot-verified live on `Give him the painting` (header:
NOTEBOOK only; body: "Step out.") and `Approach the novelist` (header: NOTEBOOK
only; body: "Nothing", "Everything" — it has two, the second inside a hook, which
the static scan had missed).

**Left open deliberately**, because walking out of them is a fair thing to want:
`Cecil Court` (→ Watkins), `Martin Lackland's Office` (→ Back Door, after the
verdict), `O'Flatterly's shop`, `Lackland's Back Room`, `Talk to the Artists`.

**The borderline one I did not close: `Benito's Hour` → `The Painter's Gaze`.**
It was sixth in the handoff table but not in the list Sam saw in chat, so I left
it rather than quietly widen the ruling. You are sitting for a portrait and the
next beat is him looking at you — arguably committed, arguably fine to leave.
One word adds it.

**Addendum 87a.** `Benito's Hour` added too, on Sam's word. Checked it keeps its
way on ("Let him look" → `The Painter's Gaze`) before suppressing the exit;
verified live — header NOTEBOOK only, body link intact, no errors. `_backHide`
now holds 34 names: the original 25, `Return the page`, the six, and this.

---

## Addendum 88 — the ringing phone can no longer trap you (2026-09-14)

Sam, at the Coach after taking/rejecting the betting slip: "another phonecall
rang and the screen went all blurry and I couldn't move from there."

**I did not reproduce the trigger, and my first diagnosis was wrong.** I thought
the venue tint's `isolation: isolate` was trapping `.phone-ringing` (z 99000)
inside the passage while the blur layer on `tw-story` (z 98999) painted over it.
Every reading that seemed to confirm it was confounded — first by the
betting-slip popup (z 9999998), then by the stats primer (z 99990) sitting over
my probe point. With those cleared the call's own link was topmost either way,
and the A/B I ran to check was invalid because my own `!important` rule stopped
the inline style doing anything. The isolation rule is kept as a cheap
precaution, not as the fix.

**What is fixed is the thing that turned it into a dead end.**
`tw-story:has(.phone-ringing)::before` is a full-screen layer that blurred the
page *and* swallowed every click, so nothing below z 98999 was reachable while a
phone was on screen — including the header and the notebook. Any failure inside
the call, from any cause, was therefore an unrecoverable lock. It is now
`pointer-events: none`.

**A/B, with a call on screen, clicking the NOTEBOOK link:**

| blocker | topmost element at that point |
|---|---|
| `pointer-events: auto` (old) | `TW-STORY` — the blocker. Dead. |
| `pointer-events: none` (now) | `TW-LINK` — reachable. |

The blur survives (`backdrop-filter: blur(6px)` confirmed still applied) and the
call's own panel still paints its 9999px box-shadow veil, so the look and the
focus are unchanged. The cost is that a determined player can now click past a
ringing phone — the better failure of the two.

**Still unknown: what started it.** Worth asking Sam whether the call came in the
bar or the gents (the Lily call at the Coach sets `$lilyCallReturn` to
`Coach and Horses lock`, which is the gents), and whether the blurred box had any
text in it or the screen was simply blurred with no panel at all.

**Addendum 88a — CONFIRMED, and the first diagnosis was right after all.**

Sam added the detail that decided it: "it was blurred, the whole thing was
blurred" — the call panel itself, not just the page behind it. A panel that gets
blurred by the backdrop layer is a panel painting *behind* it, which is the
stacking trap exactly.

Proven with two screenshots at the Coach, a call panel on screen:

- **`isolation: isolate` restored (the old behaviour):** the panel's own text and
  both buttons are blurred and unreadable.
- **isolation lifted (the fix):** the panel is crisp, the page behind still blurred.

So `tw-passage:has(.phone-ringing) { isolation: auto !important; }` IS the fix,
and the venues it rescues are the ones carrying a tint context: the Coach
(where Sam hit it), Lackland's, the back room, Cecil Court, the Interval and
street-night.

**Why three hit-tests missed it.** `elementsFromPoint` answers a different
question from "what paints on top". Run one had the betting-slip popup over the
probe point, run two had the stats primer, and by run three the blocker was
already `pointer-events: none`, so hit-testing ignored it entirely and reported
the call as topmost while it was still being painted over. **A paint bug needs a
screenshot; a click test will lie to you.**

Both changes stay, and they do different jobs: the isolation lift puts the call
above the blur where it belongs, and the click-through blocker means no future
failure of any kind can strand the player again.

---

## Addendum 89 — a bell, a quicker typewriter, and the dawn chorus (2026-09-14)

**1. The alba sound is a bell now, not a gong.** The old `distantBell` was four
sine partials at near-harmonic ratios (440 / 880 / 1180 / 220) faded in over
20ms, which is the recipe for a hum. Three things make the ear say "bell", and
all three are in now: partials at **inharmonic** ratios — above all the tierce at
1.2×, a minor third over the prime, which is the sound's signature; a **separate
decay per partial**, the hum ringing 5.6s while the top ones are gone in half a
second; and a **strike** — a 60ms filtered noise burst for the clapper, because a
bell is hit, not faded up. Small detunes set the partials beating. Verified: 8
oscillators, all sine, plus the clapper buffer.

**2. The typewriter hurries after the first page.** The opening earns its
slowness; every typewriter page after it in the same sitting runs at ~0.62 of the
pace (chars, paragraph pauses, sentence pauses and the lead-in all scaled). The
flag is in `sessionStorage`, so Play Again — which clears it — gets the slow
opening back, while a mid-night reload does not. Measured on the same passage
twice: **13.7 chars/sec first, 17.1 second**, 121 characters against 161 in the
same six seconds.

**3. Birdsong that thickens toward dawn.** New `chirp()` — a sine swept up and
back over two to four syllables, each randomised, lowpassed harder when "far" —
and a scheduler that re-times itself from `window.__dssNightDepth` (which the hub
map derives from `$nightPhase`). It only sings outdoors: hub, outdoor,
street-night, dawn-approach, dawn.

The rate curve is `6.5 * level^4.2`, steeply weighted to the end, because a
gentler curve put a bird a second into one in the morning. Measured chirps/sec:

| night | level | measured |
|---|---|---|
| before midnight | 0 | silence |
| after midnight | 0.33 | 0.13 |
| small hours | 0.67 | 0.40 |
| the approach | 0.85 | 5.4 |
| dawn | 1.0 | 11.4 |

Above 0.6 chirps start overlapping, which is what turns birds into a chorus.
`setBirdLevel()` forces it regardless of phase, and is called at **Towards Dawn
(0.55)**, **both Dawn Approaches (0.85)** and **Dawn (1.0)**. The boost is tied to
the `_passageGen` that set it, so the chorus does not follow you back into Soho.

**Two testing notes worth keeping.** The pane was **muted** (left over from the
worm-game test, persisted in localStorage) — every audio measurement read zero
until I noticed. And patching `AudioContext.prototype` across several separate
tool calls **stacks the wrappers** until the stack blows: the console filled with
`Maximum call stack size exceeded` from `createBiquadFilter`, and `_play` was
swallowing them, so it looked like the code was broken when it was the probe.
Patch once, restore in the same call. Also: the hub map rewrites
`window.__dssNightDepth` every frame, so injecting a test value there is useless
— drive it through `setBirdLevel()` instead. Pane left muted.

---

## Addendum 90 — the hints come on paper, and the map stops moving (2026-09-14)

**1. The lessons are a typed slip now.** Sam: "I don't like the way those
instructions in the header look. They aren't readable. Have them appear briefly
in typewriter form against a white background then fade after 8 seconds."

`dssInlineHint` no longer prints a line inside the header over the lily art. It
raises a small slip of cream paper, bottom-right, in Courier, typed a character
at a time with a blinking caret and the typewriter's own tick under it, and eight
seconds after the last letter it fades and removes itself. Paper because it is
the one surface in this game that isn't Soho at night, so the eye goes to it.

**Queued, one at a time.** Two lessons can fall due on the same screen — the
open-night tip and the door marks both fire on an early hub visit — and as first
built they were two fixed slips landing on the same coordinates. There is now a
queue: the second waits for the first to leave. Verified: fire two together and
you get `slipsOnScreen: 1, queued: 1`, the first typing correctly.

**2. The map resizing.** `.soho-map-stage` takes
`max-width: min(920px, calc((100vh - 200px) * 26 / 29))`. **`100vh` is not stable
in Safari** — it changes when the toolbar collapses — and Sam is playing in
Safari, which fits "the map just changed size when I left the French": navigate,
the page scrolls to top, the toolbar state changes, the map resizes under him.
Added a second declaration in `svh` (the small-viewport height, measured with the
toolbar out, which does not move), leaving the `vh` line above it as the fallback
for anything that lacks `svh`.

**Honest note: not reproduced.** In the preview browser the map held at 387px
through a 1200px change in page height, and this pane has overlay scrollbars so
it never loses width either. The `svh` change is reasoning from the symptom and
the platform, not from a reproduction. If it moves again in Safari, the next
thing to check is whether the width term (`100% - 178px`) is shifting instead,
which would point at the lamp gutter rather than the viewport.

**Addendum 90a — the exit link follows the header now.**

Sam: "Exit to street in O'Flatterly's needs to be lower." It was not an
O'Flatterly's problem. `.back-one-link` was `position: fixed; top: 158px`, a
number that assumes the header is always exactly 148px tall. It isn't: the ALBA
strip wraps to a second line when the window is narrow, and **the pocket-key cell
I added in Addendum 81 made that much likelier** — with a key in your pocket the
header grows and the exit ends up sitting inside it, which is what Sam saw.

`--dss-header-h` is now measured from the real header (on resize and on a 700ms
poll, since Harlowe re-renders the header on every passage) and the link takes
`top: calc(var(--dss-header-h, 148px) + 22px)`.

Verified by forcing the wrap: header 148 → exit at 170; pocket-key cell added,
header 165 → exit at 187. The gap stays 22px either way, clear of the header and
well above the prose.

**Addendum 90b — the storm lets you turn round.**

Sam: "This should have a 'Back to Soho' option so you don't have to loop loads."
In the middle Pillars phase the pub is shut and `[[Seek the shore]]` was the only
thing on the page, so walking to the Pillars meant crossing to Carthage whether
you wanted to or not — and `Maritime interlude` is tagged `dream`, so it carries
no header exit either. `[[Back to Soho|Dean Street]]` now sits outside both
`(if:)` hooks, so it is there in every phase. Verified: phase 1 offers
"Yes" / "Back to Soho", and the link lands on the hub with no errors.

---

## Addendum 91 — straight to the column, and a reminder about the page (2026-09-14)

**1. Walking into the Pillars with everything takes you straight through.** Sam:
"when you return to the pillars and have everything you need for a dream quest,
it should immediately go to the third pillar screen when you walk in off the
map." `Entering The Pillars of Hercules` now does
`(go-to: "Third Pillar Portal")` when the tip-off, a pocket key and an unused
crossing are all in hand.

**The guard is the important part.** The portal's three turn-backs link straight
back to the pub, so an unguarded redirect would have thrown the player between
the two passages for ever. Those turn-backs are now
`(link: "Back to the Pillars")[(set: $pillarsNoAuto to true)(go-to: …)]`, and the
pub skips the redirect when that flag is set, clearing it immediately after.
Verified live: with tip-off + lighter, the hub → storm → approach → **column**
with "Step through" and no pub in between; then "Back to the Pillars" lands on
`venue-pillars` and is **still there three seconds later**.

**2. A reminder that Inis is waiting.** The page-found box already says "Return
it to Inis O'Flatterly in Cecil Court", but only once, at the moment you take it
in Carthage. A hint slip now fires on the street, once, while `$hasMissingPage`
is true and `$returnedPage` is false. The violet Cecil Court thread lights at the
same time, so the words and the road agree.

**3. DBG Complete now reaches the portal it claims to unlock.** It set 41 flags
but neither `$inisToldOfPillars` nor any pocket key, so "Complete all" could not
actually test a crossing. It now grants the tip-off and the brass lighter.

**A mistake worth recording.** I first inserted those grants by anchoring on the
first `(set: $returnedPage to true)` in the file — which is in **O'Flatterly's
Gift**, a story passage, not `DBG Complete`. That shipped a free lighter to every
player at the moment Inis hands over the liver, overwriting whatever key they
were carrying. Caught by checking which passage the line had landed in, reverted,
and redone by locating `DBG Complete`'s own block and appending after its last
`(set:)`. **Anchor edits by passage, never by the first match of a common
string** — several passages share these lines.

## Addendum 92 — the five dream worlds get their renders (2026-09-14)

**The renders were never missing.** They were built on 2026-09-12 in a 90-minute
autonomous run whose brief said, in Sam's own words, *"do not edit the .twee…
These are standalone render prototypes for me to review."* So they were written
as five self-contained HTML files and left in the project root, reviewed, tweaked
(the Chebar boulder, the foreground haze, the exaggerated movement), committed as
`Renderings` / `New render` — and never wired into the game. That is why the
Airport Pub passage had a `.airport-pub-scene` div with nothing behind it.

The prototypes, all still rendering:

- `airport-pub-3d-static.html` — The Enlightenment
- `nazca-approach-3d-static.html` — dusk coast road
- `easter-island-shore-3d-static.html` — moonlit basalt
- `pyramid-mouth-3d-static.html` — the lit mouth
- `plain-of-chebar-3d-static.html` — the bleached plain

**What was done.** All five ported into the UserScript on the venue pattern
(`XX-container` sentinel / `XX-wrap` overlay / `_dssBindScene` / `_dssDisposeWrap`),
prefixes `ap` / `nz` / `ei` / `py` / `pc`. The port was scripted, not hand-edited
(`scratchpad/port_worlds.py`), so every scene got the same six transformations:
canvas into the overlay, the prototype's own resize listener dropped in favour of
the one `_dssBindScene` can remove again, the tooltip re-homed inside the wrap,
pointer handlers bound to the wrap so they die with it, the `alert()` stub
replaced by the enter action, and the rAF loop made cancellable and gated on the
active flag.

**Difference from the venue scenes:** these dismiss *in place* rather than
clicking a `·` link to a separate passage. Each world is entered exactly once,
from the Third Pillar Portal (`(display: "Spend Held Key")(go-to: …)`), so there
was no approach passage to add and no inbound links to rewire. The overlay fades
over 1.6s and the passage prose is underneath. The sentinel div stays in the DOM
after dismissal, which is what stops the 300ms poll re-firing the scene.

Buttons: ENTER THE ENLIGHTENMENT / STEP DOWN FROM THE BUS / WADE ASHORE /
CLIMB TO THE MOUTH / WALK OUT ONTO THE PLAIN.

Chebar is the one light-ground scene, so its chrome is dark ink with a pale
backing panel on the button; at the prototype's original alphas the label was
illegible against the cracked plates.

**Verified** on all five: scene appears, animates, button dismisses, wrap removed,
`_dssThreeRegistry` empty, zero orphan canvases (WebGL context released), passage
prose revealed underneath.

**Left to do.** The prototypes' brief deliberately excluded the narrative props —
the man with the orange paperback, the napkin, the bootprint and the spent
cartridge, the guide at the foot of the pyramid, the prophet on his stone and the
woman with her books. Those were always a later pass. The five .twee scenes are
the place to add them now, not the standalone files, which are frozen references.

Synced, commit when ready.

## Addendum 93 — where the key rests, and 238 lines of dead code (2026-09-14)

**1. A slip saying where a swapped-out key went.** Sam: "Do the key-resting
slip." When you swap pocket keys, the old one rests at whichever of the fourteen
stash sites you were standing in, and the game never said which. The drop prose
already claims "It will keep. You know where it is", but the player had no way to.
`Key Drop Here` now fires a hint slip naming the place: *"The brass lighter stays
in Meard Street."* for the nine alleys, *"The brass lighter stays in the bin
outside the French."* for the five bins.

Two details that matter. The name is captured **before** the ladder clears
`$dreamKey`, or the slip would have nothing to name. And the place comes from
`_here`, the real site, **not** `_dest`: a raided bin still reads as the bin,
because the raid is meant to be discovered when you come back for it, not
announced on the way out.

Verified live on both shapes: alley (Meard Street) and bin (the French), correct
string, zero Harlowe errors, slip types and holds its eight seconds.

**2. The dead code from the 2026-09-13 popup demotions, removed.** 238 lines:

- `showWordToTheWise`, the old full-screen "A WORD TO THE WISE" overlay, with no
  callers since the venue hint became a slip. Its `#word-wise-overlay` /
  `.word-wise-*` CSS and four `@keyframes` went with it.
- The standalone haunts explainer IIFE and `window.dssShowHauntsModal`, orphaned
  when the haunts primer merged into the night's stats card. Its `.dss-haunts-text`
  and `.dss-haunts-note` rules went too. **`.dss-haunts-card` stays**: the live
  primer still wears it, alongside `dss-rules-card dss-stats-card`.

`wordToTheWisePopup` is NOT dead and was left alone. It is the live one, and it
routes to `dssInlineHint`, which is how every nudge reaches the paper slip.

**3. A real bug found while clearing it.** The glass smash on "He drops it; it
smashes" waited on a `hauntsmodal:closed` event and checked for a
`#dss-haunts-overlay` element. Both belonged to the modal that merged away on the
13th, so since then nothing has dispatched that event and nothing has created that
element. The listener was unreachable and the guard could never be true, which
meant the smash was landing on top of the primer on a first haunt, exactly what
the comment there says it must not do. It now waits on the primer's own
`#dss-stats-overlay` and **retries** rather than giving up, so the smash can be
delayed by the primer but never lost.

**Still open, if you want it.** The night's primer is the last purely
informational modal that could become a slip. Not done, because it is two subjects
in one card and it wears the gold Art Nouveau shell, which is the reveal
aesthetic. Your call.

Synced, commit when ready.

## Addendum 94 — the primer moves to paper (2026-09-14)

Sam: "Do the primer as a slip too. But it needs to hang about long enough to be
read." The night's primer, MORALE, SOBRIETY & HAUNTS, was the last purely
informational modal. It is now one long paper slip. **His six paragraphs were
lifted out of the old modal's array programmatically rather than retyped, so
every sentence is verbatim and in his order**, with his own title as the first
line.

**The slip engine now has two lengths.** Anything over 400 characters gets a
`long` class and three different behaviours. The one-line nudges are untouched by
all of it, which was the constraint worth engineering around:

- **Typing is bounded.** `pace = min(25, 2600 / length)`. The primer is 768
  characters, which at the nudge pace would have crawled for twenty seconds; it
  now types in about four and a half. At 40 characters the pace is still 25, and
  the jitter is still `17 + random*16`, so a short hint is unchanged to the
  millisecond.
- **The hold is a reading time**, `length * 55ms + 2600`, floored at the original
  8000 and capped at 45s. The primer sits for the full 45 seconds. Short nudges
  hit the floor and keep exactly their old eight.
- **A long slip can be clicked away** once read. Short ones stay
  `pointer-events: none` so they cannot swallow a click meant for a link
  underneath, which is why this is gated on length rather than applied to all.

Also: the typewriter tick is throttled by elapsed time (45ms) rather than every
second letter, or the primer's pace would have fired 170 ticks a second;
`.dss-hint-type` takes `white-space: pre-wrap` so the paragraph breaks survive;
the long card follows its own caret down when it has to scroll; and on a phone it
takes the full width instead of sitting inset with a dead gutter.

**Consequences handled.** The glass smash's wait is gone. It existed only because
the primer used to be a full-screen modal the smash would have gone off behind;
a slip blocks nothing, so there is nothing left to wait for. And with the modal
gone, `.dss-modal-x`, `.dss-stats-text` and `.dss-haunts-card` lost their last
users: 34 more lines of CSS removed. `.dss-rules-card` stays, the minigame rules
modal still wears it.

Verified live: 768 characters typed, paragraph breaks intact, still on screen well
past the old eight seconds, dismissed on click with the queue left clean, short
nudges unchanged in pace and still click-through, and the whole thing fitting at
375px. Zero Harlowe errors.

That is every informational modal now on paper. What is left in a box all needs an
answer from the player or is an illustrated reveal.

Synced, commit when ready.

## Addendum 95 — birds, a green quest, and a shorter way out of the pyre (2026-09-14)

**1. The birds now wait for the last phase.** Sam: "The birds start chirping much
too early. No chirping till the final part of the night then much more as you
approach the end." The level came off `__dssNightDepth`, which is `phase / 3`, so
After midnight already carried a bird every sixteen seconds and the Small hours
were most of the way to a chorus. It is silent now until **Dawn awaits**, which is
the phase the header itself calls the end of the night.

The phase is read off the header's `.night-phase[data-night-phase]` rather than
`__dssNightDepth`, because that window value only updates while the Soho map is
being drawn; the old value stays as the fallback. The last phase opens at level
0.35, about one far bird every twelve seconds, and the existing dawn boosts take
it from there: 0.55 Towards Dawn, 0.85 at either Dawn Approach, 1.0 at the Dawn.

Measured on the hub with the outdoor gate satisfied: **0 chirps in 22s at After
midnight, 5 in 32s at Dawn awaits, 55 in 8s at the dawn boost.** Nothing, then
occasional, then a sky full of them.

**2. The quest is green, and has its own call.** Sam: "Make the quest a different
colour so it's really obvious that you have got it. Maybe add a sound too. It's
important." Everything the night hands you was gold or amber, quests included,
so a quest read as one more item popup. The quest card is now **absinthe green**:
card ground, border, outline, glow, the QUEST label, the title, the button and its
hover, and the motes that rise off an accepted quest, which were filed under
"QUEST MOTES (brass-gold)" and are now green with the rest. Green was the one
colour the palette had not already spent. Gold is general, silver-blue is items,
blue-lavender is revelations, orange-ember is page 93, violet and blue are the two
pavement threads.

It also had no sound of its own, only the `pageRustle` that every other popup
uses. New `questCall()` in `dssAudio`: three struck notes rising a fifth then an
octave, each with a hollow twelfth over it, and a band of air opening behind.
Verified it builds 6 oscillators and 1 noise source.

**3. The pyre goes straight to the wake.** Sam: "After you find page 93 in the
pyre it should go straight to the wake option, without having to go through the
Carthage hub again." `Rescue the page` linked back to `Carthage shore`, which at
that exact moment offers **one** link and nothing else: with the page in hand and
`$visitedPyre` true, the Green Sea branch needs `$returnedPage` (a later night)
and the pyre branch is spent. So the shore was a click to reach a single link.
That link is now on the page itself. Verified: one link out, landing in
`The Interval`.

**A note on method.** A `javascript_tool` call timed out mid-measurement with an
`AudioContext.prototype` patch still installed. That is the failure that once made
working audio look broken by stacking patches until the call stack blew. Cleared
it by reloading the page, confirmed the prototype was native again before
re-instrumenting, kept the counter on `window` so each probe could be short, and
restored it at the end. **Check the prototype is native before patching it.**

Synced, commit when ready.

## Addendum 96 — the prose comes before the street (2026-09-14)

Sam: "you don't pay any attention to the prose if the walkable map is above it."

**It was worse than not paying attention.** Measured on an 837px viewport, the
map ran 552 to 1026 and the night's prose began at **1137**. On arriving at the
hub the writing was not merely out-competed by the map, it was entirely below the
fold. Nobody was ignoring it; nobody could see it.

**The map now sits below the prose** on Dean Street. Door discovery is unaffected:
`scanHub()` reads every `tw-link` in the passage wherever the container sits.
Prose now lands at 629 to 752, fully visible on arrival.

**Two things fell out of the measuring, both worth having on their own.**

*Four blank lines on every page in the game.* The `[header]` passage had
unsuppressed newlines before its `.stat-bars` div: a three-line HTML comment and
two macro lines with no trailing backslashes. Harlowe turns each of those
newlines into a `<br>`, and because the passage is tagged `[header]` it prepends
to **every passage**, so every page in the game opened with ~88px of nothing.
Suppressed.

*The header clearance was an accident.* Removing those four breaks dropped the
title underneath the fixed stat bar, which exposed the real problem:
`tw-passage` had a hard-coded `padding: 92px`, the passage box starts at 52, and
the bar is 165 tall. Content had been starting at 144, **21px under the bar**,
and the only reason nothing overlapped was the stray breaks. It is now measured:

```
tw-story:has(#stat-bars-lifted) tw-passage {
  padding-top: calc(var(--dss-header-h, 148px) + 28px);
}
```

Hung off `tw-story` because the bar is lifted out of the passage, and tracking
the measured height because the bar wraps to two rows at some widths. Passages in
`_hideStats` render no bar, do not match the selector, and keep the plain 92px.
Verified on both: Title 92px and no bar, the Pillars 193px and clear of it.

Also removed two stray breaks between the prose and the map, and moved the one
that separates the Ginger Light corner beat **inside** its own hook, so it prints
only when that beat does rather than on every hub visit for ever.

**The trade-off, which is Sam's call.** The map now begins at 842 on an 837px
viewport, so it takes one scroll. The two cannot both fit: the map is sized
`100svh - 200px` at a 26:29 aspect, and with the prose above it there is no
reserve that leaves it usable. Three ways out if the scroll annoys:

1. Leave it. Read, then scroll to the street.
2. On return visits, drop the two intro paragraphs rather than dimming them. They
   are already dimmed to 60% as "you have read this", so hiding them once read is
   the same decision carried one step further, and the map rises by ~180px.
3. Shrink the map.

Synced, commit when ready.

## Addendum 97 — the intro is a first-visit thing now (2026-09-14)

Sam picked option 2 from Addendum 96: hide the Dean Street intro on return
visits rather than dimming it.

The two paragraphs now render only when `$returns <= 1`, which is exactly the
condition that used to leave them undimmed. The `(enchant: ?deanIntro, ...)` that
greyed them to 60% from the second visit on is gone, having nothing left to grey.
**His prose was moved programmatically, not retyped, and verified byte-identical
(263 chars) against the pre-edit file.** The blank line that followed the hook is
inside the conditional now, or it would have printed a gap above the bag line on
every visit after the first.

**Measured, on an 837px viewport:**

| | map top | map visible |
|---|---|---|
| first visit (intro shown) | 777 | 60px |
| return visit (intro hidden) | 632 | 205px |

So the street is properly in view from the second visit on, which is every visit
that matters. The first visit still reads exactly as written, with the map
peeking 60px as a cue that there is something below.

Door scanning is unaffected by the container's new position: on the return visit
the map found both doors that exist in that state, The Ginger Light and Centre
Point.

**Two notes for whoever is next.**

*I made the same mistake I had just finished fixing.* The comment documenting
this change went in as seven lines, which in Harlowe is seven `<br>`s in the hub.
Collapsed to one line. **Any HTML comment in a passage body must be a single
line** unless every line ends in a backslash. Three separate multi-line comments
have now been found doing this (the header back-fill, the Dean Street A2 note,
and my own), so it is worth a sweep at some point.

*A pre-existing typo, not touched.* `:: Start` ends
`(set: $liverReturnTo to "Dean Street")\\` with **two** backslashes. The first is
the line-continuation, the second renders as a literal backslash on screen. It is
invisible in practice because `Start` immediately `(go-to:)`s to The Night Ahead,
but it is a typo and one character fixes it. Left alone because it is outside
what was asked for.

*On measuring this kind of thing:* `getBoundingClientRect()` on the hub gives
nonsense while Harlowe's dissolve is still running, and in the preview pane that
transition stalls indefinitely because rAF is throttled. Two readings during this
work looked like catastrophic regressions (a map at 943, then at 2024) and both
were the un-settled transition, once with the outgoing passage still in the DOM.
Use `offsetTop`, or force the transition to completion first, and sanity-check
any number against a screenshot before believing it.

Synced, commit when ready.

## Addendum 98 — why the third pillar always turned him back (2026-09-14)

Sam: "I can never walk through the third pillar into the dream." My first answer
blamed the Inis chain. **That was wrong** — he had returned the page, and the
chain is sound: verified live that `O'Flatterly's Gift` fires the tip-off, that
the key popup at the French hands over the brass lighter and the header pocket
cell fills, and that `O'Flatterly's Gift`'s brackets close correctly (line 24
carries the third `]`, so the tip-off is NOT nested inside the haunt-6 block).

**The cause is the lifetime worlds list.** `Third Pillar Portal` turns you back
for any world already in it:

```js
if (lifetime.indexOf(chosen) >= 0) { turnBack(seenEl); return; }
```

That list lives in `localStorage` under `dssWorldsSeenCycle` and, until now,
**nothing cleared it**. "Play again" removes only keys matching `/Saved Game/`,
and so does the debug autosave wipe. So it accumulates across every playthrough
on that browser and only empties when it reaches five.

After days of testing, the worlds Sam has already walked are banked, and each one
closes its key **for good**. The brass lighter at the French is the easiest key in
the game to pick up and it maps to `himalayas`, almost certainly the first world
he ever walked, so the likeliest loop is: take the lighter, walk into the Pillars,
get sent straight to the column, and be turned back every single time with *"You
have been down this one."* Which reads exactly like a broken pillar.

This is the rule he asked for on the lifetime axis ("you didn't complete all in a
night... variation in replays"). It is not a code bug. It is a trap with no way
out, because there was no reset.

**Added:** a Crossings readout and its own wipe in the debug panel (backtick),
next to the autosave wipe.

- `Worlds walked (lifetime): himalayas, nazca` — so the state is visible at last.
- `⌫ Reopen all five worlds (clear lifetime list)` — names what it will clear,
  leaves the night in progress alone, and **keeps the Synthesis gifts**
  (`dssLifetimeGifts` is a separate key and must never be cleared with it, or the
  earned ending is lost).

Verified: readout shows a seeded list, the wipe empties it, `dssLoadLifetimeWorlds()`
returns `[]` afterwards.

**Worth a decision.** For a real player the same thing happens more slowly: finish
a world, and that key is dead until all five are done, with a turn-back that does
not say which key would work. Three options, none taken:

1. Leave it. The player is meant to work out that a different key means a
   different world.
2. Have the turn-back name a key that is still live, or say where one is.
3. Have the Pillars itself refuse the crossing before you walk in, so you are not
   sent to the column only to be turned round at it.

Synced, commit when ready.

## Addendum 99 — the line is cut: a key opens its world, every time (2026-09-14)

Sam, on being shown the lifetime rule: "I don't get why it's complicated though:
you have a key, you have given page 93, the pillar is open to the dream world that
matches the key?" Then: "Cut the line."

**Cut.** `Third Pillar Portal` no longer turns you back for a world walked on an
earlier night. One line and its comment:

```js
if (lifetime.indexOf(chosen) >= 0) { turnBack(seenEl); return; }
```

The rule bought replay variety and cost far more than it bought. The brass
lighter is the easiest key in the game to reach and it maps to `himalayas`, so
after a few nights the commonest thing a player could do was carry a spent key to
a column that turned them round, with no readout and no reset to tell them why.

**What the crossing is now**, which is exactly what he described:

- A key in the pocket and page 93 returned to Inis opens that key's world.
- One crossing a night, so you still cannot see everything in one go.
- The eye still waits until the other four are walked. `finalReady` is untouched:
  Ezekiel being last is a real idea, not bookkeeping, and it is the one part of
  the lifetime list that still gates anything.
- The Synthesis is untouched. It counts `dssLifetimeGifts`, a separate key that
  never resets.

The lifetime list is still written and still read, for `finalReady` and for the
cycle reset in `dssMarkWorldSeen()` which empties it at five so the eye goes last
again next cycle. It just no longer closes doors.

**Verified live end to end** on the state that used to fail: lifetime seeded with
`["himalayas","nazca"]`, brass lighter in the pocket, hub → The Pillars → Yes →
into the pub → straight to the column. No turn-back; the steer text and "Step
through" both present; stepping through landed in the Airport Pub with The
Enlightenment rendering and the key spent. Zero errors.

The Crossings readout and its wipe from Addendum 98 stay. They are still the way
to see what is banked, and the wipe is still the way to put Ezekiel back behind
the other four for testing.

Synced, commit when ready.
## CURRENT RULES — Codex fixes, 2026-09-15

Sam explicitly approved multiple DIFFERENT unfinished dream worlds in the same night. This supersedes Addenda 84 and 99 and the earlier verification report's assumption that one crossing per night was intended. Page 93 still unlocks the pillar; the key chooses the world; COMPLETING a world earns its permanent gift and closes that world across future nights. Entering alone does not count. Ezekiel still requires the other four gifts; all five unlock the synthesis. Never reinstate the one-crossing cap or reset completion at five.

Implemented and synced: permanent gifts drive a new Dream Progress system passage, displayed before each passage by the header. It restores dream knowledge across nights, suppresses completed worlds' keys, and makes an unfinished spent key available again when returning to Dean Street. Relevant venues stay accessible while a useful seed key remains; Pillars stays reachable for synthesis after all five. Old per-night completed-world arrays migrate into permanent gifts. The obsolete debug button promising to reopen worlds by clearing only the cycle list was removed.

Also fixed the three outstanding route issues: Red/Inis/critic/Lackland reopen for unacknowledged dream discoveries (including the critic's Maritime interlude approach); recovery above zero clears the collapse funnel on returning to Dean Street; the French offers an unfinished sketch again. Sketch strokes live in the save-compatible napkinDraft string, survive leaving and returning, and clear on completion/new night. Ordinary recognition flags still prevent repeatedly awarding the same recognition during a night.

Validation: 18 original regression fixtures; 12 new dream/access fixtures; drawing, gift-boundary and actual replay checks; normal fresh opening. No Harlowe or JavaScript errors in tested scenarios. Second different dream entered that night; early eye blocked and eye after four admitted; page quest enforced; completed key absent; incomplete spent key restored; all-five synthesis link visible; all four recognition routes reached from hub. Drawing strokes survived leaving and enabled Done on return; finishing reached Give him the painting. Entering The Glyph awarded nothing until Pocket the rubbing; all five gifts and legacy completion records survived Play again. Static check: 230 source headers, 122 executable script blocks parse, 302 literal links resolve, no duplicate passage names. Build: 226 playable/system passages synced. No git commands run.

Evidence and test scripts: scratchpad/agreed-mechanics-fixes-2026-09-15/. The two obsolete timing sentences were retired in HTML comments, preserving their wording in source; no replacement creative prose was written. Harlowe's documented script variable access is used for the persistent progress and sketch bridge, not private engine APIs (https://twine2.neocities.org/#markup_script).

---
## Dawn petal improvement — 2026-09-15

Sam asked to improve the final Dawn petal flood while keeping the work focused. Replaced 1,600 glowing oval DOM particles and many independent timers with one bounded canvas. Three painted, irregular pearl-white petal silhouettes have shaded folds, translucent edges and veins; depth-dependent sizes/speeds, shared thermal drift and edge-on tumbling give the flood movement and depth. It builds for eight seconds, floods until 22 seconds, then recedes to a sparse drift. THE END and the piano's natural finish remain. No story prose changed.

Lifecycle is tied to the actual Dawn trigger: one storm per passage, cancels when leaving, pauses when the tab is hidden, resizes for mobile and limits pixel density. Reduced-motion preference gets a still scattered-petal composition. Desktop flood/recession and mobile reduced-motion screenshots inspected; verified one canvas and one ending overlay, removal on leaving, and no Harlowe/JS errors. All 122 executable script blocks parse; all 302 literal links resolve. Source and HTML synced. Evidence: scratchpad/dawn-petals-2026-09-15/. No git commands run.

## Himalayas climb — 3D pass 1 (2026-09-16)

Replaced The Climb's 2D canvas game with a vendored three.js r128 scene: a winding rising snow shelf, three leapable gaps, two raised ledges, close rear camera, climber and uncatchable leading yeti, nine-print fading blue trail, four prayer-flag checkpoints, altitude-dependent breath and Down/S chanting. Up/W walks uphill, Left/Right or A/D moves across the shelf, Space jumps (touch has separate Walk and Jump buttons). Fixed-step physics keeps 120ms coyote time, 150ms jump buffer and variable jump height; empty breath slows walking without weakening jumps. Falling costs one slip and returns to the last flag. Wordless turn/look/entrance at the cave, exact slips <= 3 AND prints >= 10 rule, existing win/lose links, dev skip/E, wind/hum, mute, loreUnravel, pause/expand and reduced-motion handling retained. A fresh climb clears the bonus boolean so a previous win cannot leak into a later loss. All claude-draft blocks and The Mountain/The Cave are byte-identical. Only source .twee changed, plus this requested note and generated sync output. No git commands.

Real Chrome/Playwright validation: Mountain → Climb → Cave, full unwarped climb cleared all five jumps with 98 prints/one deliberate slip; first flag respawn and chanting verified. Winning and losing links yield true/false respectively in The Cave, including a loss seeded from an old winning state. No tw-errors or JS errors. Phone 390px/reduced-motion, actual touch walk/jump/cancel, pause/resume, dev E/skip and cleanup verified. Separate browser fixtures verified coyote take-off after leaving an edge, buffered jump before landing, and a full gap jump at zero breath. Geometry/material disposal, audio shutdown, listeners/observer removal and RAF cancellation live in window._hcCleanup. Rendering uses ~40–56 draw calls, a 1.5 pixel-ratio cap, instanced peaks/flags and no shadow maps. Source synced with python3 sync_html.py.

Evidence and browser scripts: /tmp/dss-climb-pass1/ (results.json, physics-results.json, full-test.cjs, physics-test.cjs; tests seed Harlowe via DOMContentLoaded without reading the compiled file). Screenshots also saved in the task's visualization directory under climb-pass1/. Local server on port 8777.

STOP HERE for Sam to play pass 1. Pass 2 still needs telegraphed gusts, crumbling cornices, the couloir collapse/jump set-piece, snowfall/flurries, bloom/film grade and night becoming dawn. Current scenery and characters deliberately use simple shapes/materials. The approved design comment above The Climb is unchanged.

### Pass 1 refinement — faster, kinder gaps, rounder scenery (2026-09-16)
Sam found the climb too slow, gaps too punishing and visuals too blocky. Walking/air speed is now 8.4 rather than 4.8 (+75%), lateral movement 4.6 rather than 3.6. Gaps narrowed to 1.25/1.5/1.25 units; walking stops at their lips, Space crosses, and side falls remain real. Coyote time 200ms, jump buffer 220ms. Browser checks confirmed all three walking edge stops and 65ms jump taps crossing each without a slip. Full natural playthrough finished with 95 prints and one deliberate checkpoint fall; both Cave boolean outcomes, chanting, pause, mobile touch/reduced motion and cleanup passed, no tw-errors/JS errors. A timing-independent buffered-landing check passed too.
Characters now use smooth rounded bodies, jointed limbs/boots, a shaped backpack and small instanced yeti fur. Terrain uses weathered rounded ridges, shared smooth skirt normals and snow shoulders; boulders form the cave arch. Still lightweight (roughly 60–76 draws), no new dependencies/post stack/shadows. Everything outside The Climb in the .twee and every creative block verified unchanged. Synced. Still pass 1; weather, cornices, couloir, grade/bloom and dawn await pass 2. Evidence: /tmp/dss-climb-pass1/refinement-results.json and the existing full-test/results files. No git commands.

### Raised-ledge collision fix (2026-09-16)
Sam reported jumping up a level being counted as slipping through a gap. Reproduced in a deterministic browser comparison: 48/60 combinations of early/late take-off and jump-hold duration produced false slips in the old physics, versus 0/60 after the fix (both raised ledges). Landing now sweeps foot height relative to the terrain at the old and new positions, rather than requiring negative vertical velocity against only the destination height. An uphill floor can meet a still-rising foot near the apex. Solid step faces are resolved before landing, without the old 0.1-unit penetration tolerance; insufficient height stays on the lower side and lands there safely. Full route reached the cave with 97 prints and one intentional side fall. No prose or other passages changed. Synced; no git. Reproduction and results: /tmp/dss-climb-pass1/ledge-regression.cjs and ledge-regression.json.

## Extended 3D Himalayas and Claude continuation handoff — 2026-09-16
Sam explicitly clarified “make it much longer.” Route length 148 → 440, preserving fast movement and the corrected relative-surface landing collision. Added two ladder climbs (hold Up/W), a timber/rope bridge with rail assistance, extra ledges/gaps/eleven flag checkpoints, a crumbling cornice and a warned downhill avalanche front that must be jumped. Ordinary gap edge stops remain. Hazards reset on a one-slip checkpoint respawn. All cave positions/dev E are relative to LENGTH; win rule, exits, prose, audio/mute, touch and cleanup unchanged. Hardware instanced for mobile; final ladder/avalanche fixtures show ~60 draws.

Full browser route completed with 301 prints/one intentional side fall. Both cave outcomes, The Mountain, phone/reduced motion, touch cancellation and teardown pass with no Harlowe or JS errors. Separate final-build fixtures passed both ladders, cornice jump + collapse recovery, avalanche jump + hit recovery. Source synced. No git. Focused, self-contained handoff requested for Claude is HANDOFF_CLAUDE.md — give Claude that file first. It contains exact route/physics/hazard settings, the critical landing-fix explanation, testing recipes and remaining atmospheric pass 2 work. Evidence: /tmp/dss-climb-pass1/expansion-results.json and hazards-results.json.
Final camera check: cap look-target height at baseY+3 to keep the climber visible on steep ladders. No physics change; both ladders retested after this visual correction.

## 20u — Strangers at the edges: Helvellyn Gooch (2026-09-24, Sam's idea)

Sam did not want the Critic (or any regular) carrying the lines that echo a dream world when the player returns to Dean Street. His solution: strangers on the edges of the map, one per world, drawn only once that world is done and gone once spoken to. First one built on the polish-loop branch: **Helvellyn Gooch**, trombone, on the Charing Cross Road corner of Old Compton Street (tile c48,r26).

How it is wired (mirrors the phone box):
- `DOORS` entry `gooch` with `spot:true, event:true, stranger:true`; `drawStranger()` draws a small hatted figure on the base canvas only while the door is open; the glow pass gives strangers a warm pool like the phone box's.
- Hidden hub link in the Dean Street dock, gated on `$mantraComplete is true and $goochMet is false`; the passage `Helvellyn Gooch [outdoor]` sets `$goochMet`, +10 confidence, pink placeholder line (Sam's to write), `[[Walk on|Dean Street]]`.
- `$goochMet` initialised in StoryInit and the second-night reset. Notebook dream-echo tick for the Himalayas now follows `$goochMet`.
- The Critic is unhooked: the jump to "The Critic Hears the Mantra" is removed from "Talk to the critic", and the two Pillars gates that re-opened the pub for the mantra (`Entering The Pillars` prose branch, `Approach The Pillars` Yes link) no longer test the mantra. The Critic passage stays in the file unused. The `dss-dream-residue` line in the critic's room (the ☸ glyph) is untouched: ask Sam if that counts as an echo too.
- Test: `scratchpad/strangers-2026-09-24/gooch_test.py` walks onto the corner, into the passage and back; shots in project files `strangers/`.

Next: four more strangers for the other worlds; Sam will name them. Corners left: Wardour/Old Compton, Wardour/Bateman, Oxford Street at Dean, Shaftesbury at Frith. Each needs the same five pieces plus unhooking that world's recognises scene (Red c. 45302, Inis 46176, Lackland 48118, Benito 50368) and its notebook echo variable.
