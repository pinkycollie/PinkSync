# PinkSync Extension Icons

## Icon Requirements

The extension requires three icon sizes:
- 16x16 pixels (toolbar icon)
- 48x48 pixels (extension management)
- 128x128 pixels (Chrome Web Store)

## Creating Icons

You can create icons using any image editor. The icons should:
- Use the PinkSync brand color (#FF1493 - pink)
- Be clear and recognizable at small sizes
- Include the 🎯 target emoji or a similar accessibility symbol
- Have a transparent background

## Quick Icon Generation

### Using Online Tools

1. **Favicon Generator**: Use https://favicon.io/
   - Upload a logo or use text
   - Download all sizes

2. **Canva**: Use https://canva.com
   - Create 128x128 design
   - Export as PNG
   - Resize for other sizes

### Using Command Line (ImageMagick)

If you have ImageMagick installed:

```bash
# Create a simple icon from text
convert -size 128x128 xc:white \
  -font Arial -pointsize 72 -fill '#FF1493' \
  -gravity center -annotate +0+0 '🎯' \
  icon128.png

# Resize for other sizes
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

### Using Python (Pillow)

```python
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Create image with white background
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a pink circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], 
                 fill='#FF1493', outline='#FF1493')
    
    # Save
    img.save(filename)

# Create all sizes
create_icon(128, 'icon128.png')
create_icon(48, 'icon48.png')
create_icon(16, 'icon16.png')
```

## Placeholder Icons

For development, you can use solid color placeholders:

1. Go to https://via.placeholder.com
2. Generate:
   - https://via.placeholder.com/16/FF1493/FFFFFF?text=PS
   - https://via.placeholder.com/48/FF1493/FFFFFF?text=PS
   - https://via.placeholder.com/128/FF1493/FFFFFF?text=PS
3. Save as icon16.png, icon48.png, icon128.png

## SVG Icon (Vector)

Here's an SVG version that can be converted to PNG:

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <circle cx="64" cy="64" r="60" fill="#FF1493"/>
  <circle cx="64" cy="64" r="40" fill="white"/>
  <circle cx="64" cy="64" r="20" fill="#FF1493"/>
  <circle cx="64" cy="64" r="8" fill="white"/>
</svg>
```

Save this as `icon.svg` and convert using:
- Online: https://cloudconvert.com/svg-to-png
- Command line: `convert icon.svg -resize 128x128 icon128.png`

## Current Status

**TODO**: Add actual icon files to the `icons/` directory before publishing to Chrome Web Store.

For development purposes, the extension will still work without icons, but they are required for Chrome Web Store submission.
