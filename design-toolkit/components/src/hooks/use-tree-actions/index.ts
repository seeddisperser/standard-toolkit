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
import { useMemo, useRef } from 'react';
import type {
  TreeActions,
  TreeData,
  TreeNode,
  TreeNodeBase,
  UseTreeActionsOptions,
} from '../types';
import { treeCache } from './treeCache';

/**
 * Hook that tracks whether this is the first mount of the component
 * @returns {boolean} True if this is the first mount, false otherwise
 */
function useIsFirstMount(): boolean {
  const isFirst = useRef(true);
  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }
  return isFirst.current;
}

/**
 * Stateless hook that transforms tree data according to actions
 * it takes in nodes and returns a new version of the tree.
 *
 * Note: each operation returns the whole tree. Future iterations
 * might want to return only the changed portion of the tree.
 *
 * @returns {TreeActions<T>} Object containing all tree manipulation functions
 *
 * @example
 * ```tsx
 * const treeActions = useTreeActions({
 *   nodes: [
 *     {
 *       key: 'root',
 *       label: 'Root',
 *       children: [
 *         { key: 'child1', label: 'Child 1' },
 *         { key: 'child2', label: 'Child 2' }
 *       ]
 *     }
 *   ]
 * });
 *
 * // Use tree actions
 * const updatedTree = treeActions.insertAfter('child1', [
 *   { key: 'newChild', label: 'New Child' }
 * ]);
 * ```
 */
export function useTreeActions<T extends object>({
  nodes,
}: UseTreeActionsOptions<T>): TreeActions<T> {
  const isFirstMount = useIsFirstMount();
  const lastBuild = useRef<TreeNode<T>[] | null>(null);

  const cache = useMemo(() => treeCache(), []);

  if (isFirstMount) {
    cache.buildLookup<T>(nodes ?? [], new Map());
    lastBuild.current = cache.toTree();
  }

  cache.validateCache<T>(nodes, lastBuild.current);

  /**
   * Initializes the tree cache and returns the current tree structure,
   * with complete properties and defaults for TreeNode<T>.
   * Use this to ensure nodes are complete.
   * @returns {TreeNode<T>[]} The initialized tree structure
   *
   * @example
   * ```tsx
   * const treeActions = useTreeActions({ nodes: initialTree });
   * const tree = treeActions.initialize();
   * console.log('Tree initialized:', tree);
   * ```
   */
  function initialize() {
    return updateAndReturn();
  }

  /**
   * Retrieves a specific tree node by its key
   * @param key - The unique identifier of the node to retrieve
   * @returns {TreeNode<T>} The tree node if found, throws error if not found
   */
  function getTreeNode(key: Key): TreeNode<T> | undefined {
    const node = cache.getNode<T>(key);

    if (!node) {
      return undefined;
    }

    return node;
  }

  /** REMOVE NODES **/
  /**
   * Removes one or more nodes from the tree by their keys
   * @param keys - Variable number of keys to remove from the tree
   * @returns {TreeNode<T>[]} Updated tree structure after removal
   *
   * @example
   * ```tsx
   * // Remove a single node
   * const updatedTree = treeActions.remove('child1');
   *
   * // Remove multiple nodes
   * const updatedTree = treeActions.remove('child1', 'child2', 'child3');
   * ```
   */
  function remove(...keys: Key[]) {
    if (keys.length === 0) {
      return lastBuild.current ?? updateAndReturn();
    }
    keys.map((key) => cache.deleteNode(key));
    return updateAndReturn();
  }

  /** UPDATE NODES **/
  /**
   * Updates a specific node using a callback function
   * @param key - The unique identifier of the node to update
   * @param callback - Function that receives the current node and returns the updated node
   * @returns {TreeNode<T>[]} Updated tree structure after the node update
   *
   * @example
   * ```tsx
   * // Update node label
   * const updatedTree = treeActions.updateNode('child1', (node) => ({
   *   ...node,
   *   label: 'Updated Child 1'
   * }));
   *
   * // Update node with custom data
   * const updatedTree = treeActions.updateNode('child1', (node) => ({
   *   ...node,
   *   isSelected: true,
   *   isExpanded: true,
   *   customData: { status: 'active' }
   * }));
   * ```
   */
  function updateNode(
    key: Key,
    callback: (node: TreeNodeBase<T>) => TreeNodeBase<T>,
  ) {
    const node = cache.getNode<T>(key);
    const newNode = callback(node);
    cache.setNode<T>(key, newNode);
    return updateAndReturn();
  }

  /** INSERT NODES **/
  /**
   * Inserts nodes as children of the target node
   * @param target - The key of the target node to insert into, or null for root level
   * @param nodes - Array of nodes to insert
   * @returns {TreeNode<T>[]} Updated tree structure after insertion
   *
   * @example
   * ```tsx
   * // Insert into a specific node
   * const updatedTree = treeActions.insertInto('parent', [
   *   { key: 'newChild1', label: 'New Child 1' },
   *   { key: 'newChild2', label: 'New Child 2' }
   * ]);
   *
   * // Insert at root level
   * const updatedTree = treeActions.insertInto(null, [
   *   { key: 'newRoot', label: 'New Root Node' }
   * ]);
   * ```
   */
  function insertInto(target: Key | null, nodes: TreeNode<T>[]) {
    nodes.map((node) => cache.insert(target, node, 0));
    return updateAndReturn();
  }

  /**
   * Inserts nodes before the target node
   * @param target - The key of the target node to insert before, or null for root level
   * @param nodes - Array of nodes to insert
   * @returns {TreeNode<T>[]} Updated tree structure after insertion
   *
   * @example
   * ```tsx
   * // Insert before a specific node
   * const updatedTree = treeActions.insertBefore('child2', [
   *   { key: 'newChild', label: 'New Child' }
   * ]);
   *
   * // Insert at the beginning of root level
   * const updatedTree = treeActions.insertBefore(null, [
   *   { key: 'newFirst', label: 'New First Root' }
   * ]);
   * ```
   */
  function insertBefore(target: Key | null, nodes: TreeNode<T>[]) {
    cache.addNodes(target, nodes, 'before');
    return updateAndReturn();
  }

  /**
   * Inserts nodes after the target node
   * @param target - The key of the target node to insert after, or null for root level
   * @param nodes - Array of nodes to insert
   * @returns {TreeNode<T>[]} Updated tree structure after insertion
   *
   * @example
   * ```tsx
   * // Insert after a specific node
   * const updatedTree = treeActions.insertAfter('child1', [
   *   { key: 'newChild', label: 'New Child' }
   * ]);
   *
   * // Insert at the end of root level
   * const updatedTree = treeActions.insertAfter(null, [
   *   { key: 'newLast', label: 'New Last Root' }
   * ]);
   * ```
   */
  function insertAfter(target: Key | null, nodes: TreeNode<T>[]) {
    cache.addNodes(target, nodes, 'after');
    return updateAndReturn();
  }

  /** MOVE NODES **/
  /**
   * Moves nodes as children of the target node
   * @param target - The key of the target node to move into, or null for root level
   * @param nodes - Set of node keys to move
   * @returns {TreeNode<T>[]} Updated tree structure after moving
   *
   * @example
   * ```tsx
   * // Move nodes into a parent
   * const updatedTree = treeActions.moveInto('parent', new Set(['child1', 'child2']));
   *
   * // Move nodes to root level
   * const updatedTree = treeActions.moveInto(null, new Set(['child1', 'child2']));
   * ```
   */
  function moveInto(target: Key | null, nodes: Set<Key>) {
    Array.from(nodes).map((key) => cache.move(target, key, 0));
    return updateAndReturn();
  }

  /**
   * Moves nodes before the target node
   * @param target - The key of the target node to move before, or null for root level
   * @param nodes - Set of node keys to move
   * @returns {TreeNode<T>[]} Updated tree structure after moving
   *
   * @example
   * ```tsx
   * // Move nodes before a specific node
   * const updatedTree = treeActions.moveBefore('child3', new Set(['child1', 'child2']));
   *
   * // Move nodes to the beginning of root level
   * const updatedTree = treeActions.moveBefore(null, new Set(['child1', 'child2']));
   * ```
   */
  function moveBefore(target: Key | null, nodes: Set<Key>) {
    cache.moveNodes(target, nodes, 'before');
    return updateAndReturn();
  }

  /**
   * Moves nodes after the target node
   * @param target - The key of the target node to move after, or null for root level
   * @param nodes - Set of node keys to move
   * @returns {TreeNode<T>[]} Updated tree structure after moving
   *
   * @example
   * ```tsx
   * // Move nodes after a specific node
   * const updatedTree = treeActions.moveAfter('child1', new Set(['child2', 'child3']));
   *
   * // Move nodes to the end of root level
   * const updatedTree = treeActions.moveAfter(null, new Set(['child1', 'child2']));
   * ```
   */
  function moveAfter(target: Key | null, nodes: Set<Key>) {
    cache.moveNodes(target, nodes, 'after');
    return updateAndReturn();
  }

  /** SELECTION **/
  /**
   * Gets all currently selected node keys
   * @returns {Set<Key>} Set of keys for all selected nodes
   *
   * @example
   * ```tsx
   * const selectedKeys = treeActions.getSelectedKeys();
   * console.log('Selected nodes:', Array.from(selectedKeys));
   *
   * // Use with selection change
   * const newSelection = new Set(['child1', 'child3']);
   * treeActions.onSelectionChange(newSelection);
   * ```
   */
  function getSelectedKeys() {
    return Array.from(cache.getAllNodes()).reduce(
      (acc, node) => (node.isSelected ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  /**
   * Updates the selection state of nodes
   * @param keys - Set of keys to set as selected (all other nodes will be unselected)
   * @returns {TreeNode<T>[]} Updated tree structure after selection change
   *
   * @example
   * ```tsx
   * // Select specific nodes
   * const updatedTree = treeActions.onSelectionChange(new Set(['child1', 'child2']));
   *
   * // Clear selection
   * const updatedTree = treeActions.onSelectionChange(new Set());
   *
   * // Toggle selection
   * const currentSelection = treeActions.getSelectedKeys();
   * const newSelection = new Set([...currentSelection, 'child3']);
   * const updatedTree = treeActions.onSelectionChange(newSelection);
   * ```
   */
  function onSelectionChange(keys: Set<Key>) {
    for (const key of new Set([...keys, ...getSelectedKeys()])) {
      const node = cache.getNode<T>(key);
      cache.setNode<T>(node.key, {
        ...node,
        isSelected: keys.has(key),
      });
    }

    return updateAndReturn();
  }

  /**
   * Selects all nodes in the tree
   * @returns {TreeNode<T>[]} Updated tree structure with all nodes selected
   *
   * @example
   * ```tsx
   * const updatedTree = treeActions.selectAll();
   * console.log('All nodes selected:', treeActions.getSelectedKeys().size);
   * ```
   */
  function selectAll() {
    cache.setAllNodes({ isSelected: true });
    return updateAndReturn();
  }

  /**
   * Unselects all nodes in the tree
   * @returns {TreeNode<T>[]} Updated tree structure with all nodes unselected
   *
   * @example
   * ```tsx
   * const updatedTree = treeActions.unselectAll();
   * console.log('No nodes selected:', treeActions.getSelectedKeys().size === 0);
   * ```
   */
  function unselectAll() {
    cache.setAllNodes({ isSelected: false });
    return updateAndReturn();
  }

  /** EXPANSION **/
  /**
   * Gets all currently expanded node keys
   * @returns {Set<Key>} Set of keys for all expanded nodes
   *
   * @example
   * ```tsx
   * const expandedKeys = treeActions.getExpandedKeys();
   * console.log('Expanded nodes:', Array.from(expandedKeys));
   *
   * // Use with expansion change
   * const newExpanded = new Set(['parent1', 'parent2']);
   * treeActions.onExpandedChange(newExpanded);
   * ```
   */
  function getExpandedKeys() {
    return Array.from(cache.getAllNodes()).reduce(
      (acc, node) => (node.isExpanded ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  /**
   * Updates the expansion state of nodes
   * @param keys - Set of keys to set as expanded (all other nodes will be collapsed)
   * @returns {TreeNode<T>[]} Updated tree structure after expansion change
   *
   * @example
   * ```tsx
   * // Expand specific nodes
   * const updatedTree = treeActions.onExpandedChange(new Set(['parent1', 'parent2']));
   *
   * // Collapse all nodes
   * const updatedTree = treeActions.onExpandedChange(new Set());
   *
   * // Toggle expansion
   * const currentExpanded = treeActions.getExpandedKeys();
   * const newExpanded = new Set([...currentExpanded, 'parent3']);
   * const updatedTree = treeActions.onExpandedChange(newExpanded);
   * ```
   */
  function onExpandedChange(keys: Set<Key>): TreeNode<T>[] {
    for (const key of new Set([...keys, ...getExpandedKeys()])) {
      const node = cache.getNode<T>(key);
      const isExpanded = keys.has(key);
      cache.setNode(node.key, {
        ...node,
        isExpanded,
      });
    }
    return updateAndReturn();
  }

  /**
   * Expands all nodes in the tree
   * @returns {TreeNode<T>[]} Updated tree structure with all nodes expanded
   *
   * @example
   * ```tsx
   * const updatedTree = treeActions.expandAll();
   * console.log('All nodes expanded:', treeActions.getExpandedKeys().size);
   * ```
   */
  function expandAll() {
    cache.setAllNodes({ isExpanded: true });
    return updateAndReturn();
  }

  /**
   * Collapses all nodes in the tree
   * @returns {TreeNode<T>[]} Updated tree structure with all nodes collapsed
   *
   * @example
   * ```tsx
   * const updatedTree = treeActions.collapseAll();
   * console.log('No nodes expanded:', treeActions.getExpandedKeys().size === 0);
   * ```
   */
  function collapseAll() {
    cache.setAllNodes({ isExpanded: false });
    return updateAndReturn();
  }

  /** VISIBILITY **/
  /**
   * Gets all currently visible node keys
   * @returns {Set<Key>} Set of keys for all visible nodes
   *
   * @example
   * ```tsx
   * const visibleKeys = treeActions.getVisibleKeys();
   * console.log('Visible nodes:', Array.from(visibleKeys));
   *
   * // Use with visibility change
   * const newVisible = new Set(['node1', 'node2']);
   * treeActions.onVisibilityChange(newVisible);
   * ```
   */
  function getVisibleKeys() {
    return Array.from(cache.getAllNodes()).reduce(
      (acc, node) => (node.isVisible ? acc.add(node.key) : acc),
      new Set<Key>(),
    );
  }

  /**
   * Changes visibility of nodes. Updates both isVisible and isViewable properties.
   * If a key is not in the provided Set, it will be hidden.
   * @param keys - Set of keys to set as visible (all other nodes will be hidden)
   * @returns {TreeData<T>} Updated tree structure after visibility change
   *
   * @example
   * ```tsx
   * // Show specific nodes
   * const updatedTree = treeActions.onVisibilityChange(new Set(['node1', 'node2']));
   *
   * // Hide all nodes
   * const updatedTree = treeActions.onVisibilityChange(new Set());
   *
   * // Show only parent nodes
   * const parentKeys = new Set(['parent1', 'parent2']);
   * const updatedTree = treeActions.onVisibilityChange(parentKeys);
   *
   * // Toggle visibility
   * const currentVisible = treeActions.getVisibleKeys();
   * const newVisible = new Set([...currentVisible, 'node3']);
   * const updatedTree = treeActions.onVisibilityChange(newVisible);
   * ```
   */
  function onVisibilityChange(keys: Set<Key>): TreeData<T> {
    const { key, state } = cache.getVisibilityChange(keys, getVisibleKeys());

    if (key) {
      const node = cache.getNode<T>(key);
      const isVisible = state;

      // update visibility for nodes
      cache.setNode(node.key, {
        ...node,
        isVisible,
        isViewable: isVisible,
      });

      node.children?.map((child) => cache.setViewable(child.key, isVisible));
    }

    return updateAndReturn();
  }

  /**
   * Makes all nodes visible in the tree
   * @returns {TreeNode<T>[]} Updated tree structure with all nodes visible
   *
   * @example
   * ```tsx
   * const updatedTree = treeActions.revealAll();
   * console.log('All nodes visible:', treeActions.getVisibleKeys().size);
   * ```
   */
  function revealAll() {
    cache.setAllNodes({ isVisible: true });
    return updateAndReturn();
  }

  /**
   * Hides all nodes in the tree
   * @returns {TreeNode<T>[]} Updated tree structure with all nodes hidden
   *
   * @example
   * ```tsx
   * const updatedTree = treeActions.hideAll();
   * console.log('No nodes visible:', treeActions.getVisibleKeys().size === 0);
   * ```
   */
  function hideAll() {
    cache.setAllNodes({ isVisible: false });
    return updateAndReturn();
  }

  /**
   * Internal function to update the last build reference and return the current tree
   * @returns {TreeNode<T>[]} The current tree structure
   */
  function updateAndReturn() {
    lastBuild.current = cache.toTree();
    return lastBuild.current;
  }

  return {
    initialize,
    getTreeNode,
    insertInto,
    insertAfter,
    insertBefore,
    remove,
    updateNode,
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
