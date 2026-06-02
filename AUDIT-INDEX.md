# Audit pass — 2026-06-01 (while Dr Quill was out)

> ## Decisions log (updated 2026-06-02)
> Worked through the findings with Dr Quill. Status of everything actioned or decided:
> - **DONE & committed:** Dean Street coach-funnel fallback (N5/S7); Lackland Back Door visible "Step back" link (N1); modal a11y batch — shared `dssModalA11y` helper giving `role="dialog"`/`aria-modal`/`aria-labelledby` + focus in/return + Escape, plus 44px touch targets & `:focus-visible` rings on the close glyphs (S1/S2/S3/F3/M1).
> - **PARKED until first-draft stage — nothing in code:** ALL of reduced motion (R1). The CSS kill-switch was added then **removed at Dr Quill's request** to keep the source clean and followable while the game is still in flux; the JS gating for the 3D scenes + typewriter was never started (he has separate plans for the typewriter). Revisit the whole topic — CSS switch *and* JS gating together — when everything's at first-draft standard. There is currently **no** `prefers-reduced-motion` handling anywhere.
> - **CLOSED — deliberate (won't fix):** faint 3D scene captions (C1). Kept dreamy/faint on purpose — an aesthetic choice like the header lily, not a defect. Do not re-flag.
> - **LEFT IN PLACE — may matter later:** all four dead-state vars (`$ppScore`/`$oppScore`, `$cowRideWon`, `$albaRevealed`, `$drankAtFrench`). Dr Quill is keeping them in case a Pong/cow-ride win (or the others) ends up mattering — treat as possible future hooks, not cruft. Not to be auto-removed.
> - **STILL OPEN (not yet decided):** ~~the remaining lower-priority items~~ — **worked through 2026-06-02; see the follow-up pass below.**
>
> ### Follow-up pass — 2026-06-02 (cleared the remaining open items; synced, commit pending)
> - **DONE (in source, synced):**
>   - **S5 (A2)** — memory-photo-2 now gated `(if: $sawMemory2 is false)` so it shows once, matching memory 1/3 (verse + Wake link left unconditional). Verified rendering.
>   - **S8** — added an `$alba1/2/3` string heal to the header heal block, where the ALBA strip reads them (ancient-save insurance). Verified strip still reads 0/3.
>   - **N2** — documented the `_hideStats` "must have a body exit or be a true ending" invariant as a comment by the list.
>   - **S5 (A3)** — `aria-label` on all 7 minigame/drawing canvases (pong, waltz, fight, cow, bar, both napkins).
>   - **S4 (A3)** — `aria-hidden` on the 20 decorative tarot-art SVGs (meaning is already in the visible card label); prominent always-on decorations were already hidden.
>   - **M3 (strand fix)** — added `touchcancel → stop` to the **match-light** hold (it had mouseup/touchend but no touchcancel → genuine mid-hold strand risk) and to the two napkin draw canvases. Invisible, no feel change.
> - **CLOSED — already resolved / no action needed:**
>   - **N3 / N4** — `Watch them play` and `Deco Divider` were already deleted in a prior cleanup (zero references).
>   - **R2** — flash audit passes: nothing strobes >3×/sec. Lightning = max 2 flashes per burst with 3s+ gaps, scoped to the maritime panel (not full-screen). Single-shot screen flashes are slow 3–4.5s bloom-fades.
>   - **S9** — Dean Street already recreates `$visited` with all four keys (34318–34322); French/Pillars/Colony predate every save, so they can't be missing.
>   - **M4** — stat-bar grid fits at 320px by calc (~217px in ~272px available).
> - **CLOSED — deliberate (won't fix):**
>   - **C2** faint italic minigame hints (~4.6:1, passes AA) and **C3** locked/empty/greyed notebook + `.greyed-out` venue styles — intentional low-emphasis state signals, same family as C1.
>   - **M3 dexterity affordance** (tap-to-complete / Space–Enter hold-proxy) — **declined by Dr Quill; the hold is intentional tactile design.** The invisible `touchcancel` strand fix above is kept.
> - **Optional, not done (Dr Quill's call):** cap the lightning's one `opacity:1.0` frame to ~0.85; nudge `.nb-lily-empty` 0.22 → ~0.3 for a more perceptible empty slot.
>
> ### Bug-fix episode — 2026-06-02 (window.Harlowe footgun; outside audit scope)
> Dr Quill hit the Dawn Ripley's-Wheel showing **no haunt names**. Root cause: a prior rework read `$haunts` via `window.Harlowe.API_ACCESS.STATE.variables`, but **`window.Harlowe` is `undefined` in this build** — the read silently returned empty. Found **5 more spots** on the same dead API. **All 6 fixed, synced (commit pending):**
>   - **Wheel** — Dawn prints `#dss-haunt-data`; `dssOpusReveal` reads it. Verified end-to-end (all 12 haunt names + alchemical stations show).
>   - **Waltz stats (the real gameplay bug)** — performance now routes through Harlowe result passages `Waltz Result Up`/`Down` (apply `$statGain`/`$statLoss`, forward to O'Flatterly's). Tunable: buckets `score >0.65 / <0.35`; magnitudes ±14 morale, +6/−8 sob. **Needs a real-play confirm** — debug-jump can't drive forwarder passages (the existing "A Doorway on Dean Street" forwarder stalls identically).
>   - **Cow-ride skip** (`#cow-state-data`), **shop-bell phase** (marker prints the phase), **pentangle re-reveal** (`window._dssSawPentangle` session flag, reset in Start/StoryInit), **debug reveal tool** (clears the flag).
>   - **Pattern for next time** (also memory `project_harlowe_not_exposed.md`): reads → print into a hidden DOM element + read `textContent`; writes → JS-side flag or a `(set:)`+`(go-to:)` result passage. Never `window.Harlowe`.
> - **Also 2026-06-02:** lowered the Centre Point "every man and every woman is a star" caption (`bottom` 150px → 115px) so it clears the astral constellation while staying above CLIMB IT.

Three **read-only static audits** of `Dream Street Shuffle.twee`. No game files were edited, no `sync_html.py`, no git. Each finding cites a passage/line and a confidence level (Confirmed in source / Suspected — needs a real-play or on-device check). These are *suspected* issues for you to confirm — runtime verification stays yours (debug-jump is unreliable).

## The three reports
1. **[AUDIT-1-narrative-reachability.md](AUDIT-1-narrative-reachability.md)** — dead ends, orphans, soft-locks, broken link targets.
2. **[AUDIT-2-state-ending-logic.md](AUDIT-2-state-ending-logic.md)** — variable consistency, ending reachability, Tarot logic, save compatibility, stat clamps.
3. **[AUDIT-3-accessibility-mobile.md](AUDIT-3-accessibility-mobile.md)** — reduced motion, touch/mobile, screen-reader semantics, contrast, focus.

## Headline

**The structure and state machine are healthy.** Zero broken link targets, no hard soft-locks, ending reachability is sound, stat clamps are consistent, and the minigames already pair touch handlers with mouse and have keyboard controls. The game is in good shape.

**The one genuinely severe gap is reduced motion** (Audit 3): against 163 `@keyframes`, ~200 `animation:`, and 45 `requestAnimationFrame` loops there is currently *zero* `prefers-reduced-motion` handling — a real exclusion risk for motion-sensitive players, and a possible photosensitivity concern with the full-screen flash keyframes. Everything else is polish or future-edit hygiene.

## Severity totals across all three
- **Critical: 1** — no reduced-motion handling (A3 / R1).
- **High: 2** — modal screen-reader semantics + focus management (A3).
- **Medium: 12** — dead state vars, small-touch-target ✕ glyphs, the Lackland back-door discoverability trap, etc.
- **Low: 14** — vestigial flags, theoretical-but-practically-unreachable edge cases, contrast-to-verify.

## If you only do a few things
1. **Reduced-motion kill-switch** (Audit 3, R1) — biggest real-world impact; a CSS `@media (prefers-reduced-motion: reduce)` block is an instant quick win, then a shared `matchMedia` flag to gate the rAF/scene loops + typewriter. *(Note: per your standing preference I will not re-propose anything you've vetoed — this is new ground, not the rain particle.)*
2. **Modal a11y** (Audit 3, S1/S2) — add `role="dialog"`/`aria-modal`/`aria-labelledby` and focus-in/return to the three shared modal builders; one-time edit.
3. **Lackland back-door visible exit** (Audit 1, N1) — the only screen that *reads* as a dead end (recoverable via header BACK, but a visible link would remove the trap).
4. **Dead-state tidy** (Audit 2, S1–S4) — `$ppScore`/`$oppScore`, `$albaRevealed`, `$cowRideWon`, `$drankAtFrench` are set but never read. (Audit 2 deliberately did *not* auto-action these — a dead-code pass already ran, and these belong in your review queue.)

All findings are advisory. Nothing here was actioned.
