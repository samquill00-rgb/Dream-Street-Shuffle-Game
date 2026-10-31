from pathlib import Path
import re
p=Path('Dream Street Shuffle.twee'); s=p.read_text()
a=s.index('// >>>> DSS ROOM KIT BEGIN'); b=s.index('// ======',s.index('window.dssRoomKit({',s.index('// ====== INSIDE O\'FLATTERLY'))+20) if False else s.index('function initCoach',a) if False else s.index('renderer.toneMappingExposure = 0.62;',a)
# All indoor room implementations precede the Coach exterior. Keep changes within this span.
block=s[a:b]
block=block.replace('transparent 24%,rgba(0,0,0,0.74)', 'transparent 34%,rgba(0,0,0,0.48)').replace('transparent 26%,rgba(0,0,0,0.72)', 'transparent 36%,rgba(0,0,0,0.46)')
# Reduce the dark ceiling/floor wash without changing its colour or middle tones.
def wash(m):
    line=m.group(0)
    return re.sub(r'rgba\((\d+,\d+,\d+),([.\d]+)\)',lambda c: 'rgba('+c[1]+','+format(float(c[2])*.65,'.3g')+')' if float(c[2])>=.12 else c[0],line)
block=re.sub(r'^.*(?:[Ww]ash.*(?:cssText|linear-gradient)|background:linear-gradient).*$',wash,block,flags=re.M)
for cid,old,new in [('fi','0.64','0.74'),('ci','0.66','0.75'),('pi','0.68','0.77'),('ri','0.78','0.84')]:
    before=f'renderer.toneMappingExposure = {old};\nwindow._dssBindScene(\'{cid}-wrap\''
    assert block.count(before)==1,cid
    block=block.replace(before,before.replace(old,new))
for cid,new in [('cu','.82'),('cb','.70'),('ti','.83'),('lk','.80'),('cf','.72'),('oi','.74')]:
    pattern=r"(id: '"+cid+r"'.*?exposure: )([\d.]+)"
    block,n=re.subn(pattern,lambda m:m[1]+new,block,count=1,flags=re.S);assert n==1,cid
# Gentle existing fill, rather than extra lights or stronger lamp halos.
for old,new in [('0x68513a, 0.2','0x88705a, 0.28'),('0xa58153, 0x160d09, 0.2','0xb09a78, 0x201711, 0.25'),('0x8a9a50, 0x101408, 0.32','0x9ba876, 0x191c10, 0.38'),('0x8a7040, 0x0a0806, 0.3','0xa18a62, 0x17120d, 0.36'),('0x544455, 0x100608, 0.32','0x786575, 0x1a1016, 0.38'),('0x3a3630, 0x0a0806, 0.22','0x736d65, 0x17130f, 0.30'),('0xc8b591,0x1b140e,.24','0xc8b591,0x251c14,.29'),('0x6a5030, 0x0c0804, 0.4','0x8c7656, 0x1b140c, 0.44'),('0x6a7183, 0x090604, 0.19','0x8892a3, 0x17110c, 0.29')]:
    assert block.count(old)==1,old
    block=block.replace(old,new)
s=s[:a]+block+s[b:]
# Airport pub: preserve nicotine/terminal contrast, modest lift to existing fill.
a=s.index('renderer.toneMappingExposure = 0.74;',s.index("window._dssBindScene('fc-wrap'"));b=s.index('if (window.dssFilmGrade) window.dssFilmGrade(apWrap);',a)
block=s[a:b].replace('renderer.toneMappingExposure = 0.74;','renderer.toneMappingExposure = 0.82;').replace('0xb8b49a, 0x2a2820, 0.16','0xb8b49a, 0x302c24, 0.24')
s=s[:a]+block+s[b:];p.write_text(s)
