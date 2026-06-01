# Audit pass — 2026-06-01 (while Dr Quill was out)

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
