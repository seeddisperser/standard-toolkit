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

import Kebab from '@accelint/icons/kebab';
import Placeholder from '@accelint/icons/placeholder';
import { type ReactNode, useRef, useState } from 'react';
import { Button } from '../button';
import { Hotkey } from '../hotkey';
import { Icon } from '../icon';
import { Menu } from './';
import type { Meta, StoryObj } from '@storybook/react';
import type { MenuItemProps } from './types';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  args: {
    variant: 'cozy',
    selectionMode: 'single',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['cozy', 'compact'],
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'none'],
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  prefixIcon?: ReactNode;
  children?: MenuItem[];
  isDisabled?: boolean;
  hotkey?: string;
  color?: MenuItemProps['color'];
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    prefixIcon: <Placeholder />,
    name: 'North American Birds',
    children: [
      {
        id: 2,
        prefixIcon: <Placeholder />,
        name: 'Blue jay',
        description: 'Cyanocitta cristata',
        color: 'serious',
      },
      {
        id: 3,
        prefixIcon: <Placeholder />,
        name: 'Gray catbird',
        description: 'Dumetella carolinensis',
        isDisabled: true,
        hotkey: '⌘V',
      },
      {
        id: 4,
        prefixIcon: <Placeholder />,
        name: 'Black-capped chickadee',
        description: 'Poecile atricapillus',
        color: 'critical',
      },
      {
        id: 5,
        prefixIcon: <Placeholder />,
        name: 'Song sparrow',
        description: 'Melospiza melodia',
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
        description: 'Coracias caudatus',
      },
      {
        id: 7,
        prefixIcon: <Placeholder />,
        name: 'Hornbill',
        description: 'Bucerotidae',
      },
    ],
  },
];

export const Basic: Story = {
  render: (args) => (
    <Menu.Trigger>
      <Button variant='icon' aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </Button>
      <Menu {...args}>
        <Menu.Item>
          <Icon>
            <Placeholder />
          </Icon>
          <Menu.Item.Label>Songbirds</Menu.Item.Label>
          <Hotkey variant='flat'>⌘A</Hotkey>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Submenu>
          <Menu.Item>
            <Menu.Item.Label>North American Birds</Menu.Item.Label>
          </Menu.Item>
          <Menu>
            <Menu.Item>
              <Icon>
                <Placeholder />
              </Icon>
              <Menu.Item.Label>Blue Jay</Menu.Item.Label>
              <Menu.Item.Description>Cyanocitta cristata</Menu.Item.Description>
            </Menu.Item>
            <Menu.Item isDisabled>
              <Icon>
                <Placeholder />
              </Icon>
              <Menu.Item.Label>Gray catbird</Menu.Item.Label>
              <Menu.Item.Description>
                Dumetella carolinensis
              </Menu.Item.Description>
            </Menu.Item>
          </Menu>
        </Menu.Submenu>
        <Menu.Separator />
        <Menu.Section title='Additional Notable Species'>
          <Menu.Item color='serious'>
            <Icon>
              <Placeholder />
            </Icon>
            <Menu.Item.Label>Mallard</Menu.Item.Label>
            <Menu.Item.Description>Anas platyrhynchos</Menu.Item.Description>
            <Hotkey variant='flat'>⌘V</Hotkey>
          </Menu.Item>
          <Menu.Item color='critical'>
            <Icon>
              <Placeholder />
            </Icon>
            <Menu.Item.Label>Chimney swift</Menu.Item.Label>
            <Menu.Item.Description>Chaetura pelagica</Menu.Item.Description>
          </Menu.Item>
          <Menu.Item>
            <Icon>
              <Placeholder />
            </Icon>
            <Menu.Item.Label>Brünnich's guillemot</Menu.Item.Label>
            <Menu.Item.Description>
              Dumetella carolinensis
            </Menu.Item.Description>
            <Hotkey variant='flat'>⌘X</Hotkey>
          </Menu.Item>
        </Menu.Section>
      </Menu>
    </Menu.Trigger>
  ),
};

export const Dynamic: Story = {
  render: (args) => (
    <Menu.Trigger>
      <Button variant='icon' aria-label='Menu'>
        <Icon>
          <Kebab />
        </Icon>
      </Button>
      <Menu<MenuItem> {...args} items={menuItems}>
        {function render(item) {
          if (item.children) {
            return (
              <Menu.Submenu>
                <Menu.Item
                  key={item.id}
                  isDisabled={item.isDisabled}
                  color={item.color}
                >
                  <Icon>{item.prefixIcon}</Icon>
                  <Menu.Item.Label>{item.name}</Menu.Item.Label>
                  {item.description && (
                    <Menu.Item.Description>
                      {item.description}
                    </Menu.Item.Description>
                  )}
                  {item.hotkey && <Hotkey variant='flat'>{item.hotkey}</Hotkey>}
                </Menu.Item>
                <Menu items={item.children}>{(item) => render(item)}</Menu>
              </Menu.Submenu>
            );
          }
          return (
            <Menu.Item
              key={item.id}
              isDisabled={item.isDisabled}
              color={item.color}
            >
              <Icon>{item.prefixIcon}</Icon>
              <Menu.Item.Label>{item.name}</Menu.Item.Label>
              {item.description && (
                <Menu.Item.Description>
                  {item.description}
                </Menu.Item.Description>
              )}
              {item.hotkey && <Hotkey variant='flat'>{item.hotkey}</Hotkey>}
            </Menu.Item>
          );
        }}
      </Menu>
    </Menu.Trigger>
  ),
};

export const ContextMenu: Story = {
  render: () => {
    const [menuPosition, setMenuPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const menuPositionRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role='menu'
        className='fg-primary-bold m-xl flex h-dvh w-dvh items-center justify-center bg-surface-raised'
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuPosition({ x: e.clientX, y: e.clientY });
        }}
      >
        right-click for context menu
        <div
          ref={menuPositionRef}
          style={{
            position: 'fixed',
            top: menuPosition?.y,
            left: menuPosition?.x,
          }}
          data-pressed={!!menuPosition || undefined}
        >
          <Menu<MenuItem>
            popoverProps={{
              placement: 'bottom left',
              offset: 0,
              isOpen: !!menuPosition,
              triggerRef: menuPositionRef,
              onOpenChange: (isOpen) => {
                if (!isOpen) {
                  setMenuPosition(null);
                }
              },
            }}
            onClose={() => setMenuPosition(null)}
            items={menuItems}
          >
            {function render(item) {
              if (item.children) {
                return (
                  <Menu.Submenu>
                    <Menu.Item
                      key={item.id}
                      isDisabled={item.isDisabled}
                      color={item.color}
                    >
                      <Menu.Item.Label>{item.name}</Menu.Item.Label>
                      {item.hotkey && (
                        <Hotkey variant='flat'>{item.hotkey}</Hotkey>
                      )}
                    </Menu.Item>
                    <Menu items={item.children}>{(item) => render(item)}</Menu>
                  </Menu.Submenu>
                );
              }
              return (
                <Menu.Item
                  key={item.id}
                  isDisabled={item.isDisabled}
                  color={item.color}
                >
                  <Menu.Item.Label>{item.name}</Menu.Item.Label>
                  {item.hotkey && <Hotkey variant='flat'>{item.hotkey}</Hotkey>}
                </Menu.Item>
              );
            }}
          </Menu>
        </div>
      </div>
    );
  },
};
