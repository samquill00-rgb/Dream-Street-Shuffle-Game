import urllib.request,urllib.parse,json,time
from pathlib import Path
out=Path('scratchpad/venue-art-2026-10-31')
queries={'jazz':'incategory:"Photographs by William P. Gottlieb"','singers':'incategory:"Photographs by William P. Gottlieb" (Holiday OR Fitzgerald OR Vaughan OR Christy OR Stafford OR Bailey OR Waters OR Williams OR Wayne)'}
for name,q in queries.items():
    f=out/('commons-'+name+'.json')
    if f.exists():r=json.loads(f.read_text())
    else:
        params={'action':'query','format':'json','generator':'search','gsrsearch':q,'gsrnamespace':'6','gsrlimit':'100','redirects':'1','prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':'800'}
        u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
        r=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'DSSArtworkResearch/1.0 (public-domain artwork selection)'}),timeout=40));f.write_text(json.dumps(r));time.sleep(1.1)
    pages=r.get('query',{}).get('pages',{})
    for k,v in sorted(pages.items(),key=lambda kv:kv[1].get('index',999)):
        info=v.get('imageinfo',[{}])[0];e=info.get('extmetadata',{});cats=e.get('Categories',{}).get('value','')
        if 'PD-Gottlieb' in cats:print(name,k,v['title'][:160],flush=True)
