# HANDOFF — 2026-05-25 (playtest-feedback session)

Long session working through Dr Quill's playthrough notes after a real playtest. ~25 items landed across notebook polish, end-game spectacle, audio cues, popups, drink mechanics, and Art Nouveau styling on the Dawn page. Draft is in shippable shape; one verification gap noted below (final centre-pent fix).

---

## Items completed this session

### Notebook + lily page

1. **Removed "MEMORIES" section from the lily page of the notebook.** Was showing a section "Memories ◆ A certain memory" that he called "trash." Block at .twee:37875 deleted.
2. **`.verse` restyled to bronze and thin** so verses (in passages) no longer look like links. Was Crimson Text 600 / `#e6c894` with warm-glow text-shadow; now weight 300 / `#a67839` / no glow / wider letter-spacing. [.twee:40449]
3. **"Linger" + back-door split for Lackland's office.** Was one combined passage; now Linger appears when `$knowsCopperSecret` is true and routes to new **Martin Lackland's Back Door** passage which holds the door prose + password prompt. `$awaitingLacklandPwd` set on the back-door passage so the notebook deploy button still works. [.twee:34471, 34480]

### Audio

4. **Bright chord SFX while moving the bird in the liver-eating popup.** New `dssAudio.brightChord()` plucks one note from a Cmaj9 cluster (1046–2637 Hz) with octave shimmer + triangle tine. LiverPopup's `handleMove` throttles by 170 ms + 10 px movement so successive picks accumulate into an evolving chord. [.twee:2718, 2904, ~10110]
5. **Green Sea music continuous across the dream-Carthage bar arc.** `green-sea` ambient bed was registered but no passage carried the tag, so it never fired. Tagged **Green Sea Approach**, **LINE 2**, **LINE 2 Oxford** with `green-sea` — Nabeul cafe field-recording now plays across approach + bar + memory cut-away. [.twee:34248, 34252, 34272]
6. **Cecil Court ding-dong bell on return with the page.** The auto-handler at .twee:8635 depends on `window.Harlowe.API_ACCESS` resolving correctly; in some builds it fails silently and skips the `has-page` phase ring. Added an explicit `<script>` inside the `(if: $hasMissingPage is true)` block on **O'Flatterly introduction**, gated by the same `_heardOflatterlyBellPhases['has-page']` key so it can't double-ring. [.twee:34629]

### Popups + modals

7. **Word to the Wise antiquarian modal** — new `window.showWordToTheWise({title, body})` function. Gold filigree border, italic uppercase title, dismiss via ✕ / Esc / Enter / click-outside. Fires 1.4 s after the matchbook is acquired in **PP Defeat** and **PP Victory**, body: *You've found matches. Remember there are cigarettes if you need to smoke (Notebook ↑)*. Arrow naturally points up at the NOTEBOOK button. [.twee:3573, 43212]
8. **Liver popup returns to where the player opened the notebook.** Was hardcoded to Dean Street. New `$liverReturnTo` state var, initialised to "Dean Street" at both init points; the notebook "Eat it" link now captures `(passage:)'s name` before navigating; `Eat Shelleys Liver` uses `(link-goto: "·", $liverReturnTo)` for the JS-clicked return link. Mirrors the existing `$cigReturnTo` pattern. [.twee:110, 36430, 38019, 32461]

### Drink mechanic

9. **Drink popups now grant a small morale gain** alongside the sobriety hit. All seven modal-popup drink links (Colony 3, French 3, Empty Glass 1) gained `(set: $confidence to ($statGain: $confidence, 5))`. Net per drink: −8 sobriety, +5 confidence — Dutch courage. [.twee:33617–33619, 37795–37797, 34311]

### Copper's lair + The French

10. **Copper's lair knock prompt simplified** — was "You stand at the door. Three knocks should do it." Now just "Knock three times." [.twee:34334]
11. **Removed quotes around** *"You can leave now, perhaps it's wise to get out…"* — was wrapped in single-quote speech marks; now bare prose. [.twee:33567]
12. **Removed duplicate "He's a novelist now" line** from **Approach the novelist** — was rendering twice (once in The French hub, once on Approach). Now only in the hub. [.twee:32426]

### Interval passage

13. **Only "Turn and follow her" link at the bottom** of The Interval. The previous `[[Dean Street]]` link at the bottom is gone; navigation now happens via a subtle "Down again." link **inside** the (link: "Turn and follow her") reveal — appears after the player clicks, styled with the existing `alba-link-fade` class. Mirrors "She goes upstairs. You go down." from earlier in the passage. [.twee:36646]

### LINE 2 Oxford (Marvell)

14. **First "green" pale pink, second "green" baby blue** in the Marvell couplet on the LINE 2 Oxford memory passage. Was both `#9ed68a` (same green). Now `#f4b8c4` then `#a8cde0`. [.twee:34391]
15. **"Tir'd with all these" verse left-aligned.** Was centred (lily-glimpse default). New `.lily-glimpse-verse` class on the inner `<em>`: `display:block; text-align:left; max-width:24em; margin:0.4em auto` so the block centres but verse text is left-aligned (verse convention). [.twee:37566, 42637]

### Night Ahead micro-edits

16. **Removed comma after "tonight"** — *"And so tonight, you've gone back to Soho…"* → *"And so tonight you've gone back to Soho…"*. [.twee:36667]

### Dawn page — Art Nouveau pass

17. **Colophon: "Three Blue Posts" → "By Three Blue Posts"**, plus a max-width-fit-content + nowrap so it doesn't wrap to two lines. [.twee:33675, 45193]
18. **Mucha-style flanking fleurons on the colophon** — whiplash curl + tiny lily-of-the-valley bell, mirrored on each side via `::before/::after` with SVG data URIs. [.twee:45204]
19. **Music credit line beneath the colophon** — *Closing music by Sam Quill and Patrick Davidson Roberts, arr. and piano by Eoin Roe.* New `.dawn-credits` class, quieter Playfair italic at 0.74em, fades in 8.6 s after page load (0.6 s after colophon). [.twee:33676, 45209]
20. **Four Art Nouveau corner ornaments on the ending-pane** — whiplash curve + hanging lily-of-the-valley sprig (3 bells) + tendril spiral + leaf accent at each corner. One inline SVG mirrored via CSS transforms for the other three. Fades in 0.8 s after page load over 3.4 s. [.twee:33653, 45093]
21. **Enhanced "Dawn Rule SVG bottom"** — was a thin twin-line + 5 bells; now a 70-tall filigree band with paired whiplash curves trailing left/right, tendril spirals at the terminals, 7-bell lily cluster with stems, leaves at the inflection points, bead terminals. [.twee:45605]

### End-game spectacle — Tree-of-Life lightning

22. **Tree-of-life lightning auto-fires through the pentagram at Centre Point (Dawn Approach White/Black).** Was previously notebook-only (TREE tab → "Reveal on the map" button), which the player has no reason to open at endgame. The lightning paths (9 sefirotic connecting bolts + 10 station sparks) now render into the same SVG as the pentagram on Dawn Approach when `_treeAllVisited` is true. Starts ~2.4 s after the pentagram fades in; ~3 s descent; bolts settle at 10 % opacity as a residue on the star. Uses warm electric white (`#fff5d0`) to match the gold pentagram. Sets `$treeFlashed = true` via the Harlowe API after the animation completes, so subsequent reveals don't re-queue. [.twee:32607, 32614, 45554, 45605]
23. **Pulsing TREE-tab cue in the notebook** when `_treeAllVisited` is true and `$treeFlashed` is false. Slow gold breathe (2.6 s cycle), same family as `.back-to-night-glow` on the Fetch link. Acts as fallback for the notebook-based reveal mechanic, since the primary reveal now fires at Dawn Approach. Build Notebook no longer pre-flips `$treeFlashed` — the queue persists across notebook opens until the lightning actually fires. [.twee:37925, 40998, 4216]

### Centre Point pentagram bug — recurring

24. **Pentagram + endless-knot caption escaping into the corner** (the "weird thing to the side"). Two-part fix:
    - **First fix (worked initially):** added `.dawn-approach > tw-hook { display: block; position: static; }` so the inline tw-hook from `(if: $lilyCount >= 5)` doesn't become a 0×0 containing block for the absolute-positioned overlay. [.twee:45528]
    - **Bug returned after I added the tree-lightning code.** Diagnosis: Harlowe's HTML parser pushes block-level `<div>`s out of inline tw-hooks — and it does this not just to `.centre-pent-overlay` but to `.centre-pent-gawain` nested inside it. The gawain ends up as a *sibling* of the overlay, not a child, so the overlay's flexbox can't position it.
    - **Defensive fix:** `.centre-pent-overlay` is now `position: fixed; inset: 0; z-index: 9999` (so it positions to viewport directly, ignoring wrapper). `.centre-pent-gawain` is now self-positioning — `position: fixed; bottom: 8vh; left: 50%; transform: translateX(-50%); z-index: 9999` with its own fade-in animation matching the pentagram's. **⚠ Not verified in the actual game flow** — I tried but couldn't get the chrome-MCP navigation to land on Dawn Approach Black with state set. If the gawain still floats, this fix is wrong and worth deeper investigation. [.twee:45528, 45576]

---

## Patterns to remember (from this session)

- **Harlowe's HTML parser fragments nested block-level `<div>`s.** When `(if:)` wraps a string that includes nested `<div class="A"><div class="B">…</div></div>`, the parser pushes BOTH the outer and the inner div out of the inline tw-hook as siblings, not nested. Any layout that depends on the inner div being a flex/grid child of the outer one will break. Defensive options: make both elements self-positioning via `position: fixed` / `position: absolute` against the viewport, OR put nested content inside an `<svg>` (atomic — not fragmented). The memory note `[project_harlowe_class_attr.md]` and `[project_harlowe_tw_hook_positioning.md]` both touch this; this session adds **nested-div fragmentation** as a third manifestation.
- **`window.Harlowe` is undefined for injected scripts** (e.g. `document.createElement('script')` or chrome-MCP `javascript_tool`). It's accessible from the original Twine user-script's closure scope (which is how the debug menu buttons work). For runtime tweaks that need Harlowe state, the path is either: trigger via existing debug-menu button click handlers, or use the existing `(set: X to (passage:)'s name)` capture-and-go pattern inside Harlowe code itself.
- **Modal popups returning to "where the player was"** — `$cigReturnTo` (existing) and now `$liverReturnTo` (added this session). Pattern: init the var to a safe fallback (Dean Street), capture `(passage:)'s name` in the trigger link, use `(go-to: $var)` or `(link-goto: "·", $var)` in the return path.
- **Notebook tab "ready" cues** — gold pulse via `.nb-tab-ready` class set conditionally in Build Notebook. Lives at .twee:40998. Add to a tab whenever the player has unlocked something inside it but hasn't seen it yet.
- **`window.showWordToTheWise({title, body})`** — small antiquarian modal for one-line nudges when a new mechanic comes online. Body accepts HTML; arrow span `<span class="word-wise-arrow-icon">↑</span>` is the bobbing gold pointer.

## State of the live code

133 passages. .twee → .html sync clean. The Dawn page has noticeably more Art Nouveau presence (corners + colophon fleurons + richer bottom rule). The end-game tree-of-life reveal is no longer hidden behind a notebook button.

**⚠ One verification gap:** the centre-pent + gawain corner-collapse fix (item 24) is based on a confident diagnosis but I never confirmed it visually in the actual game flow. If Dr Quill plays through and the text is still floating in the corner, the fix is wrong and the gawain needs a different escape route — probably embedding it inside the SVG as `<foreignObject>` so the HTML parser doesn't fragment it.

---

## Carried over from prior HANDOFFs (still relevant)

- **`tw-link` vs `tw-expression`** — Harlowe renders bracket links as `<tw-link>`, `(link:)` macros as `<tw-expression>`. Any JS/CSS that touches one should consider the other.
- **`dssSpawnMotes`** accepts `{noScroll:true}` opts to skip `scrollIntoView`.
- **Astral re-centring pass** at .twee:9144 forces the bounding-box midpoint to (500,500).
- **Cigarettes mechanic** — body-level visual driven by stat-delta check in header.
- **Carthage 3D-shore melody layer** — `carthage-shore` ambient bed, working.
- **`Failure: Trisha's`** is NOT orphan — referenced by JS. Don't prune.

## Open / parked

- **Three Pillars (Mercy/Severity/Mildness)** — banked.
- **Astral-map screenshots** — banked.
- **Cigarette popup function** (`window.showCigarettePopup`) — dead code, debug paths only.
- **Title-screen BEGIN** — kept as is.
- **Centre-pent gawain corner-floating** — needs in-game verification next session.

---

**Next session:** verify the centre-pent fix in the actual game flow (jump to Dawn Approach Black with all conditions met); take playtester feedback as it comes in.
