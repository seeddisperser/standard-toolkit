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

import { Symbols } from '.';
import { getMeta } from './get-meta';
import type { Tokens } from './lexer';

/**
 * Reposition the Bearings to be in a consistent position regardless of input;
 * always following the numeric description of the latitude or longitude.
 *
 * Examples:
 *
 * N 11 / E 22 -> 11 N / 22 E
 *
 * @param tokens the array of strings that represent the coordinate
 */
export function repositionBearings(tokens: Tokens) {
  const { bearingsIndexes } = getMeta(tokens);
  const dividerIndex = tokens.findIndex((t) => t === Symbols.Separator);

  if (bearingsIndexes.length <= 2) {
    for (const index of bearingsIndexes) {
      const bearing = tokens[index];

      if (bearing) {
        if (index === 0) {
          tokens.splice(dividerIndex, 0, bearing);
          tokens.shift();
        } else if (index === dividerIndex + 1) {
          tokens.splice(index, 1);
          tokens.push(bearing);
        }
      }
    }
  }
}
