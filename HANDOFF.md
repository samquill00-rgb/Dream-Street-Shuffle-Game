> **▶ NEXT SESSION — START HERE.** Loop: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** (~50 MB) — grep it. The preview and testers both cache hard: **Cmd/Ctrl+Shift+R**, and when automating, cache-bust with `?v=n` — a plain reload can serve a stale build even after a sync.
>
> **⚠ Standing gotchas:** `window.Harlowe`/`window.Engine` are `undefined` (DOM-bridge for reads, `(set:)`+`(go-to:)` result passages or JS flags for writes — memory `project_harlowe_not_exposed.md`). HTML/`<script>` render only from top-level hooks. `(after:)` never fires in backgrounded tabs — use guarded `setTimeout` (the Dawn passage shows the `_passageGen` double-defer pattern). Debug-jump half-inits (forwarders stall; the TURNS readout misreports on a raw jump — walk in via a temp passage with a real link). **Header passages render BEFORE the body**, so body-side `(set:)`s (e.g. the `$returns` increment) haven't happened at header time.
>
> **State at handoff (2026-07-18, ~03:00):** Enormous mechanics session — the game now has real jeopardy. **NOT yet committed** (the whole night = `Dream Street Shuffle.twee` + `Dream Street Shuffle.html`, commit via GitHub Desktop). Full detail below.

# HANDOFF — 2026-07-18 — The Dawn Clock session (jeopardy, Dawn screen, minigame sharpening)

Started with a full mechanics-and-story assessment (three parallel audits; no regressions found; the Jeopardy doc's diagnoses all CONFIRMED in source — minigame outcomes were cosmetic, stats couldn't bottom out, night was infinite). Then built, with Dr Quill approving each step:

## 1. The Dawn Clock (the keystone)
- **`$nightLength` = 16** in StoryInit AND Start (the one tuning knob). Dean Street derives `_lapsLeft` / `_dawnHere` after the `$returns` increment; every venue link now also carries `_dawnHere is false`; at zero the hub offers only "The dawn is coming" → **The Fetch** (works with incomplete alba → Alba Incomplete — "the dawn will come regardless"). The Fetch's "Not yet. Back to the night." is gated `$returns < $nightLength`. Old saves heal `$nightLength` in Dean Street's back-fill block; a save already past 16 returns meets the dawn on its next hub visit (accepted).
- **Coach crisis (`$coachUrgent`) takes precedence over the dawn** — it is still the road to LINE 3; "scraped it at the bell" emerges naturally.
- The **diegetic layer (sky washes + beat lines + lost-time cue) was built, then fully REMOVED at Dr Quill's request** — the clock is numeric-only now. Zero remnants (`dss-sky-wash`, `lostTimeCue` all gone).

## 2. The TURNS readout (header)
- Shares the ALBA row: `ALBA ◆◆◆ 0/3   12 TURNS LEFT` — no label, the count wears the stat-label Playfair style itself. Amber at ≤3 (`night-low`), ember at 1 (`night-last`), "THE DAWN IS HERE." at 0. Guarded `(if: $nightLength is a number...)` for unhealed old saves.
- **Off-by-one handled:** header renders before the body increments `$returns`, so on Dean Street the readout subtracts the lap being spent now.
- Layout: `.alba-strip` is `repeat(4, max-content)` (desktop + mobile); `.alba-jewels` shed its old fixed `width:140px; margin-left:36px` via `.stat-bars .alba-strip .alba-jewels` override; `.stat-bars .alba-strip .stat-label { min-width: 0 }` (must outrank the later 62px rule). `.back-one-link` top 143→158px (mobile 128→142). Verified desktop + 375px mobile.

## 3. Minigame time stakes
Losses at **pong, waltz, bar, fight** each cost one extra `$returns` (set in PP Defeat / Waltz Result Down / Bar Canvas Lose / Fight Defeat). Wins free. Cow excluded (climax; both outcomes yield LINE 3 by design).

## 4. Dawn screen rebuilt (was "a school report")
- HAUNTS/FLOWERS tally **deleted** (orphan CSS `.dawn-summary*` remains, harmless). In its place at 12s: the **five-bell lily sprig** (new passage `Dawn Lily Sprig` — bell art duplicated from Build Notebook because `_bell` is passage-local; star only at 5 flowers) + a **gold wheel emblem** that re-summons the Ripley's Wheel in new **hold mode** — `dssOpusReveal(hold)`: no auto-fade, click/Esc/Enter dismisses, pointer-events enabled. Play again at 16s. All reveals via the guarded-setTimeout pattern, not `(after:)`. Emblem is clickable through the petal storm (verified by hit-test).

## 5. Boxing sharpened (`window.FightGame`)
- **Input:** `touchstart` (kills tap latency) + keyboard (← → dodge, ↓/Space block, ↑ counter; document-level listener, removed at endGame + self-removing when canvas leaves DOM). Keys line added to the rules popup.
- **Impact:** camera kick on hits taken (CAUGHT 7 / TRADE 5 / GRAZE 2.5 / ABSORBED 2, ~340ms decay, oversized bg fill); bar **damage-ghosts** (slow-trailing bright wake) + border flash.
- **Counter window now visible:** the COUNTER ellipse warms during the live 0.50–0.82 window in real exchanges (dimmed by drink, like the dodge cue).
- **KO:** Copper **falls** (hinged at his feet, ~700ms ease-in, body-thud at 650ms), the label waits for him to land, and a **big cartoon K.O.!** slams in (starburst, cream-gold, double outline, overshoot → slow throb; Dr Quill's request). `loop()` runs past gameOver via `_loopUntil` (+6s).
- The DODGE/COUNTER/BLOCK table above the canvas is **removed** (popup-only rule).

## 6. Cow ride sharpened
- **Real bug fixed:** the 35s Harlowe bail link bloomed a fail link under WINNING riders (a ride runs ~48s). Then generalised: **all four canvas bails now 150s** (pong was 70, waltz 45 — whose link even skips the result passage — fight 80), because the timers count from passage render and every game sits behind a popup the player can dwell on.
- **Audio leak fixed:** music + hoofbeat ticker survived any exit that bypassed `navigate()` — a MutationObserver on the canvas leaving the DOM now tears both down (this is what Dr Quill heard galloping in the background).
- SFX: thud on hits, punch+thunder on the throw, bright chord on the win (gallop given 2.5s then quieted). Car-horn telegraph when a wide vehicle (cab/Uber) spawns. Input parity: lane-flash + whoosh on keys/click/touch alike; debounce 120→90ms; lane lerp 0.18→0.24. Title-phase input now enters practice (was skipping it into the real game).
- Pacing: speed tiers raised to `[2.0, 2.6, 3.3, 4.1, 5.1, 6.3, 7.8, 9.4]` (opening had ~21s of low threat; peak unchanged). Win: gold spark stream during the gallop-out, warm flash, glowing YOU RODE IT.
- **Noted, not actioned:** one fully-idle run WON untouched (right lane); a second idle run lost fast. Variance, not an exploit — optional spawn-bias toward the player's lane if passivity should be reliably punished (Dr Quill: "no urgency").

## 7. Pong + bar + instructions rule
- Pong: paddle-hit clink (`vialClink`), point flash (cool white you / red them), win chord / defeat thud. (Its AI was already sound.)
- Bar game: already the best-sounded; only instruction cleanup.
- **Popup-only instructions everywhere:** fight table, pong + cow crib lines, waltz idle hint, cow canvas-title instructions, bar in-game pour line + carry key-reminder all removed; goal info moved INTO popups ("You have three lives…" cow; keys line fight). Micro-prompts ("Hold to piss/retch/eat", "Press and hold.") kept — they are the bare minimum.

## 8. Prose rules (MEMORY: `feedback_no_truncation_no_emdash.md`)
All four minigame popups rewritten: **no em dashes** (colons after bold labels, commas, "and") and **no truncated sentences** ("You have three lives.", never "Three lives." — "It smacks of AI"). Applies to all future AI copy; his prose untouchable.

## 9. Verified / closed
- Waltz middle-score routing is FINE (hidden `waltz-onward` neutral link exists) — the last open audit question, closed.
- All builds verified in preview after each change; console clean throughout. Passage count 141 (140 + Dawn Lily Sprig).

## Outstanding (none blocking)
1. **Dawn spectrum** (endings branch on haunts/time/beaten — needs Dr Quill's prose; skeleton offer stands).
2. **Waltz** sharpening — parked, "least important".
3. Cow idle spawn-bias — his call.
4. Music to compose: painting minigame (*Sketch the Painter*), tarot (*Shana Reads*). Audio ears-checks (Dido 0.40, Lackland seam, carthage-melody, waltz stat feel).
5. Pre-commercial: gate the debug menu (backtick listener + DBG Complete/Matchbook); Soho field recordings (`FIELD-RECORDING-CAPTURE-LIST.md`).
6. `v2-expansion` branch: "new prose drafts" (2026-05-14) sit unmerged — ask whether superseded (memory `project_branch_status.md`).

## Carried over (unchanged reference)
- **Endgame chain:** hub `_towerReady` (or `_dawnHere`) → The Fetch → Approach Centre Point → Alba Complete/Incomplete → Dawn Approach White/Black → White/Black page → Dawn.
- **Stats:** mood system, no death; endings don't read them; asymptotic `$statGain/$statLoss` (StoryInit ~line 126).
- **Ambient beds:** `registerAmbientBed` tag-driven, continuous; procedural `_ambient` slot separate.
- **Tester link:** https://www.samquill.com/Dream-Street-Shuffle-Game/Dream%20Street%20Shuffle.html (hard-refresh on first load).
