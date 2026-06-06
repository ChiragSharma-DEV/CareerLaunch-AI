import os, glob, re
files = glob.glob(r'E:\HACKATHON\AI FOR IMPACT\stitch_frontend\app\*.html')
for f in files:
    content = open(f, 'r', encoding='utf-8').read()
    title = re.search(r'<title>(.*?)</title>', content)
    t_text = title.group(1) if title else 'None'
    print(f'File: {os.path.basename(f)}')
    print(f'Title: {t_text}')
    active_nav = re.search(r'<a[^>]*aria-current="page"[^>]*>.*?<span[^>]*>(.*?)</span>', content, re.DOTALL)
    n_icon = active_nav.group(1).strip() if active_nav else 'None'
    print(f'Active nav icon: {n_icon}')
    active_text = re.search(r'<a[^>]*aria-current="page"[^>]*>.*?<span[^>]*>.*?</span>\s*<span[^>]*>(.*?)</span>', content, re.DOTALL)
    n_text = active_text.group(1).strip() if active_text else 'None'
    print(f'Active nav text: {n_text}\n')
