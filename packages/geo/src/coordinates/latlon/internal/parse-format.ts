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

import { type Format, SYMBOL_PATTERNS, Symbols } from '.';
import { type ParseResults, parse } from './parse';
import { VeryUnlikelyError } from './very-unlikely-error';
import { ViolationError } from './violation-error';

export type Config<T> = {
  formats: {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    LATLON: RegExp;
    // biome-ignore lint/style/useNamingConvention: <explanation>
    LONLAT: RegExp;
  };
  identifyErrors: (format: Format) => (arg: T, i: number) => ParseResults;
  identifyPieces: (half: string[]) => T;
};

export const makeError = (s: string) => new ViolationError(s, 'error').message;

export function parseFormat<T>(config: Config<T | undefined>) {
  const { identifyErrors, identifyPieces, formats } = config;

  return function parseAs(format: Format, input: string): ParseResults {
    const [parseTokens, violations] = parse(input);

    const foundFormat = parseTokens
      .map(
        (t) =>
          (SYMBOL_PATTERNS.LAT.test(t) && 'LAT') ||
          (SYMBOL_PATTERNS.LON.test(t) && 'LON'),
      )
      .filter(Boolean)
      .join('');

    if (!violations.length && foundFormat && foundFormat !== format) {
      violations.push(
        new ViolationError(
          `Mismatched formats: "${format}" expected, "${foundFormat}" found.`,
          'error',
        ).message,
      );
    }

    const hasErrors = !!violations.filter(
      (s) => !s.includes(ViolationError.type.warning),
    ).length;

    if (hasErrors) {
      return [[], violations] as ParseResults;
    }

    const [tokens, errors] = [
      parseTokens.slice(0, parseTokens.indexOf(Symbols.Separator)),
      parseTokens.slice(1 + parseTokens.indexOf(Symbols.Separator)),
    ]
      .map(identifyPieces)
      .map(identifyErrors(format))
      .reduce((a, b) => [
        [...a[0], Symbols.Separator, ...b[0]],
        [...a[1], ...b[1]].map(makeError),
      ]);

    if (errors.length) {
      // dedupe errors
      return [[], Array.from(new Set(errors))];
    }

    const matches = (formats[format].exec(tokens.join(' ')) || []).slice(1);

    if (!matches?.length) {
      throw new VeryUnlikelyError();
    }

    return [matches, []];
  };
}
