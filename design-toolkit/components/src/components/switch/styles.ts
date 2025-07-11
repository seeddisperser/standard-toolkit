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
import type { VariantProps } from 'tailwind-variants';

export const SwitchStylesDefaults = {
  isDisabled: false,
  isSelected: false,
} as const;

export const SwitchStyles = tv({
  slots: {
    group:
      'group flex cursor-pointer dtk-disabled:cursor-not-allowed items-center gap-s',
    control: [
      'flex rounded-round bg-transparent p-xxs outline outline-interactive',
      'before:mr-l before:block before:size-m before:rounded-full before:bg-default-dark',
      'group-hover:bg-interactive-hover-dark group-hover:outline-interactive-hover group-hover:before:bg-interactive-hover',
      'group-focus-within:bg-interactive-hover-dark group-focus-within:outline-interactive-hover group-focus-within:before:bg-interactive-hover',
    ],
    label: '',
  },
  variants: {
    isSelected: {
      false: '',
      true: {
        control: [
          'outline-highlight before:mr-0 before:ml-l before:bg-highlight',
          'group-hover:bg-highlight-subtle group-hover:outline-highlight group-hover:before:bg-highlight',
          'group-focus-within:bg-highlight-subtle group-focus-within:outline-interactive-hover group-focus-within:before:bg-highlight',
        ],
      },
    },
    isDisabled: {
      false: '',
      true: {
        group: 'cursor-not-allowed',
        control: [
          'bg-interactive-disabled outline-interactive-disabled before:bg-disabled',
          'group-hover:bg-interactive-disabled group-hover:outline-interactive-disabled group-hover:before:bg-disabled',
          'group-focus-within:bg-interactive-disabled group-focus-within:outline-interactive-disabled group-focus-within:before:bg-disabled',
        ],
      },
    },
  },
  defaultVariants: SwitchStylesDefaults,
});

export type SwitchStyleVariants = VariantProps<typeof SwitchStyles>;
