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
import { CancelFill } from '@accelint/icons';
import { createContext, useContext } from 'react';
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Button,
  composeRenderProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import {
  ChipListStyles,
  ChipStyles,
  DeletableChipStyles,
  SelectableChipStyles,
} from './styles';
import type {
  ChipListProps,
  ChipProps,
  DeletableChipProps,
  SelectableChipProps,
} from './types';

// This coordinator is used as a way for the `<Chip>` component to understand
// whether or not it is being rendered inside of a `<Chip.List>`. This allows
// us to opt-into using an `<AriaTag>` or a `<span>` to ensure standalone
// functionality.
const Coordinator = createContext(false);

export const Chip = ({
  className,
  size = 'medium',
  variant = 'info',
  ...props
}: ChipProps) => {
  const context = useContext(Coordinator);

  // If any context was returned from the `Coordinator` context, then
  // we are being rendered inside of a `Chip.List` and need to render
  // an `<AriaTag>`.
  const Component = context ? AriaTag : 'span';
  return (
    <Icon.Provider size={size === 'medium' ? 'small' : 'xsmall'}>
      <Component
        className={ChipStyles({ size, variant, className })}
        {...props}
      />
    </Icon.Provider>
  );
};
Chip.displayName = 'Chip';

function ChipList<T extends object>({
  children,
  className,
  items,
  renderEmptyState,
  ...props
}: ChipListProps<T>) {
  return (
    <Coordinator.Provider value={true}>
      <AriaTagGroup {...props}>
        <AriaTagList<T>
          items={items}
          renderEmptyState={renderEmptyState}
          className={composeRenderProps(className, (className) =>
            ChipListStyles({ className }),
          )}
        >
          {children}
        </AriaTagList>
      </AriaTagGroup>
    </Coordinator.Provider>
  );
}
ChipList.displayName = 'Chip.List';
Chip.List = ChipList;

export const SelectableChip = ({
  className,
  isDisabled = false,
  size = 'medium',
  ...props
}: SelectableChipProps) => (
  <AriaTag
    className={composeRenderProps(className, (className) =>
      SelectableChipStyles({ size, isDisabled, className }),
    )}
    {...props}
  />
);
SelectableChip.displayName = 'Chip.Selectable';
Chip.Selectable = SelectableChip;

const { base, remove } = DeletableChipStyles();

export const DeletableChip = ({
  children,
  className,
  isDisabled = false,
  size = 'medium',
  textValue,
  ...props
}: DeletableChipProps) => {
  const internalTextValue =
    textValue ?? (typeof children === 'string' ? children : undefined);

  return (
    <AriaTag
      className={composeRenderProps(className, (className) =>
        base({ size, isDisabled: true, className }),
      )}
      textValue={internalTextValue}
      {...props}
    >
      {({ allowsRemoving, ...props }) => {
        if (!allowsRemoving) {
          throw new Error(
            'You have a <Chip.Deletable> in a <Chip.List> does not specify an onRemove handler.',
          );
        }

        return (
          <>
            {typeof children === 'function'
              ? children({ allowsRemoving, ...props })
              : children}
            <Button slot='remove' className={remove({ isDisabled })}>
              <Icon size='small'>
                <CancelFill />
              </Icon>
            </Button>
          </>
        );
      }}
    </AriaTag>
  );
};
DeletableChip.displayName = 'Chip.Deletable';
Chip.Deletable = DeletableChip;
