# Dream Street Shuffle — Session Handoff
Date: 2026-05-05

---

## What this session did

Fixed the magenta-banner bug (root cause was NOT the pentangle code) and rebuilt the pentangle map reveal cleanly.

### The magenta-banner bug — actual root cause

Previous HANDOFF blamed the broken `_lilyGlyph` map insertion. That was wrong on two counts:
- The `_lilyGlyph` code was *not* fully reverted in the prior commit ("pent") — it was still in the .twee.
- It was *also* not the cause of the `THERE ISN'T A TEMP VARIABLE NAMED _NB IN THIS PLACE` banners.

The real cause was a **Harlowe scoping bug** introduced in commit `c92ec03 pentangle`. That commit changed [Build Notebook line 30534](Dream Street Shuffle.twee:30534) from a simple outer-scope assignment:

```harlowe
(set: _nb to '<div class="nb-page">')
```

to a conditional that creates `_nb` *inside* `(if:)/(else:)` hooks:

```harlowe
(if: $lilyCount >= 5 and $sawPentangle is false)[(set: $sawPentangle to true)(set: _nb to '...queue...')](else:)[(set: _nb to '<div class="nb-page">')]
```

Modern Harlowe (3.3+) scopes temp variables to the hook they're created in. `_nb` set inside a hook dies when the hook ends. Subsequent `(set: _nb to _nb + ...)` lines outside the hook fail with the banner error. (The `(set: _nb to _nb + ...)` lines that *are* inside their own `(if:)` hooks update `_nb` correctly *only* because `_nb` already exists in outer scope — when it doesn't exist there, they all fail.)

**Fix:** initialise `_nb` at outer scope first, then conditionally override.

```harlowe
(set: _nb to '<div class="nb-page">')\
(if: $lilyCount >= 5 and $sawPentangle is false)[(set: $sawPentangle to true)(set: _nb to '<div class="nb-page" data-pentangle-queue="lily,map">')]\
```

Verified end-to-end in Chrome. Dean Street loads cleanly, no banners.

### Pentangle map reveal — built, tested, working

Design (option 2 from this session's pitch — "the map remembers"):

- When `$lilyCount >= 5`, Build Notebook's map SVG includes a `<polygon class='map-pentagram'>` and a `<g class='map-pent-lilies'>` containing 5 lily-of-the-valley glyphs at venue positions.
- Default opacity baked into the SVG attributes: `0.20` for the polygon, `0.55` for the lily group. So whenever the map opens, the figure is faintly present.
- On the *first* viewing after collection (gated by `$sawPentangle is false` setting `data-pentangle-queue="lily,map"`), CSS keyframes animate from invisible → bright peak (0.9 / 1.0) → settle to the same faint default. Forwards-fill holds the settled state.

**Pentagram geometry — final design:**

The five points are **Centre Point at the top apex** + four anchors underneath. Skip-2 traversal order:

```
Centre Point (280,70) → Trisha's (490,450) → Lackland's (100,250) → Pillars (490,200) → French (230,455) → Centre Point
```

- Centre Point label at top of map moved from x=490 to x=280 to sit centred above the apex.
- Lackland's (not Colony) is the western point, Trisha's (not Coach) is the eastern point — Dr Quill's calls. The vertices are geographic/symbolic anchors, not all lily-yielders.
- Coach's lily, Ronnie's lily, and Colony's lily all sit *inside* the inner pentagon — three flowers at the heart of the figure.
- The five lilies-of-the-valley remain at the five lily-yielding venues (Pillars, Coach, Ronnie's, Colony, French). Lackland's and Trisha's have no lilies on them; they're pure geometric anchors.

**Files touched:**
- [Dream Street Shuffle.twee:30501](Dream Street Shuffle.twee:30501) — Centre Point label x: 490 → 280
- [Dream Street Shuffle.twee:30528](Dream Street Shuffle.twee:30528) — new `(if: $lilyCount >= 5)[...]` block adding the polygon + lily group
- [Dream Street Shuffle.twee:30534](Dream Street Shuffle.twee:30534) — `_nb` scoping fix
- [Dream Street Shuffle.twee:33190-33201](Dream Street Shuffle.twee:33190) — keyframes settle to faint instead of fading to 0

**The lily-of-the-valley glyph used on the map:**
Stem curving up + 3 hanging cream bells of decreasing size, scaled into a ~30px-tall figure. Inlined directly via `(set: _m to _m + "...")` calls (no `_lilyGlyph` intermediate temp var — that pattern wasn't actually broken but Harlowe handles inline strings cleanly).

### Workflow

- `dssCollectAllLilies` (the JS debug helper) is broken — it relies on `Harlowe.API_ACCESS.STATE.variables` which no longer exposes itself globally in modern Harlowe. The Tools-section debug button "⛤ Set 5 lilies + reveal pentangle on map" is therefore inert in this Harlowe build.
- For testing this session, used a temporary `:: Debug Set 5 Lilies` passage that did `(set:)` macros + `(goto: "Dean Street")`, jumped to it via `#dss-debug-jump=...` URL hash, then deleted the passage. This pattern works cleanly when needed in future sessions.

---

## Open items for next session

### 1. Verify in-game collection flow

Dr Quill should play through and collect all 5 lilies the natural way (Pillars, Coach, Colony, Ronnie's, French) to confirm the auto-trigger via `dssRevealPentangleOnMap` in the click handlers fires the animation correctly. Each lily's `(click-replace: ?lilyN)` runs `<script setTimeout>` calling that function on the 5th collection.

### 2. The lily-tab pentangle animation

Wired but not visually confirmed in this session. The 5 lily-row glyphs in the LILLIES tab should converge to pentagram points → star outline appears → return to row, on the first LILLIES-tab view after gathering all 5. Untouched this session.

### 3. Esoteric layer #6 — alchemical opus

Pitched and agreed last session, deferred. Three tiers planned (haunt-box italic line per venue → notebook THE WORK section → Centre Point dawn revelation). Memory at `~/.claude/projects/.../memory/project_esoteric_layer.md`.

### 4. Audio re-recording

Out of scope for Claude — Dr Quill plans Soho field recordings. No action required.

### 5. Banked esoteric items

I Ching from haunts (#2), Page 47 plant (#3), Tarot at Trisha's (#4), book-title-as-true-name (#5). Canonical bank in memory.

---

## Workflow notes (unchanged)

- **Source of truth:** `Dream Street Shuffle.twee`. Never read the compiled .html (~3 MB).
- After edits: `python3 sync_html.py`, then "synced, commit when ready."
- Git stays in Dr Quill's hands.
- `HANDOFF*.md` is gitignored.
- **House rule:** always grep the .twee for current state before pitching design moves. (`memory/feedback_reason_from_source.md`)
- **New addition this session:** Harlowe temp-variable scoping in 3.3+ is *strict* — always create `_var` at outer scope before any `(if:)/(else:)` that reads or rewrites it. Reassigning an outer-scope `_var` from inside a hook works; *creating* one only inside hook branches doesn't.

---

## Commit status

All changes synced to HTML. Working tree:
- `Dream Street Shuffle.twee` modified (4 changes: scoping fix + Centre Point x + polygon points + keyframes)
- `Dream Street Shuffle.html` regenerated by sync_html.py
- `HANDOFF.md` updated (this file)

Ready to commit via GitHub Desktop.
