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

import { decimalDegrees } from './latlon/decimal-degrees/decimal-degrees';
import { degreesDecimalMinutes } from './latlon/degrees-decimal-minutes/degrees-decimal-minutes';
import { degreesMinutesSeconds } from './latlon/degrees-minutes-seconds/degrees-minutes-seconds';
import {
  type Compass,
  type Errors,
  type Format,
  BEARINGS,
  DEFAULT_FORMAT,
  Symbols,
} from './latlon/internal';
import type { Tokens } from './latlon/internal/lexer';

// biome-ignore lint/style/useNamingConvention: being lazy because it is only in this file
type DD = [string, `${Compass}`];
// biome-ignore lint/style/useNamingConvention: being lazy because it is only in this file
type DMS = [string, string, string, `${Compass}`];

type Options = {
  format?: Format;
  system?: Systems;
};

type SystemsParser =
  | typeof decimalDegrees
  | typeof degreesDecimalMinutes
  | typeof degreesMinutesSeconds;

type Value = {
  latitude: number;
  longitude: number;
};

enum Systems {
  DecimalDegrees = 'Decimal Degrees',
  DegreesDecimalMinutes = 'Degrees Decimal Minutes',
  DegreesMinutesSeconds = 'Degrees Minutes Seconds',
}

const converters = {
  [Systems.DecimalDegrees](value: Value, format: Format) {
    const { latitude, longitude } = value;
    const absLat = Math.abs(latitude);
    const absLon = Math.abs(longitude);

    return format === DEFAULT_FORMAT
      ? [
          absLon,
          BEARINGS.LON[isNegative(longitude)],
          Symbols.Separator,
          absLat,
          BEARINGS.LAT[isNegative(latitude)],
        ].join(' ')
      : [
          absLat,
          BEARINGS.LAT[isNegative(latitude)],
          Symbols.Separator,
          absLon,
          BEARINGS.LON[isNegative(longitude)],
        ].join(' ');
  },
  [Systems.DegreesDecimalMinutes](
    { latitude, longitude }: Value,
    format: Format,
  ) {
    const pairs: [[number, string], [number, string]] =
      format === DEFAULT_FORMAT
        ? [
            [longitude, BEARINGS.LON[isNegative(longitude)]],
            [latitude, BEARINGS.LAT[isNegative(latitude)]],
          ]
        : [
            [latitude, BEARINGS.LAT[isNegative(latitude)]],
            [longitude, BEARINGS.LON[isNegative(longitude)]],
          ];

    return pairs
      .map(([num, bear]) => {
        const absValue = Math.abs(num);
        const degrees = Math.floor(absValue);
        const minutes = Number.parseFloat(
          ((absValue - degrees) * 60).toFixed(9),
        );

        return ['', degrees, minutes, bear, ''].join(' ');
      })
      .join(Symbols.Separator)
      .trim();
  },
  [Systems.DegreesMinutesSeconds](
    { latitude, longitude }: Value,
    format: Format,
  ) {
    const pairs: [[number, string], [number, string]] =
      format === DEFAULT_FORMAT
        ? [
            [longitude, BEARINGS.LON[isNegative(longitude)]],
            [latitude, BEARINGS.LAT[isNegative(latitude)]],
          ]
        : [
            [latitude, BEARINGS.LAT[isNegative(latitude)]],
            [longitude, BEARINGS.LON[isNegative(longitude)]],
          ];

    return pairs
      .map(([num, bear]) => {
        const absValue = Math.abs(num);
        const degrees = Math.floor(absValue);
        const remainder = (absValue - degrees) * 60;
        const minutes = Math.floor(remainder);
        const seconds = Number.parseFloat(
          ((remainder - minutes) * 60).toFixed(9),
        );

        return ['', degrees, minutes, seconds, bear, ''].join(' ');
      })
      .join(Symbols.Separator)
      .trim();
  },
};

const defaultOptions: Required<Options> = {
  format: DEFAULT_FORMAT,
  system: Systems.DecimalDegrees,
} as const;

const initializers = {
  [Systems.DecimalDegrees](tokens: Tokens, format: Format) {
    const toFloat = ([num, bear]: DD) =>
      Number.parseFloat(num) * (numberSignModifier(bear as Compass) ?? 1);
    let [longitude, latitude] = [
      tokens.slice(0, tokens.indexOf(Symbols.Separator)) as DD,
      tokens.slice(1 + tokens.indexOf(Symbols.Separator)) as DD,
    ].map(toFloat);

    if (format !== DEFAULT_FORMAT) {
      [latitude, longitude] = [longitude, latitude];
    }

    return { latitude, longitude } as Value;
  },
  [Systems.DegreesDecimalMinutes](tokens: Tokens, format: Format) {
    const toFloat = ([degrees, minutes, bear]: DMS) =>
      Number.parseFloat(
        (
          (Number.parseFloat(degrees) + Number.parseFloat(minutes) / 60) *
          (numberSignModifier(bear as Compass) ?? 1)
        ).toFixed(9),
      );
    let [longitude, latitude] = [
      tokens.slice(0, tokens.indexOf(Symbols.Separator)) as DMS,
      tokens.slice(1 + tokens.indexOf(Symbols.Separator)) as DMS,
    ].map(toFloat);

    if (format !== DEFAULT_FORMAT) {
      [latitude, longitude] = [longitude, latitude];
    }

    return { latitude, longitude } as Value;
  },
  [Systems.DegreesMinutesSeconds](tokens: Tokens, format: Format) {
    const toFloat = ([degrees, minutes, seconds, bear]: DMS) =>
      Number.parseFloat(
        (
          (Number.parseFloat(degrees) +
            Number.parseFloat(minutes) / 60 +
            Number.parseFloat(seconds) / 3600) *
          (numberSignModifier(bear as Compass) ?? 1)
        ).toFixed(9),
      );
    let [longitude, latitude] = [
      tokens.slice(0, tokens.indexOf(Symbols.Separator)) as DMS,
      tokens.slice(1 + tokens.indexOf(Symbols.Separator)) as DMS,
    ].map(toFloat);

    if (format !== DEFAULT_FORMAT) {
      [latitude, longitude] = [longitude, latitude];
    }

    return { latitude, longitude } as Value;
  },
};

const isNegative = (s: number) => +/-/.test(`${s}`) as 0 | 1;

const numberSignModifier = (bearing: `${Compass}`) =>
  [1, -1][
    ([
      BEARINGS.LAT.indexOf(bearing as Compass.North | Compass.South),
      BEARINGS.LON.indexOf(bearing as Compass.East | Compass.West),
    ]
      .filter((n) => n >= 0)
      .at(0) as 0 | 1) ?? 0
  ];

const parsers = {
  [Systems.DecimalDegrees]: decimalDegrees,
  [Systems.DegreesDecimalMinutes]: degreesDecimalMinutes,
  [Systems.DegreesMinutesSeconds]: degreesMinutesSeconds,
};

export class Coordinate {
  static parseDecimalDegrees = (format: Format) => (input: string) =>
    decimalDegrees(format, input);
  static parseDegreesDecimalMinutes = (format: Format) => (input: string) =>
    degreesDecimalMinutes(format, input);
  static parseDegreesMinutesSeconds = (format: Format) => (input: string) =>
    degreesMinutesSeconds(format, input);

  static system = Systems;

  #errors?: Errors;
  #format: Format;
  #parser: SystemsParser;
  #valid = true;
  #value?: Value;

  constructor(
    input: string,
    {
      format = defaultOptions.format,
      system = defaultOptions.system,
    }: Options = defaultOptions,
  ) {
    this.#format = format;
    this.#parser = parsers[system];

    try {
      const [tokens, errors] = this.#parser(this.#format, input);

      if (errors.length) {
        this.#errors = errors;
        throw this.#errors;
      }

      this.#value = initializers[system](tokens, format);
    } catch (error) {
      if (error instanceof Error) {
        this.#errors = [error.message];
      }

      this.#valid = false;
      this.#value = undefined;
    }
  }

  get errors() {
    return this.#errors;
  }

  get isValid() {
    return this.#valid;
  }

  get value() {
    return this.#value;
  }

  toString({
    format = defaultOptions.format,
    system = defaultOptions.system,
  }: Options = defaultOptions) {
    if (!this.#value) {
      throw new Error('No value to return.');
    }

    return converters[system](this.#value, format);
  }
}
