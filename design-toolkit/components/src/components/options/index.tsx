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

import 'client-only';
import { createContext } from 'react';
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  Collection as AriaListBoxCollection,
  type ListBoxProps as AriaListBoxProps,
  ListBoxSection as AriaListBoxSection,
  type ListBoxSectionProps as AriaListBoxSectionProps,
} from 'react-aria-components';
import { type IMenuItem, MenuItem, type MenuItemProps } from '../menu-item';

export interface OptionsProps<T extends IMenuItem> extends AriaListBoxProps<T> {
  className?: string;
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  size?: MenuItemProps<T>['size'];
  type?: MenuItemProps<T>['type'];
}

export const OptionsContext = createContext<
  Pick<OptionsProps<IMenuItem>, 'size' | 'type'>
>({
  size: 'large',
  type: 'default',
});

export function Options<T extends IMenuItem>({
  children,
  className,
  description,
  errorMessage,
  label,
  placeholder,
  size,
  type,
  ...props
}: OptionsProps<T>) {
  return (
    <OptionsContext.Provider value={{ size, type }}>
      <AriaListBox<T>
        className='max-h-[200px] overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static-light'
        {...props}
      >
        {children}
      </AriaListBox>
    </OptionsContext.Provider>
  );
}
Options.displayName = 'Options';

Options.Item = MenuItem;

interface OptionsSectionProps<T extends IMenuItem>
  extends AriaListBoxSectionProps<T> {
  header?: string;
}

export function OptionsSection<T extends IMenuItem>({
  children,
  header,
  items,
}: OptionsSectionProps<T>) {
  return (
    <AriaListBoxSection
      id={header}
      className='mt-s border-default-dark border-t first:border-none'
    >
      <AriaHeader className='m-xs my-s text-default-dark text-header-xs'>
        {header}
      </AriaHeader>
      <AriaListBoxCollection items={items}>{children}</AriaListBoxCollection>
    </AriaListBoxSection>
  );
}
OptionsSection.displayName = 'Options.Section';
Options.Section = OptionsSection;
