# Borealis

An interactive, animated canvas background with noise-based patterns and visual effects.

[![npm version](https://badge.fury.io/js/@diabolic%2Fborealis.svg)](https://www.npmjs.com/package/@diabolic/borealis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🎬 [Live Demo](https://bugrakaan.github.io/borealis/)

## Features

- ✨ **Multiple effects** - Wave, twinkle, and noise-based patterns with domain warping
- 🌈 **Aurora colors** - Customizable gradient color schemes
- 🎯 **Animations** - Smooth radial collapse/expand show/hide transitions
- ⚡ **Highly customizable** - 40+ configurable options
- 📱 **Responsive** - Automatically adapts to container or window size
- 🪶 **Lightweight** - No dependencies, pure JavaScript
- 📦 **TypeScript support** - Full type definitions included

## Installation

### npm

```bash
npm install @diabolic/borealis
```

### yarn

```bash
yarn add @diabolic/borealis
```

### pnpm

```bash
pnpm add @diabolic/borealis
```

### CDN

```html
<!-- UMD (Global variable) -->
<script src="https://unpkg.com/@diabolic/borealis/dist/borealis.min.js"></script>

<!-- Or from jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@diabolic/borealis/dist/borealis.min.js"></script>
```

### Direct Script Include

```html
<script src="borealis.js"></script>
```

## Quick Start

### ES Module

```javascript
import Borealis from '@diabolic/borealis';

// Create with default options (fullscreen)
const borealis = new Borealis();

// Create with custom options
const borealis = new Borealis({
    effect: {
        type: 'twinkle',
        aurora: true
    },
    patternAurora: true,
    density: 70
});
```

### Target a Specific Container

```javascript
// Render inside a specific element
const borealis = new Borealis({
    container: document.getElementById('my-container'),
    fullscreen: false  // Use container dimensions instead of viewport
});

// With explicit dimensions
const borealis = new Borealis({
    container: document.getElementById('hero-section'),
    fullscreen: false,
    width: 800,
    height: 400
});
```

### CommonJS

```javascript
const Borealis = require('@diabolic/borealis');

const borealis = new Borealis();
```

### Browser (UMD)

```html
<script src="https://unpkg.com/@diabolic/borealis/dist/borealis.min.js"></script>
<script>
    const borealis = new Borealis({
        effect: { type: 'wave' }
    });
</script>
```

## API Reference

### Constructor

```javascript
new Borealis(options)
```

Creates a new Borealis instance with the specified options.

### Methods

#### `start()`
Start the animation loop.

```javascript
borealis.start();
```

#### `stop()`
Stop the animation loop.

```javascript
borealis.stop();
```

#### `resize([width], [height])`
Manually trigger a resize. Useful when container size changes.

```javascript
// Resize to specific dimensions
borealis.resize(800, 600);

// Resize using current container dimensions
borealis.resize();
```

#### `redraw()`
Force a single frame redraw. Useful when animation is stopped but you want to update the display.

```javascript
borealis.stop();
borealis.setOption('patternAurora', true);
borealis.redraw(); // Update display without starting animation
```

#### `show([callback])`
Expand the pattern from center (reverse collapse).

```javascript
borealis.show(() => {
    console.log('Pattern is now visible');
});
```

#### `hide([callback])`
Collapse the pattern to center.

```javascript
borealis.hide(() => {
    console.log('Pattern is now hidden');
});
```


#### `toggle([callback])`
Toggle between show and hide states.

```javascript
borealis.toggle();
```

#### `isVisible()`
Returns `true` if the pattern is fully visible (not collapsed).

```javascript
if (borealis.isVisible()) {
    console.log('Pattern is visible');
}
```

#### `isHidden()`
Returns `true` if the pattern is fully hidden (collapsed).

```javascript
if (borealis.isHidden()) {
    console.log('Pattern is hidden');
}
```

#### `setOption(key, value)`
Set a single option value.

```javascript
borealis.setOption('effect', 'twinkle');
borealis.setOption('density', 80);
```

#### `setOptions(options)`
Set multiple options at once.

```javascript
borealis.setOptions({
    effect: 'twinkle',
    patternAurora: true,
    twinkleSpeed: 70
});
```

#### `getOption(key)`
Get a specific option value.

```javascript
const currentEffect = borealis.getOption('effect');
```

#### `getOptions()`
Get all current options.

```javascript
const options = borealis.getOptions();
```

#### `destroy()`
Clean up and remove the canvas from DOM.

```javascript
borealis.destroy();
```

## Options Reference

### Container Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement` | `document.body` | Parent element for the canvas |
| `width` | `number \| null` | `null` | Canvas width (null = auto from container/window) |
| `height` | `number \| null` | `null` | Canvas height (null = auto from container/window) |
| `fullscreen` | `boolean` | `true` | Use fixed positioning to cover viewport |
| `zIndex` | `number` | `0` | Canvas z-index |
| `initiallyHidden` | `boolean` | `false` | Start collapsed/hidden |

### Grid Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `density` | `number` | `50` | Grid density (10-100). Higher = more dots |
| `densityMinCell` | `number` | `2` | Minimum cell size at max density |
| `densityMaxCell` | `number` | `8` | Maximum cell size at min density |
| `dotSize` | `number` | `0` | Fixed dot size (0-10). 0 = noise-based size |
| `solidPattern` | `boolean` | `false` | Use uniform solid dots instead of noise pattern |
| `densityMinGap` | `number` | `1` | Minimum gap at max density |
| `densityMaxGap` | `number` | `4` | Maximum gap at min density |

### Pattern Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `patternScale` | `number` | `0.001` | Noise scale (smaller = larger patterns) |
| `patternAurora` | `boolean` | `false` | Use aurora colors for base pattern |
| `warpScale` | `number` | `0.5` | Domain warp frequency multiplier |
| `warpAmount` | `number` | `20` | Domain warp intensity |
| `animationSpeed` | `number` | `0.00002` | Base animation speed |
| `ridgePower` | `number` | `2` | Ridge sharpness (higher = sharper lines) |
| `minOpacity` | `number` | `0` | Minimum dot opacity (0-1) |
| `maxOpacity` | `number` | `1` | Maximum dot opacity (0-1) |
| `waveFrequency` | `number` | `3` | Wave oscillation frequency |
| `waveAmplitude` | `number` | `0.5` | Wave intensity (0-1) |

### Effect Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `effect` | `string` | `'wave'` | Effect type: `'none'`, `'wave'`, or `'twinkle'` |
| `effectAurora` | `boolean` | `false` | Use aurora colors for effect |
| `deadzone` | `number` | `0` | Effect dead zone around cursor (0-100) |

### Wave Effect Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `waveSpeed` | `number` | `0.0008` | Diagonal wave speed |
| `waveWidth` | `number` | `120` | Width of the wave band |
| `waveChance` | `number` | `0.08` | Chance of a cell sparkling (0-1) |
| `waveIntensity` | `number` | `1` | Maximum wave brightness |
| `waveDelayMin` | `number` | `1000` | Minimum delay between waves (ms) |
| `waveDelayMax` | `number` | `3000` | Maximum delay between waves (ms) |
| `waveCombineSparkle` | `boolean` | `false` | Combine wave with sparkle effect |
| `waveSparkleBaseOpacity` | `number` | `0.3` | Base opacity for combined sparkle (0-1) |

### Twinkle Effect Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `twinkleSpeed` | `number` | `50` | Animation speed (10-100) |
| `twinkleSize` | `number` | `50` | Pattern size (10-100, higher = larger groups) |
| `twinkleDensity` | `number` | `50` | Star density (0-100, higher = more stars) |
| `twinkleDeadzone` | `number` | `20` | Center dead zone size (0-50) |
| `twinkleIntensity` | `number` | `1` | Maximum twinkle brightness |
| `twinkleMode` | `string` | `'sparkle'` | Twinkle style: `'sparkle'` or `'wave'` |
| `twinkleCombined` | `boolean` | `false` | Combine with base pattern |
| `twinkleBaseOpacity` | `number` | `0.3` | Base opacity when combined (0-1) |

### Aurora Color Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `auroraColor1` | `array` | `[0, 255, 128]` | First aurora color (RGB) - Cyan-green |
| `auroraColor2` | `array` | `[148, 0, 211]` | Second aurora color (RGB) - Violet |
| `colorScale` | `number` | `0.003` | Color variation scale |

### Collapse Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collapseSpeed` | `number` | `0.1` | Collapse/expand animation speed |
| `collapseWaveWidth` | `number` | `0.4` | Width of the collapse transition |

### Animation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `animateOnHover` | `boolean` | `true` | Only animate when mouse is over document |
| `autoStart` | `boolean` | `true` | Start animation automatically |

### Callback Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onShow` | `function` | `null` | Called when show animation completes |
| `onHide` | `function` | `null` | Called when hide animation completes |

## Examples

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }
    </style>
</head>
<body>
    <script src="borealis.js"></script>
    <script>
        const borealis = new Borealis();
    </script>
</body>
</html>
```

### Twinkle Effect with Aurora Colors

```javascript
const borealis = new Borealis({
    effect: 'twinkle',
    patternAurora: true,
    effectAurora: true,
    twinkleSpeed: 70,
    twinkleDensity: 60,
    twinkleDeadzone: 25
});
```

### Show/Hide on Button Click

```javascript
const borealis = new Borealis();

document.getElementById('toggleBtn').addEventListener('click', () => {
    borealis.toggle(() => {
        console.log('Animation complete');
    });
});
```

### Custom Aurora Colors

```javascript
const borealis = new Borealis({
    patternAurora: true,
    auroraColor1: [255, 100, 100],  // Pink
    auroraColor2: [100, 100, 255],  // Blue
});
```

### Programmatic Control

```javascript
const borealis = new Borealis({ autoStart: false });

// Start when ready
setTimeout(() => {
    borealis.start();
}, 1000);

// Change effect dynamically
borealis.setOption('effect', 'twinkle');

// Hide and perform action
borealis.hide(() => {
    // Navigate or perform other action
    window.location.href = '/next-page';
});
```

### Inside a Specific Container

```javascript
const container = document.getElementById('hero-section');

const borealis = new Borealis({
    container: container,
    density: 60,
    effect: 'wave'
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Demo Page Features

The included `index.html` demo page provides a comprehensive interface for testing and configuring Borealis:

### Settings Panel

- **Two-column layout** - Organized controls for all options
- **Live preview** - Changes apply instantly
- **URL state persistence** - Settings are saved to URL parameters for easy sharing
- **Copy Code button** - Generate JavaScript initialization code from current settings

### Recording Features

The demo page includes WebM video recording capabilities:

| Feature | Description |
|---------|-------------|
| **Format** | WebM with VP9 codec |
| **Framerate** | 30 fps |
| **Main Video Bitrate** | 5 Mbps |
| **Alpha Mask Bitrate** | 3 Mbps |
| **Resolutions** | 640×360, 854×480, 1280×720, 1440×900, 1920×1080, 2560×1440 |
| **Durations** | 5s, 10s, 15s, 30s, 60s, 120s |

#### Alpha Mask Export

When "Include Alpha Mask" is enabled, a separate grayscale WebM video is generated alongside the main recording:

- **Purpose**: Luma matte for video compositing
- **Format**: Grayscale video where white = opaque, black = transparent
- **Usage**: Import into video editors (After Effects, Premiere, DaVinci Resolve) as a track matte
- **Filename**: `borealis-alpha-{timestamp}.webm`

Both files share the same timestamp for easy pairing.

### URL State Persistence

All settings are automatically saved to URL parameters. You can:

1. Configure settings using the panel
2. Copy the URL to share your exact configuration
3. Open the URL to restore all settings

Example URL:
```
index.html?effect=twinkle&patternAurora=true&density=70&twinkleSpeed=60
```

## Performance Tips

1. **Lower density on mobile** - Use lower density values (30-50) on mobile devices
2. **Disable on low-power mode** - Consider detecting battery status
3. **Use `stop()` when hidden** - Stop animation when tab is not visible

```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        borealis.stop();
    } else {
        borealis.start();
    }
});
```

## License

MIT License - feel free to use in personal and commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.