import os
import glob
from bs4 import BeautifulSoup

base_dir = r"E:\HACKATHON\AI FOR IMPACT\stitch_frontend\app"
files = glob.glob(os.path.join(base_dir, "*.html"))

nav_mapping = {
    "dashboard": "team-planner.html",
    "applications": "team-planner.html",
    "strategy": "insights.html",
    "insights": "insights.html",
    "resume builder": "profile-auditor.html",
    "platform": "profile-auditor.html",
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Replace href in all anchor tags based on text
    for a in soup.find_all('a'):
        text = a.get_text(strip=True).lower()
        for key, target in nav_mapping.items():
            if key in text:
                a['href'] = target
                break
    
    # Also for buttons that look like nav in command-palette.html
    if 'command-palette.html' in filepath:
        # replace the button for "Go to Dashboard" with an anchor or add onclick
        for btn in soup.find_all('button'):
            text = btn.get_text(strip=True).lower()
            if "go to dashboard" in text:
                btn['onclick'] = "window.location.href='team-planner.html'"
            if "open settings" in text:
                btn['onclick'] = "window.location.href='insights.html'"
                
        # Close button for command palette
        for btn in soup.find_all('button'):
            text = btn.get_text(strip=True).lower()
            if "close" in text or btn.find('span', string='close'):
                btn['onclick'] = "window.history.back()"
                
    # Add the hotkey script to the body
    script_tag = soup.new_tag("script")
    script_tag.string = """
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            window.location.href = 'command-palette.html';
        }
    });
    """
    if soup.body:
        soup.body.append(script_tag)
        
    # Let's also add "Mock Interview" link to navs if we can find a nav
    # For sidebar navs
    nav = soup.find('nav')
    if nav:
        # find where to append it, usually inside a flex-col div inside nav
        flex_col = nav.find('div', class_=lambda c: c and 'flex-col' in c and 'gap-2' in c)
        if flex_col:
            # Add Mock Interview link
            new_link = soup.new_tag("a", href="mock-interview.html", **{'class': 'flex items-center gap-3 text-on-surface-variant hover:text-primary px-4 py-3 hover:bg-white/5 transition-all rounded-lg group'})
            icon_span = soup.new_tag("span", **{'class': 'material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors'})
            icon_span.string = "record_voice_over"
            text_span = soup.new_tag("span", **{'class': 'font-body-md text-body-md'})
            text_span.string = "Mock Interview"
            new_link.append(icon_span)
            new_link.append(text_span)
            flex_col.append(new_link)
        else:
            # Maybe it's the horizontal nav, find the div with hidden md:flex
            h_flex = nav.find('div', class_=lambda c: c and 'hidden' in c and 'md:flex' in c)
            if h_flex:
                h_new_link = soup.new_tag("a", href="mock-interview.html", **{'class': 'text-on-surface-variant font-label-caps uppercase tracking-[0.18em] text-[12px] font-medium hover:text-primary transition-colors hover:bg-white/5 duration-300 px-2 py-1 rounded-sm'})
                h_new_link.string = "Interview"
                h_flex.append(h_new_link)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
