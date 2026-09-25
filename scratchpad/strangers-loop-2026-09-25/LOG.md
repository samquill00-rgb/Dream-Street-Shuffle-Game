# Strangers loop, 2026-09-25 — running log

Brief: two hours from the chair on the five strangers at the edges of the Dean Street tile map (Helvellyn Gooch, the Fetch, Misty "Morris" Minor, Tom Longshanks, Guilliam Songstrong) and the moment of coming back to the street from a dream world, made spectral in Sam's sense: "beauty in this world is spectral, the trace, the ghost, the memory." Branch `claude/strangers-loop-2026-09-25-iuew5q`, started from main at 3aae110 (the polish-loop and beauty-loop branches were merged before this loop began, so this branch stands alone). Six touches, one commit each. His prose, verse, pink lines, link wording, variables, endings, audio and the critic scene are untouched. Safari was not run; everything below is headless Chromium.

Motifs extended, none invented: the title after-image (two misregistered copies, cold up-left and warm down-right), the lamps' light lying on the wet pavement, the walker's breathing pool, the colour of the room just left (afterglow), the dream residue.

## Before
The strangers were drawn on the base canvas UNDER the glow layer, so at play size each was a pale smudge inside its own pool (Gooch barely a figure). Their pool was static apart from the map's global flicker. Stepping onto one cut to black. The return to Dean Street was a bare page (the stranger passages are `outdoor`, and the afterglow did not know them). Once met, the corner was simply empty.

## Touch 1 — the figure carries an after-image (01:45 UTC) — 0dfb3f9
The five strangers move from the base canvas to the frame loop (`strangerCards`: three 16px cards per stranger, a cold copy, a copy tinted in the world's colour, the figure itself) and are printed three times, cold up-left, world-colour down-right, both faint (30%, 24%), the figure on top. The Fetch keeps its own thinning. A side effect worth knowing: the figure now sits ABOVE its pool, so it reads as a person on a corner rather than a mark in the light. Before/after `touch1-gooch-near-{before,after}-3x.png`.

## Touch 2 — the after-image parts as you walk towards them (01:52 UTC) — fe1c2f4
The copies sit one pixel out at six tiles and three pixels out a tile away (Manhattan distance, linear between). The figure itself never moves; it is the print that comes apart the nearer you get. `touch2-morris-near-after-3x.png` against `touch2-morris-far-after-3x.png`.

## Touch 3 — the pool lies on the wet pavement and breathes (02:00 UTC) — b1e4136
In the glow layer the world's colour now runs down the road tiles below and beside each stranger, the same `smear` the lamps use (45%). In the frame loop a slow breath in the world's colour (period about 10 seconds, 5–11%) rises and falls under the figure, as the walker's own pool does. `touch3-songstrong-{before,after}-3x.png`: the warm drips below Songstrong on Frith Street.

## Touch 4 — the step onto them goes to their colour before it goes dark (02:07 UTC) — 4707c58
The map's 14-frame fade when a stranger's (or the Fetch's) tile fires now passes through the world's colour (a sine bump to 70%) on its way to black (squared), so you walk into their light rather than into a cut. Other doors fade as before. `touch4-gooch-step-midfade-after.png` is the stage a hundred milliseconds in, the street gone brass.

## Touch 5 — their colour comes back to Dean Street with you (02:12 UTC) — ab23268
The five stranger passages carry a second tag (`stranger-gooch`, `stranger-fetch`, `stranger-morris`, `stranger-longshanks`, `stranger-songstrong`; tags only, the passages' text untouched), and the afterglow's tint table knows them, in each stranger's pool colour. The hub arrives with a cast of the light you just stood in and it fades over the usual five and a half seconds. `touch5-longshanks-return-{before,after}.png` (lilac on the arriving page). Same `window.DSS_AFTERGLOW = false` switch.

## Touch 6 — the corner keeps a trace once they are met (02:20 UTC) — bdf7f75
Dean Street carries five hidden hub flags (`met-gooch` and so on, following `$goochMet`, `$fetchSeen`, `$morrisMet`, `$longshanksMet`, `$songstrongMet`), and the glow layer lays a faint pool in the world's colour (18%) with a small cold halo (10%) on the tile a met stranger stood on. A first try at 11%/7% was invisible at 3x. `touch6-gooch-corner-after-meeting-{before,after}-3x.png`: a pale smudge on the corner, right of the walker, where Gooch was.

## Play size and phone
`playsize-gooch-1212.png` (the whole stage at 1x: Gooch a figure on the Charing Cross Road corner, brass glint, warm pool, drips beneath) and `playsize-morris-phone-390.png` (Morris beside the walker on Wardour Street at phone width, small but present).
