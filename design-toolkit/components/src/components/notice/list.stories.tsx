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

import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { type ComponentProps, useEffect, useRef } from 'react';
import { Button } from '../button';
import { Notice } from './';
import { NoticeEventTypes } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  NoticeColor,
  NoticeDequeueEvent,
  NoticeQueueEvent,
} from './types';

type NoticeListWithColorArgs = ComponentProps<typeof Notice.List> & {
  color: NoticeColor;
};

const meta: Meta<NoticeListWithColorArgs> = {
  title: 'Components/Notice.List',
  component: Notice,
  args: {
    color: 'info',
    placement: 'top',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
    placement: {
      control: 'select',
      options: [
        'top left',
        'top',
        'top right',
        'right',
        'bottom right',
        'bottom',
        'bottom left',
        'left',
      ],
    },
  },
};

export default meta;

const message =
  'This is a flexible snackbar that can be either a single or double line that will wrap accordingly when it gets too long for a single line.';

export const Default: StoryObj<NoticeListWithColorArgs> = {
  render: ({ color, placement }) => {
    const noticeContainer = useRef(null);
    const emit = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    return (
      <div className='h-full w-full border' ref={noticeContainer}>
        <Notice.List parentRef={noticeContainer} placement={placement} />
        <Button
          variant='outline'
          onPress={() =>
            emit({
              id: uuid(),
              notice: {
                message,
                color,
              },
            })
          }
        >
          +
        </Button>
      </div>
    );
  },
};

const ids = {
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

export const DequeueSingle: StoryObj<NoticeListWithColorArgs> = {
  render: ({ color, placement }) => {
    const noticeContainer = useRef(null);
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      queue({
        id: ids.a,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: ids.b,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: ids.c,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        notice: {
          message,
          color,
        },
      });
    });
    return (
      <div className='h-full w-full border' ref={noticeContainer}>
        <Notice.List parentRef={noticeContainer} placement={placement} />
        <Button
          variant='outline'
          onPress={() =>
            dequeue({
              id: ids.b,
            })
          }
        >
          dequeue
        </Button>
      </div>
    );
  },
};

export const DequeueList: StoryObj<NoticeListWithColorArgs> = {
  render: ({ color }) => {
    const noticeContainer = useRef(null);
    const infoList = uuid();
    const seriousList = uuid();
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      queue({
        id: uuid(),
        target: infoList,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        target: infoList,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        target: seriousList,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        target: seriousList,
        notice: {
          message,
          color,
        },
      });
    });
    return (
      <div className='h-full w-full border' ref={noticeContainer}>
        <Notice.List
          id={infoList}
          parentRef={noticeContainer}
          placement='top'
          defaultColor='info'
        />
        <Notice.List
          id={seriousList}
          parentRef={noticeContainer}
          placement='bottom'
          defaultColor='serious'
        />
        <Button
          variant='outline'
          onPress={() =>
            dequeue({
              target: infoList,
            })
          }
        >
          dequeue
        </Button>
      </div>
    );
  },
};

export const DequeueColor: StoryObj<NoticeListWithColorArgs> = {
  render: ({ color }) => {
    const noticeContainer = useRef(null);
    const infoList = uuid();
    const seriousList = uuid();
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      queue({
        id: uuid(),
        target: infoList,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        target: infoList,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        target: seriousList,
        notice: {
          message,
          color,
        },
      });
      queue({
        id: uuid(),
        target: seriousList,
        notice: {
          message,
          color,
        },
      });
    });
    return (
      <div className='h-full w-full border' ref={noticeContainer}>
        <Notice.List
          id={infoList}
          parentRef={noticeContainer}
          placement='top'
          defaultColor='info'
        />
        <Notice.List
          id={seriousList}
          parentRef={noticeContainer}
          placement='bottom'
          defaultColor='serious'
        />
        <Button
          variant='outline'
          onPress={() =>
            dequeue({
              color: 'info',
            })
          }
        >
          dequeue
        </Button>
      </div>
    );
  },
};
