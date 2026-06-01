# Audit 1 — Narrative Integrity & Soft-Locks

**Scope:** Static, read-only reachability audit of `Dream Street Shuffle.twee` (source of truth). Cross-checked against `GAME-MAP.md` and verified suspicious cases by reading source. No game files were edited.

## Executive summary

The game has **138 declared passages** (122 story, the rest system/asset/debug). Navigation is sound overall: **every static `[[...]]` and `(go-to:)`/`(link-goto:)` target resolves to a real passage — there are zero broken link targets.** The hub (`Dean Street`) funnel logic, the `$coachUrgent` "forced soft-landing" path, the password gates, the dynamic Lily-call return, and all timed `(after:)` auto-advances were traced and are internally consistent.

The single most important structural fact: **the Harlowe sidebar (with its built-in Undo) is globally disabled** (`tw-sidebar { display: none !important; }`, UserStylesheet). The game substitutes its own header **"← BACK"** (`(link-undo:)`) plus a **NOTEBOOK** link, rendered by the `header header` passage. The header — and therefore both BACK and NOTEBOOK — is suppressed entirely on a `_hideStats` set of passages, and BACK alone is additionally suppressed on a wider `_backHide` set. This means that on any passage where the header is hidden, the passage's own body **must** contain a way out, or the player is hard-trapped. All such passages were checked and each has its own exit.

Findings by severity: **0 Critical, 0 High, 2 Medium, 4 Low.** No genuine hard soft-locks were found. The Medium items are discoverability traps (a passage that looks like a dead end unless the player notices the notebook/header). The Low items are dead/unreachable content and theoretical edge cases. Several `GAME-MAP.md` "orphan"/"dead-end" flags are **false positives** caused by the map's static analyser not following macro links — these are documented under "Checked and OK."

---

## Dead ends / traps

**[N1] Medium — Martin Lackland's Back Door**
Location: `:: Martin Lackland's Back Door` (twee line ~34949); reached from `Martin Lackland's Office` line 34947 via `(if: $knowsCopperSecret is true)[[[Linger|Martin Lackland's Back Door]]]`.
What's wrong / consequence: The passage body contains **only** a password `<input>` and a *hidden* link `<span id="go-lackland-yes" style="display:none">[[·|Lackland's Back Room]]</span>`, revealed by JS (`window.checkLacklandPwd`) only when the player types "Valletta". There is no visible bracket link out. Because the global sidebar/Undo is disabled, a player who doesn't know the password and doesn't realise the header has a "← BACK" link could feel trapped on a dead-looking screen.
Mitigating facts (verified): this passage is **not** in `_hideStats` or `_backHide`, so the header DOES render both "← BACK" (undo to the Office) and "NOTEBOOK"; and the notebook always shows a **"Deploy"** button for "Valletta" whenever `$knowsCopperSecret` is true (the same flag that gates entry), which auto-fills and submits the password. So there is always a way out. The risk is purely discoverability.
Recommendation: optional — add a visible plain link such as `[[Step back|Martin Lackland's Office]]` beneath the password box so the exit is never invisible. Not required for correctness.
Confidence: **Confirmed by reading source** (passage body, header logic at line 38249–38252, JS at 32317–32329, notebook Deploy at 38343). Discoverability impact is **Suspected — worth a real-play check.**

**[N2] Medium — Endings rely on the header's NOTEBOOK/BACK being absent by design; body-only exits confirmed but fragile**
Location: `header header` passage, `_hideStats` list (line 38209) and `_backHide` list (line 38249).
What's wrong / consequence: On `_hideStats` passages the entire header is suppressed, so the passage body is the *only* source of navigation. This is correct today — each such passage (`The Fetch`, `Approach Centre Point`, `Alba Complete`, `Alba Incomplete`, `Dawn Approach White/Black`, `White page`, `Black page`, `PP Pong`, `Fight starts/Victory/Defeat`, `A Doorway on Dean Street`, `Title`, `Start`, `The Night Ahead`, `Name Your Book`, `Dawn`) either has a body link/auto-`go-to` or is a deliberate terminal ending (`Dawn`). But the invariant is implicit: any *future* passage added to `_hideStats` without a body exit would become an instant hard-trap, with no Undo to recover.
Recommendation: document the invariant ("every `_hideStats` passage must contain its own outgoing navigation or be a true ending") near the list, so it isn't broken later.
Confidence: **Confirmed by reading source.**

---

## Orphans

**[N3] Low — Watch them play (genuine unreachable content)**
Location: `:: Watch them play [venue-lackland-back]` (twee line ~38102 region; tagged `venue-lackland-back`).
What's wrong / consequence: A full-file grep finds **no incoming reference of any kind** — no bracket link, no `(go-to:)`, no `(link-goto:)`, no JS `.click()`/passage reference. Its twin `Watch the decider` is reached from `Lackland's Back Room` and both auto-`go-to "PP Pong"`. So `Watch them play` is redundant, dead, unreachable content. It is not a trap (it has its own auto-`go-to`), just unreachable.
Recommendation: either wire it up (if a "watch first, then play" branch was intended) or delete it as dead code.
Confidence: **Confirmed by reading source** (grep returned zero references).

**[N4] Low — Deco Divider (unused system passage)**
Location: `:: Deco Divider` (twee line ~38? — body is a single `(set: _divHTML to '')`).
What's wrong / consequence: Zero references anywhere (grep). It sets a temp variable and is never `(display:)`-ed or linked. Harmless dead code; flagged by `GAME-MAP.md` as both orphan and dead-end.
Recommendation: delete, or keep as a known no-op. No player impact.
Confidence: **Confirmed by reading source.**

---

## Soft-locks

**[N5] Low — `$coachUrgent` funnel depends on `$metRed` being true (theoretical gap)**
Location: `Dean Street`, lines 34143 (set), 34166–34173 (funnel).
What's wrong / consequence: `$coachUrgent` becomes true only when `$sobriety <= 0 AND $haunts's length >= 10` (line 34143). When true, every ordinary venue link is hidden (all gated `$coachUrgent is false`) and the player is funnelled to a single guided link: "The dawn is coming" (if alba complete) or "The Coach and Horses" → which then offers "Give up. Sleep here." → `Alba Incomplete` (a proper ending). **However**, that funnel block sits inside `(if: $metRed is true)` (opens line 34169). If `$coachUrgent` ever became true while `$metRed` were still false, the funnel link would not render, and the `$coachUrgent is false`-gated venue links would also be hidden — leaving Dean Street with no forward link (recoverable only via the header "← BACK"/NOTEBOOK, since Dean Street is not in `_hideStats`).
Why it's only Low/theoretical: reaching 10+ haunts effectively requires having met Red (Red opens the night), so `$metRed=false` with `$haunts>=10` is not a state the normal flow can produce. Not traced to a concrete reachable state.
Recommendation: as defence-in-depth, render the "Coach and Horses" funnel link outside the `$metRed` gate when `$coachUrgent is true`, so the escape valve never depends on `$metRed`.
Confidence: **Suspected — needs real-play / state-trace check.** The code paths are confirmed; the reachability of the bad state is not.

**[N6] Low — Lily phone call relies on `$lilyCallReturn`; verified always set, noting for completeness**
Location: `Lily phone call 1` line 37887–37888 (`(link-goto: "Hang up.", $lilyCallReturn)` and `(after: 28s)[(go-to: $lilyCallReturn)]`).
What's wrong / consequence: This is the one dynamic-target link in the game (flagged by `GAME-MAP.md`). If `$lilyCallReturn` were ever unset or pointed at a non-passage, the call would dead-end. **Verified safe:** it is initialised to `"Dean Street"` in StoryInit (line 81) and explicitly re-set to a valid passage at every call site (Coach lock 33840, Pillars 34287, Ronnie's 36605, Colony 36869, French 36930), and there is a 28-second auto-`go-to` fallback. No lock.
Recommendation: none. Listed only because it is the sole runtime-resolved target.
Confidence: **Confirmed by reading source.**

---

## Broken / typo'd link targets

**None.** A programmatic comparison of every `[[...]]` target and every `(go-to:)`/`(link-goto:)` string literal against the passage-name list produced **zero unmatched targets**. (The only apparent mismatches — `Hang up.`, `PLUS. ULTRA.`, `Put //`, `bracket`, `link`, `·` — are link *labels*, a runtime-variable target, a concatenated string whose real target `The critic's judgement` exists, or text inside comments. All verified benign.)

---

## Checked and OK (notable verifications)

- **`Failure: Trisha's`** — reached from `Approach Trisha's` via a normal bracket link; not an orphan. (It is also the kind of JS-adjacent name the brief warned about; confirmed it has both incoming and outgoing bracket links.)
- **`None of us likes it!`** — `GAME-MAP.md` flags it a **dead end**; this is a **false positive**. It has an outgoing `(link-goto: ... , "The critic's judgement")` (line 34984). Not a trap.
- **`The critic's judgement`** — `GAME-MAP.md` flags it an **orphan**; **false positive**. It is the target of the macro link-goto from `None of us likes it!`. Reachable; exits to `Dean Street`.
- **`Build Notebook`** — `GAME-MAP.md` flags it an orphan; it is `(display:)`-included by the `header header` NOTEBOOK link on every passage (line 38251), so it is rendered constantly. Not a navigable passage and not a problem.
- **`Colony Member`** — reached via `(go-to: "Colony Member")` from `The Colony Room Door` when `$metSalvu` (line 36897); exits to `Davy Merkin` via a `(link:)…(go-to:)`. Fine.
- **`Smoking`** / **`Eat Shelleys Liver`** — utility passages that `(go-to: $cigReturnTo)` / `(link-goto: …, $liverReturnTo)`; both vars default to `"Dean Street"` (StoryInit 110–111) and are re-set on use. `Eat Shelleys Liver` also has a 25-second JS auto-nav fallback. No lock.
- **`Dawn`** — no outgoing links: confirmed **true terminal ending** (tag `dawn-end`), intended.
- **`White page` / `Black page`** — both link "PLUS. ULTRA." → `Dawn`. Not dead ends.
- **`Martin Lackland's Back Door` exit** — header "← BACK" + notebook "Deploy" both available (see N1); not a hard lock.
- **Give-up / low-confidence valve** — `Dean Street` "Give up on the night" → `No more` → `Black page` appears when `$coachUrgent is false and $confidence <= 5` (line 34219); the alternative `$coachUrgent` valve routes through the Coach to `Alba Incomplete`. Both endings reachable.
- **Title "(CONTINUE WHERE I LEFT OFF)"** — `(loadgame: "auto")`, revealed only when a real auto-save row exists (lines 22–37). Fine.

---

## Top 3 to fix first

1. **[N1] Add a visible "step back" link on `Martin Lackland's Back Door`.** It is the only passage that *looks* like a dead end on the screen (hidden-only exit + no sidebar Undo). One plain `[[…|Martin Lackland's Office]]` removes all ambiguity. (Medium — discoverability.)
2. **[N5] Make the `$coachUrgent` Coach-funnel link independent of `$metRed`.** Cheap defence against the one theoretical hub state that could render no forward link. (Low, but it protects the game's only forced-ending escape valve.)
3. **[N3] Resolve `Watch them play`** — wire it in or delete it. Currently unreachable dead content with a misleading `venue-lackland-back` tag. (Low — housekeeping.)
