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
import { render } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { destroyStore, getStore } from '../../map-mode/store';
import { MapIdContext, MapIdProvider } from './provider';

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

      // Cleanup
      destroyStore(instanceId);
    });
  });

  describe('Provider Lifecycle', () => {
    it('reuses existing store on rerender', () => {
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

    it('destroys store when unmounted', () => {
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
});
