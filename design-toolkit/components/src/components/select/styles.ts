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

import { tv } from '../../lib/utils';

export const SelectStyles = tv({
  slots: {
    select: 'group/select',
    field: [
      'justify-between',
      'group-size-medium/select:py-s group-size-medium/select:min-w-[220px]',
      'group-size-small/select:py-xxs group-size-small/select:fit-content',
    ],
    label: '',
    description:
      'fg-default-dark text-body-xs group-disabled/text-field:fg-disabled',
    error: 'fg-serious text-body-xs',
    value: [
      'flex items-center',
      'group-size-small/select:gap-xs',
      'group-size-medium/select:gap-s',
    ],
  },
});
