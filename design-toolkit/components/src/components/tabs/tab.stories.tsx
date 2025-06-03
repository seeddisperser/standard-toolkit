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
import { Tabs } from '@/components/tabs/index';

/**
 * The `<Tab>` component is a direct wrapper around the Tab component from
 * `react-aria-components`.
 *
 * Please see the documentation for that component <a href="https://react-spectrum.adobe.com/react-aria/Tabs.html">here</a>.
 */
const meta: Meta<typeof Tabs.Tab> = {
  title: 'Components/Tabs.Tab',
  component: Tabs.Tab,
  args: {
    id: 'Storybook-Tab-3',
    children: 'Tab 3',
    isDisabled: false,
  },
  argTypes: {
    id: {
      control: 'text',
    },
    children: {
      control: 'object',
    },
    isDisabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs.Tab>;

export const Default: Story = {
  render: ({ id, isDisabled, children }) => (
    <div>
      <Tabs orientation="horizontal">
        <Tabs.TabList label="Storybook Horizontal Tab List">
          <Tabs.Tab id="Storybook-Tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="Storybook-Tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab id={`${id}-horizontal`} isDisabled={isDisabled}>{children}</Tabs.Tab>
        </Tabs.TabList>
      </Tabs>
      <br />
      <Tabs orientation="vertical">
        <Tabs.TabList label="Storybook Vertical Tab List">
          <Tabs.Tab id="Storybook-Tab-1">Tab 1</Tabs.Tab>
          <Tabs.Tab id="Storybook-Tab-2">Tab 2</Tabs.Tab>
          <Tabs.Tab id={`${id}-vertical`} isDisabled={isDisabled}>{children}</Tabs.Tab>
        </Tabs.TabList>
      </Tabs>
    </div>
  ),
};
