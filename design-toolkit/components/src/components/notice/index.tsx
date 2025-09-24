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
import { uuid } from '@accelint/core';
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
import type { ButtonProps } from '../button/types';
import type {
  NoticeColor,
  NoticeContent,
  NoticeDequeueEvent,
  NoticeIconProps,
  NoticeListProps,
  NoticePressEvent,
  NoticeProps,
  NoticeQueueEvent,
} from './types';

const { notice, content, list, actions, region } = NoticeStyles();

function NoticeIcon({ variant = 'info', size }: NoticeIconProps) {
  return (
    <Icon size={size === 'small' ? 'medium' : 'large'}>
      {variant === 'info' && <Information />}
      {variant === 'advisory' && <Information />}
      {variant === 'normal' && <Success />}
      {variant === 'serious' && <Warning />}
      {variant === 'critical' && <Problem />}
    </Icon>
  );
}

const ButtonColorMap: Record<NoticeColor, ButtonProps['color']> = {
  normal: 'mono-bold',
  advisory: 'mono-bold',
  info: 'mono-bold',
  serious: 'serious',
  critical: 'critical',
};

export function Notice({
  id,
  color,
  message,
  primary,
  secondary,
  showClose,
  shouldCloseOnAction,
  size = 'medium',
}: NoticeProps) {
  const emitPrimaryPress = useEmit<NoticePressEvent>(
    NoticeEventTypes.primaryOnPress,
  );
  const emitSecondaryPress = useEmit<NoticePressEvent>(
    NoticeEventTypes.secondaryOnPress,
  );
  const emitClosePress = useEmit<NoticePressEvent>(NoticeEventTypes.close);
  const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
  return (
    <div className={notice()} data-color={color} data-size={size}>
      <ToastContent className={content()}>
        <NoticeIcon variant={color} size={size} />
        <Text slot='description'>{message}</Text>
      </ToastContent>
      <div className={actions()}>
        {secondary && (
          <Button
            {...secondary}
            variant='outline'
            color={ButtonColorMap[color]}
            size={size}
            onPress={() => {
              emitSecondaryPress({ id });
              if (shouldCloseOnAction) {
                dequeue({ id });
              }
            }}
          />
        )}
        {primary && (
          <Button
            {...primary}
            variant='filled'
            color={ButtonColorMap[color]}
            size={size}
            onPress={() => {
              emitPrimaryPress({ id });
              if (shouldCloseOnAction) {
                dequeue({ id });
              }
            }}
          />
        )}
        {showClose && (
          <Button
            variant='icon'
            color={ButtonColorMap[color]}
            slot='close'
            onPress={() => emitClosePress({ id })}
          >
            <Icon>
              <Cancel />
            </Icon>
          </Button>
        )}
      </div>
    </div>
  );
}

function matchesMetadata(
  payload: Record<string, unknown>,
  metadata: Record<string, unknown>,
) {
  //TODO:: better equality checks for arrays and objects??
  for (const [key, value] of Object.entries(payload)) {
    if (key in metadata && metadata[key] !== value) {
      return false;
    }
  }

  return true;
}

function NoticeList({
  id,
  parentRef,
  placement,
  defaultColor,
  defaultTimeout,
  hideClearAll,
  size = 'medium',
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
        ...data.payload,
        id: data.payload.id || uuid(),
        color: defaultColor || data.payload.color,
        timeout: defaultTimeout || data.payload.timeout,
      });
    }
  });

  useOn(NoticeEventTypes.dequeue, (data: NoticeDequeueEvent) => {
    if (id && data.payload.target === id) {
      queue.clear();
      return;
    }
    if (id && data.payload.target) {
      return;
    }

    const dequeue = queue.queue.filter(
      (toast: QueuedToast<NoticeContent>) =>
        (data.payload.id && toast.content.id === data.payload.id) ||
        (data.payload.color && toast.content.color === data.payload.color) ||
        (data.payload.metadata &&
          matchesMetadata(data.payload.metadata, toast.content.metadata)),
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
    });
  });

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
              <Notice {...toast.content} size={size} />
            </Toast>
          )}
        </ToastList>
      </ToastRegion>
    </PortalProvider>
  );
}

Notice.List = NoticeList;
