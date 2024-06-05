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

// const LAT_DD = 40.689247;
// const LON_DD = -74.044502;

export const ddPairs = [
  ['partial', '40, -74'],
  ['partial directions prefix', 'N 40, W 74'],
  ['partial directions prefix no space', 'N40, W74'],
  ['partial directions suffix', '40 N, 74 W'],
  ['partial directions suffix no space', '40N, 74W'],
  ['plus minus', '+40.689247, -74.044502'],
  ['inferred plus', '40.689247, -74.044502'],
  ['inferred positive direction', '40.689247, 74.044502 W'],
  ['degree delimeters', '40.689247° N, 74.044502° W'],
  ['separator ,', '40.689247,-74.044502'],
  ['separator /', '40.689247/-74.044502'],
  ['separator space', '40.689247 -74.044502'],
  ['NSEW directions prefix', 'N 40.689247, W 74.044502'],
  ['NSEW directions prefix no space', 'N40.689247, W74.044502'],
  ['NSEW directions suffix', '40.689247 N, 74.044502 W'],
  ['NSEW directions suffix no space', '40.689247N, 74.044502W'],
  ['mixed plus minus and directions', '+40.689247, W74.044502'],
  ['mixed full and partial', '40.689247, W74'],
  ['odd whitespace', ' + 40.689247  ,   -  74.044502    '],
];

// const LAT_DMS = `40° 41' 21.2892"`;
// const LON_DMS = `-74° 02' 40.2066"`;

export const dmsPairs = [
  ['partial no delimeters', '40 41 -74 02'],
  ['partial delimeters', `40° 41' -74 02'`],
  ['plus minus no delimeters', '+40 41 21.2892 -74 02 40.2066'],
  ['plus minus delimeters', `+40° 41' 21.2892" -74° 02' 40.2066"`],
  ['directions no delimeters', '40 41 21.2892 N 74 02 40.2066 W'],
  ['directions delimeters', `40° 41' 21.2892" N 74° 02' 40.2066" W`],
  ['separator ,', `40° 41' 21.2892",-74° 02' 40.2066"`],
  ['separator /', `40° 41' 21.2892"/-74° 02' 40.2066"`],
  ['separator space', `40° 41' 21.2892" -74° 02' 40.2066"`],
];

export const ddmPairs = [];

export const mixedPairs = [];
