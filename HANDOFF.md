# Dream Street Shuffle — Session Handoff
Date: 2026-05-02
Focus: Repeat-visit prose, phone-call ordering, venue exhaustion gates, audit of the whole.

---

## What this session did

### Bugs fixed
- **French repeat-visit prose** — was always showing first-visit prose. Now uses a manual counter in `$visited's FrenchVisits` (the same datamap pattern that already works for `$visited's French` / `Pillars` / `Colony`). An earlier `(history:)`-based attempt was silently returning 0; replaced.
- **Aoife before Lily** — Lily phone-call rings could pre-empt the Aoife call. Every Lily-call trigger (Coach, Pillars, Ronnie's, Colony, French) now also requires `$hadPhoneCall is true`. Dual-ring is unaffected since it transitively requires `$hadLilyCall1`.
- **Lily phone-call exit timing** — "Hang up." link now appears at 10s (just as dialogue ends) instead of 14s. Auto-redirect bumped 28s → 30s so the link has a real window.

### New gates on Dean Street (exhausted-state lockouts)
Three venues that previously stayed clickable after their content was exhausted now grey out:
- **The Pillars** — `[DONE FOR TONIGHT]` once `$metCritic is true`.
- **The Colony Room** — `[DONE FOR TONIGHT]` once `$knowsRonnies is true`.
- **Ronnie Scott's** — gate tightened from "entered once" (`$visited's Ronnies`) to "actually finished the setlist" (`$completedSetlist`). Wording changed `[CLOSED]` → `[DONE FOR TONIGHT]` to match. Side-benefit: accidentally bouncing in/out of Ronnie's no longer locks the player out of haunt 7.

### Prose drop-ins (Dr Quill's text)
- French 2nd visit: _"A man cannot step into the same pub twice, because it is not the same pub, and he is not same man."_
- French 3rd+ visit: _"There is always a third."_

---

## Audit thoughts on the whole

What's strong now:
- The alba-hint strip in cool grey-blue — quiet, on-mood, doesn't focus-pull.
- The typewriter Name Your Book title page.
- The dawn passage, with the warm/cool contrast restored and petals tuned.
- The hub indicators (`◆ ▲ ✦ ●`) now read as a real progress map. With the new gates added this session, exhausted venues drop out of the choice space cleanly instead of dangling.

What still feels soft, ranked:

1. **Rejections / dead-ends rarely feel like progress.** "Trisha's [CLOSED] · NOT NOW · TRY ELSEWHERE" is functional but flat. Dr Quill flagged this and intends to play through to feel where it lands.
2. **Lily glimpses** read as decoration more than mechanic. Dr Quill said he'd try to make them more obviously part of play. Possible direction: a tiny counter, or a one-time hint after the first glimpse explaining what's accumulating.
3. **The new French 2nd/3rd-visit prose** is very short (one line each) compared to the rich first-visit prose. Reads as deliberate compression — but there's room if Dr Quill wants to give them a touch more atmosphere on later passes.

---

## Open items / suggestions for next session

In rough priority:

1. **O'Flatterly quest text** — pending. Dr Quill to provide the new prose; drop-in only.
2. **Playthrough-driven dead-end pass** — once Dr Quill plays through with the new gates, decide which `[CLOSED]` / `NOT NOW` strings should turn into small forward-pointing prose ("…but you remember Ronnie's is still open" etc.) vs stay as terse signage.
3. **Lily glimpse mechanic clarity** — design pass. Counter, whisper-cue, or first-glimpse hint.
4. **Orphan passage audit** — `Alba Revealed`, `Centre Point router`, `Wrong door`, `ARCHIVE-*`. Check reachability; delete dead ones.
5. **Phone-call exit timing on _The dual ring_** — currently 16s exit / 28s auto. Dialogue runs to ~21s, so the exit appears mid-conversation. Might want to bump exit to ~22s for parity with the Lily call's "appears as dialogue ends" feel.

---

## Workflow notes

- Source of truth is `Dream Street Shuffle.twee`. Never read `Dream Street Shuffle.html` (~3 MB compiled artifact with embedded base64 audio).
- After edits: `python3 sync_html.py`, then "synced, commit when ready."
- Git stays in Dr Quill's hands — no `git add` / `commit` / `push` from Claude.
- `HANDOFF*.md` is gitignored; safe to overwrite this file in future sessions.

---

## Commit status
Synced after: French visit-counter fix, Aoife-before-Lily gating, Lily-call exit timing, Pillars/Colony/Ronnie's exhaustion gates, French 2nd/3rd-visit prose. Working tree dirty. Dr Quill commits via GitHub Desktop.
