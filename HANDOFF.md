# Dream Street Shuffle — Session Handoff
Date: 2026-05-04
Focus next session: **atmosphere beats between acts** (Dr Quill is in the mood to write the prose).

---

## What this session did

A long playtest pass with many small fixes plus one design move (haunt-box progress pointers).

### Opening flow — restructured around the new ordering
Re-ordered the opening sequence per Dr Quill's spec:

1. Title → **Night Ahead Part 1** (cover-story typewriter) → link **"Step into the night"** → Dean Street.
2. Dean Street first visit (Red corner only) → meet Red → first alba.
3. **Night Ahead Part Two** (truth-revealing typewriter) → link **"Name your book"** → Name Your Book.
4. Name Your Book → link **"Back to Dean Street."** → Dean Street (full hub).

Manuscript line in Dean Street is now gated on `$returns is 1`: first visit reads "In your bag, you have your novel, in manuscript…" (no title); later visits read "…you have //{book title}//, your novel…". Dr Quill's call (option A).

### Bug fixes — playtest-driven

- **Stray `\` at the bottom of first Dean Street.** Trailing backslash on the closing `]` of the empty `(if: $metRed is true)[…]` block was rendering literally. Removed.
- **Alba hint position.** `.alba-hint` text "One line is caught. Two more still to find." (was "One line caught. Two more, somewhere out there.") and "Three lines are hidden in the night" branch removed entirely. Pushed `bottom: -22px` so it sits below the alba count instead of overlapping.
- **French visit counter.** Was using `(history:)'s last`, which in Harlowe 3.x includes the current passage — so the check never matched. Replaced with explicit `$frenchApproached` flag set in "Approach The French" and consumed in "The French". Lily-call returns and drink-loop returns now correctly leave the counter unchanged.
- **Lore-box flash defensive fix.** Added an `animationend` listener that locks `tw-passage` opacity once the `passageFadeIn` animation completes, so any in-place mutation can't replay the fade. Whether this was the cause of the reported flash is unverified — Dr Quill should confirm.
- **Coach and Horses gents.** Removed `[insert sponsored drink]` placeholder + the Krug drink popup. Renamed the recovery link from "Recover." to **"Retch."** so the existing `SpewPopup('gents')` animation reads as the action it triggers.
- **Removed "Head for the night bus" link** from `The critic's judgement`. With the night-bus path gone, **`Meet Jeffrey Bernard` passage** (its only target) was orphaned and deleted. Bernard / cow ride is now reachable only via the Coach gents wake-up.
- **Cow ride success — alba 3 leak.** The italic "Go For Dinner With Billy Piper." line was pre-revealing alba3. Removed. Alba3 is now revealed only after the player clicks "Listen → Closer" on `LINE 3`.
- **Cow ride done-once.** Added `$cowRideDone` flag (set on either win or fail). The minigame's skip logic uses `$cowRideDone` to fast-forward to either `Cow ride success` or `Cow ride fail` on revisit. Defensive — the entry from Coach is one-shot anyway.
- **LINE 3 reveal text + exit link.** Conditional on alba1 + alba2:
  - All three caught → "It is written. You shall get out alive. **THE THIRD LINE. THE ALBA IS COMPLETE.**" + guided link "The dawn is coming" → Approach Centre Point.
  - Otherwise → "**THE THIRD LINE.** There are still lines hidden in the night." + link → Dean Street.
- **Things turn up passage** — deleted (was the dead-end after alba3 with the "Here is your throat back" prose).
- **Moe D'Alcousin introduction.** At Ronnie Scott's: "Onstage there are three: Moe D'Alcousin on the saxophone, a pianist, and a guitarist." So when Moe nods later in `The Set`, the player knows who he is.
- **Great Ham revisit.** Once `$metCritic`, the Pillars link is now `[The Great Ham [DONE FOR TONIGHT]]` (greyed) instead of replaying the dialog.
- **Davy Merkin re-entry to Colony.** Dean Street greyed out the Colony Room as `[DONE FOR TONIGHT]` as soon as `$knowsRonnies` was true — so going to the famous agent first locked the player out of the drunk and the Lackland password. Now requires both `$knowsRonnies` AND `$knowsCopperSecret` to grey out.
- **`$coachUrgent` was sticky.** Once it triggered (sob ≤ 0 + ≥3 haunts), it never reset, so the Dean Street menu stayed locked to the single Coach link forever — chippy and every other venue stayed hidden. Now reset to false on entry to the Coach gents.
- **Bad-state hints had no links.** The "very bad way" branch (`conf<30 AND sob<30`) showed only prose. Now offers the chippy link (if not yet eaten) and the doorway link (if not yet used). The middle branch (`conf<40`) also offers the chippy.
- **Camera shutter on napkin save.** Added `cameraShutter()` to the audio module — two-phase mechanical click (sharp open + heavier close ~85ms apart, with low triangle-wave thunks underneath). Fires the moment the napkin gets framed in `Sketch the Painter`, just before the localStorage save and the 1.8s pause to "Give him the painting".
- **Third French visit spacing.** Added `\` line continuations after the haunt-conditional blocks so empty (hidden) ones don't leave naked newlines. "There is always a third." now sits one paragraph above "In the corner, you spot a familiar face…".
- **Quest motes + notebook QUESTS section.** Added `quest-collected` class to the QUEST div in O'Flatterly's quest, registered with the mote spawner, styled `.quest-mote` as brass-gold. Added new QUESTS section in the notebook FINDS panel, gated on `$knowsAboutPage`: states cycle open → in-progress → returned.
- **Password Deploy buttons in the notebook — two bugs.**
  1. `$awaitingLacklandPwd` was never set to true anywhere in the source (only ever reset to false), so the Deploy button for Lackland never appeared. Fixed: set true when the password input renders in `Martin Lackland's Office`.
  2. `deployPwd()` was clicking the hidden tw-link directly, but Harlowe's `Engine` refuses passage navigation while a `(dialog:)` is up. Refactored to the same close-then-navigate pattern as `eatLiver`: close the dialog via Harlowe's own close link, then `Engine.goToPassage` after a 60ms tick. Both Copper and Lackland deploys now route correctly.

### Design — haunt progress pointers (option X)

After a discussion of how to expose progression more clearly, Dr Quill chose **Option X**: keep all gates as they are (NPC-driven, narrative), and surface progress in two places.

- **Inline gate on Centre Point in the Dean Street menu**, mirroring the existing `[FIND PAGE 47 FIRST]` pattern:
  - Alba count = 1 → `Centre Point [TWO MORE LINES OF THE ALBA]`
  - Alba count = 2 → `Centre Point [ONE MORE LINE OF THE ALBA]`
  - Alba count = 3 → existing `[The dawn is coming]` guided link.
- **Haunt-box gets two new lines**:
  - A `.haunt-progress` count under every haunt: `X of 8 caught` (small caps, dim).
  - A `.haunt-opens` line above the count for the four haunts that flip a gate, in a thin gold rule:
    - **The Refusal** → "*You know Cecil Court very well.*"
    - **The Beast** → "*You know Martin Lackland, but you'll need a word to bring him.*"
    - **The Debt** → "*Two doors open: The Pillars, The Colony.*"
    - **The Game** → "*An invitation to Trisha's.*"
  - The Sketch / Delivery / Head / Wound get count only.

Refusal and Beast prose are Dr Quill's own. Debt and Game lines are mine — placeholders if Dr Quill wants to revise.

### Map — design only, NOT yet implemented

Dr Quill confirmed the design but I haven't built it yet. Plan for the map (in the notebook) when next implemented:

- **Three-tier pins instead of two**: sealed (tiny dim dot, no name) / known but unvisited (current dim gold) / visited (current gold). No hints on the map itself — Dr Quill prefers progression cues stay in the menu and haunt-boxes.
- **Centre Point as end-destination pin**: larger spire/crown glyph at the top of the map, gold halo that grows with alba lines, "*destination*" label.

This is the next coding task after the atmosphere prose lands.

---

## Open items for next session

### 1. Atmosphere beats between acts (THIS SESSION'S FOCUS)

Carried from previous handoff. The hub is dense with menus, the venues with ritual; pure atmosphere is rare. A breath-passage in just-Soho prose between busy beats — fog, a busker, the smell of beer and rain — would give the player a moment to inhabit Soho without making decisions.

**Dr Quill is in the mood to write the prose.** Two design questions to settle before scaffolding:

- **Where it fires.** Candidates: between leaving a venue and arriving back at Dean Street; on a return after a phone call; on the second visit to a venue. Or one-off triggers tied to specific moments (after the first phone call, after the cow ride, after returning Page 47).
- **Whether it's one passage that varies, or several.** A single reusable atmosphere passage with random or context-conditioned prose, vs. distinct hand-written breath beats placed at specific seams.

Once Dr Quill knows the prose he wants and the seams he wants it at, the engineering is light: a passage (or several) tagged with a quiet ambient bed, an `(after:)` auto-advance link or a single click-through link, and a small set of `(go-to:)` redirects from the seams to the breath-passage and back.

### 2. Map tier system + Centre Point destination treatment

Designed and signed off, not yet implemented. See above.

### 3. Lore-box flash — verify the defensive fix

Dr Quill should playtest and confirm whether the `passageFadeIn` lock actually fixed the reported "page flashes when opening lore boxes" issue. If not, the next escalation is converting `<div class="lore-box">` inside `(link:)` hooks to `<span class="lore-box" style="display: block">` to prevent HTML-parser ejection of block-level children from inline link hooks.

### 4. Em-dash audit (low priority)

Dr Quill flagged a stray em-dash somewhere they want as a full stop, but I couldn't pin it down from the source alone. If it's still showing on a playthrough, send the screenshot or quote the line and I'll find it.

---

## Audit at session close

Verified all changes from this session are present in the .twee and synced to .html (passage count: 140; was 142 at the start of the session — net -2 from `Things turn up` and `Meet Jeffrey Bernard` deletions). Spot-checked:

- Opening reorder links present (`Step into the night`, `Name your book`, `Back to Dean Street.`).
- First-visit manuscript gate fires on `$returns is 1`.
- Alba hint repositioned to `bottom: -22px`, new text in place, old "Three lines are hidden..." branch gone.
- `$frenchApproached` flag wired through StoryInit / approach / french / reset.
- All four deletions clean (no stray references to night bus / Things turn up / Meet Jeffrey Bernard / sponsored drink).
- `$cowRideDone` referenced in 5 places (init, success, fail, JS span, JS guard).
- `cameraShutter` defined, exported, called.
- `quest-collected` class on the O'Flatterly quest div, `quest-mote` styled and z-indexed, QUESTS section in notebook.
- `$awaitingLacklandPwd to true` set in office; `deployPwd` uses `Engine.goToPassage`.
- Centre Point progressive hints both branches present.
- 10 `.haunt-progress` lines (8 boxes + CSS rule + something), 6 `.haunt-opens` (4 boxes + CSS rule + extras).

---

## Workflow notes (unchanged)

- **Source of truth: `Dream Street Shuffle.twee`.** Never read `Dream Street Shuffle.html` (~3 MB compiled artifact with embedded base64 audio).
- After edits: `python3 sync_html.py`, then "synced, commit when ready."
- **Git stays in Dr Quill's hands** — no `git add` / `commit` / `push` from Claude. Dr Quill commits via GitHub Desktop.
- `HANDOFF*.md` is gitignored; safe to overwrite this file in future sessions.

---

## Commit status

All changes synced to HTML. Working tree is ready to commit via GitHub Desktop.
