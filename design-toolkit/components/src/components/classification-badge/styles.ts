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

import { tv } from 'tailwind-variants';

export const ClassificationBadgeStylesDefaults = {
  variant: 'missing',
  size: 'medium',
} as const;

// Classification badge default empty content per variant
export const CLASSIFICATION_BADGE_EMPTY_LABELS = {
  missing: 'Missing',
  unclassified: 'Unclassified',
  cui: 'CUI',
  confidential: 'Confidential',
  secret: 'Secret',
  'top-secret': 'Top_Secret',
  'ts-sci': 'TS/SCI',
} as const;

export const ClassificationBadgeStyles = tv({
  base: 'inline-flex items-center justify-center rounded-full px-s py-xs uppercase',
  variants: {
    variant: {
      missing: `fg-critical bg-classification-missing [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS.missing}']`,
      unclassified: `fg-default-light bg-classification-unclass [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS.unclassified}']`,
      cui: `fg-default-light bg-classification-cui [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS.cui}']`,
      confidential: `fg-default-light bg-classification-confidential [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS.confidential}']`,
      secret: `fg-default-light bg-classification-secret [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS.secret}']`,
      'top-secret': `fg-inverse-light bg-classification-top-secret [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS['top-secret']}']`,
      'ts-sci': `fg-inverse-light bg-classification-ts-sci [&:empty]:before:content-['${CLASSIFICATION_BADGE_EMPTY_LABELS['ts-sci']}']`,
    },
    size: {
      small: 'text-header-xs',
      medium: 'text-header-s',
    },
  },
  defaultVariants: ClassificationBadgeStylesDefaults,
});
