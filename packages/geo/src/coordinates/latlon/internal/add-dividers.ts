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
import { VeryUnlikelyError } from './very-unlikely-error';
import { ViolationError } from './violation-error';

type Meta = ReturnType<typeof getMeta>;

// deterministic patterns - easily indicate where dividers should be inserted
// NBN, NBNB, NBBN and BNB, BNBN
const DETERMINISTIC_BN = Symbol('DETERMINISTIC_BN');
const DETERMINISTIC_NB = Symbol('DETERMINISTIC_NB');

// avoid the need for case statement intentional fallthrough
const patternKeyMap = {
  BNB: DETERMINISTIC_BN,
  BNBN: DETERMINISTIC_BN,

  NBN: DETERMINISTIC_NB,
  NBNB: DETERMINISTIC_NB,
  NBBN: DETERMINISTIC_NB,
};

export function addDividers(tokens: Tokens) {
  const meta = getMeta(tokens);
  const patternKey = tokens
    .map((t) => (/\d/.test(t) ? 'N' : 'B'))
    .join('')
    .replace(/N+/g, 'N') as keyof typeof patternKeyMap;

  const secondDegreeSymbol = tokens
    .map((t, i) => (t.includes(Symbols.Degrees) ? i : 0))
    .filter((i) => i > 0);

  if (secondDegreeSymbol[0]) {
    insertSeparator(tokens, secondDegreeSymbol[0]);
  } else if (meta.numNum === 2 || meta.numNum === 6) {
    // Handle these exact cases; the position of a divider is easily determined.
    extremeCases(meta, tokens);
  } else {
    switch (patternKeyMap[patternKey]) {
      case DETERMINISTIC_BN:
        insertSeparator(tokens, meta.bearingsIndexes[1]);
        break;

      case DETERMINISTIC_NB:
        insertSeparator(tokens, meta.bearingsIndexes[0], 1);
        break;

      // these patterns - B, N, BN, NB, BNNB - are not deduce-able at this level
      default:
        throw new ViolationError('Non-specific parser ambiguity.', 'warning');
    }
  }
}

function extremeCases(meta: Meta, tokens: Tokens) {
  const len = tokens.length + tokens.filter((t) => !/\d/.test(t)).length;
  const index = tokens.slice(0, len / 2).length;

  switch (meta.bearings.length) {
    case 0:
      insertSeparator(tokens, index);
      break;

    case 1:
      oneBearing(tokens, index, meta.bearingsIndexes[0]);
      break;

    default:
      insertSeparator(tokens, index - 1);
      break;
  }
}

function insertSeparator(tokens: Tokens, index?: number, shift = 0) {
  if (index === undefined) {
    throw new VeryUnlikelyError();
  }

  tokens.splice(index + shift, 0, Symbols.Separator);
}

function oneBearing(tokens: Tokens, index: number, focus?: number) {
  switch (focus) {
    case undefined:
      break;

    case 0:
      // bearing indicator in left-most position of first part of coordinate
      insertSeparator(tokens, index);
      break;

    case tokens.length - 1:
      // bearing indicator in right-most position of second part of coordinate
      insertSeparator(tokens, index - 1);
      break;

    default:
      // bearing indicator in right-most position of first part of coordinate
      insertSeparator(tokens, focus + 1);
      break;
  }
}
