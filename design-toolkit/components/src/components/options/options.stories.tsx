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

import Placeholder from '@accelint/icons/placeholder';
import {
  ListLayout as AriaListLayout,
  Virtualizer as AriaVirtualizer,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Options } from './';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

const meta = {
  title: 'Components/Options',
  component: Options,
  args: {
    size: 'large',
  },
  argTypes: {
    size: {
      control: 'select',
    },
  },
} satisfies Meta<typeof Options>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CustomOptionsItem {
  id: number;
  name: string;
  description?: string;
  isDisabled?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  children?: CustomOptionsItem[];
}

const items: CustomOptionsItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'Red Panda',
    description: 'Tree-dwelling mammal',
  },
  {
    id: 2,
    prefixIcon: <Placeholder />,
    name: 'Cat',
    description: 'Furry house pet',
    isDisabled: true,
  },
  {
    id: 3,
    prefixIcon: <Placeholder />,
    name: 'Dog',
    description: 'Loyal companion',
    suffixIcon: <Placeholder />,
  },
  {
    id: 4,
    prefixIcon: <Placeholder />,
    name: 'Aardvark',
    description: 'Ant-eating nocturnal',
    color: 'serious',
  },
  {
    id: 5,
    name: 'Kangaroo',
    description: 'Pouch-bearing jumper',
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'Snake',
    description: 'Slithering reptile',
  },
];

const itemsWithSections: CustomOptionsItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'North American Birds',
    children: [
      {
        id: 2,
        prefixIcon: <Placeholder />,
        name: 'Blue jay',
      },
      {
        id: 3,
        prefixIcon: <Placeholder />,
        name: 'Gray catbird',
      },
      {
        id: 4,
        prefixIcon: <Placeholder />,
        name: 'Black-capped chickadee',
      },
      {
        id: 5,
        prefixIcon: <Placeholder />,
        name: 'Song sparrow',
      },
    ],
  },
  {
    id: 6,
    prefixIcon: <Placeholder />,
    name: 'African Birds',
    children: [
      {
        id: 6,
        prefixIcon: <Placeholder />,
        name: 'Lilac-breasted roller',
      },
      {
        id: 7,
        prefixIcon: <Placeholder />,
        name: 'Hornbill',
      },
    ],
  },
];

export const Default: Story = {
  render: ({ children, ...args }) => (
    <Options {...args} items={items}>
      {(item) => (
        <Options.Item
          key={item.id}
          id={item.id}
          textValue={item.name}
          isDisabled={item.isDisabled}
        >
          {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
          <Options.Item.Content>
            <Options.Item.Label>{item.name}</Options.Item.Label>
            {item.description && (
              <Options.Item.Description>
                {item.description}
              </Options.Item.Description>
            )}
          </Options.Item.Content>
          {item.suffixIcon && <Icon>{item.suffixIcon}</Icon>}
        </Options.Item>
      )}
    </Options>
  ),
};

export const WithDynamicSections: Story = {
  render: ({ children, ...args }) => (
    <Options {...args} items={itemsWithSections}>
      {(section) => (
        <Options.Section header={section.name} items={section.children}>
          {({ children, ...item }) => (
            <Options.Item key={item.id} id={item.id} textValue={item.name}>
              {item.prefixIcon && <Icon>{item.prefixIcon}</Icon>}
              <Options.Item.Content>
                <Options.Item.Label>{item.name}</Options.Item.Label>
                {item.description && (
                  <Options.Item.Description>
                    {item.description}
                  </Options.Item.Description>
                )}
              </Options.Item.Content>
              {item.suffixIcon && <Icon>{item.suffixIcon}</Icon>}
            </Options.Item>
          )}
        </Options.Section>
      )}
    </Options>
  ),
};

export const WithStaticSections: Story = {
  render: ({ children, ...args }) => (
    <Options {...args}>
      <Options.Section
        header='North American Birds'
        classNames={{ section: 'w-[200px]' }}
      >
        <Options.Item textValue='Blue Jay'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Blue Jay</Options.Item.Label>
        </Options.Item>
        <Options.Item textValue='Gray catbird' color='serious'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Gray catbird</Options.Item.Label>
          <Options.Item.Description>A cool bird</Options.Item.Description>
        </Options.Item>
        <Options.Item textValue='Black-capped chickadee' color='critical'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Black-capped chickadee</Options.Item.Label>
        </Options.Item>
        <Options.Item textValue='Song Sparrow'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Song Sparrow</Options.Item.Label>
        </Options.Item>
      </Options.Section>
      <Options.Section header='African Birds'>
        <Options.Item textValue='Lilac-breasted roller'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Lilac-breasted roller</Options.Item.Label>
        </Options.Item>
        <Options.Item textValue='Hornbill'>
          <Icon>
            <Placeholder />
          </Icon>
          <Options.Item.Label>Hornbill</Options.Item.Label>
        </Options.Item>
      </Options.Section>
    </Options>
  ),
};

const manyItems = Array.from({ length: 5000 }, (_, index) => ({
  id: index,
  name: `Item ${index}`,
  icon: <Placeholder />,
}));

export const Virtualized: Story = {
  render: ({ children, ...args }) => (
    <div className='w-[200px]'>
      <AriaVirtualizer
        layout={AriaListLayout}
        layoutOptions={{ rowHeight: 32 }}
      >
        <Options {...args}>
          {manyItems.map((item) => (
            <Options.Item key={item.id} id={item.id} textValue={item.name}>
              {item.icon && <Icon>{item.icon}</Icon>}
              <Options.Item.Label>{item.name}</Options.Item.Label>
            </Options.Item>
          ))}
        </Options>
      </AriaVirtualizer>
    </div>
  ),
};
