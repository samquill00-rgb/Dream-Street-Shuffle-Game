# Dream Street Shuffle — Handoff Note
**Date:** 19 April 2026
**Files:** `Dream Street Shuffle.twee` (source of truth) + `Dream Street Shuffle.html` (built output)
**Build command:** `python3 sync_html.py` — run after every `.twee` edit

---

## What was done this session

### 1. First-haunt "HAUNT COLLECTED" visibility bug
**Problem:** On the first haunt collected (e.g. the Debt), the ceremonial COLLECTED box never appeared — only the explainer lore-box.

**Cause:** The haunt-box has a 2s fade-in with a 0.3s delay; the lore-box appears instantly. The explainer stole focus and the player could click away before the COLLECTED box finished revealing.

**Fix:** Reordered all 10 haunt-collection passages so the `<div class="haunt-box">` (COLLECTED) now appears **before** the `<div class="lore-box">` (EXPLAINER) in source. Locations: lines 23838, 24325, 24393, 24627, 24808, 25078, 25169, 25229, 26895, 27317.

Pattern used:
```
(if: not ($haunts contains $hauntN))[
(set: $haunts to $haunts + (a: $hauntN))
<div class="haunt-box">COLLECTED...</div>
(if: $hauntExplained is false)[(set: $hauntExplained to true)
<div class="lore-box">EXPLAINER...</div>]]
```

### 2. Three-type, three-state pip system (prototype on Pillars)
Dr Quill wanted pips to signal venues that *lead to* collectables, not just contain them.

**Three types + colours:**
- Haunts — amber `◇/◆` (class `.hp`)
- Objects — copper-red `○/●` (class `.op`)
- Passwords — slate-blue `△/▲` (class `.pp`)

**Three states per type:**
- `-pending` (~22% opacity) — path exists but not yet discovered (greyed ghost)
- default outline (55% opacity) — discovered, not yet collected
- `-done` (95% + glow) — collected

CSS lives in `:: UserStylesheet` under `/* ===== PIPS (Dean Street venue links) ===== */` (around line 27763).

**Prototype applied on Dean Street Pillars link (line 24083–24085):**
- Before meeting critic: grey `△` (copperWord) + grey `◇` (haunt6)
- After meeting critic: filled `▲` + outline `◇` (knowsCecilCourt unlocks haunt6)
- After collecting Delivery: filled `▲` + filled `◆`

Dr Quill has eyeballed this and OK'd the visual grammar — extension to other venues is pending.

### 3. Notebook FINDS panel now uses the same pip system
Replaced the mixed glyphs (⬖ haunt, ⚿ password, ◈ object, ○ grey) across the notebook with the same pip classes so the player has a unified legend. Happens in `:: NOTEBOOK passage` around line 27705–27718.

### 4. All 8 haunts now listed in notebook
Previously only haunt1, 3, 4, 7, 8 appeared. Added haunt2 (Refusal), haunt5 (Game), haunt6 (Delivery) in numerical order.

### 5. Spacing bugs from earlier `replace_all` — fixed
Earlier notebook replace_alls dropped trailing spaces, producing "TheSketch", "forCopper", "Amatchbook" etc. Fixed across all three notebook sections.

---

## Matchbook provenance (for reference)
Dr Quill recalled "Clogg or after the fight" — actually the matchbook comes from the **cellar scene with Copper** (three sources: John St. John line 23696, Ashton Granger line 23948, or Copper himself line 24249) OR **from beating Jack Curtis at pool** (lines 24797, 25067). Clogg gives the **beermat** (Cecil Court path), not the matchbook.

---

## Pending / open work

### Extend pip system to remaining Dean Street venues
The Pillars is done. Each of the others still uses the old 2-state haunt-only pips. Needs same three-state, three-type treatment:

- **The French** (line 24080) — currently 3 haunt pips. Could add `△` pending for any password reachable via French. Probably doesn't need objects.
- **Colony** (line 24086) — currently only haunt5 pip. Needs: haunt3 pip (Beast via coach), `●` beermat pip (Clogg gives this), possibly haunt6 `◇` pending since beermat is another Cecil Court route.
- **Ronnie's** (line 24088) — just haunt7. May be complete.
- **Cecil Court** variants (lines 24096–24099) — currently just haunt6. Could add `●` liver object pip.
- **Trisha's** (line 24102) — just haunt8. Matchbook is the gate-key so it doesn't need a pip there, but consider it.
- **Lackland's** (line 24093) — no pips at present. Needs `▲` password pip (knowsCopperSecret → Valletta) and possibly a haunt pip if one waits there.

### Consider a map legend somewhere
If the pip system feels opaque on first encounter, a small legend could go inside the notebook's FINDS header or as a hover-reveal hint.

### Notebook HAUNTS section observation
Now lists all 8, but worth checking once more that each haunt-state reads correctly across the full span of a playthrough.

### Recompile reminder
Always: `python3 sync_html.py` from the game files directory after editing `.twee`. The HTML is the built artifact; edits there will be lost.

---

## Dr Quill's working preferences
- Token-efficient edits (partial reads, batched calls, replace_all where safe)
- Never commit — he handles git himself
- Don't alter written creative text (the prose inside passages is his; structural/code edits only)
- Coding-beginner level explanations welcome
