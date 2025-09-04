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
import { Broadcast } from '@accelint/bus';
import { ArrowNortheast, ChevronLeft } from '@accelint/icons';
import { useEffect, useState } from 'react';
import {
  Header,
  HeadingContext,
  Pressable,
  Provider,
  TextContext,
} from 'react-aria-components';
import { Button, ToggleButton } from '../button';
import { Icon, IconContext } from '../icon';
import { SidenavEventTypes } from './events';
import { SidenavItemStyles, SidenavStyles } from './styles';
import type {
  SidenavDividerProps,
  SidenavEvent,
  SidenavHeaderProps,
  SidenavItemProps,
  SidenavProps,
  SidenavTriggerProps,
} from './types';

const bus = Broadcast.getInstance<SidenavEvent>();

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

export function Sidenav({ hidden = false, children }: SidenavProps) {
  const [open, setOpen] = useState(false);

  useEffect(
    () => bus.on(SidenavEventTypes.toggle, () => setOpen(!open)),
    [open],
  );

  return hidden && !open ? null : (
    <nav data-open={open || null} className={sidenav()}>
      <HeadingContext value={{ className: title() }}>{children}</HeadingContext>
    </nav>
  );
}
Sidenav.displayName = 'Sidenav';

function SidenavHeader({
  children,
  classNames,
  placement = 'top',
}: SidenavHeaderProps) {
  return (
    <Header
      className={header({ className: classNames?.header })}
      data-placement={placement}
    >
      <Button
        className={headerButton({ className: classNames?.button })}
        variant='icon'
        onPress={() => bus.emit(SidenavEventTypes.toggle, '')}
      >
        <div className={logoContainer({ className: classNames?.container })}>
          <HeadingContext value={{ className: expanded() }}>
            {children}
          </HeadingContext>
          {placement === 'top' && (
            <Icon className={expanded({ className: classNames?.icon })}>
              <ChevronLeft />
            </Icon>
          )}
        </div>
      </Button>
    </Header>
  );
}
SidenavHeader.displayName = 'Sidenav.Header';

function SidenavTrigger({ children }: SidenavTriggerProps) {
  return (
    <Pressable onPress={() => bus.emit(SidenavEventTypes.toggle, {})}>
      {children}
    </Pressable>
  );
}
SidenavTrigger.displayName = 'Sidenav.Trigger';

function SidenavItem({
  children,
  classNames,
  external = false,
  ...rest
}: SidenavItemProps) {
  const Component = external ? Button : ToggleButton;
  return (
    <Component
      {...rest}
      variant='icon'
      className={item({ external, className: classNames?.button })}
    >
      <Provider
        values={[
          [IconContext, {}],
          [TextContext, { className: text() }],
        ]}
      >
        {children}
        {external && (
          <Icon className={expanded({ className: classNames?.icon })}>
            <ArrowNortheast />
          </Icon>
        )}
      </Provider>
    </Component>
  );
}
SidenavItem.displayName = 'Sidenav.Item';

function SidenavDivider({ className }: SidenavDividerProps) {
  return <hr className={divider({ className })} />;
}
SidenavDivider.displayName = 'Sidenav.Divider';

Sidenav.Trigger = SidenavTrigger;
Sidenav.Header = SidenavHeader;
Sidenav.Item = SidenavItem;
Sidenav.Divider = SidenavDivider;
