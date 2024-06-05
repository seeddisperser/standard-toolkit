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

import { dd, dms } from './configurations';

type Nullish<T> = T | undefined | null | '';
type PlusMinus = '+' | '-';
type Directions = 'N' | 'S' | 'E' | 'W';

// biome-ignore lint/style/useNamingConvention: <explanation>
type DDMatches = [
  Nullish<Directions>,
  Nullish<PlusMinus>,
  Nullish<string>, // degrees
  Nullish<string>, // decimals
  Nullish<Directions>,
  Nullish<Directions>,
  Nullish<PlusMinus>,
  Nullish<string>, // degrees
  Nullish<string>, // decimals
  Nullish<Directions>,
];

const ddFallback = Array.from(Array(10), () => '');

// biome-ignore lint/style/useNamingConvention: <explanation>
export function matchDD(val: unknown): DDMatches {
  // TODO: lat/lon ordering

  const matches = `${val}`.match(dd[0]);

  if (!matches) {
    return ddFallback as DDMatches;
  }

  // Remove first regex.match entry since it is the input value
  return Array.from(matches).slice(1) as DDMatches;
}

// biome-ignore lint/style/useNamingConvention: <explanation>
type DMSMatches = [
  Nullish<Directions>,
  Nullish<PlusMinus>,
  Nullish<string>, // degrees
  Nullish<string>, // minutes
  Nullish<string>, // seconds
  Nullish<string>, // milliarcseconds
  Nullish<Directions>,
  Nullish<Directions>,
  Nullish<PlusMinus>,
  Nullish<string>, // degrees
  Nullish<string>, // minutes
  Nullish<string>, // seconds
  Nullish<string>, // milliarcseconds
  Nullish<Directions>,
];

const dmsFallback = Array.from(Array(14), () => '');

// biome-ignore lint/style/useNamingConvention: <explanation>
export function matchDMS(val: unknown): DMSMatches {
  // TODO: lat/lon ordering

  const matches = `${val}`.match(dms[0]);

  if (!matches) {
    return dmsFallback as DMSMatches;
  }

  // Remove first regex.match entry since it is the input value
  return Array.from(matches).slice(1) as DMSMatches;
}
