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

import type { Meta, StoryObj } from '@storybook/react';
import { Add, Check, Group } from '@accelint/icons';
import { Tabs } from '@/components/tabs/index';
import { Icon } from '@/components/icon';

/**
 * The `<Tabs>` component is a direct wrapper around the Tabs component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Tabs.html">here</a>.
 */
const meta: Meta<typeof Tabs.TabList> = {
  title: 'Components/Tabs.TabList',
  component: Tabs.TabList,
  args: {
    isIcons: false,
    isDrawer: undefined,
  },
  argTypes: {
    isIcons: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    isDrawer: {
      control: 'select',
      options: [undefined, 'left', 'right', 'top', 'bottom'],
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs.TabList>;

export const Default: Story = {
  render: ({...args}) => (
    <div className="flex flex-col w-[500px] gap-m">
      <h5 className="fg-default-light">Horizontal Orientation</h5>
      <div className="flex flex-row w-full justify-center">
        <div className="basis-full">
          <Tabs>
            <Tabs.TabList {...args} label="Storybook Tab List">
              <Tabs.Tab id="Storybook-Tab-1">Tab 1</Tabs.Tab>
              <Tabs.Tab id="Storybook-Tab-2">Tab 2</Tabs.Tab>
              <Tabs.Tab id="Storybook-Tab-3">Tab 3</Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        </div>
        <div className="basis-full">
          <Tabs>
            <Tabs.TabList {...args} label="Storybook Icon Tab List">
              <Tabs.Tab id="Storybook-Icon-Tab-1"><Icon><Add /></Icon></Tabs.Tab>
              <Tabs.Tab id="Storybook-Icon-Tab-2"><Icon><Check /></Icon></Tabs.Tab>
              <Tabs.Tab id="Storybook-Icon-Tab-3"><Icon><Group /></Icon></Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        </div>
      </div>
      <h5 className="fg-default-light">Vertical Orientation</h5>
      <div className="flex flex-row w-full justify-center">
        <div className="basis-full">
          <Tabs orientation="vertical">
            <Tabs.TabList {...args} label="Storybook Vertical Tab List">
              <Tabs.Tab id="Storybook-Vert-Tab-1">Tab 1</Tabs.Tab>
              <Tabs.Tab id="Storybook-Vert-Tab-2">Tab 2</Tabs.Tab>
              <Tabs.Tab id="Storybook-Vert-Tab-3">Tab 3</Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        </div>
        <div className="basis-full">
          <Tabs orientation="vertical">
            <Tabs.TabList {...args} label="Storybook Vertical Icon Tab List">
              <Tabs.Tab id="Storybook-Vert-Icon-Tab-1"><Icon><Add /></Icon></Tabs.Tab>
              <Tabs.Tab id="Storybook-Vert-Icon-Tab-2"><Icon><Check /></Icon></Tabs.Tab>
              <Tabs.Tab id="Storybook-Vert-Icon-Tab-3"><Icon><Group /></Icon></Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        </div>
      </div>
    </div>
  ),
};
