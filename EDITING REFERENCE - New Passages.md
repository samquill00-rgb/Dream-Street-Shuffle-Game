# Dream Street Shuffle — Editing Reference

All the text marked **YOUR TEXT** below is safe to rewrite freely.
Everything marked **SYNTAX — DON'T TOUCH** must stay exactly as it is for the game to work.

---

## 1. PHONE CALL — Ronnie Scott's trigger

This is inside the `Ronnie Scott's` passage. It controls when the phone rings.

```
SYNTAX — DON'T TOUCH:
(if: $hadPhoneCall is false and $confidence < 60)[

YOUR TEXT (what the player sees when the phone rings):
The phone behind the bar rings. The barman holds it up and mouths your name.

The trumpeter watches. Moe de Alcousin stops tuning.

SYNTAX — DON'T TOUCH (these are the two choices):
[[Answer it|RS Phone Call]]
[[Let it ring|RS Ignore Call]]]
```

Note: you can change the link text ("Answer it", "Let it ring") but NOT what comes after the `|` — those are passage names.

---

## 2. PHONE CALL — Answer (RS Phone Call)

```
SYNTAX — DON'T TOUCH:
:: RS Phone Call [venue-ronnies] {"position":"2100,1600","size":"100,100"}
(set: $hadPhoneCall to true)
(set: $confidence to $confidence - 5)

YOUR TEXT (the whole phone conversation and being locked out):
You take it at the foot of the stairs, one hand over your ear against the bass.

It's Aoife.

'The heating's gone. Will you be home soon? She won't leave-off crying.'

'Later tonight.'

'Much later?'

'Yes. Goodnight. I love you.'

She hangs up. You stand there with the receiver still warm against your face. The music downstairs continues without you.

When you turn back the door has closed and a man in a dinner jacket shakes his head. 'Between sets, mate. No re-entry.'

SYNTAX — DON'T TOUCH:
[[Back to the street|Dean Street]]
```

---

## 3. PHONE CALL — Ignore (RS Ignore Call)

```
SYNTAX — DON'T TOUCH:
:: RS Ignore Call [venue-ronnies] {"position":"2200,1600","size":"100,100"}
(set: $ignoredCall to true)

YOUR TEXT (what happens when you let it ring):
You let it ring. The barman shrugs, puts it down. Whoever it was will try again, or they won't.

Something tightens in your chest and stays there.
```

After this, the passage continues with the original musician descriptions (which are your existing text, unchanged).

---

## 4. PHONE CALL — Dawn ending addition

This appears in the `Dawn` passage, right after the existing `$hadPhoneCall` block:

```
SYNTAX — DON'T TOUCH:
(if: $ignoredCall is true)[

YOUR TEXT:
There was a call you didn't take. The phone rang in a jazz club and you let it ring. She'll never mention it and you'll never stop hearing it.

SYNTAX — DON'T TOUCH:
]
```

---

## 5. PROSE FLICKERS — Dean Street

These appear after "In your bag, you have your novel in manuscript. You need to sell it, pronto."

Each line is wrapped in `//` which makes it italic in Harlowe.

### Sobriety flickers (one shows at a time)

```
SYNTAX — DON'T TOUCH:
(if: $sobriety >= 30 and $sobriety < 50)[

YOUR TEXT:
//(The pavement has opinions about your feet. You negotiate.)//

SYNTAX — DON'T TOUCH:
](else-if: $sobriety >= 15 and $sobriety < 30)[

YOUR TEXT:
//(Everything is too loud and too close, even the silence.)//

SYNTAX — DON'T TOUCH:
](else-if: $sobriety >= 50 and $sobriety < 70)[

YOUR TEXT:
//(The streetlamps have started to breathe, or is that you?)//

SYNTAX — DON'T TOUCH:
]\
```

### Confidence flickers (one shows at a time)

```
SYNTAX — DON'T TOUCH:
(if: $confidence >= 30 and $confidence < 50)[

YOUR TEXT:
//(Every lit window is a room you weren't invited into.)//

SYNTAX — DON'T TOUCH:
](else-if: $confidence >= 15 and $confidence < 30)[

YOUR TEXT:
//(You keep touching your bag to check the book's still there, as if it might have left you too.)//

SYNTAX — DON'T TOUCH:
](else-if: $confidence >= 50 and $confidence < 70)[

YOUR TEXT:
//(The manuscript in your bag feels heavier than paper should.)//

SYNTAX — DON'T TOUCH:
]\
```

### What each range means

| Range | Sobriety meaning | Confidence meaning |
|-------|------------------|--------------------|
| 70+ | Sober — no flicker | Confident — no flicker |
| 50–69 | Mildly tipsy | Starting to doubt |
| 30–49 | Properly drunk | Shaken |
| 15–29 | Nearly gone | Nearly broken |
| Below 15 | No flicker (other systems take over) | No flicker (game-over territory) |

---

## 6. REACTIVE DREAMS — Coast of Carthage

These appear after "You think about that still, sometimes, in England." and before "You see two paths:"

```
SYNTAX — DON'T TOUCH:
(if: $wasBeaten is true)[

YOUR TEXT (player fought Copper):
Among the Romans you spot a man with hands like geography. He doesn't see you but you feel the bruise remember him.

SYNTAX — DON'T TOUCH:
]
(if: $metShana is true)[

YOUR TEXT (player met Shana at Trisha's):
A woman sits apart from the others, reading a scroll. She looks up once. Her judgement crosses centuries.

SYNTAX — DON'T TOUCH:
]
(if: $metRed is true)[

YOUR TEXT (player met Red on the corner):
Someone has scratched French verse into a pillar. The handwriting is familiar.

SYNTAX — DON'T TOUCH:
]
```

---

## 7. REACTIVE DREAMS — Dido

These appear after Dido's dialogue ("Rest here and think no more about your England.") and before the page-rescue section:

```
SYNTAX — DON'T TOUCH:
(if: $wasBeaten is true and $fightScore >= 4)[

YOUR TEXT (player WON the fight):
The flames remind you of something — a cellar, a man kneeling, blood on his lip like punctuation. You won that one.

SYNTAX — DON'T TOUCH:
]
(else-if: $wasBeaten is true)[

YOUR TEXT (player LOST the fight):
The smoke finds your bruises and settles there, sympathetic.

SYNTAX — DON'T TOUCH:
]
(if: $ignoredCall is true)[

YOUR TEXT (player ignored the phone at Ronnie Scott's):
From somewhere in the flames, a phone rings. You don't answer it. Again.

SYNTAX — DON'T TOUCH:
]
(else-if: $hadPhoneCall is true)[

YOUR TEXT (player answered the phone):
From somewhere in the flames, a phone rings. You know who it is. You always know.

SYNTAX — DON'T TOUCH:
]
```

---

## 8. REACTIVE DREAMS — The Green Sea (LINE 2)

These appear after the bar description and before "At the back round the second biggest table..."

```
SYNTAX — DON'T TOUCH:
(if: $wasBeaten is true)[

YOUR TEXT (player fought Copper):
You notice your hands are shaking. The old men at their cards pretend not to see.

SYNTAX — DON'T TOUCH:
]
(if: $hasTrishaMatchbook is true)[

YOUR TEXT (player has the Trisha's matchbook):
In your pocket, the matchbook from Trisha's. Even here, it smells of smoke and bass notes.

SYNTAX — DON'T TOUCH:
]
```

---

## 9. ALLEY — Dean Street navigation option

In the `Dean Street` passage, this controls when the alley appears:

```
SYNTAX — DON'T TOUCH:
(if: $seenAlley is false and $metRed is true and $haunts's length >= 4)[

YOUR TEXT (what the player sees as a navigation option):
Raised voices down an alley. You know both of them.

SYNTAX — DON'T TOUCH:
[[Investigate|An Alley off Dean Street]]
](else-if: $seenAlley is true)[

YOUR TEXT (greyed out after visiting):
<span class="greyed-out">The alley is quiet now.</span>

SYNTAX — DON'T TOUCH:
]\
```

---

## 10. ALLEY — Main passage (An Alley off Dean Street)

```
SYNTAX — DON'T TOUCH:
:: An Alley off Dean Street {"position":"800,500","size":"100,100"}
(set: $seenAlley to true)
(set: $exploredSinceFrench to true)

YOUR TEXT (opening — always shown):
Down a passage between a tailor's and a bookmaker's, two men stand close enough to fight but haven't yet. Their voices reach you before their faces do.

SYNTAX — DON'T TOUCH:
(if: $alba contains $alba1)[

YOUR TEXT (if Red gave you the first alba line):
'—handing out verse like handbills,' says the taller one. 'To strangers. To anyone who'll hold still long enough.'

'It's not yours to keep, John. It never was.'

SYNTAX — DON'T TOUCH:
]
(else:)[

YOUR TEXT (if Red hasn't given you the line yet):
'—wouldn't know a couplet from a shopping list,' says the taller one.

'And you'd frame the shopping list and call it English.'

SYNTAX — DON'T TOUCH:
]

YOUR TEXT (always shown):
It's Red and John St. John, and they are deep in it.

SYNTAX — DON'T TOUCH:
(if: $haunts contains $haunt4)[

YOUR TEXT (if you drank with St. John):
Red sees you first. 'He's bought you, then. A double whisky and you're his.'

John St. John doesn't turn. 'I don't buy people, Red. I drink with them. You wouldn't know the difference.'

SYNTAX — DON'T TOUCH:
]
(if: $wasBeaten is true)[

YOUR TEXT (if you fought Copper):
Red clocks your face. 'Christ, who decorated you?'

'Copper,' you say, or don't say; it doesn't matter. They both know.

SYNTAX — DON'T TOUCH:
]
(if: $knowsLackland is true)[

YOUR TEXT (if you know about Lackland):
Someone mentions Lackland's name. Both men go quiet, as if a draught has passed through the alley.

SYNTAX — DON'T TOUCH:
]

SYNTAX — DON'T TOUCH (these are the three choices — you can change the link text before the |):
[[Step between them|Alley Step In]]
[[Walk past|Alley Walk Past]]
[[Listen from the shadows|Alley Listen]]
```

---

## 11. ALLEY — Step In

```
SYNTAX — DON'T TOUCH:
:: Alley Step In {"position":"800,600","size":"100,100"}
(set: $confidence to $confidence + 5)

YOUR TEXT (entire passage):
'Enough,' you say, or something like it. The word doesn't matter; what matters is that you're standing between two men who've been circling each other for a decade, and for a moment they both look at you instead.

Red laughs first. It's a generous laugh, the laugh of a man who's lost the argument and doesn't care.

'The peacemaker,' says John St. John. 'There's no future in it.'

They part like weather. Red heads toward Greek Street; John St. John buttons his coat and walks the other way, toward the French, where he'll drink alone and call it thinking.

SYNTAX — DON'T TOUCH:
[[Back to the street|Dean Street]]
```

---

## 12. ALLEY — Walk Past

```
SYNTAX — DON'T TOUCH:
:: Alley Walk Past {"position":"900,600","size":"100,100"}
(set: $sobriety to $sobriety - 3)

YOUR TEXT (entire passage):
You keep walking. Their voices trail behind you like smoke from a match, thin and acrid.

'—the trouble with your lot,' John St. John is saying, 'is that you think difficulty is the same as depth—'

You don't hear Red's reply. You don't need to. You've heard this argument before, in other mouths, in your own mouth, in the gap between what you write and what you meant to write.

You stop at the next corner and buy something from a man who's selling something. It doesn't help.

SYNTAX — DON'T TOUCH:
[[Back to the street|Dean Street]]
```

---

## 13. ALLEY — Listen

```
SYNTAX — DON'T TOUCH:
:: Alley Listen {"position":"700,600","size":"100,100"}

YOUR TEXT (entire passage):
You press yourself against the brickwork and listen. The mortar is cold against your shoulder. Overhead, a window opens and closes like a thought someone decided not to have.

'You know what your problem is?' says John St. John. 'You think the poem exists before the poet. You think it's out there, in the French or the German, waiting to be found. But it's not. It's made. In English. By an Englishman. With his hands and his nerves and his bloody-minded refusal to be continental about it.'

Red says nothing for a long time. Then: 'And you know what yours is? You think the poem belongs to the poet. But it doesn't. It belongs to whoever needs it. That's why I gave the line away.'

They fall quiet. You hear a match strike, a long inhale, and then footsteps heading in opposite directions.

Neither of them knows you were there.

SYNTAX — DON'T TOUCH:
[[Back to the street|Dean Street]]
```

---

## Quick rules

- Change anything marked YOUR TEXT
- Don't change passage names after the `|` in links (e.g. `|Dean Street]]`)
- Don't change `(if:)`, `(else:)`, `(else-if:)`, `(set:)` lines
- Don't change variable names like `$wasBeaten`, `$hadPhoneCall`, etc.
- Don't remove or add `[` or `]` brackets
- You CAN change the visible link text before the `|` (e.g. "Back to the street" could become "Return to Dean Street")
- Keep `//text//` if you want italics, remove the `//` if you don't
- The `<span class="greyed-out">` tag makes text appear faded — keep the tag, change the words inside
