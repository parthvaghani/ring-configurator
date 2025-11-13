# 3D Ring Configurator

A full-featured 3D ring configurator built with React, TypeScript, and Three.js. Customize every aspect of your dream ring in real-time 3D!

## Features

### Diamond Customization
- **5 Realistic Diamond Shapes**:
  - Round Brilliant Cut (with proper faceting)
  - Princess Cut (with X-pattern facets)
  - Emerald Cut (with step-cut layers)
  - Cushion Cut (with rounded corners and brilliant facets)
  - Oval Cut (with elongated brilliant faceting)
- **Custom Colors**: Choose any color for your diamond with preset options
- **Realistic Diamond Physics**:
  - Accurate Index of Refraction (2.417)
  - Proper light transmission and dispersion
  - Enhanced clearcoat for glass-like surface
  - Realistic internal reflections
- **Professional Lighting**: Multi-point lighting system for maximum sparkle
- Real-time 3D preview with realistic reflections and refractions

### Ring Band Customization
- **4 Band Styles**:
  - Classic: Simple smooth band
  - Twisted: Elegant twisted design
  - Engraved: Detailed engraving pattern
  - Channel: Modern channel setting
- **5 Metal Types**: Yellow Gold, White Gold, Rose Gold, Silver, and Platinum
- **Custom Colors**: Fine-tune the exact metal color
- **Ring Size Adjustment**: Size 4-12 with visual feedback

### 3D Viewing & Rendering
- 360° rotation with orbit controls
- Zoom in/out for detailed inspection
- **Enhanced Lighting System**:
  - Multiple directional lights for optimal sparkle
  - Strategic point lights around the diamond
  - Dramatic spotlights for highlights
  - Realistic shadows and ambient occlusion
- **Advanced Material System**:
  - PBR (Physically Based Rendering) materials
  - Realistic metal reflections (gold, silver, platinum)
  - Diamond transmission and refraction
  - ACES Filmic tone mapping for cinematic look
- High-performance rendering with anti-aliasing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Diamond Rendering Technology

The configurator uses **enhanced procedural geometry** for all diamond shapes, featuring:

### Realistic Faceting:
- **Round Brilliant**: 24+ facets with proper crown and pavilion structure
- **Princess Cut**: X-pattern faceting with sharp corners
- **Emerald Cut**: Multi-layered step-cut design (6 layers)
- **Cushion Cut**: Rounded corners with brilliant-style facets
- **Oval Cut**: Elongated brilliant cut with elliptical symmetry

### Advanced Materials:
- Real diamond optical properties (IOR 2.417)
- 98% light transmission for realistic brilliance
- Zero roughness for perfect polish
- Enhanced sheen and specular highlights
- Double-sided rendering for proper refraction
- Color attenuation for subtle internal tinting

### Professional Lighting:
- 10+ light sources strategically positioned
- Mix of directional, point, and spot lights
- Optimized for maximum diamond sparkle
- Realistic shadows and reflections

**Result**: Photorealistic diamonds without needing external 3D model files!

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F

## Project Structure

```
src/
├── components/
│   ├── Scene3D.tsx           # 3D scene with enhanced lighting
│   ├── Ring.tsx              # Customizable ring band with prongs
│   ├── Diamond.tsx           # Realistic faceted diamonds
│   ├── Sidebar.tsx           # Configuration sidebar UI
│   └── Controls/             # UI control components
│       ├── ColorPicker.tsx   # Color selection with presets
│       ├── DiamondSelector.tsx
│       ├── BandStyleSelector.tsx
│       ├── MetalTypeSelector.tsx
│       └── SizeSlider.tsx
├── contexts/
│   └── ConfigContext.tsx     # Global state management
├── utils/
│   ├── geometries.ts         # Realistic faceted diamond geometries
│   └── materials.ts          # PBR material system
├── App.tsx                   # Main app component
├── App.css                   # Modern gradient styling
└── main.tsx                  # Entry point
```

## Customization Options

### Diamond
- Shape: Round, Princess, Emerald, Cushion, Oval
- Color: Full color picker with presets

### Band
- Metal Type: Yellow Gold, White Gold, Rose Gold, Silver, Platinum
- Style: Classic, Twisted, Engraved, Channel
- Color: Custom color picker
- Size: 4-12 (adjustable)

## Controls

- **Left Click + Drag**: Rotate the ring
- **Right Click + Drag**: Pan the view
- **Scroll**: Zoom in/out
- **Sidebar**: All customization options

## Browser Support

Works on all modern browsers that support WebGL:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with React Three Fiber for declarative 3D in React
- 3D rendering powered by Three.js WebGL engine
- Advanced procedural geometry with realistic diamond faceting
- PBR (Physically Based Rendering) materials for photorealism
- Optimized lighting system for maximum diamond brilliance

## Technical Highlights

### Diamond Faceting Algorithm
Each diamond shape uses custom procedural generation:
- Precise vertex positioning for authentic cuts
- Proper crown/pavilion/girdle structure
- Mathematically accurate facet angles
- Optimized triangle count for performance

### Material Physics
- Diamond IOR: 2.417 (scientifically accurate)
- 98% transmission coefficient
- Zero surface roughness for mirror polish
- ACES tone mapping for realistic color grading
- Custom attenuation for internal color dispersion

### Performance Optimizations
- Geometry memoization with useMemo
- Efficient buffer geometry usage
- Optimized lighting with strategic placement
- High-performance WebGL rendering
- Device pixel ratio adaptation for all screens
