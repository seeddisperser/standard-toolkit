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
import { ClassificationBadge } from './index';
import type { ClassificationBadgeProps } from './types';

function setup({
  children = 'Unclassified',
  ...rest
}: Partial<ClassificationBadgeProps> = {}) {
  render(<ClassificationBadge {...rest}>{children}</ClassificationBadge>);

  return {
    ...rest,
    children,
  };
}

describe('Classification Badge', () => {
  it('should render unclassified variant', () => {
    const { children } = setup({
      children: 'Unclassified',
      variant: 'unclassified',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      'fg-default-light',
      'bg-classification-unclass',
    );
  });

  it('should render missing variant', () => {
    const { children } = setup({
      children: 'Missing',
      variant: 'missing',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('fg-critical', 'bg-classification-missing');
  });

  it('should render cui variant', () => {
    const { children } = setup({
      children: 'CUI',
      variant: 'cui',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('fg-default-light', 'bg-classification-cui');
  });

  it('should render confidential variant', () => {
    const { children } = setup({
      children: 'Confidential',
      variant: 'confidential',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      'fg-default-light',
      'bg-classification-confidential',
    );
  });

  it('should render secret variant', () => {
    const { children } = setup({
      children: 'Secret',
      variant: 'secret',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      'fg-default-light',
      'bg-classification-secret',
    );
  });

  it('should render top-secret variant', () => {
    const { children } = setup({
      children: 'Top Secret',
      variant: 'top-secret',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      'fg-inverse-light',
      'bg-classification-top-secret',
    );
  });

  it('should render ts-sci variant', () => {
    const { children } = setup({
      children: 'TS/SCI',
      variant: 'ts-sci',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass(
      'fg-inverse-light',
      'bg-classification-ts-sci',
    );
  });

  it('should default to missing variant', () => {
    const { children } = setup({
      children: 'Missing',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('fg-critical', 'bg-classification-missing');
  });

  it('should default to medium size', () => {
    const { children } = setup({
      children: 'Missing',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('px-s', 'py-xs', 'text-header-s');
  });

  it('should override size', () => {
    const { children } = setup({
      children: 'Missing',
      size: 'small',
    });

    const component = screen.getByText(`${children}`);

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('px-s', 'py-xs', 'text-header-xs');
  });
});
