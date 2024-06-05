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
import { matchDD, matchDMS } from './match';

console.log(dd[0]);
console.log(dms[0]);

describe('coordinates', () => {
  describe('matching', () => {
    describe('decimal degrees', () => {
      for (const pairs of ddPairs) {
        it(`${pairs[0]}: ${pairs[1]}`, () => {
          const matches = matchDD(pairs[1]);

          expect(matches).toMatchSnapshot();
        });
      }
    });
  });

  describe('degrees minutes seconds', () => {
    for (const pairs of dmsPairs) {
      it(`${pairs[0]}: ${pairs[1]}`, () => {
        const matches = matchDMS(pairs[1]);

        expect(matches).toMatchSnapshot();
      });
    }
  });
});
