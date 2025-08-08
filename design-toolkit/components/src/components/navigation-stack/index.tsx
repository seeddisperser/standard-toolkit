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
import { Broadcast, type Payload } from '@accelint/bus';
import { type UniqueId, isUUID } from '@accelint/core';
import { PressResponder } from '@react-aria/interactions';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable } from 'react-aria-components';
import type {
  NavigationStackBackEvent,
  NavigationStackClearEvent,
  NavigationStackContextValue,
  NavigationStackProps,
  NavigationStackPushEvent,
  NavigationStackResetEvent,
  NavigationStackTriggerProps,
  NavigationStackViewProps,
} from './types';

const bus = Broadcast.getInstance();
const NavigationStackEventNamespace = 'NavigationStack';
const NavigationStackContext = createContext<NavigationStackContextValue>({
  parent: null,
  stack: [],
  view: null,
  register: () => undefined,
  unregister: () => undefined,
});

export const NavigationStackEventTypes = {
  back: `${NavigationStackEventNamespace}:back`,
  clear: `${NavigationStackEventNamespace}:clear`,
  reset: `${NavigationStackEventNamespace}:reset`,
  push: `${NavigationStackEventNamespace}:push`,
} as const;

function NavigationStackTrigger({
  children,
  for: types,
}: NavigationStackTriggerProps) {
  const { parent } = useContext(NavigationStackContext);

  function handlePress() {
    for (const type of Array.isArray(types) ? types : [types]) {
      if (isUUID(type)) {
        bus.emit<NavigationStackPushEvent>(NavigationStackEventTypes.push, {
          view: type,
        });
      } else {
        const [event, target] = type.split(':') as [
          'back' | 'clear' | 'reset',
          UniqueId | undefined,
        ];
        const stack = target ?? parent;

        if (stack) {
          bus.emit<
            | NavigationStackBackEvent
            | NavigationStackClearEvent
            | NavigationStackResetEvent
          >(`${NavigationStackEventNamespace}:${event}`, {
            stack,
          });
        }
      }
    }
  }

  return (
    <PressResponder onPress={handlePress}>
      <Pressable>{children}</Pressable>
    </PressResponder>
  );
}
NavigationStackTrigger.displayName = 'NavigationStack.Trigger';

function NavigationStackView({ id, children }: NavigationStackViewProps) {
  const { parent, view, register, unregister } = useContext(
    NavigationStackContext,
  );

  if (!parent) {
    throw new Error(
      'NavigationStack.View must be implemented within a NavigationStack',
    );
  }

  if (!isUUID(id)) {
    throw new Error(`NavigationStack.View's id must be a UniqueId`);
  }

  useEffect(() => {
    register(id);

    () => unregister(id);
  }, [register, unregister, id]);

  return view === id ? children : null;
}
NavigationStackView.displayName = 'NavigationStack.View';

export function NavigationStack({
  id,
  children,
  defaultView,
}: NavigationStackProps) {
  if (!isUUID(id)) {
    throw new Error(`NavigationStack's id must be a UniqueId`);
  }

  const views = useRef(new Set<UniqueId>());
  const [stack, setStack] = useState<UniqueId[]>(
    defaultView ? [defaultView] : [],
  );
  const view = stack.at(-1) ?? null;

  const handleBack = useCallback(
    (data: Payload<NavigationStackBackEvent>) => {
      if (id === data?.payload?.stack) {
        setStack((prev) => {
          if (prev.length <= 1) {
            return defaultView ? [defaultView] : [];
          }

          return prev.slice(0, -1);
        });
      }
    },
    [id, defaultView],
  );

  const handleClear = useCallback(
    (data: Payload<NavigationStackClearEvent>) => {
      if (id === data?.payload?.stack) {
        setStack(() => []);
      }
    },
    [id],
  );

  const handleReset = useCallback(
    (data: Payload<NavigationStackResetEvent>) => {
      if (id === data?.payload?.stack) {
        setStack(() => (defaultView ? [defaultView] : []));
      }
    },
    [id, defaultView],
  );

  const handlePush = useCallback((data: Payload<NavigationStackPushEvent>) => {
    if (views.current.has(data?.payload?.view)) {
      setStack((prev) => [...prev, data?.payload?.view]);
    }
  }, []);

  useEffect(() => {
    bus.on(NavigationStackEventTypes.back, handleBack);
    bus.on(NavigationStackEventTypes.clear, handleClear);
    bus.on(NavigationStackEventTypes.reset, handleReset);
    bus.on(NavigationStackEventTypes.push, handlePush);

    return () => {
      bus.off(NavigationStackEventTypes.back, handleBack);
      bus.off(NavigationStackEventTypes.clear, handleClear);
      bus.off(NavigationStackEventTypes.reset, handleReset);
      bus.off(NavigationStackEventTypes.push, handlePush);
    };
  }, [handleBack, handleClear, handleReset, handlePush]);

  return (
    <NavigationStackContext.Provider
      value={{
        parent: id,
        stack,
        view,
        register: (view: UniqueId) => views.current.add(view),
        unregister: (view: UniqueId) => views.current.delete(view),
      }}
    >
      {children}
    </NavigationStackContext.Provider>
  );
}
NavigationStack.displayName = 'NavigationStack';
NavigationStack.View = NavigationStackView;
NavigationStack.Trigger = NavigationStackTrigger;
