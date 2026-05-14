# HANDOFF — 2026-05-14 (v2 expansion — first major architectural pass)

This session: v1 first draft was frozen and branched, then v2-expansion got its core architecture built out.

---

## Branch status (IMPORTANT)

- **`main`** — last v1 commit (feature-complete first draft, version stamp in StoryInit).
- **`v1-first-draft`** — frozen snapshot of v1 at the same commit. Do not commit to this branch.
- **`v2-expansion`** — *active working branch*. All v2 work below lives here.

Verify which branch is checked out in GitHub Desktop before suggesting anything structural. Dr Quill handles all commits — never run git commands.

---

## v2 architecture (LOCKED 2026-05-14)

**The big idea:** the Pillars of Hercules pub already has two broken Piranesi-style columns. A **third pillar** materialises between them — gold, whole, vertical — once **Inis O'Flatterly** has tipped the player off (in Cecil Court). Stepping through the third pillar opens onto a **dream-world drawn from Erich von Däniken's *Chariots of the Gods* (1968)**. The whole thing sits on top of v1's existing Kabbalistic Three-Pillars resonance (Mercy / Severity / Mildness — already banked in memory).

**Five worlds, mapped to the Kabbalistic columns:**

| # | World | Pillar | Register | Gift | Soho-responds |
|---|---|---|---|---|---|
| 1 | **Himalayas** | Mildness (centre) | Text | Completed mantra (12 syllables) | The critic gives an introduction |
| 2 | **Nazca lines** | Mercy (upper right) | Diagram | Tracing of the hummingbird geoglyph | Lackland opens the back room |
| 3 | **The Great Pyramid** | Mercy (lower right) | Number | A resonant proportion | Inis gives the player his own notebook |
| 4 | **Easter Island** | Severity (upper left) | Name | A Rongorongo glyph | Red gives a line he's been holding |
| 5 | **Ezekiel's Wheel** | Severity (lower left) | Vision | The wheel-within-a-wheel sketch | The dying Spanish Artist hands off his unfinished commission |

Each gift is a different *kind* of thing (text/image/number/name/vision). The book gets layered. Each Soho-responds is a *different existing character* — they all deepen.

**Tone register: HINTED.** Nazi-Tibet/Schäfer/Vril/Däniken/ancient-astronauts material reads to players who know the references but is never named. Stay inside the gold-linework / drama-then-fade grammar.

**Access model: Variant B + localStorage tracking.**
- **2 crossings per playthrough** at the third pillar (cap enforced at the Pillars venue link).
- localStorage key `dssWorldsSeenCycle` persists completed worlds across playthroughs.
- The portal's roll *excludes* both this-playthrough and lifetime-seen worlds. Cycle resets automatically after all 5 are seen, so a long-replaying player keeps getting fresh worlds.
- Roll happens entirely in JavaScript inside the Third Pillar Portal passage's `<script>`. No Harlowe internals touched. JS picks a world, finds the matching hidden Harlowe `<tw-link>`, and triggers its `.click()` — standard, stable.

**Carthage stays separate.** Maritime Interlude → Carthage westward-dream remains untouched. The Three Pillars are *vertical* / axis mundi; Maritime is *horizontal* / ne plus ultra. Two distinct dream-portal mechanisms.

**Counts NOT to touch:** 12 haunts, 5 lilies, 10 sefirot, 3 alba lines. These are v1's fixed currencies. New worlds add *new* currencies (mantra, tracing, glyph, number, vision) alongside.

**Cumulative reveal** (still to be built): when `$lifetimeWorldsSeen's length is 5`, the inverted pentangle of the five worlds interlocks with the lily pentangle to form a hexagram on the map, and an **alt-dawn ending** unlocks with a different recipient for the book. Storage flags `$sawInvertedPentangle` and `$sawHexagram` are in place; the visual reveal and dawn branch aren't built yet.

---

## What's built on v2-expansion

### State variables (StoryInit, near the bottom of the existing block)
- `$inisToldOfPillars`, `$sawThirdPillar`, `$crossedThreshold`
- `$tonightsWorld` (vestigial — JS-driven roll no longer reads it, kept for backward compat)
- `$worldsVisited` (array, per-playthrough)
- `$lifetimeWorldsSeen` (array, defensive default; actual lifetime tracking is JS-only via localStorage)
- `$mantraHalf1`, `$mantraHalf2`, `$mantraComplete`
- `$nazcaTracing`, `$easterGlyph`, `$pyramidNumber`, `$ezekielVision`
- `$critEndorsed`, `$lacklandRecognised`, `$inisRecognised`, `$redRecognised`, `$spanishArtistRecognised`

### UserScript / JS helpers
- `window.DSS_WORLDS_ALL` — canonical world identifier list
- `window.dssLoadLifetimeWorlds()` — reads `dssWorldsSeenCycle` from localStorage
- `window.dssSaveLifetimeWorlds(arr)` — writes the same key
- `window.dssMarkWorldSeen(name)` — called from each world's centre passage; appends and auto-resets cycle at 5/5

### Third pillar materialisation
- New SVG (gold, whole, centred between the two cyan broken pillars) rendered when `$inisToldOfPillars` is true, inside the **Entering The Pillars of Hercules** passage
- CSS `.pillar.centre` + `first-sight` fade-in animation
- `loreUnravel()` audio cue fires on first sight (sets `$sawThirdPillar`)
- Inis tip-off block added to **O'Flatterly's Gift** (after the Liver gift)

### Third Pillar Portal passage
- 5 hidden Harlowe links (`[[himalayas-go|Airport Pub]]` etc.) — invisible, just for `.click()` targets
- `<span id="dss-pt-visited">` holds the per-playthrough visited array for JS to read
- `<script>` does the roll and builds the visible "Step through" `<tw-link>`
- Fallback "Back to the Pillars" link rendered if pool is empty

### Five world arcs (5 passages each, plus Turn-Back for 4 of 5, plus a Return passage each)
- **Himalayas**: Airport Pub → The Road to India → Foothills → The Mountain → The Cave → Himalayan Return; Turn-Back: Himalayan Turn-Back. Centre SVG: 8-spoke mandala.
- **Nazca**: Nazca Approach → Walking the Pampa → The Ridge → The Centre — Nazca → Nazca Return; Turn-Back: Nazca Turn-Back. Centre SVG: hummingbird geoglyph.
- **Easter Island**: Easter Island Shore → Among the Moai → The Listening Moai → The Glyph → Easter Island Return; Turn-Back: Easter Island Turn-Back. Centre SVG: standing-figure Rongorongo glyph on charcoal-paper.
- **Pyramid**: Pyramid Mouth → Descending Corridor → Grand Gallery → King's Chamber → Pyramid Return; Turn-Back: Pyramid Turn-Back. Centre SVG: pyramid outline with golden-ratio spiral + 5 resonance arcs.
- **Ezekiel**: The Plain of Chebar → Storm from the North → Four Living Creatures → The Wheel → Ezekiel Return. *No Turn-Back* — by design, no escape from the vision. Centre SVG: wheel-within-a-wheel with eyes around the rims.

Each centre-passage SVG fades in with its own keyframe animation (mandalaForm, nazcaForm, easterForm, pyramidForm, ezekielForm). `loreUnravel()` plays on each reveal; Ezekiel also gets a `distantBell()`.

### Five Soho-responds branches
- **Critic** — `$mantraComplete` branches both the page-turn dialogue lines AND the aftermath of *The critic's judgement*. Gives "The critic's number" item.
- **Lackland** — `$nazcaTracing` branches *Martin Lackland's Office* before the confidence-based branches fire. Opens the back-room door without a password.
- **Inis** — `$pyramidNumber` triggers a new Dean Street link (modifies the existing Cecil Court conditional chain) → re-enters *O'Flatterly's shop*, which conditionally renders a new branch when conditions met. Gives "Inis's notebook" item.
- **Red** — `$easterGlyph` triggers a new Dean Street link "Red is under the lamp again" → new passage *Red Recognises the Name*. Gives "A line for tomorrow" item.
- **Benito (Spanish Artist)** — `$ezekielVision` triggers a new Dean Street link "Word from the French" → new passage *Benito Recognises the Wheel*. Gives "An unfinished commission" item.

### Notebook
- Five new entries in the OBJECTS section, one per world gift. Half-mantra has its own state.

### Drafted prose
- All prose written by me wraps in `<span class="claude-draft">…</span>` (or block variants). CSS renders bright pink (#ff3aa8) with a soft glow.
- Grep `.claude-draft` to find every piece of drafted prose. Rework each in your own voice; remove the wrapper when done.
- The licence to draft prose during v2 scaffolding is saved as a feedback memory (`feedback_v2_prose_draft_licence.md`) — applies *only* to v2-expansion structural work. The default "no unrequested prose" rule still holds for v1 polish.

---

## What's NOT built yet (open threads)

1. **Hexagram + alt-dawn cumulative reveal** when `$lifetimeWorldsSeen's length is 5`. Storage flags in place; visual + dawn branch unbuilt.
2. **Inverted-pentangle visualisation on the map** in Build Notebook — parallel to the lily pentangle, completing to a hexagram. Storage hooks exist; SVG not yet drawn.
3. **No Ezekiel Turn-Back passage** — intentional, but verify with Dr Quill once he plays the vision.
4. **No audio beds for the four new worlds.** They're tagged `[himalayan]`, `[nazca]`, `[easter]`, `[pyramid]`, `[ezekiel]` so ambient beds can be registered in the existing bed-tag system later (same pattern as Cecil Court / Ronnie's).
5. **No actual minigame on any test passage.** The Mountain / Walking the Pampa / Storm from the North all use simple stat costs. Real test mechanics (stat checks, click-holds, choice trees) can drop in later.

---

## Pre-branch polish work (also this session, before v2 began)

Done on `main` before the branch split:

- **Critic page-turn shuffle** — `pageShuffle()` audio (4-5 layered noise bursts at varied highpass centres + low thump for paper weight), plus the page-flip now spawns 4-5 pages per click with staggered timing and randomised flip duration. Reads as a thumb-riffle.
- **SpewPopup audio** — `startPissStream()` and `startRetchStream()` hold-driven sound controllers wired into the doorway/gents popups. Bandpass-filtered noise + LFO wobble + body-frequency for weight; retch has a brief throaty onset.
- **Inis O'Flatterly link rename** — "Which book?" → "Speak to him" ([Dream Street Shuffle.twee:30022](Dream%20Street%20Shuffle.twee:30022)).
- **French gating fix** — when all 3 art-haunts + lily 5 are done, the French now renders as a plain "Back to The French" link instead of greyed-out "[NOT NOW]". Hub-pub stays reachable.
- **Orphan passage `Watch them play` deleted** (had been unreachable; left over from an early ping-pong flow).
- **Version stamp comment** added to StoryInit marking v1 first draft milestone.
- All synced; 132 → 131 passages (orphan deletion) → then 139 (Himalayas) → 164 (full v2 build).

---

## Testing plan for Dr Quill (browser)

1. Reach **Inis O'Flatterly's Gift** (Page 93 quest)
2. Re-enter **The Pillars of Hercules** — third gold pillar should materialise with the fade-in animation; `loreUnravel()` plays
3. "Step through the third pillar" — random world rolls (one of the five)
4. Walk that world: each has 5 passages, gift reveal at the centre, dust-on-boots return
5. Re-visit the Pillars — pillar still there, second crossing offered, *different* world rolls (because `$worldsVisited` excludes the first)
6. Try a third crossing — pillar is dim; "twice across is enough"
7. Re-visit the relevant Soho character carrying the gift — they should react with the new branch
8. **Replay test:** click *Begin* fresh, do another world. localStorage means worlds completed in the previous playthrough should be excluded from rolls. Repeat across multiple playthroughs; the cycle should reset after 5/5

## Memories updated/added today

- `project_branch_status.md` (new) — v1 frozen, v2-expansion is the working branch
- `project_v2_expansion_direction.md` (new) — full v2 spec, 5 worlds, Three Pillars architecture, Variant B + tracking, cumulative reveal plan
- `feedback_v2_prose_draft_licence.md` (new) — Dr Quill's opt-in to drafted prose for v2 scaffolding, wrapped in `.claude-draft`
- `MEMORY.md` index updated

---

## Quick orientation

- **Want the lifetime-tracking to be reset for testing?** Open the browser console on the game page and run `localStorage.removeItem('dssWorldsSeenCycle')`. Reload.
- **All drafted prose wrapped in `.claude-draft`** — bright pink in browser, greppable in source. Rework freely in Dr Quill's voice; delete the wrapper when done.
- **Three Pillars memory** (`project_three_pillars.md`) is the design rationale for the column mapping. Treat the column attribution (Mercy / Severity / Mildness) as soft — the game doesn't render the column structure yet; that's a future build alongside the inverted pentangle.
