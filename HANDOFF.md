# Dream Street Shuffle — Session Handoff

**Date:** 23 April 2026
**Files touched:** `Dream Street Shuffle.twee` and `Dream Street Shuffle.html` (kept in sync)

## What got done this session

### 1. HAUNT COLLECTED box at The French (haunt4 / The Debt)
- **Problem:** the ceremonial HAUNT COLLECTED box wasn't rendering at all.
- **Fix:** removed `!important` from `.haunt-box { opacity: 0 }` and from the `hauntReveal` keyframes — the `!important` was overriding the fade-in animation per CSS cascade rules. Switched to an opt-in `.haunt-box.revealed` class with `animation-fill-mode: forwards`.

### 2. Lore-box ("first haunt" explainer) not appearing
- **Problem:** stale `$hauntExplained` boolean in cached browser state.
- **Fix:** changed the gate from `(if: $hauntExplained is false)` to `(if: $haunts's length is 1)` (~10 replacements per file). Array-length is recomputed fresh so it's immune to cached state.

### 3. Magenta error banner on Dean Street
- **Problem:** `(if:)` macro received `0` instead of a boolean → Harlowe strict-type error rendered as a magenta banner. Root cause: stale `$afterMidnight` from an older build where it was a counter.
- **Fix:** added a boolean guard at the top of the Dean Street passage: `(unless: $afterMidnight is a boolean)[(set: $afterMidnight to false)]`.

### 4. Haunt-box reveal timing at The French
- **Problem:** box faded in while the drinking-animation popup was still up.
- **Fix:** DrinkPopup now sets `window._drinkPopupOpen = true` in its constructor and fires a `drinkpopup:closed` CustomEvent on fadeout. The passage observer waits for that event before running `doReveal()`, with a 200ms buffer.

### 5. Haunt → notebook light stream
- **Problem:** user wanted it stronger and more magical / less "floating balls".
- **Fix:** redesigned as 8 ghostly teardrop motes (1 `::after` + 7 `.haunt-mote-*` spans) with:
  - vertical-ellipse shape (5×12px) rotated -22° to align with travel
  - `filter: blur(1.4–1.8px)` for ghostliness
  - multi-layer `box-shadow` glow (14px / 30px / 60px)
  - staggered `animation-delay` from 1.1s to 2.15s
  - `hauntMoteRise` keyframes: rises 480px and fades over 3.8s
- **Final fix:** the JS `doReveal` injection loop was `k <= 2` but CSS defined 7 motes — updated to `k <= 7` so all 8 elements actually render.

### 6. The French — painter returns your sketch
- **Text change** in "Give him the painting" passage:
  - Was: *He takes it, smiles and gives you a wink.*
  - Now: *He takes it, smiles and gives it back to you.*
- **New `$hasDrawing` variable** — initialised `false` at story start and in the reset passage, set to `true` when "Give him the painting" runs.
- **localStorage save** — the napkin `Done` click handler now saves `canvas.toDataURL('image/png')` to `localStorage` under key `dss_napkin` (so the drawing persists across reloads).
- **Notebook EFFECTS entry** — added a third item after Shelley's Liver: *◈ A Napkin Portrait* (locked until drawn). Renders an `<img class="nb-napkin-img">` placeholder with a Caveat-font caption "Sketched at The French."
- **Image populates on open** — the notebook's existing layout-forcing `setInterval` now reads `localStorage.getItem('dss_napkin')` and sets the src on `.nb-napkin-img`.
- **New CSS:** `.nb-napkin-display`, `.nb-napkin-img` (napkin-paper background, 1.2° tilt, inset glow, drop shadow), `.nb-napkin-caption`.

## Known gotchas for next session

- Both `.twee` and `.html` must be kept in sync — every edit was made in both.
- `.html` uses HTML-escaped quotes (`&quot;`, `&#x27;`, `&lt;`, `&gt;`, `&amp;#39;` for `&#39;`) inside `<tw-passagedata>` — match that encoding exactly when editing.
- The `.twee` file is ~32,500 lines; the `.html` file is ~45,000 lines. Use Grep + targeted Read to navigate.
- Multiple popup classes (DrinkPopup, retching popup, etc.) share similar `_fadeOut` signatures — always include surrounding context when editing to avoid multi-match Edit errors.
- Existing save-states from before this session won't have `$hasDrawing` — the notebook will show the locked fallback until the user re-sketches.

## Files
- [Dream Street Shuffle.twee](computer:///sessions/charming-blissful-allen/mnt/Dream Street Shuffle - Game Files/Dream Street Shuffle.twee)
- [Dream Street Shuffle.html](computer:///sessions/charming-blissful-allen/mnt/Dream Street Shuffle - Game Files/Dream Street Shuffle.html)
