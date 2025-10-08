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
import { useState } from 'react';
import { BaseMap } from '../index';
import { MapModeEvents } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
  ModeChangeRequestEvent,
} from './types';

const meta: Meta = {
  title: 'DeckGL/Base Map/Map Mode',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const VALID_MODES = ['default', 'drawing', 'measuring', 'editing'];
const OWNER_ID = 'user-123';

function MapModeDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [currentMode, setCurrentMode] = useState('default');
  const [pendingAuth, setPendingAuth] = useState<{
    authId: string;
    desiredMode: string;
  } | null>(null);

  const emitRequest = useEmit<ModeChangeRequestEvent>(
    MapModeEvents.changeRequest,
  );
  const emitDecision = useEmit<ModeChangeDecisionEvent>(
    MapModeEvents.changeDecision,
  );

  const addLog = (message: string) => {
    setLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Listen for mode changes
  useOn<ModeChangedEvent>(MapModeEvents.changed, (event) => {
    setCurrentMode(event.payload.currentMode);
    addLog(
      `Mode changed from "${event.payload.previousMode}" to "${event.payload.currentMode}"`,
    );
  });

  // Listen for authorization requests
  useOn<ModeChangeAuthorizationEvent>(
    MapModeEvents.changeAuthorization,
    (event) => {
      addLog(
        `Authorization requested for mode change to "${event.payload.desiredMode}" (authId: ${event.payload.authId})`,
      );
      setPendingAuth({
        authId: event.payload.authId,
        desiredMode: event.payload.desiredMode,
      });
    },
  );

  // Listen for decisions
  useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
    const status = event.payload.approved ? 'approved' : 'rejected';
    const reason = event.payload.reason ? ` (${event.payload.reason})` : '';
    addLog(`Mode change ${status}${reason}`);
  });

  const requestModeChange = (desiredMode: string, requestOwner?: string) => {
    emitRequest({
      desiredMode,
      owner: requestOwner,
    });
  };

  const handleApprove = () => {
    if (pendingAuth) {
      emitDecision({
        authId: pendingAuth.authId,
        approved: true,
        desiredMode: pendingAuth.desiredMode,
        currentMode,
      });
      setPendingAuth(null);
    }
  };

  const handleReject = () => {
    if (pendingAuth) {
      emitDecision({
        authId: pendingAuth.authId,
        approved: false,
        desiredMode: pendingAuth.desiredMode,
        currentMode,
        reason: 'Owner rejected the request',
      });
      setPendingAuth(null);
    }
  };

  return (
    <div className='relative h-dvh w-dvw'>
      <BaseMap
        className='h-full w-full'
        modeOptions={{
          defaultMode: 'default',
          owner: OWNER_ID,
          validModes: VALID_MODES,
        }}
      />

      {/* Controls Panel */}
      <div className='absolute top-4 left-4 w-80 rounded-lg bg-white p-4 shadow-lg'>
        <h2 className='mb-4 font-bold text-lg'>Map Mode Control</h2>

        <div className='mb-4'>
          <p className='mb-2 font-semibold text-sm'>Current Mode:</p>
          <p className='rounded bg-blue-100 p-2 text-center font-mono'>
            {currentMode}
          </p>
        </div>

        <div className='mb-4'>
          <p className='mb-2 font-semibold text-sm'>Request Mode Change:</p>
          <div className='grid grid-cols-2 gap-2'>
            {VALID_MODES.map((m) => (
              <button
                key={m}
                type='button'
                onClick={() => requestModeChange(m, OWNER_ID)}
                disabled={m === currentMode}
                className='rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:bg-gray-300'
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <p className='mb-2 font-semibold text-sm'>
            Request Without Owner (needs auth):
          </p>
          <div className='grid grid-cols-2 gap-2'>
            {VALID_MODES.map((m) => (
              <button
                key={m}
                type='button'
                onClick={() => requestModeChange(m)}
                disabled={m === currentMode}
                className='rounded bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600 disabled:bg-gray-300'
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <p className='mb-2 font-semibold text-sm'>Test Invalid Mode:</p>
          <button
            type='button'
            onClick={() => requestModeChange('invalid-mode')}
            className='w-full rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600'
          >
            Request Invalid Mode
          </button>
        </div>

        {pendingAuth && (
          <div className='mb-4 rounded border-2 border-amber-400 bg-amber-50 p-3'>
            <p className='mb-2 font-semibold text-sm'>Pending Authorization:</p>
            <p className='mb-2 text-sm'>Mode: {pendingAuth.desiredMode}</p>
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
            {log.length === 0 ? (
              <p className='text-gray-400 text-xs'>No events yet</p>
            ) : (
              log.map((entry, i) => (
                <p key={i} className='mb-1 text-xs'>
                  {entry}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const MapMode: Story = {
  render: () => <MapModeDemo />,
};
