# HANDOFF — 2026-05-13

Long session continuing from 2026-05-12 (Tree of Life + Lightning Flash + OPUS work).
Today: progression-gating bug hunt, Pillars-passage fix, header back button on 3D approach scenes, stat-label rendering bug nailed via Chrome MCP, plus a sweep of layout polish.

---

## Big bug found via Chrome MCP — stat label class attribute

**Single most important thing this session.** Was tearing my hair out for over an hour trying to make ALBA the same size as MORALE / SOBRIETY. Eventually Dr Quill installed Chrome MCP for me, and within a minute of `getComputedStyle()` I found the actual problem.

**Root cause:** Harlowe **does not evaluate `(if:)` macros embedded inside an HTML `class="..."` attribute.** The markup
```
<span class="stat-label(if: $haunts's length >= 12 or $opusViaTree is true)[ stat-label-opus]">...</span>
```
rendered to the DOM with the *literal Harlowe expression* as part of the class string. So `.stat-label` CSS never applied to MORALE or SOBRIETY. They inherited from `.stat-bars` (0.8em). ALBA had a clean static `class="stat-label"` and picked up the CSS correctly. Every size-tweak I made to "fix ALBA" was the wrong direction — ALBA was the only one being styled.

**Fix:** restructured so the conditional wraps the whole element:
```
(if: $haunts's length >= 12 or $opusViaTree is true)[<span class="stat-label stat-label-opus">OPUS</span>](else:)[<span class="stat-label">MORALE</span>]
```
Duplicates a tiny bit of markup but it's the only reliable way. Same for SOBRIETY/STATE.

Saved to memory as `project_harlowe_class_attr.md` so this never wastes hours again. **Lesson for future:** any layout mystery in DSS, inspect computed styles in Chrome MCP *before* touching CSS. The source can lie.

---

## Progression-gating bug — Colony Room "Back to" link

Dr Quill spotted: after first French visit, Dean Street showed "→ Back to The Colony Room — there was something you missed" before he'd ever been to Colony.

**Root cause** (long-standing, pre-dates my edits): the conditional chain on Dean Street for the Colony link was:
- `(if: ... haunts contains haunt1 ...)` → "Try the Colony Room"
- `(else-if: ... visited's French and tookLily4 is false)` → "Back to The Colony Room"
- `(else-if: ... visited's French)` → "[NOT NOW]"

The middle branch had no check for whether Colony had actually been visited — it fired purely on "you've been to French and lily 4 isn't taken yet." Players who hadn't gotten `$haunt1` yet (which requires a *second* French visit to approach the artists) and hadn't been to Colony saw the "Back to" prompt incorrectly.

**Fix:** added `$visited's Colony is true` to both the "Back to" and "[NOT NOW]" branches:
```
(else-if: ... $visited's French is true and $visited's Colony is true and $tookLily4 is false)
(else-if: ... $visited's French is true and $visited's Colony is true)
```
Now no Colony link appears until either $haunt1 is collected (which unlocks via the first branch) or Colony has actually been visited.

Probably similar bugs lurk for other venue "Back to" links if any don't check `$visited's X is true`. Worth a sweep next time Dr Quill spots one.

---

## Pillars passage — threshold prose

Dr Quill: "I can't see the threshold prose in playthrough."

**Root cause:** the prose
> If you cross the threshold of the Pillars you've already made your choice.
>
> Whatever more you choose comes out in the wash:

was wrapped inside the `(else:)` hook for `(if: $resumingFromCall is true)`. So it only displayed on visits NOT from a phone call. Returns from Lily / Aoife phone calls skipped it. Also the wording was "pass the Pillars' threshold" — Dr Quill remembered it as "cross the threshold of the Pillars".

**Fix:** moved the prose *outside* the `(else:)` (the conditional now only sets sobriety/confidence side-effects), and changed wording to "cross". Prose now shows on every visit to Pillars.

---

## DONE FOR TONIGHT → NOT NOW

Dr Quill: "DONE FOR TONIGHT" implied the *whole night* was over, which was misleading when other venues still had haunts to collect.

Replaced everywhere it appeared as a venue completion marker (French / Colony / Ronnie's / Lackland's hub links + French at-passage). All now say "[NOT NOW]" — local to the venue, not terminal.

---

## Defensive guards in Build Notebook

Added at the top of Build Notebook:
```
(unless: $haunts is an array)[(set: $haunts to (a:))]
(unless: $visited is a datamap)[(set: $visited to (dm:))]
(unless: $alba is an array)[(set: $alba to (a:))]
(unless: $haunt1 is a string)[(set: $haunt1 to "The Sketch") ... (set: $haunt12 to "The Crown")]
```
Protects against any save-state corruption that would otherwise make the HAUNTS section render empty (all 12 conditionals silently failing because `$haunts contains $haunt1` errored on bad input). Only fires when state is actually missing; never wipes collected haunts.

---

## Hebrew gating per-venue

Previously the Tree-of-Life Reveal showed ALL Hebrew names on the map regardless of progress. Wrong — should only show for venues actually visited.

**Fix:** removed Hebrew text element from each venue's *unvisited* state block (8 venues × 1 state each). Hebrew only renders in here / visited states. Symbolic venues handled separately:
- Centre Point Hebrew (`כתר`) gated on `$visitedCentrePoint is true` (set in Approach Centre Point passage)
- Cecil Court Hebrew (`מלכות`) gated on `$knowsCecilCourt is true`

Da'at remains notebook-only as before. Lightning Flash still fires correctly when all 10 sefirot are visited.

---

## Back button on 3D Approach scenes

The full-screen Three.js Approach scenes had no back button — players could only proceed forward. Added a fixed-position back link (`.approach-back` class, top-left, italic uppercase to match the existing BACK style) to these passages:

- Approach The French
- Approach The Pillars
- Approach Lacklands Office
- Approach The Ginger Light
- Approach The Colony Room
- Approach Ronnie Scott's
- Approach Trisha's
- Cecil Court Approach
- Approach Chinese Fish and Chips

**Skipped:**
- Approach The Coach (Dr Quill's explicit exclusion — the cow-ride pre-roll)
- Approach Coppers Lair (cellar fight setup — feels like a point of no return, not added)
- Approach Centre Point (endgame Dawn approach, not added)

---

## Header / stat-bar layout polish

After the class-attribute bug fix:
- All three stat labels (MORALE / SOBRIETY / ALBA) now identical: 0.65em, Playfair Display, 400 weight, 0.1em letter-spacing
- Added `margin-left: -12px` on `.stat-label` to nudge all three labels ~3mm leftward (margin doesn't affect grid column positions, so the cigarette bars stay put)
- BACK / NOTEBOOK header: gap increased from 0.5em → 1.8em for breathing room
- Back button itself shrunk: font-size 0.85em → 0.7em, margin-left 1.4em → 0.6em
- SOBRIETY cigarette ember: shrunk and pulled inward (`right: -9px width 20 height 30` → `right: 0px width 12 height 20`) so it sits cleanly inside the bar-fill end and doesn't clash with the gray-ash cigarette body

---

## Other small things

- `pentangle-aligned-preview.html` and `bell-preview.html` previews are still up to date with the live game (sefirot-aligned pentangle, B+D hybrid bell, Lightning Flash CSS, LBRP backdrop, etc.).
- Chrome MCP is now connected and working — see memory note for how I'll use it on future bugs.

---

## State of the live code at session close

All changes synced to `Dream Street Shuffle.html`. Commit pending.

---

## Memories updated/added today

- `project_harlowe_class_attr.md` (new) — the class-attribute trap that ate this session.
- `MEMORY.md` — index updated.

---

## Open threads for next session

- **Other venues may have the same "Back to X" bug** as Colony — any `(else-if:)` that fires on "French visited + lily not taken" without checking the destination venue was actually visited. Sweep when Dr Quill spots another.
- **Hobson-adjacent prose** — Dr Quill mentioned text to be restored before the Hobson verse in the Pillars passage. The threshold prose is fixed (visible on every visit now). If there's *additional* prose Dr Quill wanted before the verse, it wasn't found in git history — he'll need to paste it when he finds it.
- **Three pillars** (Mercy / Severity / Mildness) — still banked as the next major occult addition, tied to Pillars of Hercules thematic. See `project_three_pillars.md`.

---

## Things considered and intentionally NOT done

- Removing the Coach approach back button (per Dr Quill).
- Adding back button to Approach Centre Point or Approach Coppers Lair (endgame / point-of-no-return).
- Re-pitching Da'at on the map, Page 47/93, book-as-true-name, I Ching (all permanently off the table — see `project_esoteric_layer.md`).

---

## Ready for next round

Layout cleanly aligned, gating bugs caught, Chrome MCP available for future debugging.
