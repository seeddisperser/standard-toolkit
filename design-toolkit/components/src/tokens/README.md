# Design Tokens System

This directory contains the design tokens system that generates both CSS variables and JavaScript constants from a single source of truth.

## Overview

The design tokens system ensures consistency between CSS and JavaScript by:

1. **Single Source of Truth**: All design tokens are defined in `tokens.json`
2. **Automatic Generation**: CSS variables and TS constants are generated from the same source
3. **Type Safety**: TypeScript types are generated for all tokens
4. **Build Integration**: Token generation is part of the build process

## File Structure

```
scripts
├── generate-tokens.mjs # Token generator logic

src/tokens/
├── tokens.json         # Single source of truth for all tokens
├── tokens.d.ts         # TypeScript declarations
├── generated/          # Generated files (auto-created)
│   ├── tokens.css      # CSS variables
│   └── tokens.ts       # TypeScript constants and types
```

## Usage

### 1. Defining Tokens

Edit `tokens.json` to define your design tokens:

```json
{
  "colors": {
    "neutral": {
      "01": "#ffffff",
      "02": "#e6e6e6"
    }
  },
  "spacing": {
    "s": "8px",
    "m": "12px",
    "l": "16px"
  }
}
```

### 2. Generating Tokens

Run the token generation:

```bash
pnpm generate:tokens
```

This will create:
- `src/tokens/generated/tokens.css` - CSS variables
- `src/tokens/generated/tokens.ts`  - TypeScript constants and types

### 3. Using Tokens in CSS

Import the generated CSS in your stylesheets:

```css
@import './tokens/generated/tokens.css';

.my-component {
  background-color: var(--colors-neutral-01);
  padding: var(--spacing-l);
}
```

### 4. Using Tokens in JavaScript/TypeScript

Import the generated constants:

```typescript
import { colorsNeutral01, spacingL } from './tokens/generated/tokens';

// colorsNeutral01 is a tuple: [255, 255, 255, 1]
const styles = {
  backgroundColor: `rgba(${colorsNeutral01.join(', ')})`,
  padding: spacingL // still a string, e.g. '16px'
};
```

### 5. Using Tokens in Components

```tsx
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { colorsNeutral01, colorsHighlight01, spacingL } from './tokens/generated/tokens';

const data = [
  { position: [-122.45, 37.78], size: 100 },
  { position: [-122.46, 37.76], size: 200 }
];

const layer = new ScatterplotLayer({
  id: 'scatter',
  data,
  getPosition: d => d.position,
  getRadius: d => d.size,
  getFillColor: () => colorsHighlight01, // Use a token for color
  getLineColor: () => colorsNeutral01,   // Use a token for outline
  radiusMinPixels: parseInt(spacingL, 10), // Use a spacing token for minimum radius
  stroked: true,
  lineWidthMinPixels: 2
});

export default function MyDeckGLMap() {
  return (
    <DeckGL
      initialViewState={{
        longitude: -122.45,
        latitude: 37.78,
        zoom: 12
      }}
      controller={true}
      layers={[layer]}
    />
  );
}
```

## Build Integration

The token generation is automatically integrated into the build process:

```json
{
  "scripts": {
    "build": "pnpm gen:tokens && pnpm tsup && pnpm build:css"
  }
}
```

## Token Categories

The system supports various token categories:

- **Colors**: Neutral, highlight, utility, classification colors
- **Typography**: Font sizes, line heights, font families
- **Spacing**: Margin, padding, gap values
- **Radius**: Border radius values
- **Shadows**: Box shadow values
- **Icons**: Icon size values

## Benefits

1. **Consistency**: Same tokens used in CSS and Typescript
2. **Maintainability**: Single source of truth for all design tokens
3. **Type Safety**: TypeScript support for all tokens
4. **Automation**: Automatic generation during build
5. **Flexibility**: Support for both CSS variables and Typescript constants

## Migration from Current System

To migrate from the current hardcoded CSS variables:

1. Extract values from `src/index.css` into `tokens.json`
2. Update imports to use generated tokens
3. Remove hardcoded CSS variables
4. Update build process to include token generation

## Example Migration

**Before (hardcoded in CSS):**
```css
:root {
  --neutral-01: #ffffff;
  --spacing-l: 16px;
}
```

**After (generated from tokens.json):**
```json
{
  "colors": {
    "neutral": {
      "01": "#ffffff"
    }
  },
  "spacing": {
    "l": "16px"
  }
}
```

The generator will automatically create:
```css
:root {
  --colors-neutral-01: #ffffff;
  --spacing-l: 16px;
}
```

And TS constants:
```typescript
export const colorsNeutral01 = [255, 255, 255, 1]; // [r, g, b, a] tuple
export const spacingL = '16px';
```

## TypeScript Types

- Color tokens are exported as `[r, g, b, a]` tuples (type: `number[]`).
- Spacing, radius, and other tokens remain as strings (e.g., `'16px'`).
