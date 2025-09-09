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
'use client';

import 'client-only';
import { containsExactChildren } from '@/lib/react';
import { useEmit, useOn } from '@accelint/bus/react';
import { ChevronLeft } from '@accelint/icons';
import { createContext, useState } from 'react';
import {
  Header,
  HeadingContext,
  Pressable,
  Text,
  TextContext,
} from 'react-aria-components';
import { Button, ToggleButton } from '../button';
import { Icon } from '../icon';
import { SidenavEventTypes } from './events';
import { SidenavItemStyles, SidenavStyles } from './styles';
import type {
  SidenavContextValue,
  SidenavDividerProps,
  SidenavEvent,
  SidenavHeaderProps,
  SidenavItemProps,
  SidenavProps,
  SidenavTriggerProps,
} from './types';

const {
  sidenav,
  header,
  logoContainer,
  expanded,
  title,
  divider,
  headerButton,
} = SidenavStyles();

const { item, text } = SidenavItemStyles();

const SidenavContext = createContext<SidenavContextValue | null>(null);

export function Sidenav({
  isHiddenWhenClosed = false,
  children,
  className,
  ...rest
}: SidenavProps) {
  const [open, setOpen] = useState(false);

  useOn<SidenavEvent>(SidenavEventTypes.toggle, () => setOpen(!open));

  return isHiddenWhenClosed && !open ? null : (
    <nav {...rest} data-open={open || null} className={sidenav({ className })}>
      <HeadingContext value={{ className: title() }}>
        <SidenavContext.Provider value={{ open }}>
          {children}
        </SidenavContext.Provider>
      </HeadingContext>
    </nav>
  );
}
Sidenav.displayName = 'Sidenav';

function SidenavHeader({ children, classNames, ...rest }: SidenavHeaderProps) {
  const emit = useEmit<SidenavEvent>(SidenavEventTypes.toggle);
  return (
    <Header {...rest} className={header({ className: classNames?.header })}>
      <Button
        className={headerButton({ className: classNames?.button })}
        variant='icon'
        onPress={() => emit('')}
      >
        <div className={logoContainer({ className: classNames?.container })}>
          <HeadingContext.Provider value={{ className: expanded() }}>
            {children}
          </HeadingContext.Provider>
          <Icon className={expanded({ className: classNames?.icon })}>
            <ChevronLeft />
          </Icon>
        </div>
      </Button>
    </Header>
  );
}
SidenavHeader.displayName = 'Sidenav.Header';

function SidenavTrigger({ children, ...rest }: SidenavTriggerProps) {
  const emit = useEmit<SidenavEvent>(SidenavEventTypes.toggle);
  return (
    <Pressable {...rest} onPress={() => emit('')}>
      {children}
    </Pressable>
  );
}
SidenavTrigger.displayName = 'Sidenav.Trigger';

function SidenavItem({ children, classNames, ...rest }: SidenavItemProps) {
  containsExactChildren({
    children,
    componentName: SidenavItem.displayName,
    restrictions: [
      [Icon, { min: 1, max: 1 }],
      [Text, { min: 1, max: 1 }],
    ],
  });
  return (
    <TextContext.Provider value={{ className: text() }}>
      <ToggleButton
        {...rest}
        variant='icon'
        className={item({ className: classNames?.button })}
      >
        {children}
      </ToggleButton>
    </TextContext.Provider>
  );
}
SidenavItem.displayName = 'Sidenav.Item';

function SidenavDivider({ className, ...rest }: SidenavDividerProps) {
  return <hr {...rest} className={divider({ className })} />;
}
SidenavDivider.displayName = 'Sidenav.Divider';

Sidenav.Trigger = SidenavTrigger;
Sidenav.Header = SidenavHeader;
Sidenav.Item = SidenavItem;
Sidenav.Divider = SidenavDivider;
