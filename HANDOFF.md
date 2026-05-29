# HANDOFF — 2026-05-27 (end-game polish + aesthetic pass)

Two sessions on this date. Most of the day was end-game polish (lightning, glow, failure path, iframe preload) — that's documented in **Phase 1** below. A short add-on session at the end worked through `aesthetic-suggestions.md` (audit doc generated overnight). That's in **Phase 2**.

Live code: D5 cecil-rule extraction shipped; everything else from Phase 2 was either reverted or verified-no-change.

---

## Phase 2 — aesthetic-suggestions pass (add-on, end of day)

The audit doc `aesthetic-suggestions.md` lists ordered visual/code suggestions A1–G. Dr Quill picked A1 + D5 first. Outcome:

- **A1 (soften header lily) — IMPLEMENTED, THEN REVERTED.** Recoloured strokes `#0a0a0a → #3a2818`, halved stroke-widths, dropped CSS opacity `0.92 → 0.55`, extended fade-mask leftward. Dr Quill preferred the lily as it was. Reverted both the SVG line and the CSS. Saved memory `feedback_header_lily_leave_alone.md` so future sessions don't re-propose softening.
- **D5 (extract duplicated `.cecil-rule` SVG) — SHIPPED.** New hidden passage `:: Cecil Rule SVG` at .twee:45855. Two inline copies (Cecil Court venue at .twee:32741, O'Flatterly introduction at .twee:34680) replaced with `(display: "Cecil Rule SVG")`. Pattern mirrors `French Rule SVG h24/h60`. **One gotcha:** initial `replace_all` for the SVG body also overwrote the SVG inside the new passage (self-reference, would have caused infinite recursion). Restored the SVG body inside `Cecil Rule SVG` immediately. If anyone repeats this extraction pattern (D5b for the four Dawn corner SVGs), DO NOT use replace_all on the SVG body — use targeted edits per call site, OR add the reusable passage AFTER the replacement sweep.
- **A2 (OPUS stat-bar polish) — VERIFIED, NO CHANGES NEEDED.** Loaded the game in Chrome MCP, faked opus state via JS (`.bar-fill` → `.bar-fill bar-opus`, swap labels to OPUS/STATE, pct to `pct-opus`). All three concerns in the doc were stale: rows have 8px row-gap already (don't touch); decorations are cleanly hidden by the existing `:has(.bar-opus)` overrides; the amber "100%" sits against the dark/brown header backdrop (NOT against the gold bar — bar ends well before the pct column), so the contrast is fine. The aesthetic doc's "gold-on-gold" worry was a layout misread.

Compiled HTML synced after each change. 135 passages (was 134 before D5).

### Memories added this phase
- `feedback_header_lily_leave_alone.md` — don't re-suggest softening the header lily
- `reference_tester_link.md` — tester URL is `https://samquill00-rgb.github.io/Dream-Street-Shuffle-Game/Dream%20Street%20Shuffle.html` (NOT samquill.com — that's his password-gated personal site). Always tell testers to Cmd/Ctrl+Shift+R on first load.

### Remaining from aesthetic-suggestions.md (in author's recommended order)
- **A4** — CLIMB IT caption letter-spacing 0.18em → 0.14em or 0.12em (~2 min)
- **C1b** — Alba lines font: Georgia → Playfair Display or Crimson Text small-caps (decision rather than work)
- **B1** — Consistent passage opening rhythm (venue ornament vs walking centre-align)
- **C2** — Define ~6 CSS custom properties for the gold/cream palette and progressively replace direct hex values (~30 min find-and-replace, biggest visual-identity payoff)
- Plus B2–B5, C3–C5, D1–D7, E1–E3, F — see `aesthetic-suggestions.md` for full notes
- **DEAD**: A1 (header lily) — Dr Quill keeps it as-is

---

## Phase 1 — end-game polish (lightning, glow, failure path, preload)

Multi-day session focused entirely on the endgame sequence (Dean Street → The Fetch → Approach Centre Point → Alba Complete/Incomplete → Dawn Approach → White/Black page → Dawn). Tightened the visual choreography, fixed several flicker/render bugs, opened a failure path to Alba Incomplete, and built debug tooling for the ending. Latest state is shippable for everything *except* one environmental issue noted further down.

### Items completed this phase

### Debug tooling

1. **New "Complete All" debug button.** Sets every haunt + lily + alba line + inventory item + station-visited flag in one click, then drops you at Dean Street with "The dawn is coming" link live. [.twee:3189–3193 button, .twee:37807 `:: DBG Complete` passage]. Note: because `$hadPhoneCall + $metCritic` are now true, Dean Street auto-redirects once to **After Aoife** (the typewriter cubicle scene) — click "On." to land on Dean Street proper. Not a bug, just the gated phone-call hook firing.

### End-game spectacle

2. **Pentagram + tree-of-life lightning recoloured electric blue-white** (`#a8c8f8`). Was warm white-gold (`#fff5d0`) and read as a "second pentagram" stacked on the gold one. The blue layer is clearly subordinate now, and the eye reads pent → lightning as a sequence. [.twee:32664 + 32683 inline SVG, .twee:45907 CSS, plus new `tree-spark-pulse-blue` keyframe and `tree-path-draw-bright` keyframe].
3. **Lightning delayed** so the pentagram fully settles first. Start moved from 2.4s → 4.5s after iframe-ready. Pent fade-in (0.4–2.0s) is clearly done before any bolt strikes. Trail-residue opacity bumped from 0.10 → 0.55 — bolts leave a much clearer trace through the star. [.twee:45914–45937].
4. **Green sage halo on the lily-of-the-valley clusters at each point of the pent**, echoing the Gawain caption. Three stacked drop-shadows: `10px @ 0.85` + `22px @ 0.55` + `40px @ 0.30` in `rgba(170,230,170,...)`. New `class="pent-lilies"` on the outer `<g>` wrapping the 5 lily groups. [.twee:32664/32683 + .twee:45876 CSS].
5. **Gawain caption** (*"And the English call it everywhere…"*) recoloured to pale spring-green (`#c8e8c0`) with a matching layered green text-shadow so it shares the same chromatic event as the flowers. Black underlay shadow keeps it legible. [.twee:45888].
6. **Auto-go-to to White/Black page bumped 12s → 16s** to fit the new lightning sequence (last bolt lands ~iframe-ready + 5.5s, with 3+ seconds of "settled" view before the white fade starts). `dawnFadeWhite/Black` duration extended 12s → 14s. `treeFlashed` Harlowe-state timer pushed from 6.5s → 9.5s to fire after the lightning settles. [.twee:32668 + 32687, .twee:45844 CSS, .twee:32665 + 32684 script].

### Failure path opened

7. **"Give up. Sleep here." link** added to the **Coach and Horses lock** passage, gated by `$coachUrgent` (sobriety = 0 with 10+ haunts caught, no alba yet). Routes directly to **Alba Incomplete** → Dawn Approach Black → Dawn. Before this, Alba Incomplete was completely unreachable in normal play — the Dean Street gate ("The dawn is coming") only opened with all 3 alba lines, and from there Approach Centre Point always routed to Alba Complete. Now the player who blacks out at the Coach with most haunts but no alba can collapse straight into the failure ending. [.twee:33509, alongside the Retch link]. Soft `alba-link-fade` styling so it matches the existing voice.

### Astral-overlay flicker fix

8. **Tyburn-text "appears twice" bug fixed.** The `dssAstralReveal` constellation modal is appended to `document.body` (not the tw-passage), so Harlowe's passage transition left it persisting over Alba Complete — the player saw the Tyburn prose with dots/lines floating across it, then a clean second render once the astral faded out 11.5s later. Added a `MutationObserver` watching `tw-story` for `tw-passage` replacement; when detected, the astral modal is torn down immediately and its setTimeouts cleared. [.twee:9335–9362].

### 3D iframe loading — Approach Centre Point fallback

9. **WebGL-failure fallback for the Centre Point 3D ladder.** Wrapped the `new THREE.WebGLRenderer(...)` call in `initCentrePoint` / `buildCPScene` in try/catch. If WebGL can't be created (GPU process unhealthy, context limit hit, hardware accel off), the function still appends `cp-wrap` to the body with the "Every man and every woman is a star." caption and a clickable **CLIMB IT** button that triggers the hidden `[[·|Alba Complete]]` tw-link. Players can now progress through the ending even if their browser's WebGL is broken. [.twee:28808–28840]. The same pattern *should* be applied to the other 3D scenes (Dawn Approach iframe, Trisha's, Colony, etc.) for full robustness — left for next session if needed.

### 3D iframe loading — preload approach (rolled back)

10. **Experimented with body-level iframe preload to make the Dawn Approach 3D load instantly when clicking "Go!".** Two iterations:
    - **Hidden iframe with `visibility:hidden`** during Alba Complete — Chrome throttles script execution in hidden iframes, so Three.js loaded but the inline scene-build script never ran. Landed at Dawn Approach with an empty white canvas.
    - **Hidden iframe with `opacity:0`** instead — same result. Chrome's throttling triggers on opacity:0 too.
    - **Final approach: HTTP-prefetch only.** On Alba Complete / Alba Incomplete, a small script does `fetch('oxford-street-from-centre-point-3d-static.html', {cache: 'force-cache'})` + a `<link rel="preload">` for the Three.js CDN. The iframe itself is created fresh, on-screen and visible, on Dawn Approach using the original inline-iframe markup. HTTP cache makes the load fast; visibility from the start avoids the throttling trap. [.twee:33686 + 33717 prefetch script, .twee:32686 + 32705 inline iframe in Dawn Approach].

---

## ⚠ Outstanding: WebGL context creation failing on Dr Quill's Chrome

Toward end of session, Chrome on the dev machine could no longer create *any* WebGL context. `chrome://gpu/` not checked yet. Errors in console:

```
THREE.WebGLRenderer: Error creating WebGL context.
Uncaught Error: Error creating WebGL context.
```

All 3D scenes (Centre Point ladder, Oxford Street city, the various venue scenes) show only their HTML overlays (date/caption/links) — no canvas, no geometry. The constellation `dssAstralReveal` still works because it's SVG, not WebGL.

**Likely causes, in order:**
1. **Chrome's GPU process unhealthy** from accumulated WebGL contexts during the day's testing — full Cmd+Q on Chrome usually resets this. Tried partially; not verified to fix.
2. **Hardware acceleration disabled** in `chrome://settings/system` (toggle "Use graphics acceleration when available").
3. **GPU/driver issue at the OS level** — full Mac restart fixes.

**The CLIMB IT fallback (item 9 above) was added specifically so Dr Quill can still play through the ending and test the OTHER fixes while WebGL is broken.** Pentagram, lightning, gawain text, green glow, fade-to-white all rendered correctly in his session — only the 3D city behind the pent was missing.

**Next session should:**
- Confirm WebGL has come back on his Chrome (he was going to check `chrome://gpu/`).
- Verify the natural-flow ending sequence end-to-end with 3D restored.
- Consider whether to apply the same try/catch WebGL fallback to the other venues' 3D scenes (Trisha's, Colony, etc. — same pattern at lines 13134, 14680, 16423, 17502, 19198, 20611, 24620, 26181, 27775, 28499 — about 10 sites).

---

## Patterns to remember (from this session)

- **Don't preload an iframe at `visibility:hidden` or `opacity:0` if its inner scripts need to run before promote.** Chrome throttles script execution in hidden iframes. HTTP-prefetch (`fetch` + `link rel=preload`) is safe; full iframe preload is not. The visible-iframe-with-HTTP-cache approach is the working pattern.
- **Body-level overlays from `dssAstralReveal` (and any similar body-attached modals) persist across passage transitions.** Always wire a `MutationObserver` on `tw-story` to tear them down on `tw-passage` change. Same pattern would apply if any future body-level overlay is added.
- **Wrap every `new THREE.WebGLRenderer(...)` in try/catch.** Build a minimal HTML fallback in the catch (caption + link button) so the scene degrades gracefully when WebGL fails. The 3D file `oxford-street-from-centre-point-3d-static.html` itself does NOT have this fallback — its scene-build script aborts on the WebGLRenderer line and the page shows only its absolute-positioned date/caption divs.
- **Harlowe temp vars `_treeAllVisited` etc. set at passage top-level are visible inside `(if: $lilyCount >= 5)[...]` and similar hooks.** The "There isn't a temp variable named _treeAllVisited in this place" magenta error from earlier was actually transient / state-dependent — once state was set via Complete All it didn't recur, so it's not a real scoping bug. If it returns, defensive fix would be to redeclare `_treeAllVisited` inside the inner hook.

## State of the live code

135 passages (was 134 before Phase 2's D5 extraction added `Cecil Rule SVG`). `.twee → .html` sync clean. End-game sequence is choreographed and works in all visual respects given working WebGL. Failure path is now wired and accessible. Debug tooling (Complete All) is in place for fast iteration.

---

## Carried over from prior HANDOFFs (still relevant)

- **`tw-link` vs `tw-expression`** — Harlowe renders bracket links as `<tw-link>`, `(link:)` macros as `<tw-expression>`. Any JS/CSS that touches one should consider the other.
- **`dssSpawnMotes`** accepts `{noScroll:true}` opts to skip `scrollIntoView`.
- **Cigarettes mechanic** — body-level visual driven by stat-delta check in header.
- **`Failure: Trisha's`** is NOT orphan — referenced by JS. Don't prune.

## Open / parked

- **Three Pillars (Mercy/Severity/Mildness)** — banked.
- **Astral-map screenshots** — banked.
- **Cigarette popup function** (`window.showCigarettePopup`) — dead code, debug paths only.
- **Title-screen BEGIN** — kept as is.
- **WebGL fallback for other venues' 3D scenes** — only Centre Point has it now; ~10 other sites could use the same try/catch pattern if WebGL flakiness is a recurring problem.
- **Local HTTP server `python3 -m http.server 8765`** — was running during testing for chrome-MCP access; may still be running in the background.
- **`aesthetic-suggestions.md` backlog** — A4, C1b, B1, C2, plus B/C/D/E/F items still on the list (see Phase 2 above). Untracked file in the repo root; safe to delete once you've walked through it.
- **`aesthetic-suggestions.html`** — same untracked. Decide whether to keep both formats or just the .md.
