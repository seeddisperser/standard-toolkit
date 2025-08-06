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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavigationStack } from '.';
import type { NavigationStackProps } from './types';

function setup({
  children = (
    <>
      <NavigationStack.View id='a'>A</NavigationStack.View>
      <NavigationStack.View id='b'>B</NavigationStack.View>
      <NavigationStack.View id='c'>C</NavigationStack.View>
    </>
  ),
  ...rest
}: Partial<NavigationStackProps> = {}) {
  return {
    ...render(<NavigationStack {...rest}>{children}</NavigationStack>),
    ...rest,
    children,
  };
}

describe('NavigationStack', () => {
  it('should render nothing', () => {
    setup();

    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });

  it('should render the default view', () => {
    setup({ defaultViewId: 'a' });

    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
