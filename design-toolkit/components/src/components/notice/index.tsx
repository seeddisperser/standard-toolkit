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
import { useBus } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  Cancel,
  Information,
  Problem,
  Success,
  Warning,
} from '@accelint/icons';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import {
  composeRenderProps,
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
  DequeueColor,
  DequeueId,
  DequeueList,
  DequeueMetadata,
  NoticeActionEvent,
  NoticeColor,
  NoticeContent,
  NoticeDequeueEvent,
  NoticeIconProps,
  NoticeListProps,
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
  classNames,
  color = 'info',
  message,
  primary,
  secondary,
  hideIcon,
  showClose,
  shouldCloseOnAction,
  size = 'medium',
  onAction,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
}: NoticeProps) {
  return (
    <Toast
      className={notice({ className: classNames?.notice })}
      toast={{ key: id, content: message, onClose }}
      data-color={color}
      data-size={size}
    >
      <ToastContent className={content({ className: classNames?.content })}>
        {!hideIcon && <NoticeIcon variant={color} size={size} />}
        <Text slot='description'>{message}</Text>
        {(primary || secondary) && (
          <div className={actions({ className: classNames?.actions })}>
            {primary && (
              <Button
                variant='filled'
                color={ButtonColorMap[color]}
                {...primary}
                size={size}
                onPress={() => {
                  onAction?.();
                  onPrimaryAction?.();

                  if (shouldCloseOnAction) {
                    onClose?.();
                  }
                }}
              />
            )}
            {secondary && (
              <Button
                variant='outline'
                color={ButtonColorMap[color]}
                {...secondary}
                size={size}
                onPress={() => {
                  onAction?.();
                  onSecondaryAction?.();

                  if (shouldCloseOnAction) {
                    onClose?.();
                  }
                }}
              />
            )}
          </div>
        )}
        {showClose && (
          <Button
            color={ButtonColorMap[color]}
            variant='icon'
            onPress={onClose}
          >
            <Icon>
              <Cancel />
            </Icon>
          </Button>
        )}
      </ToastContent>
    </Toast>
  );
}

function matchesMetadata(
  payload: Record<string, unknown>,
  metadata?: Record<string, unknown>,
) {
  if (!metadata) {
    return false;
  }

  return Object.entries(payload).every(
    ([key, value]) => key in metadata && isEqual(metadata[key], value),
  );
}

function NoticeList({
  id,
  parentRef,
  classNames,
  defaultColor,
  defaultTimeout,
  hideClearAll,
  limit = 3,
  placement,
  size = 'medium',
}: NoticeListProps) {
  const queue = useMemo(
    () => new ToastQueue<NoticeContent>({ maxVisibleToasts: limit }),
    [limit],
  );
  const [hasNotices, setHasNotices] = useState(false);

  const { useEmit, useOn } = useBus<
    NoticeQueueEvent | NoticeDequeueEvent | NoticeActionEvent
  >();
  const emitAction = useEmit(NoticeEventTypes.action);
  const emitActionPrimary = useEmit(NoticeEventTypes.actionPrimary);
  const emitActionSecondary = useEmit(NoticeEventTypes.actionSecondary);
  const emitClose = useEmit(NoticeEventTypes.close);

  useOn(NoticeEventTypes.queue, (data) => {
    if ((id && data.payload.target === id) || !id) {
      queue.add(
        {
          ...data.payload,
          id: data.payload.id || uuid(),
          color: defaultColor || data.payload.color,
        },
        {
          timeout: defaultTimeout || data.payload.timeout,
        },
      );
    }
  });

  useOn(NoticeEventTypes.dequeue, (data) => {
    if (id && (data.payload as DequeueList).target === id) {
      queue.clear();
      return;
    }

    if (id && (data.payload as DequeueList).target) {
      return;
    }

    // @ts-expect-error : queue.queue exists, but is not currently documented
    const dequeue = queue.queue.filter(
      (toast: QueuedToast<NoticeContent>) =>
        ((data.payload as DequeueId).id &&
          toast.content.id === (data.payload as DequeueId).id) ||
        ((data.payload as DequeueColor).color &&
          toast.content.color === (data.payload as DequeueColor).color) ||
        ((data.payload as DequeueMetadata).metadata &&
          matchesMetadata(
            (data.payload as DequeueMetadata).metadata,
            toast.content.metadata,
          )),
    );

    // @ts-expect-error : queue.queue exists, but is not currently documented
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
        className={composeRenderProps(classNames?.region, (className) =>
          region({ className }),
        )}
        queue={queue}
        data-placement={placement}
      >
        {!hideClearAll && hasNotices && (
          <Button
            className={composeRenderProps(
              classNames?.button,
              (className) => className ?? '',
            )}
            variant='outline'
            onPress={queue.clear}
          >
            Clear All
          </Button>
        )}
        <ToastList
          className={composeRenderProps(classNames?.list, (className) =>
            list({ className }),
          )}
        >
          {({ toast }: { toast: QueuedToast<NoticeContent> }) => (
            <Notice
              {...toast.content}
              classNames={classNames?.notice}
              size={size}
              onAction={() => emitAction({ id: toast.key })}
              onPrimaryAction={() => emitActionPrimary({ id: toast.key })}
              onSecondaryAction={() => emitActionSecondary({ id: toast.key })}
              onClose={() => {
                toast.onClose?.();
                queue.close(toast.key);
                emitClose({ id: toast.key });
              }}
            />
          )}
        </ToastList>
      </ToastRegion>
    </PortalProvider>
  );
}

Notice.List = NoticeList;
