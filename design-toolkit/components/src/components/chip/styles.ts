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

export const ChipStylesDefaults = {
  variant: 'info',
} as const;

export const BaseChipStyles = tv({
  slots: {
    list: 'group/chip-list flex w-content flex-wrap gap-xs',
    chip: [
      'group/chip fg-primary-bold inline-flex w-content items-center justify-center rounded-full outline',
      'size-medium:px-s size-medium:py-xs size-medium:text-body-s',
      'size-small:px-s size-small:py-xs size-small:text-body-xs',
    ],
  },
});

export const ChipStyles = tv({
  extend: BaseChipStyles,
  slots: {
    chip: 'gap-xxs',
  },
  variants: {
    variant: {
      advisory: { chip: 'bg-advisory-muted outline-advisory-bold' },
      critical: { chip: 'bg-critical-muted outline-critical-bold' },
      serious: { chip: 'bg-serious-muted outline-serious-bold' },
      normal: { chip: 'bg-normal-muted outline-normal-bold' },
      info: { chip: 'bg-info-muted outline-info-bold' },
    },
  },
  defaultVariants: ChipStylesDefaults,
});

export const SelectableChipStyles = tv({
  extend: BaseChipStyles,
  slots: {
    chip: [
      'cursor-pointer outline-interactive',
      // hover
      'enabled:hover:outline-2 enabled:hover:outline-interactive-hover',
      'enabled:selected:hover:outline-interactive-primary-bold',
      'enabled:focus-visible:outline-2 enabled:focus-visible:outline-interactive-hover',
      'enabled:selected:focus-visible:outline-interactive-primary-bold',
      'enabled:pressed:outline-1 enabled:pressed:outline-accent-primary-pressed',
      'enabled:pressed:outline-1 enabled:selected:pressed:outline-accent-primary-pressed',
      'enabled:selected:bg-accent-primary-muted enabled:selected:outline-accent-primary-bold',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:outline-interactive-disabled',
      'disabled:selected:bg-interactive-disabled',
    ],
  },
});

export const DeletableChipStyles = tv({
  extend: BaseChipStyles,
  slots: {
    chip: [
      'cursor-default gap-xs outline-interactive',
      'enabled:fg-primary-muted',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:bg-interactive-disabled disabled:outline-interactive-disabled',
      'has-[button:hover]:fg-hover',
      'has-[button:focus-visible]:fg-hover',
      // using :pressed does not apply the style
      'has-[button[data-pressed]]:fg-pressed',
    ],
    remove: [
      'remove',
      'cursor-pointer',
      'size-medium:p-0 size-small:p-0',
      'size-medium:min-w-[16px] size-medium:max-w-[16px]',
      'size-small:min-w-[12px] size-small:max-w-[12px]',
      'enabled:hover:fg-hover',
      'enabled:color-mono-muted:hover:bg-transparent',
      'enabled:color-mono-muted:fg-primary-bold',
      'enabled:pressed:fg-pressed',
      'disabled:cursor-not-allowed',
    ],
  },
});
