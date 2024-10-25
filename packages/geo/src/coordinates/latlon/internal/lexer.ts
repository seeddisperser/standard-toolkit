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

import { SYMBOL_PATTERNS, Symbols } from '.';

export type Tokens = ReturnType<typeof lexer>;

const patterns = {
  positive: /\+/g,
  separators: /[,/]/g,
  signs: /([-+])\s*/g,
  symbols: new RegExp(
    Patterning.merge(/\s*/, Patterning.capture(SYMBOL_PATTERNS.dms), /\s*/),
    'g',
  ),
  tokens: new RegExp(
    Patterning.merge(
      /[,/]|/,
      SYMBOL_PATTERNS.NSEW,
      /|/,
      Patterning.group(
        /[-+]?/,
        Patterning.group(
          // left of decimal REQUIRED, right of decimal optional
          /(?:\d+(?:\.\d*)?)|/,
          // left of decimal omitted, right of decimal REQUIRED
          /(?:\.\d+)/,
        ),
        Patterning.optional(SYMBOL_PATTERNS.dms),
      ),
    ),
    'gi',
  ),
};

export function lexer(string: string) {
  const tokens =
    string
      .trim()
      .toUpperCase()
      .replace(patterns.positive, '') // positive signs are redundant
      .replace(patterns.symbols, '$1 ') // group symbols with numbers
      .replace(patterns.signs, '$1') // group signs with numbers
      .replace(patterns.separators, Symbols.Separator) // standardize the separator
      .match(patterns.tokens)
      ?.slice() ?? [];

  return tokens;
}
