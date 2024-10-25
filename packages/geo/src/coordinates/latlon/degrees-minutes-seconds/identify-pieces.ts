// __private-exports
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

import { SYMBOL_PATTERNS } from '../internal';

export function identifyPieces(half: string[]) {
  if (half.length < 1 || half.length > 4) {
    return;
  }

  const asString = half.join(' ');
  const places = { bear: '', deg: '', min: '', sec: '' };
  const keys = ['deg', 'min', 'sec'] as (keyof typeof places)[];
  const test = (r: RegExp, b: boolean, v: string) =>
    r.test(v) || (r.test(asString) && b);

  return half.reduce((acc, token, i, { length }) => {
    if (test(SYMBOL_PATTERNS.NSEW, i === length - 1, token)) {
      acc.bear ||= token;
    } else if (test(SYMBOL_PATTERNS.degrees, i === 0, token)) {
      acc.deg ||= token;
    } else if (test(SYMBOL_PATTERNS.minutes, i === 1, token)) {
      acc.min ||= token;
    } else if (test(SYMBOL_PATTERNS.seconds, i === 2, token)) {
      acc.sec ||= token;
    } else {
      const key = keys.find((k) => !acc[k]);

      acc[key as keyof typeof acc] = token;
    }

    return acc;
  }, places);
}
