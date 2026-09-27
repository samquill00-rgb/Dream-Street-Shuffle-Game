# The Pillars room lifted to the outside scenes' level — 2026-09-27, 19:00 to 20:20 UTC

Sam (19:00 UTC): "The level of detail is much lower than the scene I already have though. Shall we go venue by venue and work on them to bring them up to par?" Then: the French is not the bar either; "any of the outside Soho scenes are the strongest". So the bar is the Pillars approach (the timber-framed pub front on Greek Street with its fascia lettering, sandwich board, planter and lamps, rendered through the game's bloom pass). A screenshot of it sits beside the room's in `pillars-lift-2026-09-27/` as `the-bar-to-match-pillars-approach.png`; `before-1-arrival.png` is the room as it was.

Branch `claude/scene-closeups-pe93vp`, one commit. Nothing about the navigation changed: the same six hotspots, the same passage links pressed by their wording, the same camera positions, so the 2026-09-26 route walks still apply and were rerun.

## What was done, in three passes

**Materials and light (the French's toolkit, tuned for a pub).** Layered wood grain with varnish scratches for the oak bar, the dark panelling and the shelves; a small canvas-made environment cube so the metal and the varnish reflect something; a hammered copper top worn to a penny's pink where elbows go and greening at the edges, with a copper edge strip and a brass foot rail; floorboards each a shade its own with joints and nail heads; walls of soot-washed paint with a real cornice. Bottles are glass with a clearcoat and labels, three shelves and a row of optics. The columns have fluted shafts, an Attic base, a jagged break that no two share, and rubble at the foot; the whole third pillar keeps its capital. The stained-glass panel is a leaded rose, and it drops its colours faintly on the boards. The arch to Manette Street has voussoirs and a keystone, rain that falls (a scrolling texture), and a lamp beyond. The lattice window has proper leading and raindrops. The wall lamps are brass brackets with frosted tulip shades, a bulb and a glow. Contact shadows under stools and pillars; haze under the lamps; dust only in the lamp pools.

**Two reflections.** The French's planar mirror, made general: the mirror behind the bar is a real reflection of the room, tarnished at the edges; and the flood at the threshold is a second one, lying on the boards by the door, holding the room upside down with a slow ripple. Both redraw only when the camera moves. The threshold close-up shows the right column standing in the water.

**The particulars (what the outside scenes have).** Gilt lettering across the mirror (THE PILLARS OF HERCULES · fine ales · wines · spirits); pump clips naming the ales; a chalkboard of REAL ALES with prices and "no credit, no exceptions"; three framed Piranesi etchings of ruins on the right wall (the same ruins the columns are; captions Veduta degli avanzi, Rovine del tempio, Colonne spezzate); a clock stopped over the wall right of the arch; coat hooks by the door with a coat and hat left on them; beer mats and a bell on the copper; glasses, an ashtray and a folded paper on the shelf tables. The game's own bloom pass (`dssMakeComposer`) now runs on the room at the room's size, so the lamps and the glass bloom as they do outside. Exposure and ambient raised so the right wall reads.

The third pass moved the chalkboard and clock off the window and the arch (they had landed across them from the window's close-up), shrank the shades, and lifted the light again.

## Verified (headless Chromium; Safari not run)
Route walks at 1280×900, 390×780 and 1280 reduced motion: 37, 36 and 32 checks, 0 fails, 0 JS errors including the approach. Same paths as before: the Ham, the drink, the walk on water sober and stumbled, the crossing with a key, Aoife's call and the Lily ring through the modal, the inspections, the lily below, GO TO THE PILLARS landing in the pub. Phone width: the telephone is off frame (inspection only), as before.

## Still short of the outside scenes, for Sam to weigh
- The figures are the same faint traces; the outside scenes have no people to compare.
- The room is one lens, not the outside scenes' tilted street view; the approach has more sky and depth to play with.
- The etchings and the chalkboard are procedural; a photograph of the real interior would let the room be brought to it, as the French was.
- Not yet lifted: the Colony Room, Ronnie Scott's, and the French itself (Sam: "still pretty rubbish"). The recipe now lives in the Pillars scene and copies across.
