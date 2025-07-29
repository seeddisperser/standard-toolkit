/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use client';
import 'client-only';
import { useControlledState } from '@react-stately/utils';
import { createContext, useContext, useEffect, useMemo } from 'react';
import {
  ColorSwatch as AriaColorSwatch,
  ColorSwatchContext as AriaColorSwatchContext,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type Color,
  ColorSwatchPickerContext,
  composeRenderProps,
  parseColor,
  useContextProps,
  useLocale,
} from 'react-aria-components';
import { ColorPickerStyles } from './styles';
import type {
  ColorPickerProps,
  ColorPickerState,
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
} from './types';

const { colorPicker, swatchItem, swatchPicker, swatch } = ColorPickerStyles();

const parseColorFromProp = (value?: Color | string) => {
  if (typeof value === 'string') {
    try {
      return parseColor(value);
    } catch {
      return undefined;
    }
  }
  return value;
};

export function useColorPickerState(
  props: AriaColorSwatchPickerProps,
): ColorPickerState {
  const value = useMemo(() => parseColorFromProp(props.value), [props.value]);

  const defaultValue = useMemo(
    () => parseColorFromProp(props.defaultValue || '#000000'),
    [props.defaultValue],
  );
  const [color, setColor] = useControlledState(
    value || null,
    defaultValue as Color,
    props.onChange,
  );

  return {
    color,
    setColor(color) {
      setColor(color);
    },
  };
}

/**
 * Renders a single color swatch item for use within a color picker list.
 *
 * This component manages the registration of its color value in a shared color map context,
 * and provides the color value to its children via context. It also handles accessibility
 * and styling for selection and focus states.

 *
 * @remarks
 * - The component registers its color in a shared `ColorMapContext` on mount and removes it on unmount.
 * - The color is parsed and memoized for performance.
 * - The swatch item is rendered as an accessible list box item.
 */
function ColorSwatchPickerItem({
  ref = null,
  children,
  className,
  // color: colorFromProps,
  ...props
}: ColorSwatchPickerItemProps) {
  const propColor = props.color || '#0000';
  const color = useMemo(
    () => (typeof propColor === 'string' ? parseColor(propColor) : propColor),
    [propColor],
  );
  const { locale } = useLocale();
  const map = useContext(ColorMapContext);

  // Register the color in the map context on mount and remove it on unmount.
  // This allows the color picker to manage its own state and selection.
  // The key is the color's hex representation, ensuring uniqueness.
  // The color is also provided to the context for use by children components.
  // This is useful for rendering the swatch or any related UI elements.
  useEffect(() => {
    const key = color.toString('hexa');
    map?.set(key, color);

    return () => {
      map?.delete(key);
    };
  }, [color, map]);

  return (
    <AriaListBoxItem
      {...props}
      ref={ref}
      id={color.toString('hexa')}
      textValue={color.getColorName(locale)}
      className={composeRenderProps(className, (className) =>
        swatchItem({ className }),
      )}
    >
      <AriaColorSwatchContext.Provider value={{ color }}>
        {children}
      </AriaColorSwatchContext.Provider>
    </AriaListBoxItem>
  );
}

const ColorMapContext = createContext<Map<string, Color> | null>(null);

function ColorSwatchPicker({
  ref = null,
  className,
  children,
  ...props
}: ColorSwatchPickerProps) {
  [props, ref] = useContextProps(props, ref, ColorSwatchPickerContext);
  const state = useColorPickerState(props);
  const colorMap = useMemo(() => new Map(), []);
  const { layout = 'grid', ...rest } = props;

  return (
    <AriaListBox
      {...rest}
      className={composeRenderProps(className, (className) =>
        swatchPicker({ className }),
      )}
      layout={layout}
      selectionMode='single'
      selectedKeys={state.color ? [state.color.toString('hexa')] : undefined}
      onSelectionChange={(keys) => {
        // single select, 'all' cannot occur.
        if (keys !== 'all') {
          if (keys.size > 0) {
            state.setColor(colorMap.get([...keys][0]));
          } else {
            // If no keys are selected, we can set the color to null or a default value
            state.setColor(null);
          }
        }
      }}
      {...props}
    >
      <ColorMapContext.Provider value={colorMap}>
        {children}
      </ColorMapContext.Provider>
    </AriaListBox>
  );
}

/**
 * A color picker component that renders a grid of color swatches for selection.
 *
 * This component provides a simple interface for users to select from a predefined
 * set of colors. It renders each color as an interactive swatch that can be clicked
 * to select that color. The component supports keyboard navigation, accessibility
 * features, and fine-grained styling control through the classNames prop.
 *
 * @param options - Array of color values to display as selectable swatches
 * @param className - Additional CSS class name for the picker container
 * @param classNames - Object containing CSS class names for fine-grained styling control
 * @param classNames.picker - CSS class name for the main picker container
 * @param classNames.item - CSS class name for individual swatch items
 * @param classNames.swatch - CSS class name for the color swatch elements
 * @param props - Additional props passed to the underlying ColorSwatchPicker
 *
 * @example
 * ```tsx
 * import { parseColor } from 'react-aria-components';
 *
 * const colors = [
 *   parseColor('#ff0000'),
 *   parseColor('#00ff00'),
 *   parseColor('#0000ff'),
 * ];
 *
 * <ColorPicker
 *   options={colors}
 *   value={parseColor('#ff0000')}
 *   onChange={(color) => console.log('Selected:', color)}
 *   classNames={{
 *     picker: 'gap-4',
 *     item: 'rounded-lg',
 *     swatch: 'w-8 h-8'
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Colors can be provided as Color objects or color strings
 * - The component automatically handles color parsing and validation
 * - Supports all accessibility features from react-aria-components
 * - Uses a grid layout by default but can be customized via the layout prop
 */
export function ColorPicker({
  options,
  classNames,
  ...props
}: ColorPickerProps) {
  return (
    <ColorSwatchPicker
      className={composeRenderProps(classNames?.picker, (className) =>
        colorPicker({ className }),
      )}
      {...props}
    >
      {options.map((color) => (
        <ColorSwatchPickerItem
          className={classNames?.item}
          color={color}
          key={color.toString()}
        >
          <AriaColorSwatch
            className={composeRenderProps(classNames?.swatch, (className) =>
              swatch({ className }),
            )}
          />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  );
}
ColorPicker.displayName = 'ColorPicker';
