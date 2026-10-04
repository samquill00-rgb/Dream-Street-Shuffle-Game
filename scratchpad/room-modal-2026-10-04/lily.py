import sys, os
import harness; from harness import Game
g = Game(width=960, height=800)
w="fi-wrap"
p = g.page("The French", "(set: $haunts to (a: $haunt1))(set: $tookLily5 to false)(set: $lilyCount to 0)(set: $enteredVenue to true)(set: $sobriety to 60)"); Game.click(p, "BEGIN", 1200)
for _ in range(80):
    if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
    p.wait_for_timeout(300)
p.wait_for_timeout(900); Game.clear_overlays(p)
p.click('#fi-wrap .dss-room-dismiss')
for _ in range(12):
    p.wait_for_timeout(300)
    if p.evaluate("()=>document.getElementById('fi-wrap').dataset.words")=='room': break
print("before:", p.evaluate("()=>document.getElementById('fi-wrap').dataset.words"), p.evaluate("()=>!!document.querySelector('tw-hook[name=lily5] svg')"))
p.evaluate("()=>document.querySelector('tw-hook[name=lily5] svg').dispatchEvent(new MouseEvent('click',{bubbles:true}))")
for i in range(12):
    p.wait_for_timeout(400)
    if p.evaluate("()=>document.getElementById('fi-wrap').dataset.words")=='modal': break
print("after the lily:", p.evaluate("()=>document.getElementById('fi-wrap').dataset.words"), "lily line shown:", p.evaluate("()=>/flower|lily/i.test(document.querySelector('#fi-wrap .dss-room-prose').textContent)"))
p.screenshot(path='/mnt/project-files/polish-loop/room-modal-shots/fi-flow-lily.png')
print([e[:120] for e in p._errs if 'audio' not in e.lower()])
p.close(); g.close()
