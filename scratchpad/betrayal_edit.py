import re, sys
p = "Dream Street Shuffle.twee"
s = open(p, encoding="utf-8").read()
def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, (n, old[:70])
    s = s.replace(old, new)

# 1. variables in both init passages
rep("(set: $wasBeaten to false)\\\n", "(set: $wasBeaten to false)\\\n(set: $crossed to \"\")\\\n(set: $savedBy to \"\")\\\n", 2)

# 2. header back-fill for old saves
rep("(unless: $knowsCecilCourt is a boolean)[(set: $knowsCecilCourt to false)]\\\n",
    "(unless: $knowsCecilCourt is a boolean)[(set: $knowsCecilCourt to false)]\\\n"
    "<!-- 2026-09-28 betrayal fork: $crossed = who you turned on tonight (\"\", \"ashton\" = broke the agreement, \"red\" or \"john\" = gave Copper the name); $savedBy = who got you out of the cellar (\"john\", \"ashton\", \"nobody\"), set in Beaten / Standing. -->\\\n"
    "(unless: $crossed is a string)[(set: $crossed to \"\")](unless: $savedBy is a string)[(set: $savedBy to \"\")]\\\n")

# 3. the cellar: Ashton's line and the choices
ashton = "You agreed long ago to pretend not to notice each other, should you accidentally meet."
i = s.index(ashton); j = s.index("\n", i)
s = s[:j] + "\n<div class=\"claude-draft\">[Sam: her side of it. What Ashton was to you and to John, in the one look you are not supposed to give her.]</div>" + s[j:]
rep("(else:)[[[Say nothing|Copper confronts]]]\n</div>\n",
    "(else:)[[[Say nothing|Copper confronts]]]\n"
    "<!-- 2026-09-28 betrayal fork: one crossing per night; each name is offered only once that man has already given his gift (Red the kiss, John the Debt). -->\n"
    "(if: $crossed is \"\")[\n"
    "<div class=\"claude-draft\">[[Break the agreement. Look at her.|You notice her]]</div>\n"
    "(if: $metRed is true)[<div class=\"claude-draft\">[[Give him Red's name|You give him Red]]</div>]\n"
    "(if: $haunts contains $haunt4)[<div class=\"claude-draft\">[[Give him John's name|You give him John]]</div>]\n"
    "]\n</div>\n")

# bulb block copied from Copper confronts
m = re.search(r":: Copper confronts .*?\n(.*?)(<div class=\"cellar-scene\">)", s, re.S)
bulb = m.group(1).split("(set: $awaitingCopperPwd to false)\\\n",1)[1]
def cellar(name, setline, draft, link):
    return (f":: {name} [venue-cellar char-salvu] {{\"position\":\"1900,700\",\"size\":\"100,100\"}}\n"
            f"{setline}\\\n{bulb}<div class=\"cellar-scene\">\n<div class=\"cellar-light\"></div>\n"
            f"<div class=\"claude-draft\">{draft}</div>\n\n{link}\n</div>\n\n")
newp = (cellar("You notice her", "(set: $crossed to \"ashton\")",
               "[Sam: you look at her. Copper sees you look. What she does with her face; what he does with his.]",
               "[[Brace yourself|Fight starts]]")
      + cellar("You give him Red", "(set: $crossed to \"red\")",
               "[Sam: you give Copper Red's name. What Copper makes of it, and Ashton, who knows Red too.]",
               "[[Brace yourself|Fight starts]]")
      + cellar("You give him John", "(set: $crossed to \"john\")",
               "[Sam: you give Copper John's name. The debt turned into a coin. Ashton hears it.]",
               "[[Brace yourself|Fight starts]]"))
rep(":: Watch the decider ", newp + ":: Watch the decider ")

# 4. Beaten
old_b = """(set: $wasBeaten to true)
'I don't talk to liars,' he roars, when a voice hollers from the staircase:

'Salvu! Leave it! He's alright.' It's John St. John. 'I know him. I don't like the bloke but he's sound.'

St. John's face is legible only to you, who once knew him so well. He's both amused at your straits and miffed that it falls upon him once again to rescue you.

(if: $metRed is true)[He leans close as he pulls you to your feet: 'Red told Copper you had money.' You're lucky, you reflect, that Copper could work out you don't.]

(if: $knowsCopperWord)[Copper turns his back.

'Well,' says John. 'That went better than anyone expected.'

[[Back to Dean Street|The dark pass]]]
(else:)[[[He has something to tell you|St. John's Word]]]
</div>
"""
new_b = """(set: $wasBeaten to true)
(if: $crossed is "john")[(set: $savedBy to "nobody")](else-if: $crossed is "ashton")[(set: $savedBy to "ashton")](else:)[(set: $savedBy to "john")]\\
(if: $savedBy is "john")[
'I don't talk to liars,' he roars, when a voice hollers from the staircase:

'Salvu! Leave it! He's alright.' It's John St. John. 'I know him. I don't like the bloke but he's sound.'

St. John's face is legible only to you, who once knew him so well. He's both amused at your straits and miffed that it falls upon him once again to rescue you.

(if: $metRed is true and $crossed is not "red")[He leans close as he pulls you to your feet: 'Red told Copper you had money.' You're lucky, you reflect, that Copper could work out you don't.]
(if: $crossed is "red")[<div class="claude-draft">[Sam: John has heard what you did with Red's name. For once he is pleased with you.]</div>]

(if: $knowsCopperWord)[Copper turns his back.

'Well,' says John. 'That went better than anyone expected.'

[[Back to Dean Street|The dark pass]]]
(else:)[[[He has something to tell you|St. John's Word]]]
](else-if: $savedBy is "ashton")[
<div class="claude-draft">[Sam: Copper roars. Nobody on the stairs. Ashton stops it: whatever she says to Copper that makes him step back, and what it costs her.]</div>

<div class="claude-draft">[[Up the stairs|The dark pass]]</div>
](else:)[(set: $confidence to ($statLoss: $confidence, 12))
<div class="claude-draft">[Sam: Copper roars. Nobody on the stairs, and nobody coming. You crawl to them, or Frankie carries you. The debt stands.]</div>

<div class="claude-draft">[[Up the stairs|The dark pass]]</div>
]
</div>
"""
rep(old_b, new_b)

# 5. Standing
old_s = """And through the door, leaning its knackered frame against his own, is John St. John.

'You lead a charmed life,' he says.

John falls in beside you as you push out onto Dean Street: 'Red told Copper you had money.'

You're lucky, you reflect, that he worked out you don't.

[[Back to Dean Street|The dark pass]]
</div>
"""
new_s = """(if: $crossed is "john")[(set: $savedBy to "nobody")](else-if: $crossed is "ashton")[(set: $savedBy to "ashton")](else:)[(set: $savedBy to "john")]\\
(if: $savedBy is "john")[
And through the door, leaning its knackered frame against his own, is John St. John.

'You lead a charmed life,' he says.

(if: $metRed is true and $crossed is not "red")[John falls in beside you as you push out onto Dean Street: 'Red told Copper you had money.'

You're lucky, you reflect, that he worked out you don't.](else-if: $crossed is "red")[<div class="claude-draft">[Sam: John falls in beside you. He has heard what you did with Red's name, and for once he is pleased with you.]</div>](else:)[<div class="claude-draft">[Sam: John falls in beside you. What he says when there is no Red to blame it on.]</div>]

[[Back to Dean Street|The dark pass]]
](else-if: $savedBy is "ashton")[
<div class="claude-draft">[Sam: nobody in the doorway. Behind you, down the stairs, Ashton is saying something to Copper, and it is the reason he called after you instead of coming.]</div>

<div class="claude-draft">[[Out onto Dean Street|The dark pass]]</div>
](else:)[
<div class="claude-draft">[Sam: nobody in the doorway. You are out on your own, and the debt stands.]</div>

<div class="claude-draft">[[Out onto Dean Street|The dark pass]]</div>
]
</div>
"""
rep(old_s, new_s)

# 6. The dark pass
old_d = """<div class="typewriter-page">
You watch John St. John throw off his tail in the darkness, then surface again at the far end of the street, in the pool where the ginger light shines.

Just as he does, Red walks into the frame, hands deep in his pockets; fag in his mouth, swaying like a conductor's baton.

It seems, almost, like Red wants to speak to John, who doesn't want to speak to anybody, and so ploughs his long stride deeper and into the night.

[[Dean Street|Dean Street]]
</div>
"""
new_d = """<div class="typewriter-page">
(if: $savedBy is "john" and $crossed is not "red")[You watch John St. John throw off his tail in the darkness, then surface again at the far end of the street, in the pool where the ginger light shines.

Just as he does, Red walks into the frame, hands deep in his pockets; fag in his mouth, swaying like a conductor's baton.

It seems, almost, like Red wants to speak to John, who doesn't want to speak to anybody, and so ploughs his long stride deeper and into the night.
](else-if: $savedBy is "john")[<div class="claude-draft">[Sam: John throws off his tail and surfaces under the ginger light. Nobody walks into the frame. Red is not on the street tonight, and John knows why.]</div>
](else-if: $metRed is true and $crossed is not "red")[<div class="claude-draft">[Sam: no John. Red walks into the frame under the ginger light alone, hands in his pockets, and looks back down the street at where you came from.]</div>
](else:)[<div class="claude-draft">[Sam: no John, no Red. The ginger light shines on an empty street.]</div>
]
[[Dean Street|Dean Street]]
</div>
"""
rep(old_d, new_d)

# 7. Colony
rep("(if: $metRed is true)[As you walk in, Red is leaving; you hold each other's eyes, like dutchy pearls, and then he's gone.]]",
    "(if: $metRed is true and $crossed is not \"red\")[As you walk in, Red is leaving; you hold each other's eyes, like dutchy pearls, and then he's gone.](else-if: $crossed is \"red\")[<div class=\"claude-draft\">[Sam: Red is not here. What the room has instead of him.]</div>]]")

# 8. notebook trace against the Debt
rep("(if: $haunts contains $haunt4)[(set: _nb to _nb + '<div class=\"nb-item\"><span class=\"hp hp-done\">◆</span> ' + $haunt4 + ' <span class=\"haunt-stage haunt-stage-coniunctio\">(Coniunctio)</span></div>')]",
    "(set: _debtTrace to \"\")(if: $crossed is \"john\")[(set: _debtTrace to ' <span class=\"claude-draft nb-debt-trace\">[Sam: sold]</span>')]"
    "(if: $haunts contains $haunt4)[(set: _nb to _nb + '<div class=\"nb-item\"><span class=\"hp hp-done\">◆</span> ' + $haunt4 + ' <span class=\"haunt-stage haunt-stage-coniunctio\">(Coniunctio)</span>' + _debtTrace + '</div>')]")

# 9. tarot: a crossing weights Judgement into what awaits
rep("(if: $returnedPage is true)[(set: _p3 to _p3 + (a: \"Justice\", \"Justice\", \"Justice\"))]\n",
    "(if: $returnedPage is true)[(set: _p3 to _p3 + (a: \"Justice\", \"Justice\", \"Justice\"))]\n"
    "(if: $crossed is not \"\")[(set: _p3 to _p3 + (a: \"Judgement\", \"Judgement\", \"Judgement\", \"Judgement\"))]\n")

# 10. the French: the wound named
rep("His slate eyes shine like slate does after cold rain.\n",
    "His slate eyes shine like slate does after cold rain.\n\n<div class=\"claude-draft\">[Sam: John names the woman. The personal business, said out loud over the whisky-sodas: Ashton, and what you did.]</div>\n")

open(p, "w", encoding="utf-8").write(s)
print("edits applied")
