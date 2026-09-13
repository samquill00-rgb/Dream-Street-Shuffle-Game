# Dream Street Shuffle — independent mechanics audit

13 September 2026. Review of the current source and local running build. **No game code or creative text changed; no git commands run.**

The main problem is unfinished work becoming inaccessible. Several gates still treat a venue as a one-off encounter, while the newer mechanics require returning for a poem line, a dream, a stored object, or the second half of an encounter. The new street exits expose this mismatch particularly clearly.

## Scope and evidence

- Indexed all **229 source passages**, including system, script and stylesheet passages. Checked **292 literal passage links** plus literal display/go-to targets: no missing targets or duplicate passage names.
- Reviewed the passage mechanics across the opening, venue chains, phones, condition and night progression, all three poem lines, haunts, flowers, keys and theft, the five dream worlds, synthesis, notebook and endings. Examined the map's door selection and the shared interface/navigation code.
- Parsed **113 executable JavaScript blocks**, including the main UserScript: no JavaScript syntax errors. All **29 configured build assets** exist; no missing literal local src/href assets found.
- Ran **17 targeted browser scenarios**, plus a separate replay-storage test. Scenarios used constructed prerequisites and then actual game links. They establish the reported state transitions; they are not 17 full playthroughs.
- Tests ran in fresh, isolated Chrome pages. Setup and a small state readout were injected in the browser from the source. The user's saves and game files were not edited. The compiled HTML was not read as source.
- Evidence and reproduction scripts: [audit files](scratchpad/mechanics-audit-2026-09-13/). Scripts currently use the local preview at port 8732 and the installed runtime paths.

A clean passage-link graph does **not** prove these quests are completable: a passage can exist and be connected, while the conditions permanently hide the only route into it.

## Findings to fix first

### 1. The new cow gate has no normal return route — P1

**Reproduction:** reach Jeffrey with only line one. The new guard correctly withholds the cow ride. Leave, obtain line two, and return to the map. The Coach has no ordinary return link: its hub entries exist only during the sobriety crisis. If the dual phone call has already happened, it does not provide another trip there either.

**Verified:** the cow link is absent with one line and present with two inside the bar, but the hub offers no Coach route in the corresponding healthy, two-line state. Knowing where the cow is does not help.

**Impact:** the intended fix for collecting line three too early can instead strand line three. Engineering another late-game collapse is not a reasonable recovery route.

**Fix:** retain the cow's ordering guard, and open the Coach for unfinished cow business once the player has discovered Jeffrey. Test the sequence “early Coach visit → leave → find line two → return → ride → line three”.

**Source:** `Dream Street Shuffle.twee:42324` (cow guard); `42679` and `42699` (crisis-only hub routes).

### 2. Finding line two closes the Pillars to further dream travel — P1

**Reproduction:** meet the critic, return Page 93, learn about the third pillar, and collect line two. Carry a key for a world not yet visited. Return to the map.

**Verified:** the Pillars is grey and has no navigation link despite `$inisToldOfPillars = true` and a held lighter. The map correctly reflects the faulty hub gate; it is not a map rendering bug.

**Impact:** taking the optional poem line in a dream can close off the other worlds. Taking line two in the Green Sea can prevent entering the new dream layer at all on that night.

**Fix:** give unfinished dream travel and an available synthesis their own Pillars access condition. Do not tie that access to whether line two is missing. Include pending flowers and other return business in the same review.

**Source:** `42707–42711`; portal entry at `42881`.

### 3. Street exits can permanently abandon unfinished encounter rewards — P1

The new exit is useful, but the completion flags need to distinguish starting an encounter from finishing it.

| Encounter | Reproduced action | What is lost | Cause |
|---|---|---|---|
| Shana | Exit from `Shana Reads`, then return to the map | The Spread and The Wound | `$metShana` is already true, so Trisha's closes; even immediate re-entry offers no Shana link. |
| Ronnie's | Exit from a bar-game result before **Listen** | The Head | `$completedSetlist` is true before `The Set` awards its haunt. With the flower taken, the venue closes; without it, the return still does not resume the set. |
| Davy | Exit before **Listen**, then re-enter the Colony | His advice and the Lackland password route | `$metDavy` is set on arrival, so the bar now offers ordinary drinks rather than the conversation. After entering the Colony, its entrance also bypasses the original cellar-door choice. |
| Painter | Exit from `The Painter's Gaze` before sketching, then re-enter | The sketch activity and napkin portrait | The Sketch haunt is already awarded, so the French moves to the novelist instead. |

**Fix:** add resumable encounter stages, or defer the flags which remove their entry links until the last required action. Simply reopening the venue is insufficient for Shana and Ronnie's: their interior menus must resume unfinished work too. Keep rewards once-only when resuming.

**Source:** `43108`, `43370`, `43395`, `43868`, `43880`, `43889`, `42350`, `45854`, `46104`, `45939`. Exit dispatcher: `47350`.

### 4. A late collapse with a complete poem shuts every venue, including recovery — P1

**Reproduction:** complete the alba, have at least ten haunts, and reach zero sobriety. Return to Dean Street.

**Verified:** the hub sets `$coachUrgent`, removes the normal venue links, but suppresses the Coach crisis link because `_towerReady` is true. Only the dawn destination remains among the main venues. A second fixture at sobriety 40 with the same latched crisis flag still has all venues shut.

**Impact:** this contradicts the promise that the player can continue exploring after completing the poem. Doorway healing does not clear the flag; the normal clearing action is inside the now-inaccessible Coach.

**Fix:** always retain the crisis recovery route, including after poem completion, and decide explicitly when recovered condition clears the crisis state.

**Source:** `42624`, `42679`, `42237–42238`.

### 5. “Play again” deletes the supposedly permanent dream gifts — P1

**Verified in an isolated browser:** stored Himalaya and Nazca gifts, clicked the actual Dawn restart button, then read the gift collection after reload. **Before: two gifts. After: none.**

**Cause:** the button calls `localStorage.clear()` and `sessionStorage.clear()`. The lifetime gift and seen-world systems deliberately use localStorage to survive playthroughs.

**Impact:** the five-gift synthesis cannot accumulate across ordinary replays as designed. The same action also clears unrelated preferences stored on that origin.

**Fix:** clear only this game's current-run save and transient state; preserve the lifetime gift/cycle records and deliberate preferences. Verify a second completed night retains the first night's gifts.

**Source:** `42546`; lifetime design and storage at `200–258`.

## Further structural faults

### 6. A stored key can become unreachable outside a closed venue — P2

**Verified:** a key stored at `Approach Trisha's`, with that location in `$stashSites`, does not keep the approach accessible after Shana is marked met. The map gives the closed venue label, not access to its outside bin. Equivalent conditions exist for other venues that close.

The retrieval passages themselves exist and work; **getting back to the outside location** is the missing part.

**Fix:** separate access to a building's exterior/stash from permission to enter its interior. A closed venue should not prevent collecting something from the bin outside it. Retain the existing chance of a bin being raided.

**Source:** `42721–42731`; stash destination mapping at `61445–61461`.

### 7. The notebook's promised pong rematch disappears after a loss — P2

**Verified:** lose with the stolen notebook at stake, take the result's normal return to Dean Street, and Lackland's is grey. Losing awards The Game, which is the condition that closes his office. If the notebook is stolen after the original pong game, the same gate already blocks this recovery route.

The fence can remain an alternative, but the pong route's “another game” promise is not honoured. This matters most when the player has no expendable keys left.

**Fix:** permit access and a rematch while the notebook is stolen. Do not duplicate the haunt or invitation reward on a retry.

**Source:** `43786`, `43822`, `47196`, `42721–42722`.

### 8. Several dream recognition scenes cannot be reached in their required state — P2

- **Red:** Easter's gift is acquired after meeting Red. His only normal hub invitation requires `$metRed = false`. Verified an Easter return gives no route back to him.
- **The critic:** the Himalaya requires progressing through the critic and Inis first, but the conversation invitation requires `$metCritic = false`. Verified a completed mantra inside the Pillars offers drinks and the shore, but no critic conversation.
- **Inis:** the normal route to the Pyramid requires first receiving Inis's third-pillar tip. That same Page 93 hand-in closes Cecil Court. The later recognition check inside his shop therefore lacks a normal return route.
- **Lackland:** Nazca recognition is similarly unavailable once The Game has closed his office; it is order-dependent rather than universally blocked.

**Fix:** add explicit return business for each newly acquired, unrecognised gift. These are existing scenes to reconnect, not requests for additional prose.

**Source:** `42672`, `42728`, `42839–42847`, `45764`, `42192`, `43662`, `57693–57798`.

### 9. The Colony's famous agent sends the street exit to the French — P2

**Verified:** use the header exit while talking to the famous agent in the Colony. It lands at `Approach The French`.

**Cause:** `Talk to the intimidating agent` carries `venue-french`, although its entry and scene belong to the Colony. The new dispatcher follows that tag, so the older metadata mistake has become a navigation error. It also affects venue-based presentation/audio.

**Fix:** correct the venue tag and check other passage tags against their actual locations.

**Source:** `45800`; exit dispatcher at `47350`.

## Suggested fixing order

1. Restore essential access: Coach/line three, Pillars/dream travel, complete-poem crisis recovery.
2. Make interrupted encounters resumable without duplicating rewards.
3. Preserve lifetime progress on replay.
4. Reconnect stored-key retrieval, notebook rematches and dream recognition visits.
5. Correct the Colony agent tag, then run one ordinary start-to-dawn playthrough and a second-night gift check.

The central implementation principle is to distinguish **discovered**, **in progress**, **finished**, and **has new business**. One `met` or `completed` flag should not decide all four.

## Limits and things not to “fix” automatically

- Repeated doorway recovery is an explicit user-approved design in the source comments. It is not an exploit to remove.
- Deliberately refusing the dual ring ends the night; that is distinct from the accidental access failures above.
- Mixed flat/proportional dream-world stat arithmetic is a balance decision, not by itself a broken route.
- I did not replay every minigame to every score outcome, listen through every audio bed, or visually re-audit every 3D composition. Their scripts pass syntax checks; that is not a claim of exhaustive runtime correctness.
- All reported browser scenarios completed without Harlowe error elements. One fast-navigation Ronnie result test logged transient null-property JavaScript errors; their cause has not been established, so they are not presented as an additional confirmed player-facing bug.
- The once-only Aoife-memory follow-up did not reproduce a repeated-memory problem. Extra “Back to Dean Street” test actions on the doorways found no link because those passages automatically return; the state remained correct.

Some faults may predate today's work. The new exits and cow guard clearly expose interactions that the earlier audit did not cover; this report does not assign authorship without a history comparison.
