# Dream Street Shuffle — Session Handoff

**Date:** 28 April 2026 (evening)
**Focus:** Title polish, Name Your Book book-spine redesign, woodwind chime, distant-traffic ambient (rumble + drips + horns), outdoor-Soho tagging.

---

## What this session did

### Title passage
- `(CONTINUE WHERE I LEFT OFF)` link now wrapped in parentheses, slightly smaller (font-size `0.95em` → `0.8em`), pushed further below BEGIN (margin-top `0.9em` → `1.6em`).

### Name Your Book passage — book spine redesign
- Removed the old decorative SVG frame (corner curves + edge lines).
- Replaced the input field with a full **deep-red leather book spine SVG** sitting in the passage:
  - Gradient body (dark at top/bottom edges, brighter middle — gives a leather-curvature feel).
  - Vignette down the sides for spine depth.
  - **Two pairs of gold raised bands** top and bottom (antique cloth-bound look).
  - **Faint gold cartouche rectangle** in the middle + four small gold corner dots — title sits inside.
  - Soft drop shadow under the whole spine.
- Spine size **580×175** (was 440×140), shifted **32px left** via `transform: translateX(-32px)` so it slightly overhangs the centred container.
- Textarea overlays the spine: italic gold lettering (`#e8c560`), transparent background, no border.
- **Killed the white default Harlowe wrapper** — added overrides on `.nb-spine-input tw-expression` (and direct children) to clear `border`, `background`, `box-shadow`, `padding`, `margin`. The cursor blinks inside the cartouche with no visible frame around the text box.
- "Name your book" prompt: **removed italic**, colour changed from gold (`#b8a04a`) → silvery-blue (`#b8cae0`) to match the title page palette.

### Chime for "NAME YOUR BOOK" reveal
- New procedural sound `dssAudio.chimeBook()`. Went through three rounds of iteration:
  1. First attempt: layered chime with three staggered tones + breath. Rejected — Dr Quill wanted a single clean tone.
  2. Second: pure sine at A5. Rejected — too glassy, not woodwind enough.
  3. **Final**: flute-like at F5 (698Hz) — sine fundamental + brief breath-noise transient at the attack (filtered air across an embouchure) + subtle 4.5Hz vibrato that fades in after the initial note. Slower (80ms) "in-breath" attack rather than a hard chime onset.
- Final volume bumped down (peak gain `0.16` → `0.10`, breath `0.05` → `0.03`).
- **Trigger** moved from a fragile setTimeout in The Night Ahead's HTML to **inside the typewriter completion handler** in the .twee userscript (around line 7459). Fires the moment the cursor disappears and the link begins fading in. Guarded by a `/NAME YOUR BOOK/i.test(container.textContent)` check so it ONLY triggers on The Night Ahead — other typewriter passages aren't affected.

### Distant traffic ambient
A new outdoor ambient bed exposed as `dssAudio.distantTraffic()` / `dssAudio.stopDistantTraffic()`. Sits in the existing `_ambient` slot so it cleanly yields to wind/fire if the player drifts into a dream/pyre passage.

- **`distantTraffic()`** — brown noise (integrated white noise) heavily lowpassed at **380Hz** with a slow **0.13Hz amplitude LFO** for vehicle swells. Master gain `0.06` with `0.025` LFO swing (peak ~`0.085` — sits well under the music and SFX). Highpass at 60Hz to trim sub-rumble.
- **`carHorn()`** — distant horn: two oscillators a major third apart (A4 + C#5, ~440 + 554 Hz, classic dual-tone), square + triangle blend, lowpassed at **850Hz** with amp `0.022` for distance. Random pitch jitter so each one sounds different. Duration randomises 0.25–0.6s.
- **Horn scheduler** — fires every **8–22s** while traffic is active, with a **25% chance** of a double-toot 180–380ms after the first.
- **`dripDrop()`** — short noise impulse + brief pitched sine resonance with a small downward chirp (cavity closing as the drop hits). Random pitch in the **1400–3600Hz** range so each drop is different.
- **Drip scheduler** — deliberately **sparse and irregular**, **5–20s between drops**. Dr Quill wanted these to feel like a serialist melody rather than a steady drip rhythm.
- **Cleanup**: `_stopAmbient()` now clears both horn timer and drip timer when any ambient is swapped out.

### Outdoor Soho tag system
- New `outdoor` tag detected in the passage event handler (around line 5371), alongside the existing `dream` / `pyre` checks. Order of precedence: pyre > dream > outdoor.
- **13 passages tagged `outdoor`:**
  - A Doorway on Dean Street
  - At the Corner of Dean Street and Greek Street
  - The Colony Room Door
  - Cecil Court Approach
  - The 9 "Approach X" passages: French, Coach, Pillars, Lackland's Office, Ginger Light, Colony Room, Ronnie Scott's, Copper's Lair, Chinese Fish and Chips
  - You speak to the poet
  - LINE 1
- **Dean Street stays untagged** — the music (Dean Street theme) plays there cleanly without traffic underneath.
- Alba Revealed was tried as `outdoor` then removed — felt too UI/quest-box for ambient sound.
- Window state vars `_wasOutdoor` etc. ensure traffic stops cleanly when player enters a venue.

### Failed Freesound experiment
- Dr Quill tried to grab "Pub in Cambridge by domasmo" from Freesound but accidentally saved the **webpage HTML** (`376456.html`) instead of the audio — Freesound requires login to download. The HTML file was deleted. He'll set up a Freesound account tomorrow.

---

## What's still on the bench

### Audio
- **Pub chatter sounds** — current `ambientPub` is filtered noise and sounds too "shhhh". Two paths discussed:
  1. **Procedural improvement**: layer event-based syllables (Farnell crowd-noise approach) on top of the formant-filtered bed — burst-driven rather than continuous noise. Better, but won't fool anyone.
  2. **Sample loop** (recommended for atmosphere): Dr Quill plans to grab a CC-licensed pub ambient loop from **Freesound** once his account is sorted. Would embed via base64 in `sync_html.py` the same way the music does.
- **Licensing notes** for commercial release: Freesound CC0 / CC-BY OK (CC-BY needs credit), avoid CC-BY-NC. **BBC Sound Effects Archive is NOT commercial-safe.** Zapsplat free tier OK with attribution.
- **Possibly more outdoor passages to tag** — Dr Quill said he'd tell me which are missing once he plays through. Untagged candidates I noted earlier: Approach the novelist, Approach Centre Point, Wrong door, Maltese Gangsters, Things turn up, The Stranger at the French.
- **Volume balance** of the music vs new traffic ambient — probably fine but worth listening over a longer playthrough.
- **Other unwired sounds** still on the previous handoff's list: passageWhoosh on subsequent venue entries, footsteps on other surfaces, etc.

### Prose
- Dr Quill is moving to prose work next session — the Pillars of Hercules loop is still where the previous handoff left off. Other untouched prose loops from before: Colony Room, Trisha's, Cecil Court, Coach and Horses, Lackland's Office, Maritime/Carthage dream, Centre Point + endings.

---

## File locations
- **Twee source:** `Dream Street Shuffle.twee` (~33k lines)
- **Compiled HTML:** `Dream Street Shuffle.html` (~3 MB — DO NOT READ)
- **Sync script:** `sync_html.py` (compiles + base64-embeds the music)
- **Music source:** `Dream Street Shuffle experiment theme loop.m4a`
- **Project rules:** `CLAUDE.md`
- **Handoff (this file):** `HANDOFF.md` (gitignored)

---

## Workflow reminder
1. Dr Quill picks a passage to edit.
2. Show prose only (strip SVG/CSS/JS/Harlowe macros).
3. He quotes line + new version, or says "next".
4. Edit with `Edit` tool — never touch his creative text.
5. After a loop: run `python3 sync_html.py` from the workspace folder.
6. Tell him "synced, commit when ready" — never run git commands.

---

## Critical rules
- **NO git commands** from sandbox.
- Verses keep `<br>` line breaks.
- `HANDOFF*.md` is gitignored — safe to write.
- **Never read the compiled HTML.** Work from the .twee with targeted Greps + partial Reads.

---

## Commit status
Several rounds of edits this session — multiple syncs, last one wrote 160 passages cleanly. Audio system grew with the new `chimeBook`, `distantTraffic`, `stopDistantTraffic`, `carHorn`, `dripDrop` functions. 13 passages got new `outdoor` tags. Working tree dirty. Dr Quill commits via GitHub Desktop.
