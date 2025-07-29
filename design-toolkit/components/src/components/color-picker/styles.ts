/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { tv } from '@/lib/utils';

export const ColorPickerStyles = tv({
  slots: {
    colorPicker: 'flex flex-wrap gap-s',
    swatchItem:
      'w-fit outline-none outline selected:outline-highlight selected:outline-solid hover:outline-interactive-hover hover:outline-solid focus:outline-interactive-hover focus:outline-solid',
    swatchPicker: 'flex flex-wrap gap-s',
    swatch: 'h-[16px] w-[16px]',
  },
});
