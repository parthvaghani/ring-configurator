# Diamond 3D Models Guide

This guide will help you add realistic diamond 3D models to your ring configurator.

## Required Models

You need 5 diamond models in GLB format, one for each cut:

1. `round.glb` - Round brilliant cut
2. `princess.glb` - Princess cut (square)
3. `emerald.glb` - Emerald cut (rectangular)
4. `cushion.glb` - Cushion cut (rounded square)
5. `oval.glb` - Oval cut

## Where to Place Models

Place all diamond models in: `public/models/diamonds/`

```
ring-configurator/
└── public/
    └── models/
        └── diamonds/
            ├── round.glb
            ├── princess.glb
            ├── emerald.glb
            ├── cushion.glb
            └── oval.glb
```

## Option 1: Free Models from Sketchfab

Visit these links to download free diamond models:

1. **Sketchfab** (https://sketchfab.com)
   - Search for "diamond" + specific cut name
   - Filter by "Downloadable" and "Free"
   - Download as GLB format
   - Popular searches:
     - "round brilliant diamond"
     - "princess cut diamond"
     - "emerald cut diamond"

2. **CGTrader** (https://www.cgtrader.com/free-3d-models/diamond)
   - Many free diamond models
   - Make sure to download GLB or GLTF format

3. **TurboSquid Free** (https://www.turbosquid.com/Search/3D-Models/free/diamond)
   - Filter for free models
   - Convert to GLB if needed

## Option 2: Create Your Own with Blender

If you have Blender installed:

### Round Brilliant Cut:
```python
# In Blender Python Console
import bpy
# Add a cylinder
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=1, depth=2)
# Edit mode -> Add modifiers to create facets
# Export as GLB
```

### Quick Blender Steps:
1. Create a UV Sphere or Cylinder
2. Edit mode (Tab)
3. Select vertices and scale/extrude to create facets
4. Add subdivision surface modifier
5. Export -> glTF 2.0 (.glb)
6. Place in `public/models/diamonds/`

## Option 3: Use Online Generators

**Poly Pizza** (https://poly.pizza)
- Search for diamond models
- Download as GLB
- Free and CC0 licensed

**Google Poly Archive** (via archive sites)
- Many free 3D models
- Download GLB format

## Converting Other Formats to GLB

If you have models in other formats (.obj, .fbx, .stl):

### Using Blender:
1. Open Blender
2. File -> Import -> [Your format]
3. File -> Export -> glTF 2.0 (.glb)
4. Enable "Apply Modifiers" in export settings
5. Save to `public/models/diamonds/`

### Using Online Converters:
- **AnyConv** (https://anyconv.com/obj-to-glb-converter/)
- **CloudConvert** (https://cloudconvert.com/obj-to-glb)
- **Aspose 3D Converter** (https://products.aspose.app/3d/conversion)

## Model Requirements

For best results, your diamond models should:

1. **Scale**: Approximately 1 unit in size (will be scaled to 0.5 in the app)
2. **Position**: Centered at origin (0, 0, 0)
3. **Orientation**: Point upward (positive Y axis)
4. **Geometry**:
   - Clean topology
   - Proper facets for realistic reflections
   - No UV maps needed (material is applied programmatically)
5. **Format**: GLB (binary glTF)
6. **File Size**: Keep under 1MB each for fast loading

## Testing Your Models

After placing models in `public/models/diamonds/`:

1. Restart the dev server: `npm run dev`
2. Open http://localhost:3000
3. Change diamond shapes in the configurator
4. Models should load automatically
5. If a model doesn't load, the app will fall back to procedural geometry

## Fallback System

The app includes a fallback system:
- If a model file is missing, it uses procedural geometry
- If a model fails to load, it switches to procedural backup
- No errors will break the app

## Recommended Model Sources (Quick Links)

### Free & Commercial Use:

1. **Sketchfab Diamond Collection**:
   https://sketchfab.com/3d-models/diamond-cuts-collection

2. **Free3D Diamond Models**:
   https://free3d.com/3d-models/diamond

3. **CGTrader Free Diamonds**:
   https://www.cgtrader.com/free-3d-models/diamond

### Premium Options (More Realistic):

1. **TurboSquid Diamond Cuts**: $10-50 per model
2. **CGTrader Premium**: $5-30 per model
3. **Blender Market**: Various diamond packs

## Quick Start (Recommended)

1. Visit https://sketchfab.com
2. Search: "round brilliant diamond free"
3. Download model as GLB
4. Rename to `round.glb`
5. Place in `public/models/diamonds/round.glb`
6. Repeat for other cuts
7. Restart dev server

## Troubleshooting

**Model doesn't appear:**
- Check file path is correct: `public/models/diamonds/[name].glb`
- Check file name matches exactly (case-sensitive)
- Check browser console for errors
- Verify GLB format (not GLTF separate files)

**Model is too big/small:**
- Adjust `scale` prop in Diamond.tsx line 71
- Default is 0.5, try values between 0.1 and 1.0

**Model has wrong orientation:**
- Add rotation in Diamond.tsx: `rotation={[Math.PI / 2, 0, 0]}`

**Model doesn't reflect light properly:**
- Ensure the material system is applying correctly
- Check that the model has proper normals

## Need Help?

If you need help finding or converting models, feel free to ask or check the README.md for more information.
