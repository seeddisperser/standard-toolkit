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
import { type UniqueId, uuid } from '@accelint/core';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { Button } from '../button';
import { Notice } from './';
import { NoticeEventTypes } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  NoticeColor,
  NoticeContent,
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
    size: 'medium',
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

export const Default: StoryObj<NoticeListWithColorArgs> = {
  render: ({ color, placement, size }) => {
    const noticeContainer = useRef(null);
    const emit = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    return (
      <div className='h-full w-full border' ref={noticeContainer}>
        <Notice.List
          parentRef={noticeContainer}
          placement={placement}
          size={size}
        />
        <Button
          onPress={() =>
            emit({
              message:
                'This is a flexible snackbar that can be either a single or double line that will wrap accordingly when it gets too long for a single line.',
              color,
            })
          }
        >
          Create Notice
        </Button>
      </div>
    );
  },
};

function generateNotices({ color, target }: Partial<NoticeContent>) {
  return Array.from({ length: 5 }, () => {
    const id = uuid();
    return {
      id,
      target,
      message: id,
      color,
    } as NoticeContent;
  });
}

export const DequeueSingle: StoryObj<NoticeListWithColorArgs> = {
  render: ({ color, placement }) => {
    const noticeContainer = useRef(null);
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    const [notices, setNotices] = useState(generateNotices({ color }));
    const handleDequeue = (id: UniqueId) => {
      dequeue({ id });
      setNotices(notices.filter((notice) => notice.id !== id));
    };
    useEffect(() => {
      notices.toReversed().forEach((notice) => {
        queue(notice);
      });
    });
    return (
      <div className='h-full w-full' ref={noticeContainer}>
        <Notice.List
          hideClearAll
          parentRef={noticeContainer}
          placement={placement}
        />
        <div className='fg-primary-bold flex flex-col gap-s'>
          {notices.map((notice) => (
            <Button
              className='w-full'
              key={notice.id}
              variant='outline'
              onPress={() => handleDequeue(notice.id)}
            >
              Dequeue: {notice.message}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

export const DequeueList: StoryObj<NoticeListWithColorArgs> = {
  render: () => {
    const noticeContainer = useRef(null);
    const infoList = uuid();
    const seriousList = uuid();
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: infoList }).forEach((notice) => {
        queue(notice);
      });
      generateNotices({ target: seriousList }).forEach((notice) => {
        queue(notice);
      });
    });
    return (
      <div className='h-full w-full' ref={noticeContainer}>
        <Notice.List
          id={infoList}
          hideClearAll
          parentRef={noticeContainer}
          placement='top'
          defaultColor='info'
        />
        <Notice.List
          id={seriousList}
          hideClearAll
          parentRef={noticeContainer}
          placement='bottom'
          defaultColor='serious'
        />
        <div className='flex flex-col gap-s'>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                target: infoList,
              })
            }
          >
            Dequeue: Info List
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                target: seriousList,
              })
            }
          >
            Dequeue: Serious List
          </Button>
        </div>
      </div>
    );
  },
};

export const DequeueColor: StoryObj<NoticeListWithColorArgs> = {
  render: () => {
    const noticeContainer = useRef(null);
    const infoList = uuid();
    const seriousList = uuid();
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: infoList }).forEach((notice) => {
        queue(notice);
      });
      generateNotices({ target: seriousList }).forEach((notice) => {
        queue(notice);
      });
    });
    return (
      <div className='h-full w-full' ref={noticeContainer}>
        <Notice.List
          id={infoList}
          hideClearAll
          parentRef={noticeContainer}
          placement='top'
          defaultColor='info'
        />
        <Notice.List
          id={seriousList}
          hideClearAll
          parentRef={noticeContainer}
          placement='bottom'
          defaultColor='serious'
        />

        <div className='flex flex-col gap-s'>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                color: 'info',
              })
            }
          >
            Dequeue: Info
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                color: 'serious',
              })
            }
          >
            Dequeue: Serious
          </Button>
        </div>
      </div>
    );
  },
};
