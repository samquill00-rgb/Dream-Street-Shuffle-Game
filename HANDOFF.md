# HANDOFF — 2026-05-14 (v2 expansion begins)

This session closed the v1 first draft and opened the v2 expansion phase.

---

## Branch status (IMPORTANT)

- **`main`** — last v1 commit (feature-complete first draft, version stamp in StoryInit).
- **`v1-first-draft`** — frozen snapshot of v1 at the same commit. Do not commit to this branch.
- **`v2-expansion`** — *active working branch*. All future edits and `sync_html.py` outputs land here until further notice.

Verify which branch is checked out in GitHub Desktop before suggesting anything structural. Dr Quill handles all commits — never run git commands.

---

## Session 2026-05-14 — pre-branch polish & cleanup

Last work done on `main` before the branch split:

### Critic page-turn shuffle
The "Wait." click at The Critic now spawns **4-5 pages per click** with staggered start times (60-120ms apart) and randomised flip durations (0.45-0.75s, down from 1.1s). Reads as a thumb-riffle rather than a ceremonial turn.

New audio function **`pageShuffle()`** layers 4-5 noise bursts at varied highpass centres (1.4-2.6kHz) and Q values, each 70-130ms apart, plus a quiet low-frequency thump for paper weight. `pageRustle()` is untouched and still used for the page-93-found moment.

### Hold-driven SFX for the SpewPopup
Two new audio controllers, each returning `{ stop() }` so the popup can start them on mousedown and stop them on mouseup:

- **`startPissStream()`** — bandpass-filtered noise at ~1.1kHz (splatter against pavement) with a slow 3.2Hz LFO wobbling the filter, plus a 110Hz sine for body weight.
- **`startRetchStream()`** — same architecture but pitched lower (~620Hz bandpass — liquid into liquid sounds heavier), with a saw-wave gut gurgle at 85Hz and a brief lowpass-filtered noise burst as the initial heave onset.

Both ramp gain in over 80ms on press, ramp out over 180ms on release. Wired into `startRetch`/`stopRetch` in the SpewPopup; `self.mode` picks which stream. Multi-grip works — each fresh hold gets its own onset.

### Inis O'Flatterly link rename
`[[Which book?|O'Flatterly's quest]]` → `[[Speak to him|O'Flatterly's quest]]` ([Dream Street Shuffle.twee:30022](Dream%20Street%20Shuffle.twee:30022)). The "Which book?" phrasing didn't make sense in context.

### French gating — completed-state opened up
Dr Quill reported "[NOT NOW]" appearing on his return after a French visit. Root cause: when all three French art-haunts (Sketch, Refusal, Debt) **AND** lily-5 are collected, the conditional rendered a hard greyed-out "[NOT NOW]".

**Fix:** the completed-French state now renders as a plain `[[Back to The French|Approach The French]]` link instead of greyed-out text. The "you missed something" prompt still shows for the "haunts done, lily not taken" sub-case. He can always walk back into the French now, which fits the hub-pub better.

### Orphan passage removal
`Watch them play` (was at line 33188) deleted — never referenced as a destination, only a leftover from an earlier ping-pong flow draft. Removed the passage and its mention in the music-categorisation JS array at line 2467. Passage count: 132 → 131.

### Source-of-truth bug audit before branching
Confirmed clean: no broken links, no TODO/FIXME/placeholder markers, all other "Back to X" venue gating properly checks venue-specific flags. The `(if: false)` block at line 29211 is the deliberately-disabled fetch glimpse (commented as such). Three other "orphan" passages flagged by the static analyser (The critic's judgement, Build Notebook, Deco Divider) are reachable via Harlowe macros the analyser doesn't follow — false positives.

### Milestone version stamp
Added an HTML comment to StoryInit marking v1 first draft milestone (date + branch info). Purely a marker, no runtime effect.

---

## Open threads (still hot)

From prior sessions, not yet picked up:

- **Title BEGIN link** — still bare text. Could be polished (gold-tint, small ornament) if Dr Quill wants.
- **Other 3D approach scenes** (`cecil-court-3d-static.html`, `pillars-of-hercules-3d-static.html`, etc.) — never reviewed.
- **Coin-toss overlay** (Donkey coin on return 2) — flagged as polish candidate, never got to it.
- **Notebook page** — never reviewed.
- **Three Pillars** (Mercy / Severity / Mildness) — banked as a major occult addition. See `project_three_pillars.md` in memory.
- **Astral-map screenshots** — Dr Quill never confirmed whether/where he dropped them in.

---

## Expansion direction

Dr Quill has not yet committed to a direction for v2-expansion. Pending his decision; possibilities discussed at session close included new venues, new haunts, new characters, a daylight/different-dream layer, or pulling Three Pillars off the bank. Wait for his lead.

---

## State at session close

All changes synced. He's on `v2-expansion`. Ready for the next thing.
