from pathlib import Path
import re
p=Path('Dream Street Shuffle.twee');s=p.read_text()
def once(a,b):
 global s
 assert s.count(a)==1,(a[:90],s.count(a));s=s.replace(a,b,1)
# Reset for both fresh-game entry paths; old saves initialise in the progress helper.
for a in ['(set: $keyTicket to "seed")\\\n','(set: $keyCocaine to "seed")(set: $keyTicket to "seed")(set: $keySlip to "seed")(set: $keyLighter to "seed")(set: $keyEye to "seed")\\\n']:
 once(a,a+'(set: $davyPaperAsked to false)(set: $davyTicketPhase to "")(set: $davyTicketReady to false)(set: $davyTicketFragment to false)(set: $easterViaDavy to false)(set: $easterHomeFight to false)\\\n')
once('(display: "Dream Progress")\\\n','(display: "Dream Progress")(display: "Davy Ticket Progress")\\\n')
once("actions: function() { return byText(['Get a drink with the man at the bar']); } },","actions: function() { return byText(['Get a drink with the man at the bar', 'Talk to DAVY']); } },")
once('You’re hushed.\n\n[[Listen|Davy Merkin\'s tip]]','You’re hushed.\n\n(display: "Davy Paper Request")\n(if: $dreamKey is "ticket" and $davyTicketPhase is "")[[[Give him the chippy ticket|Davy takes the ticket]]]\n\n[[Listen|Davy Merkin\'s tip]]')
once('[[Get a drink|Colony drink choice]]]\n(if: $knowsRonnies', '[[Get a drink|Colony drink choice]]]\n<!-- 2026-10-24: DAVY remains reachable for his paper errand, including keys left on his table. -->\\\n(if: $metDavy is true and ($davyTicketPhase is not "returned" or $stashSites contains "Davy’s note"))[[[Talk to DAVY|Davy’s note]]]\n(if: $knowsRonnies')
# The existing swap mechanism leaves the other key on this same, always reachable page.
once('(unless: $stashSites is an array)[(set: $stashSites to (a:))]\n\n:: Bars Now', '(unless: $stashSites is an array)[(set: $stashSites to (a:))]\\\n(set: $stashLabel\'s "Davy’s note" to "with DAVY in the Colony Room")\n\n:: Bars Now')
# Reward survives spending the ticket and is shown in the notebook.
a='(set: _nb to _nb + \'<div class="nb-section nb-inv-section"><strong class="nb-heading nb-inv-heading">EFFECTS</strong>\')\\\n'
svg=re.search(r'<svg class="easter-glyph-svg".*?</svg>',s,re.S)[0]
# Two existing rows of the island glyph, crossed out, with the last row absent.
svg=re.sub(r'viewBox="[^"]+"','viewBox="0 28 240 146"',svg,count=1)
svg=svg.replace('width="220" height="260"','width="240" height="146"',1)
svg=svg.replace('</svg>', '<path d="M23 58 L217 83 M24 132 L216 153" stroke="#a78165" stroke-width="2.2" opacity="0.8"/></svg>')
svg=svg.replace("'",'"')
fragment='<div class="davy-ticket-fragment" role="img" aria-label="Two crossed-out rows from the Rongorongo glyph">'+svg+'</div>'
nb='<div class="nb-inv-item"><div class="nb-inv-name nb-item">◈ DAVY’s ticket</div>'+fragment+'<div class="nb-napkin-caption">A fragment of Rongorongo · the sixth moai.</div></div>'
once(a,a+'(if: $davyTicketFragment is true)[(set: _nb to _nb + \''+nb+'\')]\\\n')
# Island: shortcut is optional; the original fight and flight choices remain.
once('<div class="reclamation-invite">[[Fight|The Reclamation]]</div>\n\n<div>[[Flee|Easter Island Turn-Back]]</div>', '(if: $davyTicketFragment is true)[(link: "Recognise the sixth moai")[(set: $easterViaDavy to true)(go-to: "The Listening Moai")]]\n\n<div class="reclamation-invite">[[Fight|The Reclamation]]</div>\n\n<div>[[Flee|Easter Island Turn-Back]]</div>')
a='[[Down to the boat|Easter Island Return]]\n]\n\n:: Easter Island Return'
once(a,'(if: $easterViaDavy is true and $easterReclaim is not true)[(link: "Help with the Reclamation")[(set: $easterHomeFight to true)(go-to: "The Reclamation")]]\n[[Down to the boat|Easter Island Return]]\n]\n\n:: Easter Island Return')
once('<span id="rc-win" style="display:none;">(link: "Stand before the sixth")[(set: $easterReclaimWon to true)(go-to: "The Listening Moai")]</span>', '<span id="rc-win" style="display:none;">(if: $easterHomeFight is true)[(link: "Down to the boat")[(set: $easterReclaimWon to true)(go-to: "Easter Island Return")]](else:)[(link: "Stand before the sixth")[(set: $easterReclaimWon to true)(go-to: "The Listening Moai")]]</span>')
once('<span id="rc-lose" style="display:none;">[[Stand before the sixth|The Listening Moai]]</span>', '<span id="rc-lose" style="display:none;">(if: $easterHomeFight is true)[[[Down to the boat|Easter Island Return]]](else:)[[[Stand before the sixth|The Listening Moai]]]</span>')
once('[[(skip reclamation — testing)|The Listening Moai]]','(if: $easterHomeFight is true)[[[(skip reclamation — testing)|Easter Island Return]]](else:)[[[(skip reclamation — testing)|The Listening Moai]]]')
s+='''

:: Davy Ticket Progress [system]
{(unless: $davyPaperAsked is a boolean)[(set: $davyPaperAsked to false)]
(unless: $davyTicketPhase is a string)[(set: $davyTicketPhase to "")]
(unless: $davyTicketReady is a boolean)[(set: $davyTicketReady to false)]
(unless: $davyTicketFragment is a boolean)[(set: $davyTicketFragment to false)]
(unless: $easterViaDavy is a boolean)[(set: $easterViaDavy to false)]
(unless: $easterHomeFight is a boolean)[(set: $easterHomeFight to false)]
(if: $davyTicketPhase is "writing" and not ((passage:)'s tags contains "venue-colony") and ((passage:)'s tags contains any of (a: "venue-french", "venue-ronnies", "venue-coach", "venue-gents", "venue-trishas", "venue-lackland", "venue-lackland-back", "venue-cecilcourt", "venue-pillars", "venue-cellar", "dream")))[(set: $davyTicketReady to true)]}

:: Davy Paper Request [system]
(unless: $davyPaperAsked is true)[(set: $davyPaperAsked to true)‘Have you got any paper?’ DAVY asks. ‘I thought I’d leave her a note at the Pillars, in case she comes back. I’ve got a pen.’]

:: Davy takes the ticket [venue-colony char-davy]
<!-- 2026-10-24: borrowed, never spent; the same ticket remains an Easter Island key. -->
(display: "Key Guards")\\
(if: $dreamKey is "ticket" and $davyTicketPhase is "")[(set: $davyPaperAsked to true)(set: $davyTicketPhase to "writing")(set: $davyTicketReady to false)(set: $keyTicket to "Davy’s note")(set: $dreamKey to "")(display: "Key Sites")
You give him the chippy ticket. He turns it over.

‘Yes, that’ll do.’

He starts writing on the back.
](else:)[(go-to: "Davy’s note")]

<!-- Keep LACKLAND's advice available if the favour was done during the first conversation. -->
[[Listen|Davy Merkin's tip]]
(link: "Back to the bar")[(set: $resumingFromCall to true)(go-to: "The Colony Room")]

:: Davy’s note [venue-colony char-davy]
(display: "Key Guards")\\
(if: $davyTicketPhase is "writing" and $davyTicketReady is true)[(set: $davyTicketPhase to "returned")(set: $davyTicketFragment to true)
The ticket is on the table beside his glass. He pushes it towards you.

‘Here. I won’t be needing it.’

He has written two lines on the back and crossed them out.

(display: "Davy Ticket Fragment")
](else-if: $davyTicketPhase is "writing")[He starts writing on the back.]
(else-if: $davyTicketPhase is "returned")[(display: "Davy Ticket Fragment")]
(else:)[(display: "Davy Paper Request")
(if: $dreamKey is "ticket")[[[Give him the chippy ticket|Davy takes the ticket]]]]

(if: $davyTicketPhase is "returned")[(display: "Resting Keys")]
(link: "Back to the bar")[(set: $resumingFromCall to true)(go-to: "The Colony Room")]

:: Davy Ticket Fragment [system]
<div class="item-box"><div class="item-header">FRAGMENT OF RONGORONGO</div>'''+fragment+'''<div class="item-note">The sixth moai. Saved in your notebook.</div></div>
'''
# Compact art in the return card and notebook, retaining existing glyph art.
once('.dss-lore-body .dss-book-lore p:last-child { margin-bottom: 0; }','.dss-lore-body .dss-book-lore p:last-child { margin-bottom: 0; }\n.davy-ticket-fragment { width: min(240px, 100%); margin: 0.7em auto; overflow: hidden; }\n.davy-ticket-fragment svg { display: block; width: 100%; height: auto; }')
p.write_text(s)
