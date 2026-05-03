# Dream Street Shuffle — Session Handoff
Date: 2026-05-03
Focus: Audit-driven cleanup + opening restructure + dawn payoff expansion. Big-arc changes.

---

## ⚠️ Note on the previous HANDOFF (2026-05-02)

That handoff claimed the **Lily glimpse mechanic work was committed and pushed**. It wasn't. Commit `b3cc1fc updates` *did* land music volume, orphan archive cleanup, dual-ring timing, and the Lackland/Cecil Court badges — but the lily2 glimpse / first-glimpse hint / hover tooltip block never made it into the .twee. This session restored that work properly. Lesson: verify HANDOFF claims by grep before trusting.

---

## What this session did

### Audit

Read the .twee in passes (Title, Start, Night Ahead, Dean Street hub, both phone calls, Dawn, sample venues), then proposed an opinionated audit. Most of it landed this session. Kept open: atmosphere-beats item.

### Lily mechanic — RESTORED (the bit the previous handoff hallucinated)
- `$tookLily2` + `$lilyHintShown` flags added to StoryInit and Start.
- New **lily2 glimpse** in `Entering The Pillars of Hercules`, between threshold line and Hobson verse. Dr Quill's prose: *"There occurs, as you cross the threshold of the Pillars, a sonic peculiarity seen elsewhere, for instance, in the acoustic mirrors on Dungeness. If you stand in that precise spot and the atmospherics are favourable, you might hear a noise made at that same instant anywhere in Soho. You hear Lily laugh."*
- **First-glimpse hint** *(Gather flowers. There are five to find.)* on all 5 glimpse passages — fires once, suppressed thereafter via `$lilyHintShown`.
- **Hover tooltip** "X of 5 caught" added to the bells SVG, only present once `$lilyCount > 0`.
- New CSS class `.lily-glimpse-hint`.

### Icon hints (gradual introduction)
The hub used 4 icon families (◆ haunt, ✦ alba, ▲ word/meeting, ● object) with no explanation. Now: when the player first earns each type, a single italic gloss fades in below the choice list, then never again. Flags: `$hpHintShown`, `$alHintShown`, `$ppHintShown`, `$opHintShown`. CSS class `.icon-hint`. The four glosses are mine — Dr Quill can swap if they don't sit right.

### Diegetic stat feedback (stat murmurs)
Confidence and sobriety used to drop silently until something locked. Now: when each crosses 50 or 30 for the first time, a single-line italic murmur appears in the Dean Street hub. Flags: `$crossedConf50/30`, `$crossedSob50/30`. CSS class `.stat-murmur`. **Prose is Dr Quill's** (these are external voices in the bar, not internal sensations — much better than my proposed internal murmurs):
- Confidence < 50: *(Look after yourself, alright?)*
- Confidence < 30: *(Just be careful.)*
- Sobriety < 50: *(Steady on!)*
- Sobriety < 30: *(Are you sure you're alright? You don't look it.)*

If the player crashes straight past 50 to under 30, the deeper murmur fires and the milder one is silently marked done — no double-narration.

### Lily invite pulse
The lily SVG already breathes perpetually. Layered a one-time stronger glow + scale (40%-peak at ~1.7s after passage load) on first render of an uncaught lily, to make the click-target slightly more inviting on first encounter. Caught lilies (wrapped in `.lily-taken`) skip the invite — they keep breathing quietly.

### Great Ham flow fix
The Ham editor's note in The Pillars used to render as an inline lore-box (interrupting the venue prose). Converted to the existing collapsible `(link: "⟡ LORE: ...")[<div class="lore-box">...]` pattern that Watkins/Red/Ronnie's already use. Joke preserved, flow restored. Dr Quill's call: keep the joke.

### Vocab alignment
The French passage used `[NOT NOW, TRY ELSEWHERE]` for its venue-exhausted state while the rest of the game used `[DONE FOR TONIGHT]`. Aligned to `[DONE FOR TONIGHT]`.

### Cleanup
- Deleted 2 orphan passages with no callers: `Shana Refused`, `Success: Trisha's`. Dr Quill's call — said he doesn't value either and can recreate better later.
- Deleted 10 dead variables (36 `(set:)` lines): `$albaGiven`, `$breatherReturns`, `$exploredSinceFrench`, `$fightScore`, `$frenchDrinkDone`, `$mapPosition`, `$mapSeen`, `$notebookUnlocked`, `$shownMoraleWarn`, `$visitedCoach`. All set, never read.
- Deleted `TEST White page win` dev-test passage (dev shortcut).
- Cleared two leftover Claude-Desktop worktrees (`infallible-dijkstra-d53a08`, `strange-chatelet-ca5b5c`) and their branches at the start of the session.

### THE OPENING — split (the big structural fix)
The previous opening was a 25-line literary prose-poem before the player had any agency — gorgeous, but a wall for new players. Dr Quill suggested splitting at the natural fault line and revealing Part 2 after the first alba is collected. Done:

- **Night Ahead Part 1** (the cover story) ends on *"That'll work: it's a good book and God's a good man."* Same typewriter page. NAME YOUR BOOK button.
- **New passage `Night Ahead Part Two`** — same typewriter manuscript wrapper, but the SVG marks are slightly varied (wine ring moved from top-right to lower-left, burn marks rearranged, faint vertical fold crease added). Same paper, different page. Contains the truth-revealing prose: aubade, Lily, ghosts, the dawn. Continue button: **Dream On** → Dean Street.
- **`LINE 1` rerouted** — Red's farewell now goes `[[Dream On|Night Ahead Part Two]]` instead of straight to Dean Street. The flow: Red kisses you, the first alba line lands in your closed eyes, you walk away thinking — *"You've been thinking about the form of the aubade..."* — the truth surfaces.
- **`$nightAheadPart2Shown` flag** gates the passage so it only fires once.

The "cover story" line in Part 2 (*"Sure, try to sell the book, it's your cover story."*) now works as a reveal — the player **lived** the cover story, and is told it was the cover story.

### THE DAWN — expanded (the second big one)
Was 4 paragraphs. Now a designed final page:

1. **THE DAWN** title (existing, unchanged)
2. **`— (book title) —`** — book name surfaces in italic gold-amber under the title, with a letter-spacing tighten on fade-in. The manuscript arrives at the dawn.
3. The existing 3 lines of prose ("You have been awake for so long..." etc.) — instant.
4. **Staggered alba reveal** via `(after:)` macros — line 1 at 1.6s, line 2 at 3.4s, line 3 at 5.2s. The poem assembles like the morning arriving.
5. Existing petal-trigger closing line — unchanged.
6. **Lily flowering** at 6.4s — the bells SVG scaled to 150×170. With all 5 caught, it's an empty stem (petals released — matches the closing line). With fewer, the unclaimed bells remain visible.
7. **`Three Blue Posts`** colophon at 8s — italic, gentle, with a hairline border above. Like a publisher's mark in the back of the book the player just finished writing.

Dr Quill specifically rejected adding a "lily count" prose line (e.g. "X of 5 — the rest stay in the valley") — said *"not everything needs to be spelled out."* The bells visualization carries the meaning. Removed the placeholder text.

Pacing endorsed by Dr Quill — the slow exhale (~10s total) feels right, "should feel impulsive."

---

## Open items for next session

In rough priority:

1. **Playthrough verification** — Dr Quill is testing now. Things to feel for:
   - The new opening arc: Night Ahead Part 1 → NAME YOUR BOOK → Dean Street (Red corner only) → meet Red → first alba → Night Ahead Part Two → Dean Street (full hub opens)
   - The icon hints firing correctly the first time each type is earned
   - The stat murmurs firing at the right moments
   - The lily invite pulse on first render of each glimpse
   - The dawn ending fully — book name → staggered alba → bells flowering → colophon
2. **Atmosphere beats between acts** — open audit item. The hub is dense with menus, the venues with ritual; pure atmosphere is rare. A single passage of just-Soho prose between acts (fog, a busker, the smell of beer and rain) would give breath. **Needs Dr Quill's prose.** Dr Quill said this is for next session.
3. **Centre Point / "No more" ending parallel treatment** — the give-up path; could get its own modest expansion so it doesn't feel like an afterthought beside the new Dawn. Currently parked — Dr Quill didn't bite when offered.

---

## Workflow notes (unchanged)
- **Source of truth: `Dream Street Shuffle.twee`.** Never read `Dream Street Shuffle.html` (~3 MB compiled artifact with embedded base64 audio).
- After edits: `python3 sync_html.py`, then "synced, commit when ready."
- **Git stays in Dr Quill's hands** — no `git add` / `commit` / `push` from Claude. Dr Quill commits via GitHub Desktop.
- `HANDOFF*.md` is gitignored; safe to overwrite this file in future sessions.
- This session ran in the **main checkout** (not a worktree). Dr Quill switched away from the desktop app for this reason.

---

## Commit status
All changes synced to HTML. Working tree is ready to commit via GitHub Desktop. Passage count: 142 in the .html (was 144 at start; net -2 from orphan deletions, plus new Night Ahead Part Two, minus TEST passage).
