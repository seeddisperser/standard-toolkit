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

import { expect, it, describe } from 'vitest';
import { dd, dms } from './configurations';
import { ddPairs, dmsPairs } from './__fixtures__';
import { matchDD, parseDD } from './';

console.log(dd[0]);
console.log(dms[0]);

describe('coordinates', () => {
  describe('decimal degrees', () => {
    describe('matching', () => {
      for (const pairs of ddPairs) {
        it(`${pairs[0]}: ${pairs[1]}`, () => {
          const matches = matchDD(pairs[1]);

          // NOTE: our matches don't have directionality yet, so all numbers are positive
          expect(matches[2]).toBeCloseTo(34);
          expect(matches[7]).toBeCloseTo(117);
        });
      }
    });

    describe('parsing', () => {
      for (const pairs of ddPairs) {
        it(`${pairs[0]}: ${pairs[1]}`, () => {
          const coordinates = parseDD(pairs[1]);

          expect(coordinates[0]).toBeCloseTo(34, 0);
          expect(coordinates[1]).toBeCloseTo(-117, 0);
        });
      }
    });
  });
});
