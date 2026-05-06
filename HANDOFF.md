# HANDOFF — 2026-05-06

This build delivers the bug-fix session from earlier today **plus** the full Item 6 visual Wheel (Ripley's alchemical opus) and the mystical-number rename **47 → 93** (Thelema). Everything is synced and ready to commit.

---

## Bug fixes (earlier today, also in this build)

1. **Jazz minigame music never stopping** — `startBarGame()` MutationObserver was watching `tw-passage` for `name` attribute changes, which Harlowe never fires (it replaces the element entirely on navigation). Fixed: now watches `document.body` with `{ childList: true, subtree: true }` for new `TW-PASSAGE` nodes.
2. **Pillars/Carthage gating** — after meeting the critic, Dean Street greyed The Pillars as "NOT NOW", permanently blocking Maritime interlude → Carthage. Fixed with a new `$visitedCarthage` boolean. Dean Street now shows "Seek the coast — beyond The Pillars" (active) until Carthage is visited, then "DONE FOR TONIGHT".
3. **Chippy never appearing on strong runs** — was gated on `$confidence < 50` only. Added `$returns >= 5` as a second unlock path with Dr Quill's text variant.
4. **Chippy/doorway choice-boxes restyled** — all five instances now use `venue-hint-box` / `vh-label` Word To The Wise styling.
5. **Gents retching animation** — kneeling/hunched figure for `SpewPopup` Gents mode (was upright pissing silhouette).

---

## Item 6 — Twelve haunts = Ripley's alchemical Wheel ✅

### Backend (was already mostly done)
- All 12 haunt-boxes carry an italic *"The work: [Stage]."* whisper line
- Notebook lists each haunt with its stage label *(Calcinatio, Solutio, …, Exaltatio)*
- Background tiers rescaled to /12 (≥3, ≥6, ≥9, ≥12)
- `bar-opus` gold stat-bars and `dssOpusReveal` modal both fire at 12/12
- **Design call:** The Crown is granted ONLY in the Alba Complete ending — failed alba ends at 11/12 with no opus reveal. The thematic-purity choice (Exaltatio = triumph stage = full opus). Alba3 staircase-gift threshold rescaled `>= 7` → `>= 11` to preserve the "all but one" feel.

### Visual Wheel SVG (built this session)
A full Ripley's Wheel reveals when The Crown is collected, replacing the previous text-only "OPUS STATE" modal. Lives in `dssOpusReveal()` (~[Dream Street Shuffle.twee:7026](Dream%20Street%20Shuffle.twee:7026)) with CSS animations in the styles block.

- **Frame**: outer rim, inner ring, central hub, 12 spokes at 30° intervals. Rotates from 720° → 0° over 3.6s with a deep ease-out so the second turn visibly drags before settling.
- **Labels**: 12 Latin stage names outside the rim + 12 haunt names between rings, in canonical Ripley sequence clockwise from Calcinatio at 12 o'clock. Fade in 1.6s after the wheel settles, so the work names itself only after the wheel has stopped turning.
- **Sol** at the heart (gold): 12 rays in **9 long + 3 short = 93** (Thelema). Long rays are tapered triangular wedges for volume; short rays are thin lines at 12, 4, 8 o'clock — forming an equilateral fire/sulfur triangle hidden inside Sol.
- **Ouroboros** wrapping the rim (**silver / Luna** to distinguish from gold Sol + wheel + labels): line-art style with two parallel rails, 38 chevron scales between them with alternating shaded / outline scales. Tapered viper head at 5 o'clock with slit eye, parted-jaw mouth, and forked tongue extending toward the tail. Tail is two converging gold-silver lines from the body's rail endpoints meeting at a sharp point near 7 o'clock. Head and tail meeting point lands on **Cibatio** (the work feeds itself).
- **Animation timing**: spin in (3.6s, frame only) → labels fade (1.6s, starting at 3.0s) → hold → fade out at 7.5s → DOM removed at 10.5s.
- **Geometry**: viewBox `780×780`, center `(390, 390)`. Stage labels at radius 345 (pushed out from 318 to clear the silver serpent, which sits at radii 290–300).

### Mystical number 47 → 93
All occurrences of "Page 47" (and PAGE 47 / page 47) renamed to **Page 93**, Thelema. Includes:
- O'Flatterly's dialogue: *"Page 93 is missing. Find it for me!"*
- The notebook entries, headers, Dean Street nav links
- The 3D building-number plate (now **93 Cecil Court**)
- All CSS comments and the *"You show him 93"* return beat
- Sol's 9 long + 3 short rays encode the same number visually

**Item 3 (additional 93s scattered around the game) was not activated.** Dr Quill considered drafted plants — bus, table, card on the bar at the French — and declined, judging the existing 93s sufficient. **Parked: a single visual 93 placement somewhere atmospheric, future session.**

---

## Esoteric layer bank — current status

Full detail in `memory/project_esoteric_layer.md`.

1. ✅ Five lilies = pentacle — built
2. ⏸ Eight haunts = I Ching — superseded by item 6 (now 12 haunts); on hold
3. ⏸ Additional 93 plants — declined this session as too obvious; parked for a single future visual placement
4. 🏦 Tarot spread at Trisha's — fully banked
5. ⏸ Book title as true name — wanted, not yet
6. ✅ Twelve haunts = Ripley's Wheel — built (backend + visual reveal + Sol + Ouroboros + 93 rename)

---

## Files of note

- `Dream Street Shuffle.twee` — 145 passages, all changes committed-to-disk and synced
- `Dream Street Shuffle.html` — compiled output (do not read; sync via `python3 sync_html.py`)
- `wheel-preview.html` — standalone preview file for the Ripley's Wheel SVG, sitting at project root. Not gitignored. **Decide on commit:** keep as a reference for tweaking the wheel's design later, or delete before pushing
- `memory/project_esoteric_layer.md` — updated with current item 6 status
- `memory/feedback_esoteric_reveal_aesthetic.md` — new memory recording the validated visual-reveal aesthetic (drama-then-fade, gold linework, no explanatory labels) for any future esoteric layer work

---

## Next session

- Commit/push via GitHub Desktop before continuing
- Possible threads:
  - Item 5 (book title as true name) — purely prose work, Dr Quill drafts the lines, Claude splices them in
  - A single visual 93 plant somewhere atmospheric (parked from this session)
  - New esoteric layer ideas beyond the original six
- Decide what to do with `wheel-preview.html` — keep or delete
