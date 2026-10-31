import json,time,urllib.request,urllib.parse
from pathlib import Path
out=Path('scratchpad/colony-art-2026-10-31')
artists=['Amedeo Modigliani','Edgar Degas','Henri de Toulouse-Lautrec','Edouard Manet','Berthe Morisot','Paul Cezanne','Vincent van Gogh','Odilon Redon','Paul Klee','Wassily Kandinsky','Ernst Ludwig Kirchner','Paul Gauguin']
fields='id,title,artist_title,date_display,date_end,image_id,is_public_domain,thumbnail,artwork_type_title'
results={}
for artist in artists:
    cache=out/(artist.replace(' ','-')+'.json')
    if cache.exists():data=json.loads(cache.read_text())
    else:
        params={'q':artist,'query':{'bool':{'filter':[{'term':{'is_public_domain':True}},{'range':{'date_end':{'lte':1929}}}]}},'fields':fields.split(','),'limit':14}
        url='https://api.artic.edu/api/v1/artworks/search?params='+urllib.parse.quote(json.dumps(params,separators=(',',':')))
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Accept':'application/json'})
        try:
            data=json.load(urllib.request.urlopen(req,timeout=35));cache.write_text(json.dumps(data,ensure_ascii=False,indent=2))
        except Exception as e:print(artist,str(e),flush=True);continue
        time.sleep(1.1)
    items=[x for x in data.get('data',[]) if x.get('is_public_domain') is True and x.get('image_id')]
    results[artist]=items
    print(artist,[(x['id'],x['title'],x.get('artwork_type_title')) for x in items[:9]],flush=True)
(out/'candidates.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
