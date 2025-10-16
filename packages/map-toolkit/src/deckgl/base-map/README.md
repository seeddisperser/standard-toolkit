# `@accelint/map-toolkit/deckgl-base-map`

A React component that provides a Deck.gl-powered base map with MapLibre GL integration. This component serves as the foundation for building interactive map applications with support for click and hover events through a centralized event bus.

## Features

- **MapLibre GL Integration**: Built-in support for MapLibre GL base maps with customizable styles
- **Event Bus**: Centralized event system for click and hover interactions using `@accelint/bus`
- **Deck.gl Controller**: Interactive map controls with configurable parameters
- **Client-Side Only**: Designed for client-side rendering in React applications

## Usage

```typescript
import { BaseMap } from '@accelint/map-toolkit/deckgl';
import { View } from '@deckgl-fiber-renderer/dom';

export function MapView() {
  return (
    <BaseMap className="w-full h-full">
      <View id="main" controller />
      {/* Add your Deck.gl layers here */}
    </BaseMap>
  );
}
```

### With Event Handlers

```typescript
import { BaseMap } from '@accelint/map-toolkit/deckgl';
import type { PickingInfo } from '@deck.gl/core';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';

export function InteractiveMap() {
  const handleClick = (info: PickingInfo, event: MjolnirGestureEvent) => {
    console.log('Clicked:', info.object);
  };

  const handleHover = (info: PickingInfo, event: MjolnirPointerEvent) => {
    console.log('Hovering:', info.object);
  };

  return (
    <BaseMap
      className="w-full h-full"
      onClick={handleClick}
      onHover={handleHover}
    >
      <View id="main" controller />
    </BaseMap>
  );
}
```

### Using the Event Bus

The BaseMap component emits events through a centralized bus that can be subscribed to from anywhere in your application. You can subscribe to individual events using the `useOn` hook from [`@accelint/bus`](https://github.com/gohypergiant/standard-toolkit/tree/main/packages/bus):

```typescript
import { useOn } from '@accelint/bus/react';
import { MapEvents } from '@accelint/map-toolkit/deckgl';

export function MapListener() {
  useOn(MapEvents.click, (data) => {
    console.log('Map clicked:', data.payload.info, data.payload.event);
  });

  return null;
}
```

## API

### Props

The `BaseMap` component extends all `DeckglProps` from `@deckgl-fiber-renderer/types` and includes the following additional props:

#### `className?: string`

Optional CSS class name to apply to the map container element.

#### `onClick?: (info: PickingInfo, event: MjolnirGestureEvent) => void`

Callback function triggered when the map is clicked. Receives the full picking info and gesture event.

#### `onHover?: (info: PickingInfo, event: MjolnirPointerEvent) => void`

Callback function triggered when hovering over the map. Receives the full picking info and pointer event.

#### `parameters?: Record<string, any>`

WebGL parameters to customize rendering. These will be merged with the default parameters.

### Exported Constants

#### `bus`

The centralized broadcast instance for map events. Use the `useOn` hook from [`@accelint/bus`](https://github.com/gohypergiant/standard-toolkit/tree/main/packages/bus) to subscribe to map events in React components:

```typescript
import { useOn } from '@accelint/bus/react';
import { MapEvents } from '@accelint/map-toolkit/deckgl';

// In a React component
useOn(MapEvents.click, (payload) => {
  // Handle click event
});

useOn(MapEvents.hover, (payload) => {
  // Handle hover event
});
```

#### `MapEvents`

Event names for map interactions:

- `MapEvents.click`: `'map:click'`
- `MapEvents.hover`: `'map:hover'`

## Default Configuration

The BaseMap component comes with the following defaults:

- **Map Style**: [Carto Dark Matter](https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json)
- **Initial View State**: Configured from `@accelint/map-toolkit` constants
- **Controller**: Interactive with double-click zoom, drag rotate, pitch rotate, and roll disabled
- **Device Pixels**: Disabled for performance
- **Interleaved Rendering**: Enabled

## Event Payload Types

### `MapClickPayload`

```typescript
type MapClickPayload = {
  info: NonFuncPickingInfo; // PickingInfo with viewport omitted for serialization
  event: NonFuncMjolnirGestureEvent; // Event with functions omitted for serialization
};
```

### `MapHoverPayload`

```typescript
type MapHoverPayload = {
  info: NonFuncPickingInfo; // PickingInfo with viewport omitted for serialization
  event: NonFuncMjolnirPointerEvent; // Event with functions omitted for serialization
};
```

Note: Function properties and the viewport are omitted from event payloads to allow proper serialization through the event bus.
