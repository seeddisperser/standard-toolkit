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

import { uuid } from '@accelint/core';
import { render, renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { destroyStore, getStore } from '../../map-mode/store';
import { useMapMode } from '../../map-mode/use-map-mode';
import { MapIdContext, MapIdProvider } from './provider';
import type { ReactNode } from 'react';

describe('MapIdProvider', () => {
  describe('Context Provision', () => {
    it('provides instanceId to children via context', () => {
      const instanceId = uuid();
      const TestComponent = () => {
        const contextId = useContext(MapIdContext);
        return <div>{contextId}</div>;
      };

      const { container } = render(
        <MapIdProvider instanceId={instanceId}>
          <TestComponent />
        </MapIdProvider>,
      );

      expect(container.textContent).toBe(instanceId);
    });

    it('creates a store for the provided instanceId', () => {
      const instanceId = uuid();

      render(
        <MapIdProvider instanceId={instanceId}>
          <div>Child</div>
        </MapIdProvider>,
      );

      const store = getStore(instanceId);
      expect(store).toBeDefined();
      expect(store?.getSnapshot()).toBe('default');

      // Cleanup
      destroyStore(instanceId);
    });

    it('initializes store with default mode', () => {
      const instanceId = uuid();

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MapIdProvider instanceId={instanceId}>{children}</MapIdProvider>
      );

      const { result } = renderHook(() => useMapMode(), { wrapper });

      expect(result.current.mode).toBe('default');

      // Cleanup
      destroyStore(instanceId);
    });
  });

  describe('Store Management', () => {
    it('reuses existing store if already created for instance', () => {
      const instanceId = uuid();

      const { rerender } = render(
        <MapIdProvider instanceId={instanceId}>
          <div>First render</div>
        </MapIdProvider>,
      );

      const store1 = getStore(instanceId);

      rerender(
        <MapIdProvider instanceId={instanceId}>
          <div>Second render</div>
        </MapIdProvider>,
      );

      const store2 = getStore(instanceId);
      expect(store1).toBe(store2);

      // Cleanup
      destroyStore(instanceId);
    });

    it('destroys store when provider unmounts', () => {
      const instanceId = uuid();

      const { unmount } = render(
        <MapIdProvider instanceId={instanceId}>
          <div>Child</div>
        </MapIdProvider>,
      );

      expect(getStore(instanceId)).toBeDefined();

      unmount();

      expect(getStore(instanceId)).toBeUndefined();
    });
  });

  describe('Multiple Instances', () => {
    it('creates separate stores for different instance IDs', () => {
      const instanceId1 = uuid();
      const instanceId2 = uuid();

      render(
        <div>
          <MapIdProvider instanceId={instanceId1}>
            <div>Instance 1</div>
          </MapIdProvider>
          <MapIdProvider instanceId={instanceId2}>
            <div>Instance 2</div>
          </MapIdProvider>
        </div>,
      );

      const store1 = getStore(instanceId1);
      const store2 = getStore(instanceId2);

      expect(store1).toBeDefined();
      expect(store2).toBeDefined();
      expect(store1).not.toBe(store2);

      // Cleanup
      destroyStore(instanceId1);
      destroyStore(instanceId2);
    });

    it('isolates mode state between different instances', () => {
      const instanceId1 = uuid();
      const instanceId2 = uuid();

      const wrapper1 = ({ children }: { children: ReactNode }) => (
        <MapIdProvider instanceId={instanceId1}>{children}</MapIdProvider>
      );

      const wrapper2 = ({ children }: { children: ReactNode }) => (
        <MapIdProvider instanceId={instanceId2}>{children}</MapIdProvider>
      );

      const { result: result1 } = renderHook(() => useMapMode(), {
        wrapper: wrapper1,
      });
      const { result: result2 } = renderHook(() => useMapMode(), {
        wrapper: wrapper2,
      });

      // Both start in default
      expect(result1.current.mode).toBe('default');
      expect(result2.current.mode).toBe('default');

      // Change mode in first instance
      result1.current.requestModeChange('drawing', 'owner1');

      // Wait for state update
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Instance 1 should be in drawing mode
          const store1 = getStore(instanceId1);
          expect(store1?.getSnapshot()).toBe('drawing');

          // Instance 2 should still be in default mode
          const store2 = getStore(instanceId2);
          expect(store2?.getSnapshot()).toBe('default');

          // Cleanup
          destroyStore(instanceId1);
          destroyStore(instanceId2);
          resolve();
        }, 100);
      });
    });
  });

  describe('Integration with useMapMode', () => {
    it('allows useMapMode hook to access store', () => {
      const instanceId = uuid();

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MapIdProvider instanceId={instanceId}>{children}</MapIdProvider>
      );

      const { result } = renderHook(() => useMapMode(), { wrapper });

      expect(result.current.mode).toBe('default');
      expect(typeof result.current.requestModeChange).toBe('function');

      // Cleanup
      destroyStore(instanceId);
    });

    it('provides correct instanceId to useMapMode', () => {
      const instanceId = uuid();

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MapIdProvider instanceId={instanceId}>{children}</MapIdProvider>
      );

      const TestComponent = () => {
        const contextId = useContext(MapIdContext);
        const { mode } = useMapMode();
        return (
          <div>
            {contextId}-{mode}
          </div>
        );
      };

      const { container } = render(<TestComponent />, { wrapper });

      expect(container.textContent).toBe(`${instanceId}-default`);

      // Cleanup
      destroyStore(instanceId);
    });
  });
});
