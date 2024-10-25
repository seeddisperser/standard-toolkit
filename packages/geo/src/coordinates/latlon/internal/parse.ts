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

import { addDividers } from './add-dividers';
import { addMissingBearing } from './add-missing';
import { type Errors, Symbols } from '.';
import { getConflicts } from './get-conflicts';
import { getViolations } from './get-violations';
import { type Tokens, lexer } from './lexer';
import { repositionBearings } from './reposition';
import { VeryUnlikelyError } from './very-unlikely-error';
import { ViolationError } from './violation-error';

type Mutator = (t: Tokens) => void;

export type ParseResults = [Tokens, Errors];

export function parse(s: string): ParseResults {
  const tokens = lexer(s);
  const violations: Errors = [];

  if (!(s || s.length || tokens.length)) {
    return [[], [new ViolationError('No input.', 'error').message]];
  }

  // NOTE: these functions are mutating; tokens and violations
  runWithScissors(
    violations,
    tokens,

    getViolations,

    (tokens: Tokens) => {
      if (!(violations.length || tokens.includes(Symbols.Separator))) {
        addDividers(tokens);
      }
    },

    repositionBearings,
    addMissingBearing,
    getConflicts,
  );

  if (!(violations.length || tokens.includes(Symbols.Separator))) {
    // something is still missing
    throw new VeryUnlikelyError();
  }

  return [tokens, violations];
}

function runWithScissors(
  violations: Errors,
  tokens: Tokens,
  ...fns: Mutator[]
) {
  try {
    for (const fn of fns) {
      // NOTE: mutation of the tokens array
      fn(tokens);
    }
  } catch (e) {
    if (e instanceof ViolationError) {
      // NOTE: mutation of the violations array
      violations.push(e.message);
    } else {
      throw e;
    }
  }
}
