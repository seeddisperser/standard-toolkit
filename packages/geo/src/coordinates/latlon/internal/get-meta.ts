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

import { SYMBOL_PATTERNS } from '.';
import type { Tokens } from './lexer';

export function getMeta(tokens: Tokens) {
  return {
    bearings: tokens.filter((t) => SYMBOL_PATTERNS.NSEW.test(t)),
    bearingsIndexes: tokens
      .map((t, i) => SYMBOL_PATTERNS.NSEW.test(t) && i)
      .filter((i) => i !== false),
    numNum: tokens.filter((t) => /\d/.test(t)).length,
  };
}
