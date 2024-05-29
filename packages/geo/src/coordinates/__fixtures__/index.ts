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

export const ddPairs = [
  ['partial', '34, -117'],
  ['partial directions prefix', 'N 34, W 117'],
  ['partial directions prefix no space', 'N34, W117'],
  ['partial directions suffix', '34 N, 117 W'],
  ['partial directions suffix no space', '34N, 117W'],
  ['plus minus', '34.056687222, -117.195731667'],
  ['NSEW directions prefix', 'N 34.056687222, W 117.195731667'],
  ['NSEW directions prefix no space', 'N34.056687222, W117.195731667'],
  ['NSEW directions suffix', '34.056687222 N, 117.195731667 W'],
  ['NSEW directions suffix no space', '34.056687222N, 117.195731667W'],
  ['mixed plus minus and directions', '+34.056687222, W117.195731667'],
  ['mixed full and partial', '34.056687222, W117'],
  ['whitespace', ' +34.056687222  ,   -117.195731667    '],
];

export const dmsPairs = [
  ['partial no delimeters', `34 3 117 11`],
  ['partial delimeters', `34° 3' 117° 11'`],
  ['plus minus no delimeters', `34 3 24.0732 -117 11 44.6352`],
  ['plus minus delimeters', `34° 3' 24.0732" -117° 11' 44.6352"`],
  ['', `34° 3' 24.0732" N, 117° 11' 44.6352" W`],
];

export const ddmPairs = [];

export const mixedPairs = [];
