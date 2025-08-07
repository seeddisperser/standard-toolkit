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

import { uuid } from '@accelint/core';
import { ChevronLeft } from '@accelint/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Icon } from '../icon';
import { NavigationStack } from './index';

const meta: Meta<typeof NavigationStack> = {
  title: 'Components/NavigationStack',
  component: NavigationStack,
  parameters: {
    docs: {
      description: {
        component: `
          The NavigationStack component allows you to manage a stack of views. Think of it as similar to the
          functionality of tabs, but the triggers can be anywhere, even programmatic. The NavigationStack
          component provides a way to push and pop views from the stack as well as clear all or reset back
          to the original view.
        `,
      },
    },
  },
};

export default meta;

const ids = {
  stack: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

export const Default: StoryObj<typeof NavigationStack> = {
  render: () => (
    <>
      <NavigationStack id={ids.stack} defaultView={ids.a}>
        <NavigationStack.View id={ids.a}>
          <NavigationStack.Trigger for={ids.b}>
            <Button size='small' variant='flat'>
              Push View B
            </Button>
          </NavigationStack.Trigger>
          <h1 className='fg-default-light h-oversized text-center'>View A</h1>
        </NavigationStack.View>
        <NavigationStack.View id={ids.b}>
          <div className='flex'>
            <NavigationStack.Trigger for='back'>
              <Button variant='icon'>
                <Icon>
                  <ChevronLeft />
                </Icon>
              </Button>
            </NavigationStack.Trigger>
            <NavigationStack.Trigger for={ids.c}>
              <Button size='small' variant='flat'>
                Push View C
              </Button>
            </NavigationStack.Trigger>
          </div>
          <h1 className='fg-default-light h-oversized text-center'>View B</h1>
        </NavigationStack.View>
        <NavigationStack.View id={ids.c}>
          <NavigationStack.Trigger for='back'>
            <Button variant='icon'>
              <Icon>
                <ChevronLeft />
              </Icon>
            </Button>
          </NavigationStack.Trigger>
          <h1 className='fg-default-light h-oversized text-center'>View C</h1>
        </NavigationStack.View>
      </NavigationStack>
      <div className='flex gap-s'>
        <NavigationStack.Trigger for={[`clear:${ids.stack}`, ids.a]}>
          <Button variant='flat'>Goto View A</Button>
        </NavigationStack.Trigger>
        <NavigationStack.Trigger for={[`clear:${ids.stack}`, ids.b]}>
          <Button variant='flat'>Goto View B</Button>
        </NavigationStack.Trigger>
        <NavigationStack.Trigger for={[`clear:${ids.stack}`, ids.c]}>
          <Button variant='flat'>Goto View C</Button>
        </NavigationStack.Trigger>
      </div>
    </>
  ),
};
