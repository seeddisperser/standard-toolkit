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

import { useEffect } from 'react';
import { Broadcast } from '../broadcast';
import { useEffectEvent } from './ponyfill';

const bus = Broadcast.getInstance();

export function useEvent(event: any, callback: () => void) {
  const onCallback = useEffectEvent(callback);

  useEffect(() => {
    const off = bus.on(event, onCallback);
    return () => off();
  });
}

// Alias
export const useOn = useEvent;

export function useEmit(event: string) {
  return useEffectEvent((payload: any) => {
    bus.emit(event, payload);
  });
}
