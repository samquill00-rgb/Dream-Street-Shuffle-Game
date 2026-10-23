# Third-party sounds: sources and licences

Every outside sound that might go into the game: its page, author and licence. Checked against each item's own page on 2026-10-23; the files were matched by name and byte size.

| File | Page | Author | Licence | Credit needed |
|---|---|---|---|---|
| sickness.wav | https://opengameart.org/content/sick-noises | frosty ham | CC0 | No |
| glass_breaking.wav | https://opengameart.org/content/glass-break | Till Behrend | CC0 | No |
| water drops.mp3 | https://opengameart.org/content/water-drops | CeoxBlackj | CC0 | No |
| corsica_s-walking_in_snow.7z | https://opengameart.org/content/42-snow-and-gravel-footsteps | Corsica_S | CC0 | No |
| water.ogg | **not found**: the OpenGameArt "water.ogg" by jcpmcdonald (CC0) is a different file (12,805 bytes; yours is 538,794) | ? | **unknown** | Don't use until its page is found |

CC0 means public domain: free for commercial use, no credit required. Crediting CC0 authors anyway is a courtesy, not an obligation.

## In the game (2026-10-23)

| Game file | Made from | Used for |
|---|---|---|
| doorway-drops.m4a | water drops.mp3 (from 10.25 s: a half-second lead, an 8 s seamless loop, a 1.5 s tail) | Pissing in doorways (`startPissStream`) |
| vomit-sickness.m4a | sickness.wav (trimmed) | Vomiting (`startRetchStream`) |
| glass-window-smash.m4a | glass_breaking.wav (trimmed) | Smashing windows on the Dean Street map (`windowSmash`) |
| climb-snow-steps.m4a | eight steps from the snow-covered-gravel set, one per second | Footsteps in The Climb (`snowStep`) |

The originals stay in the Claude work folder.
