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

export const ChipStyles = tv({
  base: 'fg-default-light inline-flex w-content items-center justify-center gap-xxs rounded-full outline',
  variants: {
    variant: {
      advisory: 'bg-advisory-subtle outline-advisory-bold',
      critical: 'bg-critical-subtle outline-critical',
      serious: 'bg-serious-subtle outline-serious',
      normal: 'bg-normal-subtle outline-normal',
      info: 'bg-info-subtle outline-info-bold',
    },
    size: {
      medium: 'px-s py-xs text-body-s',
      small: 'px-s py-xs text-body-xs',
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'info',
  },
});

export const SelectableChipStyles = tv({
  base: 'fg-default-light inline-flex w-content items-center justify-center rounded-full dtk-selected:bg-highlight-subtle outline dtk-selected:outline-highlight outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
  variants: {
    isDisabled: {
      true: 'fg-disabled dtk-selected:bg-transparent dtk-selected:outline-interactive-disabled outline-interactive-disabled hover:outline-interactive-disabled focus:outline-interactive-disabled',
      false: 'cursor-pointer',
    },
    size: {
      medium: 'px-s py-xs text-body-s',
      small: 'px-s py-xs text-body-xs',
    },
  },
  defaultVariants: {
    isDisabled: false,
    size: 'medium',
  },
});

export const DeletableChipStyles = tv({
  base: 'fg-default-light group inline-flex w-content items-center justify-center gap-xs rounded-full outline outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
  variants: {
    isDisabled: {
      true: 'fg-disabled outline-interactive-disabled hover:outline-interactive-disabled',
      false: '',
    },
    size: {
      medium: 'px-s py-xs text-body-s',
      small: 'px-s py-xs text-body-xs',
    },
  },
  defaultVariants: {
    isDisabled: false,
    size: 'medium',
  },
});
