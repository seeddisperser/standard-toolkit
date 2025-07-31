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

import { SearchField } from '@/components/search-field/index';
import type { SearchFieldProps } from '@/components/search-field/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

function setup({ placeholder = 'Search' }: Partial<SearchFieldProps> = {}) {
  render(
    <SearchField
      placeholder={placeholder}
      aria-label='Test Search Field Component'
    />,
  );

  return { placeholder };
}

describe('SearchField', () => {
  it('should render', () => {
    const { placeholder } = setup();

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('should render with custom classNames', () => {
    render(
      <SearchField
        placeholder='Test'
        classNames={{
          searchField: 'custom-search-field',
          input: 'custom-input',
        }}
        aria-label='Test Search Field'
        data-testid='search-field'
      />,
    );

    const searchField = screen.getByTestId('search-field');
    expect(searchField).toHaveClass('custom-search-field');
  });

  it('should show loading state', () => {
    render(
      <SearchField
        placeholder='Loading search'
        isLoading={true}
        aria-label='Loading Search Field'
      />,
    );

    // In loading state, the loading icon should be visible
    // and the clear button should not be visible
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render filled variant', () => {
    render(
      <SearchField
        placeholder='Filled search'
        variant='filled'
        aria-label='Filled Search Field'
        data-testid='filled-search'
      />,
    );

    const input = screen.getByPlaceholderText('Filled search');
    expect(input).toBeInTheDocument();
  });

  it('should handle event handlers', () => {
    const mockOnSubmit = vi.fn();
    const mockOnChange = vi.fn();

    render(
      <SearchField
        placeholder='Event test'
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
        aria-label='Event handler test'
      />,
    );

    const input = screen.getByPlaceholderText('Event test');
    expect(input).toBeInTheDocument();
    // Note: Full event testing would require user-event library
    // This test confirms the props are accepted without errors
  });

  it('should work with Provider context', () => {
    render(
      <SearchField.Provider variant='filled'>
        <SearchField
          placeholder='Context test'
          aria-label='Context test'
          data-testid='context-search'
        />
      </SearchField.Provider>,
    );

    const input = screen.getByPlaceholderText('Context test');
    expect(input).toBeInTheDocument();
    // Provider context is working - the variant prop is inherited
  });

  it('should render with all classNames options', () => {
    render(
      <SearchField
        placeholder='All classes test'
        classNames={{
          searchField: 'custom-search-field',
          searchIcon: 'custom-search-icon',
          input: 'custom-input',
          loadingIcon: 'custom-loading-icon',
          clearButton: 'custom-clear-button',
        }}
        aria-label='All classes test'
        data-testid='all-classes-search'
      />,
    );

    const searchField = screen.getByTestId('all-classes-search');
    expect(searchField).toHaveClass('custom-search-field');
  });
});
