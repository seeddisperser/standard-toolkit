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

export const HeroStylesDefaults = {
  layout: 'stack',
} as const;

export const HeroStyles = tv({
  slots: {
    container:
      'grid layout-grid:grid-cols-[auto_1fr] layout-stack:grid-cols-[auto] layout-grid:grid-rows-[auto] layout-stack:grid-rows-[auto_1fr] layout-grid:items-start rounded-large layout-stack:bg-transparent-light px-l py-xl',
    icon: 'fg-default-dark layout-grid:col-start-1 layout-grid:row-start-1 mr-l mb-l',
    primary:
      'fg-default-light layout-grid:col-start-2 layout-grid:row-start-1 mb-s text-header-xl',
    secondary:
      'fg-default-dark layout-grid:col-start-2 layout-grid:row-start-1 block text-header-l',
  },
  variants: {
    hasInvalid: {
      true: {
        container:
          'before:fg-[red] relative outline outline-dashed outline-1 outline-[red] outline-offset-8 before:absolute before:top-0 before:right-0 before:z-10 before:px-l before:py-s before:content-["Invalid_child_elements"]',
      },
    },
  },
  defaultVariants: {
    hasInvalid: false,
  },
});
