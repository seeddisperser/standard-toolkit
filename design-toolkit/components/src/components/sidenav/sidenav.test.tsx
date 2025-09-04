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

import { Placeholder } from '@accelint/icons';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { Heading, Text } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { Icon } from '../icon';
import { Sidenav } from './';
import type { SidenavProps } from './types';

function setup(
  {
    children = (
      <>
        <Sidenav>
          <Sidenav.Header>
            <Icon size='large'>
              <Placeholder />
            </Icon>
            <div>
              <Heading>Application Header</Heading>
              <Heading>subheader</Heading>
            </div>
          </Sidenav.Header>

          <Heading>Title</Heading>
          <Sidenav.Item>
            <Icon>
              <Placeholder />
            </Icon>
            <Text>Nav item</Text>
          </Sidenav.Item>
          <Sidenav.Header placement='bottom'>
            <Icon>
              <Placeholder />
            </Icon>
            <div>
              <Heading>FirstName LastName</Heading>
              <Heading>Secondary Text</Heading>
            </div>
          </Sidenav.Header>
        </Sidenav>
      </>
    ),
    ...rest
  }: Partial<SidenavProps> = {},
  outside: ReactNode = (
    <Sidenav.Trigger>
      <Button>Open</Button>
    </Sidenav.Trigger>
  ),
) {
  return {
    ...render(
      <>
        <Sidenav {...rest}>{children}</Sidenav>
        {outside}
      </>,
    ),
    ...rest,
    children,
  };
}

describe('Sidenav', () => {
  it('should not render expanded content', () => {
    setup();

    expect(screen.queryByText('Application Header')).not.toBeInTheDocument();
    expect(screen.queryByText('subheader')).not.toBeInTheDocument();
    expect(screen.queryByText('Nav Item')).not.toBeInTheDocument();
    expect(screen.queryByText('FirstName LastName')).not.toBeInTheDocument();
    expect(screen.queryByText('Secondary Text')).not.toBeInTheDocument();
  });

  it('should be externally openable', async () => {
    setup();

    await userEvent.click(screen.getByText('Open'));

    expect(screen.queryByText('Application Header')).toBeInTheDocument();
    expect(screen.queryByText('subheader')).toBeInTheDocument();
    expect(screen.queryByText('Nav Item')).toBeInTheDocument();
    expect(screen.queryByText('FirstName LastName')).toBeInTheDocument();
    expect(screen.queryByText('Secondary Text')).toBeInTheDocument();
  });

  it('should close', async () => {
    await userEvent.click(screen.getByText('Open'));

    expect(screen.queryByText('Application Header')).toBeInTheDocument();
    expect(screen.queryByText('subheader')).toBeInTheDocument();
    expect(screen.queryByText('Nav Item')).toBeInTheDocument();
    expect(screen.queryByText('FirstName LastName')).toBeInTheDocument();
    expect(screen.queryByText('Secondary Text')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Open'));

    expect(screen.queryByText('Application Header')).not.toBeInTheDocument();
    expect(screen.queryByText('subheader')).not.toBeInTheDocument();
    expect(screen.queryByText('Nav Item')).not.toBeInTheDocument();
    expect(screen.queryByText('FirstName LastName')).not.toBeInTheDocument();
    expect(screen.queryByText('Secondary Text')).not.toBeInTheDocument();
  });
});
