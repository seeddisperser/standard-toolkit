// __private-exports
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

import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from 'react';
import { Heading, Text } from 'react-aria-components';
import { Icon } from '../icon';
import type { HeroSlots } from './types';

function createComponentHandlers(
  slots: HeroSlots,
): Record<string, (child: ReactElement) => void> {
  return {
    Heading(child: ReactElement) {
      if (slots.primary) {
        slots.invalid.push(child);
      } else {
        slots.primary = child;
      }
    },
    Icon(child: ReactElement) {
      if (slots.icon) {
        slots.invalid.push(child);
      } else {
        slots.icon = child;
      }
    },
    Text(child: ReactElement) {
      slots.secondary.push(child);
    },
  };
}

function getComponentKey(childType: unknown): string | null {
  switch (childType) {
    case Icon:
      return 'Icon';
    case Heading:
      return 'Heading';
    case Text:
      return 'Text';
    default:
      return null;
  }
}

export function getSlots(children: ReactNode): HeroSlots {
  const slots: HeroSlots = {
    icon: null,
    primary: null,
    secondary: [],
    invalid: [],
  };

  const componentHandlers = createComponentHandlers(slots);

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const componentKey = getComponentKey(child.type);
      const handler = componentKey ? componentHandlers[componentKey] : null;

      if (handler) {
        handler(child);
      } else {
        slots.invalid.push(child);
      }
    }
  });

  return slots;
}
