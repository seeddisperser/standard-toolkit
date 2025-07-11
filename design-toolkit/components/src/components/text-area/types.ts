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

import type { RenderPropsClassName } from '@/lib/types';
import type { PropsWithChildren, RefAttributes } from 'react';
import type {
  TextAreaProps as AriaTextAreaProps,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import type { TextAreaStyleVariants } from './styles';

export type TextAreaProps = TextAreaStyleVariants &
  Omit<AriaTextAreaProps, 'size'> &
  RefAttributes<HTMLTextAreaElement> & {
    selectOnFocus?: boolean;
    className?: string;
  };

export type TextAreaFieldProps = Omit<AriaTextFieldProps, 'className'> &
  Omit<TextAreaStyleVariants, 'isDisabled' | 'isInvalid' | 'isReadOnly'> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      field?: RenderPropsClassName<AriaTextFieldProps>;
      input?: string;
      label?: string;
      description?: RenderPropsClassName<{ isDisabled?: boolean }>;
    };
    description?: string;
    errorMessage?: string;
    label?: string;
    placeholder?: string;
  };

export type TextAreaProviderProps = PropsWithChildren<
  Pick<
    TextAreaFieldProps,
    'classNames' | 'isDisabled' | 'isInvalid' | 'isReadOnly' | 'size'
  >
>;
