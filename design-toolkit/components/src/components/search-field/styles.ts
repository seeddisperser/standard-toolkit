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

export const SearchFieldStylesDefaults = {
  variant: 'outlined',
} as const;

export const SearchFieldStyles = tv({
  slots: {
    clearButton:
      'fg-default-dark hover:fg-interactive-hover absolute cursor-pointer group-empty:hidden group-disabled:hidden',
    input: 'hide-cancel block w-full rounded-round font-display outline',
    loadingIcon: 'fg-interactive-hover absolute animate-spin',
    searchField: 'group relative',
    searchIcon: 'fg-interactive-hover absolute',
  },
  variants: {
    isDisabled: {
      true: {
        input:
          'text-disabled outline-interactive-disabled placeholder:text-disabled',
      },
      false: {
        input:
          'text-default-light placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
      },
    },
    variant: {
      filled: {
        input: 'bg-surface-raised outline-static-dark',
      },
      outlined: {
        input: 'outline-interactive',
      },
    },
  },
  defaultVariants: SearchFieldStylesDefaults,
});
