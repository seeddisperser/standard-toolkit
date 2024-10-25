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

import { type Compass, BEARINGS, Symbols } from '.';
import { getMeta } from './get-meta';
import type { Tokens } from './lexer';
import { ViolationError } from './violation-error';

const orthogonal = {
  N: BEARINGS.LON,
  S: BEARINGS.LON,
  E: BEARINGS.LAT,
  W: BEARINGS.LAT,
};

export function addMissingBearing(tokens: Tokens) {
  const meta = getMeta(tokens);

  if (meta.bearings.length !== 1) {
    return;
  }

  const indexOfBearing = meta.bearingsIndexes[0] ?? 0;
  const indexOfDivider = tokens.findIndex((t) => t === Symbols.Separator) ?? 0;

  if (!(indexOfBearing && indexOfDivider)) {
    // this shouldn't ever happen
    throw new ViolationError('Bearings not where they should be.', 'error');
  }

  const existingBearing = tokens[indexOfBearing] ?? '';

  if (!(existingBearing in orthogonal)) {
    throw new ViolationError(
      `Bearing (${existingBearing}) not valid.`,
      'error',
    );
  }

  const indexOfNum = indexOfBearing > indexOfDivider ? 0 : indexOfDivider + 1;
  const isNegative = /-/.test(tokens[indexOfNum] ?? '');

  const missingBearing = orthogonal[existingBearing as keyof typeof orthogonal][
    +isNegative
  ] as Compass;

  if (isNegative) {
    const fixed = Math.abs(Number.parseFloat(tokens[indexOfNum] ?? ''));

    tokens.splice(indexOfNum, 1, fixed.toString());
  }

  if (indexOfBearing > indexOfDivider) {
    tokens.splice(indexOfDivider, 0, missingBearing);
  } else {
    tokens.push(missingBearing);
  }
}
