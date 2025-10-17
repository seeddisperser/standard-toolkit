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

export const LinkStyles = tv({
  base: [
    'inline-flex cursor-pointer items-center gap-[0.5ch] px-[0.5ch] align-bottom',
    'enabled:fg-accent-primary-bold',
    'enabled:hover:fg-accent-primary-hover enabled:hover:bg-accent-primary-muted',
    'enabled:focus-visible:fg-accent-primary-hover enabled:focus-visible:bg-accent-primary-muted',
    'enabled:pressed:fg-accent-primary-pressed enabled:pressed:bg-accent-primary-muted',
    'disabled:fg-disabled disabled:cursor-not-allowed',
  ],
});
