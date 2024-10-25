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

import { Coordinate } from './coordinate';
import type { Format } from './latlon/internal';

describe('Coordinate', () => {
  describe('instances', () => {
    it('should create a coordinate from Decimal Degrees input', () => {
      const coord = new Coordinate('22.1111 E / 11.2222 N');

      expect(coord.isValid).toBe(true);
      expect(coord.value).toEqual({ longitude: 22.1111, latitude: 11.2222 });
    });

    it('should create a coordinate from Degrees Decimal Minutes input', () => {
      const coord = new Coordinate('11 33.44 N / 3 1.1 W', {
        format: 'LATLON',
        system: Coordinate.system.DegreesDecimalMinutes,
      });

      expect(coord.isValid).toBe(true);
      expect(coord.value).toEqual({
        longitude: -3.018333333,
        latitude: 11.557333333,
      });
    });

    it('should create a coordinate from Degrees Minutes Seconds input', () => {
      const coord = new Coordinate('11 22 33.44 N / 3 2 1.1 W', {
        format: 'LATLON',
        system: Coordinate.system.DegreesMinutesSeconds,
      });

      expect(coord.isValid).toBe(true);
      expect(coord.value).toEqual({
        longitude: -3.033638889,
        latitude: 11.375955556,
      });
    });

    it('should NOT create a coordinate; invalid coordinate input', () => {
      const coord = new Coordinate('', { format: 'LATLON' as Format });

      expect(coord.isValid).toBe(false);
    });

    it('should NOT create a coordinate; conflict between bearings and format', () => {
      const coord1 = new Coordinate('1 2 3 N / 5 6 7 W', {
        format: 'LONLAT' as Format,
      });
      const coord2 = new Coordinate('1 2 3 E / 5 6 7 N', {
        format: 'LATLON' as Format,
      });

      expect(coord1.isValid).toBe(false);
      expect(coord2.isValid).toBe(false);
    });

    it('should output a Degrees Minutes Seconds formatted value', () => {
      const coord = new Coordinate('40.446195 / 40.446195');

      expect(
        coord.toString({ system: Coordinate.system.DegreesMinutesSeconds }),
      ).toBe('40 26 46.302 E / 40 26 46.302 N');
    });

    it('should convert values isomorphically', () => {
      const originalValue = '40.446195 E / 40.446195 N';
      const coord1 = new Coordinate(originalValue);
      const dms = coord1.toString({
        system: Coordinate.system.DegreesMinutesSeconds,
      });
      const coord2 = new Coordinate(dms ?? '', {
        system: Coordinate.system.DegreesMinutesSeconds,
      });
      const coord3 = new Coordinate(
        coord1.toString({ system: Coordinate.system.DegreesDecimalMinutes }),
        { system: Coordinate.system.DegreesDecimalMinutes },
      );

      expect(
        coord2.toString({ system: Coordinate.system.DecimalDegrees }),
      ).toBe(originalValue);
      expect(coord3.toString()).toBe(originalValue);
    });
  });

  describe('DecimalDegrees', () => {
    it.each`
      input                              | format      | output
      ${'+27.5916 , -099.4523'}          | ${'LATLON'} | ${'27.5916 N / 99.4523 W'}
      ${'-45.123456 , 75.654321'}        | ${'LATLON'} | ${'45.123456 S / 75.654321 E'}
      ${'+45.0 , -75.0'}                 | ${'LATLON'} | ${'45 N / 75 W'}
      ${'90.0 , 180.0'}                  | ${'LATLON'} | ${'90 N / 180 E'}
      ${'-90.0 , +180.0'}                | ${'LATLON'} | ${'90 S / 180 E'}
      ${'+0.0 , -0.0'}                   | ${'LATLON'} | ${'0 N / 0 W'}
      ${'+27.123456789 , -99.987654321'} | ${'LATLON'} | ${'27.123456789 N / 99.987654321 W'}
      ${'+45.0  ,  -75.0'}               | ${'LATLON'} | ${'45 N / 75 W'}
      ${'180 , 90'}                      | ${'LONLAT'} | ${'180 E / 90 N'}
      ${'180 , 91'}                      | ${'LONLAT'} | ${['[ERROR] Degrees value "91" exceeds max value "90".']}
      ${'181 , 90'}                      | ${'LONLAT'} | ${['[ERROR] Degrees value "181" exceeds max value "180".']}
      ${'-33 / 22 / 3'}                  | ${'LATLON'} | ${['[ERROR] Invalid coordinate value.']}
      ${'1 N / 2 E'}                     | ${'LONLAT'} | ${['[ERROR] Mismatched formats: "LONLAT" expected, "LATLON" found.']}
    `(
      'format ($format, $input) should yield $output',
      ({ format, input, output }) => {
        const [result, errors] = Coordinate.parseDecimalDegrees(format)(input);

        expect(errors.length ? errors : result.join(' ')).toStrictEqual(output);
      },
    );
  });

  describe('DegreesDecimalMinutes', () => {
    it.each`
      input                             | format      | output
      ${`40° 46.302' N, 79° 56.207' W`} | ${'LATLON'} | ${'40 46.302 N / 79 56.207 W'}
      ${`90° 0' S, 180° 0' W`}          | ${'LATLON'} | ${'90 0 S / 180 0 W'}
      ${`0° 0' N 0° 0' E`}              | ${'LATLON'} | ${'0 0 N / 0 0 E'}
      ${`0° 0' N, 0° 0' E`}             | ${'LATLON'} | ${'0 0 N / 0 0 E'}
      ${`15° 45' S, 75° 45' E`}         | ${'LATLON'} | ${'15 45 S / 75 45 E'}
      ${`40°46.302'N,79°58'W`}          | ${'LATLON'} | ${'40 46.302 N / 79 58 W'}
      ${`40° 26' N, 79° 56.2' W`}       | ${'LATLON'} | ${'40 26 N / 79 56.2 W'}
      ${`40°26'N,79°58'W`}              | ${'LATLON'} | ${'40 26 N / 79 58 W'}
      ${`40° 26' W , 79° 58' N`}        | ${'LONLAT'} | ${'40 26 W / 79 58 N'}
      ${`12   ° 56 '  , 12° 56'`}       | ${'LATLON'} | ${'12 56 N / 12 56 E'}
      ${`12   ° 56 '      12° 56'`}     | ${'LATLON'} | ${'12 56 N / 12 56 E'}
      ${'12   ° 56       12° 56'}       | ${'LATLON'} | ${'12 56 N / 12 56 E'}
      ${`89° 59.999" N, 179° 59.999"`}  | ${'LATLON'} | ${['[ERROR] Seconds indicator (") not valid in Degree Decimal Minutes.']}
      ${`1° 2" 3°`}                     | ${'LONLAT'} | ${['[ERROR] Seconds indicator (") not valid in Degree Decimal Minutes.']}
      ${`12   ° 56 '      12 56'`}      | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`12   ° 56 '      12 56 `}      | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`9° 8' 9 8 `}                   | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`9° -8' 9° 8 `}                 | ${'LATLON'} | ${['[ERROR] Minutes value "-8\'" must be positive.']}
    `(
      'format ($format, $input) should yield $output',
      ({ format, input, output }) => {
        const [result, errors] =
          Coordinate.parseDegreesDecimalMinutes(format)(input);

        expect(errors.length ? errors : result.join(' ')).toStrictEqual(output);
      },
    );
  });

  describe('DegreesMinutesSeconds', () => {
    it.each`
      input                                          | format      | output
      ${`40° 26' 46.302" N, 79° 58' 56.207" W`}      | ${'LATLON'} | ${'40 26 46.302 N / 79 58 56.207 W'}
      ${`90° 0' 0" S, 180° 0' 0" W`}                 | ${'LATLON'} | ${'90 0 0 S / 180 0 0 W'}
      ${`0° 0' 0" N 0° 0' 0" E`}                     | ${'LATLON'} | ${'0 0 0 N / 0 0 0 E'}
      ${`0° 0' 0" N, 0° 0' 0" E`}                    | ${'LATLON'} | ${'0 0 0 N / 0 0 0 E'}
      ${`15° 45' 30" S, 75° 45' 10" E`}              | ${'LATLON'} | ${'15 45 30 S / 75 45 10 E'}
      ${`89° 59' 59.999" N, 179° 59' 59.999"`}       | ${'LATLON'} | ${'89 59 59.999 N / 179 59 59.999 E'}
      ${`40°26'46.302"N,79°58'56.207"W`}             | ${'LATLON'} | ${'40 26 46.302 N / 79 58 56.207 W'}
      ${`40° 26' 46.3" N, 79° 58' 56.2" W`}          | ${'LATLON'} | ${'40 26 46.3 N / 79 58 56.2 W'}
      ${`40°26'46"N,79°58'56"W`}                     | ${'LATLON'} | ${'40 26 46 N / 79 58 56 W'}
      ${`40° 26' 46.302" W , 79° 58' 56.207" N`}     | ${'LONLAT'} | ${'40 26 46.302 W / 79 58 56.207 N'}
      ${`12   ° 56 "  , 12° 56"`}                    | ${'LATLON'} | ${'12 0 56 N / 12 0 56 E'}
      ${`12   ° 56 "      12° 56"`}                  | ${'LATLON'} | ${'12 0 56 N / 12 0 56 E'}
      ${'12   ° 56       12° 56'}                    | ${'LATLON'} | ${'12 56 0 N / 12 56 0 E'}
      ${`1° 2" 3°`}                                  | ${'LONLAT'} | ${'1 0 2 E / 3 0 0 N'}
      ${`40° 26' 46.302" N 79° 58' 56.207" W`}       | ${'LATLON'} | ${'40 26 46.302 N / 79 58 56.207 W'}
      ${`12   ° 56 "      12 56"`}                   | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`12   ° 56 "      12 56 `}                   | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`9° 8' 9 8 `}                                | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`9° 8" 9 8 `}                                | ${'LATLON'} | ${['[ERROR] Ambiguous grouping of numbers with no divider.']}
      ${`91° 0' 0" N, 79° 58' 56" W`}                | ${'LATLON'} | ${['[ERROR] Degrees value "91°" exceeds max value "90".']}
      ${`45° 60' 0" N, 75° 45' 10" W`}               | ${'LATLON'} | ${['[ERROR] Minutes value "60\'" exceeds max value "59".']}
      ${`45° 30' 61" N, 75° 45' 0" W`}               | ${'LATLON'} | ${['[ERROR] Seconds value "61"" exceeds max value "59.999999999".']}
      ${`45°0'0"N, 181° 0' 0" W`}                    | ${'LATLON'} | ${['[ERROR] Degrees value "181°" exceeds max value "180".']}
      ${`40.0° 26' 46" N, 79° 58' 56" W`}            | ${'LATLON'} | ${['[ERROR] Degrees value "40.0°" must not include decimal value.']}
      ${`+40° 26' 46.302" N, -79° 58' 56.207" E`}    | ${'LATLON'} | ${['[ERROR] Bearing (E) conflicts with negative numeric (-79°).']}
      ${`45° -10' 10" N, 75° 30' 10" W`}             | ${'LATLON'} | ${[`[ERROR] Minutes value \"-10'\" must be positive.`]}
      ${`45° -10' 10" N, 75° 30' 10" W extra stuff`} | ${'LATLON'} | ${['[ERROR] Too many bearings (4); max (2).']}
      ${`45° -10' 10" N, 75° 30' 10" W`}             | ${'LONLAT'} | ${['[ERROR] Mismatched formats: "LONLAT" expected, "LATLON" found.']}
      ${`45° -10' 10" N, 75° 30' 10" W 213`}         | ${'LATLON'} | ${['[ERROR] Too many numbers (7); max (6).']}
    `(
      'format ($format, $input) should yield $output',
      ({ format, input, output }) => {
        const [result, errors] =
          Coordinate.parseDegreesMinutesSeconds(format)(input);

        expect(errors.length ? errors : result.join(' ')).toStrictEqual(output);
      },
    );
  });
});
