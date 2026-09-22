# Dream Street Shuffle — the LIVE game

**This repository is the live, deployed game.** If you only read one thing: the game
people play is the file [`Dream Street Shuffle.html`](Dream%20Street%20Shuffle.html) in
this repo's root.

- **Play / share this link:**
  https://www.samquill.com/Dream-Street-Shuffle-Game/Dream%20Street%20Shuffle.html
- **The file to edit:** `Dream Street Shuffle.twee` — the Twine/Harlowe source. The html
  is generated from it and is not edited by hand. Story ID (IFID) `E3F7C9E2-…`.
- **The file people play:** `Dream Street Shuffle.html` (~6 MB). Since September 2026 the
  music and ambient beds are linked as the audio files beside it rather than embedded, so it
  needs a web server (GitHub Pages, or a local `python3 -m http.server`); opened straight
  from disk it plays no sound.
- **To publish a change:** edit the twee → run `python3 sync_html.py` (rebuilds the html)
  → commit both files → **push in GitHub Desktop**. GitHub Pages serves it under the
  `samquill.com` domain automatically (~1 min to rebuild).
- **Saving:** the game autosaves to the browser's `localStorage` every turn (header
  passage). The title screen offers **Continue** when a save exists, and a "✓ Progress
  saved" toast flashes on returning to Dean Street. Private/incognito mode can't save —
  the game shows a warning in that case.

## ⚠️ Do NOT confuse with these older copies

- **The `Dean-Street-Shuffle` repo** — an old 33-passage export from January 2026.
  Superseded; its old URL now redirects here.
- **A "Dream Street Shuffle" story in the Twine *desktop app*** — a separate, older draft
  (more passages, but **no music**, a different story ID `2CA3…`). It is **not** what's
  deployed. If you open Twine and don't see the music/visuals, you're in the old draft —
  close it; the real game is the HTML in this repo.

_The live game and its save system live HERE, in `Dream Street Shuffle.html`._
