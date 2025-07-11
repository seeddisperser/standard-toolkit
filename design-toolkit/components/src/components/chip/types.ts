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

import type { HTMLProps, ReactNode } from 'react';
import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type {
  ChipStyles,
  DeletableChipStyles,
  SelectableChipStyles,
} from './styles';

export type ChipProps = VariantProps<typeof ChipStyles> &
  Omit<HTMLProps<HTMLSpanElement>, 'children' | 'size'> & {
    className?: string;
    /** Used to add text to the badge, such as the number of unread notifications. */
    children?: ReactNode;
  };

export type ChipListProps<T> = Omit<AriaTagGroupProps, 'children'> &
  Pick<AriaTagListProps<T>, 'items' | 'children' | 'renderEmptyState'>;

export type SelectableChipProps = VariantProps<typeof SelectableChipStyles> &
  Omit<AriaTagProps, 'isDisabled'>;

export type DeletableChipProps = VariantProps<typeof DeletableChipStyles> &
  Omit<AriaTagProps, 'isDisabled'>;
