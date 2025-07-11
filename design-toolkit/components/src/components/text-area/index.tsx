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
import { createContext, useContext } from 'react';
import {
  Text as AriaText,
  TextArea as AriaTextArea,
  TextAreaContext as AriaTextAreaContext,
  TextField as AriaTextField,
  type ContextValue,
  FieldError,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';

import { isSlottedContextValue } from '@/lib/utils';
import { Label } from '../label';
import { TextAreaStyles, TextAreaStylesDefaults } from './styles';
import type {
  TextAreaFieldProps,
  TextAreaProps,
  TextAreaProviderProps,
} from './types';

const { field, input, description } = TextAreaStyles();

// context / provider
export const TextAreaContext =
  createContext<ContextValue<TextAreaFieldProps, HTMLDivElement>>(null);

function TextAreaProvider({ children, ...props }: TextAreaProviderProps) {
  return (
    <TextAreaContext.Provider value={props}>
      {children}
    </TextAreaContext.Provider>
  );
}
TextAreaProvider.displayName = 'TextArea.Provider';

// input
export function TextArea({ ref, ...props }: TextAreaProps) {
  [props, ref] = useContextProps(props, ref ?? null, AriaTextAreaContext);

  const context = useContext(TextAreaContext);
  const finalSize =
    props.size ??
    (isSlottedContextValue(context) ? undefined : context?.size) ??
    TextAreaStylesDefaults.size;

  return (
    <div className='relative flex items-center'>
      <AriaTextArea
        {...props}
        onFocus={(e) => {
          if (props.selectOnFocus) {
            ref.current?.select();
          }

          props.onFocus?.(e);
        }}
        ref={ref}
        readOnly={props.readOnly}
        className={({ isDisabled, isInvalid }) =>
          input({
            isDisabled,
            isInvalid,
            isReadOnly: props.readOnly,
            size: finalSize,
            className: props.className,
          })
        }
      />
    </div>
  );
}
TextArea.displayName = 'TextArea';

// parent component
export function TextAreaField({
  ref,
  children,
  classNames,
  ...props
}: TextAreaFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, TextAreaContext);

  const { size, isDisabled, isInvalid, isReadOnly } = props;

  const context = useContext(TextAreaContext);
  const finalSize =
    size ??
    (isSlottedContextValue(context) ? undefined : context?.size) ??
    TextAreaStylesDefaults.size;
  const finalIsDisabled =
    isDisabled ??
    (isSlottedContextValue(context) ? undefined : context?.isDisabled) ??
    TextAreaStylesDefaults.isDisabled;
  const finalIsInvalid =
    isInvalid ??
    (isSlottedContextValue(context) ? undefined : context?.isInvalid) ??
    TextAreaStylesDefaults.isInvalid;
  const finalIsReadOnly =
    isReadOnly ??
    (isSlottedContextValue(context) ? undefined : context?.isReadOnly) ??
    TextAreaStylesDefaults.isReadOnly;

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
        {...props}
        ref={ref}
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
            {props.label}
          </Label>
        )}
        <TextArea
          className={classNames?.input}
          placeholder={props.placeholder}
          size={finalSize}
        />
        {shouldShowDescription && (
          <AriaText
            className={description({ isDisabled: finalIsDisabled })}
            slot='description'
          >
            {props.description}
          </AriaText>
        )}
        <FieldError className='fg-serious text-body-xs empty:hidden'>
          {props.errorMessage}
        </FieldError>
      </AriaTextField>
    </TextAreaContext.Provider>
  );
}
TextAreaField.displayName = 'TextArea.Field';
TextAreaField.Provider = TextAreaProvider;
TextAreaField.Input = TextArea;
