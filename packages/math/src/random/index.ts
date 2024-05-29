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

/**
 * Generate a random number within the given bounds.
 *
 * @example
 * const value = random(0, 10);
 * value >= 0 && value <= 10;
 */
export function random(min: number, max: number) {
  // TODO: do we want to handle this differently? A range error is quite explicit
  if (min > max) {
    throw new RangeError('Min exceeded max');
  }

  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer within the given bounds.
 *
 * @example
 * const value = random(0, 10);
 * value >= 0 && value <= 10;
 */
export function randomInt(min: number, max: number) {
  return Math.floor(random(min, max));
}
