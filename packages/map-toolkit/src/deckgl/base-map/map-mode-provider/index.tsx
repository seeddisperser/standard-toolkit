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
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MapModeEvents } from './events';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
  ModeChangeRequestEvent,
} from './types';

type PendingRequest = {
  desiredMode: string;
  currentMode: string;
  owner: string;
};

export type MapModeContextValue = {
  mode: string;
  requestModeChange: (desiredMode: string, requestOwner: string) => void;
};

export const MapModeContext = createContext<MapModeContextValue | null>(null);

const DEFAULT_MODE = 'default';

type MapModeProviderProps = {
  children: ReactNode;
  defaultMode?: string;
};

const AUTHORIZATION_TIMEOUT_MS = 30000; // 30 seconds

export function MapModeProvider({
  children,
  defaultMode = DEFAULT_MODE,
}: MapModeProviderProps) {
  const [mode, setMode] = useState(defaultMode);
  // Store mode-to-owner mappings (persists throughout session, no re-renders needed)
  const modeOwnersRef = useRef<Map<string, string>>(new Map());
  // Store pending authorization requests by authId (no re-renders needed)
  const pendingRequestsRef = useRef<Map<string, PendingRequest>>(new Map());
  // Store timeout for authorization requests
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emitChanged = useEmit<ModeChangedEvent>(MapModeEvents.changed);
  const emitAuthorization = useEmit<ModeChangeAuthorizationEvent>(
    MapModeEvents.changeAuthorization,
  );
  const emitRequest = useEmit<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
  );
  const emitDecision = useEmit<ModeChangeDecisionEvent>(
    MapModeEvents.changeDecision,
  );

  // Centralized listener for mode change requests
  useOn<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
    (event: ModeChangeRequestEvent) => {
      const { desiredMode, owner: requestOwner } = event.payload;

      // If current mode is same as desired, no change needed
      if (desiredMode === mode) {
        return;
      }

      // Get current mode's owner from the mapping
      const currentModeOwner = modeOwnersRef.current.get(mode);
      // Get desired mode's owner from the mapping
      const desiredModeOwner = modeOwnersRef.current.get(desiredMode);

      // Auto-accept if:
      // 1. Desired mode is 'default' (default is always ownerless and accepts all requests)
      // 2. Requesting owner is same as current mode owner, OR
      // 3. No desired mode owner, OR
      // 4. No current mode owner (default mode) and the requester is the owner of the desired mode
      if (
        desiredMode === defaultMode ||
        requestOwner === currentModeOwner ||
        !desiredModeOwner ||
        (!currentModeOwner && requestOwner === desiredModeOwner)
      ) {
        setMode(desiredMode);
        emitChanged({
          previousMode: mode,
          currentMode: desiredMode,
        });

        // Store the desired mode's owner unless it's default (which stays ownerless),
        // and there's not another mode owner already
        if (desiredMode !== defaultMode && !desiredModeOwner) {
          modeOwnersRef.current.set(desiredMode, requestOwner);
        }

        // Clear any pending authorization requests since mode changed successfully
        pendingRequestsRef.current.clear();
        return;
      }

      // Otherwise, send authorization request
      // Generate authId and store the request for later lookup
      const authId = uuid();

      // Clear any existing pending requests and add the new one (only one pending request at a time)
      pendingRequestsRef.current.clear();
      pendingRequestsRef.current.set(authId, {
        desiredMode,
        currentMode: mode,
        owner: requestOwner,
      });

      // Clear any existing timeout
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }

      // Set timeout to auto-reject after AUTHORIZATION_TIMEOUT_MS
      authTimeoutRef.current = setTimeout(() => {
        const currentModeOwner = modeOwnersRef.current.get(mode);
        if (currentModeOwner) {
          emitDecision({
            authId,
            approved: false,
            owner: currentModeOwner,
            reason: 'Authorization request timed out',
          });
        }
        pendingRequestsRef.current.delete(authId);
        authTimeoutRef.current = null;
      }, AUTHORIZATION_TIMEOUT_MS);

      emitAuthorization({
        authId,
        desiredMode,
        currentMode: mode,
      });
    },
  );

  // Centralized listener for authorization decisions
  useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
    const { approved, authId, owner: decisionOwner } = event.payload;

    // Clear the timeout since a decision was made
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
      authTimeoutRef.current = null;
    }

    // Lookup the request by authId
    const request = pendingRequestsRef.current.get(authId);
    if (!request) {
      // Unknown or stale authId, ignore
      return;
    }

    // Verify decision is from current mode's owner
    const currentModeOwner = modeOwnersRef.current.get(mode);
    if (decisionOwner !== currentModeOwner) {
      // Unauthorized decision, ignore (noop)
      return;
    }

    if (approved) {
      const previousMode = mode;
      setMode(request.desiredMode);
      emitChanged({
        previousMode,
        currentMode: request.desiredMode,
      });

      // Store the new mode's owner
      modeOwnersRef.current.set(request.desiredMode, request.owner);
    }

    // Remove the processed request
    pendingRequestsRef.current.delete(authId);
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  const requestModeChange = useCallback(
    (desiredMode: string, requestOwner: string) => {
      // Validate inputs
      if (!desiredMode) {
        throw new Error('requestModeChange requires non-empty desiredMode');
      }
      if (!requestOwner) {
        throw new Error('requestModeChange requires non-empty requestOwner');
      }

      emitRequest({
        desiredMode,
        owner: requestOwner,
      });
    },
    [emitRequest],
  );

  const value = useMemo(
    () => ({
      mode,
      requestModeChange,
    }),
    [mode, requestModeChange],
  );

  return (
    <MapModeContext.Provider value={value}>{children}</MapModeContext.Provider>
  );
}

export { useMapMode } from './use-map-mode';
