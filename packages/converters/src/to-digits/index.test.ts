/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { describe, it, expect } from 'vitest';
import { toDigits } from './';

describe('toDigits', () => {
  it('formats numbers', () => {
    expect(toDigits(1, 1)).toBe(1);
    expect(toDigits(1, 5)).toBe(1);
    expect(toDigits(1.25, 1)).toBe(1.3);
    expect(toDigits(1.24, 1)).toBe(1.2);
    expect(toDigits(1.25, 2)).toBe(1.25);
  });
});
