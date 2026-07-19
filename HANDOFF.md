> **▶ NEXT SESSION — START HERE.** Loop: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** (~50 MB) — grep it. The preview and testers both cache hard: **Cmd/Ctrl+Shift+R**, and when automating, cache-bust with `?v=n` — a plain reload can serve a stale build even after a sync.
>
> **⚠ Standing gotchas:** `window.Harlowe`/`window.Engine` are `undefined` (DOM-bridge for reads, `(set:)`+`(go-to:)` result passages or JS flags for writes — memory `project_harlowe_not_exposed.md`). HTML/`<script>` render only from top-level hooks. `(after:)` never fires in backgrounded tabs — use guarded `setTimeout` (the Dawn passage shows the `_passageGen` double-defer pattern). Debug-jump half-inits (forwarders stall; the TURNS readout misreports on a raw jump — walk in via a temp passage with a real link). **Header passages render BEFORE the body**, so body-side `(set:)`s (e.g. the `$returns` increment) haven't happened at header time.
>
> **State at handoff (2026-07-18, ~03:00):** Enormous mechanics session — the game now has real jeopardy. **NOT yet committed** (the whole night = `Dream Street Shuffle.twee` + `Dream Street Shuffle.html`, commit via GitHub Desktop). Full detail below.

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
