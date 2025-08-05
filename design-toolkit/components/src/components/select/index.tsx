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
import ChevronDown from '@accelint/icons/chevron-down';
import ChevronUp from '@accelint/icons/chevron-up';
import { createContext } from 'react';
import {
  ListLayout as AriaListLayout,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  Text as AriaText,
  Virtualizer as AriaVirtualizer,
  type ContextValue,
  FieldError,
  composeRenderProps,
} from 'react-aria-components';
import { Popover as AriaPopover } from 'react-aria-components';
import type { ProviderProps } from '../../lib/types';
import { Button } from '../button';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { SelectStyles } from './styles';
import type { SelectProps } from './types';

const { description, error, field, label, select, value } = SelectStyles();

export const SelectContext =
  createContext<ContextValue<SelectProps, HTMLDivElement>>(null);

function SelectProvider({ children, ...props }: ProviderProps<SelectProps>) {
  return (
    <SelectContext.Provider value={props}>{children}</SelectContext.Provider>
  );
}
SelectProvider.displayName = 'Select.Provider';

export function Select(props: SelectProps) {
  const {
    size,
    children,
    classNames,
    description: descriptionProp,
    errorMessage,
    label: labelProp,
    layoutOptions,
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired,
    ...rest
  } = props;
  const isSmall = size === 'small';
  const showDescription = !!descriptionProp && !(isSmall || isInvalid);
  const showLabel = !isSmall && !!label;

  return (
    <AriaSelect
      className={composeRenderProps(classNames?.select, (className) =>
        select({ className }),
      )}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      {...rest}
      data-size={size}
    >
      {composeRenderProps(children, (children, { isOpen }) => (
        <>
          {showLabel && (
            <Label
              className={label({ className: classNames?.label })}
              isRequired={isRequired}
              isDisabled={isDisabled}
            >
              {labelProp}
            </Label>
          )}
          <Button
            variant='outline'
            size={isSmall ? 'small' : 'medium'}
            className={composeRenderProps(classNames?.field, (className) =>
              field({ className }),
            )}
          >
            <AriaSelectValue
              className={value({ className: classNames?.value })}
            />
            <span aria-hidden='true'>
              <Icon>{isOpen ? <ChevronUp /> : <ChevronDown />}</Icon>
            </span>
          </Button>
          {showDescription && (
            <AriaText
              className={description({ className: classNames?.description })}
              slot='description'
            >
              {descriptionProp}
            </AriaText>
          )}
          <FieldError
            className={composeRenderProps(classNames?.error, (className) =>
              error({ className }),
            )}
          >
            {errorMessage}
          </FieldError>
          <AriaPopover className='w-(--trigger-width)'>
            <AriaVirtualizer
              layout={AriaListLayout}
              layoutOptions={layoutOptions}
            >
              <Options>{children}</Options>
            </AriaVirtualizer>
          </AriaPopover>
        </>
      ))}
    </AriaSelect>
  );
}
Select.displayName = 'Select';
Select.Provider = SelectProvider;
