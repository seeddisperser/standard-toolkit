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
import { SearchField } from './index';

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  args: {
    isDisabled: false,
    isLoading: false,
    placeholder: 'Search',
    variant: 'outlined',
  },
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Styles for different parts of the search field',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
    placeholder: {
      control: 'text',
      type: 'string',
      table: { defaultValue: { summary: 'Search' } },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
      table: { defaultValue: { summary: 'outlined' } },
    },
    isLoading: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    isDisabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Storybook Search Field Component' />
  ),
};

export const WithCustomClassNames: Story = {
  args: {
    placeholder: 'Custom styled search',
    classNames: {
      searchField: 'border-2 border-blue-500 rounded-lg',
      input: 'bg-blue-50 text-blue-900',
      searchIcon: 'text-blue-600',
    },
  },
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Custom styled search field' />
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    placeholder: 'Searching...',
  },
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Loading search field' />
  ),
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Search products',
    classNames: {
      input: 'bg-gray-100',
      searchIcon: 'text-blue-600',
    },
  },
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Filled variant search field' />
  ),
};

export const WithEventHandlers: Story = {
  args: {
    placeholder: 'Type to search',
  },
  render: ({ ...args }) => (
    <SearchField
      {...args}
      aria-label='Search with event handlers'
      onSubmit={(value) => console.log('Search submitted:', value)}
      onChange={(value) => console.log('Search changed:', value)}
    />
  ),
};

export const WithProvider: Story = {
  render: () => (
    <SearchField.Provider variant='filled'>
      <div className='space-y-4'>
        <SearchField placeholder='Search 1' aria-label='First search field' />
        <SearchField placeholder='Search 2' aria-label='Second search field' />
      </div>
    </SearchField.Provider>
  ),
};

export const AllClassNames: Story = {
  args: {
    placeholder: 'Fully customized search',
    classNames: {
      searchField: 'border-2 border-purple-500 rounded-xl p-1',
      searchIcon: 'text-purple-600',
      input: 'bg-purple-50 text-purple-900 placeholder-purple-400',
      loadingIcon: 'text-purple-500',
      clearButton: 'text-purple-700 hover:text-purple-900',
    },
  },
  render: ({ ...args }) => (
    <SearchField {...args} aria-label='Fully customized search field' />
  ),
};
