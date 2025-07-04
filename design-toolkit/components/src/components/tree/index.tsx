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

import { DragVert } from '@accelint/icons';
import { cva } from 'cva';
import { createContext, memo, useContext } from 'react';
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  DropIndicator,
  type DropTarget,
  useDragAndDrop,
} from 'react-aria-components';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import './tree.css';
import { cn } from '@/lib/utils';
import { ExpandToggle } from './expand-toggle';
import { SelectionToggle } from './selection-toggle';
import type {
  ItemContentProps,
  ItemContentRenderProps,
  ItemTextProps,
  TreeItemProps,
  TreeProps,
} from './types';

const DEFAULT_VARIANT = 'cozy';
const DEFAULT_SELECTION = 'visibility';

export const TreeContext = createContext<
  Pick<TreeProps<object>, 'variant' | 'selectionType' | 'showRuleLines'>
>({
  variant: DEFAULT_VARIANT,
  selectionType: DEFAULT_SELECTION,
  showRuleLines: true,
});

export const treeStyles = cva(
  'fg-default-light flex flex-col overflow-auto outline-hidden',
  {
    variants: {
      variant: {
        cozy: 'text-body-m',
        compact: 'text-body-s',
        tight: 'text-body-s',
      },
    },
    defaultVariants: {
      variant: 'cozy',
    },
  },
);

const defaultRenderDropIndicator = (target: DropTarget) => (
  <DropIndicator target={target} className='border border-highlight-hover' />
);

export function Tree<T extends object>(props: TreeProps<T>) {
  const {
    children,
    className,
    variant = DEFAULT_VARIANT,
    selectionType = DEFAULT_SELECTION,
    selectionMode = 'multiple',
    showRuleLines = true,
    dragAndDropConfig,
    ...rest
  } = props;

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: dragAndDropConfig?.getItems,
    onDrop: dragAndDropConfig?.onDrop,
    onReorder: dragAndDropConfig?.onReorder,
    onRootDrop: dragAndDropConfig?.onRootDrop,
    renderDragPreview: dragAndDropConfig?.renderDragPreview,
    renderDropIndicator:
      dragAndDropConfig?.renderDropIndicator ?? defaultRenderDropIndicator,
  });

  return (
    <TreeContext.Provider value={{ selectionType, variant, showRuleLines }}>
      <AriaTree
        selectionMode={selectionMode}
        dragAndDropHooks={dragAndDropHooks}
        className={cn(className, treeStyles({ variant }))}
        {...rest}
      >
        {children}
      </AriaTree>
    </TreeContext.Provider>
  );
}

const Lines = memo(function Lines({
  level,
  showRuleLines,
}: { level: number; showRuleLines: boolean }) {
  return Array.from({ length: level }).map((_, i) => (
    <div
      key={i}
      className={cn([
        'relative self-stretch group-data-[variant=compact]:w-l group-data-[variant=cozy]:w-xl group-data-[variant=tight]:w-l',
        showRuleLines && (i !== level - 1 ? 'vert-line' : 'branching-line'),
      ])}
    />
  ));
});

const treeItemStyles = cva(
  'fg-default-light overflow-x group flex w-full items-center justify-items-start rounded-medium outline-hidden hover:bg-interactive-hover-dark',
  {
    variants: {
      variant: {
        cozy: 'icon-size-xl gap-s text-header-m',
        compact: 'icon-size-l gap-xs text-header-s',
        tight: 'icon-size-l gap-xs text-header-s',
      },
      isParentVisible: {
        false: 'fg-default-dark',
      },
    },
    defaultVariants: {
      variant: DEFAULT_VARIANT,
    },
  },
);

const treeItemLabelStyles = cva('flex flex-1 items-center', {
  variants: {
    variant: {
      cozy: 'min-h-xxl gap-xs',
      compact: 'min-h-[36px] gap-xs',
      tight: 'min-h-xl gap-xs',
    },
  },
});

export function ItemContent({ children }: ItemContentProps) {
  const { selectionType, variant, showRuleLines } = useContext(TreeContext);
  return (
    <AriaTreeItemContent>
      {(renderProps: ItemContentRenderProps) => {
        const {
          hasChildItems,
          isExpanded,
          isDisabled,
          selectionBehavior,
          selectionMode,
          allowsDragging,
          isSelected,
          level,
        } = renderProps;

        const shouldShowSelection =
          selectionBehavior === 'toggle' && selectionMode !== 'none';
        const isNotRoot = level > 1;
        const sizeTranslated = variant === 'cozy' ? 'medium' : 'small';

        return (
          <div
            className={treeItemStyles({ variant })}
            data-variant={variant}
            data-last-of-set={false}
          >
            {shouldShowSelection && (
              <SelectionToggle
                isSelected={isSelected}
                isDisabled={isDisabled}
                selectionType={selectionType ?? DEFAULT_SELECTION}
                size={sizeTranslated}
                slot='selection'
              />
            )}

            {isNotRoot && (
              <Lines level={level} showRuleLines={showRuleLines ?? true} />
            )}

            <ExpandToggle
              hasChildItems={hasChildItems}
              isExpanded={isExpanded}
              size='medium'
              isDisabled={isDisabled}
            />
            <div className={treeItemLabelStyles({ variant })}>
              {typeof children === 'function'
                ? children({
                    ...renderProps,
                    variant,
                    selectionType,
                    defaultChildren: null,
                  })
                : children}
            </div>
            {allowsDragging && (
              <IconButton slot='drag' size={sizeTranslated}>
                <Icon>
                  <DragVert />
                </Icon>
              </IconButton>
            )}
          </div>
        );
      }}
    </AriaTreeItemContent>
  );
}

/**
 * Handles display of an individual item in a tree
 */
export function TreeItem(props: TreeItemProps) {
  const { id, children, label, isLastOfSet = false, ...rest } = props;

  return (
    <AriaTreeItem
      id={id}
      className='rounded-medium border border-transparent data-[drop-target=true]:border-highlight-hover'
      textValue={label}
      {...rest}
    >
      {children}
    </AriaTreeItem>
  );
}

function ItemDescription({ children }: ItemTextProps) {
  return <div className='fg-default-dark text-body-s'>{children}</div>;
}
ItemDescription.displayName = 'Tree.ItemDescription';

function ItemIcon({ children }: ItemTextProps) {
  return <Icon size='medium'>{children}</Icon>;
}
ItemIcon.displayName = 'Tree.ItemIcon';

Tree.Content = ItemContent;
Tree.Item = TreeItem;
Tree.Description = ItemDescription;
Tree.Icon = ItemIcon;
