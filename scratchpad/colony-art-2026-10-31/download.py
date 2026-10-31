import json,time,urllib.request,urllib.parse,unicodedata,re,io
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
scratch=Path('scratchpad/colony-art-2026-10-31');out=Path('artwork/colony');raw=scratch/'originals';raw.mkdir(exist_ok=True)
ids=[27987,27281,80586,45254,84076,14572,18951,61128,14664,18161,14591,95183,11723,20556,113714,111436,62371,80336,80607,79349,14586,90316,76395,96841,90326,8991,8987,8980,90123,19339]
candidates={x['id']:x for group in json.loads((scratch/'candidates.json').read_text()).values() for x in group}
selected=[candidates[i] for i in ids]
assert len(set(ids))==30 and all(x['is_public_domain'] is True and x['image_id'] and x['date_end']<=1929 for x in selected)
def slug(s):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')[:75]
def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36','Referer':'https://www.artic.edu/','Accept':'image/jpeg,application/json;q=0.9,*/*;q=0.8'})
    return urllib.request.urlopen(req,timeout=45).read()
manifest=[]
for index,item in enumerate(selected):
    artist=item.get('artist_title','');assert artist
    item=dict(item);item['artwork_url']='https://www.artic.edu/artworks/'+str(item['id'])
    item['image_url']='https://www.artic.edu/iiif/2/'+item['image_id']+'/full/843,/0/default.jpg?download=1'
    item['filename']=str(item['id'])+'-'+slug(artist+'-'+item['title'])+'.jpg'
    item['local_path']='artwork/colony/'+item['filename'];item['image_rights']='Public domain (museum is_public_domain=true); CC0 open-access image';item['retrieved']='2026-10-31'
    original=raw/(str(item['id'])+'.jpg')
    if not original.exists():
        last=None
        for attempt in range(3):
            try:original.write_bytes(fetch(item['image_url']));last=None;break
            except Exception as e:last=e;time.sleep(2+attempt)
        if last:raise last
        time.sleep(1.1)
    im=Image.open(original).convert('RGB');item['download_dimensions']=list(im.size);im.thumbnail((640,640),Image.Resampling.LANCZOS)
    im.save(out/item['filename'],quality=87,optimize=True);item['game_dimensions']=list(im.size);item['aspect_ratio']=im.width/im.height
    manifest.append(item);print(f"{index+1}/30 {artist}: {item['title']}",flush=True)
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
lines=['# Colony Room artwork pack','','Thirty nineteenth-century and early-modernist artworks from the Art Institute of Chicago. Images are individually marked public domain in the museum API; metadata other than description is CC0. Descriptions were not downloaded.','','Source policy: https://api.artic.edu/docs/#copyright','Collection: https://www.artic.edu/collection','Retrieved: 31 October 2026.','', 'These files are resized to a maximum of640px for in-game frames. The full image composition is retained; the game adds a neutral paper mount to fit each frame.','','| File | Artist | Work | Date | Museum source |','|---|---|---|---|---|']
for x in manifest:lines.append('| '+x['filename']+' | '+x['artist_title']+' | '+x['title'].replace('|','/')+' | '+x.get('date_display','')+' | [Record]('+x['artwork_url']+') |')
(out/'SOURCES.md').write_text('\n'.join(lines)+'\n')
sheet=Image.new('RGB',(1500,1800),'#24251f');draw=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',13)
for i,x in enumerate(manifest):
    im=Image.open(out/x['filename']);im.thumbnail((234,238));px=i%6*250;py=i//6*360;sheet.paste(im,(px+(250-im.width)//2,py+10+(238-im.height)//2));draw.text((px+8,py+254),str(i+1)+'. '+x['artist_title'][:29],font=font,fill='#e8dfca');title=x['title'];draw.text((px+8,py+276),title[:32],font=font,fill='#c2bba8');draw.text((px+8,py+295),title[32:64],font=font,fill='#c2bba8')
sheet.save(out/'contact-sheet.jpg',quality=90)
(scratch/'TODO.md').write_text((scratch/'TODO.md').read_text().replace('- [ ] Choose','- [x] Choose').replace('- [ ] Download','- [x] Download'))
