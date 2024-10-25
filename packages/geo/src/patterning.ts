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

const nomatch = (t: string) => new RegExp(`___UNMATCHED_${t}_TOKEN___`);

export const Patterning = {
  capture: (...p: RegExp[]) => new RegExp(`(${Patterning.merge(...p).source})`),

  group: (...p: RegExp[]) => new RegExp(`(?:${Patterning.merge(...p).source})`),

  lookahead: (...p: RegExp[]) =>
    new RegExp(`(?=${Patterning.merge(...p).source})`),

  limn: (parts: Record<string, RegExp>, s: string) =>
    Patterning.merge(
      /^/,
      ...(s.match(/(\s+)|([^\s]+)/g) ?? []).map(
        (t) => parts[t as keyof typeof parts] ?? nomatch(t),
      ),
      /$/,
    ),

  merge: (...[head, ...tail]: RegExp[]) =>
    (tail ?? []).reduce(
      (acc, next) => new RegExp(acc?.source + next.source),
      head ?? /(?:)/,
    ),

  optional: (...p: RegExp[]) =>
    new RegExp(`(?:${Patterning.merge(...p).source})?`),
};
