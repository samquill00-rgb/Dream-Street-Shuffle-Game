import re, pathlib
T=pathlib.Path('/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee'); s=T.read_text()
new=pathlib.Path(__file__).with_name('passage.twee').read_text()
assert ":: Trisha's Beer Mats" not in s
# 1 flag init (both places)
old="(set: $houseCardsPlayed to false)"; assert s.count(old)==2
s=s.replace(old, old+"(set: $beerMatsPlayed to false)")
# 2 pink link in Trisha's passage, after the Shana link
a="(if: $metShana is false)[[[Approach Shana|Approach Shana]]]\n"; assert s.count(a)==1
s=s.replace(a, a+"<div class=\"claude-draft\">[[Flip the beer mats on the bar|Trisha's Beer Mats]]</div>\n")
# 3 bar hotspot claims the link
b="{ root: barG, name: 'the bar', pos: [0.8, 1.4, 0.6], tgt: [barX, 1.1, barZ], haloAt: [barX - 0.1, 1.15, barZ], haloSc: 1.6,\n"; assert s.count(b)==1
s=s.replace(b, b+"actions: function() { return k.byText(['Flip the beer mats on the bar']); },\n")
# 4 new passage before Turn to Copper
c="\n:: Turn to Copper [venue-cellar]"; assert s.count(c)==1
s=s.replace(c, "\n"+new.rstrip("\n")+"\n"+c)
T.write_text(s); print("applied")
