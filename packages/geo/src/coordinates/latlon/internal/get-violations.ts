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
import { ViolationError } from './violation-error';

const count = (tokens: Tokens, needle: string) =>
  tokens.filter((t) => t.includes(needle)).length;

export function getViolations(tokens: Tokens) {
  const meta = getMeta(tokens);

  tooMany('bearings', meta.bearings.length);

  tooMany('numeric signs', tokens.filter((t) => /[-+]/.test(t)).length);

  tooMany('degrees symbols', count(tokens, Symbols.Degrees));

  tooMany('minutes symbols', count(tokens, Symbols.Minutes));

  tooMany('seconds symbols', count(tokens, Symbols.Seconds));

  tooMany('numbers', meta.numNum, 6);

  if (meta.numNum < 2) {
    throw new ViolationError(
      `Too few numbers (${meta.numNum}); 2 required.`,
      'error',
    );
  }

  const wrapped =
    meta.bearingsIndexes[0] === 0 &&
    meta.bearingsIndexes.at(-1) === tokens.length - 1;

  if (
    // no divider
    !tokens.filter((t) => /[,/]/.test(t)).length &&
    // in the ambiguous number of numbers
    meta.numNum > 2 &&
    meta.numNum < 6 &&
    // no bearings indicators to help with deduction, or
    // has bearings in the least helpful placement
    (meta.bearings.length < 1 || wrapped) &&
    // the only seconds indicator is in the second set of numbers
    !tokens.map((t, i) => (t.includes(Symbols.Degrees) ? i : 0)).filter(Boolean)
      .length
  ) {
    throw new ViolationError(
      'Ambiguous grouping of numbers with no divider.',
      'error',
    );
  }
}

function tooMany(s: string, count: number, limit = 2) {
  if (count > limit) {
    throw new ViolationError(
      `Too many ${s} (${count}); max (${limit}).`,
      'error',
    );
  }
}
