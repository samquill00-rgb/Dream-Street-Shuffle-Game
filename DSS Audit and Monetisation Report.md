# Dream Street Shuffle — Full Audit & Monetisation Report

*Prepared March 2026*

---

## Part 1: What You've Built (Overview)

Dream Street Shuffle is a literary interactive fiction game built in Twine/Harlowe (3.3.9), set across a single night in 1960s–70s Soho. The player is a writer carrying a manuscript through pubs, clubs, and bookshops, encountering poets, critics, painters, and gangsters. The game runs to roughly 164 passages across 20,000+ lines of HTML.

It's genuinely impressive work. The prose is strong, the atmosphere is consistent, and the mechanical systems (alba, haunts, stats) are elegant. What follows is an honest breakdown of what's working, what needs attention, and how you might make money from it.

---

## Part 2: Technical Audit

### 2.1 CSS & Visual Design — Strong

The stylesheet is one of the best parts of the project. You've built:

- **Venue-specific colour tints** (amber for The French, green for Colony Room, crimson for Trisha's, smoky purple for Ronnie Scott's) — these are atmospheric and well-coded using passage tags.
- **Custom tracker boxes** for alba, haunts, secrets, and items — each with its own colour palette and glow animation.
- **The notebook page** with Kalam handwriting font, ruled-line background, and red margin line — this is a lovely touch.
- **The typewriter page** for "The Night Ahead" — Special Elite font, cream paper, blinking cursor. Very cinematic.
- **Decorative SVGs** for each venue (Colony Room corners, Ronnie's spotlight cone, Pillars columns, Trisha's neon frame, Copper's swinging bulb).

**Issues found:**

1. **Typewriter animation is disabled.** Line ~3069 has `var skipTypewriter = true;`. The elaborate typing effect never runs. This is presumably deliberate (maybe it was too slow?) but it's worth knowing it's sitting there unused.

2. **A test/debug back button** is being injected via a MutationObserver (~line 3418). This should be removed before any public release.

3. **Blank line bloat.** There are large stretches of empty lines (particularly around lines 3440–7100). These are likely Twine export artifacts. They don't break anything but they inflate the file size unnecessarily.

4. **Mobile responsiveness is decent but not perfect.** The typewriter page has a fixed 560px width (capped at 90vw, which helps). The canvas minigames will be very difficult to play on phone screens — the fight game especially needs a reasonably large tap target.

5. **The aggressive BR-removal script** (~lines 3247–3415) runs twice per passage load with a 600ms debounce. It's doing a lot of DOM traversal to clean up Harlowe's whitespace. It works, but it's heavy-handed.

### 2.2 JavaScript Minigames — Ambitious

Three canvas-based minigames:

- **Bar Game** — order-matching (pick the right bourbon, glass, lime, scotch). Clean implementation. Sobriety affects screen wobble when < 50.
- **Fight Game** — dodge/block/counter Copper's punches. 3 practice rounds + 3 real rounds. Sobriety affects telegraph visibility and timer speed. The Copper character portrait is drawn entirely in code (hair, quiff, cauliflower ears, stubble, scars) — this is remarkable work.
- **Ping Pong** — at Lackland's back room. Steady/Aggressive/Trick modes.

**Issues found:**

1. **No keyboard accessibility.** All three games are mouse/click only. A screen reader or keyboard-only user cannot play them. This is the single biggest accessibility gap.

2. **No touch adaptation.** The fight game's dodge zones are designed for mouse hover states. On mobile, there's no hover. Players won't see the zone highlights before tapping.

3. **Sobriety can go negative.** If `$sobriety` drops below 0, the alpha calculations in the fight game produce nonsensical values. Consider clamping to 0.

### 2.3 Game Variables & State — Well Structured

The core systems are sound:

- **$confidence** (starts 65) — rises and falls with choices, affects dialogue and endings
- **$sobriety** (starts 100) — drops with every drink, affects minigame difficulty
- **$haunts** (array) — 8 collectible supernatural "marks"
- **$alba** (array) — 3 lines of an aubade poem, the escape mechanism
- **$visited** (datamap) — tracks first visits to venues
- Various boolean flags for knowledge, items, encounters

**Issue:** Variable initialisation is generally good (you check `(unless: $visited is a datamap)` before use), but if a player somehow reaches certain passages out of order, some flags may be uninitialised. Not a likely problem in normal play, but worth noting.

### 2.4 Passage Structure & Links

**Strengths:** Dean Street works well as a hub. The venue system (with `[venue-french]`, `[venue-ronnies]` etc. tags) is clean. Visited-venue tracking prevents repeat first-visit text.

**Issues found:**

1. **Some "choices" aren't choices.** For example, "Lackland's Back Room" offers `[[Watch the decider|Watch the decider]]` and `[[Slip away quietly|Watch the decider]]` — both go to the same passage. This could feel like a trick to players. If both paths lead to the same place, consider making it a single link with richer text.

2. **Venue exhaustion messages** (`<div class="venue-exhausted">`) appear when content is spent, but players might not understand why they can't do more. A brief explanation ("You've done what you can here tonight") would help.

3. **"You missed a haunt" messages** appear as `<span class="missed-haunt">` — these are helpful for replayability but might frustrate first-time players who don't understand the haunt system yet.

---

## Part 3: Narrative & Content Audit

### 3.1 Prose Quality — High

The writing is the game's strongest asset. Some standout moments:

- The French House arrival and the Colony Room's sickly atmosphere
- Jeffrey Bernard's cow (absurdist and confident)
- The Trisha's basement entrance ("smoke and incarnadine light... The air tastes of perfume, secrets, cigarettes. The holy trinity.")
- O'Flatterly's antiquarian bookshop and the missing page quest
- Copper's cellar confrontation

The voice is consistent: literary, knowing, wry, with a fondness for the semicolon. It reads like someone who has actually spent time in Soho and cares about the history.

### 3.2 The Alba System — Elegant but Unclear

**How it works:** Three lines of an aubade (dawn poem) are scattered across the game. Collecting all three is the escape condition. You need ≥3 haunts to unlock the later lines.

**The three lines:**
1. "As cool as the pale wet leaves"
2. "of lily-of-the-valley"
3. "She lay beside me in the dawn."

**What's good:** This is beautiful as a concept. A poem as an escape key. The gate condition (haunts required first) forces exploration. The lines are thematically perfect for a game about a writer stuck in Soho overnight.

**What needs work:** Players may not understand what the alba *is* or why they're collecting lines. The quest-box explains it, but only if the player reaches the right passage. Consider an earlier, subtler hint — perhaps the title screen or the typewriter page could mention the word "alba" or "aubade" to plant the seed.

### 3.3 The Haunt System — Good Variety

Eight haunts distributed across the game:

1. The Sketch (Copper's venue)
2. The Refusal
3. The Beast (Jeffrey Bernard's cow)
4. The Debt
5. The Game
6. The Delivery (O'Flatterly / Shelley's liver)
7. The Head
8. The Wound (Trisha's)

**What's good:** The names are evocative. The first-time explanation ("Tonight, Soho will mark you...") is well-written. Distribution across venues encourages thorough exploration.

**What needs work:** Some haunts are quite hard to find without guidance. Consider whether the "You missed a haunt" messages give enough information, or whether the notebook should track *where* to look.

### 3.4 Endings

At least three distinct endings:

1. **"Things Turn Up"** — victory. Alba complete, escape Soho. Loop option available.
2. **"No More"** — incomplete. Trapped. Centre Point still behind you.
3. **"Stay in Carthage"** — dark/voluntary surrender. Elaborate pyre imagery.
4. **"Black Page" / "EXPLICIT LIBER EST"** — total failure.

**What's good:** Multiple endings with real emotional variation. The Carthage ending is particularly literary (Aeneas refusing to leave).

**What needs work:** The conditions for reaching each ending could be clearer in-game. Players may feel they've "lost" without understanding what they needed to do differently.

### 3.5 Underdeveloped Areas

- **Lily** — referenced through glimpses and an SVG, but her subplot feels thin. She's clearly important emotionally but the player barely interacts with her.
- **Watkins, Steve Merkin, Maltese Gangsters** — mentioned but barely developed.
- **The maritime interlude** — atmospheric but its connection to the main story is oblique. Players might be confused about why they're suddenly at sea.

---

## Part 4: Recommendations for Improvement

### 4.1 Quick Fixes (Do These First)

1. **Remove the debug back button** (MutationObserver injection ~line 3418).
2. **Strip blank line bloat** from the exported HTML.
3. **Clamp $sobriety to 0** minimum to prevent negative values affecting minigames.
4. **Add `aria-label` attributes** to canvas elements for basic accessibility.
5. **Decide on the typewriter animation** — either enable it (with a "skip" option) or remove the dead code.

### 4.2 Player Guidance Improvements

1. **Notebook hints** — the notebook should give gentle nudges about unexplored venues or unfinished quests. Not a quest log, but a writer's notes ("I should check on that antiquarian in Cecil Court...").
2. **Alba explanation** — introduce the concept earlier. Even a line on the title screen: "Find the alba. Get out alive."
3. **Haunt feedback** — when a player leaves a venue without finding its haunt, consider a subtler cue than "You missed a haunt" (which feels gamey). Perhaps: "Something stirs behind you as you leave. You didn't stay long enough."
4. **Ending conditions** — after a failed ending, give the player a clearer sense of what they needed. "You needed more haunts" or "The alba was incomplete."

### 4.3 Mobile & Accessibility

1. **Add a simplified text-mode for minigames** on mobile (choice-based rather than canvas-based).
2. **Keyboard controls for canvas games** — arrow keys for dodge, spacebar for block, enter for counter.
3. **Increase font size on mobile** — current 1.1em at the 600px breakpoint could go to 1.15em.
4. **Add skip options for minigames** — literary players may not want to play ping pong. Let them watch and get a narrative outcome.

### 4.4 Content Depth

1. **Expand Lily** — she's the emotional heart the game is missing. Give the player one real interaction with her, not just glimpses.
2. **Give the maritime interlude a clearer anchor** — a line connecting it to the main story ("You fell asleep at the bar. You dream of—").
3. **Add one more venue encounter** — the game could support one more character interaction, perhaps at the Coach and Horses (which currently feels underused compared to The French or Trisha's).

---

## Part 5: Monetisation for a Literary Audience

This is where it gets interesting. You've built something unusual — a genuine literary game with real prose quality. That puts you in a niche, but a niche with devoted, spending customers.

### 5.1 Direct Sales (Most Realistic, Fastest)

**Itch.io release — £5–£8**

Itch.io is the natural home for indie interactive fiction. Literary IF has a small but loyal audience there. Your game's atmosphere and prose quality would stand out.

- Upload the HTML file directly (Twine games run in-browser on Itch).
- Set a "pay what you want" floor of £5 with a suggested price of £8.
- Add a few screenshots showing the typewriter page, the venue tints, the notebook.
- Tag it: interactive fiction, literary, Soho, 1960s, Twine, atmospheric.

**Expected:** Modest but real. A well-marketed literary Twine game on Itch can make £500–£2,000 in its first year with good press coverage.

### 5.2 Expanded Edition (Higher Price Point)

**Steam or standalone app — £10–£15**

Wrap the game in Electron or similar. Add:

- A "Director's Commentary" mode (author's notes on each passage — your lore boxes already do this, expand them).
- An illustrated edition with commissioned artwork for key scenes.
- A soundtrack (you already have a Dream Street Shuffle MP3 in your files).
- Achievements/unlockables tied to haunt collection and alba completion.

Steam takes 30% but gives you access to a vastly larger audience. Interactive fiction sells modestly on Steam but literary games with strong atmosphere (like *Disco Elysium*, *80 Days*, *Citizen Sleeper*) have proven the market exists.

### 5.3 Serialised / Episodic Release

**Substack or Patreon — subscription model**

Your game is structured around a single night. But the lore suggests history, repetition, cycles. You could serialise:

- **Season 1:** The night you've already built. Released free or cheap as the hook.
- **Season 2:** A different night in Soho. Same mechanics, new characters, new venues, new alba. £3–£5 per episode or bundled.
- **Season 3:** A different city entirely. Same framework applied to, say, 1920s Paris or 1950s New York.

This works well on Patreon/Substack because literary audiences are already comfortable with subscription models for serialised content.

### 5.4 The Literary Crossover (Highest Potential)

**Paired with a published novella or chapbook**

This is the big idea. Your game is *about* a writer in Soho. The prose is good enough to stand on its own. Consider:

- **A companion novella** — the same night, written as linear prose. Sell the game and the book as a package. The game is the interactive experience; the book is the definitive text.
- **A chapbook of the alba** — a small, beautiful printed edition of the poem the player assembles in-game. Sell it as a physical object. Literary audiences love limited-edition chapbooks. Price: £10–£20 for a hand-printed run.
- **Pitch to a literary publisher** — publishers like Fitzcarraldo Editions, And Other Stories, or Galley Beggar Press are interested in experimental forms. A "playable novella" could get serious literary attention.

### 5.5 Live Events & Readings

**Soho walking tour + game**

This is niche but high-margin. Partner with a Soho venue (The French House still exists, as does Ronnie Scott's) for:

- A guided walk through the game's locations, with readings from the text at each stop.
- Attendees play the game on their phones as they walk.
- £25–£40 per ticket. Monthly event. 20 people per walk = £500–£800 per event.

Literary festivals (Hay, Edinburgh, Cheltenham) might also programme this as an interactive session.

### 5.6 Arts Council / Grants

**Apply for funding as a digital literary work**

Arts Council England funds "digital literature" and "interactive storytelling." Your project sits squarely in this category. A grant of £5,000–£15,000 could fund:

- Professional playtesting and accessibility improvements.
- Commissioned artwork and sound design.
- A proper launch with press coverage.

Also worth looking at: the Wellcome Trust (if you angle the "writer's mental health in Soho" theme), and Creative Scotland if you have any Scottish connection.

### 5.7 Pricing & Audience Summary

| Route | Price Point | Audience | Effort | Revenue Potential |
|-------|------------|----------|--------|-------------------|
| Itch.io (HTML) | £5–£8 | IF community | Low | £500–£2,000/year |
| Steam (wrapped) | £10–£15 | Broader indie gamers | Medium | £2,000–£10,000/year |
| Patreon (serialised) | £3–£5/month | Literary subscribers | High (ongoing) | £200–£1,000/month |
| Companion novella | £12–£18 | Literary readers | High (one-off) | Depends on publisher |
| Chapbook | £10–£20 | Collectors, poetry readers | Low–Medium | £500–£2,000 per run |
| Walking tours | £25–£40/ticket | London literary tourists | Medium (recurring) | £500–£800/event |
| Arts Council grant | N/A | N/A | Medium (application) | £5,000–£15,000 |

---

## Part 6: Final Thoughts

Dream Street Shuffle is a literary game that takes itself seriously, and that seriousness is its greatest asset. The prose is good. The systems are elegant. The atmosphere is consistent and immersive.

The main things holding it back are polish issues (accessibility, mobile, the debug artifacts) and player guidance (the alba and haunt systems need clearer introduction). These are fixable.

For monetisation, the most realistic path is an Itch.io release now (minimal extra work), with a longer-term plan toward either a Steam release with expanded content or a literary crossover (novella + game package). The walking tour idea is the most original and could generate real press interest.

The audience for this game exists. They read literary fiction. They listen to jazz. They drink in The French House. They will find you if you put it in front of them.
