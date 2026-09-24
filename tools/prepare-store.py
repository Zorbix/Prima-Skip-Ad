from pathlib import Path
from PIL import Image
import json, zipfile, hashlib
root=Path(__file__).resolve().parents[1]
icon=Image.open(root/'output/imagegen/logo-60-toolbar.png').convert('RGBA')
store=Image.new('RGBA',(128,128))
store.alpha_composite(icon.resize((112,112),Image.Resampling.LANCZOS),(8,8))
store.save(root/'icons/store-128.png')
store.save(root/'store/assets/icon-128.png')
manifest=json.loads((root/'manifest.json').read_text())
manifest['icons']['128']='icons/store-128.png'
(root/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
files=['manifest.json','background.js','popup.html','popup.css','popup.js']+sorted(str(p.relative_to(root)) for p in (root/'icons').glob('*.png'))
archive=root/'store/prima-skip-ad-1.1.0.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for file in files: z.write(root/file,file)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    packed=json.loads(z.read('manifest.json'))
    for group in (packed['icons'],packed['action']['default_icon']):
        for size,path in group.items():
            assert path in z.namelist()
            assert Image.open(root/path).size==(int(size),int(size))
print(archive)
print('Verified ZIP and all icon references. SHA256:',hashlib.sha256(archive.read_bytes()).hexdigest())
