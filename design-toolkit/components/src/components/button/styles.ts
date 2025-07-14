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

import { tv } from '@/lib/utils';

export const ButtonStylesDefaults = {
  color: 'info',
  size: 'medium',
  variant: 'filled',
  isCurrent: false,
  isPending: false,
  isSelected: false,
} as const;

const BaseButtonStyles = tv({
  base: [
    'flex w-content cursor-pointer items-center justify-center rounded-medium outline outline-transparent',
    'disabled:cursor-not-allowed',
  ],
  variants: {
    color: {
      info: '',
      serious: '',
      critical: '',
    },
    size: {
      large: 'gap-xs px-m py-s text-button-l',
      medium: 'gap-xs px-m py-s text-button-m',
      small: 'gap-xxs px-s py-xs text-button-s',
      xsmall: 'gap-xxs px-s py-xs text-button-xs',
    },
    variant: {
      filled: 'disabled:fg-disabled disabled:bg-interactive-disabled',
      outline: 'disabled:fg-disabled disabled:outline-interactive-disabled',
      flat: 'disabled:fg-disabled disabled:bg-transparent',
      icon: 'disabled:fg-disabled disabled:bg-transparent',
      floating: [
        'rounded-full',
        'disabled:fg-disabled disabled:bg-interactive-disabled disabled:outline-interactive-disabled',
      ],
    },
  },
  compoundVariants: [
    {
      size: ['large', 'medium'],
      variant: ['icon', 'floating'],
      className: 'p-xs',
    },
    {
      size: ['small', 'xsmall'],
      variant: ['icon', 'floating'],
      className: 'p-xxs',
    },
    {
      size: ['small', 'xsmall'],
      variant: 'icon',
      className: 'rounded-small',
    },

    /** Colors **/
    // Info
    {
      color: 'info',
      variant: 'filled',
      className: [
        'enabled:bg-interactive-default',
        'enabled:hover:bg-interactive-hover-light',
        'enabled:focus:bg-interactive-hover-light',
      ],
    },
    {
      color: 'info',
      variant: 'outline',
      className: [
        'enabled:fg-default-light enabled:outline-interactive',
        'enabled:hover:outline-interactive-hover',
        'enabled:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'info',
      variant: ['flat', 'icon'],
      className: [
        'enabled:fg-default-light',
        'enabled:hover:bg-interactive-hover-dark',
        'enabled:focus:bg-interactive-hover-dark',
      ],
    },
    {
      color: 'info',
      variant: 'floating',
      className: [
        'enabled:fg-interactive enabled:bg-surface-default enabled:outline-interactive',
        'enabled:hover:fg-interactive-hover enabled:hover:outline-interactive-hover',
        'enabled:focus:fg-interactive-hover enabled:focus:outline-interactive-hover',
      ],
    },

    // Serious
    {
      color: 'serious',
      variant: 'filled',
      className: [
        'enabled:bg-serious',
        'enabled:hover:bg-serious-hover',
        'enabled:focus:bg-serious-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'outline',
      className: [
        'enabled:fg-default-light enabled:outline-serious',
        'enabled:hover:outline-interactive-hover',
        'enabled:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'serious',
      variant: ['flat', 'icon'],
      className: [
        'enabled:fg-default-light',
        'enabled:hover:bg-serious-hover',
        'enabled:focus:bg-serious-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'floating',
      className: [
        'enabled:fg-serious enabled:bg-serious-subtle enabled:outline-serious',
        'enabled:hover:fg-interactive-hover enabled:hover:outline-interactive-hover',
        'enabled:focus:fg-interactive-hover enabled:focus:outline-interactive-hover',
      ],
    },

    // Critical
    {
      color: 'critical',
      variant: 'filled',
      className: [
        'enabled:bg-critical',
        'enabled:hover:bg-critical-hover',
        'enabled:focus:bg-critical-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'outline',
      className: [
        'enabled:fg-default-light enabled:outline-critical',
        'enabled:hover:outline-interactive-hover',
        'enabled:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'critical',
      variant: ['flat', 'icon'],
      className: [
        'enabled:fg-default-light',
        'enabled:hover:bg-critical-hover',
        'enabled:focus:bg-critical-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'floating',
      className: [
        'enabled:fg-critical enabled:bg-critical-subtle enabled:outline-critical',
        'enabled:hover:fg-interactive-hover enabled:hover:outline-interactive-hover',
        'enabled:focus:fg-interactive-hover enabled:focus:outline-interactive-hover',
      ],
    },
  ],
  defaultVariants: ButtonStylesDefaults,
});

export const ButtonStyles = tv({
  extend: BaseButtonStyles,
  variants: {
    isPending: {
      false: '',
      true: '',
    },
  },
});

export const LinkButtonStyles = tv({
  extend: BaseButtonStyles,
  variants: {
    isCurrent: {
      false: '',
      true: '',
    },
  },
});

export const ToggleButtonStyles = tv({
  extend: BaseButtonStyles,
  variants: {
    isSelected: {
      false: '',
      true: '',
    },
  },
  compoundVariants: [
    {
      color: 'info',
      variant: 'filled',
      isSelected: true,
      className: 'enabled:bg-info-subtle',
    },
    {
      color: 'info',
      variant: 'floating',
      isSelected: true,
      className: 'enabled:outline-highlight',
    },
    {
      color: 'serious',
      variant: 'filled',
      isSelected: true,
      className: 'enabled:bg-serious-subtle',
    },
    {
      color: 'serious',
      variant: 'floating',
      isSelected: true,
      className: 'enabled:outline-highlight',
    },
    {
      color: 'critical',
      variant: 'filled',
      isSelected: true,
      className: 'enabled:bg-critical-subtle',
    },
    {
      color: 'critical',
      variant: 'floating',
      isSelected: true,
      className: 'enabled:outline-highlight',
    },
    // Must be last to override color values
    {
      isSelected: true,
      className: [
        'enabled:fg-highlight',
        'enabled:hover:fg-highlight',
        'enabled:focus:fg-highlight',
      ],
    },
  ],
});
