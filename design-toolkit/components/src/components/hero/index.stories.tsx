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
import type { Meta, StoryObj } from '@storybook/react';
import { Heading, Text } from 'react-aria-components';
import { Hero } from '.';
import { Icon } from '../icon';

const meta: Meta<typeof Hero> = {
  args: {
    compact: false,
  },
  argTypes: {
    compact: {
      control: 'boolean',
    },
    className: {
      control: false,
    },
  },
  component: Hero,
  title: 'Components/Hero',
};

export default meta;

export const Default: StoryObj<typeof Hero> = {
  render: (args) => (
    <div className='w-[480px]'>
      <Hero {...args}>
        <Icon size='large'>
          <Placeholder />
        </Icon>
        <Heading>{'{object.name}'}</Heading>
        <Text>additional-metadata-01</Text>
        <Text>additional-metadata-002</Text>
      </Hero>
    </div>
  ),
};

export const SlotOrdering: StoryObj<typeof Hero> = {
  render: (args) => (
    <div className='space-y-4'>
      <div className='w-[480px]'>
        <h3 className='mb-2 font-semibold text-sm'>Normal Order</h3>
        <Hero {...args}>
          <Icon size='large'>
            <Placeholder />
          </Icon>
          <Heading>Primary Content</Heading>
          <Text>Secondary Information</Text>
        </Hero>
      </div>

      <div className='w-[480px]'>
        <h3 className='mb-2 font-semibold text-sm'>
          Reversed Order (should render the same)
        </h3>
        <Hero {...args}>
          <Text>Secondary Information 3</Text>
          <Text>Secondary Information 2</Text>
          <Text>Secondary Information 1</Text>
          <Heading>Primary Content</Heading>
          <Icon size='large'>
            <Placeholder />
          </Icon>
        </Hero>
      </div>

      <div className='w-[480px]'>
        <h3 className='mb-2 font-semibold text-sm'>
          Mixed with other elements
        </h3>
        <Hero {...args}>
          <div>This is a regular div</div>
          <Text>Secondary Information</Text>
          <span>Another regular element</span>
          <Heading>Primary Content</Heading>
          <Icon size='large'>
            <Placeholder />
          </Icon>
          <p>Yet another element</p>
        </Hero>
      </div>
    </div>
  ),
};
