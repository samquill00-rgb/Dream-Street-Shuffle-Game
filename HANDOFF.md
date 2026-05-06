# HANDOFF — 2026-05-06

## What this session fixed

### Bugs resolved
1. **Jazz minigame music never stopping** — the `startBarGame()` MutationObserver was watching `tw-passage` for `name` attribute changes, which Harlowe never fires (it replaces the element entirely on navigation). Fixed: now watches `document.body` with `{ childList: true, subtree: true }` for new `TW-PASSAGE` nodes.

2. **Pillars/Carthage gating** — after meeting the critic, Dean Street greyed The Pillars as "NOT NOW", permanently blocking Maritime interlude → Carthage. Fixed with a new `$visitedCarthage` boolean (init false in StoryInit + reset, set true in "Dream to Dean"). Dean Street now shows "Seek the coast — beyond The Pillars" (active) until Carthage is visited, then "DONE FOR TONIGHT".

3. **Chippy never appearing on strong runs** — was gated on `$confidence < 50` only. Added `$returns >= 5` as a second unlock path. Two text variants: "If you're in a bad way…" (low confidence) vs "You're probably hungry…" (returns path — Dr Quill's text).

4. **Chippy/doorway choice-boxes restyled** — all five instances (three emergency states + two chippy offers) now use `venue-hint-box` / `vh-label` Word To The Wise styling for advisory text. Venue links sit below as regular Dean Street links.

5. **Gents retching animation** — `SpewPopup` was drawing an upright pissing silhouette for both modes. Gents mode now has a kneeling/hunched figure: head drooping, spine curved, arms gripping bowl rim, stream drops nearly straight down from mouth height. Doorway mode unchanged.

### Previously fixed (prior session, also in this build)
- Colony Room gate: 3-state (active / NEED A WORD / DONE FOR TONIGHT)
- `$alba3` showing "0": defensive re-set at top of LINE 3 passage
- Typewriter style on atmospheric venue-exit passages
- Pong/cow game retag ([pong] and [cow]) — fixed double-music race condition

## Current twee state
- **145 passages**
- Synced and copied to main branch — commit/push via GitHub Desktop before next session

## Esoteric layer bank
Full detail in `memory/project_esoteric_layer.md`. Quick status:

1. ✅ Five lilies = pentacle — built
2. ⏸ Eight haunts = I Ching — conflicts with item 6 (12 haunts); on hold
3. ⏸ Page 47 hidden number — wanted, not yet
4. 🏦 Tarot spread at Trisha's — fully banked
5. ⏸ Book title as true name — wanted, not yet
6. 🔄 Twelve haunts = Ripley's Wheel — four new haunts mapped, prose drafts in `Four New Haunts.docx`. Dr Quill writes prose; Claude does code after.

## Next session
- Dr Quill wants to explore new esoteric layer ideas beyond the current six
- Commit/push current fixes first
