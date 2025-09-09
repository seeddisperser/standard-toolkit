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

import { tv } from 'tailwind-variants';

export const SidenavStyles = tv({
  slots: {
    sidenav: [
      'group/sidenav',
      'z-5 row-span-full flex h-full flex-col gap-xs p-m',
      'fg-a11y-on-accent bg-surface-default',
      'open:absolute',
      'group-data-[push=left]/layout:open:relative',
    ],
    header: 'flex justify-center group-closed/sidenav:mb-m',
    headerButton: 'p-0 size-medium:p-0 enabled:hover:color-info:bg-inherit',
    logoContainer: [
      'flex items-center text-left',
      'size-small:h-[35px] size-small:w-[35px] [&:not(.group/logo)]:hidden',
      'size-large:h-[49px] size-large:w-[200px] group-open/sidenav:gap-m',
    ],
    expanded: 'group-closed/sidenav:hidden',
    divider: 'my-s bg-[var(--outline-static)] group-open/sidenav:hidden',
    title: 'mt-m mb-xs text-body-xs uppercase group-closed/sidenav:hidden',
  },
});

export const SidenavItemStyles = tv({
  slots: {
    item: [
      'flex w-full items-center rounded-medium p-xs text-body-m group-open/sidenav:gap-s',
      'group-open/sidenav:px-s',
      'focus-visible:outline-none',
      'enabled:cursor-pointer',
      'enabled:hover:bg-interactive-muted-hover',
      'enabled:focus-visible:bg-interactive-muted-hover',
      'enabled:pressed:bg-accent-primary-pressed',
      'enabled:selected:hover:bg-accent-primary-hover',
      'enabled:selected:bg-accent-primary-bold',
      'enabled:selected:focus-visible:bg-accent-primary-hover',
      'disabled:hover:bg-interactive-disabled',
      'disabled:fg-disabled',
      'disabled:cursor-not-allowed',
      'selected:pressed:bg-accent-primary-pressed',
      'selected:pressed:bg-accent-primary-pressed',
    ],
    text: 'flex-1 text-left text-body-s group-closed/sidenav:hidden',
  },
});
