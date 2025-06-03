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

import { cn } from '@/lib/utils';
import { cva } from 'cva';
import type React from 'react';
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  type TabsProps as AriaTabsProps,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
  type TabPanelProps as AriaTabPanelProps,
} from 'react-aria-components';

/**
 * This is a tabs section.
 */
export interface TabsProps extends AriaTabsProps {}

export function Tabs({
  children,
  className,
  orientation = 'horizontal',
  isDisabled = false,
}: TabsProps) {
  return (
    <AriaTabs
      orientation={orientation}
      isDisabled={isDisabled}
      className={cn(
        'flex flex-row ai-orientation-horizontal:flex-col w-content',
        className,
      )}
    >
      {children}
    </AriaTabs>
  );
}

export interface TabListProps extends AriaTabListProps<object> {
  label?: string;
  isIcons?: boolean;
  isDrawer?: 'left' | 'right' | 'top' | 'bottom';
}

const tabListStyles = cva(
  '',
  {
    variants: {
      isIcons: {
        true: '',
      },
      isDrawer: {
        left: 'p-s bg-surface-default rounded-r-large',
        right: 'p-s bg-surface-default rounded-l-large',
        top: 'p-s bg-surface-default rounded-b-large',
        bottom: 'p-s bg-surface-default rounded-t-large',
      },
    },
  },
);

function TabList({
  children,
  className,
  label,
  isIcons,
  isDrawer,
 }: TabListProps) {
  return (
    <AriaTabList
      className={cn(
        'group flex flex-col ai-orientation-horizontal:flex-row',
        tabListStyles({ isIcons, isDrawer }),
        className,
      )}
      aria-label={label}
    >
      {children}
    </AriaTabList>
  );
}

Tabs.TabList = TabList;

const tabBaseStyles = cn(
  'outline-none cursor-pointer fg-default-dark p-s text-header-m',
  'rounded-medium group-ai-orientation-horizontal:rounded-small group-ai-orientation-horizontal:rounded-b-none',
  'group-ai-orientation-horizontal:border-static-light group-ai-orientation-horizontal:border-b',
  'group-ai-orientation-vertical:border-transparent group-ai-orientation-vertical:border',
);

const tabStyles = cva(
  tabBaseStyles,
  {
    variants: {
      isSelected: {
        true: 'fg-highlight bg-highlight-subtle group-ai-orientation-horizontal:border-highlight',
      },
      isHovered: {
        true: 'fg-default-light group-ai-orientation-horizontal:border-interactive-hover',
      },
      isFocused: {
        true: 'fg-default-light group-ai-orientation-horizontal:border-interactive-hover',
      },
      isDisabled: {
        true: 'fg-disabled cursor-not-allowed group-ai-orientation-horizontal:border-interactive-disabled',
      },
    },
    compoundVariants: [
      {
        isSelected: true,
        isHovered: true,
        className: 'fg-highlight group-ai-orientation-horizontal:border-highlight',
      },
      {
        isSelected: true,
        isFocused: true,
        className: 'fg-highlight group-ai-orientation-horizontal:border-interactive-hover group-ai-orientation-vertical:border-interactive-hover',
      },
      {
        isDisabled: true,
        isSelected: true,
        className: 'fg-disabled bg-interactive-disabled group-ai-orientation-horizontal:border-interactive-disabled',
      },
    ],
  },
);

export interface TabProps extends AriaTabProps {
  id: string;
}

function Tab({
  children,
  className,
  id,
  isDisabled,
}: TabProps) {
  return (
    <AriaTab
      id={id}
      isDisabled={isDisabled}
      className={
        ({ isSelected, isHovered, isFocused, isDisabled }) =>
        cn(
          tabStyles({ isSelected, isHovered, isFocused, isDisabled }),
          className,
        )
      }
    >
      {children}
    </AriaTab>
  );
}

Tabs.Tab = Tab;

export interface TabPanelProps extends AriaTabPanelProps {}

function TabPanel({ children, className, id }: TabPanelProps) {
  return (
    <AriaTabPanel
      id={id}
      className={cn(
        'fg-default-light',
        className,
      )}
    >
      {children}
    </AriaTabPanel>
  );
}

Tabs.TabPanel = TabPanel;
