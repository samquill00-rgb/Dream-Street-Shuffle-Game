# Dream Street Shuffle — Session Handoff
Date: 2026-05-05

---

## What this session did

Two big things:

1. **Fixed the magenta-banner bug.** Root cause was a Harlowe temp-variable scoping issue at [Build Notebook line 30534](Dream Street Shuffle.twee:30534) — `_nb` was being created *inside* `(if:)/(else:)` hooks, dies when the hook ends, all subsequent references error. Fix: initialise `_nb` at outer scope first, then conditionally override. (Previous HANDOFF blamed the `_lilyGlyph` map insertion — that was wrong.)

2. **Built the lily-pentangle map reveal end-to-end.** Centre Point as the apex, four corner anchors below (Pillars, Trisha's, Lackland's, French), Coach/Ronnie's/Colony lilies nesting inside the inner pentagon. The full lily-of-the-valley glyph from the notebook (scale 1.0, all stamens/sepal-stripes/anther-dots/calyx visible). Map remembers — pentagram and flowers stay faintly visible (0.20 / 0.85 opacity) after the bright reveal animation settles.

3. **Started designing the alchemy layer.** Long discussion landed on Path B: extend from 8 haunts to 12 haunts, mapping each to Ripley's 12-stage alchemical Wheel. Four new haunts to write — prose drafts in progress.

---

## Pentagram map reveal — final state

**Reveal flow** (works):

1. Player picks up the 5th lily at any venue. The `(click-replace: ?lilyN)` handler fires `<script>setTimeout(dssRevealPentangleOnMap, 900)</script>`.
2. `dssRevealPentangleOnMap` (UserScript [line 84](Dream Street Shuffle.twee:84)) auto-opens the notebook, switches to the MAP tab, adds `'map'` to `data-pentangle-queue`.
3. The MAP svg gets the `nb-map-pentangle` class. Two CSS keyframe animations fire: `nb-map-pent` (polygon) and `nb-map-pent-lilies` (5 flowers). Bright peak → settle to faint default opacity.
4. The map remembers: `(if: $lilyCount >= 5)` block in Build Notebook always emits the polygon and lily group. Reopening the map shows them faintly without re-animating.

**Vertices and lilies:**

| Vertex | Coords | Has lily? |
|---|---|---|
| Centre Point | (280, 70) | Yes |
| Pillars | (490, 200) | Yes |
| Trisha's | (490, 450) | Yes |
| French | (230, 500) | Yes |
| Lackland's | (100, 250) | Yes |

The 3 interior venues (Coach, Ronnie's, Colony) revert to plain venue dots — only the 5 star points carry bells. Polygon points (skip-2 order): `280,70 490,450 100,250 490,200 230,500`.

**Files touched:**
- [Dream Street Shuffle.twee:30501](Dream Street Shuffle.twee:30501) — Centre Point label moved to (280,40); apex marker added at (280,70). French House venue moved to (230,500).
- [Dream Street Shuffle.twee:30528](Dream Street Shuffle.twee:30528) — `(if: $lilyCount >= 5)[...]` block: polygon + lily group via `_lilyG` temp var (works fine — the `_lilyGlyph` red herring from prior HANDOFF was unrelated).
- [Dream Street Shuffle.twee:30534](Dream Street Shuffle.twee:30534) — `_nb` scoping fix.
- [Dream Street Shuffle.twee:33188-33201](Dream Street Shuffle.twee:33188) — keyframes settle to faint instead of fading to 0.

**Lily-of-the-valley glyph:** the same multi-element design from the notebook LILLIES tab (lily-3), at scale 1.0, bell centred at venue. Strokes thickened from 0.15-0.55 → 0.4-0.9 so detail (sepal stripes, anther dots, calyx) survives the rendering.

---

## Alchemy layer — Path B in progress

**Decision:** Replace the prior "7 venues = opus" plan (memory item #6) with **12 haunts = Ripley's 12-stage Wheel**. Path B, locked in. Dr Quill's reasoning: "It can't be an approximation, I need to either add haunts or delete them so it matches the actual alchemical practice." 8 isn't canonical, 7 (drop one) sacrifices a haunt, 12 (add four) extends the bank — he chose extension.

**Mapping (8 existing + 4 new = 12, Ripley's Wheel):**

| Haunt | Stage | Status |
|---|---|---|
| The Sketch | Calcinatio | existing |
| The Refusal | Solutio | existing |
| The Beast | Putrefactio | existing |
| The Debt | Coniunctio | existing |
| The Game | Fermentatio | existing |
| The Delivery | Sublimatio | existing |
| The Head | Congelatio | existing (formerly mapped to Coagulatio — Ripley uses Congelatio for fixation) |
| The Wound | Projectio | existing |
| **The Sorting** | **Separatio** | NEW — Lackland's back room |
| **The Feeding** | **Cibatio** | NEW — Cecil Court / O'Flatterly's |
| **The Spread** | **Multiplicatio** | NEW — Trisha's / Shana's reading |
| **The Crown** | **Exaltatio** | NEW — Centre Point staircase ascent |

**Prose status:** living in [Four New Haunts.docx](Four New Haunts.docx) at the project root. Dr Quill will smash out the prose for all four himself in the next session — chat workflow, one haunt at a time, he gives the exact text, Claude edits the doc.

So far:
- Haunt 9 (The Sorting): Dr Quill provided one line — *"The backroom differs from the front in a style of difference that is not usual; neither one curdles the other, rather, they are separate already in the abstract."* That's the entire prose for haunt 9 as of now (no Claude drafts surviving).
- Haunts 10, 11, 12: placeholder text "[ awaiting Dr Quill ]" — needs Dr Quill's prose.

**Build script** for the doc lives at `/tmp/build_haunts_doc.py` — fragile (likely gone after reboot). If lost, regenerate by reading this HANDOFF + the doc itself. Doc is the source of truth. Use python-docx unpack/edit/repack pattern from the docx skill if editing the doc programmatically.

**Code work to do (after prose lands):**
- Add `$haunt9` through `$haunt12` to StoryInit.
- Add 4 new haunt-collection events:
  - **The Sorting** — wraps into Lackland's back-room entry passage
  - **The Feeding** — wraps into the existing return-Page-47 exit at Cecil Court / O'Flatterly's
  - **The Spread** — wraps into Shana's three-card-reveal moment at Trisha's
  - **The Crown** — slots into the Centre Point staircase ascent before the dawn revelation passage
- Add 4 new notebook entries in Build Notebook's HAUNTS section.
- Bump hub badge schema from 8 → 12 slots.
- Add an italic alchemy-whisper line (e.g. *"The work: Separatio."*) in each haunt-box render — for all 12 haunts. (This is the "Layer 1 whisper" pattern from the original esoteric plan.)
- Update the `$haunts's length >= 8` background trigger in header passage to handle 12 haunts (add a >= 12 tier, or rescale).

Estimate: ~2 hours of code work once the prose is in.

---

## Open items for next session

### 1. Dr Quill writes prose for haunts 10-12 (and finalises haunt 9)

Walk through one at a time in chat. Show location/trigger/stage as context, get exact text, edit doc, move on. He provided haunt 9's line; 10/11/12 still empty.

Once all four prose pieces are in, do the code work.

### 2. Dr Quill plans to "smash these out" next session

The phrasing suggests he wants to do all four in sequence quickly. Be ready to receive prose blocks rapid-fire, edit doc accordingly, then start the .twee work.

### 3. Verify the lily-tab pentangle animation

Wired but not visually confirmed in this session. The 5 lily-row glyphs in the LILLIES tab should converge to pentagram points → star outline appears → return to row, on the first LILLIES-tab view after gathering all 5. Untouched.

### 4. Audio re-recording

Out of scope for Claude — Dr Quill plans Soho field recordings.

### 5. Banked esoteric items (still TODO)

I Ching from haunts (#2), Page 47 plant (#3), Tarot at Trisha's (#4), book-title-as-true-name (#5). Memory at `~/.claude/projects/.../memory/project_esoteric_layer.md`. Note: the alchemy item (#6) is now in active progress and has been re-scoped from venues to haunts.

---

## Workflow notes (unchanged + one new)

- **Source of truth:** `Dream Street Shuffle.twee`. Never read the compiled .html (~3 MB).
- After edits: `python3 sync_html.py`, then "synced, commit when ready."
- Git stays in Dr Quill's hands.
- `HANDOFF*.md` is gitignored.
- **House rule:** always grep the .twee for current state before pitching design moves.
- **Harlowe temp-variable scoping in 3.3+ is strict** — always create `_var` at outer scope before any `(if:)/(else:)` that reads or rewrites it. Reassigning an outer `_var` from inside a hook works; *creating* one only inside hook branches doesn't.
- **For prose creation in docx workflow** (when generating new prose docs for Dr Quill): use python-docx (npm not available on this Mac). Build script in /tmp is fine for one-offs; the docx itself is the persistent artifact.

---

## Commit status

All code changes synced to HTML. Working tree:
- `Dream Street Shuffle.twee` — pentagram + Centre Point apex + lily detail + scoping fix
- `Dream Street Shuffle.html` — regenerated by sync_html.py
- `Four New Haunts.docx` — new file, prose-in-progress (gitignored? check before committing)
- `HANDOFF.md` — updated (this file)

Ready to commit via GitHub Desktop. Note: confirm whether `Four New Haunts.docx` should be committed or kept local.
