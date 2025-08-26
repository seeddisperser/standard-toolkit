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
import { useIsSSR } from '@react-aria/ssr';
import 'client-only';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { ButtonContext } from '../button';
import { DialogStyles } from './styles';
import type {
  DialogContextValue,
  DialogProps,
  DialogTriggerProps,
} from './types';

const { overlay, modal, dialog, title, content, footer } = DialogStyles();

const DialogContext = createContext<DialogContextValue>({
  size: 'small',
  isDismissable: false,
  isKeyboardDismissDisabled: false,
});

/**
 * Dialog - A modal dialog component for important content and interactions
 *
 * Provides accessible modal functionality with focus management, backdrop handling,
 * and keyboard navigation. Supports multiple sizes and customizable dismissal behavior.
 * Perfect for confirmations, forms, or any content requiring user focus.
 *
 * @example
 * // Basic dialog with trigger
 * <Dialog.Trigger>
 *   <Button>Open Dialog</Button>
 *   <Dialog>
 *     {({ close }) => (
 *       <>
 *         <Dialog.Title>Confirm Action</Dialog.Title>
 *         <p>Are you sure you want to continue?</p>
 *         <Dialog.Footer>
 *           <Dialog.Button onPress={close}>Confirm</Dialog.Button>
 *         </Dialog.Footer>
 *       </>
 *     )}
 *   </Dialog>
 * </Dialog.Trigger>
 */
const DialogTrigger = ({
  children,
  isOpen,
  onOpenChange,
  size = 'small',
  parentRef,
  isKeyboardDismissDisabled,
  isDismissable,
}: DialogTriggerProps) => {
  return (
    <AriaDialogTrigger>
      <DialogContext.Provider
        value={{
          size,
          parentRef,
          isKeyboardDismissDisabled,
          isDismissable,
          isOpen,
          onOpenChange,
        }}
      >
        {children}
      </DialogContext.Provider>
    </AriaDialogTrigger>
  );
};
DialogTrigger.displayName = 'Dialog.Trigger';

export const Dialog = ({ children, ref, classNames, ...rest }: DialogProps) => {
  const {
    size,
    parentRef,
    isDismissable,
    isKeyboardDismissDisabled,
    isOpen,
    onOpenChange,
  } = useContext(DialogContext);
  const isSSR = useIsSSR();
  const [portal, setPortal] = useState(isSSR ? null : document.body);

  useEffect(() => {
    const node = parentRef?.current;
    /* Ensure proper ssr hydration TODO */
    const port = isSSR ? null : document.createElement('div');

    if (node && port) {
      node.appendChild(port);
      setPortal(port);
    }

    return () => {
      port?.remove();

      setPortal(isSSR ? null : document.body);
    };
  }, [isSSR, parentRef]);

  return portal ? (
    <ModalOverlay
      {...rest}
      className={overlay()}
      data-size={size}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isDismissable={isDismissable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      UNSTABLE_portalContainer={portal}
    >
      <Modal ref={ref} className={modal({ className: classNames?.modal })}>
        <AriaDialog className={dialog({ className: classNames?.dialog })}>
          {children}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  ) : null;
};
Dialog.displayName = 'Dialog';

const DialogContent = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={content({ className })}>{children}</div>;
};
DialogContent.displayName = 'Dialog.Content';

const DialogTitle = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <Heading slot='title' className={title({ className })}>
      {children}
    </Heading>
  );
};
DialogTitle.displayName = 'Dialog.Title';

const DialogFooter = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { size } = useContext(DialogContext);
  return (
    <footer className={footer({ className })}>
      <ButtonContext.Provider
        value={{
          size,
        }}
      >
        {children}
      </ButtonContext.Provider>
    </footer>
  );
};

DialogFooter.displayName = 'Dialog.Footer';

Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Trigger = DialogTrigger;
