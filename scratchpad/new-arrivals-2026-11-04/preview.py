from pathlib import Path
ns={};base=Path('scratchpad/interior-parity-2026-11-04/preview.py').read_text();exec(base[:base.index('\nfor name,slug')],ns)
s=Path('Dream Street Shuffle.twee').read_text();sc=s[s.index('// ====== FIVE SMALL ARRIVALS'):s.index('// <<<< FIVE SMALL ARRIVALS END')];o=Path('scratchpad/new-arrivals-2026-11-04')
for cid in ['bc','bd','jd','pb','gt']:
 (o/(cid+'.html')).write_text(ns['prefix'].replace('CONTAINER',cid+'-container')+ns['shared']+ns['kit']+sc+'</script>')
