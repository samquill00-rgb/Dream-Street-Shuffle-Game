import json,re,unicodedata,urllib.request,time,html,io
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
scratch=Path('scratchpad/venue-art-2026-10-31');raw=scratch/'originals';raw.mkdir(exist_ok=True)
aic={x['id']:x for group in json.loads((scratch/'candidates.json').read_text()).values() for x in group}
commons={}
for name in ['gottlieb','jazz','singers']:
    commons.update({k:v for k,v in json.loads((scratch/('commons-'+name+'.json')).read_text()).get('query',{}).get('pages',{}).items() if v.get('imageinfo')})
sets={
 'french':('aic',[50176,92201,144607,144578,144580,144584,136861,66869,18089,29230,144589,66873]),
 'trisha':('commons',[11181478,42835613,42836713,42836897,42836667,42835866,42836044,42835709,81311252]),
 'ronnie':('commons',[42835608,42837083,42836581,42835875,42836584,42835681,11096980]),
 'coach':('aic',[13617,3394,11135,18688,6194,21541])}
def plain(s):return html.unescape(re.sub('<[^>]*>','',s)).strip()
def slug(s):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')[:70]
def fetch(u):
    req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36','Referer':'https://www.artic.edu/' if 'artic.edu' in u else 'https://commons.wikimedia.org/'})
    return urllib.request.urlopen(req,timeout=45).read()
allsets={}
for venue,(source,ids) in sets.items():
    folder=Path('artwork')/venue;folder.mkdir(exist_ok=True);items=[]
    for ident in ids:
        if source=='aic':
            x=aic[ident];assert x['is_public_domain'] is True
            item={'id':'aic-'+str(ident),'title':x['title'],'artist':x['artist_title'],'date':x.get('date_display',''),'source_url':'https://www.artic.edu/artworks/'+str(ident),'download_url':'https://www.artic.edu/iiif/2/'+x['image_id']+'/full/843,/0/default.jpg?download=1','rights':'Public domain; museum is_public_domain=true; CC0 open-access image','public_domain':True,'evidence':{'is_public_domain':x['is_public_domain'],'image_id':x['image_id']}}
        else:
            page=commons[str(ident)];info=page['imageinfo'][0];e=info['extmetadata'];cats=e.get('Categories',{}).get('value','');assert 'PD-Gottlieb' in cats
            item={'id':'commons-'+str(ident),'title':page['title'].removeprefix('File:'),'artist':'William P. Gottlieb','date':plain(e.get('DateTimeOriginal',{}).get('value','1938–1948')),'source_url':info['descriptionurl'],'download_url':info.get('thumburl',info['url']),'rights':'Public domain; PD-Gottlieb; photographer released collection effective 16 February 2010','public_domain':True,'evidence':{'copyrighted':e.get('Copyrighted',{}).get('value'),'license':e.get('LicenseShortName',{}).get('value'),'pd_gottlieb_category':True,'library_credit':plain(e.get('Credit',{}).get('value',''))}}
        item['filename']=item['id']+'-'+slug(item['title'])+'.jpg';item['local_path']=str(folder/item['filename']);item['retrieved']='2026-10-31'
        original=raw/(item['id']+'.jpg')
        if not original.exists():
            last=None
            for attempt in range(3):
                try:original.write_bytes(fetch(item['download_url']));last=None;break
                except Exception as ex:last=ex;time.sleep(2+attempt)
            if last:raise last
            time.sleep(1.1)
        im=Image.open(original).convert('RGB');item['original_dimensions']=list(im.size);im.thumbnail((640,640),Image.Resampling.LANCZOS);im.save(folder/item['filename'],quality=87,optimize=True);item['dimensions']=list(im.size);item['ratio']=im.width/im.height;items.append(item)
        print(venue,item['id'],item['title'][:90],flush=True)
    (folder/'manifest.json').write_text(json.dumps(items,ensure_ascii=False,indent=2));allsets[venue]=items
    lines=['# '+venue.title()+' image sources','','Downloaded 31 October 2026. Images are locally stored, resized to a maximum of 640 px and fitted without cropping.','','Rights references:','- https://api.artic.edu/docs/#copyright','- https://loc.gov/loc/lcib/0606/gottlieb.html','- https://commons.wikimedia.org/wiki/Template:PD-Gottlieb','','| Work | Creator | Source | Rights |','|---|---|---|---|']
    for x in items:lines.append('| '+x['title'].replace('|','/')+' | '+x['artist'].replace('|','/')+' | [Record]('+x['source_url']+') | '+x['rights']+' |')
    (folder/'SOURCES.md').write_text('\n'.join(lines)+'\n')
(scratch/'manifest.json').write_text(json.dumps(allsets,ensure_ascii=False,indent=2))
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',14)
for venue,items in allsets.items():
    cols=4;rows=(len(items)+cols-1)//cols;sheet=Image.new('RGB',(1120,rows*330),'#25261f');d=ImageDraw.Draw(sheet)
    for i,x in enumerate(items):
        im=Image.open(x['local_path']);im.thumbnail((260,250));px=i%cols*280;py=i//cols*330;sheet.paste(im,(px+(280-im.width)//2,py+8+(250-im.height)//2));d.text((px+8,py+266),x['title'].removeprefix('(Portrait of ')[:34],font=font,fill='#e4dcc7');d.text((px+8,py+288),x['artist'][:34],font=font,fill='#bbb39f')
    sheet.save(Path('artwork')/venue/'contact-sheet.jpg',quality=90)
t=scratch/'TODO.md';t.write_text(t.read_text().replace('- [ ] Select/download','- [x] Select/download'))
