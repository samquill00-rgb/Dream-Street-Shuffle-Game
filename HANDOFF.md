# HANDOFF — 2026-05-25

Long session. Lots of small playtest fixes, plus a complete new mechanic (Cigarettes), plus the Carthage 3D-shore melody layer. Most things landed cleanly; a couple of bugs surfaced from refactor side-effects and got chased and fixed in-session.

---

## Major new things

### Cigarettes mechanic (Effects → notebook → side-of-screen burning visual)

A whole new in-game mechanic, replacing the broken `window.Harlowe.API_ACCESS`-pattern from the old matchbook button.

**Notebook entry** (Effects tab):
- Top-level "Cigarettes" entry, always visible
- SVG of an open red packet with cigarettes peeking out at varied heights and silver foil torn back (~110px wide)
- Caption changes by state:
  - No matchbook → "You need to find matches." (italic Crimson Text, `#3a1f10`, via `.nb-cig-status`)
  - Matchbook + matches → "Smoke one" link
  - Out of matches → "You're out."

**Flow:**
1. Click "Smoke one" in notebook (Harlowe `(link:)` — sets `$cigReturnTo = (passage:)'s name`, `(go-to: "Smoking")`)
2. **Smoking** passage: decrements `$matchesLeft`, increments `$cigsTonight`, applies `$statGain: $confidence, 6`, then `(go-to: $cigReturnTo)` — clean transit, no JS-clicked hidden link
3. Destination passage's header checks `$cigsTonight > $prevCigsTonight` and fires `window.startBurningCigarette()` via inline `<script>` (works because scripts in passage bodies execute; the trigger needed to be in the header to survive the redirect)

**Side burning cigarette visual** (`#side-cig`, lives on `document.body`):
- Fixed bottom-right, ~50px wide × 130px stick at start
- Layered SVG ember (charred ring → orange → bright core with off-centre hot spots)
- Paper has vertical grain + horizontal fibre marks + cylindrical side-shading + ash zone at top
- Longer cork filter (50px) with speckles (12 tiny dark radial-gradients scattered) + rounded endcap (darker elliptical bulge bottom)
- Bottom-rounded `border-radius: 0 0 50% 50% / 0 0 22% 22%` so it reads cylindrical
- **Burn:** 90 seconds to drop. Stick shrinks from 130 → 38px linearly.
- **Drop:** at the end, `.side-cig-dropping` class adds `translateY(180px) rotate(38deg) + opacity 0` over 1.4s — the player flicks the spent stub away.
- **Persistence:** on `document.body`, JS uses closure-stored `startTime`. Passage transitions don't touch it; the cigarette keeps burning at its true elapsed time across navigation.

**Smoke (mouth-end puffs):**
- No constant chimney smoke. No ember-side smoke.
- Irregular drags every 8–16s: ember brightens dramatically for 1.8s (`.side-cig-ember-drag` with `brightness(1.75)` + heavy drop-shadow halo), then ~3–4 wisps spawn at the FILTER end (player's mouth) at 1.5s in
- Wisp size 34–56px, drift sideways ±32px, scale to 4–6× over 8s, opacity peaks 0.55 (translucent grey, not white)

**Debug:** `🚬 Give matchbook (test Cigarettes menu)` button in debug Tools (backtick menu) — jumps to `DBG Matchbook` passage which sets `$hasTrishaMatchbook to true` and tops up `$matchesLeft to 5` if empty.

---

### Carthage 3D-shore melody layer

`carthage-melody.mp3` (2.5MB, embedded as `__DSS_CARTHAGE_MELODY_DATA_URI__` via `sync_html.py`). Plays via the existing `_ambientBeds` system:

```js
registerAmbientBed({
  label: 'carthage-melody',
  dataUri: '__DSS_CARTHAGE_MELODY_DATA_URI__',
  tags: { 'carthage-shore': 1 },
  volume: 0.32,
  duckVolume: 0.10
});
```

Tagged on **The coast of Carthage** and **Carthage shore** only (a new `carthage-shore` tag — not on Stay in Carthage, which is the inline pyre scene and shouldn't fire the melody). Layers with the existing `carthage-cicadas` bed.

The 3D scene itself (`carthage-coast-3d-static.html`) is a separate standalone HTML file that `dssAudio` can't reach — so audio is handled inside the `.twee` Carthage passages. When the player crosses into the 3D iframe the .twee audio pauses; when they return, it resumes.

---

### Cigarette ambience trim + whoosh suppression

- **Whoosh on Coast arrival** — added `dssAudio.ambientCut()` (immediate stop, 0 fade) alongside `ambientOff()`. The Coast of Carthage passage now calls it on entry via `<script>` so the lingering windFarnell from Maritime interlude's `[dream]` tag gets cut, not faded.
- **Cicadas trim** — first 15 seconds removed (had weird talking in the opening). Duration now 45s (down from 60s). Done via `afconvert` → manual WAV header rewrite (afconvert produces WAVE_EXTENSIBLE format that Python's `wave` module can't read) → `afconvert` re-encode at 128 kbps AAC. Original backed up as `the-carthage-cicadas-ambience-backup.m4a`.

---

## Bug fixes (in roughly the order they surfaced)

### Empty passage after closing notebook
**Root cause:** my first Cigarette implementation had `Smoking` use a JS-clicked hidden `(link-goto:)` — flaky in Harlowe 3.3.9.
**Fix:** Smoking now just does `(set:)` then `(go-to: $cigReturnTo)`. Side-cigarette spawn moved to header (`$cigsTonight > $prevCigsTonight` check). Removed the deleted-then-recreated "Light a cigarette" passage entirely.

### Claret link showed whisky popup
**Root cause:** my "delete French drink, inline the popup script in The French body" refactor used `var t = "(print: $lastDrink)".trim() || 'wine'` — but Harlowe doesn't process `(print:)` inside `<script>` tags. The JS got the literal string `"(print: $lastDrink)"`, which wasn't a known drink key, so `DrinkPopup`'s constructor fell back to its `'whisky'` default.
**Fix:** reverted to the span-then-read pattern (write `$lastDrink` into a hidden span, read `textContent` from JS). Same approach the old French drink passage used.

### Pillars link stuck "open" after everything was done
**Root cause:** the line-33658 gating condition was `($visitedCarthage is false or not ($alba contains $alba2) or not ($alba contains $alba3))`. But alba3 isn't collected at the Pillars — it comes from the Cow Ride at Coach and Horses. So the game kept suggesting Pillars while waiting for an alba line you can't get there.
**Fix:** removed `or not ($alba contains $alba3)` from that condition. Pillars now greys out once Carthage is visited AND alba2 is collected (both reached via Pillars → Maritime → Carthage).

### Trisha's gated too late
**Fix:** removed `$hasLiver is true` from the gating. Trisha's now opens as soon as you have the matchbook (the invitation).

### Off-centre text on the END (and other cinematic) passages
**Root cause:** `Alba Complete`, `Alba Incomplete`, `Approach Centre Point`, `The Fetch` weren't in `_hideStats`. The header (stat bars, ALBA hint, NOTEBOOK) was rendering on top of the cinematic ending panes.
**Fix:** added all four to `_hideStats`. (`Alba Complete/Incomplete` were already in `_backHide` but not `_hideStats` — only the back link was hidden.)

### Colony "gated later than normal"
Player perception, not a bug. Colony requires `$haunts contains $haunt1` (The Sketch from Benito). Pillars only requires `$visited's French is true`. Decided to leave as is (Colony stays one tier deeper than Pillars, thematic: the art crowd unlocks the art venue).

### Other small ones
- **IFID mismatch** — `.twee` `StoryData` had `2CA3EC26-…` but compiled HTML uses `E3F7C9E2-…`. Aligned both (the StoryData ifid AND the Continue-link guard script's `ifid` constant). The Continue-where-I-left-off link on the title page now correctly appears only when a real save exists for THIS story.
- **Wipe autosave** debug-menu button added (`⌫`, confirms before wiping; strips URL hash + reloads).
- **`Dream to Dean`** orphan passage deleted (debug menu entry also pruned).
- **Page 93 SVG edges** softened — added subtle waves on top/left/right via `<use href="#p47Shape">` so all three layers (shadow, paper, grain) share one wavy path; bottom keeps its char.

---

## Prose & UX tweaks

- **The Night Ahead** — "the book took much longer to make than the little girl, **and** after an immediate, impromptu effort, you can't take much credit for her, **either**." (was "but … anyway.")
- **The Night Ahead** — "with **your** book in your bag" (was "with a book in your bag")
- **Red typewriter line** — "**Soho's churning night's been in you too long; yours even while you weren't here. The only true way out is through a morning song.**" (was "You've been in Soho's churning night too long; the only true way out is through a morning song.")
- **Dean Street first-/return-visit line** — "**It will help you find the things you need.**" (was "Let it help you find the things you  need.")
- **Fish-and-chips word-to-the-wise** — "Are you hungry? Get some grub at the chippy." (was "Your confidence is slipping. Get some grub at the chippy.")
- **Tarot card names** — now render *below* the card (no more mid-word truncation inside the 72-px card). Selection rebuilt as weighted pools so the spread varies across replays at the same stats.
- **Greyed-out ALBA hint removed** — used to show "Centre Point [ONE MORE LINE OF THE ALBA]" at `_albaCount is 2`; gone.
- **Punching game** — pre-fight redundancy gone. Fight auto-starts ~2.4s after Brace yourself (the "Take your stance" button is removed). Score threshold lowered from 6 → 5 to match Copper's stated rules.
- **Great Ham** — book closes at end of reading (the existing right-page element flips left then is hidden, base shrinks + recolours to leather block; ~0.4s flip + 0.35s collapse).
- **Green Sea** — gated behind `$returnedPage is true` (was just `$visitedPyre`). First Carthage trip exits via The Interval.
- **CLIMB IT button** — slow-fade slowed from 2s → 5.5s, delay bumped from 2.5s → 3.5s.
- **PLUS. ULTRA. link** — wrapped in `.plus-ultra-fade` span with 6s opacity ease-in.
- **Transition footstep sounds** — deleted (cobble-on-outdoor-arrival, carpet-on-Interval-stair).

---

## State of the live code

132 passages. Cigarettes mechanic + Carthage melody layer + all polish/bug fixes in. Cigarettes is the biggest new system this session — pattern: side-effect-on-document-body visual driven by a stat-delta check in the header.

### Stuff that came up in playtest and got fixed live
The session was iterative — Dr Quill kept playing, surfacing bugs, I'd chase them down to root cause and fix. Mid-session there were 3 broken things at once (notebook → empty passage, claret → whisky popup, Pillars link stuck) — all resolved.

---

## Open threads

### Still flagged
- **Flower retakeable at The French** — Dr Quill reported it but I couldn't find anything in the lily logic that would reset `$tookLily5`. He was going to try on a fresh save (post the IFID + autosave wipe) to confirm whether it was a stale-save artifact or a real bug. **No confirmation yet.**

### Carried over, parked
- **Title-screen BEGIN** — kept as is per his call
- **Three Pillars (Mercy/Severity/Mildness)** — banked
- **Astral-map screenshots** — banked (uncommitted to a use)
- **Asymptotic curve `/50`** — verified, no change wanted
- **Verse alignment** — always left, no overrides
- **Cigarette popup function** — `window.showCigarettePopup` (hold-to-light overlay) is now dead code; only used by debug paths. Pruneable, kept for safety.
- **`Failure: Trisha's`** — NOT actually orphan (referenced by JS); should stay (HANDOFF previous-session note was wrong)

### Memories — no changes this session
The patterns already in memory all held:
- **Harlowe doesn't evaluate macros inside `<script>` tags** — confirmed again with the claret bug (revealed by my own refactor)
- **`window.Harlowe` not exposed** — confirmed (the matchbook button was broken because of this; cigarettes mechanic now uses the navigate-and-redirect pattern instead)
- **`<script>` tags inside `(link:)` hooks don't execute** — already in memory; routed the burning cigarette spawn through the header

Worth flagging:
- **Side-of-screen visuals on `document.body`** persist across passage navigation in Harlowe (since Harlowe replaces `<tw-passage>` content but not body children). The cigarette is the first thing in DSS using this pattern; could be reused for other ambient effects.
- **Stat-delta detection in the header** is now a clean way to trigger JS visuals from a passage that just did `(set:)` + `(go-to:)`. Cigarette uses `$cigsTonight > $prevCigsTonight`; same shape could fire other one-shot visuals on other stat changes.
- **Trim m4a files with the Python WAV roundtrip pattern** — `afconvert` → parse RIFF chunks manually (Python's `wave` module rejects `WAVE_EXTENSIBLE` format 65534) → write standard PCM WAV → `afconvert` back. No ffmpeg required.
