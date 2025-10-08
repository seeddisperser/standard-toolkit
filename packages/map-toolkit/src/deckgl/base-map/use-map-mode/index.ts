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

'use client';

import 'client-only';
import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { useState } from 'react';
import { MapModeEvents } from './events';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
  ModeChangeRequestEvent,
} from './types';

export type UseMapModeOptions = {
  defaultMode?: string;
  owner?: string;
  validModes?: string[];
};

export function useMapMode(options: UseMapModeOptions = {}) {
  const { defaultMode = 'default', owner, validModes } = options;
  const [mode, setMode] = useState(defaultMode);

  const emitChanged = useEmit<ModeChangedEvent>(MapModeEvents.changed);
  const emitAuthorization = useEmit<ModeChangeAuthorizationEvent>(
    MapModeEvents.changeAuthorization,
  );
  const emitDecision = useEmit<ModeChangeDecisionEvent>(
    MapModeEvents.changeDecision,
  );
  const emitRequest = useEmit<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
  );

  // Listen for mode change requests
  useOn<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
    (event: ModeChangeRequestEvent) => {
      const { desiredMode, owner: requestOwner } = event.payload;

      // If current mode is same as desired, no change needed
      if (desiredMode === mode) {
        return;
      }

      // Validate mode if validModes is provided
      if (validModes && !validModes.includes(desiredMode)) {
        const authId = uuid();
        emitDecision({
          authId,
          approved: false,
          desiredMode,
          currentMode: mode,
          reason: `Invalid mode: ${desiredMode}. Valid modes are: ${validModes.join(', ')}`,
        });
        return;
      }

      // If no owner is set OR request is from owner, allow change immediately
      if (!owner || requestOwner === owner) {
        const previousMode = mode;
        setMode(desiredMode);
        emitChanged({
          previousMode,
          currentMode: desiredMode,
        });
        return;
      }

      // Otherwise, send authorization request to owner
      const authId = uuid();
      emitAuthorization({
        authId,
        desiredMode,
        currentMode: mode,
        owner,
      });
    },
  );

  // Listen for authorization decisions
  useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
    const { approved, desiredMode } = event.payload;

    if (approved && desiredMode !== mode) {
      const previousMode = mode;
      setMode(desiredMode);
      emitChanged({
        previousMode,
        currentMode: desiredMode,
      });
    }
  });

  // Function to request a mode change
  const requestModeChange = (desiredMode: string, requestOwner?: string) => {
    emitRequest({
      desiredMode,
      owner: requestOwner,
    });
  };

  return {
    mode,
    requestModeChange,
  };
}
