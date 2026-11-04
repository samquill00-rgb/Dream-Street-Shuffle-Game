"""Ezekiel theme variation, take 2 (2026-11-04, Sam: "this intro should be a bit shorter so they definitely hear it"):
cut the foundation-only intro from 8 s to 4 s (everything 4 s earlier; the opening A-E chord keeps starting at 0),
and mark the game loop: LOOP START at the theme's entry (4.0 s), LOOP END at 64.0 s, after the final A has held 4 s,
so the piece comes round (A resolves, the foundation is the same A-E at both ends) instead of ending in silence.
Usage: python3 shorten_loop.py "../Ezekiel theme variation.mid" "../Ezekiel theme variation (game).mid" """
import sys,mido
src,dst=sys.argv[1],sys.argv[2]
m=mido.MidiFile(src); tpb=m.ticks_per_beat; SHIFT=8*tpb   # 4 s at 120 bpm
out=mido.MidiFile(ticks_per_beat=tpb,type=1)
for ti,t in enumerate(m.tracks):
    abs_=[]; tick=0
    for x in t:
        tick+=x.time; abs_.append((tick,x))
    # collect notes as (start,end,msg_on,msg_off); shift, clip at 0
    evs=[]; on={}
    for tk,x in abs_:
        if x.type=='note_on' and x.velocity>0: on[(x.channel,x.note)]=(tk,x)
        elif x.type in ('note_off','note_on') and (x.channel,x.note) in on:
            s,xo=on.pop((x.channel,x.note)); s2=max(0,s-SHIFT); e2=tk-SHIFT
            if e2>0: evs.append((s2,xo)); evs.append((e2,x))
        elif x.type=='end_of_track': pass
        else: evs.append((max(0,tk-SHIFT) if x.type not in ('set_tempo','time_signature','track_name','program_change') else min(tk,0 if tk==0 else max(0,tk-SHIFT)),x))
    if ti==0:
        evs.append((8*tpb,mido.MetaMessage('marker',text='LOOP START (the theme enters)')))
        evs.append((128*tpb,mido.MetaMessage('marker',text='LOOP END (back to 4.0 s)')))
    evs.sort(key=lambda e:(e[0],0 if e[1].is_meta else (1 if e[1].type=='note_off' or (e[1].type=='note_on' and e[1].velocity==0) else 2)))
    nt=mido.MidiTrack(); last=0
    for tk,x in evs:
        y=x.copy(time=tk-last); last=tk; nt.append(y)
    nt.append(mido.MetaMessage('end_of_track',time=0)); out.tracks.append(nt)
out.save(dst); print("wrote",dst,"len %.1fs"%mido.MidiFile(dst).length)
