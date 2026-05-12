# HANDOFF — 2026-05-12 (session 2)

Session built on yesterday's groundwork. Wired Tree of Life Phase 2/3 fully into the live `.twee`, restored the lily-pentangle's geometric alignment to sefirot venues, ran an extensive polish pass on the bell SVG and the LBRP backdrop, then designed and implemented the Lightning Flash as the Tree's culmination.

---

## Tree of Life — Phase 2/3 live

Implemented from yesterday's preview spec:

- **Hebrew sefirot labels** on every venue's three-state block (here/visited/unvisited) — 8 venues × 3 states + Centre Point + Cecil Court. Ginger Light intentionally left unmarked on the map (it's Da'at, the hidden eleventh).
- **TREE notebook tab** inserted between POEM and MAP. Renders all 10 sefirot in canonical order with Hebrew + English + venue, plus a pastel-pink Da'at row at the foot (Hebrew only, no English/venue — the hidden eleventh stays a notebook reference only, never on the map).
- **Reveal button** with `window.dssToggleSefirot` JS handler. Toggles `tree-on` class on the SVG (Hebrew fade in), auto-switches to MAP tab, forces a reflow so the 0.9s opacity transition is actually visible.
- **CSS `.seph` class**: opacity 0 default, 0.88 when `tree-on`, red `#c83828`, drop-shadow for legibility on the dark map.

---

## Pentangle re-aligned to sefirot

The existing lily-pentangle (at `$lilyCount >= 5`) had drifted-symbolic coordinates. Re-aligned to exact venue positions:

| Sefira | Venue | Coord |
|---|---|---|
| Keter | Centre Point | (280, 70) |
| Chokmah | Trisha's | (470, 200) |
| Netzach | Coach & Horses | (490, 460) |
| Yesod | The French House | (230, 470) |
| Binah | Chinese Fish & Chips | (100, 250) |

Updated in three places: notebook map polygon + lily-bell transforms + glow circles, and BOTH Dawn Approach overlays (White/Black). Lily-bells, LBRP recital, and dramatic flash reveal all unchanged behaviourally — just re-aligned.

---

## Bell SVG redesign

Iterated through 4 variants (Current / Waxen / Botanical / Ghost) in `bell-preview.html`. Dr Quill picked a B+D hybrid: body opacity 0.35, separate outline stroke at 0.7 opacity, 7 ribbed veins fanning calyx-to-lip, small pistil dots. Stem and calyx greens dulled to pale sage (`#9aa888` stem, `#8a9678` calyx body, `#5a6850` calyx stroke).

Defined as `_bell` temp variable in Build Notebook; reused via concatenation in:
- the pentangle bells (notebook map, lily ≥ 5 state)
- both Dawn Approach overlays (White and Black, both via `_ll`)
- all 5 notebook lily-row flowers (each at its own `scale(...)`: 0.821 / 0.893 / 1.0 / 0.857 / 0.714 — preserves the original size rhythm)

---

## Lily-row state contrast

Replaced inline `opacity` attr with class-based state styling. Gathered vs ungathered now reads instantly:

- `.nb-lily-empty`: opacity 0.22, `filter: grayscale(0.92) brightness(0.78)` — near-ghost grey silhouette
- `.nb-lily-gathered`: opacity 1, layered gold drop-shadow halo — lit/present

Preview: `lily-states-preview.html` shows 0 / 3 / 5 collected states side by side.

---

## LBRP backdrop

Added a translucent dark panel behind the LBRP recital. Iterated on width several times — final: `x=110 y=528 width=340 height=74 rx=5`, fill `rgba(8,6,4,0.78)`, faint gold border `rgba(212,165,116,0.22)` at stroke 0.5. Wider than the longest line, clears Wardour St (x=100) by 10px and Greek St (x=490) by 40px. CSS-animated to fade in with the same `nb-map-pent-lbrp` keyframes the text uses.

---

## Bell + Keter Hebrew positioning

- Bell vertical offset changed from `translate(0,-35.5)` → `translate(0,-25)` (bell sits lower on the page, closer to the dot).
- Keter Hebrew kept at original `y=22` but moved OUT of the Centre Point group and re-rendered as a SEPARATE text element after the pentangle bells block, so it draws *on top* of the bell — Hebrew red sits over translucent cream.
- New `seph-keter` class overrides the base `.seph` rule: opacity 1 (no see-through tint), layered drop-shadow at 95%/90% so the bell's cream doesn't pinkify the red.

---

## Trisha's / Pillars label clearance

Greek St (vertical line at x=490) was being crossed by both Trisha's label (x=18) and Pillars label (x=-18). Shifted to x=28 / x=-28 in all three states each (here/visited/unvisited), Hebrew and English.

---

## Lackland's two-line label

Now reads:
> Lackland's
> Offices

Implemented via `<tspan x='18' dy='14'>Offices</tspan>` on the label. Hebrew Hod moved from y=22 to y=36 to clear the new second line. All three states updated.

---

## THE LIGHTNING FLASH — Tree of Life culmination

The Tree had no payoff state. It does now.

### State

- `$treeFlashed` (default false) — once-only flag. Fires when conditions met during notebook open.
- `$visitedCentrePoint` (default false) — set true in the `Approach Centre Point` passage.
- `$opusViaTree` (default false) — Tree-side path to OPUS STATE. Set true at the same moment as `$treeFlashed`.

All three initialized in both StoryInit blocks (line 77ish + 31233ish reset).

### Trigger

In Build Notebook, computes `_treeAllVisited` from the 10 sefirot venue flags:
- Centre Point: `$visitedCentrePoint`
- Trisha's / Pillars / Colony / Ronnie's / French: `_tVisited / _pVisited / _cVisited / _rVisited / _fVisited` (`$visited` datamap)
- Chippy: `_qVisited` (`$hadChippy`)
- Coach: `_hVisited` (`$cowRideDone`)
- Lackland's: `_lVisited` (`$knowsLackland`)
- Cecil Court: `_eVisited` (`$knowsCecilCourt`)

When `_treeAllVisited && $treeFlashed is false`: flip `$treeFlashed` and `$opusViaTree`, add `'tree'` to the page's pentangle-queue.

Same once-only-consumption pattern as the lily pentangle. Player must press Reveal during the notebook session when the flag flips, or burns the flag.

### Visuals

`<g class='map-tree-lightning'>` element always rendered, hidden by default. Contains:
- **9 `<line>` paths** in canonical descent order: Keter → Chokmah → Binah → Chesed → Gevurah → Tiferet → Netzach → Hod → Yesod → Malkuth. Stroke `#d8e0ec` (silver, matching LBRP), width 3, settled opacity **0.10** (exactly half the pentangle's 0.20 — Tree sits under it in prominence).
- **10 `<circle>` sparks** (one per sefira). Bright warm pulse (rgba(255,245,200,1) at r=14) during ignition, fade to invisible.

### Animation

`.tree-flashing` class on the SVG fires sequential animations:
- Each `tree-path-N` (1–9) has `animation-delay: (N-1) * 0.35s + 0.20s`, draws via stroke-dashoffset 1000→0 over 0.5s, peaks at opacity 0.95 (during draw) then settles to 0.10.
- Each `tree-spark-N` (1–10) has `animation-delay: (N-1) * 0.35s`, pulses 0→1→0 opacity with r 3→14→6 over 0.7s.
- Total flash ≈ 3.5s, then everything settles.

### OPUS hookup

The Lightning Flash is a second path to the OPUS STATE (the alchemical Wheel modal at 12/12 haunts). Both paths now feed the same final state:

- **Stat-bar visuals**: confidence + sobriety bars switch to gold `bar-opus` fill when `$haunts's length >= 12 OR $opusViaTree is true`. Same for the OPUS/STATE label swaps and the 100% percentage labels (5 conditionals total in Build Notebook).
- **Page background**: indigo gradient enchant fires on the same OR condition.
- **OPUS modal**: `window.dssToggleSefirot` calls `window.dssOpusReveal()` via `setTimeout(4000)` after the Lightning Flash fires. The modal's internal guard prevents double-spawn if the player already triggered it via the Dawn passage.

### `window.dssToggleSefirot` updated

On Reveal press:
1. Toggle button text/class
2. Switch to MAP tab
3. Force reflow
4. Add `tree-on` to SVG (Hebrew fades in)
5. If queue contains `'tree'`: remove + re-add `tree-flashing`, consume from queue, schedule OPUS modal

---

## State of the live code (.twee) at session close

Everything above is LIVE in `Dream Street Shuffle.twee` and synced to `Dream Street Shuffle.html`. Commit pending.

---

## Esoteric layer status

Updated `project_esoteric_layer.md` memory. Status:

**Built:** lily pentagram, alchemical Wheel + visual Wheel, Tarot at Trisha's, Tree of Life sefirot mapping, Lightning Flash culmination → OPUS STATE, plus all the smaller polish (Gawain endless-knot, eclipse for Alba Incomplete, Shelley's Liver flash, LBRP backing).

**Off the table — never pitch again:** Book-as-true-name; Page 47/93 hidden numbers; I Ching trigrams (numbers don't fit 12-haunt count).

**Banked for future:** Three Pillars overlay — Kabbalistic Mercy/Severity/Mildness columns tied to the existing Pillars of Hercules thematic. New memory file: `project_three_pillars.md`.

---

## Files of note

- `Dream Street Shuffle.twee` — 132 passages, source of truth.
- `Dream Street Shuffle.html` — synced. NEVER READ DIRECTLY.
- `sync_html.py` — unchanged.
- `bell-preview.html` — 4 bell variants A/B/B+D/D for reference.
- `lily-states-preview.html` — gathered vs empty contrast.
- `pentangle-aligned-preview.html` — current live state of the map. Includes a **Call down the Lightning** button to replay the Lightning Flash animation without playing through.
- `map-phase1/2/3-preview.html` — earlier design references, superseded by the live code.

---

## Memories updated this session

- `project_esoteric_layer.md` — rewrote to reflect built/off-the-table/banked status; logged the three permanently-rejected ideas with reasoning.
- `project_three_pillars.md` (new) — banked design tying Kabbalistic three pillars to the existing Pillars of Hercules naming.
- `MEMORY.md` — updated entries for the two changed/new project files.

---

## Things considered and intentionally NOT done

- **Da'at on the map** — discussed and rejected. Da'at stays in the notebook list only (pink Hebrew, no English/venue), never on the map regardless of state. The hidden eleventh remains hidden.
- **Tree completion requiring Alba Complete** — Tree completion fires OPUS via `$opusViaTree` regardless of alba state. This is an additional path to OPUS, parallel to the 12-haunt + Alba Complete path, not a stricter gate.
- **Page 47/93 references** — explicitly off the table. The prop is actually Page 93 now (memory had it as 47).
- **I Ching trigrams** — off the table; numbers don't fit the 12-haunt count.
- **Book title as true name** — off the table.

---

## Ready for next round

Lightning Flash + OPUS hookup is the end of this session's main thrust. Three pillars is the next major occult thread when Dr Quill comes back to it.
