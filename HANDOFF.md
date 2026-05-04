# Dream Street Shuffle — Session Handoff
Date: 2026-05-04
Focus next session: **fix the map-pentangle reveal** (the visual isn't working — investigate first thing).

---

## What this session did

A long session focused on the atmosphere-beats prose pass, a polish-pass audit, and the start of the esoteric layer (item #1: the lily pentangle).

### Atmosphere beats — wired and prose drafted

Four bespoke breath passages, all written by Dr Quill, all live:

- **`After the painter`** — fires after `Give him the painting`, before Dean Street. Removed the bail link from `The Painter's Gaze` so the only way out of the Painter sequence is to sketch him.
- **`After the music`** — fires after `The Set`, before Dean Street. Removed the guided Pillars link from `The Set`. `Bar Canvas Lose` now also routes to `The Set` and sets `$completedSetlist` (so win/lose minigame outcomes match — only flavour-text and stat deltas differ).
- **`After Cecil Court`** — fires after `O'Flatterly's Gift` (return-the-page exit only), before Dean Street. The first Cecil Court exit (post-quest-acceptance) stays bare.
- **`After the call`** — fires on the next Dean Street arrival after `Lily phone call 1`, gated by `$pendingLilyBreath` flag. Memory-framing prose ("You remember that Lily rang…").

### Cow ride and LINE 3 — unified

- `Cow ride fail` now routes to `LINE 3` via "Look up." link (was Dean Street). Player gets alba 3 whether or not they ride the beast successfully.
- `Cow ride success` had its bail link removed (only "Listen" → LINE 3 now).
- LINE 3 still branches on `($alba contains $alba1) and ($alba contains $alba2)` — full alba complete → Centre Point chain; otherwise → Dean Street with "still lines hidden in the night."

### Centre Point hint — first-return cleanup

Removed the `_albaCount is 1` branch from Dean Street. The `[TWO MORE LINES OF THE ALBA]` greyed Centre Point no longer appears on the first return. The `[ONE MORE LINE OF THE ALBA]` branch (count = 2) survives.

### Polish-pass audit — 9 items fixed

Spawned a thorough readthrough, then worked the list:

1. **Lily breath collision** — `After the painter`, `After the music`, `After Cecil Court` now silently consume `$pendingLilyBreath` so the next-Dean-arrival redirect doesn't fire on top of a venue beat. No more two-breath stacks.
2. **Venue-intro replay after Lily call** — added `$resumingFromCall` flag, set in `Lily phone call 1`, consumed in Coach gents / Pillars entry / Ronnie's intros. On the post-call return, the unconditional stat changes (-9 sob, -9 sob/+12 conf, +6 conf) and intro prose are skipped.
3. **Trisha's dead code** — stripped the unreachable post-Shana branches (lines that printed "nothing more to do here" and the orphan Ronnie's link).
4. **Persistent `← Dean Street` venue back-button** — Dr Quill's call: deleted entirely (5 instances + dead CSS). Subsumes the Lackland's-Office triple-exit issue.
5. **Typos** — `you press your heels` (After the call), `an empty table` (The Spanish Artist).
6. **Lily phone-call first-arrival timing** — Pillars / Ronnie's / French triggers now gated on `$visited's <Venue> is true`, matching Colony's existing pattern. Lily can only ring on the second visit onwards. Coach gents trigger left as-is (the disaster IS the right moment for an interruption).
7. **Hub badges** — empty badges (◇ ✧ ○ △) hidden until `$hauntExplained is true`. First-time player gets a clean menu; once they have a haunt, the schema reveals.
8. **Maritime → Pillars** — re-read the actual flow and concluded it's fine as-is. Skipped.
9. **The Beast haunt-opens line** — reworded to acknowledge the player may already have the word from Davy Merkin.

### Esoteric layer — six creative additions agreed

Long discussion landed on six planned deepenings. Saved to memory at `~/.claude/projects/.../memory/project_esoteric_layer.md` so future sessions don't have to re-derive them. The bank:

1. **Five lilies = pentacle** — *partially built this session, see below*
2. **Eight haunts = I Ching trigrams** — procedural hexagram in notebook
3. **Page 47** — plant additional 47s (bus, clock, address)
4. **Tarot spread at Trisha's** — real Smith-Waite three-card spread, state-determined
5. **Book title as true name** — surfaces in Shana, O'Flatterly, Lily call, Fetch
6. **Seven venues = alchemical opus** — French=Calcinatio, Coach=Solutio, Colony=Separatio, Pillars=Coniunctio, Ronnie's=Fermentatio, Cecil Court=Distillatio, Trisha's=Coagulatio

Decision: do these one at a time as Dr Quill asks. Layer #1 is the next coding task; layer #6 is the second priority (tomorrow's other strong candidate).

### Lily pentangle — partially wired, MAP REVEAL REVERTED (broken parser)

The plan: when the player collects all 5 lilies, three things happen:
- Notebook **lily tab** — the 5 lily-row glyphs slide to centre and arrange themselves into a point-up pentagram with a faint star outline, hold ~1.5s, return to row.
- Notebook **map tab** — a big gold pentagram polygon appears over the Soho map connecting the 5 venues that yielded lilies (Pillars, Coach, Ronnie's, Colony, French), with a lily-of-the-valley flower at each venue point.
- **At the moment of collection** — the notebook auto-opens to the map tab and the map animation fires.

**Status as of session close:**
- **Lily-tab pentangle: wired but untested.** Dr Quill hasn't confirmed it works visually. The lily-row glyphs in the notebook should converge → pentagram → return on the first LILLIES-tab view after gathering all 5.
- **Map-tab pentangle: REVERTED at end of session.** The big-pentagram-on-Soho-map insertion (defs filter, polygon, group of 5 lily-of-the-valley SVGs using a `_lilyGlyph` intermediate temp var) broke Harlowe's parser. Result: every passage rendered repeated `THERE ISN'T A TEMP VARIABLE NAMED _NB IN THIS PLACE` error bars across the screen. Reverted Build Notebook's `_m` chain back to the prior clean state. Dean Street loads correctly now.
- **Wiring still in place but inert:** `data-pentangle-queue` attribute on `.nb-page`, `nbSwitchTab` JS hook that toggles the trigger class, CSS `@keyframes nb-map-pent` and `nb-map-pent-lilies`, `dssRevealPentangleOnMap` JS function. None of it does anything visually because there's no map SVG element to target. None of it errors.
- **Debug menu Tools section in place:** "⛤ Set 5 lilies + reveal pentangle on map" button. After revert, clicking it sets the lily flags and opens the notebook to the map tab — but no animation fires (nothing to animate).
- **Legacy screen overlay** (`dssShowPentangleOverlay`) still defined for visual debug — Dr Quill rejected it ("just a little star showing up").

**Why the revert was needed:**
The error pattern was: `_nb` reference failed throughout Dean Street, magenta error bars interleaved with every line of prose. The cause appears to be that the new map insertion's use of `(set: _lilyGlyph to "<long-string>")` followed by 5 `(set: _m to _m + "..." + _lilyGlyph + "...")` concatenations broke the silent-block scope somehow — by the time `_nb` was referenced later in Build Notebook, the temp scope had been corrupted. (Speculation — not confirmed; could also be a string-length issue or a quoting problem in the lily SVG path data.)

**The working sketch to redo tomorrow:**

Build Notebook's `_m` chain has venue pins at:
- Pillars: 490,200
- Coach: 490,295
- Ronnie's: 340,305
- Colony: 230,250
- French: 230,455

What we want to add (between the last venue pin block and the closing vignette rects):
1. `<polygon class='map-pentagram' points='490,200 230,455 230,250 490,295 340,305' fill='none' stroke='#f5d070' stroke-width='2.4' opacity='0' pointer-events='none'/>` — connects the 5 venues in star-skip-2 order.
2. A `<g class='map-pent-lilies' opacity='0' pointer-events='none'>` containing 5 lily-of-the-valley SVGs at those translate coordinates.

Lessons:
- **Inline each lily SVG directly into a `(set: _m to _m + "...")` call**, not via an intermediate temp variable. Match the existing pattern in Build Notebook (every other map element is built with direct concatenation — no `_xxx` temps used as building blocks in the SVG chain).
- **Keep each `(set:)` line short.** The existing pattern has individual `(set: _m to _m + "...")` calls per logical map element. Don't try to chain 5 venue lilies onto one variable assignment.
- **Test after each venue lily addition** by syncing and reloading Dean Street. If `_nb` errors return, the previous addition was the cause.
- **Debug menu is `` ` `` (backtick) → Tools section.** Use "Set 5 lilies + reveal pentangle on map" to reproduce conditions.
- The lily-of-the-valley SVG drafted last session is in git history if needed (look at the line numbers around the start of the session's edits in the .twee diff before revert).

**Where to look first:**
- `Dream Street Shuffle.twee:30527` — last venue pin (Ginger Light), end-of-pin section.
- `Dream Street Shuffle.twee:30528` — currently the closing vignette rects + `</svg></div>`. Insert between line 30527 and 30528.
- CSS keyframes already defined in UserStylesheet — the `nb-map-pentangle` class trigger is already wired; just need to add the SVG elements with matching class names (`.map-pentagram`, `.map-pent-lilies`).
- `dssRevealPentangleOnMap` in UserScript already opens notebook + switches to map tab + adds 'map' to the queue. Should work once the SVG elements exist.

### Other small fixes

- Sketch the Painter — added a lighter border-color for the black colour swatch (was invisible against black).
- Cecil Court breath prose — Dr Quill changed "purgatorial uterus" → "purgatorial womb".

---

## Open items for next session

### 1. Fix the map pentangle reveal (THIS SESSION'S BLOCKER)

See "Where to look next" above. Probably an hour to debug + fix.

### 2. Verify the lily-tab pentangle

Dr Quill should test the LILLIES tab animation while we're in there — confirm it works as designed (5 lilies converge, fan out into pentagram, hold, return to row).

### 3. Once lily pentangle is working — esoteric layer #6 (alchemical opus)

Three layers planned:
- **Layer 1 (whisper):** italic line in each venue's haunt-box: *"The work: Calcinatio."* etc. Cheap.
- **Layer 2 (notebook):** new THE WORK section accumulating the seven stages with glyph icons.
- **Layer 3 (dawn revelation):** at Centre Point, after alba complete, before fade — a single passage naming the seven stages and the seven venues. Operatic.

Dr Quill said: "Okay let's do this bit tomorrow." Pitch landed; he wants it.

### 4. Audio re-recording

Dr Quill plans to go to Soho and record actual venue ambience to replace the current stock audio. Out of scope for Claude — just note it's coming.

### 5. The other four esoteric items (banked)

I Ching from haunts (#2), Page 47 plant (#3), Tarot spread at Trisha's (#4), book title as true name (#5). All canonical in `memory/project_esoteric_layer.md`.

---

## Audit at session close

144 passages (was 140 at the start of the session — net +4 from the four breath passages). Spot-checked:

- All four "After X" breath passages exist with the right tags and exits.
- `Cow ride fail` link target is `LINE 3`, link text "Look up.".
- `Cow ride success` no longer has the bail link.
- `Bar Canvas Lose` routes to `The Set` and sets `$completedSetlist`.
- `Trisha's` post-Shana branches gone.
- All 5 `venue-back-btn` instances and their CSS rules removed.
- `$resumingFromCall` flag set in Lily phone call 1, consumed in Coach gents / Pillars / Ronnie's.
- `$pendingLilyBreath` consumed in After the painter / music / Cecil Court.
- Hub empty-badge spans wrapped in `(if: $hauntExplained is true)[...]` (14 hp, 3 al, 3 op, 2 pp).
- Centre Point first-return hint branch (`_albaCount is 1`) gone.
- Pentangle overlay function and reveal-on-map function defined; data-pentangle-queue logic in nbSwitchTab; debug menu Tools section in place. **The actual map render is broken.**

---

## Workflow notes (unchanged)

- **Source of truth: `Dream Street Shuffle.twee`.** Never read `Dream Street Shuffle.html` (~3 MB compiled artifact).
- After edits: `python3 sync_html.py`, then "synced, commit when ready."
- **Git stays in Dr Quill's hands** — no `git add` / `commit` / `push` from Claude.
- `HANDOFF*.md` is gitignored; safe to overwrite this file in future sessions.
- **NEW house rule (saved to memory):** always grep/read the .twee for current state before pitching design moves. Don't reason from "what I half-remember" — too many small errors compound. (`memory/feedback_reason_from_source.md`)

---

## Commit status

All changes synced to HTML. Working tree is ready to commit via GitHub Desktop. The map-pentangle bug is in the committed code — that's the first thing to fix tomorrow.
