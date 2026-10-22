"""Generate the 1200x630 OG card for a blog post.

Usage:
    python3 scripts/make_og_card.py blog/<slug>.html [more posts...]

Reads each post's og:title and writes assets/images/blog/<slug>-og.png.
Layout matches the existing cards. The original cards use DejaVu fonts;
if those are not installed, the closest macOS fonts are used instead
(Charter, Verdana, Menlo), so the title face will differ slightly.
"""
import html
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets/images/blog"

W, H = 1200, 630
BG = (246, 243, 235)
AMBER = (201, 127, 6)
INK = (24, 21, 16)
MUTED = (107, 101, 87)
RULE = (214, 209, 197)
LEFT, RIGHT = 80, 1120

# (path, ttc index) candidates, first match wins
SERIF_BOLD = [("/Library/Fonts/DejaVuSerif-Bold.ttf", 0),
              (str(Path.home() / "Library/Fonts/DejaVuSerif-Bold.ttf"), 0),
              ("/System/Library/Fonts/Supplemental/Charter.ttc", "Bold"),
              ("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 0)]
SANS_BOLD = [("/Library/Fonts/DejaVuSans-Bold.ttf", 0),
             (str(Path.home() / "Library/Fonts/DejaVuSans-Bold.ttf"), 0),
             ("/System/Library/Fonts/Supplemental/Verdana Bold.ttf", 0)]
MONO = [("/Library/Fonts/DejaVuSansMono.ttf", 0),
        (str(Path.home() / "Library/Fonts/DejaVuSansMono.ttf"), 0),
        ("/System/Library/Fonts/Menlo.ttc", "Regular")]

# Targets measured from the existing cards
TITLE_CAP = 56        # cap height of title text, px
TITLE_PITCH = 87      # baseline-to-baseline, px
TITLE_CENTRE = 314    # midpoint between first cap top and last baseline
EYEBROW = "ESSAY  ·  AAKASHDHAR.ME"
EYEBROW_W, EYEBROW_TOP = 327, 83
BYLINE = "Aakash Dhar  ·  Technical Project Manager"
BYLINE_W, BYLINE_TOP = 615, 565
SITE = "aakashdhar.me"
SITE_W, SITE_TOP = 183, 567


def load(cands, size):
    for path, idx in cands:
        if not Path(path).exists():
            continue
        if isinstance(idx, int):
            return ImageFont.truetype(path, size, index=idx)
        for i in range(12):  # find the named face inside a .ttc
            try:
                f = ImageFont.truetype(path, size, index=i)
            except OSError:
                break
            if f.getname()[1] == idx:
                return f
    raise SystemExit(f"No font found among {cands}")


def fit_width(cands, text, target):
    size = 10
    while load(cands, size + 1).getlength(text) <= target:
        size += 1
    return load(cands, size)


def fit_cap(cands, target):
    size = 10
    while True:
        f = load(cands, size + 1)
        top, bottom = f.getbbox("H")[1], f.getbbox("H")[3]
        if bottom - top > target:
            return load(cands, size)
        size += 1


def draw_top(d, xy, text, font, fill):
    """Draw text so its ink top sits at xy[1]."""
    x, y = xy
    d.text((x, y - font.getbbox(text)[1]), text, font=font, fill=fill)


def wrap(text, font, width):
    lines, cur = [], ""
    for word in text.split():
        trial = f"{cur} {word}".strip()
        if font.getlength(trial) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


def make_card(title, out_path):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 10], fill=AMBER)

    draw_top(d, (LEFT + 3, EYEBROW_TOP), EYEBROW, fit_width(MONO, EYEBROW, EYEBROW_W), AMBER)

    tf = fit_cap(SERIF_BOLD, TITLE_CAP)
    lines = wrap(title, tf, RIGHT - LEFT)
    cap_top_off = tf.getbbox("H")[1]          # from draw origin to cap top
    baseline_off = tf.getmetrics()[0]         # from draw origin to baseline
    cap_h = baseline_off - cap_top_off
    block_h = cap_h + TITLE_PITCH * (len(lines) - 1)
    first_cap_top = round(TITLE_CENTRE - block_h / 2)
    for i, line in enumerate(lines):
        y = first_cap_top + i * TITLE_PITCH - cap_top_off
        d.text((LEFT, y), line, font=tf, fill=INK)

    d.rectangle([LEFT, 534, RIGHT, 535], fill=RULE)
    draw_top(d, (LEFT + 1, BYLINE_TOP), BYLINE, fit_width(SANS_BOLD, BYLINE, BYLINE_W), INK)
    sf = fit_width(MONO, SITE, SITE_W)
    draw_top(d, (RIGHT - 3 - sf.getlength(SITE), SITE_TOP), SITE, sf, MUTED)

    im.save(out_path, optimize=True)
    return lines


def og_title(post):
    m = re.search(r'<meta property="og:title" content="([^"]*)"', post.read_text())
    if not m:
        raise SystemExit(f"No og:title in {post}")
    return html.unescape(m.group(1))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for arg in sys.argv[1:]:
        post = Path(arg)
        out = OUT_DIR / f"{post.stem}-og.png"
        lines = make_card(og_title(post), out)
        print(f"{out.relative_to(ROOT)}  ({len(lines)} lines)")
