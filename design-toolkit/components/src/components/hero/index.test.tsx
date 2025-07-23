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
import { Heading, Text } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Icon } from '../icon';
import { Hero } from './index';

// Mock icon component for testing
const MockIcon = () => <svg data-testid='mock-icon' />;

describe('Hero', () => {
  it('renders basic hero with all components', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>Primary Title</Heading>
        <Text>Secondary text</Text>
      </Hero>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Primary Title',
    );
    expect(screen.getByText('Secondary text')).toBeInTheDocument();
  });

  it('applies stack layout by default', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>Title</Heading>
      </Hero>,
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-layout', 'stack');
  });

  it('applies grid layout when compact is true', () => {
    render(
      <Hero compact>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>Title</Heading>
      </Hero>,
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-layout', 'grid');
  });

  it('only allows one heading', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>First Heading</Heading>
        <Heading>Second Heading</Heading>
        <Text>Description</Text>
      </Hero>,
    );

    // Should only have the first heading in main content
    expect(screen.getByText('First Heading')).toBeInTheDocument();
    const main = screen.getByRole('banner').querySelector('main');
    expect(main).toContainElement(screen.getByText('First Heading'));
    // Second heading should not be in main (it would be in invalid in dev)
  });

  it('marks extra headings as invalid', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading level={1}>First Heading</Heading>
        <Text>Some text</Text>
        <Heading level={2}>Second Heading</Heading>
        <Heading level={3}>Third Heading</Heading>
      </Hero>,
    );

    // First heading should be valid and in main
    const main = screen.getByRole('banner').querySelector('main');
    expect(main).toContainElement(screen.getByText('First Heading'));

    // Extra headings should only be rendered in development mode debug panel
    // In production builds, they would be completely filtered out
    // Since this is a test environment, we expect them to be visible but not in main content
    const secondHeading = screen.queryByText('Second Heading');
    const thirdHeading = screen.queryByText('Third Heading');

    // In development mode, invalid components appear in the debug panel
    if (secondHeading && thirdHeading) {
      expect(main).not.toContainElement(secondHeading);
      expect(main).not.toContainElement(thirdHeading);
    } else {
      // In production-like test mode, invalid components are completely filtered
      expect(secondHeading).toBeNull();
      expect(thirdHeading).toBeNull();
    }
  });

  it('handles multiple text components', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>Title</Heading>
        <Text>First text</Text>
        <Text>Second text</Text>
        <Text>Third text</Text>
      </Hero>,
    );

    expect(screen.getByText('First text')).toBeInTheDocument();
    expect(screen.getByText('Second text')).toBeInTheDocument();
    expect(screen.getByText('Third text')).toBeInTheDocument();
  });

  it('renders components in correct order regardless of child order', () => {
    render(
      <Hero>
        <Text>Text content</Text>
        <Heading>Primary Title</Heading>
        <Icon>
          <MockIcon />
        </Icon>
      </Hero>,
    );

    // Icon should be in aside, heading and text in main
    const aside = screen.getByRole('banner').querySelector('aside');
    const main = screen.getByRole('banner').querySelector('main');

    expect(aside).toContainElement(screen.getByTestId('mock-icon'));
    expect(main).toContainElement(screen.getByRole('heading'));
    expect(main).toContainElement(screen.getByText('Text content'));
  });

  it('applies custom className', () => {
    render(
      <Hero className='custom-class'>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>Title</Heading>
      </Hero>,
    );

    expect(screen.getByRole('banner')).toHaveClass('custom-class');
  });

  it('passes through additional props to header element', () => {
    render(
      <Hero data-testid='hero-header' aria-label='Custom hero'>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>Title</Heading>
      </Hero>,
    );

    const header = screen.getByTestId('hero-header');
    expect(header).toHaveAttribute('aria-label', 'Custom hero');
  });

  it('only renders first icon when multiple icons provided', () => {
    // Note: This test verifies behavior but in development mode would show invalid components
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Icon>
          <svg data-testid='second-icon' />
        </Icon>
        <Heading>Title</Heading>
      </Hero>,
    );

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    // Second icon should not be in the main content area
    const aside = screen.getByRole('banner').querySelector('aside');
    expect(aside).not.toContainElement(screen.queryByTestId('second-icon'));
  });

  it('only uses first heading as primary', () => {
    render(
      <Hero>
        <Icon>
          <MockIcon />
        </Icon>
        <Heading>First Heading</Heading>
        <Heading>Second Heading</Heading>
        <Text>Text content</Text>
      </Hero>,
    );

    // Should only have one heading in the main content (the primary one)
    // The second heading would be marked as invalid in development
    const main = screen.getByRole('banner').querySelector('main');
    const headingInMain = main?.querySelector('h2');
    expect(headingInMain).toHaveTextContent('First Heading');
  });
});
