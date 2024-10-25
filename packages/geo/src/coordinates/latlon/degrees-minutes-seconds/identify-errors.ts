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

import { type Format, BEARINGS, LIMITS } from '../internal';
import { addTo } from '../internal/add-to';
import type { ParseResults } from '../internal/parse';

import type { DegreesMinutesSeconds } from './degrees-minutes-seconds';

export function identifyErrors(format: Format) {
  const bearing = {
    LATLON: [BEARINGS.LAT, BEARINGS.LON],
    LONLAT: [BEARINGS.LON, BEARINGS.LAT],
  }[format];

  return (arg: DegreesMinutesSeconds | undefined, i: number) => {
    if (!arg) {
      return [[], ['Invalid coordinate value.']] as ParseResults;
    }

    let { bear, deg, min, sec } = arg;

    deg ||= '0';
    min ||= '0';
    sec ||= '0';

    const errors: string[] = [];
    let isNegative: 0 | 1 = /-/.test(deg ?? '') ? 1 : 0;
    const bearingOptions = bearing[i] as [string, string];

    if (!bear || isNegative) {
      bear = bearingOptions[isNegative];
      deg = Math.abs(Number.parseFloat(deg)).toString();
      isNegative = 0;
    }

    const maxValue = LIMITS[format][i] ?? 0;

    addTo(
      errors,
      maxValue < Number.parseFloat(deg),
      `Degrees value "${deg}" exceeds max value "${maxValue}".`,
    );

    addTo(
      errors,
      59 < Number.parseFloat(min),
      `Minutes value "${min}" exceeds max value "59".`,
    );

    addTo(
      errors,
      59.999999999 < Number.parseFloat(sec),
      `Seconds value "${sec}" exceeds max value "59.999999999".`,
    );

    addTo(
      errors,
      Number.parseFloat(min) < 0,
      `Minutes value "${min}" must be positive.`,
    );

    addTo(
      errors,
      Number.parseFloat(sec) < 0,
      `Seconds value "${sec}" must be positive.`,
    );

    addTo(
      errors,
      /\./.test(deg ?? ''),
      `Degrees value "${deg}" must not include decimal value.`,
    );

    return (
      errors.length ? [[], errors] : [[deg, min, sec, bear], []]
    ) as ParseResults;
  };
}
