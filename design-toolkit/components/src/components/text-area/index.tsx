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
import {
  Text as AriaText,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  TextAreaContext,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';

import { Label } from '../label';
import { TextAreaStyles, TextAreaStylesDefaults } from './styles';
import type { TextAreaInputProps, TextAreaProps } from './types';

const { wrapper, input, description, errorMessage } = TextAreaStyles();

const TextAreaInput = ({
  className,
  ref = null,
  selectOnFocus = false,
  size = TextAreaStylesDefaults.size,
  ...props
}: TextAreaInputProps) => {
  [props, ref] = useContextProps(props, ref, TextAreaContext);

  if (props.readOnly) {
    return (
      <span
        className={input({
          isDisabled: false,
          isReadOnly: props.readOnly,
          size,
          className,
        })}
      >
        {props.value || '\u00A0'}
      </span>
    );
  }

  return (
    <div className='relative flex items-center'>
      <AriaTextArea
        {...props}
        onFocus={(e) => {
          if (selectOnFocus) {
            ref.current?.select();
          }

          props.onFocus?.(e);
        }}
        ref={ref}
        className={({ isDisabled, isInvalid }) =>
          input({
            isDisabled,
            isInvalid,
            isReadOnly: props.readOnly,
            size,
            className,
          })
        }
      />
    </div>
  );
};
TextAreaInput.displayName = 'TextArea.Input';

export function TextArea({
  className,
  description: descriptionText,
  errorMessage: errorMessageText,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  size = TextAreaStylesDefaults.size,
  ...props
}: TextAreaProps) {
  const isSmall = size === 'small';
  const shouldShowDescription = !(isSmall || isInvalid) || isDisabled;
  const shouldShowError = isInvalid && !isDisabled && !isReadOnly;

  return (
    <AriaTextField
      {...(props as AriaTextFieldProps)}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      className={composeRenderProps(className, (className) =>
        wrapper({ className }),
      )}
    >
      {!isSmall && (
        <Label
          className='empty:hidden'
          isDisabled={isDisabled}
          isOptional={!props.isRequired}
        >
          {label}
        </Label>
      )}
      <TextAreaInput
        className={className}
        placeholder={placeholder}
        size={size}
      />
      {shouldShowDescription && (
        <AriaText className={description({ isDisabled })} slot='description'>
          {descriptionText}
        </AriaText>
      )}
      {shouldShowError && (
        <AriaText className={errorMessage()} slot='errorMessage'>
          {errorMessageText}
        </AriaText>
      )}
    </AriaTextField>
  );
}
TextArea.displayName = 'TextArea';
