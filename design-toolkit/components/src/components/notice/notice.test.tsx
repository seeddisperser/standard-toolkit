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
import { describe, expect, it } from 'vitest';
import { Notice } from './';
import type { NoticeProps } from './types';

function setup(props: NoticeProps) {
  render(<Notice {...props} />);

  return props;
}

describe('Notice', () => {
  it('should render message', () => {
    const message = 'Hello';
    const id = uuid();

    setup({
      id,
      message,
    });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should render close button', () => {
    const message = 'Hello';
    const id = uuid();

    setup({
      id,
      message,
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render close button', () => {
    const message = 'Hello';
    const id = uuid();

    setup({
      id,
      message,
      showClose: true,
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render primary button', () => {
    const message = 'Hello';
    const id = uuid();

    setup({
      id,
      message,
      primary: { children: 'Primary Action' },
    });

    expect(
      screen.getByRole('button', { name: 'Primary Action' }),
    ).toBeInTheDocument();
  });

  it('should render secondary button', () => {
    const message = 'Hello';
    const id = uuid();

    setup({
      id,
      message,
      secondary: { children: 'Secondary Action' },
    });

    expect(
      screen.getByRole('button', { name: 'Secondary Action' }),
    ).toBeInTheDocument();
  });
});
