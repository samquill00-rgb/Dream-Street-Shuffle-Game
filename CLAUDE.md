# Dream Street Shuffle — project rules for Claude

## NEVER read `Dream Street Shuffle.html`

The HTML is a **compiled artifact** — it's generated from the .twee by `sync_html.py`.
It is now ~3MB (audio is base64-embedded), and reading it wastes huge amounts of tokens.

- **Source of truth:** `Dream Street Shuffle.twee` (read this with targeted Greps + partial Reads)
- **Compiled output:** `Dream Street Shuffle.html` (DO NOT READ — write through .twee + sync)
- **Build script:** `sync_html.py` (turns the .twee into the .html, also embeds the music MP3/M4A as base64)

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
6. Tell him "synced, commit when ready." **Never run git commands.**

## Critical rules

- **NO git commands.** Don't `git add`, `commit`, `push`. Dr Quill handles all commits via GitHub Desktop.
- **Don't alter his creative text.** Verses keep their `<br>` line breaks. Prose changes only when he quotes them.
- **`HANDOFF*.md` is gitignored** — safe to write.
- **Be token-efficient.** Targeted Greps + partial Reads. Don't re-read files already in context.

## Audio system reference

The full audio system lives inside `window.dssAudio` in the .twee (around lines 109–900).
It exposes procedural SFX (`pour`, `phoneBell`, `windFarnell` etc.) and a music player (`startMusic`, `stopMusic`, `setMusicVolume`).
The music auto-triggers on passages whose tags appear in `MUSIC_PLAY_TAGS` — currently `'hub'` (Dean Street).
The music file is embedded as base64 by `sync_html.py` — change `MUSIC_SOURCE_FILE` near the top of that script to swap the track.
