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
  Switch as AriaSwitch,
  composeRenderProps,
} from 'react-aria-components';
import { LabelStyles } from '../label/styles';
import { SwitchStyles } from './styles';
import type { SwitchProps } from './types';

const { group, control, label } = SwitchStyles();

export function Switch({ children, classNames, ...rest }: SwitchProps) {
  return (
    <AriaSwitch
      {...rest}
      className={composeRenderProps(
        classNames?.group,
        (className, { isDisabled, isSelected }) =>
          group({ className, isDisabled, isSelected }),
      )}
    >
      {composeRenderProps(children, (children, { isDisabled, isSelected }) => (
        <>
          <div
            className={control({
              className: classNames?.control,
              isDisabled,
              isSelected,
            })}
          />
          {children && (
            <span
              className={label({
                className: LabelStyles({
                  className: classNames?.label,
                  isDisabled,
                }),
              })}
            >
              {children}
            </span>
          )}
        </>
      ))}
    </AriaSwitch>
  );
}
Switch.displayName = 'Switch';
