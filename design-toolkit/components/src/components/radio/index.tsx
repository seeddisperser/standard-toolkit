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
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
} from 'react-aria-components';
import { Label } from '../label';
import { RadioStyles } from './styles';
import type { RadioGroupProps, RadioProps } from './types';

const { group, radio, control, label } = RadioStyles();

function RadioGroup({
  children,
  classNames,
  label,
  isDisabled,
  isRequired,
  ...rest
}: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...rest}
      className={composeRenderProps(classNames?.group, (className) =>
        group({ className }),
      )}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      {composeRenderProps(children, (children) => (
        <>
          {label && (
            <Label
              className={classNames?.label}
              isDisabled={isDisabled}
              isRequired={isRequired}
            >
              {label}
            </Label>
          )}
          {children}
        </>
      ))}
    </AriaRadioGroup>
  );
}
RadioGroup.displayName = 'Radio.Group';

export function Radio({ classNames, children, ...rest }: RadioProps) {
  return (
    <AriaRadio
      {...rest}
      className={composeRenderProps(classNames?.radio, (className) =>
        radio({ className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className={control({ className: classNames?.control })} />
          <span className={label({ className: classNames?.label })}>
            {children}
          </span>
        </>
      ))}
    </AriaRadio>
  );
}
Radio.displayName = 'Radio';
Radio.Group = RadioGroup;
