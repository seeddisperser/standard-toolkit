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

import { type VariantProps, tv } from 'tailwind-variants';

export const TabListStylesDefaults = {
  variant: 'default',
} as const;

export const TabStyles = tv({
  slots: {
    list: ['flex orientation-horizontal:flex-row flex-col'],
    tabs: 'group flex w-content flex-row orientation-horizontal:flex-col',
    tab: [
      'fg-primary-muted cursor-pointer p-s shadow-none',
      'rounded-medium group-orientation-horizontal:rounded-small group-orientation-horizontal:rounded-b-none',
      'group-orientation-horizontal:shadow-[0_1px] group-orientation-horizontal:shadow-[color:var(--outline-static)]',

      'selected:fg-accent-primary-bold selected:bg-accent-primary-muted selected:group-orientation-horizontal:shadow-[color:var(--outline-accent-primary-bold)]',
      'hover:fg-primary-bold hover:group-orientation-horizontal:shadow-[color:var(--outline-accent-primary-bold)]',
      'focus:fg-primary-bold focus:group-orientation-horizontal:shadow-[color:var(--outline-accent-primary-bold)]',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:group-orientation-horizontal:shadow-[color:var(--outline-interactive-disabled)]',

      'selected:hover:fg-accent-primary-bold selected:hover:group-orientation-horizontal:shadow-[color:var(--outline-accent-primary-bold)]',
      'selected:focus:fg-accent-primary-bold selected:focus:group-orientation-horizontal:shadow-[color:var(--outline-accent-primary-bold)] selected:focus:group-orientation-vertical:shadow-[color:var(--outline-accent-primary-bold)]',
      'disabled:selected:fg-disabled disabled:bg-interactive-disabled disabled:selected:group-orientation-horizontal:shadow-[color:var(--outline-interactive-disabled)]',
    ],
    panel:
      'fg-primary-bold p-s group-orientation-vertical:pt-0 group-orientation-horizontal:pl-0',
  },
  variants: {
    variant: {
      icons: {
        list: '[&>*]:p-xs orientation-horizontal:[&>*]:pr-s orientation-horizontal:[&>*]:pl-s [&>*]:leading-[0]',
      },
      default: {
        list: '[&>*]:p-s [&>*]:text-header-m',
      },
    },
  },
  defaultVariants: TabListStylesDefaults,
});

export type TabStyleVariants = VariantProps<typeof TabStyles>;
