import io, sys
F="Dream Street Shuffle.twee"
which = sys.argv[1]
s=io.open(F,encoding="utf-8").read()
def rep(old,new,n=1):
    global s
    c=s.count(old); assert c==n,(c,old[:90])
    s=s.replace(old,new)
if which == "3":
    rep("""(if: $pillarsVisits >= 1)[//Somewhere out past the breakers, an older shore. //
[[Seek the shore|The coast of Carthage]]]""",
"""<!-- 2026-10-09, Sam: "'Seek the shore' should be gated in the pillars until you have spoken to the great ham." The sea-road now waits for the critic, not merely for a first visit. -->
(if: $metCritic is true)[//Somewhere out past the breakers, an older shore. //
[[Seek the shore|The coast of Carthage]]]""")
elif which == "4":
    rep("""and (history:)'s 2ndlast is not "After Aoife")[(set: $sawAoifeMemory2 to true)(go-to: "Aoife memory 2")]\\""",
        """and (history:)'s 2ndlast is not "After Aoife")[(unless: $alleyReturn is true)[(set: $sawAoifeMemory2 to true)(go-to: "Aoife memory 2")]]\\""")
    rep("""<!-- A2: reliable mid-night Aoife memory. Fires on the first hub return from lap 5 onward, AFTER A1 (After Aoife), but NOT on the lap you've just come off a Lily memory ((history:)'s 2ndlast = the passage you arrived from).""",
        """<!-- A2: reliable mid-night Aoife memory. Fires on the first hub return from lap 5 onward, AFTER A1 (After Aoife), but NOT on the lap you've just come off a Lily memory ((history:)'s 2ndlast = the passage you arrived from), and NOT on the way back from a doorway or an alley ($alleyReturn; Sam, 2026-10-09: it fired when he "just stopped in a doorway on the way to Cecil Court").""")
elif which == "5":
    rep("""(if: $afterMidnight is true and $shipCall is "")[[[The phone box|The Phone Box Rings]]]""",
        """(if: $afterMidnight is true and $shipCall is "" and (history:) contains "Turn to Copper")[[[The phone box|The Phone Box Rings]]]""")
    rep("""     all night; that is a choice. "Accept the call" is Sam's, from the venue phones; here the""",
        """     all night; that is a choice. It does not ring until you have been down to COPPER's cellar (Sam, 2026-10-09: "it should not ring until after you have met copper"). "Accept the call" is Sam's, from the venue phones; here the""")
io.open(F,"w",encoding="utf-8").write(s)
print("ok", which)
