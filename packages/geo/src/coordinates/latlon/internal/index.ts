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

import { Patterning } from '@/patterning';

export type Errors = string[];

export type Lat = 'LAT';
export type Lon = 'LON';
export type Format = `${Lat}${Lon}` | `${Lon}${Lat}`;

export enum Compass {
  North = 'N',
  South = 'S',
  East = 'E',
  West = 'W',
}

export enum Limits {
  Lat = 90,
  Lon = 180,
}

export enum Symbols {
  Degrees = '°',
  Minutes = "'",
  Seconds = '"',
  Separator = '/',
}

export const BEARINGS = {
  // [positive, negative] so that "isNegative" can be used to index into the array
  LAT: [Compass.North, Compass.South],
  LON: [Compass.East, Compass.West],
} as const;

export const DEFAULT_FORMAT: Format = 'LONLAT';

export const LIMITS: Record<Format, [Limits, Limits]> = {
  LATLON: [Limits.Lat, Limits.Lon],
  LONLAT: [Limits.Lon, Limits.Lat],
};

export const SYMBOL_PATTERNS = {
  LAT: new RegExp(`[${BEARINGS.LAT.join('')}]`),
  LON: new RegExp(`[${BEARINGS.LON.join('')}]`),
  NSEW: new RegExp(`[${Object.values(Compass).join('')}]`),

  degrees: new RegExp(Symbols.Degrees),
  minutes: new RegExp(Symbols.Minutes),
  seconds: new RegExp(Symbols.Seconds),
  separator: new RegExp(Symbols.Separator),

  dms: new RegExp(
    `[${[Symbols.Degrees, Symbols.Minutes, Symbols.Seconds].join('')}]`,
  ),

  // divider: {
  //   first: /(?<NAMED_SEPARATOR>:?)/,
  //   follow: new RegExp(`\\s?\\k<${'NAMED_SEPARATOR'}>\\s?`),
  // },
};

const decimalSecAndMin = (symbol: RegExp) =>
  Patterning.optional(
    // Negative lookbehind
    // to ensure that the match is not preceded by a digit,
    // avoiding partial matches within larger numbers.
    /(?<!\d)/,

    // 0-59 including 9 decimal places and leading zeros or no number before
    // acceptable values: 0, 0.123456789, .987654321, 001, 59.999999999
    /([-+]?0*(?:[0-5]?\d|\.\d{1,9})(?:\.\d{1,9})?)/,

    Patterning.optional(symbol),

    // Negative lookahead
    // to ensure that the match is not followed by a digit,
    // avoiding partial matches within larger numbers.
    /(?!\d)/,
  );

export const PARTIAL_PATTERNS = {
  ' ': /\s*/,
  '/': Patterning.capture(SYMBOL_PATTERNS.separator),
  NS: Patterning.optional(Patterning.capture(SYMBOL_PATTERNS.LAT)),
  EW: Patterning.optional(Patterning.capture(SYMBOL_PATTERNS.LON)),

  degLatDec: Patterning.merge(
    Patterning.capture(
      /0*(?:90(?:\.0{1,9})?)/, // 90[.0]
      /|/,
      /(?:0?[0-8]?\d(?:\.\d{1,9})?)/, // [0]0[.0]-89[.9]
    ),
    Patterning.optional(SYMBOL_PATTERNS.degrees),
  ),
  degLonDec: Patterning.merge(
    Patterning.capture(
      /(?:180(?:\.0{1,9})?)/, // 180[.0]
      /|/,
      /(?:0*(?:\d{1,2}|1[0-7]\d)(?:\.\d{1,9})?)/, // [00]0[.0]-179[.9]
    ),
    Patterning.optional(SYMBOL_PATTERNS.degrees),
  ),
  degLat: Patterning.merge(
    Patterning.capture(
      /(?:0?90)/, // 90
      /|/,
      /(?:0?[0-8]?\d)/, // [0]0-89
    ),
    Patterning.optional(SYMBOL_PATTERNS.degrees),
  ),
  degLon: Patterning.merge(
    Patterning.capture(
      /(?:180)/, // 180
      /|/,
      /(?:0*(?:\d{1,2}|1[0-7]\d))/, // [00]0-179
    ),
    Patterning.optional(SYMBOL_PATTERNS.degrees),
  ),
  min: Patterning.merge(
    Patterning.optional(
      Patterning.capture(
        /(?:0?[0-5]?\d)?/, // [0]0-59
      ),
      Patterning.optional(SYMBOL_PATTERNS.minutes),
    ),
  ),
  minDec: decimalSecAndMin(SYMBOL_PATTERNS.minutes),
  secDec: decimalSecAndMin(SYMBOL_PATTERNS.seconds),
};
