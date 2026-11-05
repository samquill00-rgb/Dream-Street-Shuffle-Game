# Beat scene — the generated music of the Burial pass (2026-11-04/05)

Everything here is synthesised by `tools/beatkit.py` (no samples). One compose script per track; a track is a re-run, never a hand edit of audio.

- `tools/beatkit.py` — Song (bars/beats, swing, timing jitter), the voices (2-step kit, dusty snare, rims, 808, sub, growl, the formant
  "pitched vocal" pad, dark/supersaw pads, Rhodes, stabs, bells, FM glass, brass, glitter, risers), the room (crackle, rain, tape wow,
  lowpass lid, hall, sidechain), seamless loops (`loop_seconds`: tail folded onto the head, 21 ms crossfade, 1024-sample aligned).
- `tools/finish.sh <wav> <LUFS> <out.m4a> [<out.mp3>]` — level to a target loudness, write the game file and a preview.
- `tools/treat.py` — the same room applied to a finished file (hall folded round the loop, crackle, lid, wow), length kept to the sample.
- `tools/compose_bed.py <preset>` — the fourteen gap beds of 2026-11-05 (night-ahead, street, pillars-rain, portal, maltese, cecil, and the
  eight "through the wall" venue beds). `compose_fight.py`, `compose_waltz.py`, `compose_pong.py`, `compose_cards.py`, `compose_cow.py`,
  `compose_hub.py`, `compose_reclaim2.py`, `compose_race2.py`, `compose_run2.py` — the nine tracks of the 2026-11-04 pass.

Live in the game (sync_html.py links them): fight-halftime, cecil-court-waltz-burial (beat-locked: exactly 32.000 s at 90 in 3/4, downbeat
at sample 0), pong-actress (the Actress track at Pong's level), nazca-race-hudmo, pyramid-run-rustie, and the fourteen `bed-*-music.m4a`.
Ruled out by Sam and left unlinked: dean-street-burial-loop, pong-hudmo, cards-actress, cow-wonky, reclamation-kode9, the four `*-treated`.

Beds (2026-11-05): the thirteen music beds carry `resumePosition: true` (a revisited page resumes its bed), untagged story pages hold the current beds (engine rule), and the open-air beds have their sub pulled 6 dB so laptops hear them. Levels: wall beds ~4 dB under their real floors.

Rules: no rain anywhere but the Pillars approach (`rain=0` everywhere else); each HTMLAudio game's file keeps the LUFS of the file it
replaced; a music bed under a real recording sits ~4 dB under it (LUFS + 20·log10(volume)); the waltz's length is the game's clock.

Rebuild a bed: `cd tools; python3 compose_bed.py french "../Bed french.mid" "../Bed french.wav"; ./finish.sh "../Bed french.wav" -25 "../../../bed-french-music.m4a" "../Bed french (preview).mp3"`
(the python needs numpy, scipy and mido: the Playwright venv noted in HANDOFF has them).
