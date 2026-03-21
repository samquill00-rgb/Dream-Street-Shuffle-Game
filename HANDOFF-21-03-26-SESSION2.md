# Dream Street Shuffle — Handoff Note (Session 2)
**Date:** 21 March 2026 (continued)
**Files:** `Dream Street Shuffle.twee` (source of truth) + `Dream Street Shuffle.html` (built output)
**Build command:** `python3 sync_html.py` — run this after every change to the .twee file

---

## What was done this session

### 1. NOTEBOOK link fix (`:: UserScript` — STAT BARS LIFT script)
The NOTEBOOK `tw-link` in the stat bar was unclickable. Root cause: the stat bar element was being reparented to `document.body` (outside `tw-story`), which broke Harlowe's event delegation — all `tw-link` clicks must originate inside `tw-story`.

**Fix:** Changed `document.body.appendChild(bars)` to `(document.querySelector('tw-story') || document.body).appendChild(bars)`.

### 2. Lily notebook SVG redesign (`:: NOTEBOOK passage`)
The lily-of-the-valley botanical illustration was too vague before flowers are found, and not detailed enough when found.

**Changes:**
- Opacity states: `0.82`/`0.18` → `1.0`/`0.40` (unfound flowers much more distinct)
- Rachis (main stem) and descending pedicel added as SVG paths
- Each of the five bell flowers redesigned with: peduncle, bell body with scalloped lobes, inner highlight, green calyx cap, centre vein, and pistil dot
- Bell transforms spread across a natural arc: `rotate(-8)` … `rotate(8)`

### 3. Notebook typeface → Courier New (`:: UserScript` setInterval + CSS)
Changed all notebook text from `Courier Prime` / `Special Elite` to `Courier New, Courier, monospace` (no animation). Two locations required fixing:
- The `setInterval` on line ~343 that forces `style.cssText` on active panels — this uses a JS string, so `'Courier New'` inside a single-quoted string caused a **syntax error** (see bug below)
- ~12 CSS declarations for `.nb-left`, `.nb-notes`, `.nb-section`, etc.

### 4. NOTES tab renamed to DISCOVERIES, then to FINDS (`:: NOTEBOOK passage`)
Tab label changed: `NOTES` → `DISCOVERIES` → `FINDS` (final).

### 5. Critical bug: JS string delimiter crash (`:: UserScript`)
The Courier New font change introduced `'Courier New'` (single-quoted) inside a JS string delimited by single quotes, causing a **parse error that killed the entire UserScript block**. This silently broke:
- `window.nbSwitchTab` (notebook tabs stopped working, left-aligned layout)
- `window.flipCoinPopup` / `window.showCoinModal` (coin flip disappeared)
- The notebook `setInterval` layout-forcing loop
- All coinGate functionality

**Fix:** Changed `'Courier New'` → `"Courier New"` inside the single-quoted `style.cssText` string on the setInterval line.

### 6. Donkey coin flip restored (`:: UserScript` — `showCoinModal`)
After the UserScript crash was fixed, the coin flip still wasn't auto-triggering. The `autoToss` path used `setTimeout(b.click, 100)` after setting `b.style.display = "none"`. The `setTimeout` callback was not reliably triggering the click event listener in this execution context.

**Fix:** Changed autoToss to synchronous: `b.classList.add("coin-btn-hidden"); b.click();` — hides the button via CSS class (not `display:none`) and clicks immediately. Animation starts instantly.

**Note:** This also affects `coinGate` (the "The Donkey will decide" mechanic), which uses the same `autoToss: true` path — it is also now fixed by this change.

### 7. Notebook tab renames and reorder
| Old name | New name |
|---|---|
| NOTES / DISCOVERIES | FINDS |
| LILY | LILLIES |
| AUBADE | POEM |
| SPECIALS | EFFECTS |
| MAP | MAP (unchanged) |

Final tab order: **FINDS · EFFECTS · LILLIES · POEM · MAP**

The panel heading inside the old SPECIALS tab was also updated to read **EFFECTS**.

---

## Key things to know going forward

### The autoToss mechanism
`showCoinModal({ autoToss: true })` is used by both:
- `flipCoinPopup()` — the notebook EFFECTS tab "Toss it" button
- `coinGate(t1, t2)` — "The Donkey will decide" in-passage coin flips

The fix (synchronous `b.click()`) means the flip starts instantly when the popup opens. The `coin-btn-hidden` CSS class (visibility:hidden) hides the button before the click, keeping the UI clean.

### UserScript parse errors are silent and catastrophic
Any syntax error inside the `<script>` block at the top of the .twee file (lines ~1–400) will silently kill ALL functions defined there, including `nbSwitchTab`, `showCoinModal`, `flipCoinPopup`, `coinGate`, `liverPopup`, `BarGame`, etc. Always use double quotes for CSS font names inside JS strings: `"Courier New"` not `'Courier New'`.

### Notebook tab data-tab values (do not change these)
| Tab label | `data-tab` attribute |
|---|---|
| FINDS | `notes` |
| EFFECTS | `inventory` |
| LILLIES | `lily` |
| POEM | `alba` |
| MAP | `map` |

These `data-tab` values are used by `nbSwitchTab()` and `nb-panel-{value}` CSS classes. The display labels can be freely changed; the `data-tab` values must not.

---

## Commits this session
| Hash | Description |
|---|---|
| `ad17f85` | Notebook link fix (stat bars → tw-story) |
| `a459d49` | Lily notebook SVG redesign |
| `f791439` | Notebook font (Courier New) — introduced UserScript crash |
| `5b7f24f` | Fix coin flip autoToss: remove display:none |
| `d813669` | Fix coin flip: use synchronous b.click() for autoToss |
| `5d6ba54` | Rename notebook tabs: Finds, Lillies, Poem, Usefuls, Map |
| `95ceaf3` | Rename Usefuls → Effects |
| `283faf6` | Reorder tabs: Finds, Effects, Lillies, Poem, Map |
