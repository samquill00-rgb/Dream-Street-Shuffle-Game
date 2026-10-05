import re
P="/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
s=open(P,encoding='utf-8').read()
helper = open("/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/ed009bb7-e8a0-5eaa-a816-b0bf7b6c1553/scratchpad/reveal.js",encoding='utf-8').read()
marker="// The object's name, faint, beside the pointer while it rests on something that can be looked at."
assert s.count(marker)==1
s=s.replace(marker, helper+marker,1)
a="function close() { mode = 'room'; shownProse = prose(); render(); }"; assert s.count(a)==1
s=s.replace(a, "function close() { mode = 'room'; shownProse = prose(); render(); try { wrap.dispatchEvent(new CustomEvent('dss-room-words-away')); } catch (e) {} }")
assert s.count("function down() {}")==1
s=s.replace("function down() {}", "function down() { try { wrap.dispatchEvent(new CustomEvent('dss-room-emptytap')); } catch (e) {} }")
names=['wrap','fiWrap','ciWrap','piWrap','riWrap']
ms=list(re.finditer(r"^var restNext = -1;$", s, re.M)); print("restNext", len(ms)); assert len(ms)==5
for i in range(4,-1,-1):
    m=ms[i]; ins="\nvar reveal = window.dssRoomReveal ? window.dssRoomReveal(%s, camera, restGlows, function() { return camMode === 'idle'; }) : null;" % names[i]
    s=s[:m.end()]+ins+s[m.end():]
ms=list(re.finditer(r"^restTick\(t(, \w+Still)?\);$", s, re.M)); print("restTick", len(ms)); assert len(ms)==5
for m in reversed(ms): s=s[:m.end()]+"\nif (reveal) reveal.tick();"+s[m.end():]
k=s.count("window.DSS_RESTGLOW : 0.5);"); print("rest", k); assert k==5
s=s.replace("window.DSS_RESTGLOW : 0.5);","window.DSS_RESTGLOW : 0.7);")
css = open("/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/ed009bb7-e8a0-5eaa-a816-b0bf7b6c1553/scratchpad/reveal.css",encoding='utf-8').read()
s=s.replace("/* >>>> DSS ROOMS 2026-09-30 BEGIN */", css+"/* >>>> DSS ROOMS 2026-09-30 BEGIN */",1)
open(P,'w',encoding='utf-8').write(s); print("ok")
