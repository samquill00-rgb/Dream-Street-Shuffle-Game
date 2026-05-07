# HANDOFF — 2026-05-07 (evening session)

A focused polish session on the Carthage shore / Dido cluster, plus a small structural extension of the icon system to lateral venue shortcuts and a literary survey of the prose narrative as a whole.

---

## Carthage shore / Dido — design + prose pass

### "Sub umbras: watch her burn"

The `[[Remain in Carthage|Stay in Carthage]]` link on the Dido passage was reading as a *losing* click — every textual cue around it (Dido's seductive "Stay... Lily is in her valley and will not return", the alternative line "Not yet. The game's not played to death.") pushed the player AWAY from a click that mechanically led to one of the most generous beats in the game (The Interval: +12 confidence, +10 sobriety, the only path to `$sawMemory1`, alba3 if haunts ≥ 11).

Dr Quill workshopped the rewrite to **`Sub umbras: watch her burn`** — direct echo of Dido's just-read dying words from the LORE expand ("Sic sic inuat ire sub umbras"), the colon doing structural work like an epitaph. Active descent, not capitulation.

Also cut the **"Not yet. The game's not played to death."** narrator line that was actively cheerleading the alternatives. The (else:) block now wraps the Go-back / Wake-from-dream links bare. ([Dream Street Shuffle.twee:27995](Dream Street Shuffle.twee:27995), [Dream Street Shuffle.twee:27999](Dream Street Shuffle.twee:27999))

### Carthage shore prose tightening

- **"Roman Carthage" → "Carthage"** ([line 31470](Dream Street Shuffle.twee:31470)) — the explicit period-label fought against Dido's eternal pyre. The "swamped with Romans" line still does the period-signal work without flat-historical labelling.
- **"He wept for Rome." inserted** before "You think about that still, sometimes, in England." ([line 31487](Dream Street Shuffle.twee:31487)) — repairs the Troy → Rome → England chain. Without this, Scipio's Homer quote was about Troy/Ilium and the protagonist's "in England" gloss skipped the Roman step. Three words and the whole imperial-decline chain snaps into place.
- **"a woman" → "a queen"** in "On the hill a queen burns upon a pyre." ([line 31491](Dream Street Shuffle.twee:31491))
- **"You see two paths:" → "There are two paths:"** ([line 31489](Dream Street Shuffle.twee:31489))
- **Lore-box Flaubert line**: "or the house which we pretend that Flaubert knew" → "or the house that we pretend was his" ([line 31484](Dream Street Shuffle.twee:31484)) — removes the awkward Flaubert/Flaubert echo.

---

## Inter-venue icon shortcuts (new addition)

The hub-icon vocabulary (✦/✧ alba, ◆/◇ haunt, ▲/△ pillar, ●/○ opus) was previously confined to Dean Street. Extended to lateral shortcuts where the player picks between *different venues* without going home first.

Survey concluded the DSS graph is genuinely hub-and-spoke — these are the **only three** meaningful lateral shortcuts:

- **Carthage shore → "Go to The Green Sea"** ([line 31496](Dream Street Shuffle.twee:31496)) — carries ✦/✧ for `$alba2`. The (else:) fallback also gets ✧ when the link is gated out.
- **The French (post-haunts) → "The Colony Room is just round the corner."** ([line 30791](Dream Street Shuffle.twee:30791)) — carries ◆/◇ × 2 for `$knowsLackland` and `$knowsRonnies`.
- **Trisha's → "Ronnie Scott's is nearby."** ([line 31841](Dream Street Shuffle.twee:31841)) — carries ◆/◇ for `$haunts contains $haunt7`.

All gated on `$hauntExplained` so pending jewels only appear once the player has caught their first haunt (consistent with Dean Street).

### Greyed-out styling for the Green Sea fallback

When the Green Sea link is gated out (`$haunts < 3` and no coin), the fallback now uses Dean Street's pattern: **`The Green Sea [YOU MUST NOT, YET, GO ANY DEEPER INLAND]`** wrapped in `.greyed-out`, with ✧ trailing once `$hauntExplained` is true. Mirrors the `[DONE FOR TONIGHT]` / `[LOOK ELSEWHERE FIRST]` vocabulary while preserving the dream-prose phrase.

### Layout fixes on Carthage shore

- Blank line inserted before `Wake from this dream` so it reads as a separate option, not a third path
- `\` line continuation after `[[Approach the pyre|Dido]]` to tighten the gap between Approach and the Green Sea conditional

### Ruled out as candidates (for the record)

Cellar internals (Beaten / Standing / St. John's Word / Fight Defeat / Fight Victory / The dark pass) — pure linear funnel, single onward link per state. Cecil Court / Watkins / O'Flatterly's shop — linear chain. Approach passages (all of them) — single-link container-div transits. The Fetch — has two links but they're meta decisions (end / continue), not venue choices. Entering The Pillars — single onward link. Colony drink, Ronnie Scott's, Lackland's Office — internal branches and back-to-hub only, no lateral.

---

## Memory

New feedback memory: **`feedback_preserve_choices.md`** — when Dr Quill chose explicitly to keep the seemingly-redundant "Wake from this dream" safety valve on Carthage shore, he articulated *"too much of this [game] has now [had] choices taken away — I want to leave them and build them where I can."* Future passes should default to keeping/building player choices, not streamlining them. Indexed in MEMORY.md.

---

## Literary critique — open suggestions (not implemented)

Dr Quill asked for a survey of the prose narrative as a whole. Long version is in the conversation; the open-thread items worth considering for future sessions:

- **The critic's-judgement aftermath deflects too quickly.** "Not for me. Have you tried America?" is a brutal joke; the password ("I said hello") absorbs it before the rejection has time to land. Worth one sentence holding the moment before the puzzle-text takes over.
- **Alba Incomplete ending is under-built relative to the Dawn.** The Dawn ending earns its weight by staging *renunciation* (the forgotten lily-of-the-valley name, the embrace of Aoife and the daughter). The Incomplete ending currently just states non-arrival ("You did not find the poem. The dawn will come regardless.") — could stage a knowing-failure rather than absence.
- **The Spanish Artist deserves more.** Benito de los Juncales del Oeste's line — *"You're selling something. It is making unhappy. You cannot force someone to see what you have made. You might make it; they might find it."* — is the thesis of the whole work in disguise, but currently passes quickly into the napkin-sketch interactive.
- **Dense allusions.** The work is in the lineage of David Jones, late Yeats, Geoffrey Hill, Eliot's *Four Quartets*. The literary load is mostly carried gracefully, but the Carthage shore LORE expands and a couple of the Polybius/Scipio beats lean on classical literacy. One or two small framing phrases could let the unread player ride the emotional shape without losing face — only if Dr Quill wants the wider audience.

He may or may not want any of these touched; surfacing them here so the next session can pick them up if asked.

---

## Files of note

- `Dream Street Shuffle.twee` — 146 passages, all session changes synced
- `Dream Street Shuffle.html` — compiled output (do not read; sync via `python3 sync_html.py`)
- `~/.claude/projects/.../memory/feedback_preserve_choices.md` — new feedback memory
- `~/.claude/projects/.../memory/MEMORY.md` — index updated

---

## Possible next threads

- **Critic's-judgement holding-beat** — one sentence between "Have you tried America?" and the password-deflection.
- **Alba Incomplete ending re-build** — give the loss-state its own renunciation-shape rather than just absence.
- **Spanish Artist expansion** — let Benito's permission-to-write line carry more weight before the napkin sketch.
- **Cow ride mid-tier playtest** (rolled over from previous handoff — adjacent-row protection still wants verification).
- **Heartbeat on dual ring's Lily side** (rolled over — confirm audibility).
- **Items 6 & 7 from earlier "fun additions"** (rolled over — Lackland's record-skipping and the photo at the bar).
- **General Dr Quill audit pass** (rolled over — clean walkthrough to shake out anything missed).
