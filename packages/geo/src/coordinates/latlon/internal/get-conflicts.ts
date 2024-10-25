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

import { SYMBOL_PATTERNS, Symbols } from '.';
import type { Tokens } from './lexer';
import { ViolationError } from './violation-error';

export function getConflicts(tokens: Tokens) {
  const indexOfDivider = tokens.findIndex((t) => t === Symbols.Separator);

  return tokens.forEach((t, i) => {
    if (SYMBOL_PATTERNS.NSEW.test(t)) {
      let bearing: string | undefined;
      let token: string | undefined;

      if (i < indexOfDivider) {
        bearing = tokens.at(indexOfDivider - 1);
        token = tokens[0];
      } else {
        bearing = tokens.at(-1);
        token = tokens.at(indexOfDivider + 1);
      }

      if (/-/.test(token ?? '') && /[NE]/.test(bearing ?? '')) {
        throw new ViolationError(
          `Bearing (${bearing}) conflicts with negative numeric (${token}).`,
          'error',
        );
      }
    }
  }, [] as string[]);
}
