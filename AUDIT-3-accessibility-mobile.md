# AUDIT 3 — Accessibility & Mobile/Responsive (static source audit)

**Scope:** Static analysis of `Dream Street Shuffle.twee` (source of truth) plus targeted greps of the compiled `Dream Street Shuffle.html`. No files edited, no build run, no browser launched.

## Executive summary

The game is far more accessible than a heavy-animation Twine title usually is: it already has keyboard-focus styling (`:focus-visible` rings on links and the mute button), real `<button>` elements with `aria-label` on modal close glyphs, `aria-hidden` on decorative SVG, Escape-to-dismiss on most modals, **touch handlers alongside every mouse handler** in the minigames, keyboard controls (Arrow/Space) in the minigames, a correct `width=device-width, initial-scale=1` viewport (no zoom-locking), and three responsive media queries (`max-width:600px`, `max-width:620px`, `hover:none`).

The one **Critical** gap is the total absence of reduced-motion handling: **0** `prefers-reduced-motion` rules and **0** `matchMedia` calls against a surface of **163 `@keyframes`**, ~200 `animation:` declarations, and **45 `requestAnimationFrame` loops** (including WebGL 3D scenes, fog/steam drift, full-viewport petal storms, screen washes, and the `dssDrunkMid` "drunk" passage sway). This is the highest-impact, highest-risk finding for vestibular-sensitive players.

Secondary issues are mostly **Medium/Low**: a handful of modals don't bind Escape; no focus is moved into or returned from modals (only 1 `.focus()` call in the whole file); a few touch targets (modal ✕ at ~27px, the `word-wise-close`) fall under 44px; and several faint scene labels/hints sit at very low contrast.

Severity tally: **Critical 1 · High 2 · Medium 6 · Low 4.**

---

## Reduced motion

### **[R1] Critical — No `prefers-reduced-motion` support anywhere**
- **Location:** whole stylesheet/JS. Grep handles: `prefers-reduced-motion` → 0 hits; `matchMedia` → 0 hits; `@keyframes` → 163; `animation:` → ~200; `requestAnimationFrame` → 45.
- **Problem:** Every animation runs unconditionally. The most vestibular-triggering are large-area, sustained, or parallax motions: `dssDrunkMid` (passage rotate+translate sway, line ~38413), `dst-fog1/dst-fog2` (translating fog, ~37964), `dst-petal-drift-a/-b` and `dawnPetalRise` (full-viewport falling-petal storms — `maxPetals` up to 650, line ~32402), `albaScreenFlash`/`lilyScreenFlash`/`violetScreenFlash`/`flashReveal` (full-screen flashes — also a photosensitivity concern), `pillarsSmoke`/`coachPlumbVortex`/`smoke-drift`/`steam`, the dawn washes (`dawnFadeWhite`/`dawnFadeBlack`/`dawnCornerFade`/`dawnMistDrift1/2`), and all WebGL `_loop()`/`loop()` scenes (gas-lamp flicker, fog, fly-killer).
- **Affects:** players with vestibular disorders, migraine/photosensitivity, motion sensitivity.
- **Recommendation:** Add a global CSS escape hatch plus JS gates.
  1. CSS, once, near the top of the global `<style>`:
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, *::before, *::after {
         animation-duration: 0.001ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.001ms !important;
         scroll-behavior: auto !important;
       }
       /* Kill the large-area / vestibular offenders outright */
       .dst-drip, .dawn-petal, .dawn-mist, .dawn-mist-band,
       .dst-an-top, [class*="screenFlash"], .flash-reveal { animation: none !important; }
       tw-passage { animation: none !important; } /* disables dssDrunkMid sway */
     }
     ```
  2. JS — define one shared flag and short-circuit the rAF scene loops and the petal/typewriter spawners:
     ```js
     window.dssReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
     ```
     In each scene `_loop()/loop()` and in `startPetalStorm`, the petal-drip spawner, and the typewriter type-on, check `if (window.dssReduceMotion.matches) { /* render one static frame, skip rAF / skip spawn / render final text immediately */ }`. For the typewriter cursor (`cursorBlink`/`cursorFadeOut`, ~45284) and `dssDrunkMid`, render the end-state directly.
- **Confidence:** Confirmed in source (absence is confirmed; per-loop wiring is the recommended fix).

### **[R2] High — Full-screen flash animations are a photosensitivity risk**
- **Location:** `albaScreenFlash` (~40197), `lilyScreenFlash` (~40302), `violetScreenFlash` (~40315), `flashReveal` (~45258), `lightningStrike`/`stormFlicker` (~43358–43364).
- **Problem:** Brief full-viewport luminance flashes can trigger photosensitive seizures if rapid/high-contrast. Static analysis can't measure flash rate; flag for review.
- **Affects:** photosensitive-epilepsy players.
- **Recommendation:** Ensure none flash >3×/sec; include them in the R1 reduced-motion kill-list (done above); consider capping peak opacity.
- **Confidence:** Suspected — verify on device (timing not measurable statically).

---

## Mobile / touch

### **[M1] Medium — Modal close ✕ targets are smaller than 44px**
- **Location:** `.dss-modal-x` — `width/height: 1.7em` (~27px at the 16px base), line ~42814; `.word-wise-close` (~43533).
- **Problem:** Below the ~44px recommended minimum touch target; awkward to tap, especially on the gold-on-dark modals.
- **Affects:** touch users, low-dexterity users.
- **Recommendation:** Bump to `min-width/min-height: 44px` (keep the glyph visually small with `line-height`/padding), or add an invisible expanded hit area. Modals already also close on click-anywhere/Escape, so this is comfort, not a blocker.
- **Confidence:** Confirmed in source.

### **[M2] Low — Pong/lane/paddle minigames: touch + mouse + keyboard all present (no fix, verify feel)**
- **Location:** Pong paddle `h(cy)` on `mousemove`+`touchmove` (~32600–32603); cow/lane game has `mousemove`+`touchstart`+keyboard Arrow/`a`/`d` (~36455–36502); bar platformer has Space/ArrowUp jump + ArrowDown + `touchstart` (~4696, ~36482). `touchmove` handlers correctly use `{passive:false}` + `preventDefault()` to stop page-scroll hijack.
- **Problem:** None structural — this is unusually good. Residual risk: on a tall phone the paddle's `document`-level `mousemove` fallback (32603) has no touch equivalent, so paddle control relies on `touchmove` over the canvas only; verify the canvas is tall enough to track comfortably.
- **Affects:** touch players (playability/feel).
- **Recommendation:** None required; spot-check paddle reachability on a small screen.
- **Confidence:** Confirmed in source (handlers present); feel = verify on device.

### **[M3] Medium — Hold-to-drink / hold-to-light overlays require a sustained press with no tap fallback**
- **Location:** match-light overlay `startHold/stopHold` on `mousedown`+`touchstart`/`mouseup`+`touchend` (~3990–3993); drink/retch/eat canvases `startDrink/startRetch/startEat` (~7796, ~9758, ~10038).
- **Problem:** Sustained-press interactions are hard for users with tremor or limited dexterity, and a stray touchmove can register as scroll/cancel on some mobile browsers. Touch *is* handled, but there's no single-tap or keyboard alternative to complete the action.
- **Affects:** motor-impaired users, some touch users.
- **Recommendation:** Offer a tap-to-complete fallback (e.g. a visible "skip / just do it" affordance) or accept Space/Enter as a hold proxy. At minimum confirm `touchcancel` doesn't strand the player mid-hold.
- **Confidence:** Confirmed in source (no tap/keyboard fallback); cancellation behaviour = verify on device.

### **[M4] Low — Large fixed-pixel canvases / SVG scenes on narrow viewports**
- **Location:** e.g. `<canvas id="bar-canvas" width="560" height="400" style="width:100%;height:auto">` (~36644); many scene SVGs use `width="100%"` + `preserveAspectRatio`. Stat bar has dedicated `max-width:600px` rules (`.stat-group` grid `54px 124px 2.4em`, ~42351).
- **Problem:** Mostly handled — canvases scale via `width:100%`. The stat-bar grid uses near-fixed column widths; on very narrow (<340px) phones the `54px 124px 2.4em` track could overflow horizontally.
- **Affects:** small-phone users.
- **Recommendation:** Verify no horizontal scrollbar at 320px; if it overflows, relax the middle column to `minmax(0, 124px)` or `1fr`.
- **Confidence:** Suspected — verify on device.

### **[M5] Low — Viewport meta is correct; zoom is not locked (positive finding)**
- **Location:** compiled HTML head: `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **Note:** No `maximum-scale`/`user-scalable=no`, so pinch-zoom works — good for low-vision users. No action.
- **Confidence:** Confirmed in source (HTML grep).

---

## Semantics / screen-reader

### **[S1] High — No focus management on modals (focus not trapped, not moved in, not returned)**
- **Location:** all `dss-rules-overlay`/`dss-haunts`/`dss-stats`/word-wise modals (~3280–3400, ~3850–3870); whole-file `.focus(` count = **1**.
- **Problem:** When a modal opens, keyboard/AT focus stays on the underlying passage; nothing moves focus to the dialog or returns it to the trigger on close, and focus isn't trapped, so a Tab user can wander behind the overlay. Combined with no `role="dialog"` (S2), screen-reader users may not be told a dialog opened.
- **Affects:** screen-reader and keyboard-only users.
- **Recommendation:** On open, `card.setAttribute('tabindex','-1'); card.focus();` and store `document.activeElement` to restore in `teardown()`. Optionally trap Tab within the card. Pair with S2.
- **Confidence:** Confirmed in source.

### **[S2] Medium — Custom dialogs lack `role="dialog"`/`aria-modal` (`role=` = 0 in source)**
- **Location:** `.dss-rules-overlay` / `.dss-rules-card` shells (~3283–3318 etc.). `role=` grep → 0 in .twee (4 in HTML, likely from the Harlowe runtime, not these dialogs).
- **Problem:** AT doesn't announce these `<div>` overlays as dialogs; the title text isn't programmatically the accessible name.
- **Affects:** screen-reader users.
- **Recommendation:** On the card: `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the `.dss-rules-title` element's `id`. Low effort — set in the existing `createElement` blocks.
- **Confidence:** Confirmed in source.

### **[S3] Medium — Several modals/overlays don't bind Escape**
- **Location:** Escape *is* bound in many places (~3834, 3867, 3948, 4351, etc.) but the haunts modal (`showHauntsModal`, teardown ~3322) and stats modal (~3358) close only on click-anywhere or the ✕ — no `onKey`/Escape listener.
- **Problem:** Keyboard-only users can't dismiss those two with Escape (they can Tab to the ✕ button, which is operable, so not a hard block).
- **Affects:** keyboard-only users.
- **Recommendation:** Add the same `function onKey(e){ if(e.key==='Escape') teardown(); }` + `addEventListener`/`removeEventListener` pattern already used elsewhere.
- **Confidence:** Confirmed in source.

### **[S4] Low — Decorative SVG largely handled; spot-check coverage**
- **Location:** `aria-hidden="true"` present on header lily (~38227), `dst-an-top` lily (~37974), side-cig ember, dawn art, page-47 SVG, intro overlays, etc. (~17 aria uses total).
- **Problem:** Coverage is good. A few inline scene SVGs (e.g. the bar `pre-bar` decorative glassware SVG at ~36644, notebook inventory SVGs ~38388) carry no `aria-hidden`, so AT may read stray gradient/`<text>` fragments. The bar SVG's `<text>` ("THE BAR", control hints) is meaningful and currently the only place that text lives — fine to expose, but the surrounding decorative paths could be noise.
- **Affects:** screen-reader users.
- **Recommendation:** Add `aria-hidden="true"` to purely decorative inline scene SVGs; keep meaningful `<text>` accessible (or mirror it in a visually-hidden `<p>`).
- **Confidence:** Confirmed in source (partial coverage).

### **[S5] Low — Canvas minigames have no text alternative / status output**
- **Location:** `bar-canvas`, Pong canvas, cow/lane canvas.
- **Problem:** Game state (score, win/lose) is drawn to canvas only; no `aria-live` region announces outcomes. Keyboard controls exist, but a blind player gets no feedback.
- **Affects:** screen-reader users.
- **Recommendation:** Add a visually-hidden `aria-live="polite"` element updated with score/round/result. Lower priority given the games' visual nature.
- **Confidence:** Confirmed in source.

---

## Contrast / legibility (static heuristic — verify with a checker)

### **[C1] Medium — Faint scene location labels at very low contrast**
- **Location:** `color:rgba(200,180,140,0.25)` on 12px `'Courier New'` location labels over dark 3D scenes — recurs at ~14940, 16672, 20727, 26341, 28701, 29003 (the "DEAN STREET, SOHO"-style captions).
- **Problem:** ~25% alpha pale-gold text on near-black is almost certainly well below WCAG AA (4.5:1) and even AA-large (3:1).
- **Affects:** low-vision users, bright-ambient-light mobile use.
- **Recommendation:** Raise alpha (≈0.55–0.7) or size up; verify with a contrast checker. These are atmospheric labels, so judge intent vs. legibility.
- **Confidence:** Suspected — verify with a contrast checker.

### **[C2] Low — Faint italic control hints in minigame intro SVG**
- **Location:** bar `pre-bar` SVG hint text `fill="#8a7a60"` at `font-size:8.5px` ("Hold to pour · Release to stop", "↑ Jump · ↓ Duck") (~36644).
- **Problem:** 8.5px muted-tan over dark panel — small and low-contrast for instructional text the player must read to play.
- **Affects:** low-vision users.
- **Recommendation:** Increase size/contrast for the *instructional* lines (decorative diamonds can stay faint). Verify ratio.
- **Confidence:** Suspected — verify with a contrast checker.

### **[C3] Low — Greyed/locked notebook entries**
- **Location:** `.nb-grey` / `nb-inv-locked` ("○ A matchbook" etc., ~38388) and `#8a7a60`/`#8a7060`-family muted captions throughout.
- **Problem:** Intentionally de-emphasised locked items may fall below AA; acceptable for "not yet available" state but flag if any conveys needed info.
- **Affects:** low-vision users.
- **Recommendation:** Confirm no essential info is *only* in a sub-AA grey; nudge alpha up if so.
- **Confidence:** Suspected — verify with a contrast checker.

---

## Focus visibility

### **[F1] Low — Focus styling exists and is well-done (positive finding)**
- **Location:** `tw-link:focus-visible, .enchantment-link:focus-visible` → dashed outline + offset + colour (~38748); `#dss-mute-btn:focus-visible` → outline (~45011). Uses `:focus-visible` (keyboard-only ring), which is the right call.
- **Note:** Good baseline. No action for links/mute.
- **Confidence:** Confirmed in source.

### **[F2] Low — `outline:none` uses are benign**
- **Location:** `outline:none` on the two password text inputs (`lackland-pwd-input` ~34954, `copper-pwd-input` ~38092) and the book-naming textarea (`outline:none !important`, ~38454).
- **Problem:** These suppress the focus ring on focusable text fields. Mitigated: the textarea sets `caret-color` so the cursor is visible, and the inputs have a visible border. Still, keyboard users lose the standard ring.
- **Affects:** keyboard users (minor — text fields show a caret).
- **Recommendation:** Replace `outline:none` with a `:focus-visible` border/box-shadow on these fields for parity with the link styling.
- **Confidence:** Confirmed in source.

### **[F3] Medium — Modal ✕ buttons and canvas-start buttons have no explicit focus ring**
- **Location:** `.dss-modal-x` (~42814) and `.word-wise-close` (~43533) define `:hover` but no `:focus-visible`; the inline `#bar-start-btn` (~36644) has a static decorative `outline` but no focus-specific state.
- **Problem:** Tab-focusing the close ✕ gives no visible indicator (browser default may be suppressed by surrounding resets).
- **Affects:** keyboard users.
- **Recommendation:** Add `.dss-modal-x:focus-visible, .word-wise-close:focus-visible { outline: 1px dashed rgba(232,213,183,0.7); outline-offset: 2px; }`.
- **Confidence:** Confirmed in source.

---

## Quick wins (low effort, high impact)

1. **R1 CSS block** — paste the `@media (prefers-reduced-motion: reduce)` rule once into the global `<style>`. Instantly neutralises the bulk of CSS motion (sway, petals, washes, drift) with zero JS. *(Critical → High coverage in minutes.)*
2. **S2 + S1** — in the three `createElement` modal builders, add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `card.focus()` on open / restore focus on `teardown()`.
3. **S3** — add the existing Escape `onKey` pattern to the haunts and stats modals.
4. **M1 + F3** — `min-width/min-height:44px` on `.dss-modal-x`/`.word-wise-close` and a `:focus-visible` ring on both.
5. **C1** — raise the scene-label alpha from `0.25` to ~`0.6`.

## Top 3 to fix first

1. **[R1] Critical — add `prefers-reduced-motion` handling** (CSS kill-switch + `matchMedia` gate on the 45 rAF loops, petal storms, typewriter, and `dssDrunkMid` sway). Biggest accessibility risk; the CSS half is a near-instant quick win.
2. **[S1]/[S2] High/Medium — modal dialog semantics + focus management** (`role="dialog"`/`aria-modal`/`aria-labelledby`, move focus in, return on close). Single small edit to three shared builders.
3. **[F3]/[M1] Medium — focusable controls need visible focus + 44px touch targets** (modal ✕, word-wise close, canvas start buttons).
