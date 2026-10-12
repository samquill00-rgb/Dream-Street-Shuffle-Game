# Overnight brief — 12 October 2026 (written by Claude, for Claude)

Sam has gone to sleep after a playthrough. He moves flat in the morning and switches project, so this is the last pass: the game must be in its best possible state by ~07:30 UTC. Work for five hours, iteratively. Never stop early to ask; if a call is genuinely his, PARK it (list it in the morning report) and press on.

## Sam's notes (do every one, in order, then iterate)
1. Ordering and display are still off, particularly around the Pillars visits.
2. The art deco leaves animation drawn in the end game just before PLUS ULTRA has disappeared: bring it back.
3. It isn't clear enough what your next task is.
4. The game is winnable too quickly: you can win without engaging with LILY's flowers or the haunts. Fix the weighting.
5. It must be much clearer when you have a next task, and when there is something to take in a venue.
6. All is going well but the weighting is wrong.
7. Too few rising petals at the Dawn close: flood the screen.

## Rules
- Source of truth: `Dream Street Shuffle.twee`. Never Read the .html; rebuild with `python3 sync_html.py`.
- Never alter Sam's creative text. New player-facing words must be minimal, functional signposts in the game's existing register (like "Burn it", "Not tonight."), and every one is listed in the morning report for his review.
- Commit + push to `claude/fervent-albattani-tfhn90` after each verified fix (PR #103 carries it all; retitle/describe at the end).
- Test every change in headless Chromium (harness at scratchpad/audit-2026-09-16/harness.py; serve on 8777 as a background task with a long timeout).
- Harlowe: bracket `($x is not true)`; no `(name:` in comments.
- Loop after the seven notes: full playthroughs (agents, read-only) → fix → re-test, focusing on ordering, pacing and clarity.
- At the end: update HANDOFF.md, write the morning report (what changed, every new line of text, parked questions).
