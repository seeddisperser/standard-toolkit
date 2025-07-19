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

import type { Key } from '@react-types/shared';
import { isEqual } from 'lodash';
import { useRef } from 'react';
import type {
  TreeActions,
  TreeData,
  TreeMap,
  TreeNode,
  TreeRef,
  UseTreeActionsOptions,
} from '../types';
import { assert, toTree, useIsFirstMount, withDefaults } from './utils';

function buildLookup<T extends object>(
  nodes: TreeNode<T>[],
  lookup: TreeMap<T>,
  parentKey?: Key | null,
): TreeRef<T> {
  console.log('...building');

  nodes.map((node) => {
    lookup.set(node.key, {
      parentKey: parentKey ?? null,
      ...withDefaults(node),
      ...node,
    });
    if (node.children) {
      buildLookup(node.children, lookup, node.key);
    }
  });
  const roots = nodes.map((node) => node.key);
  return { lookup, roots };
}

/**
 * This is a cache created only for performance reasons and is considered
 * to be only a temporary mirror of the data. The data is *always* correct
 * and the cache should be updated according to the data, only
 *
 * This will run once, to build the initial information,
 * then will only be updated with each tree operation, to maximize performance.
 * Writing the lookup is expensive, reading cheap
 *
 * Maybe a sanity check here that if the data doesn't match a toTree build,
 * we completely rebuild the lookup? So we are never out of sync with data?
 */

let cache: TreeRef<any> = { lookup: new Map(), roots: [] };

/**
 * Stateless hook that transforms tree data according to actions
 * it takes in tree and returns a new version of the tree
 *
 * @param nodes
 */
export function useTreeActions<T extends object>({
  nodes,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const isFirstMount = useIsFirstMount();
  const lastBuild = useRef<TreeNode<T>[] | null>(null);

  if (isFirstMount) {
    cache = buildLookup<T>(nodes ?? [], new Map());
    lastBuild.current = toTree(cache);
  }

  // if the nodes coming in don't match our cache, rebuild from data
  if (!isEqual(nodes, lastBuild.current)) {
    cache = buildLookup(nodes, new Map());
  }

  function getTreeNode(key: Key) {
    return cache.lookup.get(key);
  }

  /** INSERT NODES **/
  function insert(
    parentKey: Key | null,
    index: number,
    position: 'before' | 'after',
    ...items: TreeNode<T>[]
  ) {
    items.map((item) => {
      // Create nodes in the lookup
      cache.lookup.set(item.key, {
        parentKey: parentKey ?? null,
        ...withDefaults(item),
        ...item,
      });

      if (parentKey === null) {
        position === 'before'
          ? cache.roots.unshift(item.key)
          : cache.roots.push(item.key);
      } else {
        // Then update the parent's children
        addToParent(parentKey, item, index);
      }
    });

    return updateCacheAndReturn(cache);
  }

  function insertBefore(target: Key | null, ...items: TreeNode<T>[]) {
    if (target === null) {
      return insert(null, 0, 'before', ...items);
    }

    const node = cache.lookup.get(target);
    assert(node !== undefined, `Key of ${target} does not exist in tree`);

    if (node.parentKey) {
      const parent = cache.lookup.get(node.parentKey);
      assert(
        parent !== undefined,
        `Key of ${node.parentKey} does not exist in tree`,
      );

      const nodes = parent.children ?? [];
      const index = nodes.findIndex((n) => n.key === node.key);

      return index >= 0
        ? insert(node.parentKey, index, 'before', ...items)
        : insert(null, 0, 'before', ...items);
    }

    return updateCacheAndReturn(cache);
  }

  function insertAfter(target: Key | null, ...items: TreeNode<T>[]) {
    if (target === null) {
      return insert(null, 0, 'after', ...items);
    }

    const node = cache.lookup.get(target);
    assert(node !== undefined, `Key of ${target} does not exist in tree`);

    if (node.parentKey) {
      const parent = cache.lookup.get(node.parentKey);
      assert(
        parent !== undefined,
        `Key of ${node.parentKey} does not exist in tree`,
      );

      const nodes = parent.children ?? [];
      const index = nodes.findIndex((n) => n.key === node.key);

      return index >= 0
        ? insert(node.parentKey, index + 1, 'after', ...items)
        : insert(null, 0, 'after', ...items);
    }

    return updateCacheAndReturn(cache);
  }

  /** REMOVE NODES **/
  function remove(...keys: Key[]) {
    if (keys.length === 0) {
      return toTree(cache);
    }

    for (const key of keys) {
      const node = cache.lookup.get(key);
      if (!node) {
        return toTree(cache);
      }

      // remove children
      node.children?.map((child) => cache.lookup.delete(child.key));

      // remove node from previous parent or root
      node.parentKey
        ? removeFromParent(node.parentKey, key)
        : removeFromRoot(key);

      cache.lookup.delete(key);
    }

    return updateCacheAndReturn(cache);
  }

  /** UPDATE NODES **/
  function update(key: Key, patch: Partial<TreeNode<T>>) {
    // this is using setState to update the values in our useState cache
    // we are generating new values with the updateTree function that does the walking
    // previousValue --> updateTree --> write new values to state

    // return updateTree(key, (oldNode) => {
    //   const node: TreeNode<T> = {
    //     key: oldNode.key,
    //     label: oldNode.label,
    //     parentKey: oldNode.parentKey,
    //     values: item.values,
    //     children: null,
    //   };
    //
    //   const tree = buildTree(getChildren(oldNode) ?? [], cache.lookup, node.key);
    //   node.children = tree.items;
    //   return node;
    // });

    const node = cache.lookup.get(key);
    assert(node !== undefined, `Key of ${key} does not exist in tree`);

    const newNode = {
      ...node,
      ...patch,
    };

    cache.lookup.set(key, newNode);
    return updateCacheAndReturn(cache);
  }

  /** MOVE NODES **/

  function moveBefore(target: Key | null, items: Set<Key>) {
    if (target === null) {
      toRoot(items, 'before');
      return toTree(cache);
    }

    for (const key of items) {
      move(target, key, 'before');
    }

    return updateCacheAndReturn(cache);
  }

  function moveAfter(target: Key | null, items: Set<Key>) {
    if (target === null) {
      toRoot(items, 'after');
      return toTree(cache);
    }

    for (const key of items) {
      move(target, key, 'after');
    }

    return updateCacheAndReturn(cache);
  }

  function moveInto(target: Key | null, items: Set<Key>) {
    if (target === null) {
      toRoot(items, 'after');
      return toTree(cache);
    }

    for (const key of items) {
      into(target, key);
    }

    return updateCacheAndReturn(cache);
  }

  function updateAll(patch: Partial<TreeNode<T>>) {
    for (const node of cache.lookup.values()) {
      cache.lookup.set(node.key, {
        ...node,
        ...patch,
      });
    }
  }

  /** SELECTION **/
  function getSelectedKeys() {
    const selected = new Set<Key>();
    for (const node of cache.lookup.values()) {
      if (node.isSelected) {
        selected.add(node.key);
      }
    }
    return selected;
  }

  function onSelectionChange(keys: Set<Key>) {
    for (const key of new Set([...keys, ...getSelectedKeys()])) {
      const node = cache.lookup.get(key);
      assert(node !== undefined, `Key of ${key} does not exist in tree`);

      cache.lookup.set(node.key, {
        ...node,
        isSelected: keys.has(key),
      });
    }

    return updateCacheAndReturn(cache);
  }

  function selectAll() {
    updateAll({ isSelected: true });
    return updateCacheAndReturn(cache);
  }

  function unselectAll() {
    updateAll({ isSelected: false });
    return updateCacheAndReturn(cache);
  }

  /** EXPANSION **/
  function getExpandedKeys() {
    return Array.from(cache.lookup.values()).reduce(
      (acc, node) => (node.isExpanded ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  function onExpandedChange(keys: Set<Key>): TreeNode<T>[] {
    for (const key of new Set([...keys, ...getExpandedKeys()])) {
      const node = cache.lookup.get(key);
      assert(node !== undefined, `Key of ${key} does not exist in tree`);

      const isExpanded = keys.has(key);

      cache.lookup.set(node.key, {
        ...node,
        isExpanded,
      });
    }

    return updateCacheAndReturn(cache);
  }

  function expandAll() {
    updateAll({ isExpanded: true });
    return updateCacheAndReturn(cache);
  }

  function collapseAll() {
    updateAll({ isExpanded: false });
    return updateCacheAndReturn(cache);
  }

  /** VISIBILITY **/
  function getVisibleKeys() {
    const visible = new Set<Key>();
    for (const node of cache.lookup.values()) {
      if (node.isVisible) {
        visible.add(node.key);
      }
    }
    return visible;
  }

  function onVisibilityChange(keys: Set<Key>): TreeData<T> {
    for (const key of new Set([...keys, ...getVisibleKeys()])) {
      const node = cache.lookup.get(key);
      assert(node !== undefined, `Key of ${key} does not exist in tree`);

      const isVisible = keys.has(key);

      cache.lookup.set(node.key, {
        ...node,
        isVisible,
        isViewable: isVisible,
      });

      // set children viewable to match changed parent
      // needs to be recursive
      node.children?.map((n) =>
        cache.lookup.set(n.key, { ...n, isViewable: isVisible }),
      );
    }
    return updateCacheAndReturn(cache);
  }

  function revealAll() {
    updateAll({ isVisible: true });
    return updateCacheAndReturn(cache);
  }

  function hideAll() {
    updateAll({ isVisible: false });
    return updateCacheAndReturn(cache);
  }

  /** NODE HELPERS - MUTATIONS TO cache.lookup, ROOT OBJECT **/

  function toRoot(items: Set<Key>, position: 'before' | 'after') {
    for (const key of items) {
      const node = cache.lookup.get(key);
      assert(node !== undefined, `Key of ${key} does not exist in tree`);

      // remove from parent if it had one
      if (node.parentKey) {
        const parent = cache.lookup.get(node.parentKey);
        if (parent) {
          cache.lookup.set(node.parentKey, {
            ...parent,
            children: parent.children?.filter((child) => child.key !== key),
          });
        }
      }

      // change parentKey to root
      cache.lookup.set(key, {
        ...node,
        parentKey: null,
      });

      position === 'before'
        ? cache.roots.unshift(node.key)
        : cache.roots.push(node.key);
    }
  }

  function removeFromParent(parentKey: Key, childKey: Key) {
    const parent = cache.lookup.get(parentKey);
    assert(parent !== undefined, `Key of ${parentKey} does not exist in tree`);

    cache.lookup.set(parentKey, {
      ...parent,
      children: parent.children?.filter((child) => child.key !== childKey),
    });
  }

  function removeFromRoot(key: Key) {
    const idx = cache.roots.indexOf(key);
    cache.roots.splice(idx, 1);
  }

  function addToParent(parentKey: Key, item: TreeNode<T>, index: number) {
    const parent = cache.lookup.get(parentKey);
    assert(parent !== undefined, `Key of ${parentKey} does not exist in tree`);
    assert(index >= 0, 'Target key not found in tree.');

    cache.lookup.set(parentKey, {
      ...parent,
      children: [
        ...(parent.children ?? []).slice(0, index),
        {
          ...withDefaults(item),
          ...item,
          parentKey: parentKey,
        },
        ...(parent.children ?? []).slice(index),
      ],
    });
  }

  function move(target: Key, key: Key, position: 'before' | 'after') {
    const node = cache.lookup.get(key);
    assert(node !== undefined, `Key of ${key} does not exist in tree`);

    const targetParent = cache.lookup.get(target)?.parentKey;

    // remove node from previous parent or root
    node.parentKey
      ? removeFromParent(node.parentKey, key)
      : removeFromRoot(key);

    // if target has parent, add as child
    if (targetParent) {
      const parent = cache.lookup.get(targetParent);
      assert(
        parent !== undefined,
        `Key of ${targetParent} does not exist in tree`,
      );
      const idx =
        parent.children?.findIndex((child) => child.key === target) ?? 0;

      position === 'before'
        ? addToParent(targetParent, node, idx)
        : addToParent(targetParent, node, idx + 1);

      // else add to root
    } else {
      const idx = cache.roots.indexOf(target);
      cache.roots.splice(idx, 0, key);
    }
  }

  function into(target: Key, key: Key) {
    const parent = cache.lookup.get(target);
    const node = cache.lookup.get(key);
    assert(parent !== undefined, `Key of ${target} does not exist in tree`);
    assert(node !== undefined, `Key of ${key} does not exist in tree`);

    cache.lookup.set(target, {
      ...parent,
      children: parent.children?.concat({
        ...node,
        parentKey: parent.key,
      }),
    });

    // remove node from previous parent or root
    node.parentKey
      ? removeFromParent(node.parentKey, key)
      : removeFromRoot(key);
  }

  function updateCacheAndReturn(cache: TreeRef<T>) {
    lastBuild.current = toTree(cache);
    return lastBuild.current;
  }

  return {
    getTreeNode,
    insertAfter,
    insertBefore,
    remove,
    update,
    moveAfter,
    moveBefore,
    moveInto,
    getSelectedKeys,
    onSelectionChange,
    selectAll,
    unselectAll,
    getExpandedKeys,
    onExpandedChange,
    expandAll,
    collapseAll,
    getVisibleKeys,
    onVisibilityChange,
    revealAll,
    hideAll,
  };
}
