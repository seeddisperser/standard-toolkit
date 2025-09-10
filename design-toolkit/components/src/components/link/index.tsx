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
import { useCallback, useState } from 'react';
import {
  Link as AriaLink,
  composeRenderProps,
  LinkContext,
  type PressEvent,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { LinkStyles } from './styles';
import type { ProviderProps } from '@/lib/types';
import type { LinkProps } from './types';

export function Link(props: LinkProps) {
  const [
    {
      allowsVisited = false,
      isVisited = false,
      children,
      onPress,
      className,
      ...rest
    },
  ] = useContextProps(props, null, LinkContext);
  const [visited, setVisited] = useState(isVisited);

  const handleOnPress = useCallback(
    (e: PressEvent) => {
      if (allowsVisited) {
        setVisited(true);
      }
      onPress?.(e);
    },
    [allowsVisited, onPress],
  );

  return (
    <AriaLink
      {...rest}
      onPress={handleOnPress}
      data-visited={visited || null}
      className={composeRenderProps(className, (className) =>
        LinkStyles({ className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <Icon.Provider size='xsmall'>{children}</Icon.Provider>
      ))}
    </AriaLink>
  );
}
Link.displayName = 'Link';

function LinkProvider({ children, ...props }: ProviderProps<LinkProps>) {
  return <LinkContext.Provider value={props}>{children}</LinkContext.Provider>;
}
LinkProvider.displayName = 'Link.Provider';

Link.Provider = LinkProvider;
