# Dream Street Shuffle — Field-Recording Capture List

**Why:** the current background ambience beds are free for *non-commercial* use only. The game is going commercial, so they need replacing. Plan: capture **original room tone on location** in Soho (Zoom mic), then drop the recordings in to replace the placeholders.

**The magic:** each bed keys on its **filename + tag**. If you record a venue and bounce it to the **exact placeholder filename** (see the drop-in reference at the bottom), it flows straight through `sync_html.py` with **zero changes to the `.twee`**. Record → rename → drop in folder → `python3 sync_html.py`. Done.

---

## 📍 On-location checklist (the trip)

Tick as you go. "Still trading?" — fill in on the day; some may have closed.

| ✔ Got it | Venue | Still trading? | What to capture |
|:---:|---|:---:|---|
| ☐ | **The French House** (Dean St) | ☐ | Bar-room murmur — glasses, low chatter, the room's particular hum. A few clean minutes. |
| ☐ | **Coach and Horses** (Greek St) — bar | ☐ | Late-ish bar ambience, busier and boozier than the French. |
| ☐ | **Coach and Horses** — gents | ☐ | The cubicle: cistern hum, tiled reverb, muffled bar bleeding through the door. (Opens the "come-to in a cubicle" scene.) |
| ☐ | **Ronnie Scott's** (Frith St) | ☐ | Club-room people ambience *between* sets. ⚠ Avoid catching identifiable live music — that re-introduces a licensing problem. Room tone + crowd only.<br>**Access:** paid entry only, and the cheap (upstairs) night usually has a gig on — clean room tone is hard. Workaround: aim for the lull before doors or between sets, or capture the bar / stairwell rather than the main room. |
| ☒ | **Pillars of Hercules** (Greek St) | ✗ **shut** (closed a few years back) | Gone — no on-site capture possible. Stand-in: record another old wood-panelled Soho pub for the same feel, or source a licence-clean archive. |
| ☐ | **New Evaristo Club / Trisha's** (Greek St) | ☐ | Subdued members'-club lounge — soft chatter, cutlery, intimate. Also covers the Colony Room bed.<br>**Access:** Trisha's is the reliable capture. The **Colony Rooms** itself is only reachable via your member friend (often busy) — treat it as a bonus, not a dependency; Trisha's stands in fine if it doesn't happen. |
| ☐ | **Cecil Court** | ☐ | Quiet bookshop-row at dawn — distant traffic, footsteps, birds. Pairs with the Soho-dawn outdoor scenes. |
| ☐ | **Berwick St / Soho streets at dawn** | ☐ | Early-morning Soho: shutters, a lone van, the city waking. (Jeffrey Bernard scenes.) |
| ☐ | **Any damp basement / cellar** | ☐ | Low pump-station hum + room tone. *Fictional rooms* (Copper's cellar, Lackland's back) — doesn't need a "real" location, just the right feel. |

**General capture notes**
- Grab **3–5 clean minutes** per spot so there's enough to make a seamless loop, with a little headroom either end.
- A few seconds of **silence/handle noise at the very start and end** helps the loop edit later — but mostly you want unbroken room tone.
- Watch for **copyrighted music playing in the venue** (jukebox, live act, radio) — that defeats the point. Pure room tone + voices is what you're after.

---

## 🎛 Drop-in reference (back at the desk)

Record → rename to the **exact filename** below → drop in the project folder (overwriting) → `python3 sync_html.py`. No `.twee` edit needed.

| Venue captured | Replace this file | Bed tag(s) |
|---|---|---|
| The French | `the-french-pub-ambience.mp3` | `venue-french` |
| Coach and Horses — bar | `the-coach-night-ambience.m4a` | `venue-coach` |
| Coach and Horses — gents | `the-gents-coach-toilet.mp3` | `venue-gents` |
| Ronnie Scott's | `the-ronnies-jazz-ambience.m4a` | `venue-ronnies` |
| Pillars of Hercules | `the-pillars-pub-ambience.m4a` | `venue-pillars` |
| Trisha's / Colony | `the-quiet-cafe-ambience.m4a` | `venue-trishas` + `venue-colony` |
| Cecil Court + Soho dawn | `the-soho-dawn-ambience.m4a` | `venue-cecilcourt` + `soho-dawn` |
| Basement hum | `the-cellar-pump-ambience.m4a` | `venue-cellar` + `venue-lackland-back` |

*(If you'd rather keep new recordings under new names, that's fine too — it just means a one-line filename change in `AUDIO_EMBEDS` in `sync_html.py`. I can do that side.)*

---

## ✅ Keep — already yours, no trip needed

Your own music + the procedural SFX are owned and stay put:
- **Music:** the theme loop, `piano-eoin`, `interval-radio`, `carthage-melody`, **Dido's Lament**, the Cecil Court waltz, and all the minigame loops (retro / pong / jazzmini / cowgame).
- **SFX:** everything procedural in `window.dssAudio` (pours, bells, wind, etc.).

## 🌍 Not Soho — source separately

The two **dream-world** beds aren't local captures:
- `the-carthage-cicadas-ambience.m4a` — Tunisian-night cicadas (dream Carthage).
- `the-green-sea-cafe-ambience.m4a` — Nabeul seaside cafe (the Green Sea bar).

These still need licence-clean replacements, just not from the Soho trip.
