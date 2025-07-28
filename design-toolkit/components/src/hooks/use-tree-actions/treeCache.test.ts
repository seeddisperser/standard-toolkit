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

import { describe, expect, it } from 'vitest';
import type { TreeNode } from '../types';
import {
  type Values,
  complexTree,
  defaultTree,
  nodeDefaults,
} from './_fixtures';
import { treeCache } from './treeCache';

const setup = (props: { nodes?: TreeNode<Values>[] } = {}) => {
  const { nodes = defaultTree } = props;
  const cache = treeCache();
  cache.buildLookup<Values>(nodes ?? [], new Map());
  return cache;
};

describe('treeCache module', () => {
  it('builds a tree from a treeRef', () => {
    const cache = setup();
    expect(cache.toTree()).toStrictEqual([
      {
        ...nodeDefaults,
        key: 'one',
        label: 'One',
        children: [
          {
            ...nodeDefaults,
            parentKey: 'one',
            key: 'two',
            label: 'Two',
          },
          {
            ...nodeDefaults,
            parentKey: 'one',
            key: 'three',
            label: 'Three',
          },
        ],
      },
    ]);
  });

  it('gets a node by key', () => {
    const cache = setup();
    expect(cache.getNode('two')).toStrictEqual({
      ...nodeDefaults,
      key: 'two',
      label: 'Two',
      parentKey: 'one',
    });
  });

  it('sets a node value', () => {
    const cache = setup();
    const node = cache.getNode('two');
    cache.setNode('two', {
      ...node,
      label: 'Dos',
      values: {
        isTrue: true,
        test: 'foo',
      },
    });
    expect(cache.getNode('two')).toStrictEqual({
      ...node,
      label: 'Dos',
      values: {
        isTrue: true,
        test: 'foo',
      },
    });
  });

  describe('moveNodes', () => {
    it('moves a single node before a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child2']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(3);
      expect(result?.children?.[0]?.key).toBe('child2');
      expect(result?.children?.[1]?.key).toBe('child4');
      expect(result?.children?.[2]?.key).toBe('child5');

      expect(cache.getNode('child2').parentKey).toBe('root2');
    });

    it('moves a single node after a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child1']), 'after');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(3);
      expect(result?.children?.[0]?.key).toBe('child4');
      expect(result?.children?.[1]?.key).toBe('child1');
      expect(result?.children?.[2]?.key).toBe('child5');

      expect(cache.getNode('child1').parentKey).toBe('root2');
    });

    it('moves multiple nodes before a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child1', 'child2']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child1');
      expect(result?.children?.[1]?.key).toBe('child2');
      expect(result?.children?.[2]?.key).toBe('child4');
      expect(result?.children?.[3]?.key).toBe('child5');

      expect(cache.getNode('child1').parentKey).toBe('root2');
      expect(cache.getNode('child2').parentKey).toBe('root2');
    });

    it('moves multiple nodes after a target node', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child2', 'child3']), 'after');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root2');

      expect(result?.children).toHaveLength(4);
      expect(result?.children?.[0]?.key).toBe('child4');
      expect(result?.children?.[1]?.key).toBe('child2');
      expect(result?.children?.[2]?.key).toBe('child3');
      expect(result?.children?.[3]?.key).toBe('child5');

      expect(cache.getNode('child2').parentKey).toBe('root2');
      expect(cache.getNode('child3').parentKey).toBe('root2');
    });

    it('moves nodes to the beginning of root level when target is null and position is before', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes(null, new Set(['child1', 'child2']), 'before');

      const tree = cache.toTree();

      expect(tree).toHaveLength(4);
      expect(tree[0]?.key).toBe('child1');
      expect(tree[1]?.key).toBe('child2');
      expect(tree[2]?.key).toBe('root1');
      expect(tree[3]?.key).toBe('root2');

      expect(cache.getNode('child1').parentKey).toBe(null);
      expect(cache.getNode('child2').parentKey).toBe(null);
    });

    it('moves nodes to the end of root level when target is null and position is after', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes(null, new Set(['child1', 'child2']), 'after');

      const tree = cache.toTree();

      expect(tree).toHaveLength(4);
      expect(tree[0]?.key).toBe('root1');
      expect(tree[1]?.key).toBe('root2');
      expect(tree[2]?.key).toBe('child1');
      expect(tree[3]?.key).toBe('child2');

      expect(cache.getNode('child1').parentKey).toBe(null);
      expect(cache.getNode('child2').parentKey).toBe(null);
    });

    it('reorders nodes within the same parent', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child1', new Set(['child3']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(3);
      expect(result?.children?.[0]?.key).toBe('child3');
      expect(result?.children?.[1]?.key).toBe('child1');
      expect(result?.children?.[2]?.key).toBe('child2');

      // Verify child3's parent remains the same
      expect(cache.getNode('child3').parentKey).toBe('root1');
    });

    it('removes moved nodes from their original parent', () => {
      const cache = setup({ nodes: complexTree });
      cache.moveNodes('child4', new Set(['child1', 'child2']), 'before');

      const tree = cache.toTree();
      const result = tree.find((node) => node.key === 'root1');

      expect(result?.children).toHaveLength(1);
      expect(result?.children?.[0]?.key).toBe('child3');
    });
  });
});
