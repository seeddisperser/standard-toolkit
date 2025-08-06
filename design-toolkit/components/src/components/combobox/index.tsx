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
import { ChevronDown } from '@accelint/icons';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  ListLayout as AriaListLayout,
  Popover as AriaPopover,
  Text as AriaText,
  Virtualizer as AriaVirtualizer,
  FieldError,
  composeRenderProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { Input } from '../input';
import type { InputProps } from '../input/types';
import { Label } from '../label';
import { Options } from '../options';
import type { OptionsDataItem } from '../options/types';
import { ComboBoxStyles } from './styles';
import type { ComboBoxProps } from './types';

const {
  textFieldBase,
  comboBox,
  input,
  error,
  popOver,
  descriptionText,
  button,
} = ComboBoxStyles();

const InputWrapper = ({
  classNames,
  size = 'medium',
  ...props
}: InputProps) => {
  return (
    <Input
      {...props}
      classNames={{
        ...classNames,
        input: composeRenderProps(classNames?.input, (className) =>
          textFieldBase({ className }),
        ),
      }}
      data-size={size}
    />
  );
};
InputWrapper.displayName = 'ComboBox.Input';

export function ComboBox<T extends OptionsDataItem>({
  children,
  classNames,
  description,
  errorMessage,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  layoutOptions,
  size = 'medium',
  ...props
}: ComboBoxProps<T>) {
  const isSmall = size === 'small';
  const shouldShowDescription = !(isSmall || isInvalid) || isDisabled;
  const shouldShowError = isInvalid && !isDisabled && !isReadOnly;
  const shouldShowLabel = !isSmall && label;

  return (
    <AriaComboBox<T>
      {...props}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      className={comboBox({ className: classNames?.combobox })}
    >
      {({ isDisabled, isRequired }) => (
        <>
          {shouldShowLabel && (
            <Label isDisabled={isDisabled} isRequired={isRequired}>
              {label}
            </Label>
          )}
          <div className={input({ className: classNames?.input?.toString() })}>
            <InputWrapper
              classNames={classNames?.input}
              placeholder={placeholder}
              size={size}
            />
            <AriaButton
              className={button({ className: classNames?.button?.toString() })}
            >
              <Icon size='small'>
                <ChevronDown />
              </Icon>
            </AriaButton>
          </div>
          {shouldShowDescription && (
            <AriaText
              className={descriptionText({
                className: classNames?.description,
              })}
              slot='description'
            >
              {description}
            </AriaText>
          )}
          {shouldShowError && (
            <FieldError className={error()}>{errorMessage}</FieldError>
          )}
          <AriaPopover className={popOver()}>
            <AriaVirtualizer
              layout={AriaListLayout}
              layoutOptions={layoutOptions}
            >
              <Options>{children}</Options>
            </AriaVirtualizer>
          </AriaPopover>
        </>
      )}
    </AriaComboBox>
  );
}
ComboBox.displayName = 'ComboBox';
