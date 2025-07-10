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
  TextAreaContext as AriaTextAreaContext,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  FieldError,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';

import { createContext, useContext } from 'react';
import { Label } from '../label';
import { TextAreaStyles, TextAreaStylesDefaults } from './styles';
import type { TextAreaInputProps, TextAreaProps } from './types';

const { field, input, description } = TextAreaStyles();

export const TextAreaContext = createContext<{
  size?: 'small' | 'medium';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
} | null>(null);

export function TextAreaFieldInput({
  className,
  ref = null,
  selectOnFocus = false,
  size,
  ...props
}: TextAreaInputProps) {
  [props, ref] = useContextProps(props, ref, AriaTextAreaContext);

  const context = useContext(TextAreaContext);
  const finalSize = size ?? context?.size ?? TextAreaStylesDefaults.size;

  if (props.readOnly) {
    return (
      <span
        className={input({
          isDisabled: false,
          isReadOnly: props.readOnly,
          size: finalSize,
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
            size: finalSize,
            className,
          })
        }
      />
    </div>
  );
}
TextAreaFieldInput.displayName = 'TextAreaField.Input';

export function TextAreaField({
  classNames,
  description: descriptionText,
  errorMessage: errorMessageText,
  isDisabled,
  isInvalid,
  isReadOnly,
  label,
  placeholder,
  size,
  ...props
}: TextAreaProps) {
  const context = useContext(TextAreaContext);
  const finalSize = size ?? context?.size ?? TextAreaStylesDefaults.size;
  const finalIsDisabled = isDisabled ?? context?.isDisabled ?? false;
  const finalIsInvalid = isInvalid ?? context?.isInvalid ?? false;
  const finalIsReadOnly = isReadOnly ?? context?.isReadOnly ?? false;

  const isSmall = finalSize === 'small';
  const shouldShowDescription = !(isSmall || finalIsInvalid) || finalIsDisabled;

  return (
    <TextAreaContext.Provider
      value={{
        size: finalSize,
        isDisabled: finalIsDisabled,
        isInvalid: finalIsInvalid,
        isReadOnly: finalIsReadOnly,
      }}
    >
      <AriaTextField
        {...(props as AriaTextFieldProps)}
        isDisabled={finalIsDisabled}
        isInvalid={finalIsInvalid}
        isReadOnly={finalIsReadOnly}
        className={composeRenderProps(classNames?.field, (className) =>
          field({ className }),
        )}
      >
        {!isSmall && (
          <Label
            className='empty:hidden'
            isDisabled={finalIsDisabled}
            isRequired={props.isRequired}
          >
            {label}
          </Label>
        )}
        <TextAreaFieldInput
          className={classNames?.input}
          placeholder={placeholder}
          size={finalSize}
        />
        {shouldShowDescription && (
          <AriaText
            className={description({ isDisabled: finalIsDisabled })}
            slot='description'
          >
            {descriptionText}
          </AriaText>
        )}
        <FieldError className='fg-serious text-body-xs empty:hidden'>
          {errorMessageText}
        </FieldError>
      </AriaTextField>
    </TextAreaContext.Provider>
  );
}
TextAreaField.displayName = 'TextAreaField';
