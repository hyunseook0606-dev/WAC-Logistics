from pathlib import Path
import base64
from PIL import Image

alt = Path(
    r"C:\Users\82103\.cursor\projects\c-Users-82103-Desktop-WAC\assets"
    r"\c__Users_82103_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_image-9f3d9257-2125-4656-bf2c-7517340902f9.png"
)
root = Path(r"C:\Users\82103\Desktop\WAC 프로젝트\public")

img = Image.open(alt).convert("RGBA")
px = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if r > 248 and g > 248 and b > 248:
            px[x, y] = (255, 255, 255, 0)

# Exact WC mark only (before wordmark gap ~x=130-145)
mark = img.crop((12, 0, 136, h))
bbox = mark.getbbox()
assert bbox
mark = mark.crop(bbox)
print("mark", mark.size)
mark.save(root / "wac-mark.png")

Image.open(alt).convert("RGBA").save(root / "wac-logo.png")


def save_icon(src: Image.Image, size: int, path: Path, bg=None) -> None:
    canvas = Image.new("RGBA", (size, size), bg if bg else (0, 0, 0, 0))
    pad = max(2, int(size * 0.1))
    box = size - 2 * pad
    scale = min(box / src.width, box / src.height)
    nw = max(1, int(src.width * scale))
    nh = max(1, int(src.height * scale))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    canvas.save(path, "PNG")
    print("wrote", path.name, size, resized.size)


save_icon(mark, 128, root / "favicon.png")
save_icon(mark, 32, root / "favicon-32.png")
save_icon(mark, 180, root / "apple-touch-icon.png", bg=(255, 255, 255, 255))

b64 = base64.b64encode((root / "wac-mark.png").read_bytes()).decode("ascii")
svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
    'role="img" aria-label="WAC">\n'
    f'  <image href="data:image/png;base64,{b64}" '
    'x="4" y="12" width="56" height="40" '
    'preserveAspectRatio="xMidYMid meet"/>\n'
    "</svg>\n"
)
(root / "favicon.svg").write_text(svg, encoding="utf-8")
print("svg ok", len(svg))
