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
import { useOn } from '@accelint/bus/react';
import {
  Cancel,
  Information,
  Problem,
  Success,
  Warning,
} from '@accelint/icons';
import { useEffect, useMemo, useState } from 'react';
import {
  type QueuedToast,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastList as ToastList,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components';
import { PortalProvider } from '@/providers/portal';
import { Button } from '../button';
import { Icon } from '../icon';
import { NoticeEventTypes } from './events';
import { NoticeStyles } from './styles';
import type {
  NoticeContent,
  NoticeDequeueEvent,
  NoticeIconProps,
  NoticeListProps,
  NoticeProps,
  NoticeQueueEvent,
} from './types';

const { base, content, list, actions, region } = NoticeStyles();

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
        <Button variant='icon' slot='close' onPress={() => onClose?.()}>
          <Icon>
            <Cancel />
          </Icon>
        </Button>
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
  hideClearAll,
  limit = 3,
}: NoticeListProps) {
  const queue = useMemo(
    () => new ToastQueue<NoticeContent>({ maxVisibleToasts: limit }),
    [limit],
  );
  const [hasNotices, setHasNotices] = useState(false);

  useOn(NoticeEventTypes.queue, (data: NoticeQueueEvent) => {
    if ((id && data.payload.target === id) || !id) {
      queue.add({
        ...data.payload.notice,
        id: data.payload.id,
        color: defaultColor || data.payload.notice.color,
        timeout: defaultTimeout || data.payload.notice.timeout,
      });
    }
  });

  useOn(NoticeEventTypes.dequeue, (data: NoticeDequeueEvent) => {
    if (id && data.payload.target === id) {
      queue.clear();
      return;
    } else if (id && data.payload.target) {
      return;
    }

    const dequeue = queue.queue.filter(
      (toast) =>
        (data.payload.id && toast.content.id === data.payload.id) ||
        (data.payload.color && toast.content.color === data.payload.color) ||
        (data.payload.metadata &&
          toast.content.metadata === data.payload.metadata), //TODO: object equality check
    );

    if (dequeue.length && dequeue.length === queue.queue.length) {
      queue.clear();
    } else {
      for (const toast of dequeue) {
        queue.close(toast.key);
      }
    }
  });

  useEffect(() => {
    queue.subscribe(() => {
      setHasNotices(queue.visibleToasts.length > 0);
      console.log(queue);
    });
  }, []);

  return (
    <PortalProvider parentRef={parentRef}>
      <ToastRegion
        className={region()}
        data-placement={placement}
        queue={queue}
      >
        {!hideClearAll && hasNotices && (
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
      </ToastRegion>
    </PortalProvider>
  );
}

Notice.List = NoticeList;
