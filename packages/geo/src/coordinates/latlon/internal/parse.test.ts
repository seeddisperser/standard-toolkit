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

import { expect, it, describe } from 'vitest';

import { parse } from './parse';

describe('parser', () => {
  it.each`
    input                        | output
    ${''}                        | ${['[ERROR] No input.']}
    ${'0 0'}                     | ${'0 / 0'}
    ${'.01 .02'}                 | ${'.01 / .02'}
    ${'-.03 +.04'}               | ${'-.03 / .04'}
    ${'4/5'}                     | ${'4 / 5'}
    ${'N 44 / E 22'}             | ${'44 N / 22 E'}
    ${'1 2 N 3 4 5 E'}           | ${'1 2 N / 3 4 5 E'}
    ${'1 2 0 N E 3 4 '}          | ${'1 2 0 N / 3 4 E'}
    ${'N 0 0 E'}                 | ${'0 N / 0 E'}
    ${'1 2 3 4 5 6'}             | ${'1 2 3 / 4 5 6'}
    ${'-1 -1'}                   | ${'-1 / -1'}
    ${'1 N 2'}                   | ${'1 N / 2 E'}
    ${'1 2 N'}                   | ${'1 E / 2 N'}
    ${'1 E 2'}                   | ${'1 E / 2 N'}
    ${'1 2 3 E 4'}               | ${'1 2 3 E / 4 N'}
    ${'1 2 3 4 E 5'}             | ${'1 2 3 4 E / 5 N'}
    ${'1 E 2 3 4 5'}             | ${'1 E / 2 3 4 5 N'}
    ${'1 2 3 4 5 6 E'}           | ${'1 2 3 N / 4 5 6 E'}
    ${'N 1 2 3 4 5 6'}           | ${'1 2 3 N / 4 5 6 E'}
    ${'N 10 -20'}                | ${'10 N / 20 W'}
    ${'10 N -20'}                | ${'10 N / 20 W'}
    ${'N 0 0 0 0 0'}             | ${['[WARNING] Non-specific parser ambiguity.']}
    ${'0 0 0 0 0 N'}             | ${['[WARNING] Non-specific parser ambiguity.']}
    ${'0 0 0 0'}                 | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
    ${'N 1 2 3 E'}               | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
    ${'1 2 3 4 5 6 7'}           | ${['[ERROR] Too many numbers (7); max (6).']}
    ${`4° 5° / 6° 7'`}           | ${['[ERROR] Too many degrees symbols (3); max (2).']}
    ${`4 5' / 6' 7'`}            | ${['[ERROR] Too many minutes symbols (3); max (2).']}
    ${`4 5" / 6" 7"`}            | ${['[ERROR] Too many seconds symbols (3); max (2).']}
    ${'0'}                       | ${['[ERROR] Too few numbers (1); 2 required.']}
    ${'N + 40 S/E - 74.12342 W'} | ${['[ERROR] Too many bearings (4); max (2).']}
    ${'N -10 -10'}               | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'N -10 E -10'}             | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'-10 N E -10'}             | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'N -10 -10 E'}             | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'-10 N -10 E'}             | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'-10 0 0 N -10 E'}         | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'-10 N -10 0 0 E'}         | ${['[ERROR] Bearing (N) conflicts with negative numeric (-10).']}
    ${'-10 S / -10 E'}           | ${['[ERROR] Bearing (E) conflicts with negative numeric (-10).']}
    ${'12   ° 56 "  12° 56"'}    | ${'12° 56" / 12° 56"'}
  `('$input should yield $output', ({ input, output }) => {
    const [result, errors] = parse(input);

    expect(errors.length ? errors : result.join(' ')).toStrictEqual(output);
  });
});
