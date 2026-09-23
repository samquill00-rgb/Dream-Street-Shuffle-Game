# Polish loop, 2026-09-23 — running log

Brief: the seven passes Sam approved in the project chat at 04:31 UTC ("Go" at 04:32). Branch `claude/polish-loop-2026-09-23-dkhohi` off main 90e8e79. One commit per pass. Runs until about 08:35 UTC or until usage runs out. His prose, verse, pink lines, link wording, variables, endings, audio and the critic scene are untouched throughout.

Base check at start: main already carries the Third Pillar water and the Centre Point chain fixes. `claude/preview-launcher-ltc3uy` (the `?start=` links and preview.html) is NOT merged, so jumps here use `#dss-debug-jump=` / the audit harness's Start rewrite.

Rig: `python3 -m http.server 8777` from the project folder; `pip install playwright`; Chromium at `/opt/pw-browsers/chromium-1194`; node at `/opt/node22/bin/node`. Scripts in `scratchpad/polish-loop-2026-09-23/` (run from `scratchpad/audit-2026-09-16` with `PYTHONPATH=.` so they can import `harness.py`). Safari was not run; WebKit reasoning noted where it matters.

## Pass 1 — overlapping text (started 04:38 UTC, sweep running in the background)
- New `overlap_sweep.py`: renders every story passage at 1212×900 and 390×780 under the rich seed, waits 3.5s for staggered reveals, then reports (a) text runs from different elements whose boxes intersect by more than 3px both ways, (b) text runs that pass their block container's edge, (c) elements with overflow hidden whose text is taller/wider than the box. Both widths run in parallel; about 30s a passage under software GL.
- Results below when the sweep finishes.

## Pass 2 — notebook map positions (04:45–05:05 UTC) — DONE, eight markers moved
- Reference: the Dean Street tile map's DOORS table (UserScript ~line 4179: Wardour cols 5–6, Dean 17–18, Frith 29–30, Greek 41–42; Bateman rows 15–16, Old Compton 27–28, Romilly 35–36, Shaftesbury 41–42; "every venue sits where it really sits in Soho"). The notebook map is the SVG built in `header header` (~line 51778, viewBox 560×700; Wardour x100, Dean x230, Frith x360, Greek x490; Bateman y370, Old Compton y520, Shaftesbury y620).
- Moved (old → new, viewBox units):
  - **Chippy** 100,250 → 216,228: it was on Wardour Street; the tile map has it on the west side of Dean Street in the north block (col 15, row 6).
  - **Trisha's** 494,262 → 476,404: it was on the east side of Greek Street *above* Bateman; the tile map (and 57 Greek Street) has it on the west side just *below* Bateman (col 39, row 19). Its label now sits to the right of the marker so it does not crowd Lackland's.
  - **The Ginger Light** 230,370 → 241,500: it sat on the Dean/Bateman crossing; the tile map has it on the east corner of Dean and Old Compton (col 19, row 26).
  - **Colony Room** 232,420 → 221,420: west side of Dean, not in the road (col 15).
  - **Lackland's Offices** 364,430 → 374,422: east pavement of Frith (col 32, row 21).
  - **The French House** 248,566 → 248,548: a few doors south of Old Compton (row 30), not mid-block.
  - **Coach & Horses** 490,560 → 499,560: east side of Greek (col 44).
  - **Pillars of Hercules** 486,205 → 499,205: east side of Greek (col 44).
  - Ronnie Scott's (340,450, west of Frith between Bateman and Old Compton) was already right and did not move.
- The gathered-lily markers and the five-lily pentangle share these coordinates, so they follow: the pentagram polygon is now `280,70 499,560 216,228 476,404 248,548` (Centre Point, Coach, Chippy, Trisha's, French) instead of `280,70 490,560 100,250 494,262 248,566`.
- **For Sam's eye:** with the Chippy and Trisha's where the tile map puts them, the pentangle is no longer a symmetrical star (`pass2-nbmap-before-pentangle.png` vs `pass2-nbmap-after-pentangle.png`). The old coordinates seem to have been chosen for the star rather than for Soho. If the star matters more than the map, the two lines to revert are the Chippy (`translate(216,228)` → `translate(100,250)`, 5 places) and Trisha's (`translate(476,404)` → `translate(494,262)`, 4 places) plus the two polygon `points=` lists.
- **Also for Sam:** the Lackland's approach caption reads "LACKLAND'S OFFICE, WARDOUR STREET, SOHO" (UserScript ~line 26134) while both maps put the office on Frith Street. Left alone; his call which is right.
- Screenshots in the project files: `pass2-nbmap-before-desktop.png`, `pass2-nbmap-after-desktop.png`, `pass2-nbmap-after-phone.png`, `pass2-nbmap-before-pentangle.png`, `pass2-nbmap-after-pentangle.png`. Tool: `nbmap_shot.py` (opens the notebook, switches to MAP, screenshots `.soho-map`; `SEED=` env adds Harlowe sets).
- **Verified:** map renders with 0 JS errors at 1212 and 390; the pentangle state renders with 0 errors. Changed: the map SVG in `header header` only (coordinates and three Trisha's label attributes). No words changed.

## Pass 3 — placeholder prose from the dream-loop documents (04:58–05:12 UTC) — DONE, 50 pink groups cut
- Source of the short versions: `.notes/dream-loops-build/cuts.py` in the project files (the exact text the second-edition docx files carry, keyed by passage, one entry per run of pink prose). New `apply_cuts.py` maps each entry onto the matching `<div class="claude-draft">` prose run in the twee (links inside the divs are left where they are), checks the cut introduces no more than a handful of words the long version did not have, keeps any HTML comment that was inside the div, and writes the cut in place. The pink class stays, so everything still reads as draft.
- Applied to 49 groups by the script across 37 passages (Nazca, Easter Island, Pyramid, Ezekiel loops; Third Pillar Portal, The Synthesis, The Sanctum, The Sanctum — Sitting, Alt-Dawn; the five Recognises passages; the Critic Hears the Mantra), plus one by hand: the first block of The Centre — Nazca, which carries the `(if: $nazcaRaceWon)` hook; the cut's "[only if you won the race: …][otherwise: …]" went back in as the same hook with the shortened lines.
- Left alone: The Mountain, The Cave and Himalayan Return already carry Sam's own prose (no pink left, so the docs' cut versions of the old drafts are moot). Nazca Race, Pyramid Run and The Climb have no pink prose in the game at all (only the hidden testing skip links), though the docs show three short pink paragraphs for each; nothing was added, since the brief was replacement only. Third Pillar Portal's key-steer line (`#dss-pt-steer`) was marked "keep" in the cuts and is unchanged.
- Numbers: 116 pink divs before and after; the twee lost about 240 lines of draft and gained 175. No link, `(set:)`, `(if:)` or `(link:)` line changed apart from the hand-edited Centre — Nazca hook.
- Verified: nine of the cut passages rendered in Chromium at 1212 with 0 Harlowe errors, 0 JS errors and no overlaps except one on Nazca Approach that pass 1 will pick up (the link now sits 5px under the scene's fixed "STEP DOWN FROM THE BUS" caption because the paragraph above it is shorter). html synced.
