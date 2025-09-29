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
import { useEffect, useRef, useState } from 'react';
import { Button } from '../button';
import { Notice } from './';
import { NoticeEventTypes } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  NoticeContent,
  NoticeDequeueEvent,
  NoticeQueueEvent,
} from './types';

const meta: Meta<typeof Notice.List> = {
  title: 'Components/Notice.List',
  component: Notice.List,
  args: {
    defaultColor: 'info',
    placement: 'top',
    size: 'medium',
    hideClearAll: true,
    limit: 3,
  },
  argTypes: {
    defaultColor: {
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

export const Default: StoryObj<typeof Notice.List> = {
  render: (args) => {
    const noticeContainer = useRef(null);
    const emit = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    return (
      <div className='h-full w-full border' ref={noticeContainer}>
        <Notice.List
          {...args}
          aria-label='notice-list'
          parentRef={noticeContainer}
        />
        <Button
          onPress={() =>
            emit({
              message:
                'This is a flexible snackbar that can be either a single or double line that will wrap accordingly when it gets too long for a single line.',
            })
          }
        >
          Create Notice
        </Button>
      </div>
    );
  },
};

function generateNotices({ color, target, metadata }: Partial<NoticeContent>) {
  return Array.from({ length: 5 }, () => {
    const id = uuid();
    return {
      id,
      target,
      message: id,
      color,
      metadata,
    } as NoticeContent;
  });
}

export const DequeueSingle: StoryObj<typeof Notice.List> = {
  render: () => {
    const noticeContainer = useRef(null);
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    const [notices, setNotices] = useState(generateNotices({ color: 'info' }));
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
          parentRef={noticeContainer}
          aria-label='notice-list'
          placement='bottom left'
          hideClearAll
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

export const DequeueList: StoryObj<typeof Notice.List> = {
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
          aria-label='info-notices'
          hideClearAll
          parentRef={noticeContainer}
          placement='top'
          defaultColor='info'
        />
        <Notice.List
          id={seriousList}
          aria-label='serious-notices'
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

export const DequeueColor: StoryObj<typeof Notice.List> = {
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
          aria-label='info-notices'
          hideClearAll
          parentRef={noticeContainer}
          placement='top'
          defaultColor='info'
        />
        <Notice.List
          id={seriousList}
          aria-label='serious-notices'
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

export const DequeueMetadata: StoryObj<typeof Notice.List> = {
  render: () => {
    const noticeContainer = useRef(null);
    const a = uuid();
    const b = uuid();
    const c = uuid();
    const d = uuid();
    const metadataA = { shape: 'circle' };
    const metadataB = { shape: 'square' };
    const metadataC = { shapes: ['circle', 'square'] };
    const metadataD = { shapes: { shape: 'square' } };
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: a, metadata: metadataA }).forEach(
        (notice, index) => {
          notice.metadata = index % 2 === 0 ? metadataA : metadataB;
          notice.message = JSON.stringify(notice.metadata);
          queue(notice);
        },
      );
      generateNotices({ target: b, metadata: metadataB }).forEach(
        (notice, index) => {
          notice.metadata = index % 2 === 0 ? metadataB : metadataA;
          notice.message = JSON.stringify(notice.metadata);
          queue(notice);
        },
      );

      generateNotices({
        target: c,
        metadata: metadataC,
      }).forEach((notice, index) => {
        notice.metadata = index % 2 === 0 ? metadataC : metadataD;
        notice.message = JSON.stringify(notice.metadata);
        queue(notice);
      });
      generateNotices({
        target: d,
        metadata: metadataD,
      }).forEach((notice, index) => {
        notice.metadata = index % 2 === 0 ? metadataD : metadataC;
        notice.message = JSON.stringify(notice.metadata);
        queue(notice);
      });
    });
    return (
      <div className='h-full w-full' ref={noticeContainer}>
        <Notice.List
          id={a}
          aria-label='notices-a'
          hideClearAll
          parentRef={noticeContainer}
          placement='top left'
          defaultColor='info'
        />
        <Notice.List
          id={b}
          aria-label='notices-b'
          hideClearAll
          parentRef={noticeContainer}
          placement='top right'
          defaultColor='serious'
        />
        <Notice.List
          id={c}
          aria-label='notices-c'
          hideClearAll
          parentRef={noticeContainer}
          placement='bottom left'
          defaultColor='info'
        />
        <Notice.List
          id={d}
          aria-label='notices-d'
          hideClearAll
          parentRef={noticeContainer}
          placement='bottom right'
          defaultColor='serious'
        />

        <div className='flex flex-col gap-s'>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                metadata: metadataA,
              })
            }
          >
            Dequeue: {JSON.stringify(metadataA)}
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                metadata: metadataB,
              })
            }
          >
            Dequeue: {JSON.stringify(metadataB)}
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                metadata: metadataC,
              })
            }
          >
            Dequeue: {JSON.stringify(metadataC)}
          </Button>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                metadata: metadataD,
              })
            }
          >
            Dequeue: {JSON.stringify(metadataD)}
          </Button>
        </div>
      </div>
    );
  },
};

export const DequeueCombination: StoryObj<typeof Notice.List> = {
  render: () => {
    const noticeContainer = useRef(null);
    const a = uuid();
    const b = uuid();
    const circleMetadata = { shape: 'circle' };
    const squareMetadata = { shape: 'square' };
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: a }).forEach((notice, index) => {
        notice.metadata = index % 2 === 0 ? circleMetadata : squareMetadata;
        notice.message = `List A: ${JSON.stringify(notice.metadata)}`;
        notice.color = index % 2 === 0 ? 'info' : 'serious';
        queue(notice);
      });
      generateNotices({ target: b }).forEach((notice, index) => {
        notice.metadata = index % 2 === 0 ? squareMetadata : circleMetadata;
        notice.message = `List B: ${JSON.stringify(notice.metadata)}`;
        notice.color = index % 2 === 0 ? 'info' : 'serious';
        queue(notice);
      });
    });
    return (
      <div className='h-full w-full' ref={noticeContainer}>
        <Notice.List
          id={a}
          aria-label='notices-a'
          hideClearAll
          parentRef={noticeContainer}
          placement='top left'
        />
        <Notice.List
          id={b}
          aria-label='notices-b'
          hideClearAll
          parentRef={noticeContainer}
          placement='top right'
        />

        <div className='flex flex-col gap-s'>
          <Button
            className='w-full'
            variant='outline'
            onPress={() =>
              dequeue({
                target: a,
                color: 'serious',
                metadata: squareMetadata,
              })
            }
          >
            Dequeue: Serious squares from list a
          </Button>
        </div>
      </div>
    );
  },
};
