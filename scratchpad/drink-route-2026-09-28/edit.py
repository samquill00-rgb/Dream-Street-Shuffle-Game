import re, sys
F = "Dream Street Shuffle.twee"
s = open(F, encoding="utf-8").read()
orig = s
def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, (n, count, old[:90])
    s = s.replace(old, new)

PINK = 'claude-draft'
# 1. StoryInit variables
rep('(set: $savedBy to "")\\\n', '(set: $savedBy to "")\\\n(set: $drinksTonight to 0)\\\n(set: $blackouts to 0)\\\n(set: $lostToDrink to (a:))\\\n(set: $blackedOut to false)\\\n', 2)

# 2. every drink link: count the drink, cut to the Blackout at 10 or under
pat = re.compile(r'\(set: \$drinksRound to \$drinksRound \+ 1\)\(go-to: "([^"]+)"\)\]')
assert len(pat.findall(s)) == 10
s = pat.sub(lambda m: '(set: $drinksRound to $drinksRound + 1)(set: $drinksTonight to $drinksTonight + 1)(if: $sobriety <= 10)[(go-to: "The Blackout")](else:)[(go-to: "%s")]]' % m.group(1), s)

# 2b. menus shrink from the third drink in a sitting: one pink "one more" per venue
def onemore(target, extra=''):
    return ('(if: $drinksRound >= 3)[<div class="%s">[Sam: from the third drink the menu goes. One link, in your words, and the room\'s answer to it.]</div>\n'
            '<div class="%s">(link: "[Sam: one more]")[%s(set: $sobriety to ($statLoss: $sobriety, 8 + $drinksRound * 5))(set: $confidence to ($statGain: $confidence, 5 + $drinksRound * 2))(set: $drinksRound to $drinksRound + 1)(set: $drinksTonight to $drinksTonight + 1)(if: $sobriety <= 10)[(go-to: "The Blackout")](else:)[(go-to: "%s")]]</div>](else:)[\n' % (PINK, PINK, extra, target))
# French
rep('<div class="drink-menu french-drinks">\n(link: "Beaujolais")', '<div class="drink-menu french-drinks">\n' + onemore("The French", '(set: $drankAtFrench to true)(set: $justDranked to true)') + '(link: "Beaujolais")')
i = s.index('(link: "Breton Cidre")'); j = s.index('\n', i)
s = s[:j] + ']' + s[j:]
# Colony
rep('<div class="drink-menu colony-drinks">\n(link: "Vodka tonic")', '<div class="drink-menu colony-drinks">\n' + onemore("Colony drink") + '(link: "Vodka tonic")')
i = s.index('(link: "Beer")[(set: $lastDrink to "beer")'); j = s.index('\n', i)
s = s[:j] + ']' + s[j:]
# Pillars
rep('(link: "Stout")[(set: $lastDrink to "stout")', onemore("Entering The Pillars of Hercules", '(set: $justDranked to true)(set: $resumingFromCall to true)') + '(link: "Stout")[(set: $lastDrink to "stout")')
i = s.index('(link: "Mild")[(set: $lastDrink to "mild")'); j = s.index('\n', i)
s = s[:j] + ']' + s[j:]

# 3. The Blackout and The Wall (new passages), before the Dream Progress passage at the end
NEW = '''
:: The Blackout [outdoor street-night] {"position":"2300,1450","size":"100,100"}
<!-- 2026-09-28 drink route: any drink that leaves sobriety at 10 or under cuts here instead of back to the bar. First blackout: the Coach gents with Retch and Sleep. Second: sleep only. The dual-ring crash also counts one. Pink is Sam's. -->\\
(set: $blackouts to $blackouts + 1)\\
(set: $blackedOut to true)\\
(set: $drinksRound to 0)\\
(set: $justDranked to false)\\
(set: $resumingFromCall to false)\\
(set: $confidence to ($statLoss: $confidence, 30))\\
<div class="typewriter-page">
<div class="claude-draft">(if: $blackouts is 1)[[Sam: the walk you do not remember. The glass goes down and the street comes up somewhere else. Dean Street seen from the gutter, the ginger light doubled.]](else:)[[Sam: again. You knew this one was coming and you drank it anyway. This time the street does not bother to show you the way.]]</div>
<div class="claude-draft">[[Come to|Coach and Horses lock]]</div>
</div>

:: The Wall [venue-pillars] {"position":"500,2250","size":"100,100"}
<!-- 2026-09-28 drink route: under 30 the third pillar refuses you. The key is not spent; the return to the Pillars skips the entry charge and the auto-crossing. Pink is Sam's. -->\\
(set: $pillarsNoAuto to true)\\
(set: $resumingFromCall to true)\\
(unless: $lostToDrink contains "pillar")[(set: $lostToDrink to $lostToDrink + (a: "pillar"))]\\
<div class="pillars-scene">
<div class="claude-draft">[Sam: you walk at the third pillar and meet the wall. The key in your pocket goes cold again. The other two pillars say nothing, as they always have.]</div>
<div class="claude-draft">[[Back to the bar|Entering The Pillars of Hercules]]</div>
</div>
'''
rep('\n:: Dream Progress [system]', NEW + '\n:: Dream Progress [system]')

# 4. Coach and Horses lock
rep('(set: _wasCoachUrgent to $coachUrgent is true)\\\n', '(set: _wasCoachUrgent to $coachUrgent is true)\\\n(set: _blackedOutNow to $blackedOut is true)\\\n(set: $blackedOut to false)\\\n')
rep('(if: $crashedAfterDualRing is true)[<script>setTimeout(function(){ if (window.dssAudio && window.dssAudio.cosmicSewerSuck)', '(if: $crashedAfterDualRing is true or _blackedOutNow)[<script>setTimeout(function(){ if (window.dssAudio && window.dssAudio.cosmicSewerSuck)')
rep('(if: _wasCoachUrgent)[<span class="alba-link-fade">[[Give up. Sleep here.|Alba Incomplete]]</span>\n\n]\\',
    '(if: $blackouts >= 2)[<div class="claude-draft">[Sam: the second time. No retching this one up. The cubicle door, the night on the other side of it, and nothing left in you to open it with.]</div>]\\\n(if: _wasCoachUrgent or $blackouts >= 1)[<span class="alba-link-fade">[[Give up. Sleep here.|Alba Incomplete]]</span>\n\n]\\')
rep('<div class="gents-side-action">(if: $crashedAfterDualRing is true)[(link: "Retch.")[(set: $sobriety to ($statGain: $sobriety, 18))(set: $crashedAfterDualRing to false)',
    '<div class="gents-side-action">(if: ($crashedAfterDualRing is true or _blackedOutNow) and $blackouts < 2)[(link: "Retch.")[(set: $sobriety to ($statGain: $sobriety, 18))(set: $crashedAfterDualRing to false)')
rep('[[You gather your limbs to the bar.|Coach and Horses bar]]', '(if: $blackouts < 2)[[[You gather your limbs to the bar.|Coach and Horses bar]]]')
# the dual-ring crash counts as a blackout
rep('(set: $crashedAfterDualRing to true)(if: $sobriety > 8)', '(set: $crashedAfterDualRing to true)(set: $blackouts to $blackouts + 1)(if: $sobriety > 8)', 2)

# 5. Alba Incomplete
rep('You did not find the poem. Sometimes the night is its own work', '(if: $blackouts >= 1)[<div class="claude-draft">[Sam: the drinker\'s dawn. The cubicle with the sun in it. What you cannot remember of the night and the one thing you can.]</div>\n]You did not find the poem. Sometimes the night is its own work')

# 6. the five lily hooks
def hook_end(start):
    depth = 0
    for k in range(start, len(s)):
        if s[k] == '[': depth += 1
        elif s[k] == ']':
            depth -= 1
            if depth == 0: return k
    raise Exception
for n in range(1, 6):
    key = '(click-replace: ?lily%d)[(set: $lilyCount to $lilyCount + 1)(set: $tookLily%d to true)' % (n, n)
    assert s.count(key) == 1, n
    i = s.index(key)
    open_i = i + len('(click-replace: ?lily%d)' % n)
    end = hook_end(open_i)
    inner = s[open_i+1:end]
    assert inner.startswith('(set: $lilyCount'), inner[:40]
    new_inner = ('(if: $sobriety < 30)[(display: "Lily SVG")(unless: $lostToDrink contains "lily%d")[(set: $lostToDrink to $lostToDrink + (a: "lily%d"))]<span class="lily-glimpse lily-fade claude-draft">[Sam: the flower you cannot hold tonight. She was here. Your hand goes through the glass.]</span>](else:)[(set: $lostToDrink to $lostToDrink - (a: "lily%d"))' % (n, n, n)) + inner + ']'
    s = s[:open_i+1] + new_inner + s[end:]

# 7. the five strangers
for nm, flag, line in [("gooch", "$goochMet", "Helvellyn Gooch is playing trombone on the corner."),
                       ("fetch", "$fetchSeen", "The Fetch was standing in the road. It is not there now."),
                       ("morris", "$morrisMet", "Misty &#39;Morris&#39; Minor is on the corner. You think you met him, and his family, in Carthage."),
                       ("longshanks", "$longshanksMet", "Tom Longshanks, the composer, is on the corner."),
                       ("songstrong", "$songstrongMet", "Guilliam Songstrong, the Welsh singer, is on the corner.")]:
    rep('(set: %s to true)\\\n(set: $confidence to $confidence + 10)\\\n' % flag,
        '(set: %s to true)\\\n(if: $sobriety < 30)[(set: $lostToDrink to $lostToDrink + (a: "%s"))](else:)[(set: $confidence to $confidence + 10)]\\\n' % (flag, nm))
    rep('<div class="claude-draft">\n' + line + '\n', '<div class="claude-draft">\n(if: $sobriety < 30)[[Sam: he thinned as you came, the way the Fetch does, and the corner kept his light. You could not hold him. He will not be back tonight.]](else:)[' + line + ']\n')

# 8. the third pillar refuses a drunk
rep('(if: $inisToldOfPillars is true and $dreamKey is not "" and $pillarsNoAuto is false)[(go-to: "Third Pillar Portal")]',
    '(if: $inisToldOfPillars is true and $dreamKey is not "" and $pillarsNoAuto is false and $sobriety >= 30)[(go-to: "Third Pillar Portal")]')
rep('<div class="choice-box">[[Step through the third pillar|Third Pillar Portal]]</div>',
    '(if: $sobriety < 30)[<div class="choice-box claude-draft">[[Step through the third pillar|The Wall]]</div>](else:)[<div class="choice-box">[[Step through the third pillar|Third Pillar Portal]]</div>]')
rep('(set: $crossedThreshold to true)\\\n<div id="tp-container">', '(set: $crossedThreshold to true)\\\n(set: $lostToDrink to $lostToDrink - (a: "pillar"))\\\n<div id="tp-container">')

# 9. Beaten and Standing
rep('(set: $wasBeaten to true)\n', '(set: $wasBeaten to true)\n(if: $sobriety < 30)[<div class="claude-draft">[Sam: the state you are in on the cellar floor, and what whoever comes down the stairs sees before they see you.]</div>]\n')
rep("You bolt for the stairs. Copper calls after you", '(if: $sobriety < 30)[<div class="claude-draft">[Sam: you bolt drunk. The stairs are not where you left them.]</div>]\nYou bolt for the stairs. Copper calls after you')

# 10. Dean Street hub flag
rep('<span class="dss-hub-flag" data-k="notebook" style="display:none">(print: $notebook)</span>\\',
    '<span class="dss-hub-flag" data-k="notebook" style="display:none">(print: $notebook)</span>\\\n<!-- 2026-09-28 drink route: the stage the map can read. blackout / far / loose / empty. -->\\\n<span class="dss-hub-flag" data-k="drunk" style="display:none">(cond: $sobriety < 10, "blackout", $sobriety < 30, "far", $sobriety < 60, "loose", "")</span>\\')

# 11. header back-fill for old saves
rep('(unless: $crossed is a string)[(set: $crossed to "")](unless: $savedBy is a string)[(set: $savedBy to "")]\\',
    '(unless: $crossed is a string)[(set: $crossed to "")](unless: $savedBy is a string)[(set: $savedBy to "")]\\\n(unless: $drinksTonight is a number)[(set: $drinksTonight to 0)](unless: $blackouts is a number)[(set: $blackouts to 0)](unless: $lostToDrink is an array)[(set: $lostToDrink to (a:))](unless: $blackedOut is a boolean)[(set: $blackedOut to false)]\\')

# 12. notebook section
anchor = "(if: $haunts contains $haunt12)[(set: _nb to _nb + '<div class=\"nb-item\"><span class=\"hp hp-done\">◆</span> ' + $haunt12"
assert s.count(anchor) == 1
i = s.index(anchor); j = s.index("\n(set: _nb to _nb + '</div>')\\\n", i) + len("\n(set: _nb to _nb + '</div>')\\\n")
NB = ("(unless: $lostToDrink is an array)[(set: $lostToDrink to (a:))]"
      "(if: $lostToDrink's length > 0)[(set: _lostNames to (dm: \"lily1\", \"the flower at the chippy\", \"lily2\", \"the flower at the Pillars\", \"lily3\", \"the flower at Ronnie&#39;s\", \"lily4\", \"the flower at the Colony\", \"lily5\", \"the flower at the French\", \"gooch\", \"Helvellyn Gooch\", \"fetch\", \"the Fetch\", \"morris\", \"Misty Morris Minor\", \"longshanks\", \"Tom Longshanks\", \"songstrong\", \"Guilliam Songstrong\", \"pillar\", \"the third pillar\"))"
      "(set: _nb to _nb + '<div class=\"nb-section claude-draft\"><strong class=\"nb-heading\">[Sam: LOST TO DRINK]</strong>')"
      "(for: each _l, ...$lostToDrink)[(if: _lostNames contains _l)[(set: _nb to _nb + '<div class=\"nb-item nb-lost\"><span class=\"lp\">❁</span> <s>' + _lostNames's (_l) + '</s></div>')]]"
      "(set: _nb to _nb + '</div>')]\\\n")
s = s[:j] + NB + s[j:]

# 13. Dawn record
rep('<span class="dawn-count">(print: $haunts\'s length)&thinsp;/&thinsp;12</span></span></div>',
    '<span class="dawn-count">(print: $haunts\'s length)&thinsp;/&thinsp;12</span></span>(if: $lostToDrink is an array and $lostToDrink\'s length > 0)[<span class="dawn-record-item claude-draft"><span class="dawn-count">(print: $lostToDrink\'s length) [Sam: lost to drink]</span></span>]</div>')

open(F, "w", encoding="utf-8").write(s)
print("ok", len(orig), len(s))
