from PIL import Image
import os

# Source favicon
src = r'src\favicon.ico'
icons_dir = r'public\icons'

# Required sizes for PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Open the favicon (ICO files can contain multiple sizes)
# We'll use the largest available and resize down
img = Image.open(src)

# Convert to RGBA if needed (preserves transparency)
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Create icons for each size
for size in sizes:
    resized = img.resize((size, size), Image.LANCZOS)
    output_path = os.path.join(icons_dir, f'icon-{size}x{size}.png')
    resized.save(output_path, 'PNG', optimize=True)
    print(f'Created: {output_path}')

print('✅ Icon conversion complete!')
