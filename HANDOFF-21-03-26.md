# Dream Street Shuffle — Handoff Note
**Date:** 21 March 2026
**Files:** `Dream Street Shuffle.twee` (source of truth) + `Dream Street Shuffle.html` (built output)
**Build command:** `python3 sync_html.py` — run this after every change to the .twee file

---

## What was done this session

### 1. Yeats couplet styling (`:: You speak to the poet`)
The Yeats couplet ("That is not natural in an age like this...") was using the plain `revelation-box` class. Changed to `quest-box` so it gets the art nouveau SVG curl border, matching the style of the Alba Revealed passage.

### 2. Pong visual overhaul (`:: PP Pong`)
Full aesthetic redesign of the canvas pong minigame:
- Table felt dark green background
- Segmented white net (small rectangles, not a line)
- Rounded paddles — player is cool white/blue glow, opponent is red glow
- White glowing ball
- Amber/gold score and UI text to match the game's overall palette
- CSS `.pp-arena`, `.pp-score`, `.pp-action` all shifted from neon green to amber-wood tones

### 3. Harsent → Jack Curtis (throughout)
Renamed the poet opponent from David Harsent to Jack Curtis in:
- `:: Challenge Jack Curtis` passage (sets `$opponent`)
- `:: PP Pong` JS — narrator object key, AI difficulty check
- `:: Watch the decider` passage
- All passage names

### 4. Clegg → Johan Clogg (throughout)
Renamed the bookseller opponent using `sed` with word boundaries to protect `$hasCleggBeermat` (the variable name was intentionally left unchanged — changing it would break save state and all the conditionals that check it).
- `:: Challenge Johan Clogg` passage
- `:: PP Pong` JS — narrator object key, AI difficulty check
- `:: Watch the decider` passage

### 5. Beer mat made universal (`:: PP Victory` and `:: PP Defeat`)
Original design: beer mat only appeared if you beat Johan Clogg; Jack Curtis win gave a poem instead.
Fix: beer mat (`$hasCleggBeermat = true`, `$knowsCecilCourt = true`) now fires unconditionally after any pong result. Jack Curtis matchbook preserved on defeat as an extra reward. The poem on Jack Curtis victory was removed entirely.

### 6. Ronnie Scott's 3D scene — three fixes (`:: UserScript`)
The approach scene was showing a black screen with text at the bottom and never initialising.

**Fix 1 — Container watcher was one-directional:**
The `setInterval` only cleaned up on exit; it never triggered `initRonnieScotts()` on entry. Replaced with bidirectional polling (same pattern as Copper's Lair).

**Fix 2 — Duplicate scene/camera/renderer block:**
There were two identical `var scene = new THREE.Scene()` / `renderer.domElement` blocks. The first (empty) canvas filled the viewport; the second was pushed off-screen. Removed the duplicate.

**Fix 3 — Zero-size canvas:**
`rsWrap.clientWidth / clientHeight` both return 0 because rsWrap isn't in the DOM yet when `buildRSScene()` runs. Camera got `NaN` aspect ratio. Changed all sizing to `window.innerWidth / innerHeight`, matching Copper's Lair and Fish & Chips.

### 7. Ronnie Scott's enter button — navigation fix
After the 3D scene loaded, clicking "Go to Ronnie's" did nothing. The handler was using `window.location.hash = 'Ronnie Scott\'s'` which doesn't trigger Harlowe navigation. Replaced with the standard pattern used elsewhere in the codebase: find the `tw-link` inside `rs-container`'s parent and click it programmatically.

### 8. Stats header colour
The fixed header strip (`.stat-bars`) had a dark green-tinted background. Shifted to a warm amber-black glass feel:
- Background: `rgba(14, 11, 7, 0.88)` (was `rgba(10, 16, 12, 0.85)`)
- Bottom border: `rgba(180, 145, 70, 0.2)` amber (was greenish `rgba(160, 185, 140, 0.15)`)

---

## Chinese Fish & Chips 3D scene
Checked — already in good shape. Uses `window.innerWidth/Height`, has a bidirectional container watcher, no duplicate scene block, and the enter button uses `Engine.go()` with a `tw-link` fallback. No fixes needed.

---

## Key variables to know
| Variable | Meaning |
|---|---|
| `$hasCleggBeermat` | Player has the "Go to Carthage" beer mat — gates the Carthage option. **Do not rename.** |
| `$knowsCecilCourt` | Unlocks Cecil Court access on Dean Street |
| `$opponent` | Set to `"Jack Curtis"` or `"Johan Clogg"` in Challenge passages; persists into PP Pong |
| `$hasTrishaMatchbook` | Set on PP Defeat vs Jack Curtis — leads to Trisha's |

## Key passages
| Passage | Notes |
|---|---|
| `:: PP Pong` | Canvas minigame. All JS inline. Narrator lines keyed by `$opponent` |
| `:: PP Victory` | Always gives beer mat now, no opponent branching |
| `:: PP Defeat` | Jack Curtis matchbook + universal beer mat |
| `:: Challenge Jack Curtis` | Sets `$opponent to "Jack Curtis"` |
| `:: Challenge Johan Clogg` | Sets `$opponent to "Johan Clogg"` |
| `:: Approach Ronnie Scott's` | Contains `<div id="rs-container"></div>[[·\|Ronnie Scott's]]` |
| `:: You speak to the poet` | RED passage — Yeats couplet in `quest-box` |

## 3D scene pattern (all venues follow this)
All 3D approach scenes (Ronnie Scott's, Copper's Lair, Fish & Chips) use the same IIFE structure:
1. `var xActive`, `var xAnimId` declared
2. `initX()` — guards with `if (xActive) return`, loads THREE if needed, calls `buildXScene()`
3. `buildXScene()` — creates scene, uses `window.innerWidth/Height` for sizing (never `clientWidth`)
4. `setInterval` bidirectional watcher — calls `initX()` when container appears, cleans up when it disappears
5. Enter button clicks the `tw-link` in the container's parent (or uses `Engine.go()`)
