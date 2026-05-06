# HANDOFF — 2026-05-06 (session 2)

A long session of minigame coherence fixes, an audit, a real-player playthrough, and a string of small narrative + UI edits. Everything is synced and ready to commit.

---

## Minigames — all five reworked

### Cellar Fight
- **Threshold honest:** was `>= 4` of a misleading `/4` denominator (max possible score is 9). Now **6 of 9**, displayed as `Score: N/9`. Copper's intro: *"Score six and you're standing."*
- **Counter recoil:** new `copperHit` flag. On a successful counter, Copper jerks UP/back instead of throwing his punch — fists frozen at the wound-up position, body sin-curve recoils. The other three outcomes (clean dodge, block, caught) keep the original animation.
- **Stand your ground wired up.** Was an orphan passage with full content (`+6 confidence`, the "Silly bugger" beat). `Copper confronts` now offers both `[[Brace yourself|Fight starts]]` and `[[Stand your ground|Stand your ground]]`. The defiant route's outgoing link renamed `Brace yourself → All right, then.` so three "prep" labels in a row stop reading as the same thing.
- **Instructions redesigned.** The cramped one-line strip is gone. New 3-column scoring **table** (Move / How / Pts) with a footer line *"3 rounds · max 9 points · score 6 to stay standing"*. Moved **above** the canvas (was below). Practice-over narrative simplified to *"Practice over. Now for real."*
- **Practice round label fix.** Was just `PRACTICE 1/3` — read like a counter, not round numbers. Now `PRACTICE ROUND 1/3`. (Real rounds: `ROUND 1 — Score: 0/9`.)

### PP Pong
- Score reads `YOU N — N OPPONENT` with **paddle-matching colours** (YOU in cool blue, opponent name in warm red-orange) so you can tell whose paddle is whose.
- New subtitle: `first to 3` → `match point` (when either side hits 2) → `decider` (at 2-2). Clears at game end.
- Case-flicker fixed (`Jack Curtis` → `JACK CURTIS` flash gone — div starts empty, JS paints first frame).
- `round` renamed to `rallyCount` with a comment explaining it's the ball-speed escalator.

### Bernard's Cow
- **Live `DODGED N` counter** in the top-right HUD during the real game; final tally on the end screen.
- **`RIDE AGAIN` button.** Auto-`setTimeout`-navigate retired. Two real buttons now: `RIDE AGAIN` resets state and goes straight to the countdown (skips practice on retry); `CONTINUE` calls `navigate()`. Music ticker no longer self-clears on game-over.
- **Win narrative:** *"You reach the end of Soho at Charing Cross Road."* Title-screen tagline matched. Old "she lay beside me in the dawn" couplet retired.
- **Practice halved** 12s → 6s.
- **Spawn fairness rewritten.** Every existing obstacle is now projected forward to the player's row (with drift) before the safety check. Drift itself capped at ±0.15 px/frame (was up to ±1.6) and only kicks in at tier 5+. Wide vehicles need two adjacent free lanes at the projected arrival, not just three currently-free anywhere. There should always be a path.

### Jazz / Bar minigame
- **Pour decoupled from the win.** Result screen now reads **`DELIVERED N/3`** with three star slots (lit per glass delivered) plus a one-line tagline (`A clean run.` / `Most of it home.` / `One survivor.` / `The tray came up short.`). Misleading combined `SCORE: total/9` removed; pour accuracy is decorative-only via the per-drink stars in the sidebar.
- **Every hit wobbles.** The "jumping into a high obstacle = instant glass loss" branch is gone. All hits route through the wobble-then-drop logic.
- **Always passable.** `combo_low_high` inner gap raised 300–360px → 410–500px so jump airtime (~330px at full speed) fits between low and high.
- **Bar Canvas Lose rewritten** from vague *"you got something wrong"* to *"The tray reaches the stage with nothing on it. Moe takes a long breath. 'Without, then.' The pianist counts it in anyway: UNO… DOS…"*
- **Music plays the entire minigame.** `startBarGame` now creates `_jazzMiniEl` immediately (was waiting for `_startCarryTransition`, leaving the mixing phase silent).

### The Sketch
- **`Done` gated** until at least one stroke exists (CSS `[disabled]` style; first mousedown enables it). Empty-napkin → "He smiles and gives it back" mismatch eliminated.
- **`Undo` button** between Clear and Done. Pops last stroke, redraws background + replays remaining.
- **Brush size + eraser.** Two pip buttons (thin 3.2px / thick 7px) and a sixth colour-circle eraser (paints napkin cream over user strokes). Each stroke records its `width` so Undo, Clear→Replay, and the framed reveal preserve thickness.

---

## Audio + typewriter

- **`typewriterTick` cleaned up.** Buffer 40ms → 20ms, envelope sharpened, explicit `src.stop()` (was the only sound function lacking it). No more click-tail bleed across rapid typing.
- **Generation guards on both typewriters.** `typeNext` (main typewriter-page) and `albaTypewriter` (revelation-box reveal) now capture `window._passageGen` at start and abort on passage swap. Stops all chains the moment you navigate away — no ticks bleed onto the next passage.
- **Speed:** original 28ms baseSpeed → 14ms (too fast per playtest) → **20ms**. Punctuation pauses tuned to match (period 170, comma 70, newline 110, intro delay 650).
- **`Approach Coppers Lair`** retagged `[outdoor] → [venue-cellar]` so the cellar-pump ambience plays instead of street/wind.

---

## Name Your Book passage

The biggest single visual fix.

- **Layout aligned with other passages.** `tw-passage:has(.book-naming-tw) { padding-top: 1.5em !important; }` plus hiding the empty `<tw-include>` and stray `<br>`/`<tw-consecutive-br>` siblings. Cream paper now sits at `top ≈ 102px` with full content visible — no scroll.
- **Textarea forced to `rows=1`** (Harlowe was rendering `rows=2` despite the `1` arg). Source HTML lines joined to suppress break-induced BRs inside the box.
- **Auto-shrinking title font.** `1.85em` ≤12 chars, scales down through 1.55 / 1.3 / 1.05 to 0.85em (>28 chars). Set via `style.setProperty('font-size', size, 'important')` to override the CSS `!important`. Long titles like "Soho's Last Aubade" stay visible end-to-end.
- **Auto-focus no longer scrolls.** `ta.focus({preventScroll: true})`.
- **Frame more square** per latest playtest: `min-height: 380px`, padding bumped up.

---

## "Word to the wise" popup
The hint popup (and its sibling `moraleWarningPopup`) were only dismissing on **background** clicks (`e.target === overlay`). Click on the inner box did nothing. Both fixed: dismiss on any click + Escape key + listener teardown.

---

## Donkey coin
- Modal coin shrunk 120px → 70px with a wider gap before the description text.
- "Pocket it" button stays hidden until the first toss — confirmed intentional design.

---

## Logic gates
- **Colony Room** no longer requires `$knowsCopperWord`. Open from the moment you've visited The French.
- **"Seek the coast — beyond The Pillars"** now needs `$knowsAboutPage` (O'Flatterly's quest) in addition to `$metCritic`. Carthage doesn't open until O'Flatterly has mentioned it.

---

## Narrative / text edits
- **Haunts explainer** (10 instances): `the night's work` → `the night's Great Work`.
- **Critic conversation:** added `<p class="script-line">You.</p>` markup to "I like books…" so it matches the Him./You. format above.
- **Salvu line:** "a big man in a small body, the other way round" → "**or** the other way round".

---

## Audit findings (resolved)
- No broken `[[…]]` / `(go-to:)` / `(link-goto:)` targets.
- No `page 47` residue (rename to 93 is clean).
- No undefined Harlowe variables.
- No `TODO`/`FIXME` markers.
- Stat clamping at Dean Street + Build Notebook covers all return paths.
- Audio beds registered for every `venue-*` tag in use.
- Removed: empty `// TEMPORARY BACK BUTTON` IIFE; `DEAD_BLOCK_START/END` comment block in `_drawResult`.

---

## Files of note
- `Dream Street Shuffle.twee` — 145 passages, all session changes synced
- `Dream Street Shuffle.html` — compiled output (do not read; sync via `python3 sync_html.py`)
- `wheel-preview.html` — still at project root, awaiting your keep/delete decision

---

## Real-player playthrough — verified live in Chrome
Walked Title → Night Ahead → Ginger Light (Red, alba 1/3) → Aubade essay → Name Your Book ("Soho's Last Aubade") → Dean Street + Donkey coin → The French + John St. John (THE DEBT haunt) → Pillars + Aoife phone call → Critic + password "I said hello" → back to Dean → Donkey toss = Heads = Left → Copper's Lair → password accepted → Cellar fight intro.

All ten of your end-of-session notes were addressed in the last sweep:

| # | Note | Done |
|---|---|---|
| 1 | Typewriter slightly faster, slow it again | ✓ baseSpeed 14 → 20 |
| 2 | Name Your Book a little longer / more square | ✓ min-height 380, padding bumped |
| 3 | Coin modal: smaller coin, more space above text | ✓ 120 → 70px, margin 1.2em → 2.4em |
| 4 | Haunts text: "the night's Great Work" | ✓ 10 instances |
| 5 | Why a word for the Colony? | ✓ gate removed |
| 6 | Critic: "You: I like books…" | ✓ script-line markup |
| 7 | Seek the coast opens too soon | ✓ now needs `$knowsAboutPage` |
| 8 | Wrong sounds at Coppers Lair approach | ✓ tag changed to `venue-cellar` |
| 9 | Salvu: "or the other way round" | ✓ |
| 10 | Practice rounds say just "Practice" | ✓ now `PRACTICE ROUND N/3` |

---

## Possible next threads
- Decide on `wheel-preview.html` — keep as reference or delete before pushing.
- The textarea visual scrolling on long book titles is mitigated by auto-shrink, but a future polish would be a custom `<input>` with right-anchored ellipsis if you want to support very long titles cleanly.
- Item 5 of the esoteric-layer bank ("book title as true name") still on the table for prose work.
- The Donkey coin's current behaviour (Pocket it hidden until first toss) is intentional but doesn't show "Pocket it" prompt at all initially — you've confirmed this is the intended flow, but it's worth re-checking with a fresh playtester to see if "Toss it / Pocket it" is discoverable.
