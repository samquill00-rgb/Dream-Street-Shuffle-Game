# Third-party sounds: sources and licences

## ATTRIBUTION LOG (kept up to date as assets come in; started 2026-10-31)

**Credits you must give** (licence requires it):
- None yet. Everything in the game so far is CC0 or public domain, or its licence is still unconfirmed (below).

**Credits that are asked for or customary** (not legally required; good manners in the end credits):
- NASA / Solar Dynamics Observatory: "Sun image courtesy of NASA/SDO" (Ronnie Scott's approach sky).
- Yughues (Nobiax), yughues.artstation.com: parquet pattern (Lackland's office). The slate pattern came off the cellar floor on 2026-10-31.
- Waterhouse Set creator: carved columns and arch at Carthage. The creator asks for a credit; their name still needs finding on the OpenGameArt page.

**Licence still to confirm before release** (each could turn out to need a credit, or not be usable):
- Moon overlay; Wood 1 and Wood 2; square paving flags and cobbles; dead trees; Parallax60 specks; construction mesh; lightning frames (map pentagram and Rapa Nui sky); 50 free textures 4; Dirt.png; Stains compressed; arcadefloor.png; Potion_1; tan gas giant textures.

**No credit needed** (CC0, or built by Claude from scratch):
- Everything else in the tables below that says CC0.
- Dripping water loop (atmosbasement.mp3_.flac) by Independent.nu, submitted by qubodup, https://opengameart.org/content/dripping-water-loop: CC0, checked on its page 2026-10-31 (file name and 1.3 MB size match). Now Copper's cellar drips. No credit needed; "Independent.nu" is a courtesy credit if wanted.
- The Persian rug in Copper's cellar (2026-10-31): Wikimedia Commons photograph Abrash.JPG, public domain as Sam downloaded it. No credit needed if that holds; worth a glance at its Commons page before release to be sure.
- The Ark of the Covenant in Copper's cellar (2026-10-31) is modelled from scratch. The Wikimedia Commons render you downloaded (Arca_da_Aliança_de_Deus_(3815219934).jpg) was only looked at for reference and is not in the game, so it needs no credit.

Every outside sound that might go into the game: its page, author and licence. Checked against each item's own page on 2026-10-23; the files were matched by name and byte size.

| File | Page | Author | Licence | Credit needed |
|---|---|---|---|---|
| sickness.wav | https://opengameart.org/content/sick-noises | frosty ham | CC0 | No |
| glass_breaking.wav | https://opengameart.org/content/glass-break | Till Behrend | CC0 | No |
| water drops.mp3 | https://opengameart.org/content/water-drops | CeoxBlackj | CC0 | No |
| corsica_s-walking_in_snow.7z | https://opengameart.org/content/42-snow-and-gravel-footsteps | Corsica_S | CC0 | No |
| atmosbasement.mp3_.flac | https://opengameart.org/content/dripping-water-loop | Independent.nu (submitted by qubodup) | CC0 | No |
| water.ogg | **not found**: the OpenGameArt "water.ogg" by jcpmcdonald (CC0) is a different file (12,805 bytes; yours is 538,794) | ? | **unknown** | Don't use until its page is found |

CC0 means public domain: free for commercial use, no credit required. Crediting CC0 authors anyway is a courtesy, not an obligation.

## In the game (2026-10-23)

| Game file | Made from | Used for |
|---|---|---|
| doorway-drops.m4a | water drops.mp3 (from 10.25 s: a half-second lead, an 8 s seamless loop, a 1.5 s tail) | Pissing in doorways (`startPissStream`) |
| vomit-sickness.m4a | sickness.wav (trimmed) | Vomiting (`startRetchStream`) |
| glass-window-smash.m4a | glass_breaking.wav (trimmed) | Smashing windows on the Dean Street map (`windowSmash`) |
| climb-snow-steps.m4a | eight steps from the snow-covered-gravel set, one per second | Footsteps in The Climb (`snowStep`) |
| sfx/sfx-drips.m4a | atmosbasement.mp3_.flac: eight clean drips, each levelled and set in a 1.5 s slot (2026-10-31) | Copper's cellar: its ambient drips and the ceiling drip you can see (`dripDrop`). The street's after-rain drips stay synthesised; the gents stays Sam's recording |

The originals stay in the Claude work folder.

## Images and textures (added 2026-10-29)

| Asset | Where in the game | Source / licence |
|---|---|---|
| Sun (SDO/AIA 304, 2010-06-22), labels cropped | Ronnie Scott's approach sky | NASA / Solar Dynamics Observatory, public domain. Credit: NASA/SDO |
| Moon overlay (moon_overlay.png) | Night sky over the eight Soho approaches | Downloaded by Sam; licence to confirm |
| Wood 1 (dark oak) and Wood 2 (mahogany), wood_0.zip | Coach and Horses interior: trim, panelling, counter | Downloaded by Sam; licence to confirm |
| Square paving flags (ground_pavement_square2) and cobbles (ground_cobblestone5) | Gents tile strips; the gardener's hut worm wall | Downloaded by Sam; licence to confirm |
| Patterns 271 (parquet) and 273 (slate tile), 3D_pattern_54 | Lackland's office floor (the cellar floor until 2026-10-31, now plain concrete again) | Yughues (Nobiax), CC0 1.0 (original pack readme). Courtesy credit: Yughues, yughues.artstation.com |
| Dead trees (tree_collection_dead_1K), four cut out | The coast of Carthage | Downloaded by Sam; licence to confirm |

| Parallax60 (specks layer) | Ronnie's ceiling star-drift; Colony smoke glitter | Downloaded by Sam; licence to confirm |
| Seamless abstract pack 128x128 (nos 2, 6, 13, 16, 22, 26, 29, 33, 36, 38, 41, 44, 45, 49, 50) | Cosmogramma LP sleeves; Ronnie's light show; Ronnie's bar-game arena; chippy formica; Trisha's panels and bar front | Screaming Brain Studios, CC0 (pack License.txt) |
| Construction mesh cover | One sheet each in the Colony and Copper's cellar | Downloaded by Sam; licence to confirm |
| Lightning (frames 0, 1, 3, 5, 7, 9) | Pentagram cast on the notebook map; Rapa Nui sky strikes (2026-10-30) | Downloaded by Sam; licence to confirm |

| 50 free textures 4 + normal maps: 163 (lichen stone), 173b / 173_norm (oil-slick metal), 176 (carved lattice) | Carthage colonnade; portal pillar shaft; Green Sea shutters | Downloaded by Sam; licence to confirm |
| Dirt.png | Nazca race pampa crackle | Downloaded by Sam; licence to confirm |
| Stains compressed (old papers), two pieces | Plot-speech panels; Page 93 | Downloaded by Sam; licence to confirm |
| arcadefloor.png | Trisha's floor | Downloaded by Sam; licence to confirm |
| Fantasy Ruins Pack: RuinArch_01, TempleRuin_02 (no ivy), RomanTypeCol_01, RuinWallSegment_01 + their stone textures | Carthage approach: drowned harbour, headland temple, wall among the palms | 3TD (Three D Textures), CC0 (3TD_CC0_License_EULA.pdf) |
| Medieval Church (75990), Collada export, carved door figure omitted | Dawn view from Centre Point (oxford-street-from-centre-point-3d-static.html), north of Oxford Street | Daniel74, CC0 (licence page in the pack) |
| Medieval Modular Buildings 1 (74696): Plaster, Wood, RoofTiles, GreyBricks textures | Soho Square gardener's hut | Daniel74, CC0 (licence page in the pack) |
| Butterfly (monarch) wing texture, butterfly-skin.png | Colony approach, resting on the wall between the doors | Čestmír Dammer (for Kelgar), CC0 (license.txt) |
| Potion_1 (FBX), rendered once to an image, re-coloured crimson | Shelley's liver: OBJECT ACQUIRED box and notebook | Downloaded by Sam; no licence in the archive, to confirm |
| Waterhouse Set: Grey_Pillar, Arch_Round (FBX) + HalfAtlas texture | Carthage approach: broken and background columns, a drowned arch | Public domain (OpenGameArt notice); creator asks for a courtesy credit, name to add |
| tan-gas-giant-textures (face 4) | Carthage dream planet; Ronnie's tan ringed planet | Downloaded by Sam; no licence in the archive, to confirm |
| Kenney Planets (planet05–08) | Ronnie's approach sky (rust, ice); Rapa Nui sky (mauve, tan) | CC0 |
| Abrash.JPG (Wikimedia Commons), warmed and desaturated into assets/cellar-rug.jpg | The rug under the chesterfield in Copper's cellar (room and approach) | Public domain (per Sam's download) |
| Smithsonian Open Access, Pergolesi Side Chair (low-res glb, unpacked to models/pergolesi-chair.*) | The Colony Room, back wall between the bar and the piano | CC0 |
| Kenney Space Skyboxes (skybox-space-day, cloud band) | Rapa Nui clouds (clouds/rapa-nui-clouds.png) | CC0 |
| Kenney Voiceover Pack: Fighter (8 calls) | Cellar fight ring MC (fight-announcer.m4a) | CC0 |
| Kenney Impact Sounds (punch, soft, glass, plate, wood; footsteps concrete/wood/carpet/grass/snow) | Fight punches and falls, glass clinks/smash, crockery, knocks, landings, footsteps (sfx/sfx-impact.m4a, sfx/sfx-steps.m4a) | CC0 |
| Kenney RPG Audio (creak, doorClose, bookFlip, bookPlace, handleCoins, metalLatch) | Door creaks and closes, page rustles, tarot card turns, coin into pocket, Zippo lid (sfx/sfx-rpg.m4a) | CC0 |
| Kenney UI Audio (switch 2–6, click 1–5) | Notebook tab tick (sfx/sfx-ui.m4a) | CC0 |

Not used (ShareAlike, held for Sam's decision): ulukai skyboxes (CC-BY-SA 3.0), Ryzom textures incl. sky_fyros_day_clouds (CC-BY-SA 3.0), penguins skybox pack by Zachery Slocum (CC-BY-SA 3.0). Not used for period: ground_brick_parker (modern herringbone concrete pavers).

