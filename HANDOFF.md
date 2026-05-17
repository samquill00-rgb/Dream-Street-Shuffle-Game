# HANDOFF — 2026-05-17

Long session, two major new features (**astral reveal at Centre Point**, **lily-memory polaroids**), one large structural rewire (**wake path forced through The Interval**), one new mechanic (**Work on it** — keep drawing the napkin from the notebook), plus a deep playthrough-fix pass.

---

## Major: Astral reveal at Centre Point

New SVG cosmic graph that fires once on first arrival at Centre Point. The night's wandering rendered as a galactic formation — Dean Street as the bright gold hub, every other passage a star, every `[[link]]` / `(go-to:)` / `(link-goto:)` a gold thread between them.

**Sources from the *actual* game graph.** The first pass was a procedural approximation; Dr Quill rightly said *"the point is sort of lost if it isn't actually the game"*. Now it reads the real `.twee` structure.

**Pipeline:**
- `sync_html.py` parses every passage's position, tags, and content; regex-extracts every link target; emits `window._DSS_PASSAGE_GRAPH = [...]` as a JSON literal substituted into the userscript via the `__DSS_PASSAGE_GRAPH__` placeholder. (Harlowe consumes the DOM `<tw-passagedata>` elements at boot so reading them at runtime doesn't work — they have to be baked.)
- `window.dssAstralReveal()` reads `window._DSS_PASSAGE_GRAPH`, projects each node onto a circular layout (hub-centric, sqrt-curve radial, quadrant-scaled so every direction reaches the rim), classifies by tag (hub=gold, dream/pyre/dawn=blue, outdoor/pong/minigame/fight=red, default=amber), sizes by degree, animates in over ~3s, holds ~5s, fades out, removes at 11.5s.
- Triggered from `Approach Centre Point` with `(if: $sawAstralReveal is false)`. Same race-fix as the Ripley's wheel (`setTimeout(0)` outer, `setTimeout(2400)` inner, `_passageGen` cancel-guard).
- The orphan-skip list in `sync_html.py` includes: `StoryInit`, `StoryData`, `UserScript`, `UserStylesheet`, `Lily SVG`, `Deco Divider`, `Build Notebook`, the rule-SVG passages, `Ending Vines SVG`, plus `Dream to Dean`, `Eat Shelleys Liver`, `Failure: Trisha's` (now orphaned by other rewires this session).

**sync_html.py also hardened.** When I added a comment inside the astral-reveal function that mentioned `<tw-passagedata>` literally, the cleanup regex `<tw-passagedata[^>]*>.*?</tw-passagedata>` matched the comment-mention and non-greedy-scanned forward all the way to the next real closing tag, wiping out the entire passagedata block AND the closing `</tw-storydata>`. Every sync after that ran on a permanently-broken template (Harlowe couldn't find any passages → `Cannot read properties of undefined (reading 'get')` at `Object.goToPassage` on boot). Fix:
- Rephrased the comment so the literal tag-name doesn't appear in the userscript.
- **Restructured `sync_html.py`** so the passage-cleanup regex now operates *only* on the slice of HTML between the `<tw-storydata>` and `</tw-storydata>` tags. Future stray mentions can't escape into the cleanup pass. See lines around `_sd_open`/`_sd_close` in the script.
- HTML template restored from last committed version via `git show HEAD:"…" > tmp`.

---

## Major: Lily-memory polaroids

Three memory passages (`$sawMemory1` St. Giles in the rain, `$sawMemory2` Late May / Oxford staircase, `$sawMemory3` "Troy after Troy" / her dressing) re-rendered as pinned-up Polaroids.

**Visual treatment:**
- Polaroid frame geometry: narrow top + sides padding (18px), **wide bottom strip** (62px) — the classic polaroid form
- Aged cream paper (`#ede2c2`) with subtle foxing spots, corner darkening, paper grain — *just slightly aged, not weathered*
- Rust push-pin at top centre, slight per-memory rotation (-1.7° / +1.3° / -0.9°)
- Dark "photo" interior holding a simple warm flare SVG (amber-orange / golden / peachy — same for all three structurally, just the gradient stops vary). Heavy CSS blur + film-grain vignette so the photo reads as a **failed development** — image never resolved, only the prose survives
- **Coloured halo BEHIND the polaroid**, not on the border: purple for Memory 1 (funfair), green for Memory 2 (Late May), orange-red for Memory 3 (Troy). Implemented via `.memory-photo::after` with `inset: -85px`, hollow-centred radial gradient, blur 34px. Polaroid card occludes the halo's centre; only the soft outer ring shows around the polaroid edges.
- Memory prose in **Kalam handwriting** (already in the project's Google Fonts import — block-print hand, more restrained than Caveat). Reads as ink across the photo.

**Memory text changes too:**
- Memory 1 **restored** (was orphaned — the Interval cleanup earlier in session had removed its trigger). Now fires once on first Interval visit between Lily passing and the alba3 reveal block.
- Memory 2 — "North Quad, St. John's College, Oxford." location anchor cut; memory now opens straight on "Late May night and the sexy airs of summer…". "sexy" preserved (Auden quotation).
- Memory 3 — middle abstraction trimmed. Cut from "It is not her beauty…" through "…something you could hold, kiss and make love to." The visual now flows straight from her in laced underwear to "Since then, and before it, life has rarely been so real. You'd burn Troy after Troy…"

---

## Major: Wake path forced through The Interval

Previously two of three wake-from-dream paths (`Dido` when haunts < 3, `Carthage shore`) routed via `Dream to Dean` — a thin one-line bridge passage on Dean Street with no payoff. Now **all** wake links go to **The Interval**, making it the canonical "what did you bring back" passage. Plus:

- Alba3 reveal **gate removed at The Interval**. Was originally `$haunts.length >= 11`, briefly lowered to `≥ 8`, then cut entirely so every wake-through reveals alba3 if not yet collected.
- `$visitedCarthage` is now set at The Interval (covers the bookkeeping that `Dream to Dean` used to do).
- **Cut the alba3 reveal from The Interval entirely** (later in session, Dr Quill called it the "preview of the third line" — unnecessary now that the structure forces every wake through here, and LINE 3 at Green Sea is the canonical alba3 reveal). The Interval is now purely the Lily-passing memory beat.
- `Dream to Dean` is orphaned but kept for safety.

---

## New mechanic: "Work on it" — keep drawing the napkin

The napkin portrait was the one inventory object with no use. **Now you can keep drawing it.**

- New `window.showNapkinPopup()` in the userscript.
- Notebook EFFECTS entry for the matchbook-style "Work on it" button next to the napkin display.
- Tapping opens a modal canvas (same dimensions, same toolset as the original Sketch the Painter passage: 6 colours + eraser, thin/thick brushes, undo/clear/done).
- **Loads the saved sketch as the starting state** (from `localStorage.dss_napkin`, written by Sketch the Painter's done-handler).
- Player adds more strokes. Undo rolls back this-session strokes only; the saved PNG underneath is the floor.
- On Done, flattens the canvas to PNG, writes back to localStorage, refreshes any visible `.nb-napkin-img` thumbnails immediately, plays `cameraShutter()`.

The sketch becomes a persistent canvas the player can return to from anywhere they have notebook access — implying the only thing they're actually MAKING tonight accretes across the night.

CSS lives in UserStylesheet under `===== NAPKIN POPUP =====` (replicates the original Sketch-the-Painter tool palette inside the modal).

---

## Trisha's matchbook — single canonical path

Was previously granted in five places (`Beaten`, `Fight Victory`, `Fight Victory Perfect` cellar arcs + `PP Victory`/`PP Defeat` pong vs Jack Curtis). Dr Quill flagged: too many ways in, "Jack Curtis sent you" line at the door inconsistent with Copper-route grants.

- Cellar Copper arcs no longer grant the matchbook. Trimmed the matches-related prose from each (e.g., "He presses a book of matches into your hand: 'Tell them Salvu sent you.'" → just "'I'm glad he turned you my way, son.'"). Preserved the confidence/sobriety boosts and the Copper Word path; the `Fight Victory Perfect` "leather-bound notebook" handoff stays.
- Matchbook is now **only granted by Pong vs Jack Curtis** (Win or Defeat — both gate on `$opponent is "Jack Curtis" and $hasTrishaMatchbook is false`).
- Trisha's hub link gate (`$hasTrishaMatchbook is true and $hasLiver is true and $metShana is false`) unchanged — still works. `Failure: Trisha's` passage now genuinely unreachable (added to the astral-skip list).

---

## Audio + pacing tweaks

- **Lily chime an octave down**: main tone E6→E5 (1318→659Hz), shimmer overtone B6→B5 (1976→988Hz). Same envelope, same vibrato — just the warmer register. (`lilyChime` function.)
- **Typewriter ticks restored on alba reveals**. Was disabled "to land in true silence under the bell"; Dr Quill wanted them back. Vol 0.09 (half the main typewriter's 0.18) so they sit *under* the distantBell rather than fighting it. Spaces / newlines / tabs stay silent.
- **Midnight bell removed**. The chime fires only from the alba revelation-box flashObserver now; the midnight transition (24.11.73 flare) keeps the visual animation but no audio. Dr Quill: chime should only be on wisdom moments, not on calendar tick.
- **Lily phone call auto-dismiss** dropped from 30s → 16s. Manual "Hang up." link still appears at 10s. Then `.lily-glimpse` margin/padding tightened so the sonnet-66 closing quote sits closer to the Hang up link, not floating well above it.

---

## Pong + punch + waltz

- **Pong: first-to-3 flat** (no deuce loops). Killed the "win by 1" rule that was looping 2-2 → 3-3 → 4-3. AI bias range narrowed from −1.5/+0.8 to −1.0/+0.6 so the AI feels like the same opponent throughout. Inter-rally pause 1100→800ms; countdown 2400→1800ms.
- **Punch scoring key**. Pip row now captioned `WIN @ 6 · PERFECT @ 9` during practice; during real rounds shows `5 · 1 to win · perfect @ 9` with live count + distance. Updates on every `showResult()` so the player can read where they stand at all times.
- **Waltz auto-advance via `Engine.goToPassage`**. The old MouseEvent-dispatch path was unreliable; now 700ms after the waltz lands, `window.Engine.goToPassage("O'Flatterly's shop")` is called directly. Falls back to the dispatched-click if Engine isn't reachable. The "Onward, then." link stays `display:none` — player never sees it.

---

## Eat liver — inline, no navigation

The "Eat it" button in the notebook used to `(link-goto:)` to a separate `Eat Shelleys Liver` passage. Sam: *"you should stay wherever you are."*

Now the notebook button is `<div onclick="...">Eat it</div>` that fires `showLiverPopup()` over the current passage and, on `liverpopup:closed`, writes the state changes directly into Harlowe via `Harlowe.API_ACCESS.STATE.variables` (`hasLiver = false`, `confidence += 22` capped at 100, `sobriety += 40` capped at 100). The `Eat Shelleys Liver` passage is now orphaned but kept for safety.

Same pattern as the cigarette button — popup + state update + no navigation.

---

## Coach plumbing intro

Two fixes:
1. **Fires once only** — `$seenCoachPipe` flag in StoryInit. Both the cosmic-sewer audio call AND the pipe SVG markup are now wrapped in `(if: $seenCoachPipe is false)[(set: $seenCoachPipe to true)…]`. Repeat visits to gents skip the intro.
2. **Landscape fix** — SVG `preserveAspectRatio="xMidYMid slice"` → `"none"`. On a wide viewport the pipe rings become wide ovals (corridor) rather than circles cropped top-and-bottom; water pool spans the bottom edge.

---

## Yeats stanza, Dido link, other prose nips

- **Yeats / Spenser stanza** at "Talk to the Artists" trimmed from 7 lines to 4, with `[…]` marking the cut between the Spenserian middle and the closing Yeats line. Both source-flavours preserved.
- **"Sub umbras: watch her burn"** link at Dido's pyre → **"Lie down beside her"**. Picks up Dido's own invitation from the prose two lines above ("Lie down beside me, now.") so the link reads as a direct answer to her speech rather than a Latin reference players only get if they clicked the LORE box.
- **"you have ghosts to lay to rest"** → **"there are ghosts to lay to rest"** in The Night Ahead.
- **"said Salvu"** → **"says Salvu"** on the door-opening line at Copper's Lair.
- **Editor's note (Great Ham)** — blank lines inserted between "Editor's note:" and the Dr Johnson paragraph, and between the Dr Johnson and Ian Hamilton paragraphs.

---

## Earlier audit-pass items

Front of session — playthrough audit before the big features:

- **`LILLIES` → `LILIES`** notebook tab typo fix.
- **Hub date strip removed.** The `<span class="scene-date">23.11.73</span>` on Dean Street is gone in steady state. The 3D approach scenes still carry the diegetic datestamp. The midnight flare animation is preserved — date span only renders during the brief flip moment.
- **Stats bar tightened.** Padding 22/16→16/10, vertical gap 10→6. Bar is ~14px shorter. Passage top-padding 110→92.
- **Hub reading column widened.** `tw-story[tags~="hub"] tw-passage` bumps `max-width` 650→780. Stats bar widens to match. Prose passages stay at 650.
- **Notebook tabs restyled.** Courier New → **Special Elite** (already loaded), wider letter-spacing, thinner weight. Matches Name Your Book + Dawn title typewriter family.
- **FINDS notebook key expanded.** Previous 3-icon key (◆ Haunts / ▲ Words / ★ Quests) now shows all four pairs with done/pending: `◆ haunt caught · ◇ still to catch`, etc.
- **Faint ambient gutter wash** on hub pages — `tw-story[tags~="hub"]::before/::after` paint very low-opacity amber radial gradients at the viewport edges. Lifts the dead space around the narrow column without disturbing the central reading area.

---

## ALBA matchsticks — tried, reverted

Tried replacing the three ALBA gem-diamond markers with vertical matchsticks (wood stick + sulphur head, with flame animation when lit). Dr Quill (correctly): *"it's made a little cigarette lighter… should be the Gem alba counter."* Reverted. The matchstick visual got repurposed on the **matchbook entry** in the notebook EFFECTS panel instead — a row of N matchsticks representing remaining matches, with spent ones rendered as burnt stubs. That landed well.

---

## State of the live code

All today's changes synced to `Dream Street Shuffle.html`. `sync_html.py` extended with passage-graph baking + the hardened cleanup regex. The HTML template was restored from the last commit at one point (due to the regex blowup); after fixing the regex, syncs are stable.

---

## Memories added/updated today

No new memory files written this session. The prior memories about Harlowe class-attribute traps, SVG-in-macro newline issues, Chrome MCP usage etc. all continue to apply.

---

## Open threads for the next session

- **Last big task pending** — Dr Quill flagged before closing the handoff: there's one more major thing to do tonight. Whatever it is, it follows the polaroid-halo work just completed.
- **`Dream to Dean` and `Failure: Trisha's`** — both orphan passages now, in the astral-skip list. Could be deleted entirely later or kept as safety nets.
- **Notebook page** — never reviewed end-to-end. EFFECTS panel got a lot of attention (matchsticks, sketch, liver inline), but FINDS / LILIES / POEM / TREE / MAP didn't get fresh eyes today.
- **Three Pillars** (Mercy / Severity / Mildness) — still banked.
- **Astral-map screenshots** banked by Dr Quill on 2026-05-13 — never committed to a use, partially superseded by the live astral reveal at Centre Point.
- **Title screen BEGIN link** — still bare text per the prior handoff.
- **`Eat Shelleys Liver`** passage now orphaned (inline-button path replaces it). Same with `Dream to Dean`. Tagged in `sync_html.py` skip list so they don't pollute the astral graph.

---

## Things considered and intentionally NOT done

- **Memory 2 "sexy airs" cut** — declined (Auden quotation, intentional).
- **Inventory roadmap names hidden until earned** — flagged in audit, decided to keep as-is (the names are part of the teasing).
- **Adding prose after the Marvell verse at Memory 2** — declined; the cut from photo → Marvell → Dean Street is the right brevity.
- **Memory passages getting elaborate per-memory atmospheric SVGs** — initially tried (funfair arch, Oxford staircase, sash window). Rejected in favour of simple coloured flares ("failed photo" mood) plus an external halo carrying the colour identity.
