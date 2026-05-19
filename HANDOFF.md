# HANDOFF — 2026-05-19

Very long multi-day session. Two major chunks of work: (1) a complete visual overhaul of the **Carthage approach 3D scene** with lighting/shadow system, and (2) a 16-note playthrough fix pass after Dr Quill's playtest. Plus a smaller follow-up batch on the tarot, pyre SVG, and pentagram-at-dawn.

---

## Major: Carthage 3D scene overhaul

The Carthage approach 3D scene (`Coast of Carthage` → 3D render) was visibly behind the other scenes in quality. We rebuilt it iteratively over many passes, screenshot-driven. Final state:

- **Pyre** — upgraded from a single ember pile to a proper stacked-log funeral pyre (three courses of charred logs criss-crossed, glowing top course with embers visible between), a shrouded body silhouette (cylinder + head/foot bumps), bright six-layer flames, rising ember sparks (now properly **animated** — they climb, sway, fade and recycle), tall dark-base smoke column that drifts off-vertical as it climbs. Pyre stays on the **left headland** (Dr Quill's note: scene is looking out to sea, not at a central hill).
- **Palm trees** — completely rebuilt. Old flat-`PlaneGeometry` fronds were reading as antennas-with-ferns at offset camera angles. Replaced with **billboarded sprite fronds** using a custom palm-frond canvas texture (curved spine + many radiating leaflets). Each palm has both upright fronds and drooping outer fronds, plus an occasional fruit cluster. Two close-camera palms also moved back to stop them dominating the right edge.
- **Foliage palette** — shifted from English green to **dusty North-African Mediterranean**: dark sage / mid sage / pale silver-olive / autumn russet. Pale tier is properly **golden** (catching the setting sun), not silver-mint. Per-leaf highlights pushed warm (R+60, G+40, B+10) so sun catches read amber. Olive trees use a dedicated silver-olive cluster; palm fronds use sage-with-amber rShift skew so many leaflets glint gold. Dr Quill iterated this multiple times to land at the right balance.
- **Hill silhouette** — half-sphere with sine-noise displacement turned into proper ridged-shoulder terrain. New `displaceHill` function: multi-octave smooth noise + asymmetric ridge spine (`cos(angle*3)`) + gully cuts (`-|sin|`) + peak boost biased to where the pyre sits. Hill is no longer a smooth dome.
- **Cliffs** — replaced `BoxGeometry` (which read as concrete bricks) with a new **`makeRockCliff`** function: `BoxGeometry(w,h,d,6,10,6)` with vertices displaced via multi-octave noise (bias always positive so the rock only grows lumps, never shrinks), plus dramatic top-jaggedness for crags and sedimentary strata grooves. Cliff material recoloured to warm sandstone so they catch the golden hour. Cliffs pulled forward (z=-7 to -12) so they jut out from the hill silhouette rather than being subsumed.
- **Shoreline rocks** — three new scatters added so the hill-water junction actually reads: 24 medium shoreline rocks with 60% above water, 4 big marker crags right at the hill foot, 8 stray sea boulders offshore, and 7 right-shore rocks. All use `makeRockCliff` with the same displaced-rock look.
- **Hill-foot beach** — bright pale-sand crescent (#e8d098) running along the hill base, raised above the surf so it pops as a clear shore band. Damp-sand strip just lakeward, smaller back-curving section as the hill recedes, and a few sunlit sand highlights.
- **Grass tufts** — rebuilt as **clumps** instead of single sprites. Each `placeGrassClump` adds 3-5 staggered blades with varied sizes / opacities / per-blade lift from ground. Texture has a long soft fade across the bottom 38% (with a 0.5/0.35 mid-stop for gentle dissolve) so blades don't terminate in a hard horizontal line. After several iterations: blade roots staggered in the bottom 28% of the texture, sprites raised so their bottom sits 0.05-0.18 above ground — the fade is now fully visible above the ground plane.
- **Beach / sea naturals** — added wet pebbles (~90 small dodecahedra/icosahedra in three dark tones), driftwood pieces (cylinders with optional forked branches), seaweed/kelp wash patches (low translucent planes), and damp-sand variation patches. Breaks the flat beach/sea edge.
- **Cobble footsteps** between venues — old default was a single bandpass-1300Hz noise burst (sounded like a typewriter click). Rebuilt with a layered impact: bass thud (lowpass 130Hz, body weight), mid stone slap (bandpass 850Hz, less harsh), per-step feedback-delay reverb (75ms / 0.42 feedback) for street echo. Two staggered heel-to-heel steps at 340ms.
- **Cecil Court bell removed from outdoor passages** — the doorShopBell used to fire on entering anything tagged `venue-cecilcourt` (Cecil Court itself, Watkins, the waltz — all outdoor). Now it fires ONLY on entering O'Flatterly's shop (detected by `.shop-bell-marker` injected into that passage).

### Shadow system (Carthage + applied to French / Coach / Colony)

- Sun light is now a proper warm directional (`0xff9a48`, intensity 1.5) with a **2048x2048 shadow map**, frustum sized to cover the whole scene (-40/+40 horizontal, -8/+25 vertical, near 0.5 far 130), bias -0.0008, normalBias 0.04. The sun has a `target` object positioned where the foliage is, so shadows are cast in the right direction.
- Ambient dropped from 0.3 → 0.15. Hemisphere light: sky cool indigo (`0x2c3878`), ground warm ochre (`0x8a5a28`), intensity 0.3. Fill light reduced to 0.12. So shadow side stays clearly in shadow.
- Bounce lights (sea, ground, horizon glow, etc.) kept very subtle so they don't flatten shadows.
- **`enableSceneShadows(scene)`** traversal runs via `setTimeout(...,0)` after all geometry is built. Iterates every Mesh: receiveShadow on everything, castShadow on anything `position.y > 0.2` (skips ground/water planes). Skips heavily transparent materials. Same pattern (`enableFhSceneShadows`, `enableChSceneShadows`, `enableCrSceneShadows`) applied to **French House**, **Coach & Horses** and **Colony Room** approach scenes — moonlight there also boosted (~0.35) so shadows actually read.
- Grass sprites were initially reading as chalky-bright once shadows landed (sprites don't respect directional lighting). Darkened the grass colour (`rgba(65,58,32)`) and lowered opacity to 0.55-0.77 so they match the shadowed environment.
- Foam sprites (cliffFoam, foamPatches, cliffMist) were rendering THROUGH the hill due to `depthWrite:false`. Switched to `depthWrite:true` + `alphaTest`, and moved to z=-8 to -6.5 (clearly in front of the hill body).

### Other Carthage scene fixes

- More birds (12 instead of 6) gliding through the sky.
- Lintel material rebuilt with a dedicated carved-stone texture (cream base, top/bottom moulding bands, vertical rain stains, lichen patches, hairline cracks, edge chips).
- **XCIII inscription** carved into the right end of the right colonnade lintel (Roman numerals for 93 — connects to Inis O'Flatterly's missing page). Drawn onto a small canvas with chiseled darker recess + faint upper-left highlight + re-eroded chips for weathering. Applied as a small decal plane proud of the lintel face.
- Central arch ruin (the brick wall with broken voussoirs) **pulled forward** from z=-4.2 to z=-1.3 so it stands clearly in front of the colonnade as a foreground feature, not intersecting the columns at z=-3.
- ENTER CARTHAGE button restyled to match all the other approach buttons (Ginger Light, French, Coach, etc.) — dark transparent background, amber 13px Courier New text, no pill shape. The Cecil Court and Green Sea buttons were also normalised to the same style.

---

## Major: 16-note playthrough fix pass

After Dr Quill's full playthrough, he sent 16 numbered notes. Worked through methodically:

1. **Painter sketch** — added "Stored in your notebook. Go there to work on it more." note in the OBJECT ACQUIRED box at "Give him the painting". New `.item-note` CSS class added.
2. **Notebook "Work on it" popup** — the napkin popup overlay was rendering at z-index 20000, BEHIND the notebook close button (z-index 100000) and probably the dialog itself. Bumped to **999999** + added `stopPropagation` on click/mousedown/touchstart so the notebook's outside-click-to-close handler can't fire when drawing inside the popup.
3. **Cecil Court button** restyled to match the others.
4. **Salvu's lair** — "BENEATH GREEK STREET, SOHO" → "BENEATH DEAN ST., SOHO".
5. **Password deploy buttons** — new dedicated `.nb-deploy-btn` CSS class (amber-on-dark, uppercase, tight letter-spacing). Removed inline styles from both Copper and Lackland deploy buttons.
6. **Green Sea button** restyled to match the others.
7. **Forced-through-Interval mechanic after Carthage** — Carthage shore and Dido (pyre) now check a `_carthageDone` local: `($alba contains $alba2) and ($hasMissingPage or $returnedPage)`. When done:
   - Carthage shore: only "Wake from this dream" link shows (forces Interval). Atmospheric line above: "You have what you came for. The dream loosens; the only way back is up."
   - Dido: same forced "Wake from this dream", plus the "Lie down beside her" suicide-ending stays available.
8. **Green Sea link gated on `not ($alba contains $alba2)`** at both Carthage shore and Dido (was previously open even after collected).
9. **The Interval enriched** — added a Carthage-arrival prelude paragraph: "Salt on the lip. Cinder in the lashes. The pyre's heat lifts from your face the way a hand lifts from your face — and you wake." Plus brass-banister and barely-playing-radio detail in the existing stairs paragraph. All paths to Interval are from Carthage so this always applies.
10. "From jazz you can learn more about prose than you can about poetry." → **"Jazz tells you more about prose than it does about poetry."**
11. **lighthead** → **lightheaded** jazz pharaoh.
13. **Pipes-to-toilet animation** — was using `preserveAspectRatio="none"` so it stretched tall on portrait viewports. Changed to **`xMidYMid meet`** — square aspect ratio, centred, with black bars on landscape monitors instead of distortion.
14. **Cow-ride success SVG** — the streets-lighting-up `<div class="cow-soho-map">` block (with animated street reveals for Greek/Frith/Dean/Wardour/Berwick/Poland) was making the page feel like it was moving. Whole block deleted; passage now just shows the mnemonic text "Greek, Frith, Dean, Wardour, Berwick, Poland. // Go For Dinner With Billy Piper. //". Also added a **1.5s "victory ride" beat** to the cow game itself (was previously a freeze-frame): when wonGame triggers, road keeps scrolling and obstacles clear for 1.5s, drawEnd overlay delayed by 1.2s so the cow appears to gallop to the finish before "YOU RODE IT." fades in.
15a. **CLIMB IT** button on Centre Point approach — brightened from rgba(200,170,100,0.85) to **rgba(248,212,128,0.98)**, border opacity bumped from 0.3 to 0.55, added warm `text-shadow: 0 0 18px rgba(248,212,128,0.45)` for a soft glow.
15b. **Pentagram reveal on map after 5 lilies** — was gating `$sawPentangle = true` at notebook-open time. Meant if the auto-open didn't successfully reach the map tab on the first try, the queue was consumed but the animation didn't fire, and subsequent notebook opens wouldn't re-queue it. Fixed: `$sawPentangle` now gets set inside `nbSwitchTab` only when the map animation actually fires (via `Harlowe.API_ACCESS.STATE.variables.sawPentangle = true`). Queue persists across notebook opens until the player actually sees the reveal.
16. **Play Again button at the Dawn** — old code tried to filter localStorage by hardcoded IFID `2CA3EC26-...` but the matching was unreliable. New code: `localStorage.clear()` + `sessionStorage.clear()` + `window.location.href = window.location.pathname` (clean URL, no hash/query). Guarantees a fully unsaved start at the title screen.

Also tweaked Dawn timings (separate request earlier in session): ALBA reveals shifted from 11/12.8/14.6s to **6/8/10s**, summary at 13s, Play Again button at 20s (was 30s). Cow ride wonAt timestamp now tracked properly + reset on restart.

---

## Follow-up batch (Dawn pentagram + pyre SVG + tarot)

- **Pentagram at the Dawn** — Dr Quill reported it didn't show. Diagnosed: `.centre-pent-overlay` had no z-index, so it was painted IN DOM ORDER beneath the dawn-fade-to-white overlay (which is the last child of `.dawn-approach`). Once the fade started at ~7s, it covered the pentagram. Added **`z-index: 5`** so the gold star sits ON TOP of the fade — it now persists as the screen brightens/darkens. Also tightened the fade-in to 0.4s delay + 1.6s duration (was 0.9s + 2.4s).
- **Dido pyre SVG** completely rebuilt (used in both "Approach the Pyre" and "Stay in Carthage"). Old version was simple flame paths + small dark blobs. New version:
  - Clear shrouded body silhouette lying across the top log course (head bump left, foot end right, dark cloak across)
  - Three actual log courses (long bottom, perpendicular middle, glowing top with embers between)
  - End-grain circles + split-line texture on logs
  - Six flame layers (deep red → orange → yellow → white-hot core) with rim wisps both sides
  - More numerous rising sparks with varied warmth
  - Smoke wisps rising above flame tips
  - Better fluted columns either side (capitals, cracks, lichen, fallen drums)
  - Distant ruin silhouettes along the horizon
- **Tarot card title overflow** — "Temperance" (10 chars, single word) was overflowing the 72px-wide card. Tightened `.card-title`: font-size 0.56em → **0.50em**, letter-spacing 0.05em → 0.02em, padding 0 3px → 0 2px, plus added `width:100%; box-sizing:border-box; overflow-wrap:anywhere; word-break:break-word; hyphens:auto` as belt-and-braces. All 22 card titles now fit.

---

## Audio / housekeeping

- **Stray noise** — Dr Quill asked me to kill it. Was a stale `python3 -m http.server 8765` process (PID 4742) that had been running since the prior Thursday. Killed.
- **Embers animation** — the pyre's rising ember sparks were created but never wired into the animation loop. Now properly animated: rise upward via `currentY += riseSpeed * 0.016`, sway horizontally via `sin(t * swaySpeed + phase) * 0.18`, fade with `(1 - lifeFrac^2)`, recycle when they reach maxY or fade to ~0.

---

## State of the live code

All today's changes synced to `Dream Street Shuffle.html`. `sync_html.py` unchanged. No new MP3/M4A swaps. The Carthage approach scene now has dramatic ridged hill, jagged sandstone cliffs, sandy headland beach, animated pyre with body + smoke + embers, palms with proper amber-touched sage canopies, real shadow casting, and a settling sun. The brick-arch ruin sits in the foreground; XCIII is chiselled into the right colonnade's lintel.

---

## Memories added/updated today

No new memory files written this session.

---

## Open threads for the next session

- **Memory 2 / Memory 3 polaroids** — not touched today.
- **Notebook FINDS / EFFECTS / TREE / POEM tabs** — only LILIES and MAP have first-class animations (pentangle reveal). Other tabs reviewed earlier in week — no specific issues today.
- **Three Pillars (Mercy/Severity/Mildness)** — still banked.
- **Astral-map screenshots** banked 2026-05-13 — still uncommitted to a use, superseded by live astral reveal at Centre Point.
- **`Dream to Dean` and `Failure: Trisha's`** — both still orphan passages in the astral-skip list; could be deleted.
- **Title screen BEGIN link** — still bare text per prior handoff.
- **`Eat Shelleys Liver`** passage still orphaned (inline-button replaces it).

---

## Things considered and intentionally NOT done

- **Pentagram in two moments** — clarified with Dr Quill that pentagram should appear (1) when 5 lilies collected → notebook map animation, (2) at Centre Point endgame → overlay over Dawn Approach. Both implemented; the Dawn one had a z-index bug now fixed. No third trigger planned.
- **Cow ride success street-map SVG** — Dr Quill said the page felt like it was moving; the staggered street-reveal animation was the culprit. Removed entirely rather than rebuilt. The mnemonic text alone now carries the moment.
- **Approach scenes for Pillars / Ronnies / Lackland / Trisha** — shadow system applied to French / Coach / Colony only (those were the ones Dr Quill specifically asked for). Pillars / Ronnies / Lackland / Trisha approach scenes still use their original lighting; could be brought in line if needed.
- **Pyre SVG colours** — kept the same warm-orange flame palette as the original. Only the structure and layering were upgraded, not the hue.
