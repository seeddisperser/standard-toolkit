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

import { useEmit, useOn } from '@accelint/bus/react';
import { useEffect, useRef, useState } from 'react';
import { BaseMap } from '../index';
import { MapModeProvider } from '.';
import { MapModeEvents } from './events';
import { useMapMode } from './use-map-mode';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
} from './types';

const EXAMPLE_MAP_MODES = ['default', 'drawing', 'measuring', 'editing'];

const meta = {
  title: 'DeckGL/Base Map/Map Mode',
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Basic usage example showing how to consume and change map modes.
 * This demonstrates the core API: wrapping with MapModeProvider and using the useMapMode hook.
 */
export const BasicUsage: Story = {
  render: () => {
    // A simple toolbar that changes modes
    function ModeToolbar() {
      const { mode, requestModeChange } = useMapMode();

      return (
        <div className='absolute top-4 left-4 rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-3 font-bold text-sm'>Map Modes</h3>
          <div className='flex flex-col gap-2'>
            {EXAMPLE_MAP_MODES.map((modeName) => (
              <button
                key={modeName}
                type='button'
                onClick={() => requestModeChange(modeName, 'toolbar')}
                className={`rounded px-4 py-2 text-sm transition-colors ${
                  mode === modeName
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {modeName}
              </button>
            ))}
          </div>
          <div className='mt-4 border-t pt-4'>
            <p className='text-gray-600 text-xs'>
              Current mode: <strong className='font-mono'>{mode}</strong>
            </p>
          </div>
        </div>
      );
    }

    return (
      <MapModeProvider defaultMode='default'>
        <BaseMap className='relative h-dvh w-dvw' />
        <ModeToolbar />
      </MapModeProvider>
    );
  },
};

/**
 * Multiple components consuming the same mode context.
 * Shows how different parts of your UI can react to the same mode changes.
 */
export const MultipleConsumers: Story = {
  render: () => {
    // Toolbar component that changes modes
    function ModeToolbar() {
      const { requestModeChange } = useMapMode();

      return (
        <div className='absolute top-4 left-4 flex gap-2'>
          {EXAMPLE_MAP_MODES.map((modeName) => (
            <button
              key={modeName}
              type='button'
              onClick={() => requestModeChange(modeName, 'toolbar')}
              className='rounded bg-white px-3 py-2 text-sm shadow-md hover:bg-gray-50'
            >
              {modeName}
            </button>
          ))}
        </div>
      );
    }

    // Status indicator component
    function ModeIndicator() {
      const { mode } = useMapMode();

      return (
        <div className='absolute top-4 right-4 rounded-lg bg-white p-3 shadow-lg'>
          <p className='text-gray-600 text-xs'>Current Mode</p>
          <p className='mt-1 font-bold font-mono text-lg'>{mode}</p>
        </div>
      );
    }

    // Instructions panel that changes based on mode
    function InstructionsPanel() {
      const { mode } = useMapMode();

      const instructions: Record<string, string> = {
        default: 'Pan and zoom the map',
        drawing: 'Click to add points to draw on the map',
        measuring: 'Click to measure distances',
        editing: 'Select features to edit them',
      };

      return (
        <div className='absolute bottom-4 left-4 rounded-lg bg-white p-4 shadow-lg'>
          <p className='text-gray-700 text-sm'>
            {instructions[mode] || 'Unknown mode'}
          </p>
        </div>
      );
    }

    return (
      <MapModeProvider defaultMode='default'>
        <BaseMap className='relative h-dvh w-dvw' />
        <ModeToolbar />
        <ModeIndicator />
        <InstructionsPanel />
      </MapModeProvider>
    );
  },
};

/**
 * Advanced: Authorization flow with mode ownership.
 * Demonstrates how different "owners" can request mode changes and how to handle authorization.
 */
export const AuthorizationFlow: Story = {
  render: () => {
    function AuthorizationDemo() {
      const { mode, requestModeChange } = useMapMode();
      const [modeOwners, setModeOwners] = useState<Map<string, string>>(
        new Map(),
      );
      const [pendingAuth, setPendingAuth] = useState<{
        authId: string;
        desiredMode: string;
        requestingOwner: string;
      } | null>(null);
      const [eventLog, setEventLog] = useState<string[]>([]);
      const [countdown, setCountdown] = useState<number | null>(null);

      const pendingRequests = useRef<Map<string, string>>(new Map());
      const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

      const emitDecision = useEmit<ModeChangeDecisionEvent>(
        MapModeEvents.changeDecision,
      );

      const addLog = (message: string) => {
        setEventLog((prev) => [
          ...prev,
          `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
      };

      // Listen for mode changes
      useOn<ModeChangedEvent>(MapModeEvents.changed, (event) => {
        addLog(
          `Mode changed: "${event.payload.previousMode}" → "${event.payload.currentMode}"`,
        );

        const requestingOwner = pendingRequests.current.get(
          event.payload.currentMode,
        );
        if (requestingOwner && event.payload.currentMode !== 'default') {
          // Update ownership map if this mode doesn't have an owner yet
          setModeOwners((prev) => {
            const newMap = new Map(prev);
            if (!newMap.has(event.payload.currentMode)) {
              newMap.set(event.payload.currentMode, requestingOwner);
              addLog(
                `"${event.payload.currentMode}" now owned by ${requestingOwner}`,
              );
            }
            return newMap;
          });
          pendingRequests.current.delete(event.payload.currentMode);
        }
      });

      // Listen for authorization requests
      useOn<ModeChangeAuthorizationEvent>(
        MapModeEvents.changeAuthorization,
        (event) => {
          const requestingOwner = pendingRequests.current.get(
            event.payload.desiredMode,
          );
          if (requestingOwner) {
            addLog(
              `Authorization needed: ${requestingOwner} wants "${event.payload.desiredMode}"`,
            );
            setPendingAuth({
              authId: event.payload.authId,
              desiredMode: event.payload.desiredMode,
              requestingOwner,
            });

            // Start 30 second countdown
            setCountdown(30);
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            countdownIntervalRef.current = setInterval(() => {
              setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                  if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                  }
                  return null;
                }
                return prev - 1;
              });
            }, 1000);
          }
        },
      );

      // Listen for decisions
      useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
        const status = event.payload.approved ? 'approved' : 'rejected';
        const reason = event.payload.reason ? ` - ${event.payload.reason}` : '';
        addLog(`Request ${status}${reason}`);

        // Clear countdown when decision is made
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setCountdown(null);
      });

      const handleModeRequest = (modeName: string, owner: string) => {
        pendingRequests.current.set(modeName, owner);
        requestModeChange(modeName, owner);
      };

      const handleApprove = () => {
        if (pendingAuth) {
          const currentModeOwner = modeOwners.get(mode);
          if (currentModeOwner) {
            emitDecision({
              authId: pendingAuth.authId,
              approved: true,
              owner: currentModeOwner,
            });
            setPendingAuth(null);
          }
        }
      };

      const handleReject = () => {
        if (pendingAuth) {
          const currentModeOwner = modeOwners.get(mode);
          if (currentModeOwner) {
            emitDecision({
              authId: pendingAuth.authId,
              approved: false,
              owner: currentModeOwner,
              reason: `${currentModeOwner} rejected the request`,
            });
            setPendingAuth(null);
          }
        }
      };

      // Cleanup countdown interval on unmount
      useEffect(() => {
        return () => {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
        };
      }, []);

      return (
        <div className='absolute top-4 left-4 w-80 rounded-lg bg-white p-4 shadow-lg'>
          <h3 className='mb-4 font-bold text-lg'>Authorization Demo</h3>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Current Mode:</p>
            <p className='rounded bg-blue-100 p-2 text-center font-mono'>
              {mode}
            </p>
            <p className='mt-1 text-gray-600 text-xs'>
              Owner: <strong>{modeOwners.get(mode) || 'None'}</strong>
            </p>
          </div>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Mode Ownership:</p>
            <div className='rounded border bg-gray-50 p-2'>
              {EXAMPLE_MAP_MODES.map((modeName) => {
                const owner = modeOwners.get(modeName);
                const isActive = modeName === mode;
                return (
                  <div
                    key={modeName}
                    className={`flex justify-between border-b py-1 last:border-b-0 ${isActive ? 'font-bold' : ''}`}
                  >
                    <span className='font-mono text-xs'>{modeName}</span>
                    <span className='text-gray-600 text-xs'>
                      {owner || 'Ownerless'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Owner 1 Requests:</p>
            <div className='flex flex-wrap gap-2'>
              {EXAMPLE_MAP_MODES.map((modeName) => {
                const modeOwner = modeOwners.get(modeName);
                const isDisabled = Boolean(
                  modeOwner && modeOwner !== 'owner1' && modeName !== 'default',
                );
                const title = isDisabled
                  ? `Owned by ${modeOwner} - requires authorization`
                  : undefined;

                return (
                  <button
                    key={modeName}
                    type='button'
                    onClick={() => handleModeRequest(modeName, 'owner1')}
                    disabled={isDisabled}
                    title={title}
                    className={`rounded px-3 py-1 text-sm text-white ${
                      isDisabled
                        ? 'cursor-not-allowed bg-green-300'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {modeName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Owner 2 Requests:</p>
            <div className='flex flex-wrap gap-2'>
              {EXAMPLE_MAP_MODES.map((modeName) => {
                const modeOwner = modeOwners.get(modeName);
                const isDisabled = Boolean(
                  modeOwner && modeOwner !== 'owner2' && modeName !== 'default',
                );
                const title = isDisabled
                  ? `Owned by ${modeOwner} - cannot switch to non-default unowned mode`
                  : undefined;

                return (
                  <button
                    key={modeName}
                    type='button'
                    onClick={() => handleModeRequest(modeName, 'owner2')}
                    disabled={isDisabled}
                    title={title}
                    className={`rounded px-3 py-1 text-sm text-white ${
                      isDisabled
                        ? 'cursor-not-allowed bg-purple-300'
                        : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    {modeName}
                  </button>
                );
              })}
            </div>
          </div>

          {pendingAuth && (
            <div className='mb-4 rounded border-2 border-amber-400 bg-amber-50 p-3'>
              <div className='mb-2 flex items-center justify-between'>
                <p className='font-semibold text-sm'>⚠️ Authorization Needed</p>
                {countdown !== null && (
                  <p className='font-mono text-amber-700 text-xs'>
                    {countdown}s remaining
                  </p>
                )}
              </div>
              <p className='mb-2 text-sm'>
                <strong>{pendingAuth.requestingOwner}</strong> wants:{' '}
                <strong>{pendingAuth.desiredMode}</strong>
              </p>
              <p className='mb-3 text-gray-600 text-xs'>
                Only <strong>{modeOwners.get(mode)}</strong> can authorize
                (current mode owner)
              </p>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={handleApprove}
                  className='flex-1 rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600'
                >
                  Approve
                </button>
                <button
                  type='button'
                  onClick={handleReject}
                  className='flex-1 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600'
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className='border-t pt-4'>
            <p className='mb-2 font-semibold text-sm'>Event Log:</p>
            <div className='max-h-40 overflow-y-auto rounded border bg-gray-50 p-2'>
              {eventLog.length === 0 ? (
                <p className='text-gray-400 text-xs'>No events yet</p>
              ) : (
                eventLog.map((entry) => (
                  <p key={entry} className='mb-1 text-xs'>
                    {entry}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <MapModeProvider defaultMode='default'>
        <BaseMap className='relative h-dvh w-dvw' />
        <AuthorizationDemo />
      </MapModeProvider>
    );
  },
};
