# HANDOFF — 2026-05-23

A long playtest-driven session. The big throughline: **stat changes weren't visible to the player**, even when they were firing correctly under the hood. Root cause was almost always the same shape — `(set:)` macros were running in passage *bodies*, which means Harlowe's `header header` had already rendered the stat bar with the old value before the body could update it. The drop or boost only appeared on the *next* passage transition, by which time the popup had been dismissed and the connection was lost.

The fix pattern: apply `(set: $stat to ($statLoss/Gain: $stat, N))` at the link *click* that brings the player to the passage, rather than in the passage body. Then the destination passage's header runs with the new value vs the old `$prev`, and the bar flashes a delta in plain sight.

Also: the `window.Harlowe.API_ACCESS.STATE.variables` pattern used by several notebook buttons has been silently broken since the asymptotic-stat refactor — confirmed in the browser that this Harlowe build doesn't expose `window.Harlowe` at all. Same with `window.Engine`. So any JS-side `s.confidence = ...` writes were no-ops.

---

## Drink visibility (the "drinks not lowering sobriety" report)

Every player-initiated drink moment now applies `$statLoss` at the link click:

- **French drinks** (Beaujolais / Claret / Cidre): converted from `[[..|French drink]]` intermediate to direct `(link:)[(set: ...)(go-to: "The French")]`. The "French drink" passage is now dead transit code; The French body fires the drink popup via `$justDranked`.
- **Colony drinks** (Vodka / Champagne / Beer): statLoss moved to the link click; removed from Colony drink passage body. Popup script in Colony drink body still works (passage bodies execute scripts reliably).
- **Empty Glass** (whisky with John St John): `[[Drink with him|The Empty Glass]]` → `(link: "Drink with him")[(set: $sobriety to ($statLoss: $sobriety, 8))(go-to: "The Empty Glass")]`. Removed statLoss from Empty Glass body.
- **Davy Merkin** (×3 entry points: "Sit with him", "Get a drink with the man at the bar", "Drink with Davy Merkin"): all three converted to `(link:)` form with `$sobriety -9` at click. Removed statLoss from Davy Merkin body.

Asymptotic values unchanged (8 for ordinary drinks, 9 for the heavier whisky moments). The fix was purely about where in the navigation the stat lands.

---

## Chippy "Eat" — popup-firing routed through Dean Street body

The chippy Eat link had `<script>setTimeout(...)</script>` *inside* the `(link:)` hook. Verified in the browser that `<script>` tags inserted via `innerHTML` (which is how Harlowe inserts hook content) do **not** execute. The stats *did* change (Harlowe macros are native), but the popup never fired, so the player perceived "no boost".

Fix:
- `(link: "Eat.")` now sets `$justAteChippy to true` in addition to the stats.
- Dean Street body has a new `(if: $justAteChippy is true)[(set: $justAteChippy to false)<script>setTimeout(function(){window.showEatPopup('chips');},250);</script>]` block.
- `$justAteChippy` initialised in StoryInit and Start.

Same pattern applied to French drinks — popup now fires from The French body via the existing `$justDranked` flag rather than from inside the `(link:)` hook.

---

## Liver "Eat it" notebook button

Was completely broken. The HTML button's onclick relied on `window.Harlowe.API_ACCESS.STATE.variables`, which doesn't exist in this Harlowe 3.3.9 build (confirmed via `preview_eval` — both `Harlowe` and `Engine` are undefined on `window`). So the click animated the eagle popup, but the actual stat changes (`+22 / +40`) silently no-opped.

Fix: replaced the HTML button with a Harlowe `(link:)` embedded directly in the notebook `_nb` string:
```harlowe
<div class="nb-inv-btn nb-inv-eat">(link: "Eat it")[(go-to: "Eat Shelleys Liver")]</div>
```

The `Eat Shelleys Liver` passage already had the correct setup: `(set: $hasLiver to false)`, `($statGain: $confidence, 22)`, `($statGain: $sobriety, 40)`, popup, then auto-navigate to Dean Street where the delta lands.

**Still broken in the same way (not fixed this session):** the cigarette-light notebook button (`window.Harlowe.API_ACCESS.STATE.variables.matchesLeft = ...`). Same root cause. Will need the same fix — replace with a Harlowe-driven mechanism that navigates to a "Light a cigarette" passage with proper `(set:)` macros.

---

## Phone-call morale bump bug

Player reported: "morale increases when the Aoife first phone call comes in — it should drop."

Traced to: Pillars first-visit applies `+12 confidence` in its body. Player clicks "Accept the call" → "The phone call" header runs with `$conf=77` (post-Pillars boost) vs `$prev=70` (pre-Pillars). Bar flashes **+7**. The phone-call's own `-9` statLoss fires *after* the header, so it only registers on the next navigation (back to Pillars).

Fix: moved the call-entry statLoss to the "Accept the call" click for all three phone-call destinations:
- **Aoife** (`The phone call`): −9 confidence
- **Lily phone call 1**: −6 confidence (×5 entry points across Pillars / French / Colony / Ronnies / Coach)
- **The dual ring**: −7 confidence (×5 entry points)

Removed the duplicate statLoss from each passage body.

---

## Routing fixes

- **LINE 2 Oxford → Dean Street directly**: was going through `The Interval`, which had a one-shot guard added in the previous session. After Carthage played the Interval, the Green Sea wake routed to Dean Street via the guard but skipped the lily-window scene. Dr Quill confirmed: keep the Interval one-shot (Carthage only); Green Sea wakes straight to Dean Street.
- **Carthage shore link list collapses post-pyre**: was offering "Back to the pyre" + "Go to The Green Sea" + "Wake from this dream" once `$visitedPyre`. Now once the pyre is visited, only "Go to The Green Sea" (guided) + "Wake from this dream" remain; "Approach the pyre" only shows on the first visit. Per Dr Quill: Green Sea is reached *via* Carthage shore, only after the pyre.
- **Dean Street boxed "Back to The Pillars" gone**: for the `$metCritic && !$tookLily2` case, the choice-box `[[Back to The Pillars|Approach The Pillars]]` was reappearing — Dr Quill had it removed in a prior session. Restored that: just the icons (▲, ❁, etc.) show now, no link.

---

## Great Ham reading animation — 2× speed

All seven timing knobs in the critic's `doTurn` IIFE halved:

| Knob | Was | Now |
|---|---|---|
| Page flip CSS transition | 0.6s | 0.3s |
| Left-page text fade delay | 220ms | 110ms |
| Narration appear | 750ms | 375ms |
| Aftermath reveal delay | 700ms | 350ms |
| Motes spawn delay | 1100ms | 550ms |
| Next-turn delay | 2400ms | 1200ms |
| Initial settle | 1700ms | 850ms |

The whole scene runs at roughly half the previous pace. No structural changes to the auto-advance flow (still no clickable "He turns the page" button — that was already removed).

---

## Venue flower-only state — new

Player request: "if you've been there and got everything except the flower, the text is greyed out except the flower" — applied to all five venues.

Mechanism:
- Each venue passage emits `<span class="dss-flower-only-marker"></span>` inside its scene wrapper when the player has completed everything at that venue except picking the lily.
- CSS rule on `.chippy-scene:has(.dss-flower-only-marker)` etc. dims the whole scene via `filter: brightness(0.42) grayscale(0.45)`.
- A compensating `filter: brightness(2.4) saturate(1.3) drop-shadow(...)` on `.lily-prompt` and `.lily-taken` brings the lily back to ~full visibility with a soft amber halo so it reads as the obvious thing to click.
- Markers are placed *inside* the `(else:)` branch of each venue's `_lilyRing`/`_dualRing` conditional so they don't fire during phone-call interruptions.

The French passage was missing a scene wrapper — added `<div class="french-scene">...</div>` for consistency with the others.

Conditions per venue:
- **Chippy** (lily1): `$hadChippy is true and $tookLily1 is false`
- **Pillars** (lily2): `$hadPhoneCall is true and $metCritic is true and $tookLily2 is false`
- **Ronnies** (lily3): `$completedSetlist is true and $tookLily3 is false`
- **Colony** (lily4): `$knowsRonnies is true and $knowsCopperSecret is true and $tookLily4 is false`
- **French** (lily5): `($haunts contains $haunt1) and ($haunts contains $haunt2) and $tookLily5 is false`

---

## State of the live code

All today's changes synced to `Dream Street Shuffle.html` (132 passages). `sync_html.py` unchanged.

**Major structural shifts this session:**
1. Stat-change visibility is now consistent — every player-initiated drink/eat/call applies its `$statLoss`/`$statGain` at the click, not in the destination body.
2. Liver button uses Harlowe navigation instead of broken `Harlowe.API_ACCESS` JS pokes.
3. Venues collapse to flower-only visual mode when all that's left is the lily.
4. Carthage shore + Maritime-after-critic flow is tightened — no more dangling redundant links once the pyre/critic chapters are done.

---

## Open threads for the next session

Carried forward from previous handoffs and discovered this session:

- **Cigarette-light notebook button** — same broken-`Harlowe.API_ACCESS` pattern as the liver was. The "Light a cigarette" onclick silently no-ops on stats. Needs the same fix: navigate to a dedicated passage with `(set:)` macros.
- **Dead "French drink" passage** — still in the file but unreferenced now that drinks bypass it. Safe to remove.
- **Verse alignment** — left-aligned across the board; per-verse overrides still possible.
- **Asymptotic curve tuning** — `/50` divisor in `$statGain` / `$statLoss` is the single retuning knob.
- **Lore-seen `Set` is session-only** — page reload starts fresh.
- **Three Pillars (Mercy/Severity/Mildness)** — still banked.
- **Astral-map screenshots banked 2026-05-13** — still uncommitted to a use.
- **`Dream to Dean` and `Failure: Trisha's`** — orphan, deletable.
- **`Eat Shelleys Liver`** — now actually reachable via the fix, but the passage itself is fine.
- **Title screen `BEGIN` styling** — still bare text.
- **Page 93 SVG** — flagged for possible naturalistic edge irregularity.

---

## Things considered and intentionally NOT done

- **Cigarette button fix** — flagged but not implemented this session; the user only flagged liver explicitly.
- **Deleting `French drink` passage** — left as dead code; safer than risk if anything still links to it.
- **Restructuring venue passages further** — the flower-only marker pattern works without restructuring; only The French needed a wrapper added.
- **Touching the asymptotic divisor** — values feel balanced now per Dr Quill's earlier feedback.

---

## Memories — no changes this session

No new memory files written. Patterns to keep in mind:

- **Harlowe doesn't evaluate macros inside class attributes** — already in memory. Confirmed again when designing the flower-only marker pattern; used `:has()` selectors instead of conditional class injection.
- **`window.Harlowe` and `window.Engine` are not exposed** in this Harlowe build (3.3.9). Any code using these silently no-ops. Worth adding to memory if it keeps coming up — see the cigarette button still waiting.
- **`<script>` tags inside `(link:)` hooks are unreliable** — Harlowe inserts hook content via innerHTML, which doesn't execute script tags. Apply state changes via Harlowe `(set:)` and route popup-firing through the destination passage body via a flag (`$justDranked`, `$justAteChippy` pattern).
