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
import { PortalProvider } from '@/providers/portal';
import { useOn } from '@accelint/bus/react';
import {
  Cancel,
  Information,
  Problem,
  Success,
  Warning,
} from '@accelint/icons';
import { createContext, useMemo, useState } from 'react';
import {
  type QueuedToast,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastList as ToastList,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { NoticeEventTypes } from './events';
import { NoticeStyles } from './styles';
import type {
  NoticeContent,
  NoticeContextValue,
  NoticeIconProps,
  NoticeListProps,
  NoticeProps,
  NoticeQueueEvent,
} from './types';

const { base, content, list, actions, region } = NoticeStyles();

export const NoticeContext = createContext<NoticeContextValue>({
  queue: new ToastQueue<NoticeContent>({ maxVisibleToasts: 3 }),
});

function NoticeIcon({ variant = 'info' }: NoticeIconProps) {
  return (
    <Icon size='large'>
      {variant === 'info' && <Information />}
      {variant === 'advisory' && <Information />}
      {variant === 'normal' && <Success />}
      {variant === 'serious' && <Warning />}
      {variant === 'critical' && <Problem />}
    </Icon>
  );
}

export function Notice({
  color,
  message,
  primary,
  secondary,
  onClose,
}: NoticeProps) {
  return (
    <div className={base()} data-color={color}>
      <ToastContent className={content()}>
        <NoticeIcon variant={color} />
        <Text slot='description'>{message}</Text>
      </ToastContent>
      <div className={actions()}>
        {secondary && <Button {...secondary} variant='outline' />}
        {primary && <Button {...primary} />}
        {onClose && (
          <Button variant='icon' slot='close' onPress={() => onClose?.()}>
            <Icon>
              <Cancel />
            </Icon>
          </Button>
        )}
      </div>
    </div>
  );
}

function NoticeList({
  id,
  parentRef,
  placement,
  defaultColor,
  defaultTimeout,
  limit = 3,
}: NoticeListProps) {
  const queue = useMemo(
    () => new ToastQueue<NoticeContent>({ maxVisibleToasts: limit }),
    [limit],
  );
  const [showClearAll, setShowClearAll] = useState(false);

  useOn(NoticeEventTypes.queue, (data: NoticeQueueEvent) => {
    if ((id && data.payload.target === id) || !id) {
      queue.add({
        ...data.payload.notice,
        color: defaultColor || data.payload.notice.color,
        timeout: defaultTimeout || data.payload.notice.timeout,
      });
    }
  });

  queue.subscribe(() => {
    setShowClearAll(queue.visibleToasts.length > 0);
  });

  return (
    <NoticeContext.Provider value={{ queue }}>
      <PortalProvider parentRef={parentRef}>
        <ToastRegion
          className={region()}
          data-placement={placement}
          queue={queue}
        >
          <>
            {showClearAll && (
              <Button variant='outline' onPress={() => queue.clear()}>
                Clear All
              </Button>
            )}
            <ToastList className={list()}>
              {({ toast }: { toast: QueuedToast<NoticeContent> }) => (
                <Toast toast={toast}>
                  <Notice {...toast.content} />
                </Toast>
              )}
            </ToastList>
          </>
        </ToastRegion>
      </PortalProvider>
    </NoticeContext.Provider>
  );
}

Notice.List = NoticeList;
