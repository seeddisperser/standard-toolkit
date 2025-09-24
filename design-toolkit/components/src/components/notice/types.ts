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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { RefObject } from 'react';
import type { ButtonProps } from '../button/types';
import type { NoticeEventTypes } from './events';

export type NoticeColor =
  | 'info'
  | 'advisory'
  | 'normal'
  | 'critical'
  | 'serious';

export type NoticeContent = {
  id?: UniqueId;
  message: string;
  color: NoticeColor;
  primary?: ButtonProps;
  secondary?: ButtonProps;
  onClose?: () => void;
  timeout?: number;
};

export type NoticeIconProps = {
  variant: 'info' | 'advisory' | 'normal' | 'critical' | 'serious';
};

export type NoticeListProps = {
  id?: UniqueId;
  parentRef: RefObject<HTMLElement | null>;
  placement:
    | 'top left'
    | 'top'
    | 'top right'
    | 'right'
    | 'bottom right'
    | 'bottom'
    | 'bottom left'
    | 'left';
  limit?: number;
  defaultColor?: NoticeColor;
  defaultTimeout?: number;
  hideClearAll?: boolean;
};

export type NoticeProps = NoticeContent;

export type NoticeQueueEvent = Payload<
  typeof NoticeEventTypes.queue,
  {
    id: UniqueId;
    target?: UniqueId;
    notice: NoticeContent;
    metadata?: Record<string, unknown>;
    timeout?: number;
  }
>;
export type NoticeDequeueEvent = Payload<
  typeof NoticeEventTypes.dequeue,
  | ({
      target?: UniqueId;
    } & { id: UniqueId })
  | { color: NoticeColor }
  | { metadata: Record<string, unknown> }
>;
