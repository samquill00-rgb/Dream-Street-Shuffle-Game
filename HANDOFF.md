# HANDOFF — 2026-05-07

A long polish session: a new post-cellar narrative beat (Standing + The dark pass), three new tactile interactions (cigarette / page-turn / cellar door knock), a wheel-reveal relocation, music ending re-rigging, and dozens of audit-driven fixes from real-player playthroughs. Everything is synced and ready to commit.

---

## New narrative beats

### Cellar → Standing → The dark pass

Replaced the threadbare `Escape success` (one line of prose) with **`Standing`** — JSJ leans on the cellar doorframe at the top of the stairs, says "You lead a charmed life", falls in beside you onto Dean Street, drops the *"Red told Copper you had money"* line. Mirrors `Beaten` structurally but the tone is dry-impressed rather than reluctantly miffed.

Both cellar exits (`Standing`, `Beaten`'s knowsCopperWord branch, `St. John's Word`) now route through a new transit passage **`The dark pass`** — a typewriter-page cold pass: you watch JSJ peel south down Dean Street, Red walks into the frame at the far end under the ginger light, neither sees the other. Routing updated:
- `Fight Victory` → `Standing` (was `Escape success`)
- `Beaten`'s matchbook branch → `The dark pass`
- `St. John's Word` → `The dark pass`
- `HUB_NAMES` JS object updated (`Escape success` → `Standing`)

### Cigarette popup (hold-to-light)

`window.showCigarettePopup()` — match strikes when you press, flame catches as you hold (1.5s LIGHT_MS), cigarette ember ignites and glows. Uses existing `matchStrike` audio, animates an inline SVG of paper + filter + matchstick + flame. Auto-fires 5.5s into *The dark pass* once the prose has settled. Reusable elsewhere.

### Page-turn at the Critic

Replaced the inline "He pulls *(book)* close, reads, …'Not for me'" prose block in *The critic's judgement* with an interactive book widget. Click **"Wait."** four times — a CSS 3D page-flip animation runs (1.1s rotateY transform), `pageRustle` audio fires per click, narration updates beneath the book. POV is the player's: you sit watching him read, time advancing on each click.
- `He sets it on the table and opens it.`
- → `He reads a page in the middle.`
- → `He turns to another page and reads there too.`
- → `He skips ahead, scans a third.`
- → `He sets the book down. 'Not for me,' he says. 'Have you tried America?'`

After the verdict, `.critic-aftermath` fades in (1.2s opacity transition) carrying the rest of his speech and the `PASSWORD LEARNED` item-box. Mote spawning for the password is **deferred** — pre-marked `data-motes="1"` so the global observer skips it, then `window.dssSpawnMotes()` is called manually 1.5s after aftermath reveals. Motes file the password away as the moment ends, not while he's still reading.

### Coppers Lair — interactive knock

`Maltese Gangsters` rewritten. Replaced the auto-firing `doorKnock(3)` with a player-driven ritual: three open circles `○ ○ ○` and a `KNOCK` button. Each click fires `doorKnock(1)`, fills one circle, with a 240ms anti-mash guard between clicks (knocking takes intent). Third knock disables the button, pauses 800ms, then `doorCreak` plays as Salvu's prose reveals; existing 4.5s navigation timer follows.

---

## Audio system

### `dssSpawnMotes` helper

Extracted the mote-spawn logic from the global passage observer into a window-exposed helper:
```js
window.dssSpawnMotes(box, cls, count)
```
Mirrors the observer's logic (start position, jitter, --mote-tx/ty CSS vars, notebook pulse). Used by The critic's judgement to defer the password's motes; available for future custom flows.

### Mote strength buff

Per Dr Quill's "make them stronger" — every mote type (haunt / revelation / page / item / quest):
- **Count 12 → 18** in JS spawner; six new `-13` through `-18` rules per type with delays continuing 3.40s → 4.40s.
- **Base size 8×20 → 12×28**; tail mote sizes scaled up (small-end was 3×9 → now still ends 3×7, but intermediate motes are 9×22, 8×19, 7×16, 6×15, 5×13, 5×12, 4×11, 4×10, 3×9, 3×8, 3×7).
- **Brighter centres**: gradient inner alpha 0.85 → **0.98**, mid-stop 0.5 → **0.68**.
- **Stronger glow**: box-shadow radii 18/36/60 → **26/52/88**; alphas 0.7/0.45/0.3 → **0.88/0.6/0.42**.
- **Sharper**: `filter: blur(0.6px) → blur(0.3px)`.
- **Higher peak opacity**: keyframe `0.92 → 1.0`, mid 0.80 → 0.92, late 0.45 → 0.55, scale 1.1 → 1.2.

### Music ends honestly

New `dssAudio.letBedFinish(label)` — disables `loop` on the bed's `BufferSourceNode` and stops via `onended`. The bed's current pass plays through to its real coda then halts naturally. `startPetalStorm()` now calls `letBedFinish('piano-eoin')` instead of the previous `fadeBed`. Music reaches its actual end at the dawn rather than being faded mid-phrase.

### Pong music + countdown

The `_pongMiniDataUri` / `_jazzMiniDataUri` / `_cowGameDataUri` placeholders were never being substituted by `sync_html.py`. Added three new tuples to `AUDIO_EMBEDS` for `the-pongmini-loop.m4a`, `the-jazzmini-loop.m4a`, `the-cowgame-loop.m4a`. Pong music now plays.

Also added a 2.4s 3-2-1 countdown to PP Pong before the first serve. Phase machine: `phase = 'countdown'` initially, becomes `'play'` after `COUNTDOWN_DUR ms`. Player's mouse moves the paddle during countdown so they can settle in; AI paddle holds; ball stays centred.

### Typewriter timing + click cleanup

Iterated through several speeds and bug fixes:
- **`baseSpeed` 20ms → 55ms → 42ms** (final). Punctuation pauses scaled proportionally — period 260 → 220ms, comma 130 → 110ms, newline 200 → 170ms. Random jitter ±5.
- **Intro delay 650ms → 350ms** so the first click lands while the page is still settling.
- **Pre-warm tick** at typewriter init (silent `typewriterTick(0)`) to wake the AudioContext from suspend before the first real tick fires — fixes "first letters appear without sound" issue.
- **Bass thump removed** from the click sound: 0.8ms attack fade-in + 1.5ms release fade-out on the buffer envelope (eliminates onset/offset transients), plus a pair of 700Hz highpass filters around the resonant 1800Hz bandpass (~36dB/octave below the band).
- **Glass smash reverb**: rewrote `glassSmash()` with a synthetic 1.6s exponential-decay convolution IR. Wet/dry mix (0.55/0.85) plus a 5.5kHz lowpass on the wet path. Smash now sits in a room.

### Alba reveal sound

- `distantBell()` reframed for *morning donging*: dropped the 1850Hz "sparkle" partial, halved remaining amplitudes, decay 4.5s → 3.6s. Single soft dong.
- Soft (vol 0.02) typewriter ticks **removed entirely** from `albaTypewriter()` — alba lines now type onto the page in absolute hush, just the bell + words.
- `LINE 1` and `LINE 2` passages had their `[outdoor]` / `[green-sea]` venue tags removed so no ambient bed plays during the alba reveal moments. True breather.

### `[venue-*]` tags stripped from atmosphere passages

`After the music`, `After Cecil Court`, `After the painter`, `Cow ride success`, `Cow ride fail` — all had venue ambient tags. Removed. They now play **typewriter clicks** (the prose is being typed) **but no venue ambient**. Atmosphere comes from the prose itself.

`After the call` is now `<div class="typewriter-page typewriter-static">` — new opt-out class that bypasses the type-on animation entirely while keeping the visual styling. Reads instantly at the player's pace.

### Heartbeat under the dual ring

The dual ring's *Aoife* portion gets the global header observer's heartbeat at 1.5s. Added an inline `<script>` in the passage that fires a second `heartbeat(6)` at 7.8s (when the Lily portion begins). Both calls now beat.

---

## Game flow / gating

### After alba complete — keep playing

Dean Street's `(if: _towerReady)/(else-if: $coachUrgent)/(else:)` chain split into three independent `(if:)` blocks. The dawn-link choice-box still appears prominently when alba is complete, but the venue list stays visible. Stripped `_towerReady is false` from every venue gate — venues remain available after alba completion. Player decides when to walk into the dawn.

### The Fetch unmissable

Routes converged on The Fetch:
- Dean Street's "The dawn is coming" link → `The Fetch` (was `Approach Centre Point`).
- LINE 3's "The dawn is coming" link → `The Fetch`.
- The Fetch's "Follow him" still goes to Approach Centre Point.

Every winning route now passes through the see-yourself-walking-ahead beat.

### The Fetch — soft warning

When `$lilyCount < 5` OR `$haunts's length < 12`, The Fetch passage shows:

> *'You can leave now, perhaps it's wise to get out. But there are still flowers to gather in the night, and work yet to be done.'*

Soft hint, in-world voice, single-quoted to match. Doesn't appear at all when both lilies and haunts are complete.

### Wheel at the dawn, not on the 12th haunt

`window.dssOpusReveal()` removed its self-gate (`prog.textContent === '12 of 12 caught'`). Removed from the haunt-box reveal logic. Added an inline script in the *Dawn* passage, gated on alba complete, that fires `dssOpusReveal()` 8 seconds after dawn loads — long enough for the alba lines to settle (1.6/3.4/5.2s) and a beat of reading time. Wheel comes up over the dawn view as the win-state coda.

### Cellar / Carthage / Pillars — micro-fixes

- **The Pillars [LOOK ELSEWHERE FIRST]** — was `[DONE FOR TONIGHT]`, misled the player into thinking nothing more was there.
- **Carthage stays open until alba2 is caught** — `Seek the coast` link now stays available if `$visitedCarthage is false OR not ($alba contains $alba2)`. Player can return for the Green Sea line after a first Carthage visit.
- **`Seek the coast — beyond The Pillars` → `through The Pillars`** — Carthage is in the Mediterranean, not past Gibraltar.
- **The Voice link removed.** Was firing at 2/3 alba and reading as premature. The Fetch is now reached only via the alba-complete dawn link.
- **`Remain in Carthage` no longer gated on `$confidence <= 15`** — always offered alongside the standard branches. The Interval is reachable regardless of stats.

### Words to the Wise — modals

All five inline `<div class="venue-hint-box">` blocks on Dean Street replaced with `wordToTheWisePopup(message)` triggers, gated once-per-session via `$shownLowBoth`, `$shownLowConf`, `$shownLowSobr`, `$shownChippyHint`. New generic `window.wordToTheWisePopup(message)` function alongside the existing `venueHintPopup` and `moraleWarningPopup`. Action links stay inline below; popup demands attention then dismisses to a page where you can act.

### Burns / wine stains on every typewriter passage

Added `.typewriter-page::after` pseudo-element with five radial-gradient marks: a wine-glass ring at top-right corner, four cigarette burns scattered. Applies globally to every typewriter passage. `.typewriter-paper-roll` bumped to `z-index: 1` so prose stays above the marks. `.typewriter-page::before` (the red margin line) also got `z-index: 0`.

### Continue Where I Left Off

Save trigger gated tighter — `$returns >= 1 AND not (_hideStats contains passage_name)`. Save only fires once the player has reached Dean Street at least once. Fresh first-run sees a clean Title; the link shows only after meaningful commitment.

### Dual ring delay buffer

New `$lilyCall1ReturnsAt` (init -999) stamped to current `$returns` when *Lily phone call 1* fires. Every dual-ring trigger across Coach lock / Pillars / Ronnie's / Colony / French now also requires `($returns - $lilyCall1ReturnsAt) >= 2` — at least two Dean Street returns must pass between the first call and the dual ring. No more back-to-back. Dual ring's hang-up handlers also explicitly `(set: $resumingFromCall to false)` so the Coach lock toilet sequence renders properly afterward.

### Two haunts at once on page return

The page-return scene at *O'Flatterly's Gift* drops both `THE DELIVERY` (haunt6) and `THE FEEDING` (haunt10). Wrapped THE FEEDING in `(after: 2.4s)[…]` so they arrive staggered.

### Beast haunt clue removed

Deleted the `<div class="haunt-opens">You know Martin Lackland. To bring him, you'll need a word — if you don't have it.</div>` line — no longer needed.

### Inis spacing

Added `.cecil-rule { display: block; margin: 0 0 1.6em; }` global CSS rule. Every Cecil Court passage's top SVG now has space above the prose.

### Sonnet quote fade-in

Added `.lily-fade-late` (10s `animation-delay`) class for Lily phone call 1's sonnet quote, `.lily-fade-very-late` (22s) for The dual ring's "And the tears…" line. Both still use the existing 2.5s `lilyFadeIn` animation, just with the start shifted so they fade in *after* the dialogue has played out.

### Dawn colours — pink/gold/grey

Replaced the navy gradient (`#060810` → `#142142` → `#0b2230`) with a top-to-horizon palette mapped from the `oxford-street-from-centre-point-3d-static.html` render: `#2a2620` (warm dark zenith) → `#585250`/`#6e6060` (cool grey) → `#785a52`/`#a07a6c`/`#c89878` (dusty rose, peach) → `#d69068` (warm horizon). Title `#f0c870` → `#c4ae88` (champagne). All ending-pane interior, alba-line block, "THE END" text, and book-name accent retuned.

### Cow ride — adjacent-row protection

Spawn fairness extended: any obstacle still in the top third of the field (`y < H * 0.34`) now also blocks lanes *directly adjacent* to it for the next spawn. Two obstacles arriving in adjacent rows at the same time should be impossible. Safety valve drops the adjacency rule (but keeps the projection rule) if it would leave zero free lanes — better a fairness slip than a long empty stretch.

---

## Bug fixes

### Trisha's `makeCanvasTexture` ReferenceError

The Trisha's IIFE (line 24228) used `makeCanvasTexture` from line 24278 onwards but never defined it inside its own scope. Other scene IIFEs each define it locally. Added the function inside `buildTSScene` right after `placeMesh`.

### Sonnets quote typos

Three small fixes in *Lily phone call 1*:
- Collapsed double space `…  '` → `… '`
- Removed brackets around `[She doesn't reply.]`
- Removed leading space `' And` → `'And`

### Donkey coin

- 70px → **120px** (perspective 350 → 420 to keep the flip feel right).
- Position-shift bug fixed by switching `Pocket it` button from `display: none` → `visibility: hidden` so the box is the same height before and after the first toss.

### Critic page-turn motes — too fast

Originally the password's motes spawned ~1s after passage entry, while the player was still on click 1 of the page-turn. Now deferred to 1.5s after the verdict's aftermath fades in (see Page-turn at the Critic above).

### Magenta "(if:) should be stored" error

In the chippy-hint modal conversion, the second branch (`'probably hungry'`) opened a nested `(if: $shownChippyHint is false)[…` but I left the inner hook unclosed — `</script>` ended the line where there should've been `</script>]`. Added the missing `]`. Bracket-depth check across Dean Street ends at 0 again.

---

## Files of note

- `Dream Street Shuffle.twee` — 146 passages, all session changes synced
- `Dream Street Shuffle.html` — compiled output (do not read; sync via `python3 sync_html.py`)
- `sync_html.py` — added `__DSS_PONGMINI_DATA_URI__`, `__DSS_JAZZMINI_DATA_URI__`, `__DSS_COWGAME_DATA_URI__` substitutions

---

## Possible next threads

- **Cow ride** — adjacent-row protection just landed; needs another playtest at mid/late tiers to confirm impossible configurations are gone.
- **Heartbeat on the dual ring's Lily side** — inline script fires `heartbeat(6)` at 7.8s. If still inaudible to Dr Quill, move to the global observer or bump volume.
- **Lily phone call 1 sonnet quote** — fade-in delay is 10s. Worth re-checking whether the typewriter-static *After the call* makes the sonnet feel less laggy by comparison.
- **Items 6 & 7 from earlier "fun additions"** — the Lackland's record-skipping interaction and the photo at the bar were sketched but not built. Optional polish for after first-draft.
- **General Dr Quill audit pass** — every change in this session was driven by his playtest notes; one more clean walkthrough would shake out anything missed.
