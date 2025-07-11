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

import { tv } from '@/lib/utils';

const BaseChipStyles = tv({
  base: 'fg-default-light inline-flex w-content items-center justify-center rounded-full outline',
  variants: {
    size: {
      medium: 'px-s py-xs text-body-s',
      small: 'px-s py-xs text-body-xs',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const ChipStyles = tv({
  extend: BaseChipStyles,
  base: 'gap-xxs',
  variants: {
    variant: {
      advisory: 'bg-advisory-subtle outline-advisory-bold',
      critical: 'bg-critical-subtle outline-critical',
      serious: 'bg-serious-subtle outline-serious',
      normal: 'bg-normal-subtle outline-normal',
      info: 'bg-info-subtle outline-info-bold',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const SelectableChipStyles = tv({
  extend: BaseChipStyles,
  base: 'dtk-selected:bg-highlight-subtle dtk-selected:outline-highlight outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
  variants: {
    isDisabled: {
      true: 'fg-disabled dtk-selected:bg-transparent dtk-selected:outline-interactive-disabled outline-interactive-disabled hover:outline-interactive-disabled focus:outline-interactive-disabled',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

export const DeletableChipStyles = tv({
  extend: BaseChipStyles,
  base: 'group gap-xs outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
  slots: {
    remove:
      'icon-default-dark group-hover:icon-default-light group-focus:icon-default-light cursor-pointer',
  },
  variants: {
    isDisabled: {
      true: {
        base: 'fg-disabled outline-interactive-disabled hover:outline-interactive-disabled',
        remove: 'icon-disabled group-hover:icon-disabled cursor-not-allowed',
      },
      false: '',
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});
