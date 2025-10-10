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
import { useEffect, useState } from 'react';
import { BaseMap } from '../index';
import { useMapMode } from '.';
import { MapModeEvents } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
} from './types';

const VALID_MODES = ['default', 'drawing', 'measuring', 'editing'];
const OWNER_ID = 'user-123';
const OWNER_2_ID = 'user-456';

type MapModeStoryArgs = {
  defaultMode: string;
  requestModeOwner1: string;
  requestModeOwner2: string;
};

const meta = {
  title: 'DeckGL/Base Map/Map Mode',
  args: {
    defaultMode: 'default',
    requestModeOwner1: '',
    requestModeOwner2: '',
  },
  argTypes: {
    defaultMode: {
      control: 'select',
      options: VALID_MODES,
      description:
        'Initial mode when the map loads (starts ownerless, auto-accepts first request)',
    },
    requestModeOwner1: {
      control: 'select',
      options: ['', ...VALID_MODES],
      description:
        'Request mode as StatusPanel (owner: user-123) - establishes ownership or auto-approves if already owned',
    },
    requestModeOwner2: {
      control: 'select',
      options: ['', ...VALID_MODES],
      description:
        'Request mode as different owner (owner: user-456) - requires authorization from current mode owner',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<MapModeStoryArgs>;

export default meta;
type Story = StoryObj<MapModeStoryArgs>;

export const MapMode: Story = {
  args: {
    defaultMode: 'default',
    requestModeOwner1: '',
    requestModeOwner2: '',
  },

  render: (args) => {
    // StatusPanel component that uses the map mode context
    function StatusPanel() {
      const [log, setLog] = useState<string[]>([]);
      const [pendingAuth, setPendingAuth] = useState<{
        authId: string;
        desiredMode: string;
      } | null>(null);

      // Get mode from context
      const { mode: currentMode, requestModeChange } = useMapMode();

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

      // Handle requestModeOwner1 control changes (StatusPanel's own requests)
      useEffect(() => {
        if (args.requestModeOwner1) {
          requestModeChange(args.requestModeOwner1, OWNER_ID);
        }
      }, [args.requestModeOwner1, requestModeChange]);

      // Handle requestModeOwner2 control changes (different owner's requests)
      useEffect(() => {
        if (args.requestModeOwner2) {
          requestModeChange(args.requestModeOwner2, OWNER_2_ID);
        }
      }, [args.requestModeOwner2, requestModeChange]);

      const handleApprove = () => {
        if (pendingAuth) {
          emitDecision({
            authId: pendingAuth.authId,
            approved: true,
            owner: OWNER_ID,
          });
          setPendingAuth(null);
        }
      };

      const handleReject = () => {
        if (pendingAuth) {
          emitDecision({
            authId: pendingAuth.authId,
            approved: false,
            owner: OWNER_ID,
            reason: 'Owner rejected the request',
          });
          setPendingAuth(null);
        }
      };

      return (
        <div className='absolute top-4 left-4 w-80 rounded-lg bg-white p-4 shadow-lg'>
          <h2 className='mb-4 font-bold text-lg'>Map Mode Status</h2>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Current Mode:</p>
            <p className='rounded bg-blue-100 p-2 text-center font-mono'>
              {currentMode}
            </p>
          </div>

          {pendingAuth && (
            <div className='mb-4 rounded border-2 border-amber-400 bg-amber-50 p-3'>
              <p className='mb-2 font-semibold text-sm'>
                Pending Authorization:
              </p>
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
                  <p key={`log-${i}`} className='mb-1 text-xs'>
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
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='h-full w-full'
          modeOptions={{
            defaultMode: args.defaultMode,
          }}
        >
          <StatusPanel />
        </BaseMap>
      </div>
    );
  },
};
