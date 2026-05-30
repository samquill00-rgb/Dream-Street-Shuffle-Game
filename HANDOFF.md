# HANDOFF — 2026-05-30 (Sarah's playtest notes — triage + fixes)

This session worked through **Sarah's handwritten playtest notes** (playtest dated 27/05/26), photographed and sent in. They were transcribed into a numbered 37-item list, and we worked it item-by-item: I present each, Dr Quill either okays my transcription or sends a retranscription, then I action it. **Branch: v2-expansion.**

Working loop: edit `.twee` → `python3 sync_html.py` → verify in browser via the preview MCP (local server on port **8923**, `.claude/launch.json` config name `dss`). Never `git`. Never read the `.html`.

---

## Playtest backlog — status of all 37 items

Numbers are stable references we've been using. ✅ done · ⏳ pending · ❓ transcription unclear (needs Dr Quill) · 🅿️ parked · 👁️ observation only.

**Page 1**
1. ✅ Coin "toss it" → "pocket it": after the first toss, **Pocket it** is now the big/bright link and **Toss again** the small/faded one. [coin overlay .twee ~34004; CSS `.coin-overlay-primary`]
2. ✅ Lily double-pick bug: clicking an already-gathered lily no longer spawns a petal/notebook entry — now a low "block" thunk + a brief fade. New SFX `lilyBlock`, listener guard, `.lily-spent-blip` CSS. [.twee ~2758 SFX, ~3090 listener, ~12051 taken-handler]
3. ❓ "Label pink — key" — least-confident read; parked pending Dr Quill.
4. ⏳ Keep the chord/music into the verse longer (audio).
5. ⏳ "Have Aoife's voice" (wants to actually hear Aoife — audio?).
6. ⏳ "Hobson confused me".
7. ✅ Password signpost — see below. Plus a follow-on fix (conditional prose).
8. ⏳ "Stats came back w/ more chips" — **needs Dr Quill's read** (cryptic). Next up.
9. ⏳ Rules pop-up before you start, board visible behind (related to #13).
10. ⏳ Explain how morale vs sobriety integrate.
11. ❓ "Sebastian Aaron-[zinns?] Hill — Ben reminded me" / "mi amigo" — unclear (maybe Radio Mi Amigo, tying to interval-radio?).
12. ⏳ Name/clarify a haunt "calcinatio".
13. ✅ Minigame rules modal — see below.
14. ⏳ Use Purcell's "Dido's Lament" for Dido (music cue).
15. ⏳ "Skunk Hour" (Lowell) for the interval radio.
16. ❓ "Interval — more 'memory card up'" — unclear.
17. ⏳ Make the "back" navigation more obvious.
18. ⏳ "What does 'close to the end' mean — (lives?)".

**Page 2**
19. ⏳ Pub music w/ Lackland.
20. ❓ "Speak up pony, was after someone was a [few/Jew?]" — unclear.
21. ⚠️⏳ "PONG GAME FUCKED" — a real bug Sarah hit. **Not yet diagnosed.** NB: this session wrapped the pong boot for the rules modal (whole-body defer) — that's verified working, but the *original* pong bug she flagged still needs investigation.
22. ❓ "Calls — we had, what's going on?" — unclear (phone-call confusion).
23. ❓ "Make it so you select the [answer?] with the notebook" — unclear.
24. ⏳ "grenadine / incarnadine" (word-pairing note).
25. ⏳ More beautiful tarot.
26. ⏳ Make more of the Tarot.
27. ⏳ "Wicked deck of cards".
28. ❓ "'insured thing' — any noun" — unclear.
29. ⏳ "Make calls the same voice".
30. ❓ "…PP for Shelley's liver [?]" — unclear (badly creased).

**Page 3**
31. ✅ Bernard/Lackland gating — see below.
32. ❓ "eyes like dutch pearls" — marked ✗ (fixed? or cut? — ask Dr Quill).
33. ❓ "admixture" twice — marked ✗ (note: "admixture" appears in the Lily-4 glimpse at the Pillars *and* in Davy/somewhere — worth a dedupe check).
34. ⏳ Program it so you're guaranteed ≥1 pentacle.
35. ⏳ Background music — Stravinsky + Parker, R. Scott.
36. ⏳ Cecil Court at end.
37. 👁️ "2-hour playthrough" — runtime observation, no action.

---

## Items completed this session (detail)

### #1 — Coin: Pocket it is the prominent link after first toss
After the first toss reveals "Pocket it", the JS now swaps emphasis: `coin-keep-btn` gets `.coin-overlay-primary` (1.3em, bright), the toss button gets `.coin-overlay-dismiss` (small, faded). First view (pre-toss) unchanged. [.twee inline coin overlay ~34004; CSS `.coin-overlay-primary` near `.coin-overlay-dismiss`]

### #2 — Lily can't be "gathered twice"
The delegated lily-click listener fired a petal on *every* click of a `tw-hook[name=lily\d]`, but `(click-replace:)` is one-shot, so a 2nd click made a petal with no notebook entry. Fix:
- New `lilyBlock()` SFX (low, damped thunk) added next to `lilyChime`, exposed on `window.dssAudio`.
- Listener now tracks `_petalled[name]`; a repeat click → `lilyBlock()` + `lilyBlip()` fade, no petal.
- The reload-already-taken `.lily-taken` handler now uses `lilyBlock` + fade too (was reusing the bright chime).
- `.lily-spent-blip` keyframe (dips to ~6% opacity and back).

### #7 — Password is in your notebook (+ conditional prose follow-on)
- Added a signpost line **inside** each `⚿ PASSWORD LEARNED` card, beneath the word: *"It's saved in your notebook ↑"* (new `.item-note` / `.item-note-arrow` CSS, cool palette, arrow points up to the header NOTEBOOK link). Applied to all 3 acquisition cards: St. John's Word ("Valletta"), Davy Merkin's tip ("Valletta"), O'Flatterly hint ("I said hello").
- **Follow-on (Dr Quill's call):** the *word itself* should only be spoken once. Both Valletta speakers' prose is now `(if: $knowsCopperSecret is false)[…reveals "Valletta"…](else:)[…"You know the word already."…]`. Card is already gated on the same flag, so on the 2nd encounter: no reveal, no card. Verified both branches live (temp-flag test). Davy's em dash removed per Dr Quill.
- Note: the two Valletta cards share `$knowsCopperSecret`; "I said hello" is a separate password on `$knowsCopperWord`. The notebook entry (.twee ~38215) is the intended persistent record.

### #13 — Rules modal before each minigame (with a Play button)
New reusable `window.dssShowMinigameRules({key, title, subtitle?, lines[], onPlay})` — gold-on-dark modal, diamond bullets, big ▶ PLAY button; appended to `<body>` @ z-index 99990. **Teardown via MutationObserver that only fires when the launch `tw-passage` actually leaves the DOM** (an earlier "tear down on any tw-story child-add" version wrongly killed the modal on the cow's heavy boot — fixed). [JS just above the DEBUG menu IIFE; CSS `.dss-rules-*` after `.lily-spent-blip`]

Wired into **4 games**, each verified end-to-end (modal → Play → game boots, no Harlowe error):
- **Pong** (whole-body defer), **Cecil Court Waltz** (whole-body defer), **Cellar Fight** (replaced its 2.4s auto-start timer), **Bernard's Cow** (gated the auto-trigger so the modal only shows when the game actually runs — respects its `cowRideDone` skip-gate).
- **Sketch the Painter** — Dr Quill said **NO** modal; reverted to booting normally.
- **The Bar (Ronnie's)** — left as-is (already has its own engraved pre-bar rules panel + "Go to the Bar" button).

Integration pattern for the deferred games: wrap the inline IIFE body in `var __boot=function(){ … };` and call `(window.dssShowMinigameRules||fallback)({…, onPlay:__boot})` at the close. Gate the *kick*, not the whole body, when a game has a skip-gate or pre-rendered title screen (cow).

### #31 — Bernard shouldn't re-send you to Lackland
Jeffrey Bernard (in the **Coach and Horses lock** passage, ~.twee:33709) said *"Speak to Lackland, he'll be about."* unconditionally. Now gated `(if: $knowsLackland is false)[Speak to Lackland, he'll be about. ]` — drops out cleanly if you already know. No "visited Lackland" flag exists; `$knowsLackland` ("you know to see him") is the right signal. Verified both branches live.
- **Open question for next session:** Davy Merkin also opens with *"Go to see Lackland, he's surely expecting you…"* unconditionally — same redundancy if you met Bernard first. Left ungated (Davy is the password-giver). Dr Quill to decide whether to gate Davy's opener on `$knowsLackland` too.

---

## Verification workflow that works for this project

- Local server: preview MCP `preview_start` with config `dss` (port 8923), serving the compiled `.html`.
- **Jump to any passage:** `window.location.hash = '#dss-debug-jump=' + encodeURIComponent('Passage Name'); window.location.reload();` — must be a **real reload** (setting `location.href` with only a changed hash does NOT reload). Each jump starts a **fresh game** (state does not persist across jumps).
- **Test a flag-gated branch:** temporarily inject `(set: $flag to true)<!-- TEMP-TEST-REMOVE -->` above the conditional, sync, jump, verify, then revert + re-sync. (Used for Valletta and Bernard else-branches.)
- Read state from the page with `document.querySelector('tw-passage').textContent`. NB: `window.Harlowe` / `window.Engine` are **not** exposed in this build, so you can't set Harlowe vars from the console — use the temp-`(set:)` trick.
- Grep the compiled `.html` to confirm edits survive the build; passage scripts are HTML-entity-encoded (`'`→`&#x27;`, `"`→`&quot;`, `<`→`&lt;`), so grep for the encoded forms or for unquoted substrings.

---

## Carried over from prior HANDOFFs (still relevant)

- **`tw-link` vs `tw-expression`** — Harlowe renders bracket links as `<tw-link>`, `(link:)` macros as `<tw-expression>`.
- **`dssSpawnMotes`** accepts `{noScroll:true}`.
- **`Failure: Trisha's`** is NOT orphan — referenced by JS, don't prune.
- **`(click-replace:)` is one-shot but its named `tw-hook` lingers in the DOM** — the root cause of #2; guard JS that reacts to those hooks.
- **Body-level overlays persist across passage transitions** — wire a MutationObserver on `tw-story` to tear them down (the rules-modal teardown uses this; key the teardown on the launch passage leaving the DOM, not on any mutation).
- **⚠ WebGL on Dr Quill's Chrome** was failing at the end of the 2026-05-27 session (all 3D scenes showed HTML overlays only). The CLIMB IT fallback at Centre Point lets the ending be played through regardless. If 3D is still broken, check `chrome://gpu/` / hardware accel / restart. The 2D-canvas minigames (this session's work) are unaffected.

## Open / parked
- Murky transcriptions to resolve with Dr Quill: #3, #11, #16, #20, #22, #23, #28, #30; X-meaning of #32/#33.
- #21 "PONG GAME FUCKED" — original pong bug still undiagnosed (separate from the modal work).
- #33 hint: "admixture" appears twice (Lily-4 Pillars glimpse + elsewhere) — possible dedupe.
- Whether to gate Davy Merkin's "Go to see Lackland" like Bernard's (#31 follow-on).
- `aesthetic-suggestions.md` backlog (A4, C1b, B1, C2, …) — still parked from the 2026-05-27 session.
