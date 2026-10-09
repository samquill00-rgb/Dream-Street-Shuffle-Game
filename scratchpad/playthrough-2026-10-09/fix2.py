import io
F="Dream Street Shuffle.twee"
s=io.open(F,encoding="utf-8").read()
def rep(old,new,n=1):
    global s
    c=s.count(old); assert c==n,(c,old[:90])
    s=s.replace(old,new)
VENUES = {
 "Coach and Horses bar": "Coach and Horses bar",
 "Entering The Pillars of Hercules": "Entering The Pillars of Hercules",
 "Ronnie Scott's": "Ronnie Scott's",
 "The Colony Room": "The Colony Room",
 "The French": "The French",
}
# 1. Each Lily refusal: snooze the ring for this visit, step back to the bar (not the street).
OLD_LILY = """(link: "I’m not here")[(set: $confidence to ($statLoss: $confidence, 3))(unless: $refusedCalls is a num)[(set: $refusedCalls to 0)](set: $refusedCalls to $refusedCalls + 1)(replace: ?lilyring)[What would LILY want with you? You couldn’t speak to her now, you are not ready.
(if: $refusedCalls is 2)[<div class="glass-pane">(display: "Fetch Window SVG")</div>]
[[Back to the street|Dean Street]]]]]</div>]"""
assert s.count(OLD_LILY) == 5
import re
for v in VENUES:
    a = s.index("\n:: %s [" % v)
    b = s.index("\n:: ", a + 5)
    body = s[a:b]
    assert body.count(OLD_LILY) == 1, v
    new = OLD_LILY.replace("(set: $refusedCalls to $refusedCalls + 1)(replace: ?lilyring)", "(set: $refusedCalls to $refusedCalls + 1)(set: $ringSnoozed to true)(set: $resumingFromCall to true)(replace: ?lilyring)") \
                  .replace("[[Back to the street|Dean Street]]]]]</div>]", "[[Back to the bar|%s]]]]]</div>]" % v)
    s = s[:a] + body.replace(OLD_LILY, new) + s[b:]
# 2. The Pillars' Aoife ring refusal, the same way.
rep("""(set: $refusedCalls to $refusedCalls + 1)(replace: ?aoifering)[The barman looks you over utterly neutrally. He wishes he wasn’t paid to be part of this game. ‘Not seen him,’ he says, and puts back the receiver.
(if: $refusedCalls is 2)[<div class="glass-pane">(display: "Fetch Window SVG")</div>]
[[Back to the street|Dean Street]]]]]</div>]""",
"""(set: $refusedCalls to $refusedCalls + 1)(set: $ringSnoozed to true)(set: $resumingFromCall to true)(replace: ?aoifering)[The barman looks you over utterly neutrally. He wishes he wasn’t paid to be part of this game. ‘Not seen him,’ he says, and puts back the receiver.
(if: $refusedCalls is 2)[<div class="glass-pane">(display: "Fetch Window SVG")</div>]
[[Back to the bar|Entering The Pillars of Hercules]]]]]</div>]""")
# 3. Ring conditions honour the snooze (Lily rings in five venues, Aoife ring in the Pillars).
rep("(set: _lilyRing to ($lilyCount >= 1", "(set: _lilyRing to ($ringSnoozed is not true and $lilyCount >= 1", 4)
rep("(set: _lilyRing to (_pillarsOpen and $lilyCount >= 1", "(set: _lilyRing to ($ringSnoozed is not true and _pillarsOpen and $lilyCount >= 1")
rep("""(if: $hadPhoneCall is false)[<div class="phone-ringing">Behind the bar a phone rings and your name is called.""",
    """(if: $hadPhoneCall is false and $ringSnoozed is not true)[<div class="phone-ringing">Behind the bar a phone rings and your name is called.""")
# 4. The hub clears the snooze: the next lap, the phone may ring again.
rep("""(if: $alleyReturn is true)[(set: $alleyReturn to false)](else:)[(set: $returns to $returns + 1)]""",
    """(if: $alleyReturn is true)[(set: $alleyReturn to false)](else:)[(set: $returns to $returns + 1)](set: $ringSnoozed to false)""")
# 5. The Colony charged its 9 sobriety on every entry; stepping back from the phone is not an entry
#    (the Pillars and Ronnie's already skip the cost when $resumingFromCall is set).
rep("""(set: _firstColony to not ($visited is a datamap and $visited contains "Colony" and $visited's Colony is true))\\
(set: $sobriety to ($statLoss: $sobriety, 9))\\""",
"""(set: _firstColony to not ($visited is a datamap and $visited contains "Colony" and $visited's Colony is true))\\
(if: $resumingFromCall is true)[(set: $resumingFromCall to false)](else:)[(set: $sobriety to ($statLoss: $sobriety, 9))]\\""")
io.open(F,"w",encoding="utf-8").write(s)
print("ok")
