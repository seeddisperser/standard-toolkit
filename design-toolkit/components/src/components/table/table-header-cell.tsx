// __private-exports
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

import { ArrowDown, ArrowUp, Kebab } from '@accelint/icons';
import { flexRender, type Header } from '@tanstack/react-table';
import { useContext, useState } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { Menu } from '../menu';
import { TableContext } from './context';
import { TableHeaderCellStyles, TableStyles } from './styles';
import type { TableHeaderCellProps } from './types';
import { HEADER_COLUMN_ACTION, SORT_DIRECTION } from './constants/table';

const { menuItem } = TableStyles();

function HeaderCellMenu<T>({ header }: { header: Header<T, unknown> }) {
  const {
    enableColumnReordering,
    enableSorting,
    moveColumnLeft,
    moveColumnRight,
    persistHeaderKebabMenu,
    setColumnSelection,
    manualSorting,
    handleSortChange,
    handleColumnReordering
  } = useContext(TableContext);

  const [hoveredArrow, setHoveredArrow] = useState(false);

  if (
    [HEADER_COLUMN_ACTION.NUMERAL as string, HEADER_COLUMN_ACTION.KEBAB as string, HEADER_COLUMN_ACTION.SELECTION as string].includes(header.column.id) ||
    !(enableSorting || enableColumnReordering)
  ) {
    return null;
  }

  const sort = header.column.getIsSorted();

  return (
    <Menu.Trigger
      onOpenChange={(isOpen) =>
        setColumnSelection(isOpen ? header.column.id : null)
      }
    >
      <Button
        variant='icon'
        aria-label='Menu'
        onHoverChange={setHoveredArrow}
        className={TableHeaderCellStyles({
          notPersistHeaderKebab: !persistHeaderKebabMenu,
        })}
      >
        <Icon>
          {(!sort || hoveredArrow) && <Kebab />}
          {!hoveredArrow && sort === SORT_DIRECTION.DESC && <ArrowDown />}
          {!hoveredArrow && sort === SORT_DIRECTION.ASC && <ArrowUp />}
        </Icon>
      </Button>
      <Menu>
        {enableColumnReordering && (
          <>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => {
                const index = header.column.getIndex();
                moveColumnLeft(index);
                handleColumnReordering?.(index);
              }}
              isDisabled={header.column.getIsFirstColumn('center')}
            >
              Move Column Left
            </Menu.Item>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => {
                const index = header.column.getIndex();
                moveColumnRight(index);
                handleColumnReordering?.(index);
              }}
              isDisabled={header.column.getIsLastColumn('center')}
            >
              Move Column Right
            </Menu.Item>
          </>
        )}
        {enableColumnReordering && enableSorting && <Menu.Separator />}
        {enableSorting && (
          <>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => {
                manualSorting ? handleSortChange?.(header.column.id, SORT_DIRECTION.ASC) : header.column.toggleSorting(false)
              }}
              isDisabled={sort === SORT_DIRECTION.ASC}
            >
              Sort Ascending
            </Menu.Item>
            <Menu.Item
              classNames={{ item: menuItem() }}
              onAction={() => {
                manualSorting ? handleSortChange?.(header.column.id, SORT_DIRECTION.DESC) : header.column.toggleSorting(true);

              }}
              isDisabled={sort === SORT_DIRECTION.DESC}
            >
              Sort Descending
            </Menu.Item>
            <Menu.Item 
              classNames={{ item: menuItem() }} 
              onAction={() => {
                manualSorting ? handleSortChange?.(header.column.id, null) :  header.column.clearSorting();
              }}
              isDisabled={!sort}
            >
              Clear Sort
            </Menu.Item>
          </>
        )}
      </Menu>
    </Menu.Trigger>
  );
}

export function HeaderCell<T>({
  ref,
  children,
  className,
  header,
  ...rest
}: TableHeaderCellProps<T>) {
  const { columnSelection, enableColumnReordering, enableSorting } =
    useContext(TableContext);
  const showKebab = enableColumnReordering || enableSorting;
  const renderProps = header?.getContext();
  const narrow =
    header?.column.id === HEADER_COLUMN_ACTION.NUMERAL || header?.column.id === HEADER_COLUMN_ACTION.KEBAB;
  const sortLabel = header?.column.getIsSorted() === SORT_DIRECTION.ASC
                    ? 'ascending'
                    : header?.column.getIsSorted() === SORT_DIRECTION.DESC
                    ? 'descending'
                    : undefined
                
  return (
    <th {...rest} ref={ref} aria-sort={sortLabel}>
      <div
        className={TableHeaderCellStyles({
          narrow,
          className,
          isKebabEnabled: showKebab,
        })}
        data-selected={header?.column.id === columnSelection || null}
      >
        {children ||
          (header && (
            <>
              {header.column.id !== HEADER_COLUMN_ACTION.KEBAB &&
                renderProps &&
                flexRender(header.column.columnDef.header, renderProps)}
              <HeaderCellMenu header={header} />
            </>
          ))}
      </div>
    </th>
  );
}
