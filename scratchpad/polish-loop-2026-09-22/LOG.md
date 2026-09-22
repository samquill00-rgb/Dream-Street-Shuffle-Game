# Polish loop, 2026-09-22 — running log

Plan: /mnt/project-files/"Polish loop plan.md" (project files). Branch: `claude/project-thread-fqjdg9`. One item per pass, one commit per pass. Approved by Sam 01:21 UTC: start now, branch, git on, preview-links item out.

## Queue (take the first unclaimed)
1. [pass 1, DONE] Set up the chair and sweep: static audit + every-passage render sweep; fix real JS/Harlowe/link errors.
2. Verify Astra's three dream-game retunes in a browser (reclamation_verify.py, nazca_pyramid_smoke.py); fix anything that throws.
3. Phone-width sweep at 390px, CSS-only fixes.
4. Approach scenes, Astra's remaining sixteen, two per pass, in order: buildPHScene, buildCLScene, buildRSScene, buildTSScene, buildGLScene, buildCPScene, buildOFScene, buildFcScene, buildLOScene, buildCRScene, buildTPScene, buildapScene, buildnzScene, buildeiScene, buildpyScene, buildpcScene.
5. Beauty-pass leftovers (20m): Ronnie's bar arena halo; spindrift light on The Climb; heat shimmer on the Nazca road.
6. README tidy (html size, twee is the file to edit).

## Passes

### Pass 1 — 01:22–01:40 UTC — set up the chair and sweep (queue item 1) — DONE, nothing to fix
- **Tooling:** `pip install playwright` works; Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; `python3 -m http.server 8777` from the project folder; node at `/opt/node22/bin/node` (not on PATH).
- **Static audit** (`scratchpad/audit-2026-09-16/static_audit.py`): 226 passages, 0 duplicates, 0 orphans, 0 script errors, CSS braces balanced. Its four "missing link targets" are all dynamic `(link-goto:)` targets (`$liverReturnTo`, `$lilyCallReturn`, `_exitTo`, a `(text: $bookTitle)` label) — false positives, left alone.
- **UserScript:** 43,845 lines, `node --check` clean. **html:** re-ran `sync_html.py`, zero diff, so main's html was in sync.
- **Render sweep** (`sweep.py`, all 206 story passages, rich late-night seed, 1280×900): 0 Harlowe `tw-error`, 0 stray macro text, 0 real JS errors. Every flag was one of two sandbox artefacts, now documented at the top of `sweep.py`: the AAC/MP3 decode error (headless Chromium has no codecs; hits every hub/venue passage that starts music or a bed) and the harness init script throwing inside the three iframe scenes (Dawn Approach White/Black, Cecil Court Approach, Green Sea Approach). Fourteen passages landed somewhere else by design (Doorways → Dean Street, Waltz results → Approach O'Flatterly, Dean Street → Aoife memory 2 under this seed, Pillars → Third Pillar Portal, Colony door → Colony Room, DBG passages → Dean Street).
- **Changed:** `scratchpad/audit-2026-09-16/sweep.py` only (results path no longer hard-coded to a dead session folder; docstring with the run recipe and the two artefacts). No game file touched.
- **Next:** queue item 2, verify Astra's three dream-game retunes in the browser.
