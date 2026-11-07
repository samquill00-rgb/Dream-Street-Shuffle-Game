# Dream Street Shuffle — project rules for Claude

## Session start

If `HANDOFF.md` exists at the project root, read it before responding to the first message. It carries forward what the previous session worked on, the audit-of-the-whole, and a prioritized list of next items.

## NEVER read `Dream Street Shuffle.html`

The HTML is a **compiled artifact** — it's generated from the .twee by `sync_html.py`.
It is ~5MB (since 2026-09-01 the audio is LINKED, not embedded — see below), and reading it wastes huge amounts of tokens.

- **Source of truth:** `Dream Street Shuffle.twee` (read this with targeted Greps + partial Reads)
- **Compiled output:** `Dream Street Shuffle.html` (DO NOT READ — write through .twee + sync)
- **Build script:** `sync_html.py` (turns the .twee into the .html; `AUDIO_MODE = "link"` writes relative URLs to the audio files beside the html — set `"embed"` only for a file:// build)

If you need to verify the compiled output (e.g. "did the tag actually make it through?"), use a `grep` via `mcp__workspace__bash`:

```
grep -o '<tw-passagedata[^>]*name="Dean Street"[^>]*' "Dream Street Shuffle.html"
```

— never a full `Read`.

## Workflow

1. Dr Quill picks a passage to edit.
2. Show the prose only (strip SVG/CSS/JS/Harlowe macros). Don't quote large chunks back.
3. He gives the line + new version, or says "next".
4. Edit with `Edit` tool — never alter his creative text.
5. After a loop of edits: `python3 sync_html.py` from the workspace folder (uses the bash tool).
6. Run the regression player: `~/.dss-regress/venv/bin/python tools_regress.py` (headless and muted, about 18 minutes for everything; a name filters, e.g. `french` or `room-ti`). Never call a fix done while a check fails, and report what it does NOT cover.
7. Tell him "synced, commit when ready." **Never run git commands.**

## Regression player (since 2026-11-07)

`tools_regress.py` plays the built html like a player (real clicks on room objects via the read-only `window.__dssRooms` hook in `dssRoomPlay`) and checks that fixed playtest notes stay fixed. Watchers run in every check: page errors, a slip typing while hidden, a NOTEBOOK trail starting off screen or missing the NOTEBOOK. **Every playtest note fixed gets a `@check` that fails if the bug comes back** (prove it once by planting the old bug, then restore). Visual claims about a close-up are checked from the close-up camera, not the room's opening view. The `room-<id>` checks visit all ten rooms on a fresh first night: every clickable object opens its close-up, has a non-empty card, and is mostly in view from its close-up camera (a nine-point ray test; anything passed by eye goes in `SEEN_BY_EYE` with the reason). The `world-<name>` checks walk each dream world from its `?start=` preview, pressing the first untaken way on (anything with a pointer cursor that is on top), holding Space on the hum game, and fail on a blank 3D view, a page that scrolls at 1440x900 (checked again just before each press), or a dead end. Setup if the venv is gone: `python3 -m venv ~/.dss-regress/venv && ~/.dss-regress/venv/bin/pip install playwright`.

## Critical rules

- **NO git commands.** Don't `git add`, `commit`, `push`. Dr Quill handles all commits via GitHub Desktop.
- **Don't alter his creative text.** Verses keep their `<br>` line breaks. Prose changes only when he quotes them.
- **`HANDOFF*.md` is gitignored** — safe to write.
- **Be token-efficient.** Targeted Greps + partial Reads. Don't re-read files already in context.

## Notes batching

When Dr Quill sends a message containing **two or more notes/items** (numbered, comma-separated, or new-line-separated), **immediately** build a `TodoWrite` list capturing every item before doing any work. Work through them in order, marking each completed as soon as it's done. This prevents accidentally skipping items in long lists — a pattern he's flagged as a recurring frustration. Single-item messages don't need this; the bar is "multiple notes in one message."

## Audio system reference

The full audio system lives inside `window.dssAudio` in the .twee (around lines 109–900).
It exposes procedural SFX (`pour`, `phoneBell`, `windFarnell` etc.) and a music player (`startMusic`, `stopMusic`, `setMusicVolume`).
The music auto-triggers on passages whose tags appear in `MUSIC_PLAY_TAGS` — currently `'hub'` (Dean Street).
The music and ambient beds are LINKED as relative URLs by `sync_html.py` (`AUDIO_MODE = "link"`, `AUDIO_EMBEDS` list near the top of that script) — the html needs an http server (preview config `dss-game`, GitHub Pages); it no longer plays audio from file://. Swap a track by editing its tuple in `AUDIO_EMBEDS`.
