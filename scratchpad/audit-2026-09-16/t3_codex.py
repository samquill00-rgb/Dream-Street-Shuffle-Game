import json
from harness import *
Q='(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)'
T=[
 ("Second dream same night","Entering The Pillars of Hercules",Q+'(set: $worldsVisited to (a: "himalayas"))(set: $dreamKey to "ticket")(set: $keyTicket to "held")',["Step through"]),
 ("Eye too early","Third Pillar Portal",Q+'(set: $dreamKey to "eye")(set: $keyEye to "held")',[]),
 ("Eye after four","Entering The Pillars of Hercules",Q+'(set: $worldsVisited to (a: "himalayas","nazca","easter","pyramid"))(set: $dreamKey to "eye")(set: $keyEye to "held")',["Step through"]),
 ("Quest still required","Third Pillar Portal",'(set: $dreamKey to "ticket")(set: $keyTicket to "held")',[]),
 ("Completed keys absent next night","The French",Q+'<script>dssAddLifetimeGift("himalayas");</script>',[]),
 ("Unfinished key returns","Dean Street",Q+'(set: $keyTicket to "spent")',[]),
 ("All five synthesis route","Dean Street",Q+'(set: $alba to (a: $alba1,$alba2,$alba3))(set: $worldsVisited to (a: "himalayas","nazca","easter","pyramid","ezekiel"))',["The Pillars","Yes","·"]),
 ("Red reachable","Dean Street",'(set: $easterGlyph to true)',["See who's there","·"]),
 ("Inis reachable","Dean Street",Q+'(set: $pyramidNumber to true)(set: $knowsCecilCourt to true)',["Visit the antiquarian in Cecil Court","·"]),
 ("Lackland reachable","Dean Street",'(set: $nazcaTracing to true)(set: $haunts to (a: $haunt5))(set: $knowsLackland to true)(set: $knowsCopperSecret to true)',["Go to Lackland's Office","·"]),
 ("Critic reachable","Dean Street",Q+'(set: $mantraComplete to true)',["The Pillars","Yes","·","Talk to the Great Ham"]),
 ("Recovery","Dean Street",'(set: $coachUrgent to true)(set: $sobriety to 40)',[]),
 # extra: each key through the pillar
 ("Key ticket -> easter","Entering The Pillars of Hercules",Q+'(set: $dreamKey to "ticket")(set: $keyTicket to "held")',["Step through"]),
 ("Key lighter -> himalayas","Entering The Pillars of Hercules",Q+'(set: $dreamKey to "lighter")(set: $keyLighter to "held")',["Step through"]),
 ("Key cocaine -> nazca","Entering The Pillars of Hercules",Q+'(set: $dreamKey to "cocaine")(set: $keyCocaine to "held")',["Step through"]),
 ("Key slip -> pyramid","Entering The Pillars of Hercules",Q+'(set: $dreamKey to "slip")(set: $keySlip to "held")',["Step through"]),
 ("No key at pillars","Entering The Pillars of Hercules",Q+'(set: $dreamKey to "")',["Step through"]),
 ("Pillars before quest","Entering The Pillars of Hercules",'',["Step through"]),
]
g=Game(); out=[]
for name,target,seeds,acts in T:
    r=run(g,name,target,seeds,acts)
    out.append(r)
    print("==",name,"| at:",r['at'],"| steps:",r['steps'],"| twErr:",r['twErrors'],"| js:",[e.split(' @@')[0] for e in r['jsErrors']])
    print("   links:",r['links'][:8])
    print("   state:",r['state'][:300] if r['state'] else None)
json.dump(out,open('t3_results.json','w'),indent=1)
g.close()
