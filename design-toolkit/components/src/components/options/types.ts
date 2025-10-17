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

import type { RefAttributes } from 'react';
import type {
  Key,
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionProps,
  TextProps,
} from 'react-aria-components';
import type { IconProps } from '../icon/types';

export type OptionsDataItem = {
  id: Key;
  name: string;
  children?: OptionsDataItem[];
};

export type OptionsItemProps<T extends OptionsDataItem> = Omit<
  ListBoxItemProps<T>,
  'className'
> &
  RefAttributes<T> & {
    classNames?: {
      item?: ListBoxItemProps['className'];
      icon?: IconProps['className'];
    };
    color?: 'info' | 'serious' | 'critical';
  };

export type OptionsProps<T extends OptionsDataItem> = Omit<
  ListBoxProps<T>,
  'orientation' | 'layout'
> &
  RefAttributes<HTMLDivElement> & {
    size?: 'small' | 'large';
  };

export type OptionsSectionProps<T extends OptionsDataItem> = Omit<
  ListBoxSectionProps<T>,
  'className'
> & {
  classNames?: {
    section?: ListBoxSectionProps<T>['className'];
    header?: string;
  };
  header?: string;
};

export type OptionsItemTextProps = TextProps;
