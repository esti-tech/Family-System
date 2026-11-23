import fitz
import os

pdf_path = r'C:\Users\Hybrid-Tech\Downloads\uni_new1.pdf'
out_dir = r'H:\KInKeep\Family-System\frontend\public\assets\images'
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)

def save_xref(xref, target_name):
    base_img = doc.extract_image(xref)
    target_path = os.path.join(out_dir, target_name)
    with open(target_path, 'wb') as f:
        f.write(base_img['image'])
    w, h = base_img['width'], base_img['height']
    print(f"Saved: {target_name} ({w}x{h})")

# Page 1 Hero and Sections (avoid shadow raster masks)
save_xref(18, 'hero-family.jpeg')
save_xref(14, 'final-cta-family.jpeg')
save_xref(80, 'feature-family-tree.jpeg')
save_xref(42, 'feature-memory-archive.jpeg')
save_xref(50, 'feature-family-stories.jpeg')
save_xref(34, 'feature-events-qr.jpeg')
save_xref(46, 'heritage-coffee.jpeg')
save_xref(50, 'heritage-elders.jpeg')
save_xref(34, 'heritage-wedding.jpeg')

# Page 2 Auth split-screen: xref 2255 is the actual photo (2225 is the card shadow)
save_xref(2255, 'auth-family-split.jpeg')

print("All exact Figma assets saved cleanly to public/assets/images/")
