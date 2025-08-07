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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../button';
import { NavigationStack } from './';
import type { NavigationStackProps } from './types';

const ids = {
  stack: uuid(),
  a: uuid(),
  b: uuid(),
  c: uuid(),
};

function setup({
  id = ids.stack,
  children = (
    <>
      <NavigationStack.View id={ids.a}>A</NavigationStack.View>
      <NavigationStack.View id={ids.b}>B</NavigationStack.View>
      <NavigationStack.View id={ids.c}>C</NavigationStack.View>
      <NavigationStack.Trigger for={ids.a}>
        <Button>Goto A</Button>
      </NavigationStack.Trigger>
      <NavigationStack.Trigger for={ids.b}>
        <Button>Goto B</Button>
      </NavigationStack.Trigger>
      <NavigationStack.Trigger for={ids.c}>
        <Button>Goto C</Button>
      </NavigationStack.Trigger>
      <NavigationStack.Trigger for='back'>
        <Button>Back</Button>
      </NavigationStack.Trigger>
      <NavigationStack.Trigger for='clear'>
        <Button>Clear</Button>
      </NavigationStack.Trigger>
    </>
  ),
  ...rest
}: Partial<NavigationStackProps> = {}) {
  return {
    ...render(
      <NavigationStack {...rest} id={id}>
        {children}
      </NavigationStack>,
    ),
    ...rest,
    id,
    children,
  };
}

describe('NavigationStack', () => {
  it('should render nothing', () => {
    setup();

    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });

  it('should render the default view', () => {
    setup({ defaultView: ids.a });

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should navigate to a view', async () => {
    setup();

    expect(screen.queryByText('A')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Goto A'));

    expect(screen.getByText('A')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Goto B'));

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should navigate back to previous view', async () => {
    setup({ defaultView: ids.a });

    await userEvent.click(screen.getByText('Goto B'));

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Back'));

    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should clear the stack', async () => {
    setup();

    await userEvent.click(screen.getByText('Goto A'));

    expect(screen.getByText('A')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Goto B'));

    expect(screen.getByText('B')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Goto C'));

    expect(screen.getByText('C')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Clear'));

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });
});
