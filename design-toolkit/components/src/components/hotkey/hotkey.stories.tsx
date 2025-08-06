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

import MouseRightClick from '@accelint/icons/mouse-right-click';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../icon';
import { Hotkey } from './index';

const meta: Meta<typeof Hotkey> = {
  title: 'Components/Hotkey',
  component: Hotkey,
  args: {
    variant: 'outline',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'flat', 'icon'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Hotkey> = {
  render: (args) => {
    return (
      <div className='flex flex-col gap-xl'>
        <Hotkey {...args}>⌘V</Hotkey>
        <Hotkey.Set>
          <Hotkey {...args}>ctrl</Hotkey> + <Hotkey {...args}>⌘V</Hotkey>
        </Hotkey.Set>
        <Hotkey.Set>
          <Hotkey {...args}>CMD</Hotkey>+
          <Hotkey variant='icon'>
            <Icon>
              <MouseRightClick />
            </Icon>
          </Hotkey>
          +<Hotkey {...args}>⌘V</Hotkey>
        </Hotkey.Set>
        <Hotkey.Set>
          <Hotkey {...args}>CMD</Hotkey>+
          <Hotkey variant='icon'>
            <Icon>
              <MouseRightClick />
            </Icon>
          </Hotkey>
          +<Hotkey {...args}>⌘V</Hotkey>
        </Hotkey.Set>
      </div>
    );
  },
};
