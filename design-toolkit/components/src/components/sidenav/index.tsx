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
import { useEmit, useOn } from '@accelint/bus/react';
import { ChevronLeft } from '@accelint/icons';
import { createContext, useState } from 'react';
import {
  Button,
  Header,
  HeadingContext,
  Pressable,
  Provider,
  Text,
  TextContext,
  ToggleButton,
} from 'react-aria-components';
import { containsExactChildren } from '@/lib/react';
import { Icon, IconContext } from '../icon';
import { SidenavEventTypes } from './events';
import { SidenavStyles } from './styles';
import type {
  SidenavContextValue,
  SidenavDividerProps,
  SidenavHeaderProps,
  SidenavItemProps,
  SidenavProps,
  SidenavTriggerProps,
} from './types';

const { sidenav, header, toggle, heading, divider, item, text, transient } =
  SidenavStyles();

const SidenavContext = createContext<SidenavContextValue | null>(null);

export function Sidenav({
  className,
  isHiddenWhenClosed,
  ...rest
}: SidenavProps) {
  const [open, setOpen] = useState(false);

  useOn(SidenavEventTypes.toggle, () => setOpen((prev) => !prev));

  if (isHiddenWhenClosed && !open) {
    return null;
  }

  return (
    <Provider
      values={[
        [HeadingContext, { className: heading({ className: transient() }) }],
        [SidenavContext, { open }],
      ]}
    >
      <nav
        {...rest}
        className={sidenav({ className })}
        data-open={open || null}
      />
    </Provider>
  );
}
Sidenav.displayName = 'Sidenav';

function SidenavHeader({ children, classNames, ...rest }: SidenavHeaderProps) {
  const emit = useEmit(SidenavEventTypes.toggle);

  return (
    <Header {...rest} className={header({ className: classNames?.header })}>
      <Button
        className={toggle({ className: classNames?.button })}
        onPress={() => emit(undefined)}
      >
        <Icon.Provider size='large'>{children}</Icon.Provider>
        <Icon className={transient()}>
          <ChevronLeft />
        </Icon>
      </Button>
    </Header>
  );
}
SidenavHeader.displayName = 'Sidenav.Header';

function SidenavTrigger({ children, ...rest }: SidenavTriggerProps) {
  const emit = useEmit(SidenavEventTypes.toggle);

  return (
    <Pressable {...rest} onPress={() => emit(undefined)}>
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
    <Provider
      values={[
        [IconContext, { size: 'medium' }],
        [TextContext, { className: text({ className: transient() }) }],
      ]}
    >
      <ToggleButton
        {...rest}
        className={item({ className: classNames?.button })}
      >
        {children}
      </ToggleButton>
    </Provider>
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
