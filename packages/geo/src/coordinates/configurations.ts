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

import { DD_LAT, DD_LON, SEPARATORS, DMS_LAT, DMS_LON } from './regex';

/**
 * NOTE: these pairs are setup to support different lon/lat ordering
 * 0 = latitude first, 1 = longitude first
 */

export const dd = [
  new RegExp(DD_LAT + SEPARATORS + DD_LON, 'i'),
  new RegExp(DD_LON + SEPARATORS + DD_LAT, 'i'),
] as const;

export const dms = [
  new RegExp(DMS_LAT + SEPARATORS + DMS_LON, 'i'),
  new RegExp(DMS_LON + SEPARATORS + DMS_LAT, 'i'),
] as const;
