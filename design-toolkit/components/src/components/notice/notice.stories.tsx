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

import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Notice } from './';

type NoticeWithArgs = ComponentProps<typeof Notice> & {
  showPrimary: boolean;
  showSecondary: boolean;
  showClose: boolean;
};

const meta: Meta<NoticeWithArgs> = {
  title: 'Components/Notice',
  component: Notice,
  args: {
    color: 'info',
    message:
      'This is a flexible snackbar that can be either a single or double line that wil wrap accordingly when it gets too long for a single line.',
    showPrimary: false,
    showSecondary: false,
    showClose: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
  },
};

export default meta;

const primary = {
  children: 'Ok',
};

const secondary = {
  children: 'Ok',
};

const onClose = () => {
  return;
};

export const Default: StoryObj<NoticeWithArgs> = {
  render: ({ showPrimary, showSecondary, showClose, ...rest }) => {
    return (
      <Notice
        {...rest}
        primary={showPrimary && primary}
        secondary={showSecondary && secondary}
        onClose={showClose && onClose}
      />
    );
  },
};
